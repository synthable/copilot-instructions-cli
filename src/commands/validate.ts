/**
 * @module commands/validate
 * @description Command to validate UMS v1.0 modules and persona files (M7).
 */

import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import { glob } from 'glob';
import { loadModule } from '../core/ums-module-loader.js';
import { loadPersona } from '../core/ums-persona-loader.js';
import type { ValidationError, ValidationWarning } from '../types/ums-v1.js';
import { handleError } from '../utils/error-handler.js';
import { createValidationProgress, BatchProgress } from '../utils/progress.js';

interface ValidateOptions {
  targetPath?: string;
  verbose?: boolean;
}

/**
 * Represents the result of a single file validation
 */
interface ValidationResult {
  filePath: string;
  fileType: 'module' | 'persona';
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * Validates a single module file
 */
async function validateModuleFile(filePath: string): Promise<ValidationResult> {
  try {
    await loadModule(filePath);
    return {
      filePath,
      fileType: 'module',
      isValid: true,
      errors: [],
      warnings: [],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      filePath,
      fileType: 'module',
      isValid: false,
      errors: [
        {
          path: '',
          message: errorMessage,
        },
      ],
      warnings: [],
    };
  }
}

/**
 * Validates a single persona file
 */
async function validatePersonaFile(
  filePath: string
): Promise<ValidationResult> {
  try {
    await loadPersona(filePath);
    return {
      filePath,
      fileType: 'persona',
      isValid: true,
      errors: [],
      warnings: [],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      filePath,
      fileType: 'persona',
      isValid: false,
      errors: [
        {
          path: '',
          message: errorMessage,
        },
      ],
      warnings: [],
    };
  }
}

/**
 * Validates a single file based on its type
 */
async function validateFile(filePath: string): Promise<ValidationResult> {
  if (filePath.endsWith('.module.yml')) {
    return validateModuleFile(filePath);
  } else if (filePath.endsWith('.persona.yml')) {
    return validatePersonaFile(filePath);
  } else {
    return {
      filePath,
      fileType: 'module', // default
      isValid: false,
      errors: [
        {
          path: '',
          message: `Unsupported file type: ${path.extname(filePath)}`,
        },
      ],
      warnings: [],
    };
  }
}

/**
 * Validates all files in a directory recursively
 */
async function validateDirectory(
  dirPath: string,
  verbose: boolean
): Promise<ValidationResult[]> {
  // M7 matchers: {instructions-modules/**/*.module.yml, personas/**/*.persona.yml}
  const patterns = [
    path.join(dirPath, 'instructions-modules/**/*.module.yml'),
    path.join(dirPath, 'personas/**/*.persona.yml'),
  ];

  const results: ValidationResult[] = [];
  const allFiles: string[] = [];

  for (const pattern of patterns) {
    try {
      const files = await glob(pattern, {
        nodir: true,
        ignore: ['**/node_modules/**'],
      });
      allFiles.push(...files);
    } catch (error) {
      console.warn(
        chalk.yellow(
          `Warning: Failed to glob pattern ${pattern}: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  if (allFiles.length > 0) {
    const progress = new BatchProgress(
      allFiles.length,
      { command: 'validate', operation: 'directory validation' },
      verbose
    );

    progress.start('Validating files');

    for (const file of allFiles) {
      const result = await validateFile(file);
      results.push(result);
      progress.increment(path.basename(file));
    }

    progress.complete();
  }

  return results;
}

/**
 * Validates all files in standard locations (M7)
 */
async function validateAll(verbose: boolean): Promise<ValidationResult[]> {
  // M7: none → standard locations
  const patterns = [
    'instructions-modules/**/*.module.yml',
    'personas/**/*.persona.yml',
  ];

  const results: ValidationResult[] = [];
  const allFiles: string[] = [];

  for (const pattern of patterns) {
    try {
      const files = await glob(pattern, {
        nodir: true,
        ignore: ['**/node_modules/**'],
      });
      allFiles.push(...files);
    } catch (error) {
      console.warn(
        chalk.yellow(
          `Warning: Failed to glob pattern ${pattern}: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }

  if (allFiles.length > 0) {
    const progress = new BatchProgress(
      allFiles.length,
      { command: 'validate', operation: 'standard location validation' },
      verbose
    );

    progress.start('Validating files in standard locations');

    for (const file of allFiles) {
      const result = await validateFile(file);
      results.push(result);
      progress.increment(path.basename(file));
    }

    progress.complete();
  }

  return results;
}

/**
 * Prints validation results with optional verbose output
 */
function printResults(results: ValidationResult[], verbose: boolean): void {
  const validCount = results.filter(r => r.isValid).length;
  const invalidCount = results.length - validCount;

  if (results.length === 0) {
    console.log(chalk.yellow('No UMS v1.0 files found to validate.'));
    return;
  }

  // Print per-file results
  for (const result of results) {
    if (result.isValid) {
      if (verbose) {
        console.log(chalk.green(`✓ ${result.filePath} (${result.fileType})`));
        if (result.warnings.length > 0) {
          for (const warning of result.warnings) {
            const pathContext = warning.path ? ` at ${warning.path}` : '';
            console.log(
              chalk.yellow(`  ⚠ Warning${pathContext}: ${warning.message}`)
            );
          }
        }
      }
    } else {
      console.log(chalk.red(`✗ ${result.filePath} (${result.fileType})`));
      for (const error of result.errors) {
        if (verbose) {
          // M7: verbose flag includes key-path context and rule description
          const pathContext = error.path ? ` at ${error.path}` : '';
          const sectionContext = error.section ? ` (${error.section})` : '';
          console.log(
            chalk.red(
              `  ✗ Error${pathContext}: ${error.message}${sectionContext}`
            )
          );
        } else {
          console.log(chalk.red(`  ✗ ${error.message}`));
        }
      }

      if (verbose && result.warnings.length > 0) {
        for (const warning of result.warnings) {
          const pathContext = warning.path ? ` at ${warning.path}` : '';
          console.log(
            chalk.yellow(`  ⚠ Warning${pathContext}: ${warning.message}`)
          );
        }
      }
    }
  }

  // Print summary
  console.log();
  if (invalidCount === 0) {
    console.log(chalk.green(`✓ All ${validCount} files are valid`));
  } else {
    console.log(
      chalk.red(`✗ ${invalidCount} of ${results.length} files have errors`)
    );
    console.log(chalk.green(`✓ ${validCount} files are valid`));
  }
}

/**
 * Handles the validate command for UMS v1.0 files (M7)
 */
export async function handleValidate(
  options: ValidateOptions = {}
): Promise<void> {
  const { targetPath, verbose } = options;
  const progress = createValidationProgress('validate', verbose);

  try {
    progress.start('Starting UMS v1.0 validation...');

    let results: ValidationResult[] = [];

    if (!targetPath) {
      // M7: none → standard locations
      progress.update('Discovering files in standard locations...');
      results = await validateAll(verbose ?? false);
    } else {
      const stats = await fs.stat(targetPath);
      if (stats.isFile()) {
        // M7: file → validate file
        progress.update(`Validating file: ${targetPath}...`);
        const result = await validateFile(targetPath);
        results.push(result);
      } else if (stats.isDirectory()) {
        // M7: dir → recurse
        progress.update(`Discovering files in directory: ${targetPath}...`);
        results = await validateDirectory(targetPath, verbose ?? false);
      } else {
        throw new Error(
          `Path is neither a file nor a directory: ${targetPath}`
        );
      }
    }

    progress.succeed(`Validation complete. Processed ${results.length} files.`);

    // Print results
    printResults(results, verbose ?? false);

    // M7: Exit generally zero unless fatal (I/O) error
    const hasErrors = results.some(r => !r.isValid);
    if (hasErrors && !verbose) {
      console.log(
        chalk.gray('\nTip: Use --verbose for detailed error information')
      );
    }
  } catch (error) {
    progress.fail('Validation failed.');
    handleError(error, {
      command: 'validate',
      context: 'validation process',
      suggestion: 'check file paths and permissions',
      ...(verbose && { verbose, timestamp: verbose }),
    });
  }
}
