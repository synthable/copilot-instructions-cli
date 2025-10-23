/**
 * UMS v2.0 Module Validation
 * Implements module validation per UMS v2.0 specification
 */

import {
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
  type Module,
} from '../../types/index.js';
import { ValidationError as ValidationErrorClass } from '../../utils/errors.js';
import { MODULE_ID_REGEX } from '../../constants.js';

const SEMVER_REGEX =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/**
 * Validates a parsed UMS v2.0 module object.
 *
 * @param module - The module object to validate.
 * @returns A validation result object containing errors and warnings.
 */
// eslint-disable-next-line complexity, max-lines-per-function
export function validateModule(module: Module): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Validate ID format
  if (!MODULE_ID_REGEX.test(module.id)) {
    errors.push(
      new ValidationErrorClass(
        `Invalid module ID format: ${module.id}`,
        'id',
        'Section 2.1'
      )
    );
  }

  // Validate schema version
  if (module.schemaVersion !== '2.0') {
    errors.push(
      new ValidationErrorClass(
        `Invalid schema version: ${module.schemaVersion}, expected '2.0'`,
        'schemaVersion',
        'Section 2.1'
      )
    );
  }

  // Validate version format (semver)
  if (!SEMVER_REGEX.test(module.version)) {
    errors.push(
      new ValidationErrorClass(
        `Invalid version format: ${module.version}, expected SemVer (e.g., 1.0.0)`,
        'version',
        'Section 2.1'
      )
    );
  }

  // Validate capabilities
  if (!Array.isArray(module.capabilities) || module.capabilities.length === 0) {
    errors.push(
      new ValidationErrorClass(
        'Module must have at least one capability',
        'capabilities',
        'Section 2.1'
      )
    );
  }

  // Validate metadata exists (runtime check for malformed data)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!module.metadata || typeof module.metadata !== 'object') {
    errors.push(
      new ValidationErrorClass(
        'Missing required field: metadata',
        'metadata',
        'Section 2.3'
      )
    );
    // Can't validate metadata fields if metadata doesn't exist
    return { valid: false, errors, warnings };
  }

  // Validate metadata required fields
  if (!module.metadata.name) {
    errors.push(
      new ValidationErrorClass(
        'Missing required field: metadata.name',
        'metadata.name',
        'Section 2.3'
      )
    );
  }
  if (!module.metadata.description) {
    errors.push(
      new ValidationErrorClass(
        'Missing required field: metadata.description',
        'metadata.description',
        'Section 2.3'
      )
    );
  }
  if (!module.metadata.semantic) {
    errors.push(
      new ValidationErrorClass(
        'Missing required field: metadata.semantic',
        'metadata.semantic',
        'Section 2.3'
      )
    );
  }

  // Validate tags are lowercase if present
  if (module.metadata.tags && Array.isArray(module.metadata.tags)) {
    const uppercaseTags = module.metadata.tags.filter(
      tag => typeof tag === 'string' && tag !== tag.toLowerCase()
    );
    if (uppercaseTags.length > 0) {
      errors.push(
        new ValidationErrorClass(
          `Tags must be lowercase: ${uppercaseTags.join(', ')}`,
          'metadata.tags',
          'Section 2.3'
        )
      );
    }
  }

  // Validate replacedBy format if present
  if (module.metadata.replacedBy) {
    if (!MODULE_ID_REGEX.test(module.metadata.replacedBy)) {
      errors.push(
        new ValidationErrorClass(
          `Invalid replacedBy ID format: ${module.metadata.replacedBy}`,
          'metadata.replacedBy',
          'Section 2.3'
        )
      );
    }
  }

  // Add deprecation warning
  if (module.metadata.deprecated) {
    const message = module.metadata.replacedBy
      ? `Module is deprecated and replaced by: ${module.metadata.replacedBy}`
      : 'Module is deprecated';
    warnings.push({
      path: 'metadata.deprecated',
      message,
    });
  }

  // Validate cognitive level (if present)
  if (module.cognitiveLevel !== undefined) {
    if (![0, 1, 2, 3, 4].includes(module.cognitiveLevel)) {
      errors.push(
        new ValidationErrorClass(
          `Invalid cognitiveLevel: ${module.cognitiveLevel}, must be 0-4`,
          'cognitiveLevel',
          'Section 2.1'
        )
      );
    }
  }

  // Validate components exist
  const hasComponents =
    Array.isArray(module.components) && module.components.length > 0;
  const shorthandCount = [
    module.instruction,
    module.knowledge,
    module.data,
  ].filter(Boolean).length;

  // Check for multiple shorthand components (mutually exclusive)
  if (shorthandCount > 1) {
    errors.push(
      new ValidationErrorClass(
        'instruction, knowledge, and data are mutually exclusive - use components array for multiple components',
        'components',
        'Section 2.2'
      )
    );
  }

  if (!hasComponents && shorthandCount === 0) {
    errors.push(
      new ValidationErrorClass(
        'Module must have at least one component',
        'components',
        'Section 2.2'
      )
    );
  }

  // Warn if both components and shorthand exist
  if (hasComponents && shorthandCount > 0) {
    warnings.push({
      path: 'components',
      message:
        'Module has both components array and shorthand properties, components array will take precedence',
    });
  }

  // Validate replacedBy requires deprecated
  if (module.metadata.replacedBy && !module.metadata.deprecated) {
    errors.push(
      new ValidationErrorClass(
        'replacedBy requires deprecated: true',
        'metadata.replacedBy',
        'Section 2.3'
      )
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
