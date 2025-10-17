/**
 * CLI Configuration Loader
 * Handles loading and validation of modules.config.yml configuration
 */

import { parse } from 'yaml';
import { fileExists, readModuleFile } from './file-operations.js';
import type { ModuleConfig } from 'ums-lib';

/**
 * Loads module configuration from modules.config.yml
 * Returns null if no configuration file exists
 */
export async function loadModuleConfig(
  path = 'modules.config.yml'
): Promise<ModuleConfig | null> {
  if (!fileExists(path)) {
    return null;
  }

  try {
    const content = await readModuleFile(path);
    const parsed = parse(content) as unknown;

    // Validate config structure per UMS v1.0 spec Section 6.1
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !('localModulePaths' in parsed)
    ) {
      throw new Error(
        'Invalid modules.config.yml format - missing localModulePaths'
      );
    }

    const config = parsed as ModuleConfig;
    if (!Array.isArray(config.localModulePaths)) {
      throw new Error('localModulePaths must be an array');
    }

    // Validate each local module path entry
    for (const entry of config.localModulePaths) {
      if (!entry.path) {
        throw new Error('Each localModulePaths entry must have a path');
      }
      if (
        entry.onConflict &&
        !['error', 'replace', 'warn'].includes(entry.onConflict)
      ) {
        throw new Error(
          `Invalid conflict resolution strategy: ${entry.onConflict}`
        );
      }
    }

    return config;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load modules.config.yml: ${message}`);
  }
}

/**
 * Validates that all configured module paths exist
 */
export function validateConfigPaths(config: ModuleConfig): void {
  const invalidPaths: string[] = [];

  for (const entry of config.localModulePaths) {
    if (!fileExists(entry.path)) {
      invalidPaths.push(entry.path);
    }
  }

  if (invalidPaths.length > 0) {
    throw new Error(
      `Invalid module paths in configuration: ${invalidPaths.join(', ')}`
    );
  }
}

/**
 * Gets all configured module paths for discovery
 */
export function getConfiguredModulePaths(config: ModuleConfig): string[] {
  return config.localModulePaths.map(entry => entry.path);
}

/**
 * Gets conflict resolution strategy for a specific path
 */
export function getConflictStrategy(
  config: ModuleConfig,
  targetPath: string
): 'error' | 'replace' | 'warn' {
  const entry = config.localModulePaths.find(e => e.path === targetPath);
  return entry?.onConflict ?? 'error';
}
