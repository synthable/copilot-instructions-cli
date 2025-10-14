/**
 * CLI Module Discovery Utilities
 * Handles module discovery and populates ModuleRegistry for CLI operations
 * Supports UMS v2.0 TypeScript format only
 */

import type { ModuleConfig } from 'ums-lib';
import { ModuleRegistry } from 'ums-lib';
import { discoverModuleFiles } from './file-operations.js';
import { loadModuleConfig, getConfiguredModulePaths } from './config-loader.js';
import { loadTypeScriptModule } from './typescript-loader.js';
import { basename } from 'path';
import type { CLIModule } from '../types/cli-extensions.js';

const DEFAULT_STANDARD_MODULES_PATH = './instructions-modules';

/**
 * Loads a v2.0 TypeScript module file
 */
async function loadModuleFile(filePath: string): Promise<CLIModule> {
  // v2.0 TypeScript format - extract module ID from filename
  const fileName = basename(filePath, '.module.ts');
  // For now, use filename as module ID - this may need refinement
  // based on actual module structure
  const module = (await loadTypeScriptModule(filePath, fileName)) as CLIModule;
  module.filePath = filePath;
  return module;
}

/**
 * Discovers standard library modules from the specified modules directory
 * Supports UMS v2.0 TypeScript format only
 */
export async function discoverStandardModules(
  standardModulesPath: string = DEFAULT_STANDARD_MODULES_PATH
): Promise<CLIModule[]> {
  try {
    const moduleFiles = await discoverModuleFiles([standardModulesPath]);
    const modules: CLIModule[] = [];

    for (const filePath of moduleFiles) {
      try {
        const module = await loadModuleFile(filePath);
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
 * Supports UMS v2.0 TypeScript format only
 */
export async function discoverLocalModules(
  config: ModuleConfig
): Promise<CLIModule[]> {
  const localPaths = getConfiguredModulePaths(config);
  const moduleFiles = await discoverModuleFiles(localPaths);
  const modules: CLIModule[] = [];

  for (const filePath of moduleFiles) {
    try {
      const module = await loadModuleFile(filePath);
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
 *
 * Note: Standard modules discovery is intentionally skipped.
 * All modules should be configured via modules.config.yml to prevent
 * loading test modules and to allow full configuration control.
 */
export async function discoverAllModules(): Promise<ModuleDiscoveryResult> {
  const config = await loadModuleConfig();

  // Use 'error' as fallback default for registry
  const registry = new ModuleRegistry('error');
  const warnings: string[] = [];

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
  module: CLIModule,
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
