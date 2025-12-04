/**
 * UMS v2.2 Module Validation
 * Implements module validation per UMS v2.2 specification
 */

import {
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
  type Module,
  type Component,
  CognitiveLevel,
  ComponentType,
} from '../../types/index.js';
import { ValidationError as ValidationErrorClass } from '../../utils/errors.js';
import { MODULE_ID_REGEX } from '../../constants.js';

/** Regex for validating component IDs (v2.2) */
const COMPONENT_ID_REGEX = /^[a-z0-9][a-z0-9-]*$/;

/**
 * Validates v2.2 component metadata fields (id and tags).
 * @param component - The component to validate
 * @param path - The path prefix for error messages
 * @param errors - The errors array to push to
 */
function validateComponentMetadata(
  component: Component,
  path: string,
  errors: ValidationError[]
): void {
  // Validate component id format if present (v2.2)
  if (component.id !== undefined) {
    if (
      typeof component.id !== 'string' ||
      !COMPONENT_ID_REGEX.test(component.id)
    ) {
      errors.push(
        new ValidationErrorClass(
          `Invalid component id format: ${component.id}. Must be lowercase alphanumeric with hyphens.`,
          `${path}.id`,
          'Section 2.2 (v2.2)'
        )
      );
    }
  }

  // Validate component tags are lowercase if present (v2.2)
  if (component.tags !== undefined) {
    if (!Array.isArray(component.tags)) {
      errors.push(
        new ValidationErrorClass(
          'Component tags must be an array of strings',
          `${path}.tags`,
          'Section 2.2 (v2.2)'
        )
      );
    } else {
      const invalidTags = component.tags.filter(
        tag => typeof tag !== 'string' || tag !== tag.toLowerCase()
      );
      if (invalidTags.length > 0) {
        errors.push(
          new ValidationErrorClass(
            `Component tags must be lowercase strings: ${invalidTags.join(', ')}`,
            `${path}.tags`,
            'Section 2.2 (v2.2)'
          )
        );
      }
    }
  }
}

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

  // Validate schema version (v2.0, v2.1, and v2.2 supported)
  if (
    module.schemaVersion !== '2.0' &&
    module.schemaVersion !== '2.1' &&
    module.schemaVersion !== '2.2'
  ) {
    errors.push(
      new ValidationErrorClass(
        `Invalid schema version: ${module.schemaVersion}, expected '2.0', '2.1', or '2.2'`,
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

  // Validate cognitive level (guaranteed to exist after parseModule, validate semantics only)
  // Validate it's an integer
  if (!Number.isInteger(module.cognitiveLevel)) {
    errors.push(
      new ValidationErrorClass(
        `cognitiveLevel must be an integer, got: ${module.cognitiveLevel}`,
        'cognitiveLevel',
        'Section 2.1'
      )
    );
  }
  // Validate it's a valid CognitiveLevel enum value (0-6)
  const validLevels = [
    CognitiveLevel.AXIOMS_AND_ETHICS,
    CognitiveLevel.REASONING_FRAMEWORKS,
    CognitiveLevel.UNIVERSAL_PATTERNS,
    CognitiveLevel.DOMAIN_SPECIFIC_GUIDANCE,
    CognitiveLevel.PROCEDURES_AND_PLAYBOOKS,
    CognitiveLevel.SPECIFICATIONS_AND_STANDARDS,
    CognitiveLevel.META_COGNITION,
  ];
  if (!validLevels.includes(module.cognitiveLevel)) {
    errors.push(
      new ValidationErrorClass(
        `Invalid cognitiveLevel: ${module.cognitiveLevel}. Must be a valid CognitiveLevel (0-6). See CognitiveLevel enum for valid values.`,
        'cognitiveLevel',
        'Section 2.1'
      )
    );
  }

  // Validate components exist
  const hasComponents =
    Array.isArray(module.components) && module.components.length > 0;
  const shorthandCount = [module.instruction, module.knowledge].filter(
    Boolean
  ).length;

  // Check for multiple shorthand components (mutually exclusive)
  if (shorthandCount > 1) {
    errors.push(
      new ValidationErrorClass(
        'instruction and knowledge are mutually exclusive - use components array for multiple components',
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

  // Deep component validation: validate required content fields are non-empty
  if (module.instruction) {
    const purpose = module.instruction.instruction.purpose;
    if (!purpose || typeof purpose !== 'string' || purpose.trim() === '') {
      errors.push(
        new ValidationErrorClass(
          'Instruction component must have a non-empty purpose field',
          'instruction.instruction.purpose',
          'Section 2.2'
        )
      );
    }
    // Validate v2.2 component metadata (id, tags)
    validateComponentMetadata(module.instruction, 'instruction', errors);
  }

  if (module.knowledge) {
    const explanation = module.knowledge.knowledge.explanation;
    if (
      !explanation ||
      typeof explanation !== 'string' ||
      explanation.trim() === ''
    ) {
      errors.push(
        new ValidationErrorClass(
          'Knowledge component must have a non-empty explanation field',
          'knowledge.knowledge.explanation',
          'Section 2.2'
        )
      );
    }
    // Validate v2.2 component metadata (id, tags)
    validateComponentMetadata(module.knowledge, 'knowledge', errors);
  }

  // Validate components array content if present
  if (hasComponents && module.components) {
    for (let i = 0; i < module.components.length; i++) {
      const component = module.components[i];

      // Validate v2.2 component metadata (id, tags) for all components
      validateComponentMetadata(component, `components[${i}]`, errors);

      if (component.type === ComponentType.Instruction) {
        const purpose = component.instruction.purpose;
        if (!purpose || typeof purpose !== 'string' || purpose.trim() === '') {
          errors.push(
            new ValidationErrorClass(
              `Instruction component at index ${i} must have a non-empty purpose field`,
              `components[${i}].instruction.purpose`,
              'Section 2.2'
            )
          );
        }
      } else {
        // Must be Knowledge component (only 2 component types exist)
        const explanation = component.knowledge.explanation;
        if (
          !explanation ||
          typeof explanation !== 'string' ||
          explanation.trim() === ''
        ) {
          errors.push(
            new ValidationErrorClass(
              `Knowledge component at index ${i} must have a non-empty explanation field`,
              `components[${i}].knowledge.explanation`,
              'Section 2.2'
            )
          );
        }
      }
    }
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
