/**
 * CLI Module Discovery Utilities
 * Handles module discovery and conflict resolution for CLI operations
 */

import type { UMSModule, ModuleConfig } from 'ums-lib';
import { parseModule } from 'ums-lib';
import { discoverModuleFiles, readModuleFile } from './file-operations.js';
import {
  loadModuleConfig,
  getConfiguredModulePaths,
  getConflictStrategy,
} from './config-loader.js';

/**
 * Discovers standard library modules from the default modules directory
 */
export async function discoverStandardModules(): Promise<UMSModule[]> {
  const standardModulesPath = './instructions-modules-v1-compliant';

  try {
    const moduleFiles = await discoverModuleFiles([standardModulesPath]);
    const modules: UMSModule[] = [];

    for (const filePath of moduleFiles) {
      try {
        const content = await readModuleFile(filePath);
        const module = parseModule(content);
        module.filePath = filePath;
        modules.push(module);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(
          `Failed to load standard module '${filePath}': ${message}`
        );
      }
    }

    return modules;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Failed to discover modules')
    ) {
      // No standard modules directory - return empty array
      return [];
    }
    throw error;
  }
}

/**
 * Discovers local modules based on configuration
 */
export async function discoverLocalModules(
  config: ModuleConfig
): Promise<UMSModule[]> {
  const localPaths = getConfiguredModulePaths(config);
  const moduleFiles = await discoverModuleFiles(localPaths);
  const modules: UMSModule[] = [];

  for (const filePath of moduleFiles) {
    try {
      const content = await readModuleFile(filePath);
      const module = parseModule(content);
      module.filePath = filePath;
      modules.push(module);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to load local module '${filePath}': ${message}`);
    }
  }

  return modules;
}

/**
 * Conflict resolution strategies
 */
export type ConflictStrategy = 'error' | 'replace' | 'warn';

/**
 * Result of conflict resolution
 */
export interface ConflictResolutionResult {
  /** Final resolved modules */
  modules: UMSModule[];
  /** Warnings generated during resolution */
  warnings: string[];
}

/**
 * Resolves conflicts between modules based on strategy
 */
export function resolveConflicts(
  standardModules: UMSModule[],
  localModules: UMSModule[],
  config: ModuleConfig
): ConflictResolutionResult {
  const warnings: string[] = [];
  const moduleMap = new Map<string, UMSModule>();

  // Add standard modules first
  for (const module of standardModules) {
    moduleMap.set(module.id, module);
  }

  // Process local modules with conflict resolution
  for (const localModule of localModules) {
    const existing = moduleMap.get(localModule.id);

    if (!existing) {
      moduleMap.set(localModule.id, localModule);
      continue;
    }

    // Find which local path this module came from to determine strategy
    const localPath = findModulePath(localModule, config);
    const strategy = localPath
      ? getConflictStrategy(config, localPath)
      : 'error';

    switch (strategy) {
      case 'error':
        throw new Error(
          `Module ID conflict: '${localModule.id}' exists in both standard library and local modules. ` +
            `Use onConflict: 'replace' or 'warn' in modules.config.yml to resolve.`
        );

      case 'replace':
        moduleMap.set(localModule.id, localModule);
        warnings.push(
          `Replaced standard module '${localModule.id}' with local version from '${localModule.filePath}'`
        );
        break;

      case 'warn':
        warnings.push(
          `Module ID conflict: '${localModule.id}' exists in both standard library and local modules. ` +
            `Using standard library version. Local version at '${localModule.filePath}' ignored.`
        );
        break;
    }
  }

  return {
    modules: Array.from(moduleMap.values()),
    warnings,
  };
}

/**
 * Finds which configured path a module belongs to
 */
function findModulePath(
  module: UMSModule,
  config: ModuleConfig
): string | null {
  if (!module.filePath) return null;

  for (const entry of config.localModulePaths) {
    if (module.filePath.startsWith(entry.path)) {
      return entry.path;
    }
  }

  return null;
}

/**
 * Discovers all modules (standard + local) with conflict resolution
 */
export async function discoverAllModules(): Promise<ConflictResolutionResult> {
  const config = await loadModuleConfig();

  // Discover standard modules
  const standardModules = await discoverStandardModules();

  // Discover local modules if config exists
  let localModules: UMSModule[] = [];
  if (config) {
    localModules = await discoverLocalModules(config);
  }

  // Resolve conflicts
  if (config) {
    return resolveConflicts(standardModules, localModules, config);
  } else {
    return {
      modules: standardModules,
      warnings: [],
    };
  }
}
