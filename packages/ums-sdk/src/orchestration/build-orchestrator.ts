/**
 * Build Orchestrator - Coordinates the build workflow
 * Part of the UMS SDK v1.0
 */

import { createHash } from 'node:crypto';
import {
  ModuleRegistry,
  resolvePersonaModules,
  renderMarkdown,
  generateBuildReport,
  type Module,
  type ModuleSource,
  type ModuleReportMetadata,
  type CompositionEvent,
} from 'ums-lib';
import { PersonaLoader } from '../loaders/persona-loader.js';
import { ModuleLoader } from '../loaders/module-loader.js';
import { ConfigManager } from '../loaders/config-loader.js';
import { ModuleDiscovery } from '../discovery/module-discovery.js';
import { StandardLibrary } from '../discovery/standard-library.js';
import type { BuildOptions, BuildResult } from '../types/index.js';

/**
 * BuildOrchestrator - Orchestrates the complete build workflow
 */
export class BuildOrchestrator {
  private personaLoader: PersonaLoader;
  private moduleLoader: ModuleLoader;
  private configManager: ConfigManager;
  private moduleDiscovery: ModuleDiscovery;
  private standardLibrary: StandardLibrary;

  constructor() {
    this.personaLoader = new PersonaLoader();
    this.moduleLoader = new ModuleLoader();
    this.configManager = new ConfigManager();
    this.moduleDiscovery = new ModuleDiscovery();
    this.standardLibrary = new StandardLibrary();
  }

  /**
   * Execute complete build workflow
   * @param personaPath - Path to persona file
   * @param options - Build options
   * @returns Build result with rendered markdown
   */
  async build(
    personaPath: string,
    options: BuildOptions = {}
  ): Promise<BuildResult> {
    const warnings: string[] = [];

    // Step 1: Load persona
    const persona = await this.personaLoader.loadPersona(personaPath);

    // Step 2: Load configuration
    const config = await this.configManager.load(options.configPath);

    // Step 3: Discover modules with file paths (for digest computation)
    const modules: Module[] = [];
    const moduleFilePaths = new Map<string, string>(); // module ID -> file path
    const moduleSources = new Map<string, ModuleSource>(); // module ID -> source

    // Load standard library if enabled
    if (options.includeStandard !== false) {
      const standardDiscovered =
        await this.standardLibrary.discoverStandardWithFilePaths();
      for (const { module, filePath } of standardDiscovered) {
        modules.push(module);
        moduleFilePaths.set(module.id, filePath);
        moduleSources.set(module.id, {
          type: 'standard',
          path: this.standardLibrary.getStandardLibraryPath(),
        });
      }
    }

    // Load local modules from config
    if (config.localModulePaths.length > 0) {
      const localDiscovered =
        await this.moduleDiscovery.discoverWithFilePaths(config);
      for (const { module, filePath } of localDiscovered) {
        modules.push(module);
        moduleFilePaths.set(module.id, filePath);
        // Get the local path from the file path
        const localPath = filePath.split('/modules/')[0] || 'local';
        moduleSources.set(module.id, {
          type: 'local',
          path: localPath,
        });
      }
    }

    // Step 4: Build module registry
    // Priority: BuildOptions > config file > default 'error'
    const conflictStrategy =
      options.conflictStrategy ?? config.conflictStrategy ?? 'error';
    const registry = new ModuleRegistry(conflictStrategy);

    for (const module of modules) {
      try {
        const source = moduleSources.get(module.id) ?? {
          type: 'local' as const,
          path: 'local',
        };
        registry.add(module, source);
      } catch (error) {
        // If conflict strategy is 'warn', collect warnings
        if (conflictStrategy === 'warn' && error instanceof Error) {
          warnings.push(error.message);
        } else {
          throw error;
        }
      }
    }

    // Step 5: Resolve persona modules
    const resolutionResult = resolvePersonaModules(persona, modules);

    // Collect resolution warnings
    warnings.push(...resolutionResult.warnings);

    // Step 6: Render to Markdown
    const markdown = renderMarkdown(persona, resolutionResult.modules);

    // Step 7: Load raw file contents for resolved modules (for digest computation)
    const moduleFileContents = new Map<string, string>();
    for (const module of resolutionResult.modules) {
      const filePath = moduleFilePaths.get(module.id);
      if (filePath) {
        try {
          const content = await this.moduleLoader.loadRawContent(filePath);
          moduleFileContents.set(module.id, content);
        } catch (error) {
          // Non-fatal: digest will be empty for this module
          warnings.push(
            `Failed to load content for digest: ${module.id} - ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }
    }

    // Step 8: Build module metadata for report (sources and composition history)
    const moduleMetadata = new Map<string, ModuleReportMetadata>();
    for (const module of resolutionResult.modules) {
      const source = moduleSources.get(module.id) ?? {
        type: 'local' as const,
        path: 'local',
      };

      // Check for composition history (conflicts that were resolved)
      const conflicts = registry.getConflicts(module.id);
      let composedFrom: CompositionEvent[] | undefined;

      if (conflicts && conflicts.length > 1) {
        // Build composition history from conflict entries
        composedFrom = conflicts.map((entry, index) => {
          const entryContent = moduleFileContents.get(entry.module.id) ?? '';
          const entryDigest = entryContent
            ? `sha256:${createHash('sha256').update(entryContent).digest('hex')}`
            : '';

          return {
            id: entry.module.id,
            version: entry.module.version,
            source:
              entry.source.type === 'standard'
                ? 'Standard Library'
                : entry.source.path,
            digest: entryDigest,
            // First entry is 'base', subsequent entries are 'replace'
            strategy: index === 0 ? ('base' as const) : ('replace' as const),
          };
        });
      }

      const metadata: ModuleReportMetadata = { source };
      if (composedFrom) {
        metadata.composedFrom = composedFrom;
      }
      moduleMetadata.set(module.id, metadata);
    }

    // Step 9: Generate build report with digests and metadata
    const buildReport = generateBuildReport(
      persona,
      resolutionResult.modules,
      moduleFileContents,
      moduleMetadata
    );

    return {
      markdown,
      persona,
      modules: resolutionResult.modules,
      buildReport,
      warnings,
    };
  }
}
