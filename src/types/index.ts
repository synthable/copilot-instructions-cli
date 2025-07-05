/**
 * Core type definitions for the Copilot Instructions Builder CLI
 *
 * This file defines the foundational types for the four-tier modular architecture
 * that enables composition of AI assistant instructions from reusable modules.
 */

/**
 * The four tiers of the modular architecture, representing different levels
 * of abstraction and compilation priority.
 *
 * - foundation: Universal truths and fundamental thinking principles
 * - principle: Best practices and methodologies (technology-agnostic)
 * - technology: Specific tool/framework knowledge
 * - execution: Step-by-step implementation playbooks
 */
export type ModuleTier =
  | 'foundation'
  | 'principle'
  | 'technology'
  | 'execution';

/**
 * Metadata structure for module frontmatter (YAML)
 *
 * Contains module identification, categorization, and dependency information
 * that enables efficient indexing, searching, and composition.
 */
export interface ModuleMetadata {
  /** The tier this module belongs to */
  tier: ModuleTier;

  /** Grouping identifier for organizing related modules */
  subject: string;

  /** Optional tags for enhanced searchability and categorization */
  tags?: string[];

  /** Optional human-readable description of the module's purpose */
  description?: string;

  /** Optional list of module IDs that this module depends on */
  dependencies?: string[];

  /** Optional list of module IDs that conflict with this module */
  conflicts?: string[];
}

/**
 * Lightweight module representation used in the module index
 *
 * Contains essential metadata for fast lookup and search operations
 * without loading the full module content.
 */
export interface IndexedModule {
  /** Unique identifier for the module */
  id: string;

  /** File system path to the module file */
  path: string;

  /** The tier this module belongs to */
  tier: ModuleTier;

  /** Subject/topic grouping for the module */
  subject: string;

  /** Complete metadata from the module frontmatter */
  metadata: ModuleMetadata;
}

/**
 * Complete module data structure including content
 *
 * Extends IndexedModule with the actual markdown content,
 * used when modules are loaded for compilation.
 */
export interface Module {
  /** Unique identifier for the module */
  id: string;

  /** File system path to the module file */
  path: string;

  /** Complete metadata from the module frontmatter */
  metadata: ModuleMetadata;

  /** The full markdown content of the module (excluding frontmatter) */
  content: string;
}

/**
 * Persona file structure defining instruction composition requirements
 *
 * Specifies output format and which modules to include from each tier
 * to create a specialized AI assistant persona.
 */
export interface PersonaFile {
  /** Display name for the persona */
  name: string;

  /** Optional description of the persona's purpose and capabilities */
  description?: string;

  /** Output configuration specifying format and compilation options */
  output: {
    /** Target output file path */
    file: string;

    /** Optional output format specifications */
    format?: {
      /** Whether to include module source attribution */
      includeAttribution?: boolean;

      /** Custom header content for the output */
      header?: string;

      /** Custom footer content for the output */
      footer?: string;
    };
  };

  /** Required module IDs to include in the persona */
  modules: string[];

  /** Optional module IDs that can be included if available */
  optional_modules?: string[];
}
