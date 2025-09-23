/**
 * UMS Library - Unified Module System v1.0 Implementation
 *
 * A reusable library for parsing, validating, and building modular AI instructions
 * using the UMS (Unified Module System) v1.0 specification.
 */

// Export all UMS v1.0 types
export * from './types/index.js';

// Deprecated classes removed in Phase 4 - use pure functions instead

// Export pure parsing functions (file-based loading removed in Phase 4)
export { parseModule } from './core/module-loader.js';
export { parsePersona } from './core/persona-loader.js';

// Export pure functions for Phase 3 architecture
export {
  resolveModules,
  resolveImplementations,
  validateModuleReferences,
  createModuleRegistry,
  resolvePersonaModules,
  type ModuleResolutionResult,
} from './core/resolver.js';

export {
  renderMarkdown,
  renderModule,
  renderDirective,
  renderGoal,
  renderPrinciples,
  renderConstraints,
  renderProcess,
  renderCriteria,
  renderData,
  renderExamples,
  inferLanguageFromMediaType,
} from './core/renderer.js';

export {
  generateBuildReport,
  generatePersonaDigest,
  generateModuleDigest,
} from './core/report-generator.js';

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
