/**
 * @file InstructionBuilder implementation for UMS v2.0 Builder API
 * @module authoring/instruction-builder
 */

import type {
  InstructionComponent,
  ProcessStep,
  Constraint,
  Criterion,
} from 'ums-lib';
import { ComponentType as CT } from 'ums-lib';
import type { IInstructionBuilder } from './types.js';

/**
 * Builder for instruction components
 */
export class InstructionBuilder implements IInstructionBuilder {
  private purposeValue?: string;
  private processSteps: (string | ProcessStep)[] = [];
  private constraints: (string | Constraint)[] = [];
  private principles: string[] = [];
  private criteria: (string | Criterion)[] = [];

  purpose(purpose: string): this {
    this.purposeValue = purpose;
    return this;
  }

  process(steps: (string | ProcessStep)[]): this {
    this.processSteps = steps;
    return this;
  }

  constraint(
    ruleOrConstraint: string | Constraint,
    severity?: 'error' | 'warning' | 'info'
  ): this {
    if (typeof ruleOrConstraint === 'string') {
      // String shorthand
      this.constraints.push(
        severity ? { rule: ruleOrConstraint, severity } : ruleOrConstraint
      );
    } else {
      // Full constraint object
      this.constraints.push(ruleOrConstraint);
    }
    return this;
  }

  principle(principle: string): this {
    this.principles.push(principle);
    return this;
  }

  criterion(
    itemOrCriterion: string | Criterion,
    severity?: 'critical' | 'important' | 'nice-to-have'
  ): this {
    if (typeof itemOrCriterion === 'string') {
      // String shorthand
      this.criteria.push(
        severity ? { item: itemOrCriterion, severity } : itemOrCriterion
      );
    } else {
      // Full criterion object
      this.criteria.push(itemOrCriterion);
    }
    return this;
  }

  build(): InstructionComponent {
    if (!this.purposeValue) {
      throw new Error('Instruction component requires a purpose');
    }

    const component: InstructionComponent = {
      type: CT.Instruction,
      instruction: {
        purpose: this.purposeValue,
      },
    };

    // Add optional fields only if they have values
    if (this.processSteps.length > 0) {
      component.instruction.process = this.processSteps;
    }
    if (this.constraints.length > 0) {
      component.instruction.constraints = this.constraints;
    }
    if (this.principles.length > 0) {
      component.instruction.principles = this.principles;
    }
    if (this.criteria.length > 0) {
      component.instruction.criteria = this.criteria;
    }

    return component;
  }
}
