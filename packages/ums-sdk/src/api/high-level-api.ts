/**
 * High-Level API - Convenience functions for common workflows
 * Part of the UMS SDK v1.0
 */

import { validateModule, validatePersona, type Module } from 'ums-lib';
import { BuildOrchestrator } from '../orchestration/build-orchestrator.js';
import { ConfigManager } from '../loaders/config-loader.js';
import { ModuleDiscovery } from '../discovery/module-discovery.js';
import { StandardLibrary } from '../discovery/standard-library.js';
import { PersonaLoader } from '../loaders/persona-loader.js';
import { glob } from 'glob';
import type {
  BuildOptions,
  BuildResult,
  ValidateOptions,
  ValidationReport,
  ValidationError,
  ListOptions,
  ModuleInfo,
  SDKValidationWarning,
} from '../types/index.js';

/**
 * Build a persona - complete workflow
 * @param personaPath - Path to persona file
 * @param options - Build options
 * @returns Build result with rendered markdown
 */
export async function buildPersona(
  personaPath: string,
  options?: BuildOptions
): Promise<BuildResult> {
  const orchestrator = new BuildOrchestrator();
  return orchestrator.build(personaPath, options);
}

/**
 * Validate all discovered modules and personas
 * @param options - Validation options
 * @returns Validation report
 */
export async function validateAll(
  options: ValidateOptions = {}
): Promise<ValidationReport> {
  const configManager = new ConfigManager();
  const moduleDiscovery = new ModuleDiscovery();
  const standardLibrary = new StandardLibrary();

  // Load configuration
  const config = await configManager.load(options.configPath);

  // Discover modules
  const modules: Module[] = [];

  if (options.includeStandard !== false) {
    const standardModules = await standardLibrary.discoverStandard();
    modules.push(...standardModules);
  }

  if (config.localModulePaths.length > 0) {
    const localModules = await moduleDiscovery.discover(config);
    modules.push(...localModules);
  }

  // Validate each module
  const errors = new Map<string, ValidationError[]>();
  const warnings = new Map<string, SDKValidationWarning[]>();
  let validModules = 0;

  for (const module of modules) {
    const validation = validateModule(module);
    if (validation.valid) {
      validModules++;
    } else {
      errors.set(module.id, validation.errors);
    }
  }

  // Validate personas if requested
  let totalPersonas = 0;
  let validPersonas = 0;

  if (options.includePersonas !== false) {
    const personaLoader = new PersonaLoader();

    // Find all persona files
    const personaPaths = config.localModulePaths.map(entry => entry.path);
    const personaFiles: string[] = [];

    for (const path of personaPaths) {
      const files = await glob(`${path}/**/*.persona.ts`, { nodir: true });
      personaFiles.push(...files);
    }

    // Validate each persona
    for (const filePath of personaFiles) {
      totalPersonas++;
      try {
        const persona = await personaLoader.loadPersona(filePath);
        const validation = validatePersona(persona);

        if (validation.valid) {
          validPersonas++;
        } else {
          errors.set(filePath, validation.errors);
        }
      } catch (error) {
        errors.set(filePath, [
          {
            path: filePath,
            message: error instanceof Error ? error.message : String(error),
          },
        ]);
      }
    }
  }

  const report: ValidationReport = {
    totalModules: modules.length,
    validModules,
    errors,
    warnings,
    totalPersonas:
      options.includePersonas !== false ? totalPersonas : undefined,
    validPersonas:
      options.includePersonas !== false ? validPersonas : undefined,
  };

  return report;
}

/**
 * List all available modules with metadata
 * @param options - List options
 * @returns Array of module metadata
 */
export async function listModules(
  options: ListOptions = {}
): Promise<ModuleInfo[]> {
  const configManager = new ConfigManager();
  const moduleDiscovery = new ModuleDiscovery();
  const standardLibrary = new StandardLibrary();

  // Load configuration
  const config = await configManager.load(options.configPath);

  // Discover modules
  const modules: Module[] = [];

  if (options.includeStandard !== false) {
    const standardModules = await standardLibrary.discoverStandard();
    modules.push(...standardModules);
  }

  if (config.localModulePaths.length > 0) {
    const localModules = await moduleDiscovery.discover(config);
    modules.push(...localModules);
  }

  // Convert to ModuleInfo and apply filters
  let moduleInfos: ModuleInfo[] = modules.map(module => {
    const isStandard = standardLibrary.isStandardModule(module.id);
    return {
      id: module.id,
      name: module.metadata.name,
      description: module.metadata.description,
      version: module.version,
      capabilities: module.capabilities,
      source: isStandard ? ('standard' as const) : ('local' as const),
      filePath: isStandard ? undefined : module.id, // Placeholder
    };
  });

  // Apply tier filter
  if (options.tier) {
    moduleInfos = moduleInfos.filter(info =>
      info.id.startsWith(`${options.tier}/`)
    );
  }

  // Apply capability filter
  if (options.capability) {
    const capability = options.capability;
    moduleInfos = moduleInfos.filter(info =>
      info.capabilities.includes(capability)
    );
  }

  return moduleInfos;
}
