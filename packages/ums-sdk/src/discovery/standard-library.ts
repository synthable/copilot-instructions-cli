/**
 * Standard Library - Manages standard library modules
 * Part of the UMS SDK v1.0
 */

import { resolve, join } from 'node:path';
import { existsSync } from 'node:fs';
import type { Module } from 'ums-lib';
import { ModuleDiscovery } from './module-discovery.js';
import type { DiscoveredModule } from '../types/index.js';

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
    const discovered = await this.discoverStandardWithFilePaths();
    return discovered.map(d => d.module);
  }

  /**
   * Discover all standard library modules with file paths
   * @returns Array of discovered modules with file paths
   */
  async discoverStandardWithFilePaths(): Promise<DiscoveredModule[]> {
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
   * Handles both direct paths and /modules/ subdirectory structure for consistency
   * with ModuleDiscovery.discoverInSinglePath().
   */
  isStandardModule(moduleId: string): boolean {
    // Check direct path first
    const directPath = join(this.standardPath, `${moduleId}.module.ts`);
    if (existsSync(directPath)) {
      return true;
    }

    // Also check /modules/ subdirectory (consistent with ModuleDiscovery logic)
    const modulesSubdirPath = join(
      this.standardPath,
      'modules',
      `${moduleId}.module.ts`
    );
    return existsSync(modulesSubdirPath);
  }

  /**
   * Set standard library path
   * @param path - New path to standard library
   */
  setStandardLibraryPath(path: string): void {
    this.standardPath = path;
  }
}
