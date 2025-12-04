/**
 * @file Component types for UMS v2.1 modules.
 * @description Defines instruction and knowledge component structures.
 */

// #region Component Type Enum

/**
 * Enum for the different types of components.
 */
export enum ComponentType {
  Instruction = 'instruction',
  Knowledge = 'knowledge',
}

// #endregion

// #region Instruction Component Types

/**
 * A process step in an instruction.
 * Can be a simple string or an object with optional notes for elaboration.
 */
export interface ProcessStep {
  /** The step description. */
  step: string;
  /** Optional sub-bullets for clarification. */
  notes?: string[];
}

/**
 * A constraint object with a rule and optional notes.
 */
export interface ConstraintObject {
  /** The constraint rule. Use RFC 2119 keywords (MUST, SHOULD, MAY) for severity. */
  rule: string;
  /** Optional notes for examples, rationale, or clarification. */
  notes?: string[];
}

/**
 * A group of constraints organized under a common heading.
 * Use this to avoid per-item category duplication when multiple constraints belong together.
 *
 * @example
 * ```typescript
 * // Grouped constraints
 * constraints: [
 *   {
 *     group: 'Security',
 *     rules: [
 *       'MUST use HTTPS',
 *       'MUST validate input',
 *       { rule: 'MUST NOT log secrets', notes: ['Good: { userId }', 'Bad: { password }'] }
 *     ]
 *   }
 * ]
 * ```
 */
export interface ConstraintGroup {
  /** Group name renders as #### heading (under ### Constraints). */
  group: string;
  /** The constraints in this group. */
  rules: (string | ConstraintObject)[];
}

/**
 * A constraint in an instruction.
 * Can be a simple string, an object with optional notes, or a grouped collection.
 *
 * Use RFC 2119 keywords (MUST, SHOULD, MAY) in the rule text to indicate severity:
 * - MUST / REQUIRED / SHALL = Error severity (absolute requirement)
 * - MUST NOT / SHALL NOT = Error severity (absolute prohibition)
 * - SHOULD / RECOMMENDED = Warning severity (recommended but not required)
 * - SHOULD NOT / NOT RECOMMENDED = Warning severity (recommended against)
 * - MAY / OPTIONAL = Info severity (truly optional)
 *
 * @example
 * ```typescript
 * // Simple constraint (90% of cases)
 * constraints: [
 *   'URLs MUST use plural nouns for collections',
 *   'All endpoints MUST return proper HTTP status codes'
 * ]
 *
 * // Constraint with notes (10% of cases)
 * constraints: [
 *   {
 *     rule: 'URLs MUST use plural nouns for collections',
 *     notes: [
 *       'Good: /users, /users/123, /orders',
 *       'Bad: /user, /getUser, /createOrder',
 *       'Rationale: REST conventions require resource-based URLs'
 *     ]
 *   }
 * ]
 * ```
 */
export type Constraint = string | ConstraintObject | ConstraintGroup;

/**
 * A criterion object with an item and optional category and notes.
 */
export interface CriterionObject {
  /** The verification criterion. Use RFC 2119 keywords (MUST, SHOULD, MAY) for priority. */
  item: string;
  /** Optional category for grouping (renders as subheading). Alternative to using CriterionGroup. */
  category?: string;
  /** Optional notes for test instructions, expected results, or verification steps. */
  notes?: string[];
}

/**
 * A group of criteria organized under a common heading.
 * Use this to avoid per-item category duplication when multiple criteria belong together.
 *
 * @example
 * ```typescript
 * // Grouped criteria
 * criteria: [
 *   {
 *     group: 'Security',
 *     items: [
 *       'HTTPS enforced',
 *       { item: 'Rate limiting active', notes: ['Test: 100 req/min'] }
 *     ]
 *   },
 *   {
 *     group: 'Performance',
 *     items: [
 *       'Response times under 100ms',
 *       { item: 'Database queries optimized', notes: ['Verify: All queries use indexes'] }
 *     ]
 *   }
 * ]
 * ```
 */
export interface CriterionGroup {
  /** Group name renders as #### heading (under ### Criteria). */
  group: string;
  /** The criteria in this group. */
  items: (string | CriterionObject)[];
}

/**
 * A criterion for verification and success checking.
 * Can be a simple string, an object with optional notes, or a grouped collection.
 *
 * Use RFC 2119 keywords (MUST, SHOULD, MAY) in the criterion text to indicate priority:
 * - MUST / REQUIRED / SHALL = Critical (absolute requirement)
 * - SHOULD / RECOMMENDED = Important (recommended)
 * - MAY / OPTIONAL = Nice-to-have (truly optional)
 *
 * @example
 * ```typescript
 * // Simple criteria (90% of cases)
 * criteria: [
 *   'All endpoints MUST use HTTPS',
 *   'Response times SHOULD be under 100ms',
 *   'Error messages MAY include help links'
 * ]
 *
 * // With notes
 * criteria: [
 *   {
 *     item: 'Rate limiting prevents abuse',
 *     notes: [
 *       'Test: Send 100 requests in 1 minute',
 *       'Expected: Receive 429 Too Many Requests'
 *     ]
 *   }
 * ]
 *
 * // With groups (v2.1)
 * criteria: [
 *   {
 *     group: 'Security',
 *     items: ['HTTPS enforced', { item: 'Rate limiting', notes: ['Test: 100 req/min'] }]
 *   }
 * ]
 * ```
 */
