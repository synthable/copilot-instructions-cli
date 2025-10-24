/**
 * UMS Library - Unified Module System v2.0 Implementation
 *
 * A reusable library for parsing, validating, and building modular AI instructions
 * using the UMS (Unified Module System) v2.0 specification.
 */

// Export all UMS v2.0 types
export * from './types/index.js';

// Export adapter types (loader contracts for implementation layer)
export * from './adapters/index.js';

// Deprecated classes removed in Phase 4 - use pure functions instead

// Export all core functionality from organized domains
export * from './core/index.js';

// Export error types
export {
  UMSError,
  UMSValidationError,
  ModuleLoadError,
  PersonaLoadError,
  BuildError,
  ConflictError,
  isUMSError,
  isValidationError,
  // v2.0 spec-compliant aliases
  ValidationError,
  ModuleParseError,
  PersonaParseError,
  // Error location type
  type ErrorLocation,
} from './utils/errors.js';

// Export utility functions
export { moduleIdToExportName } from './utils/transforms.js';

// Export constants (for CLI and SDK layers)
export { MODULE_ID_REGEX, UMS_SCHEMA_VERSION } from './constants.js';

// Export configuration types (for CLI layer)
export type { ModuleConfig } from './adapters/index.js';
