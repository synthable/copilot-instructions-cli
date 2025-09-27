/**
 * UMS v1.0 Module Resolution - Pure Functions
 * Handles module resolution, dependency management, and validation
 */

import type {
  UMSModule,
  UMSPersona,
  ModuleGroup,
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from '../../types/index.js';

/**
 * Result of module resolution operation
 */
export interface ModuleResolutionResult {
  /** Successfully resolved modules in correct order */
  modules: UMSModule[];
  /** Warnings generated during resolution */
  warnings: string[];
  /** Missing module IDs that couldn't be resolved */
  missingModules: string[];
}

/**
 * Resolves modules from persona module groups using a registry map
 * @param moduleGroups - Module groups from persona
 * @param registry - Map of module ID to UMSModule
 * @returns Resolution result with modules, warnings, and missing modules
 */
export function resolveModules(
  moduleGroups: ModuleGroup[],
  registry: Map<string, UMSModule>
): ModuleResolutionResult {
  const modules: UMSModule[] = [];
  const warnings: string[] = [];
  const missingModules: string[] = [];

  for (const group of moduleGroups) {
    for (const moduleId of group.modules) {
      const module = registry.get(moduleId);

      if (!module) {
        missingModules.push(moduleId);
        continue;
      }

      modules.push(module);

      // Check for deprecation warnings
      if (module.meta.deprecated) {
        const warning = module.meta.replacedBy
          ? `Module '${moduleId}' is deprecated and has been replaced by '${module.meta.replacedBy}'. Please update your persona file.`
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
 * @param registry - Map of module ID to UMSModule for looking up implementations
 * @returns Modules in the same order (no implementation resolution yet)
 */
export function resolveImplementations(
  modules: UMSModule[],
  _registry: Map<string, UMSModule>
): UMSModule[] {
  // TODO: Implement synergistic pairs pattern when 'implement' field is added to ModuleBody
  // For now, return modules as-is
  return modules;
}

/**
 * Validates that all module references in a persona exist in the registry
 * @param persona - The persona to validate
 * @param registry - Map of module ID to UMSModule
 * @returns Validation result with any missing module errors
 */
export function validateModuleReferences(
  persona: UMSPersona,
  registry: Map<string, UMSModule>
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  for (const group of persona.moduleGroups) {
    for (const moduleId of group.modules) {
      if (!registry.has(moduleId)) {
        errors.push({
          path: `moduleGroups[].modules`,
          message: `Module '${moduleId}' referenced in persona but not found in registry`,
          section: '6.1', // UMS section for module references
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
export function createModuleRegistry(
  modules: UMSModule[]
): Map<string, UMSModule> {
  const registry = new Map<string, UMSModule>();

  for (const module of modules) {
    registry.set(module.id, module);
  }

  return registry;
}

/**
 * Resolves all modules for a persona with full dependency resolution
 * This is a convenience function that combines module resolution and implementation resolution
 * @param persona - The persona containing module groups
 * @param modules - Array of available modules
 * @returns Complete resolution result with properly ordered modules
 */
export function resolvePersonaModules(
  persona: UMSPersona,
  modules: UMSModule[]
): ModuleResolutionResult {
  const registry = createModuleRegistry(modules);

  // First resolve the basic module references
  const basicResolution = resolveModules(persona.moduleGroups, registry);

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
