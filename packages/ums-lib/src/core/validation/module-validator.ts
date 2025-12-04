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
  isProcessStepObject,
  isConstraintObject,
  isConstraintGroup,
  isCriterionObject,
  isCriterionGroup,
  isExampleObject,
} from '../../types/index.js';
import { ValidationError as ValidationErrorClass } from '../../utils/errors.js';
import {
  MODULE_ID_REGEX,
  COMPONENT_ID_REGEX,
  SEMVER_REGEX,
  SUPPORTED_SCHEMA_VERSIONS,
} from '../../constants.js';

// ============================================================================
// Validation Helper Functions
// ============================================================================

/**
 * Field validator configuration for validateObjectArray
 */
export interface FieldValidator {
  /** Field name to validate */
  name: string;
  /** Whether this field is required */
  required: boolean;
  /** Custom validator function (optional) */
  validator?: (value: unknown, path: string) => boolean;
}

/**
 * Validates that a value is a non-empty string.
 * @returns true if valid, false otherwise (and pushes error)
 */
export function validateNonEmptyString(
  value: unknown,
  path: string,
  fieldName: string,
  section: string,
  errors: ValidationError[]
): value is string {
  if (typeof value !== 'string' || value.trim() === '') {
    errors.push(
      new ValidationErrorClass(
        `${fieldName} must be a non-empty string`,
        path,
        section
      )
    );
    return false;
  }
  return true;
}

/**
 * Validates an array of strings (like notes arrays).
 * Only validates if the array is defined.
 */
export function validateStringArray(
  arr: unknown,
  path: string,
  fieldName: string,
  section: string,
  errors: ValidationError[]
): void {
  if (arr === undefined) return;

  if (!Array.isArray(arr)) {
    errors.push(
      new ValidationErrorClass(
        `${fieldName} must be an array of strings`,
        path,
        section
      )
    );
    return;
  }

  for (let i = 0; i < arr.length; i++) {
    const item: unknown = arr[i];
    if (typeof item !== 'string') {
      errors.push(
        new ValidationErrorClass(
          `${fieldName}[${i}] must be a string`,
          `${path}[${i}]`,
          section
        )
      );
    } else if (item.trim() === '') {
      errors.push(
        new ValidationErrorClass(
          `${fieldName}[${i}] cannot be empty`,
          `${path}[${i}]`,
          section
        )
      );
    }
  }
}

/**
 * Generic validator for arrays of objects with required string fields.
 * Reduces duplication in validation code.
 *
 * @param arr - The array to validate
 * @param path - Path prefix for error messages
 * @param itemName - Human-readable name for array items (e.g., "Concept", "Example")
 * @param fields - Array of field validators to apply
 * @param section - Spec section reference
 * @param errors - Errors array to push to
 * @param nestedValidator - Optional validator for nested structures
 */
export function validateObjectArray(
  arr: unknown,
  path: string,
  itemName: string,
  fields: FieldValidator[],
  section: string,
  errors: ValidationError[],
  nestedValidator?: (item: Record<string, unknown>, itemPath: string) => void
): void {
  if (!Array.isArray(arr)) {
    errors.push(
      new ValidationErrorClass(`${itemName}s must be an array`, path, section)
    );
    return;
  }

  for (let i = 0; i < arr.length; i++) {
    const item: unknown = arr[i];
    const itemPath = `${path}[${i}]`;

    if (!item || typeof item !== 'object') {
      errors.push(
        new ValidationErrorClass(
          `${itemName} must be an object`,
          itemPath,
          section
        )
      );
      continue;
    }

    const obj = item as Record<string, unknown>;

    // Validate configured fields
    for (const field of fields) {
      const value = obj[field.name];
      const fieldPath = `${itemPath}.${field.name}`;

      if (field.required) {
        if (typeof value !== 'string' || value.trim() === '') {
          errors.push(
            new ValidationErrorClass(
              `${itemName} must have a non-empty ${field.name} field`,
              fieldPath,
              section
            )
          );
        }
      }

      // Apply custom validator if provided
      if (field.validator && value !== undefined) {
        field.validator(value, fieldPath);
      }
    }

    // Apply nested validator if provided
    if (nestedValidator) {
      nestedValidator(obj, itemPath);
    }
  }
}

