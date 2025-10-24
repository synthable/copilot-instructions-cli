/**
 * @file Type definitions for the Unified Module System (UMS) v2.0 specification.
 * @see {@link file://./../../docs/spec/unified_module_system_v2_spec.md}
 * @see {@link file://./../../docs/ums-v2-lib-implementation.md}
 */

// #region Cognitive Level Enum

/**
 * Cognitive abstraction levels for UMS v2.0 modules.
 * Indicates the level of abstraction and specificity of module content.
 */
export enum CognitiveLevel {
  /** Level 0: Axioms & Ethics - Universal truths, ethical bedrock, non-negotiable principles */
  AXIOMS_AND_ETHICS = 0,
  /** Level 1: Reasoning Frameworks - How to think, analyze, and form judgments */
  REASONING_FRAMEWORKS = 1,
  /** Level 2: Universal Patterns - Cross-domain patterns and principles that apply broadly */
  UNIVERSAL_PATTERNS = 2,
  /** Level 3: Domain-Specific Guidance - Field-specific but technology-agnostic best practices */
  DOMAIN_SPECIFIC_GUIDANCE = 3,
  /** Level 4: Procedures & Playbooks - Step-by-step instructions and actionable guides */
  PROCEDURES_AND_PLAYBOOKS = 4,
  /** Level 5: Specifications & Standards - Precise requirements, validation criteria, compliance rules */
  SPECIFICATIONS_AND_STANDARDS = 5,
  /** Level 6: Meta-Cognition - Self-reflection, process improvement, learning from experience */
  META_COGNITION = 6,
}

/**
 * Get the human-readable name for a cognitive level.
 * @param level - The cognitive level (0-6 or CognitiveLevel enum value)
 * @returns The name of the cognitive level, or undefined if invalid
 */
export function getCognitiveLevelName(
  level: CognitiveLevel | number
): string | undefined {
  const names: Record<number, string> = {
    [CognitiveLevel.AXIOMS_AND_ETHICS]: 'Axioms & Ethics',
    [CognitiveLevel.REASONING_FRAMEWORKS]: 'Reasoning Frameworks',
    [CognitiveLevel.UNIVERSAL_PATTERNS]: 'Universal Patterns',
    [CognitiveLevel.DOMAIN_SPECIFIC_GUIDANCE]: 'Domain-Specific Guidance',
    [CognitiveLevel.PROCEDURES_AND_PLAYBOOKS]: 'Procedures & Playbooks',
    [CognitiveLevel.SPECIFICATIONS_AND_STANDARDS]:
      'Specifications & Standards',
    [CognitiveLevel.META_COGNITION]: 'Meta-Cognition',
  };
  return names[level as number];
}

/**
 * Get the description for a cognitive level.
 * @param level - The cognitive level (0-6 or CognitiveLevel enum value)
 * @returns The description of the cognitive level, or undefined if invalid
 */
export function getCognitiveLevelDescription(
  level: CognitiveLevel | number
): string | undefined {
  const descriptions: Record<number, string> = {
    [CognitiveLevel.AXIOMS_AND_ETHICS]:
      'Universal truths, ethical bedrock, non-negotiable principles',
    [CognitiveLevel.REASONING_FRAMEWORKS]:
      'How to think, analyze, and form judgments',
    [CognitiveLevel.UNIVERSAL_PATTERNS]:
      'Cross-domain patterns and principles that apply broadly',
    [CognitiveLevel.DOMAIN_SPECIFIC_GUIDANCE]:
      'Field-specific but technology-agnostic best practices',
    [CognitiveLevel.PROCEDURES_AND_PLAYBOOKS]:
      'Step-by-step instructions and actionable guides',
    [CognitiveLevel.SPECIFICATIONS_AND_STANDARDS]:
      'Precise requirements, validation criteria, compliance rules',
    [CognitiveLevel.META_COGNITION]:
      'Self-reflection, process improvement, learning from experience',
  };
  return descriptions[level as number];
}

