/**
 * @file Type guards for UMS v2.1 types.
 * @description Runtime type narrowing functions for discriminated unions.
 */

import type {
  ProcessStep,
  ConstraintObject,
  ConstraintGroup,
  CriterionObject,
  CriterionGroup,
  Example,
} from './components.js';

// #region Type Guards

/**
 * Type guard for ProcessStep objects (vs string).
 */
export function isProcessStepObject(step: unknown): step is ProcessStep {
  return (
    typeof step === 'object' &&
    step !== null &&
    'step' in step &&
    typeof (step as ProcessStep).step === 'string'
  );
}

/**
 * Type guard for ConstraintObject (vs string or ConstraintGroup).
 */
export function isConstraintObject(
  constraint: unknown
): constraint is ConstraintObject {
  return (
    typeof constraint === 'object' &&
    constraint !== null &&
    'rule' in constraint &&
    typeof (constraint as ConstraintObject).rule === 'string'
  );
}

/**
 * Type guard for ConstraintGroup (vs string or ConstraintObject).
 */
export function isConstraintGroup(
  constraint: unknown
): constraint is ConstraintGroup {
  return (
    typeof constraint === 'object' &&
    constraint !== null &&
    'group' in constraint &&
    'rules' in constraint &&
    Array.isArray((constraint as ConstraintGroup).rules)
  );
}

/**
 * Type guard for CriterionObject (vs string or CriterionGroup).
 */
export function isCriterionObject(
  criterion: unknown
): criterion is CriterionObject {
  return (
    typeof criterion === 'object' &&
    criterion !== null &&
    'item' in criterion &&
    typeof (criterion as CriterionObject).item === 'string'
  );
}

/**
 * Type guard for CriterionGroup (vs string or CriterionObject).
 */
export function isCriterionGroup(
  criterion: unknown
): criterion is CriterionGroup {
  return (
    typeof criterion === 'object' &&
    criterion !== null &&
    'group' in criterion &&
    'items' in criterion &&
    Array.isArray((criterion as CriterionGroup).items)
  );
}

/**
 * Type guard for Example objects (vs string in concept/pattern examples).
 * Checks for required fields: title, rationale, snippet.
 */
export function isExampleObject(example: unknown): example is Example {
  if (typeof example !== 'object' || example === null) {
    return false;
  }
  const obj = example as Record<string, unknown>;
  return (
    typeof obj.title === 'string' &&
    typeof obj.rationale === 'string' &&
    typeof obj.snippet === 'string'
  );
}

// #endregion
