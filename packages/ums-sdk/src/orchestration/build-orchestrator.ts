/**
 * Build Orchestrator - Coordinates the build workflow
 * Part of the UMS SDK v1.0
 */

import {
  ModuleRegistry,
  resolvePersonaModules,
  renderMarkdown,
  generateBuildReport,
  type Module,
  type ModuleSource,
  type ModuleReportMetadata,
} from 'ums-lib';
import { PersonaLoader } from '../loaders/persona-loader.js';
import { ModuleLoader } from '../loaders/module-loader.js';
import { ConfigManager } from '../loaders/config-loader.js';
import { ModuleDiscovery } from '../discovery/module-discovery.js';
import { StandardLibrary } from '../discovery/standard-library.js';
import { generateDeclarations } from '../generation/declaration-generator.js';
import type {
  BuildOptions,
  BuildResult,
  GeneratedDeclarationResult,
} from '../types/index.js';

// Constants for source types and path handling
const SOURCE_TYPE_STANDARD = 'standard' as const;
const SOURCE_TYPE_LOCAL = 'local' as const;
const MODULES_PATH_SEPARATOR = '/modules/';
const FALLBACK_LOCAL_PATH = 'local';
const DEFAULT_CONFLICT_STRATEGY = 'error';

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
   * Discover modules from standard library and local paths
   * @param config - Configuration with local module paths
   * @param options - Build options for controlling standard library inclusion
   * @returns Discovered modules with their file paths and sources
   */
  private async discoverModules(
    config: Awaited<ReturnType<ConfigManager['load']>>,
    options: BuildOptions
  ): Promise<{
    modules: Module[];
    moduleFilePaths: Map<string, string>;
    moduleSources: Map<string, ModuleSource>;
  }> {
    const modules: Module[] = [];
    const moduleFilePaths = new Map<string, string>();
    const moduleSources = new Map<string, ModuleSource>();

    // Load standard library if enabled
    if (options.includeStandard !== false) {
      const standardDiscovered =
        await this.standardLibrary.discoverStandardWithFilePaths();
      for (const { module, filePath } of standardDiscovered) {
        modules.push(module);
        moduleFilePaths.set(module.id, filePath);
        moduleSources.set(module.id, {
          type: SOURCE_TYPE_STANDARD,
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
        const localPath =
          filePath.split(MODULES_PATH_SEPARATOR)[0] || FALLBACK_LOCAL_PATH;
        moduleSources.set(module.id, {
          type: SOURCE_TYPE_LOCAL,
          path: localPath,
        });
      }
    }

    return { modules, moduleFilePaths, moduleSources };
  }

  /**
   * Build module registry with conflict handling
   * @param modules - Array of modules to register
   * @param moduleSources - Map of module IDs to their sources
   * @param conflictStrategy - Strategy for handling conflicts
   * @param warnings - Array to collect warnings
   * @returns Module registry
   */
  private buildRegistry(
    modules: Module[],
    moduleSources: Map<string, ModuleSource>,
    conflictStrategy: 'error' | 'warn' | 'replace',
    warnings: string[]
  ): ModuleRegistry {
    const registry = new ModuleRegistry(conflictStrategy);

    for (const module of modules) {
      try {
        const source = moduleSources.get(module.id) ?? {
          type: SOURCE_TYPE_LOCAL,
          path: FALLBACK_LOCAL_PATH,
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

    return registry;
  }

  /**
   * Load raw file contents for modules (for digest computation)
   * @param modules - Array of modules to load content for
   * @param moduleFilePaths - Map of module IDs to file paths
   * @param warnings - Array to collect warnings
   * @returns Map of module IDs to file contents
   */
  private async loadModuleContents(
    modules: Module[],
    moduleFilePaths: Map<string, string>,
    warnings: string[]
  ): Promise<Map<string, string>> {
    const moduleFileContents = new Map<string, string>();

    for (const module of modules) {
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

    return moduleFileContents;
  }

  /**
   * Build module metadata for build report (sources)
   * @param modules - Array of resolved modules
   * @param moduleSources - Map of module IDs to their sources
   * @returns Map of module IDs to report metadata
   */
  private buildModuleMetadata(
    modules: Module[],
    moduleSources: Map<string, ModuleSource>
  ): Map<string, ModuleReportMetadata> {
    const moduleMetadata = new Map<string, ModuleReportMetadata>();

    for (const module of modules) {
      const source = moduleSources.get(module.id) ?? {
        type: SOURCE_TYPE_LOCAL,
        path: FALLBACK_LOCAL_PATH,
      };

      moduleMetadata.set(module.id, { source });
    }

    return moduleMetadata;
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
    const { modules, moduleFilePaths, moduleSources } =
      await this.discoverModules(config, options);

    // Step 4: Build module registry (for conflict handling)
    // Priority: BuildOptions > config file > default 'error'
    const conflictStrategy =
      options.conflictStrategy ??
      config.conflictStrategy ??
      DEFAULT_CONFLICT_STRATEGY;
    this.buildRegistry(modules, moduleSources, conflictStrategy, warnings);

    // Step 5: Resolve persona modules
    const resolutionResult = resolvePersonaModules(persona, modules);

    // Collect resolution warnings
    warnings.push(...resolutionResult.warnings);

    // Step 6: Render to Markdown
    const markdown = renderMarkdown(persona, resolutionResult.modules);

    // Step 7: Load raw file contents for resolved modules (for digest computation)
    const moduleFileContents = await this.loadModuleContents(
      resolutionResult.modules,
      moduleFilePaths,
      warnings
    );

    // Step 8: Build module metadata for report (sources)
    const moduleMetadata = this.buildModuleMetadata(
      resolutionResult.modules,
      moduleSources
    );

    // Step 9: Generate build report with digests and metadata
    const buildReport = generateBuildReport(
      persona,
      resolutionResult.modules,
      moduleFileContents,
      moduleMetadata
    );

    // Step 10: Generate declarations if requested (v2.2)
    let declarations: GeneratedDeclarationResult[] | undefined;
    if (options.emitDeclarations) {
      const modulesWithPaths = resolutionResult.modules.map(module => ({
        module,
        sourcePath: moduleFilePaths.get(module.id) ?? `${module.id}.module.ts`,
      }));

      declarations = generateDeclarations(modulesWithPaths, {
        includeJSDoc: true,
      });
    }

    return {
      markdown,
      persona,
      modules: resolutionResult.modules,
      buildReport,
      warnings,
      ...(declarations && { declarations }),
    };
  }
}
