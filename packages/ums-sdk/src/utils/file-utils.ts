/**
 * Shared file system utilities for UMS SDK
 */

import { access, constants } from 'node:fs/promises';
import { ModuleNotFoundError } from '../errors/index.js';

/**
 * Check if a file exists using access() for efficiency.
 * @param filePath - Absolute path to the file
 * @throws ModuleNotFoundError if the file doesn't exist
 */
export async function checkFileExists(filePath: string): Promise<void> {
  try {
    await access(filePath, constants.F_OK);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError.code === 'ENOENT') {
        throw new ModuleNotFoundError(filePath);
      }
    }
    throw error;
  }
}
