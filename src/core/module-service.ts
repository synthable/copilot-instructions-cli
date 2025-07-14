/**
 * @module core/module-service
 * @description Service for discovering and parsing instruction modules.
 */

import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import type { Module, PersonaConfig } from '../types/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODULES_ROOT_DIR = path.resolve(__dirname, '../../instructions-modules');

/**
 * Recursively finds all markdown files in a directory.
 * @param dir - The directory to search.
 * @returns A promise that resolves to an array of file paths.
 */
async function findMarkdownFiles(dir: string): Promise<string[]> {
  const pattern = `${dir}/**/*.md`;
  return await glob(pattern, { nodir: true });
}

/**
 * Parses a single module file into a Module object.
 * @param filePath - The path to the module file.
 * @returns A promise that resolves to a Module object.
 * @throws An error if the module file is missing required frontmatter.
 */
async function parseModuleFile(filePath: string): Promise<Module> {
  const fileContent = await fs.readFile(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  const relativePath = path.relative(MODULES_ROOT_DIR, filePath);
  const parts = relativePath.split(path.sep);
  const tier = parts[0];

  const validationResult = validateFrontmatter(data, tier);
  if (!validationResult.isValid) {
    throw new Error(
      `Module validation failed for ${filePath}: ${validationResult.errors.join(
        ', '
      )}`
    );
  }

  const fileName = parts[parts.length - 1];
  const subject = parts.slice(1, -1).join('/');
  const id = `${tier}/${subject ? subject + '/' : ''}${path.basename(
    fileName,
    '.md'
  )}`;

  const module: Module = {
    id,
    tier,
    subject,
    name: data.name as string,
    description: data.description as string,
    content: content.trim(),
    filePath,
  };

  if (data.layer !== undefined && typeof data.layer === 'number') {
    module.layer = data.layer;
  }

  return module;
}

/**
 * Scans the module directory and returns a map of all found modules.
 * @returns A promise that resolves to a map of module IDs to Module objects.
 * @throws An error if the instructions-modules directory is not found.
 */
export async function scanModules(): Promise<Map<string, Module>> {
  const moduleMap = new Map<string, Module>();
  // Check if MODULES_ROOT_DIR exists
  try {
    await fs.access(MODULES_ROOT_DIR);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error(
      `The 'instructions-modules' directory was not found at '${MODULES_ROOT_DIR}'. Please create it, or use the 'create-module' command to get started.`
    );
  }
  const files = await findMarkdownFiles(MODULES_ROOT_DIR);
  const modules = await Promise.all(files.map(file => parseModuleFile(file)));

  for (const module of modules) {
    moduleMap.set(module.id, module);
  }
  return moduleMap;
}

/**
 * Represents the result of a frontmatter validation.
 */
export interface FrontmatterValidationResult {
  /**
   * Whether the frontmatter is valid.
   */
  isValid: boolean;
  /**
   * An array of validation error messages.
   */
  errors: string[];
}

/**
 * Validates the frontmatter of a module file.
 * @param frontmatter - The frontmatter object to validate.
 * @returns A result indicating if the frontmatter is valid and which fields are missing.
 */
export function validateFrontmatter(
  frontmatter: Record<string, unknown>,
  tier: string
): FrontmatterValidationResult {
  const errors: string[] = [];

  // Generic field validation
  for (const field of ['name', 'description']) {
    const value = frontmatter[field];
    if (value === undefined || value === null) {
      errors.push(`Missing required field: ${field}`);
    } else if (typeof value !== 'string' || value.trim() === '') {
      errors.push(`Field "${field}" must be a non-empty string.`);
    }
  }

  // Tier-specific validation
  if (tier === 'foundation') {
    const layer = frontmatter.layer;
    if (layer === undefined || layer === null) {
      errors.push('Missing required field for foundation tier: "layer"');
    } else if (
      !Number.isInteger(layer) ||
      (layer as number) < 0 ||
      (layer as number) > 5
    ) {
      errors.push('The "layer" field must be an integer between 0 and 5.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Represents the result of a persona file validation.
 */
export interface PersonaValidationResult {
  /**
   * Whether the persona file is valid.
   */
  isValid: boolean;
  /**
   * An array of fields that are missing or invalid.
   */
  errors: string[];
}

/**
 * Validates a persona object.
 * @param persona - The persona object to validate.
 * @returns A result indicating if the persona is valid and which fields are missing or invalid.
 */
export function validatePersona(
  persona: PersonaConfig
): PersonaValidationResult {
  const errors: string[] = [];

  // Field: name
  if (!persona.name || typeof persona.name !== 'string') {
    errors.push('The "name" field is required and must be a non-empty string.');
  }

  // Field: description
  if (
    persona.description !== undefined &&
    (typeof persona.description !== 'string' ||
      persona.description.trim() === '')
  ) {
    errors.push('The "description" field must be a non-empty string.');
  }

  // Field: output
  if (
    persona.output !== undefined &&
    (typeof persona.output !== 'string' || persona.output.trim() === '')
  ) {
    errors.push('The "output" field must be a non-empty string.');
  }

  // Field: modules
  if (!persona.modules) {
    errors.push('The "modules" field is required.');
  } else if (!Array.isArray(persona.modules) || persona.modules.length === 0) {
    errors.push('The "modules" field must be a non-empty array.');
  } else if (
    persona.modules.some(m => typeof m !== 'string' || m.trim() === '')
  ) {
    errors.push('All items in the "modules" array must be non-empty strings.');
  }

  // Field: attributions
  if (
    persona.attributions !== undefined &&
    typeof persona.attributions !== 'boolean'
  ) {
    errors.push('The "attributions" field must be a boolean.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
