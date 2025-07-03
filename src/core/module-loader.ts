// src/core/module-loader.ts
import * as fs from 'fs/promises';
import * as path from 'path';
import { pathToFileURL } from 'url';
import {
  ModuleDiscoveryError,
  ModuleLoadError,
  ModuleNotFoundError,
} from './module-loader-errors'; // Import custom errors

export interface ModuleLoaderOptions {
  baseDir?: string;
  moduleSuffix?: string;
}

export interface Module {
  [key: string]: any;
  default?: any;
}

export class ModuleLoader {
  private readonly baseDir: string;
  private readonly moduleSuffix: string;
  private readonly moduleCache: Map<string, Module>;

  constructor(options?: ModuleLoaderOptions) {
    this.baseDir = path.resolve(options?.baseDir || './src/modules');
    this.moduleSuffix = options?.moduleSuffix || '.module.ts';
    this.moduleCache = new Map<string, Module>();
    console.log(
      `ModuleLoader initialized. Base directory: ${this.baseDir}, Module suffix: ${this.moduleSuffix}`
    );
  }

  async discoverModules(): Promise<string[]> {
    console.log(
      `Discovering modules in: ${this.baseDir} with suffix ${this.moduleSuffix}`
    );
    try {
      await fs.access(this.baseDir); // Check if baseDir exists and is accessible
      const entries = await fs.readdir(this.baseDir, { withFileTypes: true });
      const moduleFiles: string[] = [];

      for (const entry of entries) {
        const fullPath = path.join(this.baseDir, entry.name);
        if (entry.isFile() && entry.name.endsWith(this.moduleSuffix)) {
          console.log(`Discovered module file: ${fullPath}`);
          moduleFiles.push(fullPath);
        }
      }
      return moduleFiles;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // This specific case means the directory itself was not found.
        // While fs.access should catch this, readdir might also report it.
        console.warn(
          `Module directory not found: ${this.baseDir}. Returning empty list as per current design, but consider throwing ModuleDiscoveryError.`
        );
        // Option 1: Return empty (current behavior for ENOENT)
        return [];
        // Option 2: Throw a custom error (more strict)
        // throw new ModuleDiscoveryError(this.baseDir, error);
      }
      // For other errors during discovery (e.g., permission issues)
      console.error(`Error discovering modules in ${this.baseDir}:`, error);
      throw new ModuleDiscoveryError(this.baseDir, error);
    }
  }

  async loadModule<T extends Module = Module>(modulePath: string): Promise<T> {
    // Changed to Promise<T> instead of Promise<T | null>
    const absolutePath = path.resolve(modulePath);
    let moduleUrl: string | undefined;

    if (this.moduleCache.has(absolutePath)) {
      console.log(`Returning cached module from: ${absolutePath}`);
      return this.moduleCache.get(absolutePath) as T;
    }

    console.log(`Loading module from: ${absolutePath}`);
    try {
      // First, check if the file exists before trying to import it.
      // This gives a more specific ModuleNotFoundError.
      try {
        await fs.access(absolutePath);
      } catch (accessError: any) {
        if (accessError.code === 'ENOENT') {
          throw new ModuleNotFoundError(absolutePath);
        }
        // For other access errors (e.g., permissions), re-throw to be caught by the outer try-catch
        throw accessError;
      }

      moduleUrl = pathToFileURL(absolutePath).href;
      const loadedModule = await import(moduleUrl);

      if (!loadedModule) {
        // This should ideally be caught by import() itself if it fails to resolve.
        throw new Error(`Module at ${absolutePath} resolved to a falsy value.`);
      }

      this.moduleCache.set(absolutePath, loadedModule);
      console.log(`Module loaded and cached: ${absolutePath}`);
      return loadedModule as T;
    } catch (error: any) {
      // If it's already one of our custom errors, re-throw it.
      if (error instanceof ModuleNotFoundError) {
        console.error(`Module not found at ${absolutePath}:`, error.message);
        throw error;
      }
      // For other errors (syntax errors in module, import issues not caught by fs.access)
      console.error(
        `Failed to load module from ${absolutePath} (URL: ${moduleUrl || 'N/A'}):`,
        error
      );
      throw new ModuleLoadError(absolutePath, error);
    }
  }

  clearCache(): void {
    this.moduleCache.clear();
    console.log('Module cache cleared.');
  }
}
