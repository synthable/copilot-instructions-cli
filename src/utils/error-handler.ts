/**
 * @module utils/error-handler
 * @description Centralized error handling for commands with structured logging.
 */

import chalk from 'chalk';
import type { Ora } from 'ora';

/**
 * Error handler with structured logging support
 */
export interface ErrorHandlerOptions {
  command?: string;
  operation?: string;
  verbose?: boolean;
  timestamp?: boolean;
}

/**
 * Handles errors from command handlers with enhanced logging.
 * @param error - The error object.
 * @param options - Error handling options including structured logging.
 */
export function handleError(
  error: unknown,
  options: ErrorHandlerOptions = {}
): void {
  const { command, operation, verbose, timestamp } = options;

  let errorMessage = 'Operation failed.';
  if (command && operation) {
    errorMessage = `${command}:${operation} failed`;
  } else if (command) {
    errorMessage = `${command} failed`;
  }

  console.error(chalk.red(errorMessage));

  if (error instanceof Error) {
    if (verbose && timestamp) {
      const ts = new Date().toISOString();
      console.error(chalk.gray(`[${ts}] [ERROR]`), chalk.red(error.message));

      if (error.stack && verbose) {
        console.error(chalk.gray(`[${ts}] [ERROR] Stack trace:`));
        console.error(chalk.gray(error.stack));
      }
    } else {
      console.error(chalk.red(error.message));
    }
  }
}

/**
 * Legacy method for backwards compatibility
 */
export function handleErrorLegacy(error: unknown, spinner?: Ora): void {
  if (spinner) {
    spinner.fail(chalk.red('Operation failed.'));
  } else {
    console.error(chalk.red('Operation failed.'));
  }

  if (error instanceof Error) {
    console.error(chalk.red(error.message));
  }
}
