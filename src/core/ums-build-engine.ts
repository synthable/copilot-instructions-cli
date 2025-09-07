/**
 * UMS v1.0 Build Engine (M3)
 * Implements Markdown rendering according to UMS v1.0 specification Section 7.1
 */

import { join } from 'path';
import { glob } from 'glob';
import { loadModule } from './ums-module-loader.js';
import { loadPersona } from './ums-persona-loader.js';
import pkg from '../../package.json' with { type: 'json' };
import {
  MODULES_ROOT,
  MODULE_FILE_EXTENSION,
  RENDER_ORDER,
  type DirectiveKey,
} from '../constants.js';
import type {
  UMSModule,
  UMSPersona,
  DataDirective,
  ExampleDirective,
  BuildReport,
  BuildReportGroup,
  BuildReportModule,
} from '../types/ums-v1.js';

export interface BuildOptions {
  /** Path to persona file or stdin indicator */
  personaSource: string;
  /** Persona content when reading from stdin */
  personaContent?: string;
  /** Output file path or stdout indicator */
  outputTarget: string;
  /** Enable verbose output */
  verbose?: boolean;
}

export interface BuildResult {
  /** Generated Markdown content */
  markdown: string;
  /** Resolved modules used in build */
  modules: UMSModule[];
  /** Persona configuration used */
  persona: UMSPersona;
  /** Build warnings */
  warnings: string[];
  /** Build report for JSON output */
  buildReport: BuildReport;
}

/**
 * Module registry for resolving module IDs to file paths
 */
export class ModuleRegistry {
  private moduleMap = new Map<string, string>();