/**
 * Parse a cognitive level from a string or number.
 * Accepts numeric strings ("0"-"6"), enum names ("AXIOMS_AND_ETHICS"), or numbers (0-6).
 * @param value - The value to parse
 * @returns The CognitiveLevel enum value, or undefined if invalid
 */
export function parseCognitiveLevel(
  value: string | number
): CognitiveLevel | undefined {
  if (typeof value === 'number') {
    return value >= 0 && value <= 6 ? (value as CognitiveLevel) : undefined;
  }

  // Try parsing as number
  const asNumber = parseInt(value, 10);
  if (!isNaN(asNumber) && asNumber >= 0 && asNumber <= 6) {
    return asNumber as CognitiveLevel;
  }

  // Try parsing as enum name (case-insensitive)
  const upperValue = value.toUpperCase().replace(/-/g, '_');
  const enumMap: Record<string, CognitiveLevel> = {
    AXIOMS_AND_ETHICS: CognitiveLevel.AXIOMS_AND_ETHICS,
    REASONING_FRAMEWORKS: CognitiveLevel.REASONING_FRAMEWORKS,
    UNIVERSAL_PATTERNS: CognitiveLevel.UNIVERSAL_PATTERNS,
    DOMAIN_SPECIFIC_GUIDANCE: CognitiveLevel.DOMAIN_SPECIFIC_GUIDANCE,
    PROCEDURES_AND_PLAYBOOKS: CognitiveLevel.PROCEDURES_AND_PLAYBOOKS,
    SPECIFICATIONS_AND_STANDARDS: CognitiveLevel.SPECIFICATIONS_AND_STANDARDS,
    META_COGNITION: CognitiveLevel.META_COGNITION,
  };

  return enumMap[upperValue];
}

/**
 * Check if a value is a valid cognitive level.
 * @param value - The value to check
 * @returns True if the value is a valid CognitiveLevel (0-6)
 */
export function isValidCognitiveLevel(value: unknown): value is CognitiveLevel {
  return typeof value === 'number' && value >= 0 && value <= 6 && Number.isInteger(value);
}

// #endregion

// #region Core Module Types (Implementation Guide Section 2.2)

/**
 * Represents a UMS v2.0 Module, the fundamental unit of instruction.
 * This is a TypeScript-first format.
 */
export interface Module {
  /** The unique identifier for the module (e.g., "be-concise", "ethics/do-no-harm", "typescript/error-handling"). */
  id: string;
  /** The semantic version of the module content (e.g., "1.0.0"). */
  version: string;
  /** The UMS specification version this module adheres to. Must be "2.0". */
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
  /** Shorthand for a single data component. Mutually exclusive with `components`. */
  data?: DataComponent;
}

/**
 * Metadata providing descriptive information about the module.
 */
export interface ModuleMetadata {
  /** A concise, human-readable name in Title Case. */
  name: string;
  /** A brief, one-sentence summary of the module's purpose. */
  description: string;
  /** A dense, keyword-rich paragraph for semantic search by AI agents. */
  semantic: string;
  /** Optional keywords for filtering and search boosting. */
  tags?: string[];
  /** Describes problems this module is designed to solve. */
  solves?: ProblemSolution[];
  /** Defines relationships between this module and others. */
  relationships?: ModuleRelationships;
  /** Optional quality and maintenance metrics. */
  quality?: QualityMetadata;
  /** The SPDX license identifier for the module's content. */
  license?: string;
  /** A list of the primary authors or maintainers. */
  authors?: string[];
  /** A URL to the module's source repository or documentation. */
  homepage?: string;
  /** Flag indicating if the module is deprecated. */
  deprecated?: boolean;
  /** The ID of a successor module, if this module is deprecated. */
  replacedBy?: string;
}

/**
 * Describes a problem that a module is designed to solve.
 */
