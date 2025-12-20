/**
 * Module Loader - Loads TypeScript module files from the file system
 * Part of the UMS SDK v1.0
 *
 * Responsibilities:
 * - File I/O (loading TypeScript files with tsx)
 * - Export extraction (finding Module export, flexible naming per v2.1)
 * - Error wrapping (adding file path context to ums-lib errors)
 *
 * Delegates to ums-lib for:
 * - Parsing (structure validation, type checking)
 * - Validation (UMS v2.0/v2.1 spec compliance)
 */

import { readFile } from 'node:fs/promises';
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
import { checkFileExists, isFileNotFoundError } from '../utils/file-utils.js';
import { filePathToUrl, formatValidationErrors } from './loader-utils.js';

/**
 * Checks if an object looks like a UMS Module (duck typing).
 * Used for flexible export discovery per v2.1 spec.
 */
function looksLikeModule(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return false;
  }
  const candidate = obj as Record<string, unknown>;
  // Check for required Module fields
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.schemaVersion === 'string' &&
    typeof candidate.version === 'string' &&
    Array.isArray(candidate.capabilities) &&
    typeof candidate.metadata === 'object' &&
    candidate.metadata !== null
  );
}

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
      await checkFileExists(filePath);

      // Convert file path to file URL for dynamic import
      const fileUrl = filePathToUrl(filePath);

      // Dynamically import the TypeScript file (tsx handles compilation)
      const moduleExports = (await import(fileUrl)) as Record<string, unknown>;

      // Calculate expected export name from module ID (v2.0 convention)
      const conventionalName = moduleIdToExportName(moduleId);

      // Per v2.1 spec: export name is convention, not requirement
      // First try conventional name, then scan for any Module export
      let moduleObject = moduleExports[conventionalName];

      if (!moduleObject) {
        // Scan all exports for Module-shaped objects
        const availableExports = Object.keys(moduleExports).filter(
          key => key !== '__esModule'
        );
        const moduleExportEntries = availableExports
          .map(key => ({ key, value: moduleExports[key] }))
          .filter(entry => looksLikeModule(entry.value));

        if (moduleExportEntries.length === 0) {
          throw new InvalidExportError(
            filePath,
            conventionalName,
            availableExports
          );
        }

        if (moduleExportEntries.length > 1) {
          throw new ModuleLoadError(
            `Multiple Module exports found: ${moduleExportEntries.map(e => e.key).join(', ')}. ` +
              'Module files must export exactly one Module object.',
            filePath
          );
        }

        moduleObject = moduleExportEntries[0].value;
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
        throw new ModuleLoadError(
          `Module validation failed: ${formatValidationErrors(validation)}`,
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
      if (isFileNotFoundError(error)) {
        throw new ModuleNotFoundError(filePath);
      }
      throw new ModuleLoadError(
        `Failed to read file: ${error instanceof Error ? error.message : String(error)}`,
        filePath
      );
    }
  }
}
