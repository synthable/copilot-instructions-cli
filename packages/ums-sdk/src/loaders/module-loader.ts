/**
 * Module Loader - Loads TypeScript module files from the file system
 * Part of the UMS SDK v1.0
 *
 * Responsibilities:
 * - File I/O (loading TypeScript files with tsx)
 * - Export extraction (finding correct named export)
 * - Error wrapping (adding file path context to ums-lib errors)
 *
 * Delegates to ums-lib for:
 * - Parsing (structure validation, type checking)
 * - Validation (UMS v2.0 spec compliance)
 */

import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import {
  moduleIdToExportName,
  parseModule,
  validateModule,
  type Module,
} from 'ums-lib';
import {
  ModuleLoadError,
  ModuleNotFoundError,
  InvalidExportError,
} from '../errors/index.js';

/**
 * ModuleLoader - Loads and validates TypeScript module files
 */
export class ModuleLoader {
  /**
   * Load a single .module.ts file
   * @param filePath - Absolute path to module file
   * @param moduleId - Expected module ID (for export name calculation)
   * @returns Validated Module object
   * @throws ModuleNotFoundError if file doesn't exist
   * @throws InvalidExportError if export name doesn't match
   * @throws ModuleLoadError for parsing or validation failures
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

      // Delegate to ums-lib for parsing (structure validation, type checking)
      const parsedModule = parseModule(moduleObject);

      // SDK responsibility: Verify the module's ID matches expected ID from file path
      if (parsedModule.id !== moduleId) {
        throw new ModuleLoadError(
          `Module ID mismatch: file exports module with id '${parsedModule.id}' but expected '${moduleId}' based on file path`,
          filePath
        );
      }

      // Delegate to ums-lib for full UMS v2.0 spec validation
      const validation = validateModule(parsedModule);
      if (!validation.valid) {
        const errorMessages = validation.errors
          .map(e => `${e.path ?? 'module'}: ${e.message}`)
          .join('; ');
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

      // Wrap ums-lib parsing errors with file context
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
