/**
 * UMS SDK v1.0
 *
 * Node.js SDK for UMS v2.0 - provides file system operations,
 * TypeScript module loading, and high-level orchestration.
 *
 * ARCHITECTURE (4-Tier API):
 * - Tier 1: High-level convenience functions (recommended)
 * - Tier 2: I/O operations - loaders, discovery, orchestration (advanced)
 * - Tier 3: Domain utilities - validation, registry, transforms (common needs)
 * - Tier 4: Types and errors (all re-exported)
 *
 * IMPORTANT: Applications should import from ums-sdk only, never from ums-lib directly.
 * ums-lib is an internal implementation detail of the SDK.
 *
 * @see {@link file://./../../docs/spec/ums_sdk_v1_spec.md}
 */

// ===== TIER 4: UMS-LIB TYPE RE-EXPORTS (for convenience) =====
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

// Re-export enums (not types)
export { CognitiveLevel, ComponentType } from 'ums-lib';

// ===== TIER 4: UMS-LIB ERROR RE-EXPORTS (for error handling) =====
export {
  UMSError,
  UMSValidationError,
  ModuleLoadError as UMSModuleLoadError,  // Alias to avoid conflict with SDK's internal ModuleLoadError
  PersonaLoadError,
  ConflictError,
  ModuleParseError,
  PersonaParseError,
  BuildError,
  isUMSError,
  isValidationError,
  type ErrorLocation,
} from 'ums-lib';

// ===== TIER 1: HIGH-LEVEL API (Recommended) =====
export { buildPersona, validateAll, listModules } from './api/index.js';

// ===== TIER 2: I/O OPERATIONS (Advanced) =====
export { ModuleLoader, PersonaLoader, ConfigManager } from './loaders/index.js';
export { ModuleDiscovery, StandardLibrary } from './discovery/index.js';

// ===== TIER 3: DOMAIN UTILITIES (Common Needs) =====
// Re-export commonly needed domain functions from ums-lib for application use
export {
  // Validation - for custom validation workflows beyond validateAll()
  validateModule,
  validatePersona,
  // Registry - for inspect/debug tools and conflict analysis
  ModuleRegistry,
  // Rendering - for custom build workflows (until migrated to buildPersona())
  renderMarkdown,
  generateBuildReport,
  // Transforms - for path/name calculations
  moduleIdToExportName,
  // Formatting utilities - for CLI display and user-facing output
  parseCognitiveLevel,
  getCognitiveLevelName,
  // Constants - for validation and regex matching
  MODULE_ID_REGEX,
  UMS_SCHEMA_VERSION,
} from 'ums-lib';

// ===== TIER 4: SDK-SPECIFIC TYPES =====
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

// ===== TIER 4: SDK-SPECIFIC ERRORS =====
export {
  SDKError,
  ModuleNotFoundError,
  InvalidExportError,
  ConfigError,
  DiscoveryError,
  ModuleLoadError,
} from './errors/index.js';
