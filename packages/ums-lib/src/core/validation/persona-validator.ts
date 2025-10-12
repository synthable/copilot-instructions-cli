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
import {
  ValidationError as ValidationErrorClass,
} from '../../utils/errors.js';

const SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/**
 * Validates a parsed UMS persona object.
 * Supports both v1.0 (moduleGroups) and v2.0 (modules) formats.
 *
 * @param persona - The persona object to validate.
 * @returns A validation result object containing errors and warnings.
 */
export function validatePersona(persona: Persona): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Validate schema version (accepts both 1.0 and 2.0 for compatibility)
  if (persona.schemaVersion !== '2.0' && persona.schemaVersion !== '1.0') {
    errors.push(
      new ValidationErrorClass(
        `Invalid schema version: ${persona.schemaVersion}, expected '1.0' or '2.0'`,
        'schemaVersion',
        'Section 4',
      ),
    );
  }

  // Validate version format
  if (!SEMVER_REGEX.test(persona.version)) {
    errors.push(
      new ValidationErrorClass(
        `Invalid version format: ${persona.version}, expected SemVer`,
        'version',
        'Section 4',
      ),
    );
  }

  // Determine which format to validate (v2.0 modules or v1.0 moduleGroups)
  const moduleGroups = persona.modules || persona.moduleGroups;
  const fieldName = persona.modules ? 'modules' : 'moduleGroups';

  // Validate module groups array exists and has content
  if (!Array.isArray(moduleGroups) || moduleGroups.length === 0) {
    errors.push(
      new ValidationErrorClass(
        'Persona must have at least one module group',
        fieldName,
        'Section 4',
      ),
    );
    // Return early if no module groups
    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Validate each module group and check for duplicate module IDs across all groups
  const allModuleIds = new Set<string>();
  for (let i = 0; i < moduleGroups.length; i++) {
    const entry = moduleGroups[i];

    // Handle v2.0 ModuleEntry union type (string | ModuleGroup)
    if (typeof entry === 'string') {
      // Simple string module ID
      if (allModuleIds.has(entry)) {
        errors.push(
          new ValidationErrorClass(
            `Duplicate module ID found: ${entry}`,
            `${fieldName}[${i}]`,
            'Section 4',
          ),
        );
      }
      allModuleIds.add(entry);
      continue;
    }

    // Handle ModuleGroup object
    if (!entry || typeof entry !== 'object') {
      errors.push(
        new ValidationErrorClass(
          `Module group at index ${i} must be a string or object`,
          `${fieldName}[${i}]`,
          'Section 4',
        ),
      );
      continue;
    }

    // Get module IDs from either 'ids' (v2.0) or 'modules' (v1.0)
    const moduleIds = entry.ids || entry.modules;

    if (!Array.isArray(moduleIds) || moduleIds.length === 0) {
      errors.push(
        new ValidationErrorClass(
          `Module group ${i} must have a non-empty 'ids' or 'modules' array`,
          `${fieldName}[${i}].${entry.ids ? 'ids' : 'modules'}`,
          'Section 4',
        ),
      );
    } else {
      // Check for duplicate module IDs
      for (const id of moduleIds) {
        if (typeof id !== 'string') {
          errors.push(
            new ValidationErrorClass(
              `Module ID must be a string, found ${typeof id}`,
              `${fieldName}[${i}].${entry.ids ? 'ids' : 'modules'}`,
              'Section 4',
            ),
          );
        } else if (allModuleIds.has(id)) {
          errors.push(
            new ValidationErrorClass(
              `Duplicate module ID found across groups: ${id}`,
              `${fieldName}[${i}].${entry.ids ? 'ids' : 'modules'}`,
              'Section 4',
            ),
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

