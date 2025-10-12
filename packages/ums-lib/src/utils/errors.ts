/**
 * Core error types and utilities for UMS library
 */

/**
 * Base error class for UMS operations
 */
export class UMSError extends Error {
  public readonly code: string;
  public readonly context?: string;

  constructor(message: string, code: string, context?: string) {
    super(message);
    this.name = 'UMSError';
    this.code = code;
    if (context !== undefined) {
      this.context = context;
    }
  }
}

/**
 * Error for validation failures
 */
export class UMSValidationError extends UMSError {
  public readonly path?: string;
  public readonly section?: string;

  constructor(
    message: string,
    path?: string,
    section?: string,
    context?: string
  ) {
    super(message, 'VALIDATION_ERROR', context);
    this.name = 'UMSValidationError';
    if (path !== undefined) {
      this.path = path;
    }
    if (section !== undefined) {
      this.section = section;
    }
  }
}

/**
 * Error for module loading failures
 */
export class ModuleLoadError extends UMSError {
  public readonly filePath?: string;

  constructor(message: string, filePath?: string, context?: string) {
    super(message, 'MODULE_LOAD_ERROR', context);
    this.name = 'ModuleLoadError';
    if (filePath !== undefined) {
      this.filePath = filePath;
    }
  }
}

/**
 * Error for persona loading failures
 */
export class PersonaLoadError extends UMSError {
  public readonly filePath?: string;

  constructor(message: string, filePath?: string, context?: string) {
    super(message, 'PERSONA_LOAD_ERROR', context);
    this.name = 'PersonaLoadError';
    if (filePath !== undefined) {
      this.filePath = filePath;
    }
  }
}

/**
 * Error for build process failures
 */
export class BuildError extends UMSError {
  constructor(message: string, context?: string) {
    super(message, 'BUILD_ERROR', context);
    this.name = 'BuildError';
  }
}

/**
 * Error for module conflicts
 */
export class ConflictError extends UMSError {
  public readonly moduleId: string;
  public readonly conflictCount: number;

  constructor(message: string, moduleId: string, conflictCount: number) {
    super(message, 'CONFLICT_ERROR');
    this.name = 'ConflictError';
    this.moduleId = moduleId;
    this.conflictCount = conflictCount;
  }
}

/**
 * Type guard to check if error is a UMS error
 */
export function isUMSError(error: unknown): error is UMSError {
  return error instanceof UMSError;
}

/**
 * Type guard to check if error is a validation error
 */
export function isValidationError(error: unknown): error is UMSValidationError {
  return error instanceof UMSValidationError;
}

// Type aliases for v2.0 spec-compliant naming
export const ValidationError = UMSValidationError;
export const ModuleParseError = ModuleLoadError;
export const PersonaParseError = PersonaLoadError;

/**
 * Validation error constants
 */
export const ID_VALIDATION_ERRORS = {
  INVALID_CHARS: 'Module ID contains invalid characters',
  EMPTY_SEGMENT: 'Module ID contains empty path segment',
  LEADING_SLASH: 'Module ID cannot start with a slash',
  TRAILING_SLASH: 'Module ID cannot end with a slash',
  CONSECUTIVE_SLASHES: 'Module ID cannot contain consecutive slashes',
  invalidFormat: (id: string) => `Invalid module ID format: ${id}`,
  uppercaseCharacters: (id: string) =>
    `Module ID contains uppercase characters: ${id}`,
  specialCharacters: (id: string) =>
    `Module ID contains special characters: ${id}`,
  invalidTier: (tier: string) =>
    `Invalid tier '${tier}'. Must be one of: foundation, principle, technology, execution`,
  emptySegment: (id: string) => `Module ID '${id}' contains empty path segment`,
  invalidCharacters: (id: string) =>
    `Module ID '${id}' contains invalid characters`,
} as const;

export const SCHEMA_VALIDATION_ERRORS = {
  MISSING_FRONTMATTER: 'Module file must contain YAML frontmatter',
  INVALID_YAML: 'Invalid YAML syntax in frontmatter',
  MISSING_REQUIRED_FIELD: 'Missing required field',
  INVALID_FIELD_TYPE: 'Invalid field type',
  INVALID_ENUM_VALUE: 'Invalid enum value',
  missingField: (field: string) => `Missing required field: ${field}`,
  wrongType: (field: string, expected: string, actual: string) =>
    `Field '${field}' expected ${expected}, got ${actual}`,
  duplicateModuleId: (id: string, group: string) =>
    `Duplicate module ID '${id}' in group '${group}'`,
  invalidEnumValue: (field: string, value: string, validValues: string[]) =>
    `Invalid value '${value}' for ${field}. Valid values: ${validValues.join(', ')}`,
  wrongSchemaVersion: (version: string) =>
    `Invalid schema version '${version}', expected '1.0'`,
  invalidShape: (shape: string, validShapes: string[]) =>
    `Invalid shape '${shape}'. Valid shapes: ${validShapes.join(', ')}`,
  undeclaredDirective: (directive: string, declared: string[]) =>
    `Undeclared directive '${directive}'. Declared directives: ${declared.join(', ')}`,
  missingRequiredDirective: (directive: string) =>
    `Missing required directive: ${directive}`,
  invalidDirectiveType: (directive: string, expected: string, actual: string) =>
    `Directive '${directive}' expected ${expected}, got ${actual}`,
} as const;
