/**
 * Config Manager - Loads and validates modules.config.yml files
 * Part of the UMS SDK v1.0
 */

import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { ConfigError } from '../errors/index.js';
import type { ModuleConfig, ConfigValidationResult } from '../types/index.js';

/**
 * ConfigManager - Manages module configuration files
 */
export class ConfigManager {
  /**
   * Load configuration from file
   * @param configPath - Path to modules.config.yml (default: './modules.config.yml')
   * @returns Parsed and validated configuration
   * @throws ConfigError if config is invalid
   */
  async load(configPath = './modules.config.yml'): Promise<ModuleConfig> {
    const resolvedPath = resolve(configPath);

    try {
      // Check if file exists
      const exists = await this.fileExists(resolvedPath);
      if (!exists) {
        // Return empty config if file doesn't exist (not an error)
        return { localModulePaths: [] };
      }

      // Read file
      const content = await readFile(resolvedPath, 'utf-8');

      // Parse YAML
      const config = parse(content) as unknown;

      // Validate
      const validation = this.validate(config);
      if (!validation.valid) {
        throw new ConfigError(
          `Invalid configuration: ${validation.errors.join(', ')}`,
          resolvedPath
        );
      }

      // Validate that all configured paths exist
      const typedConfig = config as ModuleConfig;
      await this.validatePaths(typedConfig, resolvedPath);

      return typedConfig;
    } catch (error) {
      if (error instanceof ConfigError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ConfigError(
          `Failed to load config: ${error.message}`,
          resolvedPath
        );
      }

      throw error;
    }
  }

  /**
   * Validate configuration structure
   * @param config - Configuration object to validate
   * @returns Validation result
   */
  validate(config: unknown): ConfigValidationResult {
    const errors: string[] = [];

    // Check config is an object
    if (typeof config !== 'object' || config === null) {
      return {
        valid: false,
        errors: ['Configuration must be an object'],
      };
    }

    const configObj = config as Record<string, unknown>;

    // Check required field: localModulePaths
    if (!('localModulePaths' in configObj)) {
      errors.push("Missing required field 'localModulePaths'");
    } else if (!Array.isArray(configObj.localModulePaths)) {
      errors.push("Field 'localModulePaths' must be an array");
    } else {
      // Validate each path entry
      const paths = configObj.localModulePaths as unknown[];
      for (let i = 0; i < paths.length; i++) {
        const entry = paths[i];
        const pathErrors = this.validatePathEntry(entry, i);
        errors.push(...pathErrors);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate a single path entry
   * @private
   */
  private validatePathEntry(entry: unknown, index: number): string[] {
    const errors: string[] = [];
    const prefix = `localModulePaths[${index}]`;

    if (typeof entry !== 'object' || entry === null) {
      errors.push(`${prefix} must be an object`);
      return errors;
    }

    const pathEntry = entry as Record<string, unknown>;

    // Validate path field
    if (!('path' in pathEntry)) {
      errors.push(`${prefix}.path is required`);
    } else if (typeof pathEntry.path !== 'string') {
      errors.push(`${prefix}.path must be a string`);
    }

    return errors;
  }

  /**
   * Validate that all configured paths exist
   * @private
   */
  private async validatePaths(
    config: ModuleConfig,
    configPath: string
  ): Promise<void> {
    const errors: string[] = [];

    for (const entry of config.localModulePaths) {
      const resolvedPath = resolve(entry.path);
      const exists = await this.fileExists(resolvedPath);

      if (!exists) {
        errors.push(
          `Path does not exist: ${entry.path} (resolved to ${resolvedPath})`
        );
      }
    }

    if (errors.length > 0) {
      throw new ConfigError(
        `Configuration paths are invalid:\n${errors.join('\n')}`,
        configPath
      );
    }
  }

  /**
   * Check if a file/directory exists
   * @private
   */
  private async fileExists(path: string): Promise<boolean> {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }
}
