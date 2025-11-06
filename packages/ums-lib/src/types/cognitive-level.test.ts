/**
 * Tests for cognitive level utility functions
 */

import { describe, expect, it } from 'vitest';
import {
  CognitiveLevel,
  getCognitiveLevelName,
  getCognitiveLevelDescription,
  parseCognitiveLevel,
  isValidCognitiveLevel,
} from './index.js';

describe('getCognitiveLevelName', () => {
  it('should return correct name for AXIOMS_AND_ETHICS (0)', () => {
    expect(getCognitiveLevelName(CognitiveLevel.AXIOMS_AND_ETHICS)).toBe(
      'Axioms & Ethics'
    );
    expect(getCognitiveLevelName(0)).toBe('Axioms & Ethics');
  });

  it('should return correct name for REASONING_FRAMEWORKS (1)', () => {
    expect(getCognitiveLevelName(CognitiveLevel.REASONING_FRAMEWORKS)).toBe(
      'Reasoning Frameworks'
    );
    expect(getCognitiveLevelName(1)).toBe('Reasoning Frameworks');
  });

  it('should return correct name for UNIVERSAL_PATTERNS (2)', () => {
    expect(getCognitiveLevelName(CognitiveLevel.UNIVERSAL_PATTERNS)).toBe(
      'Universal Patterns'
    );
    expect(getCognitiveLevelName(2)).toBe('Universal Patterns');
  });

  it('should return correct name for DOMAIN_SPECIFIC_GUIDANCE (3)', () => {
    expect(getCognitiveLevelName(CognitiveLevel.DOMAIN_SPECIFIC_GUIDANCE)).toBe(
      'Domain-Specific Guidance'
    );
    expect(getCognitiveLevelName(3)).toBe('Domain-Specific Guidance');
  });

  it('should return correct name for PROCEDURES_AND_PLAYBOOKS (4)', () => {
    expect(getCognitiveLevelName(CognitiveLevel.PROCEDURES_AND_PLAYBOOKS)).toBe(
      'Procedures & Playbooks'
    );
    expect(getCognitiveLevelName(4)).toBe('Procedures & Playbooks');
  });

  it('should return correct name for SPECIFICATIONS_AND_STANDARDS (5)', () => {
    expect(
      getCognitiveLevelName(CognitiveLevel.SPECIFICATIONS_AND_STANDARDS)
    ).toBe('Specifications & Standards');
    expect(getCognitiveLevelName(5)).toBe('Specifications & Standards');
  });

  it('should return correct name for META_COGNITION (6)', () => {
    expect(getCognitiveLevelName(CognitiveLevel.META_COGNITION)).toBe(
      'Meta-Cognition'
    );
    expect(getCognitiveLevelName(6)).toBe('Meta-Cognition');
  });

  it('should return undefined for invalid level', () => {
    expect(getCognitiveLevelName(7)).toBeUndefined();
    expect(getCognitiveLevelName(-1)).toBeUndefined();
    expect(getCognitiveLevelName(999)).toBeUndefined();
  });
});

describe('getCognitiveLevelDescription', () => {
  it('should return correct description for AXIOMS_AND_ETHICS (0)', () => {
    expect(getCognitiveLevelDescription(CognitiveLevel.AXIOMS_AND_ETHICS)).toBe(
      'Universal truths, ethical bedrock, non-negotiable principles'
    );
    expect(getCognitiveLevelDescription(0)).toBe(
      'Universal truths, ethical bedrock, non-negotiable principles'
    );
  });

  it('should return correct description for REASONING_FRAMEWORKS (1)', () => {
    expect(
      getCognitiveLevelDescription(CognitiveLevel.REASONING_FRAMEWORKS)
    ).toBe('How to think, analyze, and form judgments');
    expect(getCognitiveLevelDescription(1)).toBe(
      'How to think, analyze, and form judgments'
    );
  });

  it('should return correct description for UNIVERSAL_PATTERNS (2)', () => {
    expect(
      getCognitiveLevelDescription(CognitiveLevel.UNIVERSAL_PATTERNS)
    ).toBe('Cross-domain patterns and principles that apply broadly');
    expect(getCognitiveLevelDescription(2)).toBe(
      'Cross-domain patterns and principles that apply broadly'
    );
  });

  it('should return correct description for DOMAIN_SPECIFIC_GUIDANCE (3)', () => {
    expect(
      getCognitiveLevelDescription(CognitiveLevel.DOMAIN_SPECIFIC_GUIDANCE)
    ).toBe('Field-specific but technology-agnostic best practices');
    expect(getCognitiveLevelDescription(3)).toBe(
      'Field-specific but technology-agnostic best practices'
    );
  });

  it('should return correct description for PROCEDURES_AND_PLAYBOOKS (4)', () => {
    expect(
      getCognitiveLevelDescription(CognitiveLevel.PROCEDURES_AND_PLAYBOOKS)
    ).toBe('Step-by-step instructions and actionable guides');
    expect(getCognitiveLevelDescription(4)).toBe(
      'Step-by-step instructions and actionable guides'
    );
  });

  it('should return correct description for SPECIFICATIONS_AND_STANDARDS (5)', () => {
    expect(
      getCognitiveLevelDescription(CognitiveLevel.SPECIFICATIONS_AND_STANDARDS)
    ).toBe('Precise requirements, validation criteria, compliance rules');
    expect(getCognitiveLevelDescription(5)).toBe(
      'Precise requirements, validation criteria, compliance rules'
    );
  });

  it('should return correct description for META_COGNITION (6)', () => {
    expect(getCognitiveLevelDescription(CognitiveLevel.META_COGNITION)).toBe(
      'Self-reflection, process improvement, learning from experience'
    );
    expect(getCognitiveLevelDescription(6)).toBe(
      'Self-reflection, process improvement, learning from experience'
    );
  });

  it('should return undefined for invalid level', () => {
    expect(getCognitiveLevelDescription(7)).toBeUndefined();
    expect(getCognitiveLevelDescription(-1)).toBeUndefined();
    expect(getCognitiveLevelDescription(999)).toBeUndefined();
  });
});

