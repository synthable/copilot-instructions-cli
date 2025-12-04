/**
 * @file Core module types for UMS v2.1.
 * @description Defines the Module interface and related metadata types.
 */

import type { CognitiveLevel } from './cognitive-level.js';
import type {
  Component,
  InstructionComponent,
  KnowledgeComponent,
} from './components.js';

// #region Attribution Types

/**
 * Attribution metadata for a module (v2.1).
 * Groups license and authorship information.
 */
export interface Attribution {
  /** The SPDX license identifier for the module's content (e.g., "MIT", "Apache-2.0"). */
  license?: string;
  /** A list of the primary authors or maintainers in "Name <email>" format. */
  authors?: string[];
  /** A URL to the module's source repository or documentation. */
  homepage?: string;
}

// #endregion

// #region Module Metadata

/**
 * Metadata providing descriptive information about the module.
 */
export interface ModuleMetadata {
  /** A concise, human-readable name in Title Case. */
  name: string;
  /** A brief, one-sentence summary of the module's purpose. */
  description: string;
  /**
   * A dense, keyword-rich paragraph for semantic search by AI agents.
   * If omitted, build tools generate it automatically by concatenating:
   * name, description, capabilities, tags, purpose/explanation.
   */
  semantic?: string;
  /** Optional keywords for filtering and search boosting. */
  tags?: string[];
  /**
   * Attribution metadata (license, authors, homepage).
   * @since UMS v2.1
   */
  attribution?: Attribution;

  // Flat lifecycle fields
  /** Flag indicating if the module is deprecated. */
  deprecated?: boolean;
  /** The ID of a successor module. MUST NOT be present unless deprecated is true. */
  replacedBy?: string;

  // Flat attribution fields (deprecated in v2.1, use attribution instead)
  /**
   * @deprecated Use `attribution.license` instead
   */
  license?: string;
  /**
   * @deprecated Use `attribution.authors` instead
   */
  authors?: string[];
  /**
   * @deprecated Use `attribution.homepage` instead
   */
  homepage?: string;
}

// #endregion

// #region Module Interface

/**
 * Represents a UMS v2.1 Module, the fundamental unit of instruction.
 * This is a TypeScript-first format.
 */
export interface Module {
  /** The unique identifier for the module (e.g., "be-concise", "ethics/do-no-harm", "typescript/error-handling"). */
  id: string;
  /** The semantic version of the module content (e.g., "1.0.0"). */
  version: string;
  /** The UMS specification version this module adheres to. Must be "2.0", "2.1", or "2.2". */
  schemaVersion: string;
  /** A list of capabilities this module provides. */
  capabilities: string[];
  /** The module's cognitive abstraction level.
   * @see {@link CognitiveLevel} enum for valid values and their meanings. */
  cognitiveLevel: CognitiveLevel;
  /** Human-readable and AI-discoverable metadata. */
  metadata: ModuleMetadata;
  /** The application domain(s) for the module (technology or field). */
  domain?: string | string[];
  /** The core instructional content of the module, composed of one or more components. */
  components?: Component[];

  /** Shorthand for a single instruction component. Mutually exclusive with `components`. */
  instruction?: InstructionComponent;
  /** Shorthand for a single knowledge component. Mutually exclusive with `components`. */
  knowledge?: KnowledgeComponent;
}

// #endregion
