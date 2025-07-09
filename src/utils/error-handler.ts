/**
 * @module utils/error-handler
 * @description Centralized error handling for commands.
 */

import chalk from 'chalk';
import type { Ora } from 'ora';

/**
 * Handles errors from command handlers.
 * @param error - The error object.
 * @param spinner - An optional ora spinner instance.
 */
export function handleError(error: unknown, spinner?: Ora): void {
  if (spinner) {
    spinner.fail(chalk.red('Operation failed.'));
  } else {
    console.error(chalk.red('Operation failed.'));
  }

  if (error instanceof Error) {
    console.error(chalk.red(error.message));
  }
  process.exit(1);
}