describe('parseCognitiveLevel', () => {
  describe('numeric input', () => {
    it('should parse valid numeric levels 0-6', () => {
      expect(parseCognitiveLevel(0)).toBe(CognitiveLevel.AXIOMS_AND_ETHICS);
      expect(parseCognitiveLevel(1)).toBe(CognitiveLevel.REASONING_FRAMEWORKS);
      expect(parseCognitiveLevel(2)).toBe(CognitiveLevel.UNIVERSAL_PATTERNS);
      expect(parseCognitiveLevel(3)).toBe(
        CognitiveLevel.DOMAIN_SPECIFIC_GUIDANCE
      );
      expect(parseCognitiveLevel(4)).toBe(
        CognitiveLevel.PROCEDURES_AND_PLAYBOOKS
      );
      expect(parseCognitiveLevel(5)).toBe(
        CognitiveLevel.SPECIFICATIONS_AND_STANDARDS
      );
      expect(parseCognitiveLevel(6)).toBe(CognitiveLevel.META_COGNITION);
    });

    it('should return undefined for invalid numeric levels', () => {
      expect(parseCognitiveLevel(-1)).toBeUndefined();
      expect(parseCognitiveLevel(7)).toBeUndefined();
      expect(parseCognitiveLevel(999)).toBeUndefined();
    });
  });

  describe('string numeric input', () => {
    it('should parse valid string numeric levels "0"-"6"', () => {
      expect(parseCognitiveLevel('0')).toBe(CognitiveLevel.AXIOMS_AND_ETHICS);
      expect(parseCognitiveLevel('1')).toBe(
        CognitiveLevel.REASONING_FRAMEWORKS
      );
      expect(parseCognitiveLevel('2')).toBe(CognitiveLevel.UNIVERSAL_PATTERNS);
      expect(parseCognitiveLevel('3')).toBe(
        CognitiveLevel.DOMAIN_SPECIFIC_GUIDANCE
      );
      expect(parseCognitiveLevel('4')).toBe(
        CognitiveLevel.PROCEDURES_AND_PLAYBOOKS
      );
      expect(parseCognitiveLevel('5')).toBe(
        CognitiveLevel.SPECIFICATIONS_AND_STANDARDS
      );
      expect(parseCognitiveLevel('6')).toBe(CognitiveLevel.META_COGNITION);
    });

    it('should return undefined for invalid string numeric levels', () => {
      expect(parseCognitiveLevel('-1')).toBeUndefined();
      expect(parseCognitiveLevel('7')).toBeUndefined();
      expect(parseCognitiveLevel('999')).toBeUndefined();
    });
  });

  describe('enum name input', () => {
    it('should parse valid enum names (case-insensitive)', () => {
      expect(parseCognitiveLevel('AXIOMS_AND_ETHICS')).toBe(
        CognitiveLevel.AXIOMS_AND_ETHICS
      );
      expect(parseCognitiveLevel('REASONING_FRAMEWORKS')).toBe(
        CognitiveLevel.REASONING_FRAMEWORKS
      );
      expect(parseCognitiveLevel('UNIVERSAL_PATTERNS')).toBe(
        CognitiveLevel.UNIVERSAL_PATTERNS
      );
      expect(parseCognitiveLevel('DOMAIN_SPECIFIC_GUIDANCE')).toBe(
        CognitiveLevel.DOMAIN_SPECIFIC_GUIDANCE
      );
      expect(parseCognitiveLevel('PROCEDURES_AND_PLAYBOOKS')).toBe(
        CognitiveLevel.PROCEDURES_AND_PLAYBOOKS
      );
      expect(parseCognitiveLevel('SPECIFICATIONS_AND_STANDARDS')).toBe(
        CognitiveLevel.SPECIFICATIONS_AND_STANDARDS
      );
      expect(parseCognitiveLevel('META_COGNITION')).toBe(
        CognitiveLevel.META_COGNITION
      );
    });

    it('should parse lowercase enum names (case-insensitive)', () => {
      expect(parseCognitiveLevel('axioms_and_ethics')).toBe(
        CognitiveLevel.AXIOMS_AND_ETHICS
      );
      expect(parseCognitiveLevel('reasoning_frameworks')).toBe(
        CognitiveLevel.REASONING_FRAMEWORKS
      );
      expect(parseCognitiveLevel('meta_cognition')).toBe(
        CognitiveLevel.META_COGNITION
      );
    });

    it('should return undefined for invalid enum names', () => {
      expect(parseCognitiveLevel('INVALID_NAME')).toBeUndefined();
      expect(parseCognitiveLevel('AXIOMS')).toBeUndefined(); // partial
      expect(parseCognitiveLevel('invalid_name')).toBeUndefined(); // lowercase invalid
    });
  });

  describe('edge cases', () => {
    it('should return undefined for empty string', () => {
      expect(parseCognitiveLevel('')).toBeUndefined();
    });

    it('should return undefined for whitespace', () => {
      expect(parseCognitiveLevel('  ')).toBeUndefined();
    });

    it('should return undefined for non-numeric strings', () => {
      expect(parseCognitiveLevel('abc')).toBeUndefined();
      expect(parseCognitiveLevel('one')).toBeUndefined();
    });
  });
});

