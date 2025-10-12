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
 * Helper to get module metadata with fallback for v1.0/v2.0 compatibility
 *
 * @param module - Module with either meta (v1.0) or metadata (v2.0)
 * @returns The module's metadata object
 */
export function getModuleMetadata(module: Module): NonNullable<Module['metadata']> {
  // v2.0 uses metadata, v1.0 uses meta (both exist for compatibility)
  // eslint-disable-next-line @typescript-eslint/no-deprecated, @typescript-eslint/no-unnecessary-condition
  const metadata = module.metadata ?? module.meta;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!metadata) {
    throw new Error(`Module ${module.id} is missing metadata/meta property`);
  }
  return metadata;
}
