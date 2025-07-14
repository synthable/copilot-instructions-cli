/**
 * @module commands/validate
 * @description Command to validate modules and persona files.
 */

import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora, { type Ora } from 'ora';
import { glob } from 'glob';
import matter from 'gray-matter';
import {
  validateFrontmatter,
  validatePersona,
} from '../core/module-service.js';
import { handleError } from '../utils/error-handler.js';
import type { PersonaConfig } from '../types/index.js';
import { parse } from 'jsonc-parser';

const MODULES_ROOT_DIR = path.resolve(process.cwd(), 'instructions-modules');

/**
 * Represents the result of a single file validation.
 */
interface ValidationResult {
  filePath: string;
  isValid: boolean;
  errors: string[];
}

async function validateModuleFile(
  filePath: string,
  spinner: Ora
): Promise<ValidationResult> {
  spinner.start(`Validating module ${filePath}`);
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data } = matter(fileContent);

    const relativePath = path.relative(MODULES_ROOT_DIR, filePath);
    if (relativePath.startsWith('..')) {
      throw new Error(
        'Module files must be located within the instructions-modules directory.'
      );
    }
    const tier = relativePath.split(path.sep)[0];

    const result = validateFrontmatter(data, tier);
    if (!result.isValid) {
      spinner.fail(chalk.red(`Validation failed for module: ${filePath}`));
      return { filePath, isValid: false, errors: result.errors };
    }
    spinner.succeed(chalk.green(`Validation passed for module: ${filePath}`));
    return { filePath, isValid: true, errors: [] };
  } catch (e) {
    const err = e as Error;
    const error = `Failed to read or parse module ${filePath}: ${err.message}`;
    spinner.fail(chalk.red(error));
    return { filePath, isValid: false, errors: [error] };
  }
}

async function validatePersonaFile(
  filePath: string,
  spinner: Ora
): Promise<ValidationResult> {
  spinner.start(`Validating persona ${filePath}`);
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const personaConfig: PersonaConfig = parse(fileContent);
    const result = validatePersona(personaConfig);

    if (!result.isValid) {
      spinner.fail(chalk.red(`Validation failed for persona: ${filePath}`));
      return { filePath, isValid: false, errors: result.errors };
    }
    spinner.succeed(chalk.green(`Validation passed for persona: ${filePath}`));
    return { filePath, isValid: true, errors: [] };
  } catch (e) {
    const err = e as Error;
    const error = `Failed to read or parse persona ${filePath}: ${err.message}`;
    spinner.fail(chalk.red(error));
    return { filePath, isValid: false, errors: [error] };
  }
}

async function validateAll(spinner: Ora): Promise<ValidationResult[]> {
  spinner.start('Finding files to validate...');
  const files = await glob(
    `{instructions-modules/**/*.md,**/*.persona.json,**/*.persona.jsonc}`,
    {
      nodir: true,
      ignore: 'node_modules/**',
    }
  );

  if (files.length === 0) {
    spinner.warn('No files found to validate.');
    return [];
  }
  spinner.succeed(`Found ${files.length} files to validate.`);

  const results: ValidationResult[] = [];
  for (const file of files) {
    if (file.endsWith('.md')) {
      results.push(await validateModuleFile(file, spinner));
    } else if (
      file.endsWith('.persona.json') ||
      file.endsWith('.persona.jsonc')
    ) {
      results.push(await validatePersonaFile(file, spinner));
    }
  }
  return results;
}

function printValidationResults(results: ValidationResult[]): void {
  const totalFiles = results.length;
  const passedFiles = results.filter(r => r.isValid).length;
  const failedFiles = totalFiles - passedFiles;

  console.log('\n');
  console.log(chalk.bold('Validation Results:'));
  console.log('-------------------');
  console.log(chalk.green(`Passed: ${passedFiles}`));
  console.log(chalk.red(`Failed: ${failedFiles}`));
  console.log(`Total:  ${totalFiles}`);
  console.log('-------------------');

  if (failedFiles > 0) {
    console.log(chalk.bold.red('\nErrors:'));
    for (const result of results) {
      if (!result.isValid) {
        console.log(chalk.yellow(`  File: ${result.filePath}`));
        for (const error of result.errors) {
          console.log(chalk.red(`    - ${error}`));
        }
      }
    }
  }
}

async function validateFile(
  filePath: string,
  spinner: Ora
): Promise<ValidationResult> {
  if (filePath.endsWith('.md')) {
    return validateModuleFile(filePath, spinner);
  }
  if (
    filePath.endsWith('.persona.json') ||
    filePath.endsWith('.persona.jsonc')
  ) {
    return validatePersonaFile(filePath, spinner);
  }

  const error = `Unsupported file type: ${filePath}. Please provide a .md, .persona.json, or .persona.jsonc file.`;
  spinner.fail(error);
  return {
    filePath,
    isValid: false,
    errors: [error],
  };
}

async function validateDirectory(
  dirPath: string,
  spinner: Ora
): Promise<ValidationResult[]> {
  spinner.text = `Scanning directory: ${dirPath}`;
  const files = await glob(`${dirPath}/**/*.{md,persona.json,persona.jsonc}`, {
    nodir: true,
  });

  if (files.length === 0) {
    spinner.warn(
      `No .md, .persona.json, or .persona.jsonc files found in ${dirPath}`
    );
    return [];
  }

  const results: ValidationResult[] = [];
  for (const file of files) {
    results.push(await validateFile(file, spinner));
  }
  return results;
}

/**
 * Handles the 'validate' command.
 * @param targetPath - Optional path to a specific file or directory.
 */
export async function handleValidate(targetPath?: string): Promise<void> {
  const spinner = ora('Starting validation...').start();
  let results: ValidationResult[] = [];

  try {
    if (!targetPath) {
      results = await validateAll(spinner);
    } else {
      const stats = await fs.stat(targetPath);
      if (stats.isFile()) {
        results.push(await validateFile(targetPath, spinner));
      } else if (stats.isDirectory()) {
        results = await validateDirectory(targetPath, spinner);
      }
    }

    printValidationResults(results);
  } catch (error) {
    if (
      error instanceof Error &&
      (error as NodeJS.ErrnoException).code === 'ENOENT'
    ) {
      spinner.fail(`Path not found: ${targetPath}`);
    }
    handleError(error, spinner);
  }
}
