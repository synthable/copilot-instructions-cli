/**
 * High-Level API - Convenience functions for common workflows
 * Part of the UMS SDK v1.0
 */

import {
  validateModule,
  validatePersona,
  type Module,
  type ValidationResult,
} from 'ums-lib';
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
 * Helper function to collect validation results (errors and warnings)
 * @param validation - The validation result from ums-lib
 * @param id - The module or file identifier
 * @param errors - Map to collect errors
 * @param warnings - Map to collect warnings
 */
function collectValidationResults(
  validation: ValidationResult,
  id: string,
  errors: Map<string, ValidationError[]>,
  warnings: Map<string, SDKValidationWarning[]>
): void {
  if (!validation.valid) {
    errors.set(id, validation.errors);
  }

  if (validation.warnings.length > 0) {
    const sdkWarnings: SDKValidationWarning[] = validation.warnings.map(w => ({
      code: 'VALIDATION_WARNING',
      message: w.message,
      path: w.path,
    }));
    warnings.set(id, sdkWarnings);
  }
}

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
    }
    collectValidationResults(validation, module.id, errors, warnings);
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
        }
        collectValidationResults(validation, filePath, errors, warnings);
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

  // Discover modules, tracking file paths separately
  const modules: Module[] = [];
  const filePathMap = new Map<string, string>();

  if (options.includeStandard !== false) {
    modules.push(...(await standardLibrary.discoverStandard()));
  }

  if (config.localModulePaths.length > 0) {
    try {
      const discovered = await moduleDiscovery.discoverWithFilePaths(config);
      for (const d of discovered) {
        modules.push(d.module);
        filePathMap.set(d.module.id, d.filePath);
      }
    } catch (error) {
      // Log discovery error but don't fail the entire operation
      console.warn(
        `Failed to discover local modules: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // Apply capability filter
  let filteredModules = modules;
  if (options.capability) {
    const capability = options.capability;
    filteredModules = filteredModules.filter(module =>
      module.capabilities.includes(capability)
    );
  }

  // Apply tag filter
  if (options.tag) {
    const tag = options.tag;
    filteredModules = filteredModules.filter(module =>
      module.metadata.tags?.includes(tag)
    );
  }

  // Convert to ModuleInfo
  const moduleInfos: ModuleInfo[] = filteredModules.map(module => {
    const isStandard = standardLibrary.isStandardModule(module.id);
    return {
      id: module.id,
      name: module.metadata.name,
      description: module.metadata.description,
      version: module.version,
      capabilities: module.capabilities,
      source: isStandard ? ('standard' as const) : ('local' as const),
      filePath: filePathMap.get(module.id),
    };
  });

  return moduleInfos;
}