export interface ProblemSolution {
  /** A description of the problem. */
  problem: string;
  /** Keywords related to the problem. */
  keywords: string[];
}

/**
 * Defines relationships between this module and others.
 */
export interface ModuleRelationships {
  /** A list of module IDs that this module requires to function correctly. */
  requires?: string[];
  /** A list of module IDs that are recommended for use with this module. */
  recommends?: string[];
  /** A list of module IDs that this module conflicts with. */
  conflictsWith?: string[];
  /** The ID of a module that this module extends. */
  extends?: string;
}

/**
 * Optional metadata for assessing the quality, maturity, and maintenance status of a module.
 */
export interface QualityMetadata {
  /** The module's development status. */
  maturity: 'alpha' | 'beta' | 'stable' | 'deprecated';
  /** A score from 0.0 to 1.0 indicating the author's confidence in the module. */
  confidence: number;
  /** The date the module was last verified, in ISO 8601 format. */
  lastVerified?: string;
  /** Flag indicating if the module is experimental. */
  experimental?: boolean;
}

// #endregion

// #region Component Types (Implementation Guide Section 2.3)

/**
 * Enum for the different types of components.
 */
export enum ComponentType {
  Instruction = 'instruction',
  Knowledge = 'knowledge',
  Data = 'data',
}

/**
 * A component that provides actionable instructions.
 */
export interface InstructionComponent {
  /** The type of the component. */
  type: ComponentType.Instruction;
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

/**
 * A detailed, structured process step.
 */
export interface ProcessStep {
  /** The title of the step. */
  step: string;
  /** A detailed description of the step. */
  detail?: string;
  /** A check to validate the step's completion. */
  validate?: {
    check: string;
    severity?: 'error' | 'warning';
  };
  /** A condition for when the step should be performed. */
  when?: string;
  /** The action to be performed. */
  do?: string;
}

/**
 * A detailed, structured constraint.
 */
export interface Constraint {
  /** The text of the constraint. */
  rule: string;
  /** The severity level of the constraint. */
  severity?: 'error' | 'warning' | 'info';
  /** A condition for when the constraint applies. */
  when?: string;
  /** Examples of valid and invalid cases. */
  examples?: {
    valid?: string[];
    invalid?: string[];
  };
  /** The rationale for the constraint. */
  rationale?: string;
}

/**
 * A detailed, structured criterion for verification.
 */
export interface Criterion {
  /** The text of the criterion. */
  item: string;
  /** The category of the criterion. */
  category?: string;
  /** The severity level of the criterion. */
  severity?: 'critical' | 'important' | 'nice-to-have';
  /** The weight or importance of the criterion. */
  weight?: 'required' | 'recommended' | 'optional';
}

/**
 * A component that provides knowledge, concepts, and context.
 */
export interface KnowledgeComponent {
  /** The type of the component. */
  type: ComponentType.Knowledge;
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
  /** Illustrative examples of the concept. */
  examples?: string[];
  /** Trade-offs associated with the concept. */
  tradeoffs?: string[];
}

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
  /** An example illustrating the pattern. */
  example?: Example;
}

/**
 * A component that provides structured data.
 */
export interface DataComponent {
  /** The type of the component. */
  type: ComponentType.Data;
  /** Optional metadata for the component. */
  metadata?: ComponentMetadata;
  /** The data content. */
  data: {
    /** The format of the data (e.g., "json", "yaml", "xml"). */
    format: string;
    /** The structured data, as a string or a typed object. */
    value: unknown;
    /** A description of the data's purpose and format. */
    description?: string;
  };
}

/**
 * Optional metadata for a component.
 */
export interface ComponentMetadata {
  /** The purpose of the component. */
  purpose?: string;
  /** The context in which the component is applicable. */
  context?: string[];
}

/**
 * A union type for all possible components.
 */
export type Component =
  | InstructionComponent
  | KnowledgeComponent
  | DataComponent;