/**
 * Validates Knowledge component content fields (concepts, examples, patterns).
 * @param knowledge - The knowledge content object to validate
 * @param path - Path prefix for error messages
 * @param errors - Errors array to push to
 */
function validateKnowledgeContent(
  knowledge: {
    explanation: string;
    concepts?: unknown[];
    examples?: unknown[];
    patterns?: unknown[];
  },
  path: string,
  errors: ValidationError[]
): void {
  const section = 'Section 2.2';

  // Validate concepts array if present
  if (knowledge.concepts !== undefined) {
    validateObjectArray(
      knowledge.concepts,
      `${path}.concepts`,
      'Concept',
      [
        { name: 'name', required: true },
        { name: 'description', required: true },
      ],
      section,
      errors,
      (obj, itemPath) => {
        // Validate concept.examples if present (can be string | Example)
        if (obj.examples !== undefined) {
          if (!Array.isArray(obj.examples)) {
            errors.push(
              new ValidationErrorClass(
                'Concept examples must be an array',
                `${itemPath}.examples`,
                section
              )
            );
          } else {
            validateNestedExamples(
              obj.examples,
              `${itemPath}.examples`,
              errors
            );
          }
        }
      }
    );
  }

  // Validate examples array if present
  if (knowledge.examples !== undefined) {
    validateObjectArray(
      knowledge.examples,
      `${path}.examples`,
      'Example',
      [
        { name: 'title', required: true },
        { name: 'rationale', required: true },
        { name: 'snippet', required: true },
      ],
      section,
      errors
    );
  }

  // Validate patterns array if present
  if (knowledge.patterns !== undefined) {
    validateObjectArray(
      knowledge.patterns,
      `${path}.patterns`,
      'Pattern',
      [
        { name: 'name', required: true },
        { name: 'useCase', required: true },
        { name: 'description', required: true },
      ],
      section,
      errors,
      (obj, itemPath) => {
        // Validate pattern.examples if present (can be string | Example)
        if (obj.examples !== undefined) {
          if (!Array.isArray(obj.examples)) {
            errors.push(
              new ValidationErrorClass(
                'Pattern examples must be an array',
                `${itemPath}.examples`,
                section
              )
            );
          } else {
            validateNestedExamples(
              obj.examples,
              `${itemPath}.examples`,
              errors
            );
          }
        }
      }
    );
  }
}

/**
 * Validates examples array within Concept or Pattern (can be string | Example).
 * @param examples - Array of examples to validate
 * @param path - Path prefix for error messages
 * @param errors - Errors array to push to
 */
function validateNestedExamples(
  examples: unknown[],
  path: string,
  errors: ValidationError[]
): void {
  for (let i = 0; i < examples.length; i++) {
    const example = examples[i];
    const examplePath = `${path}[${i}]`;

    if (typeof example === 'string') {
      // Simple string example - valid if non-empty
      if (example.trim() === '') {
        errors.push(
          new ValidationErrorClass(
            'Example cannot be an empty string',
            examplePath,
            'Section 2.2'
          )
        );
      }
    } else if (isExampleObject(example)) {
      // Full Example object - validate required fields are non-empty
      if (example.title.trim() === '') {
        errors.push(
          new ValidationErrorClass(
            'Example title cannot be empty',
            `${examplePath}.title`,
            'Section 2.2'
          )
        );
      }
      if (example.rationale.trim() === '') {
        errors.push(
          new ValidationErrorClass(
            'Example rationale cannot be empty',
            `${examplePath}.rationale`,
            'Section 2.2'
          )
        );
      }
      if (example.snippet.trim() === '') {
        errors.push(
          new ValidationErrorClass(
            'Example snippet cannot be empty',
            `${examplePath}.snippet`,
            'Section 2.2'
          )
        );
      }
    } else {
      errors.push(
        new ValidationErrorClass(
          'Example must be a string or an object with {title, rationale, snippet}',
          examplePath,
          'Section 2.2'
        )
      );
    }
  }
}

