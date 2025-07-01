// src/core/module-loader-errors.ts

export class ModuleLoaderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ModuleDiscoveryError extends ModuleLoaderError {
  public readonly directoryPath: string;
  constructor(directoryPath: string, originalError?: Error) {
    let message = `Failed to discover modules in directory: ${directoryPath}.`;
    if (originalError) {
      message += ` Reason: ${originalError.message}`;
    }
    super(message);
    this.directoryPath = directoryPath;
    if (originalError && originalError.stack) {
      this.stack = originalError.stack; // Preserve original stack if available
    }
  }
}

export class ModuleLoadError extends ModuleLoaderError {
  public readonly modulePath: string;
  constructor(modulePath: string, originalError?: Error) {
    let message = `Failed to load module from path: ${modulePath}.`;
    if (originalError) {
      message += ` Reason: ${originalError.message}`;
    }
    super(message);
    this.modulePath = modulePath;
    if (originalError && originalError.stack) {
      this.stack = originalError.stack; // Preserve original stack if available
    }
  }
}

export class ModuleNotFoundError extends ModuleLoadError {
  constructor(modulePath: string) {
    super(modulePath, new Error(`Module file not found at ${modulePath}. Ensure the path is correct and the file exists.`));
    this.name = this.constructor.name; // Explicitly set name for this specific subclass
  }
}
