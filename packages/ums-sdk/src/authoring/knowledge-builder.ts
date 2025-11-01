/**
 * @file KnowledgeBuilder implementation for UMS v2.0 Builder API
 * @module authoring/knowledge-builder
 */

import type { KnowledgeComponent, Concept, Example, Pattern } from 'ums-lib';
import { ComponentType as CT } from 'ums-lib';
import type { IKnowledgeBuilder } from './types.js';

/**
 * Builder for knowledge components
 */
export class KnowledgeBuilder implements IKnowledgeBuilder {
  private explanationValue?: string;
  private concepts: Concept[] = [];
  private examples: Example[] = [];
  private patterns: Pattern[] = [];

  explanation(explanation: string): this {
    this.explanationValue = explanation;
    return this;
  }

  concept(concept: Concept): this {
    this.concepts.push(concept);
    return this;
  }

  example(example: Example): this {
    this.examples.push(example);
    return this;
  }

  pattern(pattern: Pattern): this {
    this.patterns.push(pattern);
    return this;
  }

  build(): KnowledgeComponent {
    if (!this.explanationValue) {
      throw new Error('Knowledge component requires an explanation');
    }

    const component: KnowledgeComponent = {
      type: CT.Knowledge,
      knowledge: {
        explanation: this.explanationValue,
      },
    };

    // Add optional fields only if they have values
    if (this.concepts.length > 0) {
      component.knowledge.concepts = this.concepts;
    }
    if (this.examples.length > 0) {
      component.knowledge.examples = this.examples;
    }
    if (this.patterns.length > 0) {
      component.knowledge.patterns = this.patterns;
    }

    return component;
  }
}
