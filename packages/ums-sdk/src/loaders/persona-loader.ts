/**
 * Persona Loader - Loads TypeScript persona files from the file system
 * Part of the UMS SDK v1.0
 *
 * Responsibilities:
 * - File I/O (loading TypeScript files with tsx)
 * - Export extraction (finding default or named export)
 * - Error wrapping (adding file path context to ums-lib errors)
 *
 * Delegates to ums-lib for:
 * - Parsing (structure validation, type checking)
 * - Validation (UMS v2.0 spec compliance)
 */

import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { parsePersona, validatePersona, type Persona } from 'ums-lib';
import { ModuleLoadError, ModuleNotFoundError } from '../errors/index.js';

/**
 * PersonaLoader - Loads and validates TypeScript persona files
 */
export class PersonaLoader {
  /**
   * Load a single .persona.ts file
   * @param filePath - Absolute path to persona file
   * @returns Validated Persona object
   * @throws ModuleNotFoundError if file doesn't exist
   * @throws ModuleLoadError if persona is invalid
   */
  async loadPersona(filePath: string): Promise<Persona> {
    try {
      // Check file exists
      await this.checkFileExists(filePath);

      // Convert file path to file URL for dynamic import
      const fileUrl = pathToFileURL(filePath).href;

      // Dynamically import the TypeScript file
      const personaExports = (await import(fileUrl)) as Record<string, unknown>;

      // Try to find a persona export - prefer default export, fall back to named
      let candidateExport: unknown;

      if (personaExports.default) {
        candidateExport = personaExports.default;
      } else {
        // Try to find any non-__esModule export
        const namedExports = Object.entries(personaExports).filter(
          ([key]) => key !== '__esModule'
        );

        if (namedExports.length === 0) {
          throw new ModuleLoadError(
            'Persona file does not export anything. ' +
              'Expected: export default { name: "...", modules: [...], schemaVersion: "2.0" } ' +
              'or export const personaName: Persona = { ... }',
            filePath
          );
        }

        // Use first named export
        candidateExport = namedExports[0][1];
      }

      // Delegate to ums-lib for parsing (structure validation, type checking)
      const parsedPersona = parsePersona(candidateExport);

      // Delegate to ums-lib for full UMS v2.0 spec validation
      const validation = validatePersona(parsedPersona);
      if (!validation.valid) {
        const errorMessages = validation.errors
          .map(e => `${e.path ?? 'persona'}: ${e.message}`)
          .join('; ');
        throw new ModuleLoadError(
          `Persona validation failed: ${errorMessages}`,
          filePath
        );
      }

      return parsedPersona;
    } catch (error) {
      // Re-throw SDK errors as-is
      if (
        error instanceof ModuleNotFoundError ||
        error instanceof ModuleLoadError
      ) {
        throw error;
      }

      // Wrap ums-lib parsing errors with file context
      if (error instanceof Error) {
        throw new ModuleLoadError(
          `Failed to load persona from ${filePath}: ${error.message}`,
          filePath
        );
      }

      throw error;
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