  /**
   * Discovers and indexes all modules in the instructions-modules directory
   */
  async discover(): Promise<void> {
    try {
      // Find all .module.yml files in instructions-modules
      const pattern = join(MODULES_ROOT, '**', `*${MODULE_FILE_EXTENSION}`);
      const files = await glob(pattern, { nodir: true });

      for (const file of files) {
        try {
          // Load module to get its ID
          const module = await loadModule(file);
          this.moduleMap.set(module.id, file);
        } catch (error) {
          // Skip invalid modules during discovery
          const message =
            error instanceof Error ? error.message : String(error);
          console.warn(`Warning: Skipping invalid module ${file}: ${message}`);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to discover modules: ${message}`);
    }
  }

  /**
   * Resolves a module ID to its file path
   */
  resolve(moduleId: string): string | undefined {
    return this.moduleMap.get(moduleId);
  }

  /**
   * Gets all discovered module IDs
   */
  getAllModuleIds(): string[] {
    return Array.from(this.moduleMap.keys());
  }

  /**
   * Gets the number of discovered modules
   */
  size(): number {
    return this.moduleMap.size;
  }
}

/**
 * Main build engine that orchestrates the build process
 */
export class BuildEngine {
  private registry = new ModuleRegistry();

  /**
   * Builds a persona into Markdown output
   */
  async build(options: BuildOptions): Promise<BuildResult> {
    const warnings: string[] = [];

    // Discover modules
    await this.registry.discover();

    if (options.verbose) {
      console.log(`[INFO] build: Discovered ${this.registry.size()} modules`);
    }

    // Load persona
    const persona = await this.loadPersonaFromOptions(options);

    if (options.verbose) {
      console.log(`[INFO] build: Loaded persona '${persona.name}'`);
    }

    // Resolve and load modules
    const modules: UMSModule[] = [];
    const missingModules: string[] = [];

    for (const group of persona.moduleGroups) {
      for (const moduleId of group.modules) {
        const filePath = this.registry.resolve(moduleId);
        if (!filePath) {
          missingModules.push(moduleId);
          continue;
        }

        try {
          const module = await loadModule(filePath);
          modules.push(module);

          // Check for deprecation warnings
          if (module.meta.deprecated) {
            const warning = module.meta.replacedBy
              ? `Module '${moduleId}' is deprecated and has been replaced by '${module.meta.replacedBy}'. Please update your persona file.`
              : `Module '${moduleId}' is deprecated. This module may be removed in a future version.`;
            warnings.push(warning);
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          throw new Error(
            `Failed to load module '${moduleId}' from ${filePath}: ${message}`
          );
        }
      }
    }

    // Check for missing modules
    if (missingModules.length > 0) {
      throw new Error(`Missing modules: ${missingModules.join(', ')}`);
    }

    if (options.verbose) {
      console.log(`[INFO] build: Loaded ${modules.length} modules`);
    }

    // Generate Markdown
    const markdown = this.renderMarkdown(persona, modules);

    // Generate Build Report
    const buildReport = this.generateBuildReport(persona, modules, options);

    return {
      markdown,
      modules,
      persona,
      warnings,
      buildReport,
    };
  }

  /**
   * Generates Build Report according to M4 requirements
   */
  private generateBuildReport(
    persona: UMSPersona,
    modules: UMSModule[],
    _options: BuildOptions
  ): BuildReport {
    // Create build report groups following M4 structure
    const groups: BuildReportGroup[] = [];

    for (const group of persona.moduleGroups) {
      const reportModules: BuildReportModule[] = [];

      for (const moduleId of group.modules) {
        const module = modules.find(m => m.id === moduleId);
        if (module) {
          const reportModule: BuildReportModule = {
            id: module.id,
            name: module.meta.name,
            filePath: module.filePath,
            deprecated: module.meta.deprecated ?? false,
          };

          if (module.meta.replacedBy) {
            reportModule.replacedBy = module.meta.replacedBy;
          }

          reportModules.push(reportModule);
        }
      }

      groups.push({
        groupName: group.groupName,
        modules: reportModules,
      });
    }

    const personaInfo: BuildReport['persona'] = {
      name: persona.name,
      description: persona.description,
      semantic: persona.semantic,
      groupCount: persona.moduleGroups.length,
    };

    if (persona.role) {
      personaInfo.role = persona.role;
    }

    if (persona.attribution !== undefined) {
      personaInfo.attribution = persona.attribution;
    }

    return {
      tool: {
        name: pkg.name,
        version: pkg.version,
      },
      timestamp: new Date().toISOString(),
      persona: personaInfo,
      groups,
      rendering: {
        directiveOrder: RENDER_ORDER,
        separators: '---',
        attributionEnabled: persona.attribution ?? false,
      },
      discovery: {
        modulesRoot: MODULES_ROOT,
        totalModulesResolved: modules.length,
      },
    };
  }

  /**
   * Loads persona from file or stdin based on options
   */
  private async loadPersonaFromOptions(
    options: BuildOptions
  ): Promise<UMSPersona> {
    if (options.personaSource === 'stdin') {
      if (!options.personaContent) {
        throw new Error(
          'Persona content must be provided when reading from stdin'
        );
      }

      const { parse } = await import('yaml');
      const parsed: unknown = parse(options.personaContent);

      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid YAML: expected object at root');
      }

      const { validatePersona } = await import('./ums-persona-loader.js');
      const validation = validatePersona(parsed);

      if (!validation.valid) {
        const errorMessages = validation.errors.map(e => e.message).join('\n');
        throw new Error(`Persona validation failed:\n${errorMessages}`);
      }

      return parsed as UMSPersona;
    } else {
      return loadPersona(options.personaSource);
    }
  }

  /**
   * Renders UMS modules into Markdown according to v1.0 specification
   */
  public renderMarkdown(persona: UMSPersona, modules: UMSModule[]): string {
    const sections: string[] = [];

    // Render persona role if present (Section 7.1)
    if (persona.role) {
      sections.push('## Role\n');
      sections.push(`${persona.role}\n`);
    }

    // Group modules by their moduleGroups for proper ordering
    let moduleIndex = 0;

    for (const group of persona.moduleGroups) {
      // Optional group heading (non-normative)
      if (group.groupName) {
        sections.push(`# ${group.groupName}\n`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _ of group.modules) {
        const module = modules[moduleIndex++];
        if (!module) continue;

        // Render module content
        sections.push(this.renderModule(module));

        // Add attribution if enabled
        if (persona.attribution) {
          sections.push(`[Attribution: ${module.id}]\n`);
        }

        // Add separator between modules
        sections.push('---\n');
      }
    }

    // Remove trailing separator
    if (sections.length > 0 && sections[sections.length - 1] === '---\n') {
      sections.pop();
    }

    return sections.join('\n').trim() + '\n';
  }

  /**
   * Renders a single module to Markdown
   */
  private renderModule(module: UMSModule): string {
    const sections: string[] = [];

    // Render directives in stable order (Section 7.1)
    for (const directive of RENDER_ORDER) {
      if (directive in module.body) {
        sections.push(this.renderDirective(directive, module.body[directive]));
      }
    }

    return sections.join('\n');
  }

  /**
   * Renders a single directive to Markdown
   */
  private renderDirective(directive: DirectiveKey, content: unknown): string {
    switch (directive) {
      case 'goal':
        return this.renderGoal(content as string);
      case 'principles':
        return this.renderPrinciples(content as string[]);
      case 'constraints':
        return this.renderConstraints(content as string[]);
      case 'process':
        return this.renderProcess(content as string[]);
      case 'criteria':
        return this.renderCriteria(content as string[]);
      case 'data':
        return this.renderData(content as DataDirective);
      case 'examples':
        return this.renderExamples(content as ExampleDirective[]);
      default:
        return '';
    }
  }

  /**
   * Renders goal directive as paragraph
   */
  private renderGoal(content: string): string {
    return `## Goal\n\n${content}\n`;
  }

  /**
   * Renders principles directive as bullet list
   */
  private renderPrinciples(content: string[]): string {
    const items = content.map(item => `- ${item}`).join('\n');
    return `## Principles\n\n${items}\n`;
  }

  /**
   * Renders constraints directive as bullet list
   */
  private renderConstraints(content: string[]): string {
    const items = content.map(item => `- ${item}`).join('\n');
    return `## Constraints\n\n${items}\n`;
  }

  /**
   * Renders process directive as ordered list
   */
  private renderProcess(content: string[]): string {
    const items = content
      .map((item, index) => `${index + 1}. ${item}`)
      .join('\n');
    return `## Process\n\n${items}\n`;
  }

  /**
   * Renders criteria directive as task list
   */
  private renderCriteria(content: string[]): string {
    const items = content.map(item => `- [ ] ${item}`).join('\n');
    return `## Criteria\n\n${items}\n`;
  }

  /**
   * Renders data directive as fenced code block
   */
  private renderData(content: DataDirective): string {
    // Infer language from mediaType
    const language = this.inferLanguageFromMediaType(content.mediaType);
    const codeBlock = language
      ? `\`\`\`${language}\n${content.value}\n\`\`\``
      : `\`\`\`\n${content.value}\n\`\`\``;
    return `## Data\n\n${codeBlock}\n`;
  }

  /**
   * Renders examples directive with subheadings
   */
  private renderExamples(content: ExampleDirective[]): string {
    const sections = ['## Examples\n'];

    for (const example of content) {
      sections.push(`### ${example.title}\n`);
      sections.push(`${example.rationale}\n`);

      const language = example.language ?? '';
      const codeBlock = language
        ? `\`\`\`${language}\n${example.snippet}\n\`\`\``
        : `\`\`\`\n${example.snippet}\n\`\`\``;
      sections.push(`${codeBlock}\n`);
    }

    return sections.join('\n');
  }

  /**
   * Infers code block language from IANA media type
   */
  public inferLanguageFromMediaType(mediaType: string): string {
    const mediaTypeMap: Record<string, string> = {
      'application/json': 'json',
      'application/javascript': 'javascript',
      'application/xml': 'xml',
      'text/html': 'html',
      'text/css': 'css',
      'text/javascript': 'javascript',
      'text/x-python': 'python',
      'text/x-java': 'java',
      'text/x-csharp': 'csharp',
      'text/x-go': 'go',
      'text/x-rust': 'rust',
      'text/x-typescript': 'typescript',
      'text/x-yaml': 'yaml',
      'text/x-toml': 'toml',
      'text/markdown': 'markdown',
      'text/x-sh': 'bash',
      'text/x-shellscript': 'bash',
    };

    return mediaTypeMap[mediaType.toLowerCase()] || '';
  }
}
