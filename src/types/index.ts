/**
 * Represents a single, parsed instruction module from a markdown file.
 */
export interface Module {
  /** Unique identifier, e.g., 'tier/subject/filename' */
  id: string;
  /** The top-level category, e.g., 'foundation' */
  tier: string;
  /** The sub-category path, e.g., 'logic' or 'framework/react' */
  subject: string;
  /** Human-readable name from frontmatter */
  name: string;
  /** Description from frontmatter */
  description: string;
  /** The raw markdown content of the module */
  content: string;
  /** The absolute path to the source file */
  filePath: string;
  /** The layer of the module (foundation tier only) */
  layer?: number;
}

/**
 * Represents the structure of a *.persona.json configuration file.
 */
export interface PersonaConfig {
  name: string;
  description?: string;
  output?: string;
  attributions?: boolean;
  modules: string[];
}
