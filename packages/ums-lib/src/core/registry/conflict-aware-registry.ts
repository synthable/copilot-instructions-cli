/**
 * ConflictAwareRegistry - stores conflicting modules and resolves them on-demand
 * Implements the conflict-aware registry pattern for UMS v1.0
 */

import { ConflictError } from '../../utils/errors.js';
import type {
  UMSModule,
  ModuleEntry,
  ModuleSource,
  ModuleRegistry,
  ConflictStrategy,
} from '../../types/index.js';

/**
 * Registry that can store multiple modules per ID and resolve conflicts on-demand
 */
export class ConflictAwareRegistry implements ModuleRegistry {
  private modules = new Map<string, ModuleEntry[]>();
  private defaultStrategy: ConflictStrategy;

  constructor(defaultStrategy: ConflictStrategy = 'error') {
    this.defaultStrategy = defaultStrategy;
  }

  /**
   * Add a module to the registry without resolving conflicts
   */
  add(module: UMSModule, source: ModuleSource): void {
    const existing = this.modules.get(module.id) ?? [];
    existing.push({ module, source, addedAt: Date.now() });
    this.modules.set(module.id, existing);
  }

  /**
   * Add multiple modules at once
   */
  addAll(modules: UMSModule[], source: ModuleSource): void {
    for (const module of modules) {
      this.add(module, source);
    }
  }

  /**
   * Resolve a module by ID, applying conflict resolution if needed
   */
  resolve(moduleId: string, strategy?: ConflictStrategy): UMSModule | null {
    const entries = this.modules.get(moduleId);
    if (!entries || entries.length === 0) {
      return null;
    }

    if (entries.length === 1) {
      return entries[0].module;
    }

    // Multiple entries - resolve conflict
    return this.resolveConflict(
      moduleId,
      entries,
      strategy ?? this.defaultStrategy
    );
  }

  /**
   * Check if registry has a module by ID (regardless of conflicts)
   */
  has(moduleId: string): boolean {
    const entries = this.modules.get(moduleId);
    return entries !== undefined && entries.length > 0;
  }

  /**
   * Get total number of unique module IDs
   */
  size(): number {
    return this.modules.size;
  }

  /**
   * Get all conflicting entries for a module ID
   * Returns null if no conflicts (0 or 1 entries)
   */
  getConflicts(moduleId: string): ModuleEntry[] | null {
    const entries = this.modules.get(moduleId);
    return entries && entries.length > 1 ? entries : null;
  }

  /**
   * Get all module IDs that have conflicts
   */
  getConflictingIds(): string[] {
    return Array.from(this.modules.entries())
      .filter(([_, entries]) => entries.length > 1)
      .map(([id, _]) => id);
  }

  /**
   * Resolve all modules using a specific strategy
   */
  resolveAll(strategy: ConflictStrategy): Map<string, UMSModule> {
    const resolved = new Map<string, UMSModule>();

    for (const [moduleId] of this.modules) {
      const module = this.resolve(moduleId, strategy);
      if (module) {
        resolved.set(moduleId, module);
      }
    }

    return resolved;
  }

  /**
   * Get all entries in the registry
   */
  getAllEntries(): Map<string, ModuleEntry[]> {
    return new Map(this.modules);
  }

  /**
   * Get summary of sources in registry
   */
  getSourceSummary(): Record<string, number> {
    const summary: Record<string, number> = {};

    for (const entries of this.modules.values()) {
      for (const entry of entries) {
        const sourceKey = `${entry.source.type}:${entry.source.path}`;
        summary[sourceKey] = (summary[sourceKey] || 0) + 1;
      }
    }

    return summary;
  }

  /**
   * Resolve conflicts using the specified strategy
   */
  private resolveConflict(
    moduleId: string,
    entries: ModuleEntry[],
    strategy: ConflictStrategy
  ): UMSModule {
    switch (strategy) {
      case 'error':
        throw new ConflictError(
          `Module conflict for '${moduleId}': ${entries.length} candidates found`,
          moduleId,
          entries.length
        );

      case 'warn':
        // Log warning and return the first entry
        console.warn(
          `Warning: Module conflict for '${moduleId}': ${entries.length} candidates found. Using first entry from ${entries[0].source.type}:${entries[0].source.path}`
        );
        return entries[0].module;

      case 'replace':
        // Return the last entry (most recently added)
        return entries[entries.length - 1].module;

      default:
        throw new Error(`Unknown conflict strategy: ${strategy}`);
    }
  }
}
