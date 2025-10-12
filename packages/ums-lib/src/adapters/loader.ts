/**
 * Loader Adapter Types
 *
 * These type-only interfaces define the contract between ums-lib (data-only)
 * and the implementation layer (CLI/loader) that performs file I/O and
 * TypeScript execution.
 *
 * IMPORTANT: This file contains NO runtime code. All types are for compile-time
 * safety and documentation. The implementation layer is responsible for:
 * - Loading .module.ts and .persona.ts files (via tsx or precompiled .js)
 * - File discovery and caching
 * - Standard library location and loading
 * - Configuration file parsing
 *
 * See ADR 0002 (Dynamic TypeScript Loading) for implementation guidance.
 */

import type { Module } from '../types/index.js';
import type { Persona } from '../types/index.js';

// ============================================================================
// Source Metadata
// ============================================================================

/**
 * Source type for modules loaded into the registry
 */
export type ModuleSourceType = 'standard' | 'local' | 'remote';

/**
 * Metadata about where a module came from
 *
 * The implementation layer populates this when loading modules.
 * ums-lib uses it for build reports and conflict diagnostics.
 */
export interface ModuleSourceInfo {
  /** Source type: standard library, local path, or remote registry */
  type: ModuleSourceType;

  /** File path or package identifier (implementation-defined) */
  path?: string;

  /** Optional npm package or distribution identifier (e.g., "@org/pkg@1.0.0") */
  package?: string;

  /** Optional git ref, version tag, or source ID */
  ref?: string;
}

// ============================================================================
// Diagnostics & Error Reporting
// ============================================================================

/**
 * File location information for diagnostics
 *
 * The implementation layer provides this when errors occur during loading.
 * ums-lib can attach this to ValidationError.context for CLI formatting.
 */
export interface FileLocation {
  /** Absolute or repo-relative file path */
  path: string;

  /** Line number (1-based), if available */
  line?: number;

  /** Column number (1-based), if available */
  column?: number;
}

/**
 * Diagnostic message from the loader
 *
 * The implementation layer emits these during loading/parsing.
 * ums-lib treats them opaquely but can include them in error contexts.
 */
export interface LoaderDiagnostic {
  /** Human-readable diagnostic message */
  message: string;

  /** Severity level */
  severity: 'error' | 'warning' | 'info';

  /** Optional machine-readable error code (e.g., 'MISSING_EXPORT', 'INVALID_ID') */
  code?: string;

  /** Optional file location where the issue occurred */
  location?: FileLocation;

  /** Optional code snippet or context preview */
  snippet?: string;
}

// ============================================================================
// Loaded Artifact Envelopes
// ============================================================================

/**
 * Result of loading a single module file
 *
 * The implementation layer constructs this after loading a .module.ts file.
 * ums-lib consumes the `module` object and optional metadata.
 */
export interface LoadedModule {
  /** Parsed and validated module object */
  module: Module;

  /** Source metadata (where this module came from) */
  source: ModuleSourceInfo;

  /** Optional raw source text (for digest calculation or error reporting) */
  raw?: string;

  /** Optional diagnostics collected during loading */
  diagnostics?: LoaderDiagnostic[];
}

/**
 * Result of loading a single persona file
 *
 * The implementation layer constructs this after loading a .persona.ts file.
 * ums-lib consumes the `persona` object and optional metadata.
 */
export interface LoadedPersona {
  /** Parsed and validated persona object */
  persona: Persona;

  /** Optional source metadata */
  source?: ModuleSourceInfo;

  /** Optional raw source text */
  raw?: string;

  /** Optional diagnostics collected during loading */
  diagnostics?: LoaderDiagnostic[];
}

// ============================================================================
// Generic Load Result (Success/Failure)
// ============================================================================

/**
 * Discriminated union for load operations
 *
 * Useful for implementation-layer functions that may fail during loading.
 * Example: loadModuleFile(path: string): LoadResult<LoadedModule>
 */
export type LoadResult<T> =
  | {
      success: true;
      value: T;
    }
  | {
      success: false;
      diagnostics: LoaderDiagnostic[];
    };

// ============================================================================
// Registry Helper Types
// ============================================================================

/**
 * Simplified module entry for registry operations
 *
 * The implementation layer can use this when adding modules to the registry.
 * Contains just the essential fields for registry.add(module, source).
 */
export interface ModuleEntryForRegistry {
  /** Module object to add */
  module: Module;

  /** Source metadata */
  source: ModuleSourceInfo;

  /** Optional raw text for digest calculation */
  raw?: string;
}

// ============================================================================
// Usage Examples (Type-Only, Not Executed)
// ============================================================================

/**
 * Example: How the implementation layer would use these types
 *
 * ```typescript
 * // In CLI/loader package (NOT in ums-lib):
 *
 * import { LoadedModule, LoadResult } from 'ums-lib';
 *
 * async function loadModuleFile(filePath: string): LoadResult<LoadedModule> {
 *   try {
 *     // Use tsx or dynamic import
 *     const moduleExports = await import(filePath);
 *     const exportName = moduleIdToExportName(moduleId);
 *     const moduleObject = moduleExports[exportName];
 *
 *     // Validate with ums-lib
 *     const validationResult = validateModule(moduleObject);
 *     if (!validationResult.valid) {
 *       return {
 *         success: false,
 *         diagnostics: validationResult.errors.map(e => ({
 *           message: e.message,
 *           severity: 'error',
 *           location: { path: filePath }
 *         }))
 *       };
 *     }
 *
 *     return {
 *       success: true,
 *       value: {
 *         module: moduleObject,
 *         source: { type: 'local', path: filePath },
 *         raw: await fs.readFile(filePath, 'utf-8')
 *       }
 *     };
 *   } catch (error) {
 *     return {
 *       success: false,
 *       diagnostics: [{
 *         message: `Failed to load module: ${error.message}`,
 *         severity: 'error',
 *         location: { path: filePath }
 *       }]
 *     };
 *   }
 * }
 * ```
 */
export type LoaderUsageExample = never;
