/**
 * @file Atomic primitive types for UMS v2.2.
 * @description Defines the 5 atomic primitive types for vector search compilation.
 * @since UMS v2.2
 */

// #region Primitive Type Enum

/**
 * The 5 atomic primitive types that modules can be compiled into for vector search.
 * These represent the runtime primitives stored in the Vector Database.
 * @since UMS v2.2
 */
export enum PrimitiveType {
  /** Algorithms & Steps - from Instruction.process */
  Procedure = 'procedure',
  /** Rules & Boundaries - from Instruction.constraints */
  Policy = 'policy',
  /** Verification Logic - from Instruction.criteria */
  Evaluation = 'evaluation',
  /** Definitions & Theory - from Knowledge.concepts */
  Concept = 'concept',
  /** Few-Shot Examples - from Knowledge.examples */
  Demonstration = 'demonstration',
}

// #endregion

// #region Atomic Primitive Interface

/**
 * A compiled atomic primitive for vector storage and retrieval.
 * @since UMS v2.2
 */
export interface AtomicPrimitive {
  /** The primitive type */
  type: PrimitiveType;
  /** The source module ID */
  moduleId: string;
  /** The source component ID (if specified) */
  componentId?: string;
  /** The URI for this primitive */
  uri: string;
  /** The content of the primitive */
  content: unknown;
  /** Optional metadata for the primitive */
  metadata?: {
    /** Index within the source array (for process steps, constraints, etc.) */
    index?: number;
    /** Original field name in the source component */
    sourceField: string;
  };
}

// #endregion
