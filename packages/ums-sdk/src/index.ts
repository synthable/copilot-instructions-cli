/**
 * UMS SDK v1.0
 *
 * Node.js SDK for UMS v2.0 - provides file system operations,
 * TypeScript module loading, and high-level orchestration.
 *
 * ARCHITECTURE:
 * - This package re-exports TYPES from ums-lib for convenience
 * - For domain functions, import ums-lib directly or use SDK's high-level API
 * - SDK = I/O layer, ums-lib = domain layer
 *
 * @see {@link file://./../../docs/spec/ums_sdk_v1_spec.md}
 */

// ===== RE-EXPORT TYPES FROM UMS-LIB (for convenience) =====
export type {
  // Core types
  Module,
  Persona,
  BuildReport,
  BuildReportGroup,
  BuildReportModule,
  // Module components
  ModuleMetadata,
  InstructionComponent,
  KnowledgeComponent,
  DataComponent,
  Component,
  // Module details
  ProcessStep,
  Constraint,
  Criterion,
  Concept,
  Example,
  Pattern,
  ProblemSolution,
  ComponentMetadata,
  ModuleRelationships,
  QualityMetadata,
  // Persona structure
  ModuleGroup,
  ModuleEntry,
  // Registry
  RegistryEntry,
  ModuleSource,
  ConflictStrategy,
  // Validation
  ValidationResult,
  ValidationError,
  ValidationWarning,
  // Config (from adapters)
  ModuleConfig,
} from 'ums-lib';

// Re-export error classes (needed for error handling)
export {
  UMSError,
  ConflictError,
  ValidationError as UMSValidationError,
  ModuleParseError,
  PersonaParseError,
  BuildError,
  isUMSError,
  isValidationError,
  type ErrorLocation,
} from 'ums-lib';

// ===== HIGH-LEVEL API (Recommended) =====
export { buildPersona, validateAll, listModules } from './api/index.js';

// ===== LOW-LEVEL API (Advanced) =====
export { ModuleLoader, PersonaLoader, ConfigManager } from './loaders/index.js';
export { ModuleDiscovery, StandardLibrary } from './discovery/index.js';

// ===== SDK-SPECIFIC TYPES =====
export type {
  LocalModulePath,
  ConfigValidationResult,
  BuildOptions,
  BuildResult,
  ValidateOptions,
  ValidationReport,
  SDKValidationWarning,
  ListOptions,
  ModuleInfo,
} from './types/index.js';

// ===== SDK-SPECIFIC ERRORS =====
export {
  SDKError,
  ModuleNotFoundError,
  InvalidExportError,
  ConfigError,
  DiscoveryError,
  ModuleLoadError,
} from './errors/index.js';
