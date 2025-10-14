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
} from 'ums-lib';
import { PersonaLoader } from '../loaders/persona-loader.js';
import { ConfigManager } from '../loaders/config-loader.js';
import { ModuleDiscovery } from '../discovery/module-discovery.js';
import { StandardLibrary } from '../discovery/standard-library.js';
import type { BuildOptions, BuildResult } from '../types/index.js';

/**
 * BuildOrchestrator - Orchestrates the complete build workflow
 */
export class BuildOrchestrator {
  private personaLoader: PersonaLoader;
  private configManager: ConfigManager;
  private moduleDiscovery: ModuleDiscovery;
  private standardLibrary: StandardLibrary;

  constructor() {
    this.personaLoader = new PersonaLoader();
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

    // Step 3: Discover modules
    const modules: Module[] = [];

    // Load standard library if enabled
    if (options.includeStandard !== false) {
      const standardModules = await this.standardLibrary.discoverStandard();
      modules.push(...standardModules);
    }

    // Load local modules from config
    if (config.localModulePaths.length > 0) {
      const localModules = await this.moduleDiscovery.discover(config);
      modules.push(...localModules);
    }

    // Step 4: Build module registry
    // Priority: BuildOptions > config file > default 'error'
    const conflictStrategy =
      options.conflictStrategy ?? config.conflictStrategy ?? 'error';
    const registry = new ModuleRegistry(conflictStrategy);

    for (const module of modules) {
      try {
        // Determine if this is a standard or local module
        const isStandard = this.standardLibrary.isStandardModule(module.id);
        registry.add(module, {
          type: isStandard ? 'standard' : 'local',
          path: isStandard
            ? this.standardLibrary.getStandardLibraryPath()
            : 'local',
        });
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

    // Step 7: Generate build report
    const moduleFileContents = new Map<string, string>();
    const buildReport = generateBuildReport(
      persona,
      resolutionResult.modules,
      moduleFileContents
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
