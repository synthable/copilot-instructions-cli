/**
 * Error formatting utilities for consistent error messages across CLI commands
 * Following M0.5 standards: [ERROR] <command>: <context> - <specific issue> (<suggestion>)
 */

export interface ErrorContext {
  command: string;
  context: string;
  issue: string;
  suggestion: string;
  filePath?: string;
  keyPath?: string;
  sectionReference?: string;
}

export interface WarningContext {
  command: string;
  context: string;
  issue: string;
  filePath?: string;
}

export interface InfoContext {
  command: string;
  message: string;
}

/**
 * Format a standardized error message
 */
export function formatError(ctx: ErrorContext): string {
  let message = `[ERROR] ${ctx.command}: ${ctx.context} - ${ctx.issue} (${ctx.suggestion})`;

  if (ctx.filePath) {
    message += `\n  File: ${ctx.filePath}`;
  }

  if (ctx.keyPath) {
    message += `\n  Key path: ${ctx.keyPath}`;
  }

  if (ctx.sectionReference) {
    message += `\n  Reference: UMS v2.0 ${ctx.sectionReference}`;
  }

  return message;
}

/**
 * Format a command-specific error with consistent styling
 */
export function formatCommandError(
  command: string,
  message: string,
  filePath?: string
): string {
  let formatted = `[ERROR] ${command}: ${message}`;

  if (filePath) {
    formatted += `\n  File: ${filePath}`;
  }

  return formatted;
}

/**
 * Format validation error with enhanced context
 */
export function formatValidationError(
  command: string,
  filePath: string,
  issue: string,
  suggestion: string,
  keyPath?: string,
  sectionRef?: string
): string {
  return formatError({
    command,
    context: `validation failed`,
    issue,
    suggestion,
    filePath,
    ...(keyPath && { keyPath }),
    ...(sectionRef && { sectionReference: sectionRef }),
  });
}

/**
 * Format a standardized warning message
 */
export function formatWarning(ctx: WarningContext): string {
  let message = `[WARN] ${ctx.command}: ${ctx.context} - ${ctx.issue} (continuing...)`;

  if (ctx.filePath) {
    message += `\n  File: ${ctx.filePath}`;
  }

  return message;
}

/**
 * Format a standardized info message
 */
export function formatInfo(ctx: InfoContext): string {
  return `[INFO] ${ctx.command}: ${ctx.message}`;
}

/**
 * Format deprecation warning with enhanced guidance
 */
export function formatDeprecationWarning(
  command: string,
  moduleId: string,
  replacedBy?: string,
  filePath?: string
): string {
  let message = `[WARN] ${command}: Module '${moduleId}' is deprecated`;

  if (replacedBy) {
    message += ` and has been replaced by '${replacedBy}'. Please update your persona file to use the replacement module.`;
  } else {
    message += '. This module may be removed in a future version.';
  }

  if (filePath) {
    message += `\n  File: ${filePath}`;
  }

  return message;
}

/**
 * Common error messages for ID validation
 */
export const ID_VALIDATION_ERRORS = {
  invalidFormat: (id: string): string =>
    `Module ID '${id}' does not match required format. Must be lowercase with optional path segments separated by '/'`,

  emptySegment: (id: string): string =>
    `Module ID '${id}' contains empty segments (double slashes or leading/trailing slashes)`,

  invalidCharacters: (id: string): string =>
    `Module ID '${id}' contains invalid characters. Only lowercase letters, numbers, and hyphens are allowed`,

  uppercaseCharacters: (id: string): string =>
    `Module ID '${id}' contains uppercase characters. All segments must be lowercase`,

  invalidModuleName: (moduleName: string): string =>
    `Module name '${moduleName}' is invalid. Must start with a letter or number and contain only lowercase letters, numbers, and hyphens`,
};

/**
 * Common error messages for schema validation
 */
export const SCHEMA_VALIDATION_ERRORS = {
  missingField: (field: string): string =>
    `Required field '${field}' is missing`,

  wrongType: (field: string, expected: string, actual: string): string =>
    `Field '${field}' must be ${expected}, got ${actual}`,

  wrongSchemaVersion: (actual: string): string =>
    `Schema version must be '2.0', got '${actual}'`,

  undeclaredDirective: (directive: string, declared: string[]): string =>
    `Directive '${directive}' is not declared. Declared directives: ${declared.join(', ')}`,

  missingRequiredDirective: (directive: string): string =>
    `Required directive '${directive}' is missing from body`,

  invalidDirectiveType: (directive: string, expected: string): string =>
    `Directive '${directive}' must be ${expected}`,

  duplicateModuleId: (id: string, groupName: string): string =>
    `Module ID '${id}' appears multiple times in group '${groupName}'. Each ID must be unique within a group.`,
};
