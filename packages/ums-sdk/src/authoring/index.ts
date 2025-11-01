/**
 * @file UMS v2.0 Builder API - Public exports
 * @module authoring
 *
 * This module provides a fluent, type-safe builder API for authoring UMS v2.0 modules.
 *
 * ## Primary API
 *
 * - `defineModule()` - The guided builder path (recommended for most users)
 * - `defineModule.fromObject()` - The universal validation gateway (for migrations and tooling)
 *
 * ## Builder Classes
 *
 * The builder classes are exported for advanced use cases, but most users should
 * use the `defineModule()` function which provides the best developer experience.
 *
 * @example
 * ```typescript
 * import { defineModule } from 'ums-sdk/authoring';
 *
 * // Primary path: Guided builder
 * export const myModule = defineModule(m =>
 *   m
 *     .id('module-id')
 *     .version('1.0.0')
 *     .capabilities(['cap1'])
 *     .cognitiveLevel(2)
 *     .metadata(meta =>
 *       meta
 *         .name('Module Name')
 *         .description('Description')
 *         .semantic('keywords...')
 *     )
 *     .instruction(i =>
 *       i.purpose('Purpose').process(['Step 1'])
 *     )
 * );
 * ```
 *
 * @example
 * ```typescript
 * import { defineModule } from 'ums-sdk/authoring';
 *
 * // Universal gateway: Plain object
 * const moduleData = {
 *   id: 'module-id',
 *   version: '1.0.0',
 *   // ... rest of module
 * };
 *
 * export const myModule = defineModule.fromObject(moduleData);
 * ```
 */

// Main API
export { defineModule, default } from './define-module.js';

// Builder types (for advanced usage and type checking)
export type {
  IModuleBuilder,
  IMetadataBuilder,
  IQualityBuilder,
  IInstructionBuilder,
  IKnowledgeBuilder,
  IDataBuilder,
  IComponentBuilder,
  BuilderFn,
} from './types.js';

// Builder classes (for advanced usage)
export { ModuleBuilder } from './module-builder.js';
export { MetadataBuilder, QualityBuilder } from './metadata-builder.js';
export { InstructionBuilder } from './instruction-builder.js';
export { KnowledgeBuilder } from './knowledge-builder.js';
export { DataBuilder } from './data-builder.js';
