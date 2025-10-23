/**
 * UMS v2.0 Module Parser
 * Handles parsing and basic validation of module data structures.
 */

import type { Module } from '../../types/index.js';
import { ModuleParseError } from '../../utils/errors.js';

/**
 * Parses and validates a raw object as a UMS v2.0 module.
 *
 * This function performs initial structural validation to ensure the object
 * has the required fields to be considered a module. It does not perform
 * a full validation against the UMS specification.
 *
 * @param obj - The raw object to parse as a module.
 * @returns The validated module object.
 * @throws {ModuleParseError} If the object is not a valid module structure.
 */
export function parseModule(obj: unknown): Module {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new ModuleParseError('Module must be an object.');
  }

  const module = obj as Module;

  // Validate required top-level fields
  if (typeof module.id !== 'string') {
    throw new ModuleParseError('Module missing or invalid required field: id');
  }
  if (module.schemaVersion !== '2.0') {
    throw new ModuleParseError(
      `Module schemaVersion must be "2.0", but found "${module.schemaVersion}"`
    );
  }
  if (typeof module.version !== 'string') {
    throw new ModuleParseError(
      'Module missing or invalid required field: version'
    );
  }
  if (!Array.isArray(module.capabilities)) {
    throw new ModuleParseError(
      'Module missing or invalid required field: capabilities'
    );
  }
  // Runtime check for malformed data (metadata should be required by type but may be missing in raw data)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof module.metadata !== 'object' || module.metadata === null) {
    throw new ModuleParseError(
      'Module missing or invalid required field: metadata'
    );
  }

  // Validate that at least one component type is present
  const hasComponents =
    Array.isArray(module.components) && module.components.length > 0;
  const hasShorthand = module.instruction ?? module.knowledge ?? module.data;

  if (!hasComponents && !hasShorthand) {
    throw new ModuleParseError(
      'Module must have at least one component via `components` array or a shorthand property.'
    );
  }

  // Full validation can be done separately using `validateModule`
  return module;
}