/**
 * Validates ProcessStep structures (v2.1 simplified format)
 * @param steps - Array of process steps
 * @param path - Path prefix for error messages
 * @param errors - Errors array to push to
 */
function validateProcessSteps(
  steps: unknown[],
  path: string,
  errors: ValidationError[]
): void {
  const section = 'Section 3.1';
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const stepPath = `${path}[${i}]`;

    if (typeof step === 'string') {
      if (step.trim() === '') {
        errors.push(
          new ValidationErrorClass(
            'Process step cannot be an empty string',
            stepPath,
            section
          )
        );
      }
    } else if (isProcessStepObject(step)) {
      if (step.step.trim() === '') {
        errors.push(
          new ValidationErrorClass(
            'Process step.step cannot be empty',
            `${stepPath}.step`,
            section
          )
        );
      }
      validateStringArray(
        step.notes,
        `${stepPath}.notes`,
        'Process step notes',
        section,
        errors
      );
    } else {
      errors.push(
        new ValidationErrorClass(
          'Process step must be a string or an object with {step, notes?}',
          stepPath,
          section
        )
      );
    }
  }
}

/**
 * Validates Constraint structures (v2.1 with groups support)
 * @param constraints - Array of constraints
 * @param path - Path prefix for error messages
 * @param errors - Errors array to push to
 */
function validateConstraints(
  constraints: unknown[],
  path: string,
  errors: ValidationError[]
): void {
  const section = 'Section 3.2';
  for (let i = 0; i < constraints.length; i++) {
    const constraint = constraints[i];
    const constraintPath = `${path}[${i}]`;

    if (typeof constraint === 'string') {
      if (constraint.trim() === '') {
        errors.push(
          new ValidationErrorClass(
            'Constraint cannot be an empty string',
            constraintPath,
            section
          )
        );
      }
    } else if (isConstraintGroup(constraint)) {
      validateNonEmptyString(
        constraint.group,
        `${constraintPath}.group`,
        'Constraint group name',
        section,
        errors
      );
      if (!Array.isArray(constraint.rules) || constraint.rules.length === 0) {
        errors.push(
          new ValidationErrorClass(
            'Constraint group must have a non-empty rules array',
            `${constraintPath}.rules`,
            section
          )
        );
      } else {
        validateConstraintRules(
          constraint.rules,
          `${constraintPath}.rules`,
          errors
        );
      }
    } else if (isConstraintObject(constraint)) {
      if (constraint.rule.trim() === '') {
        errors.push(
          new ValidationErrorClass(
            'Constraint rule cannot be empty',
            `${constraintPath}.rule`,
            section
          )
        );
      }
      validateStringArray(
        constraint.notes,
        `${constraintPath}.notes`,
        'Constraint notes',
        section,
        errors
      );
    } else {
      errors.push(
        new ValidationErrorClass(
          'Constraint must be a string, object with {rule, notes?}, or object with {group, rules}',
          constraintPath,
          section
        )
      );
    }
  }
}

/**
 * Validates constraint rules within a ConstraintGroup (string or ConstraintObject)
 */
function validateConstraintRules(
  rules: unknown[],
  path: string,
  errors: ValidationError[]
): void {
  const section = 'Section 3.2';
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    const rulePath = `${path}[${i}]`;

    if (typeof rule === 'string') {
      if (rule.trim() === '') {
        errors.push(
          new ValidationErrorClass(
            'Constraint rule cannot be an empty string',
            rulePath,
            section
          )
        );
      }
    } else if (isConstraintObject(rule)) {
      if (rule.rule.trim() === '') {
        errors.push(
          new ValidationErrorClass(
            'Constraint rule cannot be empty',
            `${rulePath}.rule`,
            section
          )
        );
      }
      validateStringArray(
        rule.notes,
        `${rulePath}.notes`,
        'Constraint notes',
        section,
        errors
      );
    } else {
      errors.push(
        new ValidationErrorClass(
          'Constraint rule must be a string or object with {rule, notes?}',
          rulePath,
          section
        )
      );
    }
  }
}

