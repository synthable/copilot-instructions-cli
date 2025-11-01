/**
 * @file Type definitions for the UMS v2.0 Builder API
 * @module authoring/types
 */

import type {
  Module,
  ModuleMetadata,
  InstructionComponent,
  KnowledgeComponent,
  DataComponent,
  QualityMetadata,
  Constraint,
  Criterion,
  ProcessStep,
  Concept,
  Example,
  Pattern,
} from 'ums-lib';

/**
 * Builder configuration function type for nested builders
 */
export type BuilderFn<T, R> = (builder: T) => R;

/**
 * Module builder interface - fluent API for constructing modules
 */
export interface IModuleBuilder {
  id(id: string): this;
  version(version: string): this;
  schemaVersion(version: string): this;
  capabilities(capabilities: string[]): this;
  cognitiveLevel(level: number): this;
  domain(domain: string | string[]): this;
  metadata(fn: BuilderFn<IMetadataBuilder, IMetadataBuilder>): this;
  instruction(fn: BuilderFn<IInstructionBuilder, IInstructionBuilder>): this;
  knowledge(fn: BuilderFn<IKnowledgeBuilder, IKnowledgeBuilder>): this;
  data(fn: BuilderFn<IDataBuilder, IDataBuilder>): this;
  components(fns: BuilderFn<IComponentBuilder, IComponentBuilder>[]): this;
  build(): Module;
}

/**
 * Component builder interface - base for all component builders
 */
export interface IComponentBuilder {
  instruction(fn: BuilderFn<IInstructionBuilder, IInstructionBuilder>): this;
  knowledge(fn: BuilderFn<IKnowledgeBuilder, IKnowledgeBuilder>): this;
  data(fn: BuilderFn<IDataBuilder, IDataBuilder>): this;
}

/**
 * Metadata builder interface
 */
export interface IMetadataBuilder {
  name(name: string): this;
  description(description: string): this;
  semantic(semantic: string): this;
  tags(tags: string[]): this;
  solves(problems: { problem: string; keywords: string[] }[]): this;
  requires(moduleIds: string[]): this;
  recommends(moduleIds: string[]): this;
  conflictsWith(moduleIds: string[]): this;
  extends(moduleId: string): this;
  quality(fn: BuilderFn<IQualityBuilder, IQualityBuilder>): this;
  license(license: string): this;
  authors(authors: string[]): this;
  homepage(url: string): this;
  deprecated(isDeprecated: boolean): this;
  replacedBy(moduleId: string): this;
  build(): ModuleMetadata;
}

/**
 * Quality metadata builder interface
 */
export interface IQualityBuilder {
  maturity(maturity: 'alpha' | 'beta' | 'stable' | 'deprecated'): this;
  confidence(confidence: number): this;
  lastVerified(date: string): this;
  experimental(isExperimental: boolean): this;
  build(): QualityMetadata;
}

/**
 * Instruction component builder interface
 */
export interface IInstructionBuilder {
  purpose(purpose: string): this;
  process(steps: (string | ProcessStep)[]): this;
  constraint(rule: string, severity?: 'error' | 'warning' | 'info'): this;
  constraint(constraint: Constraint): this;
  principle(principle: string): this;
  criterion(
    item: string,
    severity?: 'critical' | 'important' | 'nice-to-have'
  ): this;
  criterion(criterion: Criterion): this;
  build(): InstructionComponent;
}

/**
 * Knowledge component builder interface
 */
export interface IKnowledgeBuilder {
  explanation(explanation: string): this;
  concept(concept: Concept): this;
  example(example: Example): this;
  pattern(pattern: Pattern): this;
  build(): KnowledgeComponent;
}

/**
 * Data component builder interface
 */
export interface IDataBuilder {
  format(format: string): this;
  value(value: unknown): this;
  description(description: string): this;
  build(): DataComponent;
}

/**
 * Simple constraint shorthand
 */
export interface SimpleConstraint {
  rule: string;
  severity?: 'error' | 'warning' | 'info';
}

/**
 * Simple criterion shorthand
 */
export interface SimpleCriterion {
  item: string;
  severity?: 'critical' | 'important' | 'nice-to-have';
}
