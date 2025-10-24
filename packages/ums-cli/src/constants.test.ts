import { describe, it, expect } from 'vitest';
import {
  ID_REGEX,
  DIRECTIVE_KEYS,
  type DirectiveKey,
  RENDER_ORDER,
  UMS_SCHEMA_VERSION,
  MODULE_FILE_EXTENSION,
  PERSONA_FILE_EXTENSION,
  MODULES_ROOT,
  PERSONAS_ROOT,
} from './constants.js';

describe('constants', () => {
  describe('ID_REGEX', () => {
    describe('valid module IDs', () => {
      it('should match flat module IDs', () => {
        expect(ID_REGEX.test('be-concise')).toBe(true);
        expect(ID_REGEX.test('error-handling')).toBe(true);
        expect(ID_REGEX.test('example-module')).toBe(true);
      });

      it('should match hierarchical module IDs', () => {
        expect(ID_REGEX.test('logic/deductive-reasoning')).toBe(true);
        expect(ID_REGEX.test('ethics/core-principles')).toBe(true);
        expect(ID_REGEX.test('problem-solving/systematic-approach')).toBe(true);
      });

      it('should match deeply nested hierarchical IDs', () => {
        expect(ID_REGEX.test('logic/reasoning/deductive')).toBe(true);
        expect(ID_REGEX.test('frontend/react/hooks/use-effect')).toBe(true);
      });

      it('should match single character module names', () => {
        expect(ID_REGEX.test('a')).toBe(true);
        expect(ID_REGEX.test('x')).toBe(true);
        expect(ID_REGEX.test('logic/a')).toBe(true);
      });

      it('should match hyphenated module names', () => {
        expect(ID_REGEX.test('problem-solving')).toBe(true);
        expect(ID_REGEX.test('root-cause-analysis')).toBe(true);
        expect(ID_REGEX.test('web-dev/responsive-design')).toBe(true);
      });
    });

    describe('invalid module IDs', () => {
      it('should reject empty strings', () => {
        expect(ID_REGEX.test('')).toBe(false);
      });

      it('should reject uppercase characters', () => {
        expect(ID_REGEX.test('Foundation')).toBe(false);
        expect(ID_REGEX.test('Logic/reasoning')).toBe(false);
        expect(ID_REGEX.test('logic/Reasoning')).toBe(false);
      });

      it('should reject underscores', () => {
        expect(ID_REGEX.test('deductive_reasoning')).toBe(false);
        expect(ID_REGEX.test('logic/deductive_reasoning')).toBe(false);
        expect(ID_REGEX.test('problem_solving/analysis')).toBe(false);
      });

      it('should reject spaces', () => {
        expect(ID_REGEX.test('deductive reasoning')).toBe(false);
        expect(ID_REGEX.test('logic/deductive reasoning')).toBe(false);
        expect(ID_REGEX.test('problem solving/analysis')).toBe(false);
      });

      it('should reject special characters except hyphens', () => {
        expect(ID_REGEX.test('reasoning!')).toBe(false);
        expect(ID_REGEX.test('reasoning@')).toBe(false);
        expect(ID_REGEX.test('reasoning#')).toBe(false);
        expect(ID_REGEX.test('reasoning$')).toBe(false);
        expect(ID_REGEX.test('reasoning%')).toBe(false);
      });

      it('should reject module names starting with hyphen', () => {
        expect(ID_REGEX.test('-reasoning')).toBe(false);
        expect(ID_REGEX.test('logic/-reasoning')).toBe(false);
        expect(ID_REGEX.test('patterns/-observer')).toBe(false);
      });

      it('should reject double slashes', () => {
        expect(ID_REGEX.test('logic//reasoning')).toBe(false);
        expect(ID_REGEX.test('category//module')).toBe(false);
      });

      it('should reject trailing slashes', () => {
        expect(ID_REGEX.test('logic/reasoning/')).toBe(false);
        expect(ID_REGEX.test('logic/')).toBe(false);
      });

      it('should reject leading slashes', () => {
        expect(ID_REGEX.test('/logic/reasoning')).toBe(false);
        expect(ID_REGEX.test('/reasoning')).toBe(false);
      });
    });
  });

  describe('DIRECTIVE_KEYS', () => {
    it('should export all directive keys as specified in UMS v1.0', () => {
      expect(DIRECTIVE_KEYS).toEqual([
        'goal',
        'process',
        'constraints',
        'principles',
        'criteria',
        'data',
        'examples',
      ]);
    });

    it('should have exactly 7 directive keys', () => {
      expect(DIRECTIVE_KEYS).toHaveLength(7);
    });

    it('should be readonly array', () => {
      expect(Array.isArray(DIRECTIVE_KEYS)).toBe(true);
    });
  });

  describe('DirectiveKey type', () => {
    it('should accept valid directive key values', () => {
      const goal: DirectiveKey = 'goal';
      const process: DirectiveKey = 'process';
      const constraints: DirectiveKey = 'constraints';
      const principles: DirectiveKey = 'principles';
      const criteria: DirectiveKey = 'criteria';
      const data: DirectiveKey = 'data';
      const examples: DirectiveKey = 'examples';

      expect(goal).toBe('goal');
      expect(process).toBe('process');
      expect(constraints).toBe('constraints');
      expect(principles).toBe('principles');
      expect(criteria).toBe('criteria');
      expect(data).toBe('data');
      expect(examples).toBe('examples');
    });
  });

  describe('RENDER_ORDER', () => {
    it('should specify the correct rendering order as per UMS v1.0', () => {
      expect(RENDER_ORDER).toEqual([
        'goal',
        'principles',
        'constraints',
        'process',
        'criteria',
        'data',
        'examples',
      ]);
    });

    it('should have exactly 7 elements matching DIRECTIVE_KEYS length', () => {
      expect(RENDER_ORDER).toHaveLength(7);
      expect(RENDER_ORDER).toHaveLength(DIRECTIVE_KEYS.length);
    });

    it('should contain all directive keys', () => {
      const renderOrderSet = new Set(RENDER_ORDER);
      const directiveKeysSet = new Set(DIRECTIVE_KEYS);

      expect(renderOrderSet).toEqual(directiveKeysSet);
    });

    it('should have no duplicate entries', () => {
      const uniqueEntries = [...new Set(RENDER_ORDER)];
      expect(uniqueEntries).toEqual(RENDER_ORDER);
    });
  });

  describe('UMS_SCHEMA_VERSION', () => {
    it('should be set to version 2.0', () => {
      expect(UMS_SCHEMA_VERSION).toBe('2.0');
    });

    it('should be a string', () => {
      expect(typeof UMS_SCHEMA_VERSION).toBe('string');
    });
  });

  describe('File Extensions', () => {
    describe('MODULE_FILE_EXTENSION', () => {
      it('should be set to .module.ts', () => {
        expect(MODULE_FILE_EXTENSION).toBe('.module.ts');
      });

      it('should start with a dot', () => {
        expect(MODULE_FILE_EXTENSION.startsWith('.')).toBe(true);
      });
    });

    describe('PERSONA_FILE_EXTENSION', () => {
      it('should be set to .persona.ts', () => {
        expect(PERSONA_FILE_EXTENSION).toBe('.persona.ts');
      });

      it('should start with a dot', () => {
        expect(PERSONA_FILE_EXTENSION.startsWith('.')).toBe(true);
      });
    });
  });

  describe('Directory Paths', () => {
    describe('MODULES_ROOT', () => {
      it('should be set to instructions-modules', () => {
        expect(MODULES_ROOT).toBe('instructions-modules');
      });

      it('should not have leading or trailing slashes', () => {
        expect(MODULES_ROOT.startsWith('/')).toBe(false);
        expect(MODULES_ROOT.endsWith('/')).toBe(false);
      });
    });

    describe('PERSONAS_ROOT', () => {
      it('should be set to personas', () => {
        expect(PERSONAS_ROOT).toBe('personas');
      });

      it('should not have leading or trailing slashes', () => {
        expect(PERSONAS_ROOT.startsWith('/')).toBe(false);
        expect(PERSONAS_ROOT.endsWith('/')).toBe(false);
      });
    });
  });

  describe('Constants Integration', () => {
    it('should have consistent naming patterns', () => {
      expect(MODULES_ROOT).not.toContain('_');
      expect(PERSONAS_ROOT).not.toContain('_');
    });

    it('should have file extensions matching directory purposes', () => {
      expect(MODULE_FILE_EXTENSION).toContain('module');
      expect(PERSONA_FILE_EXTENSION).toContain('persona');
    });
  });
});
