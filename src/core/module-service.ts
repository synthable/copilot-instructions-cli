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
  | 'rule'
  | 'procedure'
  | 'specification'
  | 'pattern'
  | 'checklist'
  | 'data';

/**
 * Defines the required section order for each schema type.
 */
const schemaSectionOrder: Record<SchemaType, string[]> = {
  rule: ['Mandate'],
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
 * Represents the result of a single file validation.
 */
export interface ValidationResult {
  filePath: string;
  isValid: boolean;
  errors: string[];
}

/**
 * Represents the result of a frontmatter validation.
 */
export interface FrontmatterValidationResult {
  isValid: boolean;
  errors: string[];
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
 * Parses the content of a module file into a structured Module object.
 * This function is pure and does not perform file I/O.
 *
 * @param filePath - The absolute path to the module file.
 * @param fileContent - The string content of the module file.
 * @returns A Module object.
 * @throws An error if frontmatter is invalid.
 */
function parseModule(filePath: string, fileContent: string): Module {
  const { data: frontmatter, content } = matter(fileContent);

  const relativePath = path.relative(MODULES_ROOT_DIR, filePath);
  const id = relativePath.replace(/\\/g, '/').replace(/\.md$/, '');
  const parts = id.split('/');
  const tier = parts[0];
  const subject = parts.slice(1, -1).join('/');

  const validationResult = validateFrontmatter(frontmatter, tier);
  if (!validationResult.isValid) {
    throw new Error(
      `Module validation failed for ${filePath}: ${validationResult.errors.join(
        ', '
      )}`
    );
  }

  const module: Module = {
    id,
    tier,
    subject,
    name: frontmatter.name as string,
    description: frontmatter.description as string,
    content: content.trim(),
    filePath,
  };

  if (
    frontmatter.layer !== undefined &&
    typeof frontmatter.layer === 'number'
  ) {
    module.layer = frontmatter.layer;
  }

  return module;
}

/**
 * Reads a module file from disk and parses it into a Module object.
 * @param filePath - The path to the module file.
 * @returns A promise that resolves to a Module object.
 */
async function loadModule(filePath: string): Promise<Module> {
  const fileContent = await fs.readFile(filePath, 'utf8');
  return parseModule(filePath, fileContent);
}

/**
 * Gets the file paths for modules, either from a list of IDs or by scanning the directory.
 * @param moduleIds - Optional array of module IDs.
 * @returns A promise that resolves to an array of file paths.
 */
async function getModuleFilePaths(moduleIds?: string[]): Promise<string[]> {
  if (moduleIds && moduleIds.length > 0) {
    return moduleIds.map(id => path.resolve(MODULES_ROOT_DIR, `${id}.md`));
  }
  const pattern = `${MODULES_ROOT_DIR}/**/*.md`;
  return glob(pattern, { nodir: true });
}

/**
 * Scans the module directory and returns a map of all found modules.
 * @param moduleIds - Optional array of module IDs to load. If not provided, all modules are scanned.
 * @returns A promise that resolves to a map of module IDs to Module objects.
 * @throws An error if the instructions-modules directory is not found.
 */
export async function scanModules(
  moduleIds?: string[]
): Promise<Map<string, Module>> {
  try {
    await fs.access(MODULES_ROOT_DIR);
  } catch {
    throw new Error(
      `The 'instructions-modules' directory was not found at '${MODULES_ROOT_DIR}'. Please create it, or use the 'create-module' command to get started.`
    );
  }

  const filesToParse = await getModuleFilePaths(moduleIds);
  const modules = await Promise.all(filesToParse.map(loadModule));

  const moduleMap = new Map<string, Module>();
  for (const module of modules) {
    moduleMap.set(module.id, module);
  }

  return moduleMap;
}

/**
 * Validates the frontmatter of a module file.
 * @param frontmatter - The frontmatter object to validate.
 * @param tier - The tier of the module.
 * @returns A result indicating if the frontmatter is valid and which fields are missing.
 */
export function validateFrontmatter(
  frontmatter: Record<string, unknown>,
  tier: string
): FrontmatterValidationResult {
  const errors: string[] = [];

  for (const field of ['name', 'description']) {
    const value = frontmatter[field];
    if (value === undefined || value === null) {
      errors.push(`Missing required field: ${field}`);
    } else if (typeof value !== 'string' || value.trim() === '') {
      errors.push(`Field "${field}" must be a non-empty string.`);
    }
  }

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
        `Section "${section}" missing or out of order (expected at position ${
          idx + 1
        })`
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
 * Validates the rule schema for modules of type 'rule'.
 * Ensures exactly one H2 heading that must be '## Mandate'.
 * @param body - The markdown body content.
 * @returns Array of validation error messages.
 */
function validateRuleSchema(body: string): string[] {
  const errors: string[] = [];

  // Parse the module's Markdown content to identify all H2 headings
  const h2Headings = body.match(/^## .+$/gm) || [];

  // Check if the count is not equal to 1
  if (h2Headings.length !== 1) {
    errors.push('Rule schema modules must have exactly one H2 heading.');
    return errors;
  }

  // Check if the single heading's text is not '## Mandate'
  if (h2Headings[0] !== '## Mandate') {
    errors.push('The heading in a rule schema module must be ## Mandate.');
  }

  return errors;
}

/**
 * Validates a module's content against its schema and structure.
 * @param fileContent - The markdown content of the module.
 * @param tier - The tier of the module, used for tier-specific validation.
 * @returns A validation result object.
 */
export function validateModuleContent(
  fileContent: string,
  tier: string
): Omit<ValidationResult, 'filePath'> {
  const errors: string[] = [];
  try {
    const { data: frontmatter, content: body } = matter(fileContent);

    const frontmatterResult = validateFrontmatter(frontmatter, tier);
    errors.push(...frontmatterResult.errors);

    if (
      frontmatterResult.isValid &&
      frontmatter.schema &&
      typeof frontmatter.schema === 'string' &&
      frontmatter.schema in schemaSectionOrder
    ) {
      const schema = frontmatter.schema as SchemaType;
      const trimmedBody = body.trim();
      errors.push(...validateSections(schema, trimmedBody));
      if (schema === 'data') {
        errors.push(...validateDataSchema(trimmedBody));
      } else if (schema === 'rule') {
        errors.push(...validateRuleSchema(trimmedBody));
      }
    }

    return { isValid: errors.length === 0, errors };
  } catch (e) {
    const err = e as Error;
    return {
      isValid: false,
      errors: [`Failed to parse module content: ${err.message}`],
    };
  }
}

/**
 * Validates a module file (.md) and returns a ValidationResult.
 * @param filePath - Path to the module file.
 * @returns A promise resolving to a ValidationResult.
 */
export async function validateModuleFile(
  filePath: string
): Promise<ValidationResult> {
  try {
    const relativePath = path.relative(MODULES_ROOT_DIR, filePath);
    if (relativePath.startsWith('..')) {
      return {
        filePath,
        isValid: false,
        errors: [
          'Module files must be located within the instructions-modules directory.',
        ],
      };
    }

    const fileContent = await fs.readFile(filePath, 'utf8');
    const tier = relativePath.split(path.sep)[0];
    const { isValid, errors } = validateModuleContent(fileContent, tier);

    return { filePath, isValid, errors };
  } catch (e) {
    const err = e as Error;
    const error = `Failed to read or parse module ${filePath}: ${err.message}`;
    return { filePath, isValid: false, errors: [error] };
  }
}
