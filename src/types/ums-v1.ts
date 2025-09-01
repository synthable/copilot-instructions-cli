/**
 * Type definitions for UMS v1.0 specification
 */

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
  /** Directive contract definition */
  declaredDirectives: DeclaredDirectives;
  /** Human-readable and AI-discoverable metadata */
  meta: ModuleMeta;
  /** The instructional content */
  body: ModuleBody;
  /** Absolute path to the source file */
  filePath: string;
}

// Declared directives contract (Section 2.1)
export interface DeclaredDirectives {
  /** Directives that MUST be present in body */
  required: string[];
  /** Directives that MAY be present in body */
  optional: string[];
}

// Module metadata block (Section 2.2)
export interface ModuleMeta {
  /** Human-readable, Title Case name */
  name: string;
  /** Concise, human-readable summary */
  description: string;
  /** Dense, keyword-rich paragraph for AI semantic search */
  semantic: string;
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
  /** Concise, single-sentence summary */
  description: string;
  /** Dense, keyword-rich paragraph for semantic search */
  semantic: string;
  /** Optional prologue describing role, voice, traits */
  role?: string;
  /** Whether to append attribution after each module */
  attribution?: boolean;
  /** Composition groups for modules */
  moduleGroups: ModuleGroup[];
}

// Module group within persona (Section 5.2)
export interface ModuleGroup {
  /** Name of the module group */
  groupName: string;
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

// Build Report structure (Section 9)
export interface BuildReport {
  /** Name from source persona.yml */
  personaName: string;
  /** Version of Build Report schema */
  schemaVersion: string;
  /** CLI/build tool version */
  toolVersion: string;
  /** Content digest of source persona.yml */
  personaDigest: string;
  /** UTC timestamp in ISO 8601 format */
  buildTimestamp: string;
  /** Ordered list of module groups and resolved modules */
  moduleGroups: ResolvedModuleGroup[];
}

export interface ResolvedModuleGroup {
  /** Name of the group */
  groupName: string;
  /** Fully resolved module objects in this group */
  modules: ResolvedModule[];
}

export interface ResolvedModule {
  /** Unique, version-agnostic ID */
  id: string;
  /** Module's declared version */
  version: string;
  /** Primary source label */
  source: string;
  /** Cryptographic hash of module file content */
  digest: string;
  /** Module's declared shape */
  shape: string;
  /** Contract as declared in module */
  declaredDirectives: DeclaredDirectives;
  /** Present if module was composed from multiple sources */
  composedFrom?: CompositionEvent[];
}

export interface CompositionEvent {
  /** Module ID */
  id: string;
  /** Source module version */
  version: string;
  /** Source label */
  source: string;
  /** Content digest */
  digest: string;
  /** Composition strategy */
  strategy: 'base' | 'replace';
}
