/**
 * @module utils/error-handler
 * @description Centralized error handling for commands with structured logging.
 */

import chalk from 'chalk';
import type { Ora } from 'ora';

/**
 * Error handler with M0.5 standardized formatting support
 */
export interface ErrorHandlerOptions {
  command: string;
  context?: string;
  suggestion?: string;
  filePath?: string;
  keyPath?: string;
  verbose?: boolean;
  timestamp?: boolean;
}

/**
 * Handles errors from command handlers using M0.5 standard format.
 * Format: [ERROR] <command>: <context> - <specific issue> (<suggestion>)
 * @param error - The error object.
 * @param options - Error handling options following M0.5 standards.
 */
export function handleError(
  error: unknown,
  options: ErrorHandlerOptions
): void {
  const {
    command,
    context,
    suggestion,
    filePath,
    keyPath,
    verbose,
    timestamp,
  } = options;

  const errorMessage = error instanceof Error ? error.message : String(error);

  // Build M0.5 standardized error message
  const contextPart = context ?? 'operation failed';
  const suggestionPart = suggestion ?? 'check the error details and try again';

  let formattedMessage = `[ERROR] ${command}: ${contextPart} - ${errorMessage} (${suggestionPart})`;

  if (filePath) {
    formattedMessage += `\n  File: ${filePath}`;
  }

  if (keyPath) {
    formattedMessage += `\n  Key path: ${keyPath}`;
  }

  if (verbose && timestamp) {
    const ts = new Date().toISOString();
    console.error(chalk.gray(`[${ts}]`), chalk.red(formattedMessage));

    if (error instanceof Error && error.stack) {
      console.error(chalk.gray(`[${ts}] [ERROR] Stack trace:`));
      console.error(chalk.gray(error.stack));
    }
  } else {
    console.error(chalk.red(formattedMessage));
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
