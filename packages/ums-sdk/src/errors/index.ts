/**
 * SDK Error classes
 * Provides detailed error types for SDK operations
 */

/**
 * Base SDK error class
 */
export class SDKError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'SDKError';
  }
}

/**
 * Error loading a module file
 */
export class ModuleLoadError extends SDKError {
  constructor(
    message: string,
    public filePath: string
  ) {
    super(message, 'MODULE_LOAD_ERROR');
    this.name = 'ModuleLoadError';
    this.filePath = filePath;
  }
}

/**
 * Module file not found
 */
export class ModuleNotFoundError extends SDKError {
  constructor(public filePath: string) {
    super(`Module file not found: ${filePath}`, 'MODULE_NOT_FOUND');
    this.name = 'ModuleNotFoundError';
    this.filePath = filePath;
  }
}

/**
 * Invalid export name in module file
 */
export class InvalidExportError extends SDKError {
  constructor(
    public filePath: string,
    public expectedExport: string,
    public availableExports: string[]
  ) {
    super(
      `Invalid export in ${filePath}: expected '${expectedExport}', found: ${availableExports.join(', ')}`,
      'INVALID_EXPORT'
    );
    this.name = 'InvalidExportError';
  }
}

/**
 * Configuration file error
 */
export class ConfigError extends SDKError {
  constructor(
    message: string,
    public configPath: string
  ) {
    super(message, 'CONFIG_ERROR');
    this.name = 'ConfigError';
  }
}

/**
 * Module discovery error
 */
export class DiscoveryError extends SDKError {
  constructor(
    message: string,
    public searchPaths: string[]
  ) {
    super(message, 'DISCOVERY_ERROR');
    this.name = 'DiscoveryError';
  }
}
