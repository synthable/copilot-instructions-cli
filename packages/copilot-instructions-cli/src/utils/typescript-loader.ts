/**
 * TypeScript module loader using tsx for on-the-fly execution
 * Supports loading .module.ts and .persona.ts files without pre-compilation
 */

import { pathToFileURL } from 'node:url';
import { moduleIdToExportName } from 'ums-lib';
import type { Module, Persona } from 'ums-lib';

// File extension constants
const FILE_EXTENSIONS = {
  MODULE_TS: '.module.ts',
  PERSONA_TS: '.persona.ts',
  MODULE_YML: '.module.yml',
  PERSONA_YML: '.persona.yml',
} as const;

/**
 * Type guard to check if an unknown value is a Module-like object
 * We only validate the essential 'id' property at runtime and trust the TypeScript export
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
 * Load a TypeScript module file and extract the module object
 * @param filePath - Absolute path to .module.ts file
 * @param moduleId - Expected module ID for export name validation
 * @returns Parsed Module object
 */
export async function loadTypeScriptModule(
  filePath: string,
  moduleId: string
): Promise<Module> {
  try {
    // Convert file path to file URL for dynamic import
    const fileUrl = pathToFileURL(filePath).href;

    // Dynamically import the TypeScript file (tsx handles compilation)
    const moduleExports = (await import(fileUrl)) as Record<string, unknown>;

    // Calculate expected export name from module ID
    const exportName = moduleIdToExportName(moduleId);

    // Extract the module object from exports
    const moduleObject = moduleExports[exportName];

    if (!moduleObject) {
      throw new Error(
        `Module file ${filePath} does not export '${exportName}'. ` +
          `Expected export: export const ${exportName}: Module = { ... }`
      );
    }

    // Validate it's actually a Module object with type guard
    if (!isModuleLike(moduleObject)) {
      throw new Error(
        `Export '${exportName}' in ${filePath} is not a valid Module object`
      );
    }

    // Verify the ID matches
    if (moduleObject.id !== moduleId) {
      throw new Error(
        `Module ID mismatch: file exports '${moduleObject.id}' but expected '${moduleId}'`
      );
    }

    return moduleObject;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to load TypeScript module from ${filePath}: ${error.message}`
      );
    }
    throw error;
  }
}

/**
 * Load a TypeScript persona file and extract the persona object
 * @param filePath - Absolute path to .persona.ts file
 * @returns Parsed Persona object
 */
export async function loadTypeScriptPersona(
  filePath: string
): Promise<Persona> {
  try {
    // Convert file path to file URL for dynamic import
    const fileUrl = pathToFileURL(filePath).href;

    // Dynamically import the TypeScript file
    const personaExports = (await import(fileUrl)) as Record<string, unknown>;

    // Try to find the persona export
    // Common patterns: default export, or named export matching filename
    let personaObject: Persona | undefined;

    // Check for default export
    const defaultExport = personaExports.default;
    if (isPersonaLike(defaultExport)) {
      personaObject = defaultExport;
    } else {
      // Try to find any Persona-like object in exports
      const exports = Object.values(personaExports);
      const personaCandidate = exports.find(isPersonaLike);

      if (personaCandidate) {
        personaObject = personaCandidate;
      }
    }

    if (!personaObject) {
      throw new Error(
        `Persona file ${filePath} does not export a valid Persona object. ` +
          `Expected: export default { name: "...", modules: [...], ... } or export const personaName: Persona = { ... }`
      );
    }

    return personaObject;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to load TypeScript persona from ${filePath}: ${error.message}`
      );
    }
    throw error;
  }
}

/**
 * Determine the UMS version from file extension
 * @param filePath - Path to module or persona file
 * @returns Version string ('1.0' or '2.0')
 */
export function detectUMSVersion(filePath: string): '1.0' | '2.0' {
  if (
    filePath.endsWith(FILE_EXTENSIONS.MODULE_TS) ||
    filePath.endsWith(FILE_EXTENSIONS.PERSONA_TS)
  ) {
    return '2.0';
  }
  if (
    filePath.endsWith(FILE_EXTENSIONS.MODULE_YML) ||
    filePath.endsWith(FILE_EXTENSIONS.PERSONA_YML)
  ) {
    return '1.0';
  }
  throw new Error(`Unknown UMS file format: ${filePath}`);
}

/**
 * Check if a file is a TypeScript UMS file
 */
export function isTypeScriptUMSFile(filePath: string): boolean {
  return (
    filePath.endsWith(FILE_EXTENSIONS.MODULE_TS) ||
    filePath.endsWith(FILE_EXTENSIONS.PERSONA_TS)
  );
}

/**
 * Check if a file is a YAML UMS file (v1.0)
 */
export function isYAMLUMSFile(filePath: string): boolean {
  return (
    filePath.endsWith(FILE_EXTENSIONS.MODULE_YML) ||
    filePath.endsWith(FILE_EXTENSIONS.PERSONA_YML)
  );
}
