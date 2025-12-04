/**
 * @file Persona types for UMS v2.1.
 * @description Defines the Persona interface and module composition types.
 */

// #region Module Group Types

/**
 * A group of modules within a persona, allowing for logical organization.
 */
export interface PersonaModuleGroup {
  /** An optional name for the group. */
  group?: string;
  /** The list of module IDs in this group, in order of composition. */
  ids: string[];
}

/**
 * v2.0 spec-compliant alias for PersonaModuleGroup
 */
export type ModuleGroup = PersonaModuleGroup;

/**
 * v2.0 spec-compliant: Module entry in a persona composition.
 * Can be either a simple module ID string or a grouped set of modules.
 */
export type ModuleEntry = string | ModuleGroup;

// #endregion

// #region Persona Interface

/**
 * Defines an AI persona by composing a set of UMS modules.
 */
export interface Persona {
  /** The unique identifier for the persona. */
  id: string;
  /** The unique name of the persona. */
  name: string;
  /** The semantic version of the persona. */
  version: string;
  /** The UMS specification version this persona adheres to. Must be "2.0", "2.1", or "2.2". */
  schemaVersion: string;
  /** A brief, one-sentence summary of the persona's purpose. */
  description: string;
  /**
   * A dense, keyword-rich paragraph for semantic search.
   * Optional in v2.1+; if omitted, build tools may auto-generate from other fields.
   */
  semantic?: string;
  /** A detailed description of the persona's identity, role, and voice. */
  identity?: string;
  /** Optional keywords for filtering and search. */
  tags?: string[];
  /** The application domain(s) for the persona. */
  domains?: string[];
  /** If true, attribution will be added to the rendered output. */
  attribution?: boolean;
  /** The ordered list of module entries that compose the persona (spec-compliant). */
  modules: ModuleEntry[];
}

// #endregion
