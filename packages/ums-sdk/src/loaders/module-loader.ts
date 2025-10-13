/**
 * Module Loader - Loads TypeScript module files from the file system
 * Part of the UMS SDK v1.0
 */

import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import {
  moduleIdToExportName,
  parseModuleObject,
  validateModule,
  type Module,
} from 'ums-lib';
import {
  ModuleLoadError,
  ModuleNotFoundError,
  InvalidExportError,
} from '../errors/index.js';

/**
 * Type guard to check if an unknown value is a Module-like object
 */
function isModuleLike(value: unknown): value is Module {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string'
  );
}

/**
 * ModuleLoader - Loads and validates TypeScript module files
 */
export class ModuleLoader {
  /**
   * Load a single .module.ts file
   * @param filePath - Absolute path to module file
   * @param moduleId - Expected module ID (for validation)
   * @returns Validated Module object
   * @throws ModuleNotFoundError if file doesn't exist
   * @throws InvalidExportError if export name doesn't match
   * @throws ModuleLoadError for other loading failures
   */
  async loadModule(filePath: string, moduleId: string): Promise<Module> {
    try {
      // Check file exists
      await this.checkFileExists(filePath);

      // Convert file path to file URL for dynamic import
      const fileUrl = pathToFileURL(filePath).href;

      // Dynamically import the TypeScript file (tsx handles compilation)
      const moduleExports = (await import(fileUrl)) as Record<string, unknown>;

      // Calculate expected export name from module ID
      const exportName = moduleIdToExportName(moduleId);

      // Extract the module object from exports
      const moduleObject = moduleExports[exportName];

      if (!moduleObject) {
        const availableExports = Object.keys(moduleExports).filter(
          key => key !== '__esModule'
        );
        throw new InvalidExportError(filePath, exportName, availableExports);
      }

      // Validate it's actually a Module object with type guard
      if (!isModuleLike(moduleObject)) {
        throw new ModuleLoadError(
          `Export '${exportName}' in ${filePath} is not a valid Module object`,
          filePath
        );
      }

      // Verify the ID matches
      if (moduleObject.id !== moduleId) {
        throw new ModuleLoadError(
          `Module ID mismatch: file exports '${moduleObject.id}' but expected '${moduleId}'`,
          filePath
        );
      }

      // Parse using ums-lib (normalizes structure)
      const parsedModule = parseModuleObject(moduleObject);

      // Validate using ums-lib
      const validation = validateModule(parsedModule);
      if (!validation.valid) {
        const errorMessages = validation.errors
          .map(e => `${e.path}: ${e.message}`)
          .join(', ');
        throw new ModuleLoadError(
          `Module validation failed: ${errorMessages}`,
          filePath
        );
      }

      return parsedModule;
    } catch (error) {
      // Re-throw SDK errors as-is
      if (
        error instanceof ModuleNotFoundError ||
        error instanceof InvalidExportError ||
        error instanceof ModuleLoadError
      ) {
        throw error;
      }

      // Wrap other errors
      if (error instanceof Error) {
        throw new ModuleLoadError(
          `Failed to load module from ${filePath}: ${error.message}`,
          filePath
        );
      }

      throw error;
    }
  }

  /**
   * Load raw file content (for digests, error reporting)
   * @param filePath - Absolute path to file
   * @returns Raw file content as string
   * @throws ModuleNotFoundError if file doesn't exist
   */
  async loadRawContent(filePath: string): Promise<string> {
    try {
      return await readFile(filePath, 'utf-8');
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        const nodeError = error as NodeJS.ErrnoException;
        if (nodeError.code === 'ENOENT') {
          throw new ModuleNotFoundError(filePath);
        }
      }
      throw new ModuleLoadError(
        `Failed to read file: ${error instanceof Error ? error.message : String(error)}`,
        filePath
      );
    }
  }

  /**
   * Check if a file exists
   * @private
   */
  private async checkFileExists(filePath: string): Promise<void> {
    try {
      await readFile(filePath, 'utf-8');
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        const nodeError = error as NodeJS.ErrnoException;
        if (nodeError.code === 'ENOENT') {
          throw new ModuleNotFoundError(filePath);
        }
      }
      throw error;
    }
  }
}
