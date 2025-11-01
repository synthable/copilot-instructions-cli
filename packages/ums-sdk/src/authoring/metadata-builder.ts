/**
 * @file MetadataBuilder implementation for UMS v2.0 Builder API
 * @module authoring/metadata-builder
 */

import type { ModuleMetadata, QualityMetadata } from 'ums-lib';
import type { IMetadataBuilder, IQualityBuilder, BuilderFn } from './types.js';

/**
 * Builder for quality metadata
 */
export class QualityBuilder implements IQualityBuilder {
  private data: Partial<QualityMetadata> = {};

  maturity(maturity: 'alpha' | 'beta' | 'stable' | 'deprecated'): this {
    this.data.maturity = maturity;
    return this;
  }

  confidence(confidence: number): this {
    if (confidence < 0 || confidence > 1) {
      throw new Error('Confidence must be between 0.0 and 1.0');
    }
    this.data.confidence = confidence;
    return this;
  }

  lastVerified(date: string): this {
    this.data.lastVerified = date;
    return this;
  }

  experimental(isExperimental: boolean): this {
    this.data.experimental = isExperimental;
    return this;
  }

  build(): QualityMetadata {
    if (!this.data.maturity) {
      throw new Error('Quality metadata requires maturity field');
    }
    if (this.data.confidence === undefined) {
      throw new Error('Quality metadata requires confidence field');
    }

    return this.data as QualityMetadata;
  }
}

/**
 * Builder for module metadata
 */
export class MetadataBuilder implements IMetadataBuilder {
  private data: Partial<ModuleMetadata> = {};

  name(name: string): this {
    this.data.name = name;
    return this;
  }

  description(description: string): this {
    this.data.description = description;
    return this;
  }

  semantic(semantic: string): this {
    this.data.semantic = semantic;
    return this;
  }

  tags(tags: string[]): this {
    this.data.tags = tags;
    return this;
  }

  solves(problems: { problem: string; keywords: string[] }[]): this {
    this.data.solves = problems;
    return this;
  }

  requires(moduleIds: string[]): this {
    this.data.relationships ??= {};
    this.data.relationships.requires = moduleIds;
    return this;
  }

  recommends(moduleIds: string[]): this {
    this.data.relationships ??= {};
    this.data.relationships.recommends = moduleIds;
    return this;
  }

  conflictsWith(moduleIds: string[]): this {
    this.data.relationships ??= {};
    this.data.relationships.conflictsWith = moduleIds;
    return this;
  }

  extends(moduleId: string): this {
    this.data.relationships ??= {};
    this.data.relationships.extends = moduleId;
    return this;
  }

  quality(fn: BuilderFn<IQualityBuilder, IQualityBuilder>): this {
    const builder = new QualityBuilder();
    fn(builder);
    this.data.quality = builder.build();
    return this;
  }

  license(license: string): this {
    this.data.license = license;
    return this;
  }

  authors(authors: string[]): this {
    this.data.authors = authors;
    return this;
  }

  homepage(url: string): this {
    this.data.homepage = url;
    return this;
  }

  deprecated(isDeprecated: boolean): this {
    this.data.deprecated = isDeprecated;
    return this;
  }

  replacedBy(moduleId: string): this {
    this.data.replacedBy = moduleId;
    return this;
  }

  build(): ModuleMetadata {
    // Validate required fields
    if (!this.data.name) {
      throw new Error('Module metadata requires name field');
    }
    if (!this.data.description) {
      throw new Error('Module metadata requires description field');
    }
    if (!this.data.semantic) {
      throw new Error('Module metadata requires semantic field');
    }

    return this.data as ModuleMetadata;
  }
}
