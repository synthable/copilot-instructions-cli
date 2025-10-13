/**
 * Persona Loader - Loads TypeScript persona files from the file system
 * Part of the UMS SDK v1.0
 */

import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { parsePersonaObject, validatePersona, type Persona } from 'ums-lib';
import { ModuleLoadError, ModuleNotFoundError } from '../errors/index.js';

/**
 * Type guard to check if an unknown value is a Persona-like object
 */
function isPersonaLike(value: unknown): value is Persona {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'modules' in value &&
    'schemaVersion' in value
  );
}

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

      // Try to find the persona export
      let personaObject: Persona | undefined;

      // Check for default export
      const defaultExport = personaExports.default;
      if (isPersonaLike(defaultExport)) {
        personaObject = defaultExport;
      } else {
        // Try to find any Persona-like object in exports
        const exports = Object.values(personaExports).filter(
          val => val !== undefined
        );
        const personaCandidate = exports.find(isPersonaLike);

        if (personaCandidate) {
          personaObject = personaCandidate;
        }
      }

      if (!personaObject) {
        const availableExports = Object.keys(personaExports).filter(
          key => key !== '__esModule'
        );
        throw new ModuleLoadError(
          `Persona file does not export a valid Persona object. ` +
            `Available exports: ${availableExports.join(', ')}. ` +
            `Expected: export default { name: "...", modules: [...], schemaVersion: "2.0" } ` +
            `or export const personaName: Persona = { ... }`,
          filePath
        );
      }

      // Parse using ums-lib (normalizes structure)
      const parsedPersona = parsePersonaObject(personaObject);

      // Validate using ums-lib
      const validation = validatePersona(parsedPersona);
      if (!validation.valid) {
        const errorMessages = validation.errors
          .map(e => `${e.path}: ${e.message}`)
          .join(', ');
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

      // Wrap other errors
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
