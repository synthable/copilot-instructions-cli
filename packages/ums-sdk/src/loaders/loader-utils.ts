/**
 * Shared utilities for module and persona loaders
 */

import { pathToFileURL } from 'node:url';
import type { ValidationResult } from 'ums-lib';

/**
 * Convert file path to file URL for dynamic import
 * @param filePath - Absolute path to file
 * @returns File URL string suitable for dynamic import
 */
export function filePathToUrl(filePath: string): string {
  return pathToFileURL(filePath).href;
}

/**
 * Format validation errors into a single error message
 * @param validation - Validation result from ums-lib
 * @param defaultPath - Default path to use if error has no path (e.g., 'module', 'persona')
 * @returns Formatted error message string
 */
export function formatValidationErrors(
  validation: ValidationResult,
  defaultPath = 'module'
): string {
  return validation.errors
    .map(e => `${e.path ?? defaultPath}: ${e.message}`)
    .join('; ');
}
