/**
 * Type definitions for UMS v1.0 specification
 */

// Module configuration types (UMS v1.0 spec Section 6.1)
export interface ModuleConfig {
  /** Local module paths with conflict resolution */
  localModulePaths: LocalModulePath[];
}

export interface LocalModulePath {
  /** Relative path from project root to directory containing .module.yml files */
  path: string;
  /** Conflict resolution strategy when module IDs collide */
  onConflict?: 'error' | 'replace' | 'warn';
}

// Top-level UMS v1.0 Module structure (Section 2.1)
export interface UMSModule {
  /** The Module Identifier (Section 3) */
  id: string;
  /** Semantic version (present but ignored in v1.0) */
  version: string;
  /** UMS specification version ("1.0") */
  schemaVersion: string;
  /** Module structural type (Section 2.5) */
  shape: string;
  /** Human-readable and AI-discoverable metadata */
  meta: ModuleMeta;
  /** The instructional content */
  body: ModuleBody;
  /** Absolute path to the source file (present when loaded from filesystem, absent for parsed content) */
  filePath?: string;
}

// Module metadata block (Section 2.2)
export interface ModuleMeta {
  /** Human-readable, Title Case name */
  name: string;
  /** Concise, human-readable summary */
  description: string;
  /** Dense, keyword-rich paragraph for AI semantic search */
  semantic: string;
  /** Foundation layer number (0-4, foundation tier only) */
  layer?: number;
  /** Optional lowercase keywords for filtering and search boosting */
  tags?: string[];
  /** SPDX license identifier */
  license?: string;
  /** List of primary authors or maintainers */
  authors?: string[];
  /** URL to source repository or documentation */
  homepage?: string;
  /** Flag indicating if module is deprecated */
  deprecated?: boolean;
  /** ID of successor module if deprecated */
  replacedBy?: string;
}

// Module body containing typed directives (Section 4)
export interface ModuleBody {
  /** Primary objective or core concept (string) */
  goal?: string;
  /** Sequential steps (array of strings) */
  process?: string[];
  /** Non-negotiable rules (array of strings) */
  constraints?: string[];
  /** High-level concepts and trade-offs (array of strings) */
  principles?: string[];
  /** Verification checklist (array of strings) */
  criteria?: string[];
  /** Structured data block */
  data?: DataDirective;
  /** Illustrative examples */
  examples?: ExampleDirective[];
}

// Data directive object structure (Section 4.2)
export interface DataDirective {
  /** IANA media type of content */
  mediaType: string;
  /** Raw content as multi-line string */
  value: string;
}

// Example directive object structure (Section 4.3)
export interface ExampleDirective {
  /** Short, descriptive title (unique within module) */
  title: string;
  /** Brief explanation of what the example demonstrates */
  rationale: string;
  /** Primary code or text snippet */
  snippet: string;
  /** Language for syntax highlighting */
  language?: string;
}

// Persona definition structure (Section 5)
export interface UMSPersona {
  /** Human-readable, Title Case name */
  name: string;
  /** Semantic version (required but ignored in v1.0) */
  version: string;
  /** UMS specification version ("1.0") */
  schemaVersion: string;
  /** Concise, single-sentence summary */
  description: string;
  /** Dense, keyword-rich paragraph for semantic search */
  semantic: string;
  /** Prologue describing role, voice, traits (renamed from role) */
  identity: string;
  /** Whether to append attribution after each module */
  attribution?: boolean;
  /** Composition groups for modules */
  moduleGroups: ModuleGroup[];
}

// Module group within persona (Section 5.2)
export interface ModuleGroup {
  /** Name of the module group (optional) */
  groupName?: string;
  /** Array of module IDs in this group */
  modules: string[];
}

// Validation result types
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** List of validation errors */
  errors: ValidationError[];
  /** List of validation warnings */
  warnings: ValidationWarning[];
}

export interface ValidationError {
  /** Path to the problematic field */
  path: string;
  /** Error message */
  message: string;
  /** UMS specification section reference */
  section?: string;
}

export interface ValidationWarning {
  /** Path to the field that triggered warning */
  path: string;
  /** Warning message */
  message: string;
}

// Build Report structure (UMS v1.0 spec section 9.3 compliant)
export interface BuildReport {
  /** Persona name */
  personaName: string;
  /** UMS schema version ("1.0") */
  schemaVersion: string;
  /** Tool version */
  toolVersion: string;
  /** SHA-256 digest of persona content */
  personaDigest: string;
  /** Build timestamp in ISO 8601 UTC format */
  buildTimestamp: string;
  /** Module groups */
  moduleGroups: BuildReportGroup[];
}

export interface BuildReportGroup {
  /** Group name */
  groupName: string;
  /** Modules in this group */
  modules: BuildReportModule[];
}

export interface BuildReportModule {
  /** Module ID */
  id: string;
  /** Module name from meta */
  name: string;
  /** Module version */
  version: string;
  /** Module source (e.g., "Standard Library", "Local") */
  source: string;
  /** SHA-256 digest of module file content */
  digest: string;
  /** Module shape */
  shape: string;
  /** Whether module is deprecated */
  deprecated: boolean;
  /** Replacement module ID if deprecated */
  replacedBy?: string;
  /** Modules this module was composed from (for replace operations) */
  composedFrom?: string[];
}

// Conflict-aware registry types (Phase 2)
export interface ModuleEntry {
  /** The UMS module */
  module: UMSModule;
  /** Source information for the module */
  source: ModuleSource;
  /** Timestamp when the module was added to registry */
  addedAt: number;
}

export interface ModuleSource {
  /** Type of module source */
  type: 'standard' | 'local' | 'remote';
  /** Path to the module source */
  path: string;
}

export type ConflictStrategy = 'error' | 'warn' | 'replace';

export interface IModuleRegistry {
  /** Add a module to the registry */
  add(module: UMSModule, source: ModuleSource): void;

  /** Resolve a module by ID, applying conflict resolution if needed */
  resolve(id: string, strategy?: ConflictStrategy): UMSModule | null;

  /** Check if registry has a module by ID */
  has(id: string): boolean;

  /** Get total number of unique module IDs */
  size(): number;

  /** Get all conflicting entries for a module ID */
  getConflicts(id: string): ModuleEntry[] | null;

  /** Get all module IDs that have conflicts */
  getConflictingIds(): string[];

  /** Resolve all modules using a specific strategy */
  resolveAll(strategy: ConflictStrategy): Map<string, UMSModule>;

  /** Add multiple modules at once */
  addAll(modules: UMSModule[], source: ModuleSource): void;

  /** Get all entries in the registry */
  getAllEntries(): Map<string, ModuleEntry[]>;

  /** Get summary of sources in registry */
  getSourceSummary(): Record<string, number>;
}
