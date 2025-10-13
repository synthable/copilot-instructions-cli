/**
 * SDK-specific type definitions
 * Types used by the SDK layer (not in ums-lib)
 */

import type { Module, Persona, BuildReport } from 'ums-lib';

/**
 * Validation error structure (from UMS lib)
 */
export interface ValidationError {
  path?: string;
  message: string;
  section?: string;
}

/**
 * Module configuration from modules.config.yml
 */
export interface ModuleConfig {
  localModulePaths: LocalModulePath[];
}

/**
 * Local module path configuration
 */
export interface LocalModulePath {
  path: string;
  onConflict?: 'error' | 'warn' | 'replace';
}

/**
 * Config validation result
 */
export interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Options for buildPersona()
 */
export interface BuildOptions {
  /** Path to modules.config.yml (default: './modules.config.yml') */
  configPath?: string;

  /** Conflict resolution strategy (default: 'error') */
  conflictStrategy?: 'error' | 'warn' | 'replace';

  /** Include module attribution in output (default: false) */
  attribution?: boolean;

  /** Include standard library modules (default: true) */
  includeStandard?: boolean;
}

/**
 * Result from buildPersona()
 */
export interface BuildResult {
  /** Rendered Markdown content */
  markdown: string;

  /** Loaded persona object */
  persona: Persona;

  /** Resolved modules in composition order */
  modules: Module[];

  /** Build report with metadata */
  buildReport: BuildReport;

  /** Warnings generated during build */
  warnings: string[];
}

/**
 * Options for validateAll()
 */
export interface ValidateOptions {
  /** Path to modules.config.yml (default: './modules.config.yml') */
  configPath?: string;

  /** Include standard library modules (default: true) */
  includeStandard?: boolean;

  /** Validate personas in addition to modules (default: true) */
  includePersonas?: boolean;
}

/**
 * Validation report from validateAll()
 */
export interface ValidationReport {
  /** Total modules checked */
  totalModules: number;

  /** Modules that passed validation */
  validModules: number;

  /** Validation errors by module ID */
  errors: Map<string, ValidationError[]>;

  /** Validation warnings by module ID */
  warnings: Map<string, SDKValidationWarning[]>;

  /** Total personas checked */
  totalPersonas: number | undefined;

  /** Personas that passed validation */
  validPersonas: number | undefined;
}

/**
 * SDK-specific validation warning
 */
export interface SDKValidationWarning {
  code: string;
  message: string;
  path?: string;
}

/**
 * Options for listModules()
 */
export interface ListOptions {
  /** Path to modules.config.yml (default: './modules.config.yml') */
  configPath?: string;

  /** Include standard library modules (default: true) */
  includeStandard?: boolean;

  /** Filter by tier (foundation, principle, technology, execution) */
  tier?: string;

  /** Filter by capability */
  capability?: string;
}

/**
 * Module metadata for listing
 */
export interface ModuleInfo {
  /** Module ID */
  id: string;

  /** Human-readable name */
  name: string;

  /** Brief description */
  description: string;

  /** Module version */
  version: string;

  /** Capabilities provided */
  capabilities: string[];

  /** Source type */
  source: 'standard' | 'local';

  /** File path (if local) */
  filePath: string | undefined;
}
