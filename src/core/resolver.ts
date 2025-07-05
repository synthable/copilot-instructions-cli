/**
 * Module resolution logic for the Copilot Instructions Builder CLI
 *
 * Provides functions for resolving module identifiers to their corresponding
 * file paths or module objects, supporting all four module types across
 * the instructions-modules directory structure.
 */

import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { minimatch } from 'minimatch';
import { findMarkdownFiles } from '../utils/file-system.js';
import { parseModuleMetadata } from './parser.js';
import type { IndexedModule, Module, ModuleTier } from '../types/index.js';

/**
 * Configuration for module resolution operations
 */
export interface ResolverConfig {
  /** Base path to the modules directory */
  modulesPath: string;
  /** Optional cached index for performance optimization */
  index?: IndexedModule[];
}

/**
 * Result of a module resolution operation
 */
export interface ResolutionResult {
  /** Whether the resolution was successful */
  success: boolean;
  /** The resolved module (if successful) */
  module?: Module;
  /** Error message (if resolution failed) */
  error?: string;
}

/**
 * Result of batch module resolution
 */
export interface BatchResolutionResult {
  /** Successfully resolved modules */
  resolved: Module[];
  /** Module IDs that failed to resolve */
  failed: Array<{ id: string; error: string }>;
  /** Module IDs that were not found */
  notFound: string[];
}

/**
 * Result of tier-ordered module resolution
 */
export interface TierOrderedResolutionResult {
  /** Successfully resolved modules organized by tier */
  byTier: {
    foundation: Module[];
    principle: Module[];
    technology: Module[];
    execution: Module[];
  };
  /** Module IDs that failed to resolve */
  failed: Array<{ id: string; error: string }>;
  /** Module IDs that were not found */
  notFound: string[];
}

/**
 * Module resolver class that handles resolution of module identifiers
 * to their corresponding file paths and module objects.
 */
export class ModuleResolver {
  private config: ResolverConfig;
  private indexCache?: Map<string, IndexedModule>;

  constructor(config: ResolverConfig) {
    this.config = config;
  }

