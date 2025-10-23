/**
 * Standard Library - Manages standard library modules
 * Part of the UMS SDK v1.0
 */

import { resolve, join } from 'node:path';
import { existsSync } from 'node:fs';
import type { Module } from 'ums-lib';
import { ModuleDiscovery } from './module-discovery.js';

/**
 * Default standard library location
 * Can be overridden via INSTRUCTIONS_MODULES_PATH environment variable
 */
const DEFAULT_STANDARD_LIBRARY_PATH = './instructions-modules';

/**
 * StandardLibrary - Manages standard library modules
 */
export class StandardLibrary {
  private discovery: ModuleDiscovery;
  private standardPath: string;

  constructor(standardPath?: string) {
    this.discovery = new ModuleDiscovery();
    this.standardPath =
      standardPath ??
      process.env.INSTRUCTIONS_MODULES_PATH ??
      DEFAULT_STANDARD_LIBRARY_PATH;
  }

  /**
   * Discover all standard library modules
   * @returns Array of standard modules
   */
  async discoverStandard(): Promise<Module[]> {
    const path = this.getStandardLibraryPath();

    // Check if standard library exists
    if (!existsSync(path)) {
      // Not an error - just return empty array
      return [];
    }

    try {
      return await this.discovery.discoverInPaths([path]);
    } catch (error) {
      // If standard library discovery fails, log warning but don't throw
      console.warn(
        `Failed to discover standard library modules: ${error instanceof Error ? error.message : String(error)}`
      );
      return [];
    }
  }

  /**
   * Get standard library location
   * @returns Path to standard library directory
   */
  getStandardLibraryPath(): string {
    return resolve(this.standardPath);
  }

  /**
   * Check if a module ID is from standard library
   * @param moduleId - Module ID to check
   * @returns true if module is in standard library
   *
   * Note: Uses file-based heuristic - checks if module file exists in standard library path.
   * This is a simple implementation that works for most cases.
   */
  isStandardModule(moduleId: string): boolean {
    // Check if module file exists in standard library path
    const standardModulePath = join(
      this.standardPath,
      `${moduleId}.module.ts`
    );
    return existsSync(standardModulePath);
  }

  /**
   * Set standard library path
   * @param path - New path to standard library
   */
  setStandardLibraryPath(path: string): void {
    this.standardPath = path;
  }
}
