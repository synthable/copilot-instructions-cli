/**
 * Resolution domain exports for UMS v2.0
 * Handles module resolution, dependency management, and conflict resolution
 */

export {
  resolveModules,
  resolveImplementations,
  validateModuleReferences,
  createModuleRegistry,
  resolvePersonaModules,
  type ModuleResolutionResult,
} from './module-resolver.js';
