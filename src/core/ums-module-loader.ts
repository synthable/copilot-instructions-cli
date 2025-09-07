/**
 * UMS v1.0 Module loader and validator (M1)
 * Implements module parsing and validation per UMS v1.0 specification
 */

import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import {
  VALID_TIERS,
  ID_REGEX,
  UMS_SCHEMA_VERSION,
  STANDARD_SHAPES,
  type StandardShape,
  type ValidTier,
} from '../constants.js';
import {
  ID_VALIDATION_ERRORS,
  SCHEMA_VALIDATION_ERRORS,
} from '../utils/error-formatting.js';
import type {
  UMSModule,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ModuleMeta,
} from '../types/ums-v1.js';

/**
 * Loads and validates a UMS v1.0 module from file
 */
// Raw parsed YAML structure before validation
interface RawModuleData {
  id?: unknown;
  version?: unknown;
  schemaVersion?: unknown;
  shape?: unknown;
  declaredDirectives?: unknown;
  meta?: unknown;
  body?: unknown;
  [key: string]: unknown;
}

function isValidRawModuleData(data: unknown): data is RawModuleData {
  return data !== null && typeof data === 'object' && !Array.isArray(data);
}

export async function loadModule(filePath: string): Promise<UMSModule> {
  try {
    // Read and parse YAML file
    const content = await readFile(filePath, 'utf-8');
    const parsed: unknown = parse(content);

    if (!isValidRawModuleData(parsed)) {
      throw new Error('Invalid YAML: expected object at root');
    }

    // Validate the module structure
    const validation = validateModule(parsed);
    if (!validation.valid) {
      const errorMessages = validation.errors.map(e => e.message).join('\n');
      throw new Error(`Module validation failed:\n${errorMessages}`);
    }

    // Return the validated module with file path
    return {
      ...parsed,
      filePath,
    } as UMSModule;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load module from ${filePath}: ${message}`);
  }
}

/**
 * Validates required top-level keys
 */
function validateRequiredKeys(
  module: Record<string, unknown>
): ValidationError[] {
  const errors: ValidationError[] = [];
  const requiredKeys = [
    'id',
    'version',
    'schemaVersion',
    'shape',
    'declaredDirectives',
    'meta',
    'body',
  ];

  for (const key of requiredKeys) {
    if (!(key in module)) {
      errors.push({
        path: key,
        message: SCHEMA_VALIDATION_ERRORS.missingField(key),
        section: 'Section 2.1',
      });
    }
  }

  return errors;
}

/**
 * Validates version and schemaVersion fields
 */
function validateVersionFields(
  module: Record<string, unknown>
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate version field
  if ('version' in module) {
    if (typeof module.version !== 'string') {
      errors.push({
        path: 'version',
        message: SCHEMA_VALIDATION_ERRORS.wrongType(
          'version',
          'string',
          typeof module.version
        ),
        section: 'Section 2.1',
      });
    }
    // Note: Version is present but ignored for resolution in v1.0
  }

  // Validate schemaVersion field (Section 2.1)
  if ('schemaVersion' in module) {
    if (module.schemaVersion !== UMS_SCHEMA_VERSION) {
      errors.push({
        path: 'schemaVersion',
        message: SCHEMA_VALIDATION_ERRORS.wrongSchemaVersion(
          String(module.schemaVersion)
        ),
        section: 'Section 2.1',
      });
    }
  }

  return errors;
}

/**
 * Validates deprecation warnings
 */
function validateDeprecation(
  module: Record<string, unknown>
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  if ('meta' in module) {
    const meta = module.meta as ModuleMeta;
    if (meta?.deprecated) {
      const replacedBy = meta.replacedBy;
      const message = replacedBy
        ? `Module is deprecated and replaced by '${replacedBy}'`
        : 'Module is deprecated';
      warnings.push({
        path: 'meta.deprecated',
        message,
      });
    }
  }

  return warnings;
}

/**
 * Validates a parsed UMS v1.0 module object
 */
export function validateModule(obj: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!obj || typeof obj !== 'object') {
    errors.push({
      path: '',
      message: 'Module must be an object',
      section: 'Section 2.1',
    });
    return { valid: false, errors, warnings };
  }

  const module = obj as Record<string, unknown>;

  // Validate top-level required keys (Section 2.1)
  errors.push(...validateRequiredKeys(module));

  // Validate id field (Section 3)
  if ('id' in module) {
    const idValidation = validateId(module.id as string);
    if (!idValidation.valid) {
      errors.push(...idValidation.errors);
    }
  }

  // Validate version and schema version fields
  errors.push(...validateVersionFields(module));

  // Validate shape and declaredDirectives (Section 2.5)
  if ('shape' in module && 'declaredDirectives' in module) {
    const shapeValidation = validateShapeAndDirectives(
      module.shape,
      module.declaredDirectives
    );
    errors.push(...shapeValidation.errors);
    warnings.push(...shapeValidation.warnings);
  }

  // Validate meta block (Section 2.2)
  if ('meta' in module) {
    const metaValidation = validateMeta(module.meta);
    errors.push(...metaValidation.errors);
    warnings.push(...metaValidation.warnings);
  }

  // Check for deprecation warnings
  warnings.push(...validateDeprecation(module));

  // Validate body against declared directives (Section 4)
  if ('body' in module && 'declaredDirectives' in module) {
    const bodyValidation = validateBody(module.body, module.declaredDirectives);
    errors.push(...bodyValidation.errors);
    warnings.push(...bodyValidation.warnings);
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validates module ID against UMS v1.0 regex and constraints (Section 3)
 */
function validateId(id: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (typeof id !== 'string') {
    errors.push({
      path: 'id',
      message: SCHEMA_VALIDATION_ERRORS.wrongType('id', 'string', typeof id),
      section: 'Section 3.1',
    });
    return { valid: false, errors, warnings: [] };
  }

  if (!ID_REGEX.test(id)) {
    // Provide specific error based on what's wrong
    if (id.includes('/')) {
      const parts = id.split('/');
      const tier = parts[0];

      // Check for uppercase first as it's the most specific issue
      if (id !== id.toLowerCase()) {
        errors.push({
          path: 'id',
          message: ID_VALIDATION_ERRORS.uppercaseCharacters(id),
          section: 'Section 3.3',
        });
      } else if (!VALID_TIERS.includes(tier as ValidTier)) {
        errors.push({
          path: 'id',
          message: ID_VALIDATION_ERRORS.invalidTier(tier, [...VALID_TIERS]),
          section: 'Section 3.2',
        });
      } else if (id.includes('//') || id.startsWith('/') || id.endsWith('/')) {
        errors.push({
          path: 'id',
          message: ID_VALIDATION_ERRORS.emptySegment(id),
          section: 'Section 3.3',
        });
      } else {
        errors.push({
          path: 'id',
          message: ID_VALIDATION_ERRORS.invalidCharacters(id),
          section: 'Section 3.3',
        });
      }
    } else {
      errors.push({
        path: 'id',
        message: ID_VALIDATION_ERRORS.invalidFormat(id),
        section: 'Section 3.2',
      });
    }
  }

  return { valid: errors.length === 0, errors, warnings: [] };
}

/**
 * Validates shape and declaredDirectives consistency
 */
function validateShapeAndDirectives(
  shape: unknown,
  declaredDirectives: unknown
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (typeof shape !== 'string') {
    errors.push({
      path: 'shape',
      message: SCHEMA_VALIDATION_ERRORS.wrongType(
        'shape',
        'string',
        typeof shape
      ),
      section: 'Section 2.5',
    });
    return { valid: false, errors, warnings };
  }

  if (!declaredDirectives || typeof declaredDirectives !== 'object') {
    errors.push({
      path: 'declaredDirectives',
      message: SCHEMA_VALIDATION_ERRORS.wrongType(
        'declaredDirectives',
        'object',
        typeof declaredDirectives
      ),
      section: 'Section 2.5',
    });
    return { valid: false, errors, warnings };
  }

  const directives = declaredDirectives as Record<string, unknown>;

  // Validate required/optional structure
  if (!('required' in directives) || !Array.isArray(directives.required)) {
    errors.push({
      path: 'declaredDirectives.required',
      message: 'declaredDirectives.required must be an array',
      section: 'Section 2.5',
    });
  }

  if (!('optional' in directives) || !Array.isArray(directives.optional)) {
    errors.push({
      path: 'declaredDirectives.optional',
      message: 'declaredDirectives.optional must be an array',
      section: 'Section 2.5',
    });
  }

  // Check if shape matches standard shapes
  if (shape in STANDARD_SHAPES) {
    const standardShape = STANDARD_SHAPES[shape as StandardShape];
    const required = directives.required as string[];

    // Compare with standard directive sets (informational warning only)
    const expectedRequiredSet = new Set(
      standardShape.required as unknown as string[]
    );
    const expectedOptionalSet = new Set(
      standardShape.optional as unknown as string[]
    );
    const actualRequiredSet = new Set(required);

    const missingRequired = (
      standardShape.required as unknown as string[]
    ).filter(d => !actualRequiredSet.has(d));
    const unexpectedRequired = required.filter(
      d => !expectedRequiredSet.has(d) && !expectedOptionalSet.has(d)
    );

    if (missingRequired.length > 0 || unexpectedRequired.length > 0) {
      warnings.push({
        path: 'shape',
        message: `Standard shape '${shape}' typically requires [${(standardShape.required as unknown as string[]).join(', ')}] and allows [${(standardShape.optional as unknown as string[]).join(', ')}], but found different directive set`,
      });
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validates required meta fields
 */
function validateRequiredMetaFields(
  metaObj: Record<string, unknown>
): ValidationError[] {
  const errors: ValidationError[] = [];
  const requiredMetaFields = ['name', 'description', 'semantic'];

  for (const field of requiredMetaFields) {
    if (!(field in metaObj)) {
      errors.push({
        path: `meta.${field}`,
        message: SCHEMA_VALIDATION_ERRORS.missingField(field),
        section: 'Section 2.2',
      });
    } else if (typeof metaObj[field] !== 'string') {
      errors.push({
        path: `meta.${field}`,
        message: SCHEMA_VALIDATION_ERRORS.wrongType(
          field,
          'string',
          typeof metaObj[field]
        ),
        section: 'Section 2.2',
      });
    }
  }

  return errors;
}

/**
 * Validates optional tags field
 */
function validateMetaTags(metaObj: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  if ('tags' in metaObj && metaObj.tags !== undefined) {
    if (!Array.isArray(metaObj.tags)) {
      errors.push({
        path: 'meta.tags',
        message: SCHEMA_VALIDATION_ERRORS.wrongType(
          'tags',
          'array',
          typeof metaObj.tags
        ),
        section: 'Section 2.2',
      });
    } else {
      const tags = metaObj.tags as unknown[];
      tags.forEach((tag, index) => {
        if (typeof tag !== 'string') {
          errors.push({
            path: `meta.tags[${index}]`,
            message: `Tag at index ${index} must be a string`,
            section: 'Section 2.2',
          });
        } else if (tag !== tag.toLowerCase()) {
          errors.push({
            path: `meta.tags[${index}]`,
            message: `Tag '${tag}' must be lowercase`,
            section: 'Section 2.2',
          });
        }
      });
    }
  }

  return errors;
}

/**
 * Validates deprecated/replacedBy constraint
 */
function validateDeprecatedReplacedBy(
  metaObj: Record<string, unknown>
): ValidationError[] {
  const errors: ValidationError[] = [];

  if ('deprecated' in metaObj && metaObj.deprecated === true) {
    if ('replacedBy' in metaObj) {
      if (typeof metaObj.replacedBy !== 'string') {
        errors.push({
          path: 'meta.replacedBy',
          message: SCHEMA_VALIDATION_ERRORS.wrongType(
            'replacedBy',
            'string',
            typeof metaObj.replacedBy
          ),
          section: 'Section 2.2',
        });
      } else {
        // Validate replacedBy is a valid module ID
        const replacedByValidation = validateId(metaObj.replacedBy);
        if (!replacedByValidation.valid) {
          errors.push({
            path: 'meta.replacedBy',
            message: `replacedBy must be a valid module ID: ${replacedByValidation.errors[0]?.message}`,
            section: 'Section 2.2',
          });
        }
      }
    }
  } else if ('replacedBy' in metaObj) {
    errors.push({
      path: 'meta.replacedBy',
      message: 'replacedBy field must not be present unless deprecated is true',
      section: 'Section 2.2',
    });
  }

  return errors;
}

/**
 * Validates module metadata block (Section 2.2)
 */
function validateMeta(meta: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!meta || typeof meta !== 'object') {
    errors.push({
      path: 'meta',
      message: SCHEMA_VALIDATION_ERRORS.wrongType(
        'meta',
        'object',
        typeof meta
      ),
      section: 'Section 2.2',
    });
    return { valid: false, errors, warnings };
  }

  const metaObj = meta as Record<string, unknown>;

  // Validate required meta fields
  errors.push(...validateRequiredMetaFields(metaObj));

  // Validate optional tags field
  errors.push(...validateMetaTags(metaObj));

  // Validate deprecated/replacedBy constraint
  errors.push(...validateDeprecatedReplacedBy(metaObj));

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validates module body against declared directives (Section 4)
 */
function validateBody(
  body: unknown,
  declaredDirectives: unknown
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!body || typeof body !== 'object') {
    errors.push({
      path: 'body',
      message: SCHEMA_VALIDATION_ERRORS.wrongType(
        'body',
        'object',
        typeof body
      ),
      section: 'Section 4',
    });
    return { valid: false, errors, warnings };
  }

  if (!declaredDirectives || typeof declaredDirectives !== 'object') {
    return { valid: false, errors, warnings };
  }

  const bodyObj = body as Record<string, unknown>;
  const directives = declaredDirectives as {
    required: string[];
    optional: string[];
  };

  if (
    !Array.isArray(directives.required) ||
    !Array.isArray(directives.optional)
  ) {
    return { valid: false, errors, warnings };
  }

  const allowedDirectives = new Set([
    ...directives.required,
    ...directives.optional,
  ]);
  const presentDirectives = new Set(Object.keys(bodyObj));

  // Check for undeclared directive keys
  for (const directive of presentDirectives) {
    if (!allowedDirectives.has(directive)) {
      errors.push({
        path: `body.${directive}`,
        message: SCHEMA_VALIDATION_ERRORS.undeclaredDirective(directive, [
          ...allowedDirectives,
        ]),
        section: 'Section 4',
      });
    }
  }

  // Check for missing required directives
  for (const required of directives.required) {
    if (!presentDirectives.has(required)) {
      errors.push({
        path: `body.${required}`,
        message: SCHEMA_VALIDATION_ERRORS.missingRequiredDirective(required),
        section: 'Section 4',
      });
    }
  }

  // Validate directive types (Section 4.1)
  for (const [directive, value] of Object.entries(bodyObj)) {
    const directiveValidation = validateDirectiveType(directive, value);
    if (!directiveValidation.valid) {
      directiveValidation.errors.forEach(error => {
        errors.push({
          ...error,
          path: `body.${error.path}`,
          section: 'Section 4.1',
        });
      });
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validates individual directive types (Section 4.1)
 */
function validateDirectiveType(
  directive: string,
  value: unknown
): ValidationResult {
  const errors: ValidationError[] = [];

  switch (directive) {
    case 'goal':
      if (typeof value !== 'string') {
        errors.push({
          path: directive,
          message: SCHEMA_VALIDATION_ERRORS.invalidDirectiveType(
            directive,
            'string'
          ),
        });
      }
      break;

    case 'process':
    case 'constraints':
    case 'principles':
    case 'criteria':
      if (!Array.isArray(value)) {
        errors.push({
          path: directive,
          message: SCHEMA_VALIDATION_ERRORS.invalidDirectiveType(
            directive,
            'array of strings'
          ),
        });
      } else {
        value.forEach((item, index) => {
          if (typeof item !== 'string') {
            errors.push({
              path: `${directive}[${index}]`,
              message: `Item at index ${index} must be a string`,
            });
          }
        });
      }
      break;

    case 'data':
      const dataValidation = validateDataDirective(value);
      errors.push(...dataValidation.errors);
      break;

    case 'examples':
      const examplesValidation = validateExamplesDirective(value);
      errors.push(...examplesValidation.errors);
      break;
  }

  return { valid: errors.length === 0, errors, warnings: [] };
}

/**
 * Validates data directive structure (Section 4.2)
 */
function validateDataDirective(value: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!value || typeof value !== 'object') {
    errors.push({
      path: 'data',
      message: 'data directive must be an object',
    });
    return { valid: false, errors, warnings: [] };
  }

  const data = value as Record<string, unknown>;

  if (!('mediaType' in data) || typeof data.mediaType !== 'string') {
    errors.push({
      path: 'data.mediaType',
      message: 'data.mediaType is required and must be a string',
    });
  }

  if (!('value' in data) || typeof data.value !== 'string') {
    errors.push({
      path: 'data.value',
      message: 'data.value is required and must be a string',
    });
  }

  return { valid: errors.length === 0, errors, warnings: [] };
}

/**
 * Validates examples directive structure (Section 4.3)
 */
function validateExamplesDirective(value: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!Array.isArray(value)) {
    errors.push({
      path: 'examples',
      message: 'examples directive must be an array',
    });
    return { valid: false, errors, warnings: [] };
  }

  const titles = new Set<string>();

  value.forEach((example, index) => {
    if (!example || typeof example !== 'object') {
      errors.push({
        path: `examples[${index}]`,
        message: `Example at index ${index} must be an object`,
      });
      return;
    }

    const ex = example as Record<string, unknown>;

    // Validate required fields
    const requiredFields = ['title', 'rationale', 'snippet'];
    for (const field of requiredFields) {
      if (!(field in ex) || typeof ex[field] !== 'string') {
        errors.push({
          path: `examples[${index}].${field}`,
          message: `examples[${index}].${field} is required and must be a string`,
        });
      }
    }

    // Check for unique titles
    if ('title' in ex && typeof ex.title === 'string') {
      if (titles.has(ex.title)) {
        errors.push({
          path: `examples[${index}].title`,
          message: `Duplicate title '${ex.title}'. Titles must be unique within a module`,
        });
      }
      titles.add(ex.title);
    }

    // Validate optional language field
    if (
      'language' in ex &&
      ex.language !== undefined &&
      typeof ex.language !== 'string'
    ) {
      errors.push({
        path: `examples[${index}].language`,
        message: `examples[${index}].language must be a string if present`,
      });
    }
  });

  return { valid: errors.length === 0, errors, warnings: [] };
}
