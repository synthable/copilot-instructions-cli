/**
 * UMS SDK v1.0
 *
 * Node.js SDK for UMS v2.0 - provides file system operations,
 * TypeScript module loading, and high-level orchestration.
 *
 * @see {@link file://./../../docs/spec/ums_sdk_v1_spec.md}
 */

// Re-export ums-lib for convenience (excluding conflicting names)
export * from 'ums-lib';

// SDK-specific exports
export * from './loaders/index.js';
export * from './discovery/index.js';
export * from './orchestration/index.js';

// Export SDK errors explicitly to avoid conflicts
export {
  SDKError,
  ModuleNotFoundError,
  InvalidExportError,
  ConfigError,
  DiscoveryError,
  // Note: ModuleLoadError is also in ums-lib, but we export both
  ModuleLoadError,
} from './errors/index.js';

// Export SDK types explicitly to avoid conflicts
export type {
  ModuleConfig,
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

// High-level API
export * from './api/index.js';
