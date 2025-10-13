/**
 * UMS v2.0 Module Resolution - Pure Functions
 * Handles module resolution, dependency management, and validation
 */

import type {
  Module,
  Persona,
  ModuleEntry,
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from '../../types/index.js';

/**
 * Result of module resolution operation
 */
export interface ModuleResolutionResult {
  /** Successfully resolved modules in correct order */
  modules: Module[];
  /** Warnings generated during resolution */
  warnings: string[];
  /** Missing module IDs that couldn't be resolved */
  missingModules: string[];
}

/**
 * Resolves modules from persona module entries using a registry map
 * @param moduleEntries - Module entries from persona (strings or grouped modules)
 * @param registry - Map of module ID to Module
 * @returns Resolution result with modules, warnings, and missing modules
 */
export function resolveModules(
  moduleEntries: ModuleEntry[],
  registry: Map<string, Module>
): ModuleResolutionResult {
  const modules: Module[] = [];
  const warnings: string[] = [];
  const missingModules: string[] = [];

  for (const entry of moduleEntries) {
    // Handle both string IDs and grouped modules
    const moduleIds = typeof entry === 'string' ? [entry] : entry.ids;

    for (const moduleId of moduleIds) {
      const module = registry.get(moduleId);

      if (!module) {
        missingModules.push(moduleId);
        continue;
      }

      modules.push(module);

      // Check for deprecation warnings
      if (module.metadata.deprecated) {
        const warning = module.metadata.replacedBy
          ? `Module '${moduleId}' is deprecated and has been replaced by '${module.metadata.replacedBy}'. Please update your persona file.`
          : `Module '${moduleId}' is deprecated. This module may be removed in a future version.`;
        warnings.push(warning);
      }
    }
  }

  return {
    modules,
    warnings,
    missingModules,
  };
}

/**
 * Resolves module implementations using the synergistic pairs pattern
 * This is a placeholder for future implementation of the 'implement' field
 * Currently returns modules as-is since implement field is not in the type system
 * @param modules - Array of modules to process
 * @param registry - Map of module ID to Module for looking up implementations
 * @returns Modules in the same order (no implementation resolution yet)
 */
export function resolveImplementations(
  modules: Module[],
  _registry: Map<string, Module>
): Module[] {
  // TODO: Implement synergistic pairs pattern when 'implement' field is added to ModuleBody
  // For now, return modules as-is
  return modules;
}

/**
 * Validates that all module references in a persona exist in the registry
 * @param persona - The persona to validate
 * @param registry - Map of module ID to Module
 * @returns Validation result with any missing module errors
 */
export function validateModuleReferences(
  persona: Persona,
  registry: Map<string, Module>
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  for (const entry of persona.modules) {
    // Handle both string IDs and grouped modules
    const moduleIds = typeof entry === 'string' ? [entry] : entry.ids;

    for (const moduleId of moduleIds) {
      if (!registry.has(moduleId)) {
        errors.push({
          path: `modules[]`,
          message: `Module '${moduleId}' referenced in persona but not found in registry`,
          section: '4.2', // UMS v2.0 section for module composition
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Creates a registry map from an array of modules
 * @param modules - Array of UMS modules
 * @returns Map with module ID as key and module as value
 */
export function createModuleRegistry(modules: Module[]): Map<string, Module> {
  const registry = new Map<string, Module>();

  for (const module of modules) {
    registry.set(module.id, module);
  }

  return registry;
}

/**
 * Resolves all modules for a persona with full dependency resolution
 * This is a convenience function that combines module resolution and implementation resolution
 * @param persona - The persona containing module entries
 * @param modules - Array of available modules
 * @returns Complete resolution result with properly ordered modules
 */
export function resolvePersonaModules(
  persona: Persona,
  modules: Module[]
): ModuleResolutionResult {
  const registry = createModuleRegistry(modules);

  // First resolve the basic module references
  const basicResolution = resolveModules(persona.modules, registry);

  // Then resolve implementations for the found modules
  const resolvedModules = resolveImplementations(
    basicResolution.modules,
    registry
  );

  return {
    modules: resolvedModules,
    warnings: basicResolution.warnings,
    missingModules: basicResolution.missingModules,
  };
}
