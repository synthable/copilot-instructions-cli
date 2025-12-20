/**
 * Shared file system utilities for UMS SDK
 */

import { access, constants } from 'node:fs/promises';
import { ModuleNotFoundError } from '../errors/index.js';

/**
 * Type guard to check if an error is a NodeJS ErrnoException
 */
function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error !== null && typeof error === 'object' && 'code' in error;
}

/**
 * Check if an error is an ENOENT (file not found) error
 */
export function isFileNotFoundError(error: unknown): boolean {
  return isNodeError(error) && error.code === 'ENOENT';
}

/**
 * Check if a file exists using access() for efficiency.
 * @param filePath - Absolute path to the file
 * @throws ModuleNotFoundError if the file doesn't exist
 */
export async function checkFileExists(filePath: string): Promise<void> {
  try {
    await access(filePath, constants.F_OK);
  } catch (error) {
    if (isFileNotFoundError(error)) {
      throw new ModuleNotFoundError(filePath);
    }
    throw error;
  }
}
