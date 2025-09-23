/**
 * UMS Library - Unified Module System v1.0 Implementation
 *
 * A reusable library for parsing, validating, and building modular AI instructions
 * using the UMS (Unified Module System) v1.0 specification.
 */

// Export all UMS v1.0 types
export * from './types/index.js';

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
  isUMSError,
  isValidationError,
} from './utils/errors.js';