// #endregion

// #region Persona Types (Implementation Guide Section 2.4)

/**
 * Defines an AI persona by composing a set of UMS modules.
 */
export interface Persona {
  /** The unique name of the persona. */
  name: string;
  /** The semantic version of the persona. */
  version: string;
  /** The UMS specification version this persona adheres to. Must be "2.0". */
  schemaVersion: string;
  /** A brief, one-sentence summary of the persona's purpose. */
  description: string;
  /** A dense, keyword-rich paragraph for semantic search. */
  semantic: string;
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

// #endregion

// #region Persona Composition Types (Spec Section 4.2)

/**
 * v2.0 spec-compliant: Module entry in a persona composition.
 * Can be either a simple module ID string or a grouped set of modules.
 */
export type ModuleEntry = string | ModuleGroup;

// #endregion

// #region Registry & Loading Types (Implementation Guide Section 2.5)

/**
 * Internal registry entry, containing a module and its source information.
 * Note: Named RegistryEntry to avoid conflict with spec's ModuleEntry (persona composition).
 */
export interface RegistryEntry {
  /** The UMS module. */
  module: Module;
  /** Information about the source of the module. */
  source: ModuleSource;
  /** Timestamp when the module was added to the registry. */
  addedAt: number;
}

/**
 * Information about the source of a module.
 */
export interface ModuleSource {
  /** The type of the module source. */
  type: 'standard' | 'local' | 'remote';
  /** The URI or path to the module source. */
  path: string;
}

/**
 * Defines the strategy for resolving module ID conflicts in the registry.
 */
export type ConflictStrategy = 'error' | 'warn' | 'replace';

// #endregion

// #region Validation Types (Implementation Guide Section 2.6)

/**
 * The result of a validation operation on a module or persona.
 */
export interface ValidationResult {
  /** True if the validation passed without errors. */
  valid: boolean;
  /** A list of validation errors. */
  errors: ValidationError[];
  /** A list of validation warnings. */
  warnings: ValidationWarning[];
}

/**
 * A validation error, indicating a violation of the UMS specification.
 */
export interface ValidationError {
  /** The path to the problematic field (e.g., "metadata.tier"). */
  path?: string;
  /** A description of the error. */
  message: string;
  /** A reference to the relevant section of the UMS specification. */
  section?: string;
}

/**
 * A validation warning, indicating a potential issue that does not violate the spec.
 */
export interface ValidationWarning {
  /** The path to the field that triggered the warning. */
  path: string;
  /** A description of the warning. */
  message: string;
}

// #endregion

// #region Build Report Types (Implementation Guide Section 7.3)

/**
 * A report generated by the build process, containing metadata about the build.
 */
export interface BuildReport {
  /** The name of the persona that was built. */
  personaName: string;
  /** The UMS schema version used for the build. */
  schemaVersion: string;
  /** The version of the tool that generated the build. */
  toolVersion: string;
  /** A SHA-256 digest of the persona file content. */
  personaDigest: string;
  /** The timestamp of the build in ISO 8601 UTC format. */
  buildTimestamp: string;
  /** The list of module groups included in the build. */
  moduleGroups: BuildReportGroup[];
}

/**
 * A report for a single module group within the build.
 */
export interface BuildReportGroup {
  /** The name of the module group. */
  groupName: string;
  /** A list of modules in this group. */
  modules: BuildReportModule[];
}

/**
 * A report for a single module within the build.
 */
export interface BuildReportModule {
  /** The ID of the module. */
  id: string;
  /** The name of the module. */
  name: string;
  /** The version of the module. */
  version: string;
  /** A string representation of the module's source. */
  source: string;
  /** A SHA-256 digest of the module file content. */
  digest: string;
  /** Flag indicating if the module is deprecated. */
  deprecated: boolean;
  /** The ID of a successor module, if this module is deprecated. */
  replacedBy?: string;
}

// #endregion
