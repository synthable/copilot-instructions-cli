/**
 * UMS v2.2 Declaration File Generator
 * Generates .d.ts files for UMS modules to improve IDE support.
 * @see UMS v2.2 Specification Section 6.2
 */

import { type Module, moduleIdToExportName } from 'ums-lib';

/**
 * Options for declaration generation
 */
export interface DeclarationGeneratorOptions {
  /** Whether to include JSDoc comments (default: true) */
  includeJSDoc?: boolean;
  /** Whether to generate declaration maps (not yet implemented) */
  declarationMap?: boolean;
}

/**
 * Generated declaration file content
 */
export interface GeneratedDeclaration {
  /** The path for the .d.ts file */
  path: string;
  /** The declaration file content */
  content: string;
}

/**
 * Generate a .d.ts declaration file for a module.
 * @param module - The module to generate declarations for
 * @param sourcePath - The source .module.ts file path
 * @param options - Generation options
 * @returns The generated declaration
 */
export function generateDeclaration(
  module: Module,
  sourcePath: string,
  options: DeclarationGeneratorOptions = {}
): GeneratedDeclaration {
  const { includeJSDoc = true } = options;
  const exportName = moduleIdToExportName(module.id);
  const declarationPath = sourcePath.replace(/\.module\.ts$/, '.module.d.ts');

  let content = `import type { Module } from 'ums-lib';\n\n`;

  if (includeJSDoc) {
    content += `/**\n`;
    content += ` * ${module.metadata.name}\n`;
    content += ` *\n`;
    content += ` * ${module.metadata.description}\n`;
    content += ` */\n`;
  }

  content += `export declare const ${exportName}: Module;\n`;

  return {
    path: declarationPath,
    content,
  };
}

/**
 * Generate declarations for multiple modules.
 * @param modules - Array of module and source path pairs
 * @param options - Generation options
 * @returns Array of generated declarations
 */
export function generateDeclarations(
  modules: { module: Module; sourcePath: string }[],
  options: DeclarationGeneratorOptions = {}
): GeneratedDeclaration[] {
  return modules.map(({ module, sourcePath }) =>
    generateDeclaration(module, sourcePath, options)
  );
}