describe('isValidCognitiveLevel', () => {
  it('should return true for valid CognitiveLevel enum values', () => {
    expect(isValidCognitiveLevel(CognitiveLevel.AXIOMS_AND_ETHICS)).toBe(true);
    expect(isValidCognitiveLevel(CognitiveLevel.REASONING_FRAMEWORKS)).toBe(
      true
    );
    expect(isValidCognitiveLevel(CognitiveLevel.UNIVERSAL_PATTERNS)).toBe(true);
    expect(isValidCognitiveLevel(CognitiveLevel.DOMAIN_SPECIFIC_GUIDANCE)).toBe(
      true
    );
    expect(isValidCognitiveLevel(CognitiveLevel.PROCEDURES_AND_PLAYBOOKS)).toBe(
      true
    );
    expect(
      isValidCognitiveLevel(CognitiveLevel.SPECIFICATIONS_AND_STANDARDS)
    ).toBe(true);
    expect(isValidCognitiveLevel(CognitiveLevel.META_COGNITION)).toBe(true);
  });

  it('should return true for valid numeric levels 0-6', () => {
    expect(isValidCognitiveLevel(0)).toBe(true);
    expect(isValidCognitiveLevel(1)).toBe(true);
    expect(isValidCognitiveLevel(2)).toBe(true);
    expect(isValidCognitiveLevel(3)).toBe(true);
    expect(isValidCognitiveLevel(4)).toBe(true);
    expect(isValidCognitiveLevel(5)).toBe(true);
    expect(isValidCognitiveLevel(6)).toBe(true);
  });

  it('should return false for invalid numeric levels', () => {
    expect(isValidCognitiveLevel(-1)).toBe(false);
    expect(isValidCognitiveLevel(7)).toBe(false);
    expect(isValidCognitiveLevel(999)).toBe(false);
  });

  it('should return false for non-number types', () => {
    expect(isValidCognitiveLevel('0')).toBe(false);
    expect(isValidCognitiveLevel('AXIOMS_AND_ETHICS')).toBe(false);
    expect(isValidCognitiveLevel(null)).toBe(false);
    expect(isValidCognitiveLevel(undefined)).toBe(false);
    expect(isValidCognitiveLevel({})).toBe(false);
    expect(isValidCognitiveLevel([])).toBe(false);
    expect(isValidCognitiveLevel(true)).toBe(false);
  });

  it('should return false for float numbers', () => {
    expect(isValidCognitiveLevel(1.5)).toBe(false);
    expect(isValidCognitiveLevel(3.14)).toBe(false);
  });

  it('should return false for NaN', () => {
    expect(isValidCognitiveLevel(NaN)).toBe(false);
  });

  it('should return false for Infinity', () => {
    expect(isValidCognitiveLevel(Infinity)).toBe(false);
    expect(isValidCognitiveLevel(-Infinity)).toBe(false);
  });
});
