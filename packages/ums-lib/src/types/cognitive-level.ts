/**
 * @file Cognitive level enum and utilities for UMS v2.1.
 * @description Provides the cognitive abstraction hierarchy (levels 0-6) and helper functions.
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

// #endregion

// #region Cognitive Level Utilities

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
    [CognitiveLevel.SPECIFICATIONS_AND_STANDARDS]: 'Specifications & Standards',
    [CognitiveLevel.META_COGNITION]: 'Meta-Cognition',
  };
  return names[level];
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
  return descriptions[level];
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
  return (
    typeof value === 'number' &&
    value >= 0 &&
    value <= 6 &&
    Number.isInteger(value)
  );
}

// #endregion
