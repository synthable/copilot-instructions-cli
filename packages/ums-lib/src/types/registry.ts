/**
 * @file Registry and loading types for UMS v2.1.
 * @description Defines types for module registry management and source tracking.
 */

import type { Module } from './core.js';

// #region Module Source

/**
 * Information about the source of a module.
 */
export interface ModuleSource {
  /** The type of the module source. */
  type: 'standard' | 'local' | 'remote';
  /** The URI or path to the module source. */
  path: string;
}

// #endregion

// #region Registry Entry

/**
 * Internal registry entry, containing a module and its source information.
 * Note: Named RegistryEntry to avoid conflict with spec's ModuleEntry (persona composition).
 */
export interface RegistryEntry {
  /** The UMS module. */
  module: Module;
  /** Information about the source of the module. */
  source: ModuleSource;
  /** Timestamp when the module was added to the registry. */
  addedAt: number;
}

// #endregion

// #region Conflict Strategy

/**
 * Defines the strategy for resolving module ID conflicts in the registry.
 */
export type ConflictStrategy = 'error' | 'warn' | 'replace';

// #endregion
