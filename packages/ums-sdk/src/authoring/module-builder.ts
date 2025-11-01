/**
 * @file ModuleBuilder implementation for UMS v2.0 Builder API
 * @module authoring/module-builder
 */

import type { Module, Component, CognitiveLevel } from 'ums-lib';
import type {
  IModuleBuilder,
  IMetadataBuilder,
  IInstructionBuilder,
  IKnowledgeBuilder,
  IDataBuilder,
  IComponentBuilder,
  BuilderFn,
} from './types.js';
import { MetadataBuilder } from './metadata-builder.js';
import { InstructionBuilder } from './instruction-builder.js';
import { KnowledgeBuilder } from './knowledge-builder.js';
import { DataBuilder } from './data-builder.js';

/**
 * Component builder for multi-component modules
 */
class ComponentBuilder implements IComponentBuilder {
  private component?: Component;

  instruction(fn: BuilderFn<IInstructionBuilder, IInstructionBuilder>): this {
    const builder = new InstructionBuilder();
    fn(builder);
    this.component = builder.build();
    return this;
  }

  knowledge(fn: BuilderFn<IKnowledgeBuilder, IKnowledgeBuilder>): this {
    const builder = new KnowledgeBuilder();
    fn(builder);
    this.component = builder.build();
    return this;
  }

  data(fn: BuilderFn<IDataBuilder, IDataBuilder>): this {
    const builder = new DataBuilder();
    fn(builder);
    this.component = builder.build();
    return this;
  }

  getComponent(): Component | undefined {
    return this.component;
  }
}

/**
 * Core module builder class
 */
export class ModuleBuilder implements IModuleBuilder {
  private moduleData: Partial<Module> = {
    schemaVersion: '2.0', // Default schema version
  };

  id(id: string): this {
    this.moduleData.id = id;
    return this;
  }

  version(version: string): this {
    this.moduleData.version = version;
    return this;
  }

  schemaVersion(version: string): this {
    this.moduleData.schemaVersion = version;
    return this;
  }

  capabilities(capabilities: string[]): this {
    this.moduleData.capabilities = capabilities;
    return this;
  }

  cognitiveLevel(level: number): this {
    if (level < 0 || level > 6 || !Number.isInteger(level)) {
      throw new Error('Cognitive level must be an integer between 0 and 6');
    }
    this.moduleData.cognitiveLevel = level as CognitiveLevel;
    return this;
  }

  domain(domain: string | string[]): this {
    this.moduleData.domain = domain;
    return this;
  }

  metadata(fn: BuilderFn<IMetadataBuilder, IMetadataBuilder>): this {
    const builder = new MetadataBuilder();
    fn(builder);
    this.moduleData.metadata = builder.build();
    return this;
  }

  instruction(fn: BuilderFn<IInstructionBuilder, IInstructionBuilder>): this {
    if (this.moduleData.components) {
      throw new Error(
        'Cannot use instruction() shorthand when components array is already set. Use components() instead.'
      );
    }
    const builder = new InstructionBuilder();
    fn(builder);
    this.moduleData.instruction = builder.build();
    return this;
  }

  knowledge(fn: BuilderFn<IKnowledgeBuilder, IKnowledgeBuilder>): this {
    if (this.moduleData.components) {
      throw new Error(
        'Cannot use knowledge() shorthand when components array is already set. Use components() instead.'
      );
    }
    const builder = new KnowledgeBuilder();
    fn(builder);
    this.moduleData.knowledge = builder.build();
    return this;
  }

  data(fn: BuilderFn<IDataBuilder, IDataBuilder>): this {
    if (this.moduleData.components) {
      throw new Error(
        'Cannot use data() shorthand when components array is already set. Use components() instead.'
      );
    }
    const builder = new DataBuilder();
    fn(builder);
    this.moduleData.data = builder.build();
    return this;
  }

  components(fns: BuilderFn<IComponentBuilder, IComponentBuilder>[]): this {
    if (
      this.moduleData.instruction ||
      this.moduleData.knowledge ||
      this.moduleData.data
    ) {
      throw new Error(
        'Cannot use components() when shorthand properties (instruction, knowledge, data) are already set.'
      );
    }

    const components: Component[] = [];
    for (const fn of fns) {
      const builder = new ComponentBuilder();
      fn(builder);
      const component = builder.getComponent();
      if (component) {
        components.push(component);
      }
    }

    this.moduleData.components = components;
    return this;
  }

  /**
   * Hydrate the builder from a plain object (for fromObject() implementation)
   */
  hydrate(obj: unknown): this {
    if (typeof obj !== 'object' || obj === null) {
      throw new Error('Cannot hydrate from non-object value');
    }

    const data = obj as Partial<Module>;

    // Copy all properties directly
    if (data.id) this.moduleData.id = data.id;
    if (data.version) this.moduleData.version = data.version;
    if (data.schemaVersion) this.moduleData.schemaVersion = data.schemaVersion;
    if (data.capabilities) this.moduleData.capabilities = data.capabilities;
    if (data.cognitiveLevel !== undefined)
      this.moduleData.cognitiveLevel = data.cognitiveLevel;
    if (data.domain) this.moduleData.domain = data.domain;
    if (data.metadata) this.moduleData.metadata = data.metadata;
    if (data.components) this.moduleData.components = data.components;
    if (data.instruction) this.moduleData.instruction = data.instruction;
    if (data.knowledge) this.moduleData.knowledge = data.knowledge;
    if (data.data) this.moduleData.data = data.data;

    return this;
  }

  build(): Module {
    // Validate required fields
    if (!this.moduleData.id) {
      throw new Error('Module requires an id');
    }
    if (!this.moduleData.version) {
      throw new Error('Module requires a version');
    }
    if (!this.moduleData.schemaVersion) {
      throw new Error('Module requires a schemaVersion');
    }
    if (
      !this.moduleData.capabilities ||
      this.moduleData.capabilities.length === 0
    ) {
      throw new Error('Module requires at least one capability');
    }
    if (this.moduleData.cognitiveLevel === undefined) {
      throw new Error('Module requires a cognitiveLevel');
    }
    if (!this.moduleData.metadata) {
      throw new Error('Module requires metadata');
    }

    // Ensure at least one component is provided
    const hasShorthandComponent =
      this.moduleData.instruction ??
      this.moduleData.knowledge ??
      this.moduleData.data;
    const hasComponentsArray =
      this.moduleData.components && this.moduleData.components.length > 0;

    if (!hasShorthandComponent && !hasComponentsArray) {
      throw new Error(
        'Module requires at least one component (instruction, knowledge, data, or components array)'
      );
    }

    // Return a frozen copy to ensure immutability
    return Object.freeze({ ...this.moduleData }) as Module;
  }
}