/**
 * Validates Criterion structures (v2.1 with category and group support)
 * @param criteria - Array of criteria
 * @param path - Path prefix for error messages
 * @param errors - Errors array to push to
 */
function validateCriteria(
  criteria: unknown[],
  path: string,
  errors: ValidationError[]
): void {
  const section = 'Section 3.3';
  for (let i = 0; i < criteria.length; i++) {
    const criterion = criteria[i];
    const criterionPath = `${path}[${i}]`;

    if (typeof criterion === 'string') {
      if (criterion.trim() === '') {
        errors.push(
          new ValidationErrorClass(
            'Criterion cannot be an empty string',
            criterionPath,
            section
          )
        );
      }
    } else if (isCriterionGroup(criterion)) {
      validateNonEmptyString(
        criterion.group,
        `${criterionPath}.group`,
        'Criterion group name',
        section,
        errors
      );
      if (!Array.isArray(criterion.items) || criterion.items.length === 0) {
        errors.push(
          new ValidationErrorClass(
            'Criterion group must have a non-empty items array',
            `${criterionPath}.items`,
            section
          )
        );
      } else {
        validateCriterionItems(
          criterion.items,
          `${criterionPath}.items`,
          errors
        );
      }
    } else if (isCriterionObject(criterion)) {
      if (criterion.item.trim() === '') {
        errors.push(
          new ValidationErrorClass(
            'Criterion item cannot be empty',
            `${criterionPath}.item`,
            section
          )
        );
      }
      if (criterion.category !== undefined) {
        validateNonEmptyString(
          criterion.category,
          `${criterionPath}.category`,
          'Criterion category',
          section,
          errors
        );
      }
      validateStringArray(
        criterion.notes,
        `${criterionPath}.notes`,
        'Criterion notes',
        section,
        errors
      );
    } else {
      errors.push(
        new ValidationErrorClass(
          'Criterion must be a string, object with {item, category?, notes?}, or object with {group, items}',
          criterionPath,
          section
        )
      );
    }
  }
}

/**
 * Validates criterion items within a CriterionGroup (string or CriterionObject)
 */
function validateCriterionItems(
  items: unknown[],
  path: string,
  errors: ValidationError[]
): void {
  const section = 'Section 3.3';
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemPath = `${path}[${i}]`;

    if (typeof item === 'string') {
      if (item.trim() === '') {
        errors.push(
          new ValidationErrorClass(
            'Criterion item cannot be an empty string',
            itemPath,
            section
          )
        );
      }
    } else if (isCriterionObject(item)) {
      if (item.item.trim() === '') {
        errors.push(
          new ValidationErrorClass(
            'Criterion item cannot be empty',
            `${itemPath}.item`,
            section
          )
        );
      }
      validateStringArray(
        item.notes,
        `${itemPath}.notes`,
        'Criterion notes',
        section,
        errors
      );
    } else {
      errors.push(
        new ValidationErrorClass(
          'Criterion item must be a string or object with {item, category?, notes?}',
          itemPath,
          section
        )
      );
    }
  }
}

/**
 * Validates directive structures in an instruction component
 * @param instruction - The instruction object to validate
 * @param path - Path prefix for error messages
 * @param errors - Errors array to push to
 */
function validateDirectives(
  instruction: {
    process?: unknown[];
    constraints?: unknown[];
    criteria?: unknown[];
  },
  path: string,
  errors: ValidationError[]
): void {
  if (instruction.process && Array.isArray(instruction.process)) {
    validateProcessSteps(instruction.process, `${path}.process`, errors);
  }
  if (instruction.constraints && Array.isArray(instruction.constraints)) {
    validateConstraints(instruction.constraints, `${path}.constraints`, errors);
  }
  if (instruction.criteria && Array.isArray(instruction.criteria)) {
    validateCriteria(instruction.criteria, `${path}.criteria`, errors);
  }
}

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

