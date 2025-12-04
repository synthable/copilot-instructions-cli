/**
 * @file Type definitions for the Unified Module System (UMS) v2.1 specification.
 * @description Barrel export for all UMS types, maintaining backward compatibility.
 * @see {@link file://./../../docs/spec/v2.1/unified_module_system_v2.1_spec.md}
 * @see {@link file://./../../docs/ums-v2-lib-implementation.md}
 */

// Cognitive Level - enum and utilities
export {
  CognitiveLevel,
  getCognitiveLevelName,
  getCognitiveLevelDescription,
  parseCognitiveLevel,
  isValidCognitiveLevel,
} from './cognitive-level.js';

// Component Types - all component-related interfaces and types
export {
  ComponentType,
  type ProcessStep,
  type ConstraintObject,
  type ConstraintGroup,
  type Constraint,
  type CriterionObject,
  type CriterionGroup,
  type Criterion,
  type ComponentMetadata,
  type InstructionComponent,
  type Example,
  type Concept,
  type Pattern,
  type KnowledgeComponent,
  type Component,
} from './components.js';

// Core Module Types - Module and metadata
export { type Attribution, type ModuleMetadata, type Module } from './core.js';

// Persona Types - persona composition
export {
  type PersonaModuleGroup,
  type ModuleGroup,
  type ModuleEntry,
  type Persona,
} from './persona.js';

// Registry Types - module registry management
export {
  type ModuleSource,
  type RegistryEntry,
  type ConflictStrategy,
} from './registry.js';

// Validation Types - validation results
export {
  type ValidationError,
  type ValidationWarning,
  type ValidationResult,
} from './validation.js';

// Build Report Types - build process reporting
export {
  type BuildReportModule,
  type BuildReportGroup,
  type BuildReport,
} from './build-report.js';

// Atomic Primitive Types (v2.2)
export { PrimitiveType, type AtomicPrimitive } from './primitives.js';

// Type Guards - runtime type narrowing
export {
  isProcessStepObject,
  isConstraintObject,
  isConstraintGroup,
  isCriterionObject,
  isCriterionGroup,
  isExampleObject,
} from './guards.js';
