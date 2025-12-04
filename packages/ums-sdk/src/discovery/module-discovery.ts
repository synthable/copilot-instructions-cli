/**
 * Module Discovery - Discovers module files in configured directories
 * Part of the UMS SDK v1.0
 */

import { join, resolve } from 'node:path';
import { glob } from 'glob';
import type { Module } from 'ums-lib';
import { ModuleLoader } from '../loaders/module-loader.js';
import { DiscoveryError } from '../errors/index.js';
import type { ModuleConfig, DiscoveredModule } from '../types/index.js';

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
    const discovered = await this.discoverInPaths(paths);
    return discovered.map(d => d.module);
  }

  /**
   * Discover modules in specific directories
   * @param paths - Array of directory paths
   * @returns Array of discovered modules with file paths
   */
  async discoverInPaths(paths: string[]): Promise<DiscoveredModule[]> {
    const discovered: DiscoveredModule[] = [];
    for (const path of paths) {
      const pathDiscovered = await this.discoverInSinglePath(path);
      discovered.push(...pathDiscovered);
    }
    return discovered;
  }

  /**
   * Discover modules with their file paths (for digest computation)
   * @param config - Configuration specifying paths
   * @returns Array of discovered modules with file paths
   */
  async discoverWithFilePaths(
    config: ModuleConfig
  ): Promise<DiscoveredModule[]> {
    const paths = config.localModulePaths.map(entry => resolve(entry.path));
    return this.discoverInPaths(paths);
  }

  /**
   * Discover modules in a single directory with file paths
   * @param basePath - Base directory path
   * @returns Array of discovered modules with file paths
   * @private
   */
  private async discoverInSinglePath(
    basePath: string
  ): Promise<DiscoveredModule[]> {
    try {
      // Check if there's a 'modules/' subdirectory and use that as the search path
      const { existsSync } = await import('node:fs');
      const modulesSubdir = join(basePath, 'modules');
      const searchPath = existsSync(modulesSubdir) ? modulesSubdir : basePath;

      // Find all module files in this path
      const filePaths = await this.findModuleFiles([searchPath]);

      // Load each module (skip failures with warnings)
      const discovered: DiscoveredModule[] = [];
      const errors: string[] = [];

      for (const filePath of filePaths) {
        try {
          const moduleId = this.extractModuleId(filePath, searchPath);
          const module = await this.loader.loadModule(filePath, moduleId);
          discovered.push({ module, filePath });
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

      return discovered;
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
   * Discover all .component.ts files in given paths
   * Components are shared reusable pieces that can be imported into modules
   * They are NOT indexed in the registry - they exist only for composition
   * @param paths - Array of directory paths to search
   * @returns Array of component file paths
   */
  async discoverComponents(paths: string[]): Promise<string[]> {
    const COMPONENT_EXTENSIONS = ['.component.ts'];
    const allFiles: string[] = [];

    for (const path of paths) {
      for (const extension of COMPONENT_EXTENSIONS) {
        const pattern = join(path, '**', `*${extension}`);
        const files = await glob(pattern, { nodir: true });
        allFiles.push(...files);
      }
    }

    return allFiles;
  }

  /**
   * Check if a file path is a component file
   * @param filePath - Path to check
   * @returns true if file is a .component.ts file
   */
  isComponentFile(filePath: string): boolean {
    return filePath.endsWith('.component.ts');
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
