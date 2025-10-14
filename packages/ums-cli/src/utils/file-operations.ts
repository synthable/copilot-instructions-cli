/**
 * CLI File Operations Utilities
 * Handles all file I/O operations that were previously in UMS library
 */

import { existsSync } from 'fs';
import {
  readFile as readFileAsync,
  writeFile as writeFileAsync,
} from 'fs/promises';
import { join } from 'path';
import { glob } from 'glob';

/**
 * Reads a persona file and returns its content as a string
 */
export async function readPersonaFile(path: string): Promise<string> {
  try {
    return await readFileAsync(path, 'utf-8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read persona file '${path}': ${message}`);
  }
}

/**
 * Reads a module file and returns its content as a string
 */
export async function readModuleFile(path: string): Promise<string> {
  try {
    return await readFileAsync(path, 'utf-8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read module file '${path}': ${message}`);
  }
}

/**
 * Writes content to an output file
 */
export async function writeOutputFile(
  path: string,
  content: string
): Promise<void> {
  try {
    await writeFileAsync(path, content, 'utf-8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to write output file '${path}': ${message}`);
  }
}

/**
 * Discovers module files in the given paths
 * Supports UMS v2.0 TypeScript format only
 */
export async function discoverModuleFiles(paths: string[]): Promise<string[]> {
  const MODULE_FILE_EXTENSIONS = ['.module.ts'];
  const allFiles: string[] = [];

  for (const path of paths) {
    try {
      for (const extension of MODULE_FILE_EXTENSIONS) {
        const pattern = join(path, '**', `*${extension}`);
        const files = await glob(pattern, { nodir: true });
        allFiles.push(...files);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to discover modules in path '${path}': ${message}`
      );
    }
  }

  return allFiles;
}

/**
 * Checks if a file exists at the given path
 */
export function fileExists(path: string): boolean {
  return existsSync(path);
}

/**
 * Reads content from stdin
 */
export async function readFromStdin(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];

    process.stdin.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    process.stdin.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });

    process.stdin.on('error', reject);

    // Start reading
    process.stdin.resume();
  });
}

/**
 * Checks if a file path has a .persona.ts extension
 * Supports UMS v2.0 TypeScript format only
 */
export function isPersonaFile(filePath: string): boolean {
  return filePath.endsWith('.persona.ts');
}

/**
 * Validates that the persona file has the correct extension
 * Supports UMS v2.0 TypeScript format only
 */
export function validatePersonaFile(filePath: string): void {
  if (!isPersonaFile(filePath)) {
    throw new Error(
      `Persona file must have .persona.ts extension, got: ${filePath}\n` +
        'UMS v2.0 uses TypeScript format (.persona.ts) for personas.'
    );
  }
}
