/**
 * @module utils/error-handler
 * @description Centralized error handling for commands with structured logging.
 */

import chalk from 'chalk';
import type { Ora } from 'ora';
import {
  UMSValidationError,
  ModuleLoadError,
  PersonaLoadError,
  BuildError,
  ConflictError,
  isUMSError,
  type UMSError,
} from 'ums-lib';

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
 * Handle ConflictError with specific formatting
 */
function handleConflictError(
  error: ConflictError,
  command: string,
  context?: string
): void {
  const contextPart = context ?? 'module resolution';
  const formattedMessage = `[ERROR] ${command}: ${contextPart} - ${error.message}`;

  console.error(chalk.red(formattedMessage));
  console.error(chalk.yellow('  Conflict Details:'));
  console.error(chalk.yellow(`    Module ID: ${error.moduleId}`));
  console.error(
    chalk.yellow(`    Conflicting versions: ${error.conflictCount}`)
  );

  const suggestions = [
    'Use --conflict-strategy=warn to resolve with warnings',
    'Use --conflict-strategy=replace to use the latest version',
    'Remove duplicate modules from different sources',
    'Check your module configuration files',
  ];

  console.error(chalk.blue('  Suggestions:'));
  suggestions.forEach(suggestion => {
    console.error(chalk.blue(`    • ${suggestion}`));
  });
}

/**
 * Handle validation errors with file and section info
 */
function handleValidationError(
  error: UMSValidationError,
  command: string,
  context?: string
): void {
  const contextPart = context ?? 'validation';
  const formattedMessage = `[ERROR] ${command}: ${contextPart} - ${error.message}`;

  console.error(chalk.red(formattedMessage));
  if (error.path) {
    console.error(chalk.yellow(`  File: ${error.path}`));
  }
  if (error.section) {
    console.error(chalk.yellow(`  Section: ${error.section}`));
  }

  const suggestions = [
    'Check YAML syntax and structure',
    'Verify all required fields are present',
    'Review UMS v1.0 specification for correct format',
  ];

  console.error(chalk.blue('  Suggestions:'));
  suggestions.forEach(suggestion => {
    console.error(chalk.blue(`    • ${suggestion}`));
  });
}

/**
 * Handle module/persona load errors with file path info
 */
function handleLoadError(
  error: ModuleLoadError | PersonaLoadError,
  command: string,
  context?: string
): void {
  const isModule = error instanceof ModuleLoadError;
  const defaultContext = isModule ? 'module loading' : 'persona loading';
  const contextPart = context ?? defaultContext;
  const formattedMessage = `[ERROR] ${command}: ${contextPart} - ${error.message}`;

  console.error(chalk.red(formattedMessage));
  if (error.filePath) {
    console.error(chalk.yellow(`  File: ${error.filePath}`));
  }

  const suggestions = isModule
    ? [
        'Check file exists and is readable',
        'Verify file path is correct',
        'Ensure file contains valid YAML content',
      ]
    : [
        'Check persona file exists and is readable',
        'Verify persona YAML structure',
        'Ensure all referenced modules exist',
      ];

  console.error(chalk.blue('  Suggestions:'));
  suggestions.forEach(suggestion => {
    console.error(chalk.blue(`    • ${suggestion}`));
  });
}

/**
 * Enhanced error handling for UMS-specific error types
 */
function handleUMSError(error: UMSError, options: ErrorHandlerOptions): void {
  const { command, context, verbose, timestamp } = options;

  // Handle specific UMS error types
  if (error instanceof ConflictError) {
    handleConflictError(error, command, context);
  } else if (error instanceof UMSValidationError) {
    handleValidationError(error, command, context);
  } else if (
    error instanceof ModuleLoadError ||
    error instanceof PersonaLoadError
  ) {
    handleLoadError(error, command, context);
  } else if (error instanceof BuildError) {
    const contextPart = context ?? 'build process';
    const formattedMessage = `[ERROR] ${command}: ${contextPart} - ${error.message}`;
    console.error(chalk.red(formattedMessage));

    const suggestions = [
      'Check persona and module files are valid',
      'Verify all dependencies are available',
      'Review error details above',
    ];

    console.error(chalk.blue('  Suggestions:'));
    suggestions.forEach(suggestion => {
      console.error(chalk.blue(`    • ${suggestion}`));
    });
  } else {
    // Generic UMS error
    const contextPart = context ?? 'UMS operation';
    const formattedMessage = `[ERROR] ${command}: ${contextPart} - ${error.message}`;
    console.error(chalk.red(formattedMessage));

    if (error.context) {
      console.error(chalk.yellow(`  Context: ${error.context}`));
    }

    const suggestions = [
      'Review error details and try again',
      'Check UMS v1.0 specification for guidance',
    ];

    console.error(chalk.blue('  Suggestions:'));
    suggestions.forEach(suggestion => {
      console.error(chalk.blue(`    • ${suggestion}`));
    });
  }

  // Add verbose output if requested
  if (verbose && timestamp) {
    const ts = new Date().toISOString();
    console.error(chalk.gray(`[${ts}] [ERROR] Error code: ${error.code}`));

    if (error.stack) {
      console.error(chalk.gray(`[${ts}] [ERROR] Stack trace:`));
      console.error(chalk.gray(error.stack));
    }
  }
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

  // Handle UMS-specific errors with enhanced formatting
  if (isUMSError(error)) {
    handleUMSError(error, options);
    return;
  }

  // Handle generic errors
  const errorMessage = error instanceof Error ? error.message : String(error);
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