/**
 * Validates a parsed UMS v2.1 module object.
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

  // Validate schema version using shared constant
  if (
    !SUPPORTED_SCHEMA_VERSIONS.includes(
      module.schemaVersion as (typeof SUPPORTED_SCHEMA_VERSIONS)[number]
    )
  ) {
    errors.push(
      new ValidationErrorClass(
        `Invalid schema version: ${module.schemaVersion}, expected one of: ${SUPPORTED_SCHEMA_VERSIONS.join(', ')}`,
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
  } else {
    // Validate each capability is a non-empty string
    for (let i = 0; i < module.capabilities.length; i++) {
      const cap = module.capabilities[i];
      if (typeof cap !== 'string' || cap.trim() === '') {
        errors.push(
          new ValidationErrorClass(
            `Capability at index ${i} must be a non-empty string`,
            `capabilities[${i}]`,
            'Section 2.1'
          )
        );
      }
    }
  }

  // Validate domain field if present
  if (module.domain !== undefined) {
    if (typeof module.domain === 'string') {
      if (module.domain.trim() === '') {
        errors.push(
          new ValidationErrorClass(
            'Module domain cannot be an empty string',
            'domain',
            'Section 2.1'
          )
        );
      }
    } else if (Array.isArray(module.domain)) {
      if (module.domain.length === 0) {
        errors.push(
          new ValidationErrorClass(
            'Module domain array cannot be empty',
            'domain',
            'Section 2.1'
          )
        );
      } else {
        for (let i = 0; i < module.domain.length; i++) {
          const d = module.domain[i];
          if (typeof d !== 'string' || d.trim() === '') {
            errors.push(
              new ValidationErrorClass(
                `Domain at index ${i} must be a non-empty string`,
                `domain[${i}]`,
                'Section 2.1'
              )
            );
          }
        }
      }
    } else {
      errors.push(
        new ValidationErrorClass(
          'Module domain must be a string or array of strings',
          'domain',
          'Section 2.1'
        )
      );
    }
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
  // Note: metadata.semantic is optional per spec Section 2.3

  // Validate metadata.semantic is not whitespace-only if present
  if (
    module.metadata.semantic !== undefined &&
    typeof module.metadata.semantic === 'string' &&
    module.metadata.semantic.trim() === ''
  ) {
    warnings.push({
      path: 'metadata.semantic',
      message: 'metadata.semantic should not be whitespace-only',
    });
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
    // Validate tags are not whitespace-only
    for (let i = 0; i < module.metadata.tags.length; i++) {
      const tag = module.metadata.tags[i];
      if (typeof tag === 'string' && tag.trim() === '') {
        errors.push(
          new ValidationErrorClass(
            'Tag cannot be whitespace-only',
            `metadata.tags[${i}]`,
            'Section 2.3'
          )
        );
      }
    }
  }

  // Validate replacedBy format if present
  const replacedByModule = module.metadata.replacedBy;
  if (replacedByModule) {
    if (!MODULE_ID_REGEX.test(replacedByModule)) {
      errors.push(
        new ValidationErrorClass(
          `Invalid replacedBy ID format: ${replacedByModule}`,
          'metadata.replacedBy',
          'Section 2.3'
        )
      );
    }
  }

  // Add deprecation warning
  const isDeprecated = module.metadata.deprecated;
  if (isDeprecated) {
    const message = replacedByModule
      ? `Module is deprecated and replaced by: ${replacedByModule}`
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
    // Validate directive structures (ProcessStep, Constraint, Criterion)
    validateDirectives(
      module.instruction.instruction,
      'instruction.instruction',
      errors
    );
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
    // Validate knowledge content fields (concepts, examples, patterns)
    validateKnowledgeContent(
      module.knowledge.knowledge,
      'knowledge.knowledge',
      errors
    );
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
        // Validate directive structures (ProcessStep, Constraint, Criterion)
        validateDirectives(
          component.instruction,
          `components[${i}].instruction`,
          errors
        );
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
        // Validate knowledge content fields (concepts, examples, patterns)
        validateKnowledgeContent(
          component.knowledge,
          `components[${i}].knowledge`,
          errors
        );
      }
    }
  }

  // Validate replacedBy requires deprecated
  const hasReplacedBy = module.metadata.replacedBy;
  const hasDeprecated = module.metadata.deprecated;
  if (hasReplacedBy && !hasDeprecated) {
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
