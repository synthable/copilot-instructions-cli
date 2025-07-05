/**
 * Module metadata parser for the Copilot Instructions Builder CLI
 *
 * Provides functions for parsing module files and extracting metadata
 * to create indexed module representations.
 */

import { readFile } from 'fs/promises';
import { relative } from 'path';
import matter from 'gray-matter';
import type {
  IndexedModule,
  ModuleMetadata,
  ModuleTier,
} from '../types/index.js';

/**
 * Valid module tiers for validation
 */
const VALID_TIERS: ModuleTier[] = [
  'foundation',
  'principle',
  'technology',
  'execution',
];

/**
 * Parses a module file and extracts metadata to create an IndexedModule object.
 *
 * This function:
 * 1. Reads the file content
 * 2. Parses frontmatter using gray-matter
 * 3. Validates required fields (name, description)
 * 4. Derives tier from the top-level directory
 * 5. Derives subject from the intermediate path
 * 6. Returns a complete IndexedModule object
 *
 * @param filePath - Absolute path to the module file
 * @param modulesPath - Base path to the modules directory (for relative path calculation)
 * @returns Promise that resolves to an IndexedModule object
 * @throws Error if file cannot be read, parsing fails, or validation fails
 *
 * @example
 * ```typescript
 * const module = await parseModuleMetadata(
 *   '/path/to/instructions-modules/foundation/core/basics.md',
 *   '/path/to/instructions-modules'
 * );
 * console.log(module.tier); // 'foundation'
 * console.log(module.subject); // 'core'
 * ```
 */
export async function parseModuleMetadata(
  filePath: string,
  modulesPath: string
): Promise<IndexedModule> {
  try {
    // Read file content
    const fileContent = await readFile(filePath, 'utf-8');

    // Parse frontmatter
    const parsedMatter = matter(fileContent);
    const frontmatter = parsedMatter.data;

    // Validate required fields
    if (!frontmatter['name'] || typeof frontmatter['name'] !== 'string') {
      throw new Error('Missing or invalid required field: name');
    }

    if (
      !frontmatter['description'] ||
      typeof frontmatter['description'] !== 'string'
    ) {
      throw new Error('Missing or invalid required field: description');
    }

    // Calculate relative path from modules directory
    const relativePath = relative(modulesPath, filePath);
    const pathParts = relativePath.split('/').filter(part => part.length > 0);

    if (pathParts.length < 2) {
      throw new Error(
        `Invalid module path structure. Expected at least tier/subject/file.md, got: ${relativePath}`
      );
    }

    // Derive and validate tier from top-level directory
    const derivedTier = pathParts[0] as ModuleTier;
    if (!VALID_TIERS.includes(derivedTier)) {
      throw new Error(
        `Invalid tier "${derivedTier}". Must be one of: ${VALID_TIERS.join(', ')}`
      );
    }

    // Derive subject from intermediate path (max 2 levels deep)
    const subjectParts = pathParts.slice(1, -1); // Remove tier and filename
    if (subjectParts.length === 0) {
      throw new Error(
        `Missing subject directory. Expected tier/subject/file.md structure, got: ${relativePath}`
      );
    }

    if (subjectParts.length > 2) {
      throw new Error(
        `Subject path too deep (max 2 levels). Got ${subjectParts.length} levels: ${subjectParts.join('/')}`
      );
    }

    const subject = subjectParts.join('/');

    // Create module ID from the relative path without extension
    const moduleId = relativePath.replace(/\.md$/, '');

    // Build metadata object
    const metadata: ModuleMetadata = {
      tier: derivedTier,
      name: frontmatter['name'],
      subject,
      description: frontmatter['description'],
    };

    // Add optional fields only if they exist and are valid
    if (Array.isArray(frontmatter['tags'])) {
      metadata.tags = frontmatter['tags'];
    }
    if (Array.isArray(frontmatter['dependencies'])) {
      metadata.dependencies = frontmatter['dependencies'];
    }
    if (Array.isArray(frontmatter['conflicts'])) {
      metadata.conflicts = frontmatter['conflicts'];
    }

    // Return complete IndexedModule
    return {
      id: moduleId,
      path: filePath,
      tier: derivedTier,
      subject,
      metadata,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to parse module metadata for "${filePath}": ${error.message}`
      );
    }
    throw new Error(
      `Failed to parse module metadata for "${filePath}": ${String(error)}`
    );
  }
}

/**
 * Validates that a tier string is a valid ModuleTier.
 *
 * @param tier - The tier string to validate
 * @returns True if the tier is valid, false otherwise
 */
export function isValidTier(tier: string): tier is ModuleTier {
  return VALID_TIERS.includes(tier as ModuleTier);
}

/**
 * Gets all valid module tiers.
 *
 * @returns Array of all valid ModuleTier values
 */
export function getValidTiers(): readonly ModuleTier[] {
  return VALID_TIERS;
}
