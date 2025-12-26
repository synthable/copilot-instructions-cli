/**
 * Validation Service
 *
 * Thin facade over ums-sdk validateAll functionality.
 * Provides dependency injection point for handlers.
 */

import {
  validateAll,
  type ValidateOptions,
  type ValidationReport,
} from 'ums-sdk';

/**
 * Service for validating modules and personas
 */
export class ValidationService {
  /**
   * Validate all modules and personas in the workspace
   * @param options - Validation options
   * @returns Validation report with errors and warnings
   */
  async validateAll(options?: ValidateOptions): Promise<ValidationReport> {
    return validateAll(options);
  }
}
