/**
 * Module Discovery - Discovers module files in configured directories
 * Part of the UMS SDK v1.0
 */

import { join, basename, resolve } from 'node:path';
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
    const paths = config.localModulePaths.map(entry => resolve(entry.path));
    return this.discoverInPaths(paths);
  }

  /**
   * Discover modules in specific directories
   * @param paths - Array of directory paths
   * @returns Array of loaded modules
   */
  async discoverInPaths(paths: string[]): Promise<Module[]> {
    try {
      // Find all module files
      const filePaths = await this.findModuleFiles(paths);

      // Load each module (skip failures with warnings)
      const modules: Module[] = [];
      const errors: string[] = [];

      for (const filePath of filePaths) {
        try {
          const moduleId = this.extractModuleId(filePath);
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
        throw new DiscoveryError(error.message, paths);
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
   * Extract module ID from file path
   * @private
   * @param filePath - Absolute path to module file
   * @returns Module ID
   * @example
   * '/path/to/error-handling.module.ts' → 'error-handling'
   * '/path/to/foundation/ethics/do-no-harm.module.ts' → 'foundation/ethics/do-no-harm'
   */
  private extractModuleId(filePath: string): string {
    // For now, just use the filename without extension
    // In the future, we might want to extract from directory structure
    const fileName = basename(filePath, '.module.ts');
    return fileName;
  }
}
