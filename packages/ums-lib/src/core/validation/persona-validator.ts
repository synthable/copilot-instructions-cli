/**
 * UMS v2.0 Persona Validation
 * Implements persona validation per UMS v2.0 specification
 */

import {
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
  type Persona,
} from '../../types/index.js';
import { ValidationError as ValidationErrorClass } from '../../utils/errors.js';

const SEMVER_REGEX =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/**
 * Validates a parsed UMS v2.0 persona object.
 *
 * @param persona - The persona object to validate.
 * @returns A validation result object containing errors and warnings.
 */
// eslint-disable-next-line max-lines-per-function
export function validatePersona(persona: Persona): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Validate schema version (v2.0 only)
  if (persona.schemaVersion !== '2.0') {
    errors.push(
      new ValidationErrorClass(
        `Invalid schema version: ${persona.schemaVersion}, expected '2.0'`,
        'schemaVersion',
        'Section 4'
      )
    );
  }

  // Validate version format
  if (!SEMVER_REGEX.test(persona.version)) {
    errors.push(
      new ValidationErrorClass(
        `Invalid version format: ${persona.version}, expected SemVer`,
        'version',
        'Section 4'
      )
    );
  }

  // Validate modules array exists and has content
  if (!Array.isArray(persona.modules) || persona.modules.length === 0) {
    errors.push(
      new ValidationErrorClass(
        'Persona must have at least one module entry',
        'modules',
        'Section 4.2'
      )
    );
    // Return early if no modules
    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Validate each module entry and check for duplicate module IDs across all entries
  const allModuleIds = new Set<string>();
  for (let i = 0; i < persona.modules.length; i++) {
    const entry = persona.modules[i];

    // Handle v2.0 ModuleEntry union type (string | ModuleGroup)
    if (typeof entry === 'string') {
      // Simple string module ID
      if (allModuleIds.has(entry)) {
        errors.push(
          new ValidationErrorClass(
            `Duplicate module ID found: ${entry}`,
            `modules[${i}]`,
            'Section 4.2'
          )
        );
      }
      allModuleIds.add(entry);
      continue;
    }

    // Handle ModuleGroup object (runtime check for malformed data)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!entry || typeof entry !== 'object') {
      errors.push(
        new ValidationErrorClass(
          `Module entry at index ${i} must be a string or object`,
          `modules[${i}]`,
          'Section 4.2'
        )
      );
      continue;
    }

    // Get module IDs from 'ids' array
    const moduleIds = entry.ids;

    if (!Array.isArray(moduleIds) || moduleIds.length === 0) {
      errors.push(
        new ValidationErrorClass(
          `Module group ${i} must have a non-empty 'ids' array`,
          `modules[${i}].ids`,
          'Section 4.2'
        )
      );
    } else {
      // Check for duplicate module IDs
      for (const id of moduleIds) {
        if (typeof id !== 'string') {
          errors.push(
            new ValidationErrorClass(
              `Module ID must be a string, found ${typeof id}`,
              `modules[${i}].ids`,
              'Section 4.2'
            )
          );
        } else if (allModuleIds.has(id)) {
          errors.push(
            new ValidationErrorClass(
              `Duplicate module ID found across groups: ${id}`,
              `modules[${i}].ids`,
              'Section 4.2'
            )
          );
        }
        allModuleIds.add(id);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
