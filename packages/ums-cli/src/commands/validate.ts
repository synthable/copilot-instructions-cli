/**
 * @module commands/validate
 * @description Command to validate UMS v2.0 modules and persona files.
 *
 * Uses SDK's validateAll() for runtime validation of module and persona structure.
 */

import chalk from 'chalk';
import { handleError } from '../utils/error-handler.js';
import { validateAll } from 'ums-sdk';

interface ValidateOptions {
  targetPath?: string;
  verbose?: boolean;
}

/**
 * Handles the validate command for UMS v2.0 files
 *
 * Performs runtime validation of:
 * - Module structure and required fields
 * - Persona composition and module references
 * - UMS v2.0 specification compliance
 */
export async function handleValidate(
  options: ValidateOptions = {}
): Promise<void> {
  const { verbose } = options;

  try {
    console.log(chalk.cyan('🔍 Validating UMS v2.0 modules and personas...\n'));

    // Use SDK's validateAll() for comprehensive validation
    const report = await validateAll({
      includeStandard: true,
      includePersonas: true,
    });

    // Display results
    console.log(chalk.bold('Validation Results:'));
    console.log();

    // Module validation results
    console.log(chalk.cyan(`📦 Modules:`));
    console.log(
      `   Total: ${report.totalModules}, Valid: ${chalk.green(report.validModules)}, ` +
        `Invalid: ${chalk.red(report.totalModules - report.validModules)}`
    );

    // Persona validation results
    if (report.totalPersonas !== undefined && report.validPersonas !== undefined) {
      console.log(chalk.cyan(`👤 Personas:`));
      console.log(
        `   Total: ${report.totalPersonas}, Valid: ${chalk.green(report.validPersonas)}, ` +
          `Invalid: ${chalk.red(report.totalPersonas - report.validPersonas)}`
      );
    }

    console.log();

    // Show errors if any
    if (report.errors.size > 0) {
      console.log(chalk.red.bold(`❌ Validation Errors:\n`));

      for (const [id, errors] of report.errors.entries()) {
        console.log(chalk.red(`  ${id}:`));
        for (const error of errors) {
          console.log(chalk.red(`    • ${error.message}`));
          if (error.path && verbose) {
            console.log(chalk.gray(`      Path: ${error.path}`));
          }
        }
        console.log();
      }

      process.exit(1);
    }

    // Show warnings if any
    if (report.warnings.size > 0 && verbose) {
      console.log(chalk.yellow.bold(`⚠️  Validation Warnings:\n`));

      for (const [id, warnings] of report.warnings.entries()) {
        console.log(chalk.yellow(`  ${id}:`));
        for (const warning of warnings) {
          console.log(chalk.yellow(`    • ${warning.message}`));
        }
        console.log();
      }
    }

    // Success message
    console.log(
      chalk.green.bold('✓ All modules and personas are valid!')
    );
  } catch (error) {
    handleError(error, {
      command: 'validate',
      context: 'validation process',
      suggestion: 'check module and persona file syntax',
      ...(verbose && { verbose, timestamp: verbose }),
    });
    process.exit(1);
  }
}
