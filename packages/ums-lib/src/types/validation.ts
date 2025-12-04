/**
 * @file Validation types for UMS v2.1.
 * @description Defines validation result structures for modules and personas.
 */

// #region Validation Types

/**
 * A validation error, indicating a violation of the UMS specification.
 */
export interface ValidationError {
  /** The path to the problematic field (e.g., "metadata.tier"). */
  path?: string;
  /** A description of the error. */
  message: string;
  /** A reference to the relevant section of the UMS specification. */
  section?: string;
}

/**
 * A validation warning, indicating a potential issue that does not violate the spec.
 */
export interface ValidationWarning {
  /** The path to the field that triggered the warning. */
  path: string;
  /** A description of the warning. */
  message: string;
}

/**
 * The result of a validation operation on a module or persona.
 */
export interface ValidationResult {
  /** True if the validation passed without errors. */
  valid: boolean;
  /** A list of validation errors. */
  errors: ValidationError[];
  /** A list of validation warnings. */
  warnings: ValidationWarning[];
}

// #endregion
