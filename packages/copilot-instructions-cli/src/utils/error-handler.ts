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
  type ErrorLocation,
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
 * Format error location for display
 */
function formatLocation(location: ErrorLocation): string {
  const parts: string[] = [];

  if (location.filePath) {
    parts.push(location.filePath);
  }

  if (location.line !== undefined) {
    if (location.column !== undefined) {
      parts.push(`line ${location.line}, column ${location.column}`);
    } else {
      parts.push(`line ${location.line}`);
    }
  }

  return parts.join(':');
}

/**
 * Format spec section reference for display
 */
function formatSpecSection(specSection: string): string {
  return chalk.cyan(`  Specification: ${specSection}`);
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
  _command: string,
  _context?: string
): void {
  // Error header
  console.error(chalk.red(`❌ Error: ${error.message}`));
  console.error();

  // Location information
  if (error.location) {
    console.error(chalk.yellow(`   Location: ${formatLocation(error.location)}`));
  } else if (error.path) {
    console.error(chalk.yellow(`   File: ${error.path}`));
  }

  // Field path (if available)
  if (error.section) {
    console.error(chalk.yellow(`   Field: ${error.section}`));
  }

  // Spec reference
  if (error.specSection) {
    console.error(formatSpecSection(error.specSection));
  }

  console.error();

  // Suggestions
  const suggestions = [
    'Check YAML/TypeScript syntax and structure',
    'Verify all required fields are present',
    'Review UMS specification for correct format',
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
  _command: string,
  _context?: string
): void {
  const isModule = error instanceof ModuleLoadError;

  // Error header
  console.error(chalk.red(`❌ Error: ${error.message}`));
  console.error();

  // Location information
  if (error.location) {
    console.error(chalk.yellow(`   Location: ${formatLocation(error.location)}`));
  } else if (error.filePath) {
    console.error(chalk.yellow(`   File: ${error.filePath}`));
  }

  // Spec reference
  if (error.specSection) {
    console.error(formatSpecSection(error.specSection));
  }

  console.error();

  // Suggestions
  const suggestions = isModule
    ? [
        'Check file exists and is readable',
        'Verify file path is correct',
        'Ensure file contains valid YAML or TypeScript content',
        'Check module ID matches export name for TypeScript modules',
      ]
    : [
        'Check persona file exists and is readable',
        'Verify persona YAML/TypeScript structure',
        'Ensure all referenced modules exist',
        'Check export format for TypeScript personas',
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

    // Error header
    console.error(chalk.red(`❌ Error: ${error.message}`));
    console.error();

    // Location information
    if (error.location) {
      console.error(chalk.yellow(`   Location: ${formatLocation(error.location)}`));
    }

    // Context
    if (error.context) {
      console.error(chalk.yellow(`   Context: ${error.context}`));
    }

    // Spec reference
    if (error.specSection) {
      console.error(formatSpecSection(error.specSection));
    }

    console.error();

    const suggestions = [
      'Review error details and try again',
      'Check UMS specification for guidance',
    ];

    console.error(chalk.blue('  Suggestions:'));
    suggestions.forEach(suggestion => {
      console.error(chalk.blue(`    • ${suggestion}`));
    });
  }

  // Add verbose output if requested
  if (verbose && timestamp) {
    console.error();
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
