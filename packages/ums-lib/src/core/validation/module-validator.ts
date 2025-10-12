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
import {
  ValidationError as ValidationErrorClass,
} from '../../utils/errors.js';

const MODULE_ID_REGEX = /^[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*$/;
const SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;


/**
 * Validates a parsed UMS v2.0 module object.
 *
 * @param module - The module object to validate.
 * @returns A validation result object containing errors and warnings.
 */
export function validateModule(module: Module): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Validate ID format
  if (!MODULE_ID_REGEX.test(module.id)) {
    errors.push(
      new ValidationErrorClass(
        `Invalid module ID format: ${module.id}`,
        'id',
        'Section 2.1',
      ),
    );
  }

  // Validate schema version
  if (module.schemaVersion !== '2.0') {
    errors.push(
      new ValidationErrorClass(
        `Invalid schema version: ${module.schemaVersion}, expected '2.0'`,
        'schemaVersion',
        'Section 2.1',
      ),
    );
  }

  // Validate version format (semver)
  if (!SEMVER_REGEX.test(module.version)) {
    errors.push(
      new ValidationErrorClass(
        `Invalid version format: ${module.version}, expected SemVer (e.g., 1.0.0)`,
        'version',
        'Section 2.1',
      ),
    );
  }

  // Validate capabilities
  if (!Array.isArray(module.capabilities) || module.capabilities.length === 0) {
    errors.push(
      new ValidationErrorClass(
        'Module must have at least one capability',
        'capabilities',
        'Section 2.1',
      ),
    );
  }

  // Validate metadata required fields
  if (!module.metadata.name) {
    errors.push(
      new ValidationErrorClass(
        'Missing required field: metadata.name',
        'metadata.name',
        'Section 2.3',
      ),
    );
  }
  if (!module.metadata.description) {
    errors.push(
      new ValidationErrorClass(
        'Missing required field: metadata.description',
        'metadata.description',
        'Section 2.3',
      ),
    );
  }
  if (!module.metadata.semantic) {
    errors.push(
      new ValidationErrorClass(
        'Missing required field: metadata.semantic',
        'metadata.semantic',
        'Section 2.3',
      ),
    );
  }

  // Validate cognitive level (if present)
  if (module.cognitiveLevel !== undefined) {
    if (![0, 1, 2, 3, 4].includes(module.cognitiveLevel)) {
      errors.push(
        new ValidationErrorClass(
          `Invalid cognitiveLevel: ${module.cognitiveLevel}, must be 0-4`,
          'cognitiveLevel',
          'Section 2.1',
        ),
      );
    }
  }

  // Validate components exist
  const hasComponents =
    Array.isArray(module.components) && module.components.length > 0;
  const hasShorthand =
    module.instruction || module.knowledge || module.data;

  if (!hasComponents && !hasShorthand) {
    errors.push(
      new ValidationErrorClass(
        'Module must have at least one component',
        'components',
        'Section 2.2',
      ),
    );
  }

  // Warn if both components and shorthand exist
  if (hasComponents && hasShorthand) {
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
        'Section 2.3',
      ),
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

