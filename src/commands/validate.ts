/**
 * @module commands/validate
 * @description Command to validate modules and persona files.
 */

import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora, { type Ora } from 'ora';
import { glob } from 'glob';
import { validatePersonaFile as coreValidatePersonaFile } from '../core/persona-service.js';
import { validateModuleFile as coreValidateModuleFile } from '../core/module-service.js';
import { handleError } from '../utils/error-handler.js';

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
  spinner: Ora,
  verbose?: boolean
): Promise<ValidationResult> {
  spinner.start(`Validating module ${filePath}`);
  try {
    const result = await coreValidateModuleFile(filePath);
    if (!result.isValid) {
      if (verbose) {
        spinner.fail(chalk.red(`Validation failed for module: ${filePath}`));
      }
    } else {
      if (verbose) {
        spinner.succeed(
          chalk.green(`Validation passed for module: ${filePath}`)
        );
      }
    }
    return result;
  } catch (err) {
    spinner.fail(chalk.red(`Error validating module: ${filePath}`));
    return {
      filePath,
      isValid: false,
      errors: [err instanceof Error ? err.message : String(err)],
    };
  }
}

async function validatePersonaFile(
  filePath: string,
  spinner: Ora,
  verbose?: boolean
): Promise<ValidationResult> {
  spinner.start(`Validating persona ${filePath}`);
  try {
    const result = await coreValidatePersonaFile(filePath);
    if (!result.isValid) {
      if (verbose) {
        spinner.fail(chalk.red(`Validation failed for persona: ${filePath}`));
      }
    } else {
      if (verbose) {
        spinner.succeed(
          chalk.green(`Validation passed for persona: ${filePath}`)
        );
      }
    }
    return result;
  } catch (err) {
    spinner.fail(chalk.red(`Error validating persona: ${filePath}`));
    return {
      filePath,
      isValid: false,
      errors: [err instanceof Error ? err.message : String(err)],
    };
  }
}

async function validateAll(
  spinner: Ora,
  verbose?: boolean
): Promise<ValidationResult[]> {
  spinner.start('Finding files to validate...');
  let files: string[] = [];
  try {
    files = await glob(
      `{instructions-modules/**/*.md,**/*.persona.json,**/*.persona.jsonc}`,
      {
        nodir: true,
        ignore: 'node_modules/**',
      }
    );
  } catch {
    spinner.fail('Error finding files to validate.');
    return [];
  }

  // Exclude instructions-modules/README.md from validation
  files = files.filter(
    file =>
      path.resolve(file) !== path.resolve('instructions-modules/README.md')
  );

  if (files.length === 0) {
    spinner.warn('No files found to validate.');
    return [];
  }
  spinner.succeed(`Found ${files.length} files to validate.`);

  // Parallelize validation for performance
  const results = await Promise.all(
    files.map(file =>
      file.endsWith('.md')
        ? validateModuleFile(file, spinner, verbose)
        : validatePersonaFile(file, spinner, verbose)
    )
  );
  return results;
}

function printValidationResults(results: ValidationResult[]): void {
  const totalFiles = results.length;
  const passedFiles = results.filter(r => r.isValid).length;
  const failedFiles = totalFiles - passedFiles;

  console.log(chalk.bold('\nValidation Results:'));
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
  spinner: Ora,
  verbose?: boolean
): Promise<ValidationResult> {
  if (filePath.endsWith('.md')) {
    return validateModuleFile(filePath, spinner, verbose);
  }
  if (
    filePath.endsWith('.persona.json') ||
    filePath.endsWith('.persona.jsonc')
  ) {
    return validatePersonaFile(filePath, spinner, verbose);
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
  spinner: Ora,
  verbose?: boolean
): Promise<ValidationResult[]> {
  spinner.text = `Scanning directory: ${dirPath}`;
  let files: string[] = [];
  try {
    files = await glob(`${dirPath}/**/*.{md,persona.json,persona.jsonc}`, {
      nodir: true,
    });
  } catch {
    spinner.fail(`Error scanning directory: ${dirPath}`);
    return [];
  }

  // Exclude instructions-modules/README.md from validation
  files = files.filter(
    file =>
      path.resolve(file) !== path.resolve('instructions-modules/README.md')
  );

  if (files.length === 0) {
    spinner.warn(
      `No .md, .persona.json, or .persona.jsonc files found in ${dirPath}`
    );
    return [];
  }

  // Parallelize validation for performance
  return Promise.all(files.map(file => validateFile(file, spinner, verbose)));
}

/**
 * Handles the 'validate' command.
 * @param options - The command options.
 * @param options.targetPath - Optional path to a specific file or directory.
 * @param options.verbose - If true, enables verbose output.
 */
export interface ValidateOptions {
  targetPath?: string;
  verbose?: boolean;
}
export async function handleValidate(
  options: ValidateOptions = {}
): Promise<void> {
  const { targetPath, verbose } = options;
  const spinner = ora('Starting validation...').start();
  let results: ValidationResult[] = [];

  try {
    if (verbose) {
      console.log(chalk.gray('[verbose] Starting validation process...'));
      if (targetPath) {
        console.log(chalk.gray(`[verbose] Target path: ${targetPath}`));
      }
    }
    if (!targetPath) {
      results = await validateAll(spinner, verbose);
    } else {
      const stats = await fs.stat(targetPath);
      if (stats.isFile()) {
        results.push(await validateFile(targetPath, spinner, verbose));
      } else if (stats.isDirectory()) {
        results = await validateDirectory(targetPath, spinner, verbose);
      }
    }

    spinner.stop();
    if (verbose) {
      console.log(
        chalk.gray('[verbose] Validation complete. Printing results...')
      );
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
