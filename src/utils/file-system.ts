/**
 * File system utilities for the Copilot Instructions Builder CLI
 *
 * Provides functions for discovering and working with module files
 * in the modular instruction system.
 */

import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

/**
 * Recursively finds all `.md` files in a directory and its subdirectories.
 *
 * @param directory - The root directory to search in
 * @returns Promise that resolves to an array of absolute file paths to `.md` files
 * @throws Error if the directory cannot be accessed or read
 *
 * @example
 * ```typescript
 * const mdFiles = await findMarkdownFiles('./instructions-modules');
 * console.log(mdFiles); // ['/path/to/instructions-modules/foundation/core.md', ...]
 * ```
 */
export async function findMarkdownFiles(directory: string): Promise<string[]> {
  const results: string[] = [];

  try {
    const entries = await readdir(directory);

    for (const entry of entries) {
      const fullPath = join(directory, entry);

      try {
        const stats = await stat(fullPath);

        if (stats.isDirectory()) {
          // Recursively search subdirectories
          const subResults = await findMarkdownFiles(fullPath);
          results.push(...subResults);
        } else if (stats.isFile() && extname(entry).toLowerCase() === '.md') {
          // Add markdown files to results
          results.push(fullPath);
        }
      } catch (entryError) {
        // Skip entries that can't be accessed (permissions, broken symlinks, etc.)
        console.warn(`Warning: Unable to access ${fullPath}: ${entryError}`);
        continue;
      }
    }

    return results.sort(); // Return sorted paths for consistent ordering
  } catch (error) {
    throw new Error(
      `Failed to read directory "${directory}": ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
