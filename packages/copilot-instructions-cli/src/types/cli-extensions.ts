/**
 * CLI-specific type extensions for UMS types
 *
 * These types extend the base UMS types with CLI-specific properties
 * like file paths for tracking module sources.
 */

import type { Module } from 'ums-lib';

/**
 * CLI-extended Module type that includes file path tracking
 *
 * The CLI adds filePath to modules for better error reporting
 * and source tracking. This is a CLI concern and not part of
 * the core UMS v2.0 spec.
 */
export interface CLIModule extends Module {
  /** Absolute file path where this module was loaded from */
  filePath?: string;
}

/**
 * Type guard to check if a Module is a CLIModule with filePath
 *
 * @param module - UMS v2.0 Module
 * @returns true if module has a filePath property
 */
export function isCLIModule(module: Module): module is CLIModule {
  return 'filePath' in module;
}

/**
 * Helper to get module metadata
 *
 * @param module - UMS v2.0 Module
 * @returns The module's metadata object
 */
export function getModuleMetadata(module: Module): Module['metadata'] {
  // In v2.0, metadata is required by the type system
  // No runtime check needed since it's enforced at the type level
  return module.metadata;
}
