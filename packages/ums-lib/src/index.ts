/**
 * UMS Library - Unified Module System v1.0 Implementation
 *
 * A reusable library for parsing, validating, and building modular AI instructions
 * using the UMS (Unified Module System) v1.0 specification.
 */

// Export all UMS v1.0 types
export * from './types/index.js';

// Export core functionality
export { BuildEngine, ModuleRegistry } from './core/build-engine.js';
export type { BuildOptions, BuildResult } from './core/build-engine.js';

export { loadModule } from './core/module-loader.js';
export { loadPersona } from './core/persona-loader.js';

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