  /**
   * Builds or refreshes the module index cache for faster resolution.
   * This method scans the modules directory and creates an in-memory index.
   *
   * @returns Promise that resolves when the index is built
   * @throws Error if the modules directory cannot be accessed
   */
  async buildIndex(): Promise<void> {
    try {
      const modulesPath = resolve(this.config.modulesPath);
      const moduleFiles = await findMarkdownFiles(modulesPath);

      this.indexCache = new Map();

      for (const filePath of moduleFiles) {
        try {
          const indexedModule = await parseModuleMetadata(
            filePath,
            modulesPath
          );
          this.indexCache.set(indexedModule.id, indexedModule);
        } catch (error) {
          console.warn(
            `Warning: Failed to index module "${filePath}": ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      }
    } catch (error) {
      throw new Error(
        `Failed to build module index: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Gets the current module index, building it if necessary.
   *
   * @returns Promise that resolves to the module index
   */
  async getIndex(): Promise<Map<string, IndexedModule>> {
    if (!this.indexCache) {
      if (this.config.index) {
        // Use provided index
        this.indexCache = new Map(
          this.config.index.map(module => [module.id, module])
        );
      } else {
        // Build index from filesystem
        await this.buildIndex();
      }
    }
    return this.indexCache!;
  }

  /**
   * Resolves a single module identifier to its full Module object.
   *
   * @param moduleId - The module identifier to resolve
   * @returns Promise that resolves to a ResolutionResult
   *
   * @example
   * ```typescript
   * const resolver = new ModuleResolver({ modulesPath: './instructions-modules' });
   * const result = await resolver.resolveModule('foundation/core/basics');
   * if (result.success) {
   *   console.log(result.module.metadata.name);
   * }
   * ```
   */
  async resolveModule(moduleId: string): Promise<ResolutionResult> {
    try {
      const index = await this.getIndex();
      const indexedModule = index.get(moduleId);

      if (!indexedModule) {
        return {
          success: false,
          error: `Module not found: ${moduleId}`,
        };
      }

      // Load the full module content
      const module = await this.loadModuleContent(indexedModule);

      return {
        success: true,
        module,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to resolve module "${moduleId}": ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }

  /**
   * Resolves multiple module identifiers in batch.
   *
   * @param moduleIds - Array of module identifiers to resolve
   * @returns Promise that resolves to BatchResolutionResult
   *
   * @example
   * ```typescript
   * const resolver = new ModuleResolver({ modulesPath: './instructions-modules' });
   * const result = await resolver.resolveModules([
   *   'foundation/core/basics',
   *   'principle/testing/unit-tests'
   * ]);
   * console.log(`Resolved ${result.resolved.length} modules`);
   * ```
   */
  async resolveModules(moduleIds: string[]): Promise<BatchResolutionResult> {
    const result: BatchResolutionResult = {
      resolved: [],
      failed: [],
      notFound: [],
    };

    for (const moduleId of moduleIds) {
      const resolution = await this.resolveModule(moduleId);

      if (resolution.success && resolution.module) {
        result.resolved.push(resolution.module);
      } else if (resolution.error?.includes('Module not found')) {
        result.notFound.push(moduleId);
      } else {
        result.failed.push({
          id: moduleId,
          error: resolution.error || 'Unknown error',
        });
      }
    }

    return result;
  }

  /**
   * Resolves modules by tier, returning all modules from the specified tier(s).
   *
   * @param tiers - Single tier or array of tiers to resolve
   * @returns Promise that resolves to an array of resolved modules
   *
   * @example
   * ```typescript
   * const resolver = new ModuleResolver({ modulesPath: './instructions-modules' });
   * const foundationModules = await resolver.resolveByTier('foundation');
   * const coreModules = await resolver.resolveByTier(['foundation', 'principle']);
   * ```
   */
  async resolveByTier(
    tiers: ModuleTier | ModuleTier[]
  ): Promise<BatchResolutionResult> {
    const targetTiers = Array.isArray(tiers) ? tiers : [tiers];
    const index = await this.getIndex();

    const moduleIds = Array.from(index.values())
      .filter(module => targetTiers.includes(module.tier))
      .map(module => module.id);

    return this.resolveModules(moduleIds);
  }

  /**
   * Resolves modules by subject pattern.
   *
   * @param subjectPattern - Subject pattern to match (supports partial matching)
   * @returns Promise that resolves to BatchResolutionResult
   *
   * @example
   * ```typescript
   * const resolver = new ModuleResolver({ modulesPath: './instructions-modules' });
   * const testingModules = await resolver.resolveBySubject('testing');
   * const coreModules = await resolver.resolveBySubject('core');
   * ```
   */
  async resolveBySubject(
    subjectPattern: string
  ): Promise<BatchResolutionResult> {
    const index = await this.getIndex();

    const moduleIds = Array.from(index.values())
      .filter(module => module.subject.includes(subjectPattern))
      .map(module => module.id);

    return this.resolveModules(moduleIds);
  }

  /**
   * Gets the file path for a module ID without loading the content.
   *
   * @param moduleId - The module identifier
   * @returns Promise that resolves to the file path or null if not found
   */
  async getModulePath(moduleId: string): Promise<string | null> {
    const index = await this.getIndex();
    const indexedModule = index.get(moduleId);
    return indexedModule ? indexedModule.path : null;
  }

  /**
   * Checks if a module exists without loading it.
   *
   * @param moduleId - The module identifier to check
   * @returns Promise that resolves to true if the module exists
   */
  async moduleExists(moduleId: string): Promise<boolean> {
    const index = await this.getIndex();
    return index.has(moduleId);
  }

  /**
   * Lists all available module IDs, optionally filtered by tier.
   *
   * @param tier - Optional tier to filter by
   * @returns Promise that resolves to an array of module IDs
   */
  async listModuleIds(tier?: ModuleTier): Promise<string[]> {
    const index = await this.getIndex();

    return Array.from(index.values())
      .filter(module => !tier || module.tier === tier)
      .map(module => module.id);
  }

  /**
   * Resolves modules with glob pattern support and tier ordering.
   * Handles both specific module IDs and glob patterns (e.g., "foundation/*").
   *
   * @param patterns - Array of module ID patterns (can include globs)
   * @returns Promise that resolves to TierOrderedResolutionResult
   *
   * @example
   * ```typescript
   * const resolver = new ModuleResolver({ modulesPath: './instructions-modules' });
   * const result = await resolver.resolveWithGlobAndTierOrder([
   *   'foundation/core/basics',
   *   'principle/*',
   *   'technology/react/*'
   * ]);
   * ```
   */
  async resolveWithGlobAndTierOrder(
    patterns: string[]
  ): Promise<TierOrderedResolutionResult> {
    const result: TierOrderedResolutionResult = {
      byTier: {
        foundation: [],
        principle: [],
        technology: [],
        execution: [],
      },
      failed: [],
      notFound: [],
    };

    // Expand glob patterns to concrete module IDs
    const expandedModuleIds = await this.expandGlobPatterns(patterns);

    // Group expanded IDs by tier and resolve in tier order
    const tierOrder: ModuleTier[] = [
      'foundation',
      'principle',
      'technology',
      'execution',
    ];

    for (const tier of tierOrder) {
      const tierModuleIds = expandedModuleIds
        .filter(id => id.startsWith(`${tier}/`))
        .sort(); // Sort alphabetically within each tier

      for (const moduleId of tierModuleIds) {
        const resolution = await this.resolveModule(moduleId);

        if (resolution.success && resolution.module) {
          result.byTier[tier].push(resolution.module);
        } else if (resolution.error?.includes('Module not found')) {
          result.notFound.push(moduleId);
        } else {
          result.failed.push({
            id: moduleId,
            error: resolution.error || 'Unknown error',
          });
        }
      }
    }

    return result;
  }

  /**
   * Expands glob patterns to concrete module IDs.
   *
   * @private
   * @param patterns - Array of patterns (may include globs)
   * @returns Promise that resolves to array of concrete module IDs
   */
  private async expandGlobPatterns(patterns: string[]): Promise<string[]> {
    const index = await this.getIndex();
    const allModuleIds = Array.from(index.keys());
    const expandedIds = new Set<string>();

    for (const pattern of patterns) {
      if (pattern.includes('*')) {
        // Use minimatch to match against module IDs
        const matches = allModuleIds.filter(moduleId => {
          return minimatch(moduleId, pattern);
        });
        matches.forEach(match => expandedIds.add(match));
      } else {
        // Direct module ID
        expandedIds.add(pattern);
      }
    }

    return Array.from(expandedIds).sort();
  }

  /**
   * Resolves modules by tier in the correct compilation order.
   * Returns modules grouped by tier, sorted alphabetically within each tier.
   *
   * @param tierConfig - Configuration specifying which modules to include per tier
   * @returns Promise that resolves to TierOrderedResolutionResult
   *
   * @example
   * ```typescript
   * const resolver = new ModuleResolver({ modulesPath: './instructions-modules' });
   * const result = await resolver.resolveByTierOrder({
   *   foundation: ['foundation/core/basics'],
   *   principle: ['principle/*'],
   *   technology: ['technology/react/hooks'],
   *   execution: []
   * });
   * ```
   */
  async resolveByTierOrder(tierConfig: {
    foundation?: string[];
    principle?: string[];
    technology?: string[];
    execution?: string[];
  }): Promise<TierOrderedResolutionResult> {
    const allPatterns: string[] = [
      ...(tierConfig.foundation || []),
      ...(tierConfig.principle || []),
      ...(tierConfig.technology || []),
      ...(tierConfig.execution || []),
    ];

    return this.resolveWithGlobAndTierOrder(allPatterns);
  }

  /**
   * Loads the full content of an indexed module.
   *
   * @private
   * @param indexedModule - The indexed module to load content for
   * @returns Promise that resolves to the full Module object
   */
  private async loadModuleContent(
    indexedModule: IndexedModule
  ): Promise<Module> {
    try {
      const fileContent = await readFile(indexedModule.path, 'utf-8');

      // Parse frontmatter to separate content from metadata
      const matter = await import('gray-matter');
      const parsed = matter.default(fileContent);

      return {
        id: indexedModule.id,
        path: indexedModule.path,
        metadata: indexedModule.metadata,
        content: parsed.content,
      };
    } catch (error) {
      throw new Error(
        `Failed to load module content for "${indexedModule.id}": ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

/**
 * Creates a configured ModuleResolver instance.
 *
 * @param modulesPath - Path to the modules directory
 * @param index - Optional prebuilt index for performance
 * @returns A new ModuleResolver instance
 *
 * @example
 * ```typescript
 * const resolver = createResolver('./instructions-modules');
 * const result = await resolver.resolveModule('foundation/core/basics');
 * ```
 */
export function createResolver(
  modulesPath: string,
  index?: IndexedModule[]
): ModuleResolver {
  const config: ResolverConfig = { modulesPath };
  if (index !== undefined) {
    config.index = index;
  }
  return new ModuleResolver(config);
}

/**
 * Convenience function to resolve a single module.
 *
 * @param moduleId - The module identifier to resolve
 * @param modulesPath - Path to the modules directory
 * @returns Promise that resolves to ResolutionResult
 */
export async function resolveModule(
  moduleId: string,
  modulesPath: string
): Promise<ResolutionResult> {
  const resolver = createResolver(modulesPath);
  return resolver.resolveModule(moduleId);
}

/**
 * Convenience function to resolve multiple modules.
 *
 * @param moduleIds - Array of module identifiers to resolve
 * @param modulesPath - Path to the modules directory
 * @returns Promise that resolves to BatchResolutionResult
 */
export async function resolveModules(
  moduleIds: string[],
  modulesPath: string
): Promise<BatchResolutionResult> {
  const resolver = createResolver(modulesPath);
  return resolver.resolveModules(moduleIds);
}
