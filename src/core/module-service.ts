/**
 * @module core/module-service
 * @description Service for discovering and parsing instruction modules.
 */

import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import type { Module } from '../types/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODULES_ROOT_DIR = path.resolve(__dirname, '../../instructions-modules');

/**
 * Supported schema types for instruction modules.
 */
export type SchemaType =
  | 'procedure'
  | 'specification'
  | 'pattern'
  | 'checklist'
  | 'data';

/**
 * Defines the required section order for each schema type.
 */
const schemaSectionOrder: Record<SchemaType, string[]> = {
  procedure: ['Primary Directive', 'Process', 'Constraints'],
  specification: [
    'Core Concept',
    'Key Rules',
    'Best Practices',
    'Anti-Patterns',
  ],
  pattern: [
    'Summary',
    'Core Principles',
    'Advantages / Use Cases',
    'Disadvantages / Trade-offs',
  ],
  checklist: ['Objective', 'Items'],
  data: ['Description'], // Data requires a code block after Description
};

/**
 * Represents a validation error.
 */
export interface ValidationError {
  message: string;
}

/**
 * Extracts section headers from module body content.
 * Section headers are assumed to be "## SectionName".
 * @param body - The markdown body content.
 * @returns Array of section names.
 */
function extractSections(body: string): string[] {
  const sectionMatches = [...body.matchAll(/^##\s+(.+)$/gm)];
  return sectionMatches.map(m => m[1].trim());
}

/**
 * Represents the frontmatter structure for modules.
 */
export interface ModuleFrontmatter {
  schema?: SchemaType;
  tier?: string;
  name?: string;
  description?: string;
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Parses frontmatter and body from markdown content.
 * @param content - The markdown file content.
 * @returns Parsed frontmatter and body.
 */
function parseFrontmatter(content: string): {
  frontmatter: ModuleFrontmatter;
  body: string;
} {
  let parsed: matter.GrayMatterFile<string>;
  try {
    parsed = matter(content);
  } catch (e: unknown) {
    if (isError(e)) {
      throw new Error(`Frontmatter parsing error: ${e.message}`);
    }
    throw new Error('Unknown error during frontmatter parsing');
  }
  const frontmatter: ModuleFrontmatter = parsed.data as ModuleFrontmatter;
  const body = parsed.content.trim();
  return { frontmatter, body };
}

/**
 * Type guard for Error objects.
 */
function isError(e: unknown): e is Error {
  return typeof e === 'object' && e !== null && 'message' in e;
}

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
export async function scanModules(
  moduleIds?: string[]
): Promise<Map<string, Module>> {
  const moduleMap = new Map<string, Module>();
  try {
    await fs.access(MODULES_ROOT_DIR);
  } catch {
    throw new Error(
      `The 'instructions-modules' directory was not found at '${MODULES_ROOT_DIR}'. Please create it, or use the 'create-module' command to get started.`
    );
  }

  if (moduleIds) {
    const moduleFiles = moduleIds.map(id =>
      path.resolve(MODULES_ROOT_DIR, `${id}.md`)
    );
    const modules = await Promise.all(
      moduleFiles.map(file => parseModuleFile(file))
    );
    for (const module of modules) {
      moduleMap.set(module.id, module);
    }
  } else {
    const files = await findMarkdownFiles(MODULES_ROOT_DIR);
    const modules = await Promise.all(files.map(file => parseModuleFile(file)));

    for (const module of modules) {
      moduleMap.set(module.id, module);
    }
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

  // Schema field validation
  if (!frontmatter.schema) {
    errors.push('Missing schema in frontmatter');
  } else if (
    typeof frontmatter.schema !== 'string' ||
    !(frontmatter.schema in schemaSectionOrder)
  ) {
    errors.push(`Invalid schema: ${frontmatter.schema}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates the section order and required sections for a module schema.
 * @param schema - The schema type.
 * @param body - The markdown body content.
 * @returns Array of validation error messages.
 */
function validateSections(schema: SchemaType, body: string): string[] {
  const errors: string[] = [];
  const requiredSections = schemaSectionOrder[schema];
  const actualSections = extractSections(body);

  requiredSections.forEach((section, idx) => {
    if (!actualSections[idx] || actualSections[idx] !== section) {
      errors.push(
        `Section "${section}" missing or out of order (expected at position ${idx + 1})`
      );
    }
  });

  if (actualSections.length > requiredSections.length) {
    errors.push(
      `Extra section(s) found: ${actualSections
        .slice(requiredSections.length)
        .join(', ')}`
    );
  }

  return errors;
}

/**
 * Validates the data schema for modules of type 'data'.
 * Ensures ## Description section and a code block after it.
 * @param body - The markdown body content.
 * @returns Array of validation error messages.
 */
function validateDataSchema(body: string): string[] {
  const errors: string[] = [];
  const descriptionIdx = body.indexOf('## Description');
  const codeBlockMatch = body.match(/```[\s\S]+?```/);
  if (descriptionIdx === -1) {
    errors.push('Missing ## Description section for data schema');
  } else if (!codeBlockMatch) {
    errors.push('Missing code block after ## Description for data schema');
  }
  return errors;
}

/**
 * Validates a module's schema and structure.
 * Throws an error if validation fails.
 * @param content - The markdown file content.
 */
export function validateModuleSchema(content: string): void {
  const { frontmatter, body } = parseFrontmatter(content);
  let errors: string[] = [];

  // Validate frontmatter fields
  const frontmatterResult = validateFrontmatter(
    frontmatter,
    frontmatter.tier ?? ''
  );
  if (!frontmatterResult.isValid) {
    errors = errors.concat(frontmatterResult.errors);
  }

  // Validate schema sections if schema is present and valid
  if (
    frontmatter.schema &&
    typeof frontmatter.schema === 'string' &&
    frontmatter.schema in schemaSectionOrder
  ) {
    errors = errors.concat(
      validateSections(frontmatter.schema as SchemaType, body)
    );
    if (frontmatter.schema === 'data') {
      errors = errors.concat(validateDataSchema(body));
    }
  }

  if (errors.length > 0) {
    throw new Error(
      'Module validation failed:\n' + errors.map(e => `- ${e}`).join('\n')
    );
  }
}

/**
 * Represents the result of a single file validation.
 */
export interface ValidationResult {
  filePath: string;
  isValid: boolean;
  errors: string[];
}

/**
 * Validates a module file (.md) and returns a ValidationResult.
 * @param filePath - Path to the module file.
 * @param tierRootDir - Root directory for modules.
 * @returns ValidationResult
 */
export async function validateModuleFile(
  filePath: string,
  tierRootDir: string = MODULES_ROOT_DIR
): Promise<ValidationResult> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data } = matter(fileContent);

    const relativePath = path.relative(tierRootDir, filePath);
    if (relativePath.startsWith('..')) {
      return {
        filePath,
        isValid: false,
        errors: [
          'Module files must be located within the instructions-modules directory.',
        ],
      };
    }
    const tier = relativePath.split(path.sep)[0];

    const result = validateFrontmatter(data, tier);
    if (!result.isValid) {
      return { filePath, isValid: false, errors: result.errors };
    }
    return { filePath, isValid: true, errors: [] };
  } catch (e) {
    const err = e as Error;
    const error = `Failed to read or parse module ${filePath}: ${err.message}`;
    return { filePath, isValid: false, errors: [error] };
  }
}
