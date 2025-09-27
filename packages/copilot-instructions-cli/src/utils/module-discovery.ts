/**
 * CLI Module Discovery Utilities
 * Handles module discovery and populates ModuleRegistry for CLI operations
 */

import type { UMSModule, ModuleConfig } from 'ums-lib';
import { parseModule, ModuleRegistry } from 'ums-lib';
import { discoverModuleFiles, readModuleFile } from './file-operations.js';
import { loadModuleConfig, getConfiguredModulePaths } from './config-loader.js';

const DEFAULT_STANDARD_MODULES_PATH = './instructions-modules-v1-compliant';

/**
 * Discovers standard library modules from the specified modules directory
 */
export async function discoverStandardModules(
  standardModulesPath: string = DEFAULT_STANDARD_MODULES_PATH
): Promise<UMSModule[]> {
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
 * Result of module discovery operation
 */
export interface ModuleDiscoveryResult {
  /** Populated registry with all discovered modules */
  registry: ModuleRegistry;
  /** Warnings generated during discovery */
  warnings: string[];
}

/**
 * Discovers all modules (standard + local) and populates ModuleRegistry
 */
export async function discoverAllModules(): Promise<ModuleDiscoveryResult> {
  const config = await loadModuleConfig();

  // Use 'error' as fallback default for registry
  const registry = new ModuleRegistry('error');
  const warnings: string[] = [];

  // Discover and add standard modules
  const standardModules = await discoverStandardModules();
  for (const module of standardModules) {
    registry.add(module, {
      type: 'standard',
      path: 'instructions-modules-v1-compliant',
      // No per-path strategy for standard modules
    });
  }

  // Discover and add local modules if config exists
  if (config) {
    const localModules = await discoverLocalModules(config);
    for (const module of localModules) {
      // Find which local path this module belongs to
      const localPath = findModulePath(module, config);
      registry.add(module, {
        type: 'local',
        path: localPath ?? 'unknown',
      });
    }
  }

  return {
    registry,
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
