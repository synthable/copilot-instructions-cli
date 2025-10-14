/**
 * Module Discovery - Discovers module files in configured directories
 * Part of the UMS SDK v1.0
 */

import { join, resolve } from 'node:path';
import { glob } from 'glob';
import type { Module } from 'ums-lib';
import { ModuleLoader } from '../loaders/module-loader.js';
import { DiscoveryError } from '../errors/index.js';
import type { ModuleConfig } from '../types/index.js';

/**
 * ModuleDiscovery - Discovers and loads module files from the file system
 */
export class ModuleDiscovery {
  private loader: ModuleLoader;

  constructor() {
    this.loader = new ModuleLoader();
  }

  /**
   * Discover all .module.ts files in configured paths
   * @param config - Configuration specifying paths
   * @returns Array of loaded modules
   * @throws DiscoveryError if discovery fails
   */
  async discover(config: ModuleConfig): Promise<Module[]> {
    const modules: Module[] = [];

    // Discover from each configured path separately to maintain base path context
    for (const entry of config.localModulePaths) {
      const basePath = resolve(entry.path);
      const pathModules = await this.discoverInPath(basePath);
      modules.push(...pathModules);
    }

    return modules;
  }

  /**
   * Discover modules in specific directories
   * @param paths - Array of directory paths
   * @returns Array of loaded modules
   */
  async discoverInPaths(paths: string[]): Promise<Module[]> {
    const modules: Module[] = [];

    for (const path of paths) {
      const pathModules = await this.discoverInPath(path);
      modules.push(...pathModules);
    }

    return modules;
  }

  /**
   * Discover modules in a single directory
   * @param basePath - Base directory path
   * @returns Array of loaded modules
   * @private
   */
  private async discoverInPath(basePath: string): Promise<Module[]> {
    try {
      // Find all module files in this path
      const filePaths = await this.findModuleFiles([basePath]);

      // Load each module (skip failures with warnings)
      const modules: Module[] = [];
      const errors: string[] = [];

      for (const filePath of filePaths) {
        try {
          const moduleId = this.extractModuleId(filePath, basePath);
          const module = await this.loader.loadModule(filePath, moduleId);
          modules.push(module);
        } catch (error) {
          // Log error but continue discovery
          const message =
            error instanceof Error ? error.message : String(error);
          errors.push(`Failed to load ${filePath}: ${message}`);
          // Don't throw - just skip this module
        }
      }

      // If there were errors, log them as warnings but don't fail
      if (errors.length > 0) {
        console.warn(
          `Module discovery completed with ${errors.length} errors:\n${errors.join('\n')}`
        );
      }

      return modules;
    } catch (error) {
      if (error instanceof Error) {
        throw new DiscoveryError(error.message, [basePath]);
      }
      throw error;
    }
  }

  /**
   * Find all .module.ts files in given paths
   * @private
   */
  private async findModuleFiles(paths: string[]): Promise<string[]> {
    const MODULE_EXTENSIONS = ['.module.ts'];
    const allFiles: string[] = [];

    for (const path of paths) {
      for (const extension of MODULE_EXTENSIONS) {
        const pattern = join(path, '**', `*${extension}`);
        const files = await glob(pattern, { nodir: true });
        allFiles.push(...files);
      }
    }

    return allFiles;
  }

  /**
   * Extract module ID from file path relative to base path
   * @private
   * @param filePath - Absolute path to module file
   * @param basePath - Base directory path (configured module path)
   * @returns Module ID (relative path without extension)
   * @example
   * filePath: '/project/modules/error-handling.module.ts'
   * basePath: '/project/modules'
   * returns: 'error-handling'
   *
   * @example
   * filePath: '/project/modules/foundation/ethics/do-no-harm.module.ts'
   * basePath: '/project/modules'
   * returns: 'foundation/ethics/do-no-harm'
   */
  private extractModuleId(filePath: string, basePath: string): string {
    // Get path relative to base
    const relativePath = filePath.replace(basePath, '').replace(/^\/+/, '');

    // Remove .module.ts extension
    const moduleId = relativePath.replace(/\.module\.ts$/, '');

    return moduleId;
  }
}
