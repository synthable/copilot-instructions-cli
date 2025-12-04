/**
 * UMS v2.1 Persona Validation
 * Implements persona validation per UMS v2.1 specification
 */

import {
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
  type Persona,
} from '../../types/index.js';
import { ValidationError as ValidationErrorClass } from '../../utils/errors.js';
import { SEMVER_REGEX, SUPPORTED_SCHEMA_VERSIONS } from '../../constants.js';
import {
  validateNonEmptyString,
  validateStringArray,
} from './module-validator.js';

/**
 * Validates basic persona fields (id, name, version, schemaVersion)
 */
function validatePersonaFields(
  persona: Persona,
  errors: ValidationError[]
): void {
  const section = 'Section 4.1';

  // Validate required string fields
  validateNonEmptyString(persona.id, 'id', 'Persona id', section, errors);
  validateNonEmptyString(persona.name, 'name', 'Persona name', section, errors);
  validateNonEmptyString(
    persona.description,
    'description',
    'Persona description',
    section,
    errors
  );

  // Validate schema version using shared constant
  if (
    !SUPPORTED_SCHEMA_VERSIONS.includes(
      persona.schemaVersion as (typeof SUPPORTED_SCHEMA_VERSIONS)[number]
    )
  ) {
    errors.push(
      new ValidationErrorClass(
        `Invalid schema version: ${persona.schemaVersion}, expected one of: ${SUPPORTED_SCHEMA_VERSIONS.join(', ')}`,
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

  // Validate semantic field type if present (optional in v2.1+)
  if (persona.semantic !== undefined) {
    if (typeof persona.semantic !== 'string') {
      errors.push(
        new ValidationErrorClass(
          'Persona semantic field must be a string if provided',
          'semantic',
          section
        )
      );
    } else if (persona.semantic.trim() === '') {
      errors.push(
        new ValidationErrorClass(
          'Persona semantic field cannot be whitespace-only if provided',
          'semantic',
          section
        )
      );
    }
  }

  // Validate tags array if present - must be lowercase strings
  if (persona.tags !== undefined) {
    if (!Array.isArray(persona.tags)) {
      errors.push(
        new ValidationErrorClass(
          'Persona tags must be an array of strings',
          'tags',
          section
        )
      );
    } else {
      for (let i = 0; i < persona.tags.length; i++) {
        const tag = persona.tags[i];
        if (typeof tag !== 'string' || tag.trim() === '') {
          errors.push(
            new ValidationErrorClass(
              `Tag at index ${i} must be a non-empty string`,
              `tags[${i}]`,
              section
            )
          );
        } else if (tag !== tag.toLowerCase()) {
          errors.push(
            new ValidationErrorClass(
              `Tag at index ${i} must be lowercase: ${tag}`,
              `tags[${i}]`,
              section
            )
          );
        }
      }
    }
  }

  // Validate domains array if present
  if (persona.domains !== undefined) {
    validateStringArray(
      persona.domains,
      'domains',
      'Persona domains',
      section,
      errors
    );
  }
}

/**
 * Validates a module group entry
 */
function validateModuleGroup(
  entry: unknown,
  index: number,
  allModuleIds: Set<string>,
  errors: ValidationError[]
): void {
  // Runtime validation required: persona data comes from external files (YAML/JSON)
  // which may not conform to TypeScript types. TypeScript provides compile-time safety
  // only - we must validate at runtime to catch malformed input data.
  if (!entry || typeof entry !== 'object') {
    errors.push(
      new ValidationErrorClass(
        `Module entry at index ${index} must be a string or object`,
        `modules[${index}]`,
        'Section 4.2'
      )
    );
    return;
  }

  // Get module IDs from 'ids' array
  const moduleGroup = entry as { ids?: unknown };
  const moduleIds = moduleGroup.ids;

  // Validate group name if present
  const groupObj = entry as { group?: unknown; ids?: unknown };
  if (groupObj.group !== undefined) {
    if (typeof groupObj.group !== 'string' || groupObj.group.trim() === '') {
      errors.push(
        new ValidationErrorClass(
          `Module group at index ${index} has an empty group name`,
          `modules[${index}].group`,
          'Section 4.2'
        )
      );
    }
  }

  if (!Array.isArray(moduleIds) || moduleIds.length === 0) {
    errors.push(
      new ValidationErrorClass(
        `Module group ${index} must have a non-empty 'ids' array`,
        `modules[${index}].ids`,
        'Section 4.2'
      )
    );
  } else {
    // Check for duplicate module IDs within this group
    const groupIds = new Set<string>();
    for (const id of moduleIds) {
      if (typeof id !== 'string') {
        errors.push(
          new ValidationErrorClass(
            `Module ID must be a string, found ${typeof id}`,
            `modules[${index}].ids`,
            'Section 4.2'
          )
        );
        continue;
      }

      // Check for duplicate within same group
      if (groupIds.has(id)) {
        errors.push(
          new ValidationErrorClass(
            `Duplicate module ID within group: ${id}`,
            `modules[${index}].ids`,
            'Section 4.2'
          )
        );
      }
      groupIds.add(id);

      // Check for duplicate across groups
      if (allModuleIds.has(id)) {
        errors.push(
          new ValidationErrorClass(
            `Duplicate module ID found across groups: ${id}`,
            `modules[${index}].ids`,
            'Section 4.2'
          )
        );
      }
      allModuleIds.add(id);
    }
  }
}

/**
 * Validates a parsed UMS v2.0 persona object.
 *
 * @param persona - The persona object to validate.
 * @returns A validation result object containing errors and warnings.
 */
export function validatePersona(persona: Persona): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Validate basic persona fields
  validatePersonaFields(persona, errors);

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

    // Handle ModuleGroup object
    validateModuleGroup(entry, i, allModuleIds, errors);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