export type Criterion = string | CriterionObject | CriterionGroup;

/**
 * Optional metadata for a component.
 */
export interface ComponentMetadata {
  /**
   * Optional component identifier for URI addressing (v2.2 feature).
   * Enables precise targeting of components within modules using URIs.
   * @example 'error-handling', 'validation-logic'
   */
  id?: string;
  /**
   * Optional component-level tags for categorization (v2.2 feature).
   * Allows fine-grained classification and filtering of components.
   * @example ['testing', 'validation'], ['core', 'utility']
   */
  tags?: string[];
  /** The purpose of the component. */
  purpose?: string;
  /** The context in which the component is applicable. */
  context?: string[];
}

/**
 * A component that provides actionable instructions.
 */
export interface InstructionComponent {
  /** The type of the component. */
  type: ComponentType.Instruction;
  /**
   * Optional component identifier for URI addressing (v2.2 feature).
   * Enables precise targeting of components within modules using URIs.
   * @example 'security-checklist', 'validation-steps'
   */
  id?: string;
  /**
   * Optional component-level tags for categorization (v2.2 feature).
   * Allows fine-grained classification and filtering of components.
   * @example ['api', 'validation'], ['security', 'authentication']
   */
  tags?: string[];
  /** Optional metadata for the component. */
  metadata?: ComponentMetadata;
  /** The instructional content. */
  instruction: {
    /** A clear statement of the component's purpose. */
    purpose: string;
    /** An ordered list of steps to follow. */
    process?: (string | ProcessStep)[];
    /** A list of non-negotiable rules or boundaries. */
    constraints?: (string | Constraint)[];
    /** A list of guiding principles or heuristics. */
    principles?: string[];
    /** A checklist for verifying successful completion. */
    criteria?: (string | Criterion)[];
  };
}

// #endregion

// #region Knowledge Component Types

/**
 * An illustrative example with code or text.
 */
export interface Example {
  /** A short, descriptive title. */
  title: string;
  /** An explanation of what the example demonstrates. */
  rationale: string;
  /** The code or text snippet. */
  snippet: string;
  /** The language of the snippet for syntax highlighting. */
  language?: string;
}

/**
 * A key concept with a definition and rationale.
 */
export interface Concept {
  /** The name of the concept. */
  name: string;
  /** The definition of the concept. */
  description: string;
  /** The rationale for why this concept is important. */
  rationale?: string;
  /**
   * Illustrative examples of the concept.
   * Can be simple strings or full Example objects.
   */
  examples?: (string | Example)[];
  /** Trade-offs associated with the concept. */
  tradeoffs?: string[];
}

/**
 * A description of a common pattern or anti-pattern.
 */
export interface Pattern {
  /** The name of the pattern or anti-pattern. */
  name: string;
  /** The use case for the pattern. */
  useCase: string;
  /** A description of the pattern. */
  description: string;
  /** Advantages of using the pattern. */
  advantages?: string[];
  /** Disadvantages or trade-offs of the pattern. */
  disadvantages?: string[];
  /**
   * Examples illustrating the pattern.
   * Can be simple strings or full Example objects.
   * @since UMS v2.1 (changed from singular `example` to plural `examples`)
   */
  examples?: (string | Example)[];
}

/**
 * A component that provides knowledge, concepts, and context.
 */
export interface KnowledgeComponent {
  /** The type of the component. */
  type: ComponentType.Knowledge;
  /**
   * Optional component identifier for URI addressing (v2.2 feature).
   * Enables precise targeting of components within modules using URIs.
   * @example 'architecture-concepts', 'design-patterns'
   */
  id?: string;
  /**
   * Optional component-level tags for categorization (v2.2 feature).
   * Allows fine-grained classification and filtering of components.
   * @example ['architecture', 'patterns'], ['theory', 'best-practices']
   */
  tags?: string[];
  /** Optional metadata for the component. */
  metadata?: ComponentMetadata;
  /** The knowledge content. */
  knowledge: {
    /** A detailed explanation of the topic. */
    explanation: string;
    /** A list of key concepts with definitions and rationales. */
    concepts?: Concept[];
    /** A list of illustrative examples. */
    examples?: Example[];
    /** A list of common anti-patterns or pitfalls to avoid. */
    patterns?: Pattern[];
  };
}

// #endregion

// #region Component Union Type

/**
 * A union type for all possible components.
 */
export type Component = InstructionComponent | KnowledgeComponent;

// #endregion
