/**
 * CLI Module Discovery Utilities
 * Handles module discovery and populates ModuleRegistry for CLI operations
 * Supports UMS v2.0 TypeScript format only
 *
 * Uses SDK's ModuleDiscovery and StandardLibrary for all discovery operations.
 */

import type { Module } from 'ums-sdk';
import {
  ModuleRegistry,
  ConfigManager,
  ModuleDiscovery,
  StandardLibrary,
} from 'ums-sdk';

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
 * Uses SDK's ModuleDiscovery and StandardLibrary for discovery operations.
 * Builds a registry with conflict resolution for use by CLI commands.
 */
export async function discoverAllModules(): Promise<ModuleDiscoveryResult> {
  const configManager = new ConfigManager();
  const moduleDiscovery = new ModuleDiscovery();
  const standardLibrary = new StandardLibrary();

  // Load configuration
  const config = await configManager.load();

  // Discover all modules
  const modules: Module[] = [];
  const warnings: string[] = [];

  // Discover standard library modules
  const standardModules = await standardLibrary.discoverStandard();
  modules.push(...standardModules);

  // Discover local modules from configuration
  if (config.localModulePaths.length > 0) {
    const localModules = await moduleDiscovery.discover(config);
    modules.push(...localModules);
  }

  // Build registry with conflict resolution
  // Use configured strategy or default to 'error'
  const conflictStrategy = config.conflictStrategy ?? 'error';
  const registry = new ModuleRegistry(conflictStrategy);

  for (const module of modules) {
    try {
      // Determine if module is from standard library or local
      const isStandard = standardLibrary.isStandardModule(module.id);

      registry.add(module, {
        type: isStandard ? 'standard' : 'local',
        path: isStandard ? standardLibrary.getStandardLibraryPath() : 'local',
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

  return {
    registry,
    warnings,
  };
}
