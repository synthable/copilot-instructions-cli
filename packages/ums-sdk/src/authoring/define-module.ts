/**
 * @file defineModule() wrapper and fromObject() gateway for UMS v2.0 Builder API
 * @module authoring/define-module
 */

import type { Module } from 'ums-lib';
import type { IModuleBuilder, BuilderFn } from './types.js';
import { ModuleBuilder } from './module-builder.js';

/**
 * Define a UMS v2.0 module using the fluent builder API.
 *
 * This is the primary, recommended way to author modules. It provides:
 * - Guided construction with method chaining
 * - IDE autocomplete and type safety
 * - Nested builders for complex structures
 * - Immediate validation during construction
 *
 * @param fn - Builder configuration function
 * @returns Immutable, validated Module
 *
 * @example
 * ```typescript
 * export const myModule = defineModule(m =>
 *   m
 *     .id('technology/typescript/error-handling')
 *     .version('1.0.0')
 *     .capabilities(['error-handling'])
 *     .cognitiveLevel(3)
 *     .metadata(meta =>
 *       meta
 *         .name('Error Handling')
 *         .description('Best practices for error handling')
 *         .semantic('typescript error handling exceptions try catch...')
 *     )
 *     .instruction(i =>
 *       i
 *         .purpose('Guide error handling implementation')
 *         .process(['Use custom error classes', 'Always include context'])
 *         .constraint('Always type your catch blocks', 'error')
 *     )
 * );
 * ```
 */
export function defineModule(
  fn: BuilderFn<IModuleBuilder, IModuleBuilder>
): Module {
  const builder = new ModuleBuilder();
  fn(builder);
  return builder.build();
}

/**
 * Define a module from a plain JavaScript object.
 *
 * This is the "universal validation gateway" that enables:
 * - Migration from v1.0 or static objects
 * - Programmatic module generation
 * - Loading from external formats (JSON, YAML)
 * - Interoperability with other systems
 *
 * The object is hydrated into the internal builder and validated using
 * the same logic as defineModule(), ensuring consistency and safety.
 *
 * @param data - Plain object conforming to Module interface
 * @returns Immutable, validated Module
 *
 * @example
 * ```typescript
 * // Migration from static object
 * const moduleData = {
 *   id: 'module-id',
 *   version: '1.0.0',
 *   schemaVersion: '2.0',
 *   capabilities: ['capability-1'],
 *   cognitiveLevel: 2,
 *   metadata: {
 *     name: 'Module Name',
 *     description: 'Description',
 *     semantic: 'keywords...',
 *   },
 *   instruction: {
 *     type: 'instruction',
 *     instruction: {
 *       purpose: 'Purpose statement',
 *       process: ['Step 1', 'Step 2'],
 *     },
 *   },
 * };
 *
 * export const myModule = defineModule.fromObject(moduleData);
 * ```
 *
 * @example
 * ```typescript
 * // Loading from JSON
 * import moduleJson from './module.json';
 * export const myModule = defineModule.fromObject(moduleJson);
 * ```
 *
 * @example
 * ```typescript
 * // Programmatic generation
 * function generateModule(config: ModuleConfig): Module {
 *   const data = {
 *     id: config.moduleId,
 *     version: config.version,
 *     capabilities: config.capabilities,
 *     cognitiveLevel: config.level,
 *     metadata: {
 *       name: config.displayName,
 *       description: config.description,
 *       semantic: generateKeywords(config),
 *     },
 *     instruction: buildFromTemplate(config.template),
 *   };
 *   return defineModule.fromObject(data);
 * }
 * ```
 */
defineModule.fromObject = function fromObject(data: unknown): Module {
  const builder = new ModuleBuilder();
  builder.hydrate(data);
  return builder.build();
};

/**
 * Re-export for convenience
 */
export { defineModule as default };
