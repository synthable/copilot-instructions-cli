import { describe, it, expect } from 'vitest';
import {
  VALID_TIERS,
  type ValidTier,
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
  describe('VALID_TIERS', () => {
    it('should export all four tiers as specified in UMS v1.0', () => {
      expect(VALID_TIERS).toEqual([
        'foundation',
        'principle',
        'technology',
        'execution',
      ]);
    });

    it('should have exactly 4 tiers', () => {
      expect(VALID_TIERS).toHaveLength(4);
    });

    it('should be readonly array', () => {
      expect(Object.isFrozen(VALID_TIERS)).toBe(false); // const assertion, not frozen
      expect(Array.isArray(VALID_TIERS)).toBe(true);
    });
  });

  describe('ValidTier type', () => {
    it('should accept valid tier values', () => {
      const foundation: ValidTier = 'foundation';
      const principle: ValidTier = 'principle';
      const technology: ValidTier = 'technology';
      const execution: ValidTier = 'execution';

      expect(foundation).toBe('foundation');
      expect(principle).toBe('principle');
      expect(technology).toBe('technology');
      expect(execution).toBe('execution');
    });
  });

  describe('ID_REGEX', () => {
    describe('valid module IDs', () => {
      it('should match foundation tier modules', () => {
        expect(ID_REGEX.test('foundation/logic/deductive-reasoning')).toBe(
          true
        );
        expect(ID_REGEX.test('foundation/ethics/core-principles')).toBe(true);
        expect(
          ID_REGEX.test('foundation/problem-solving/systematic-approach')
        ).toBe(true);
      });

      it('should match principle tier modules', () => {
        expect(ID_REGEX.test('principle/solid/single-responsibility')).toBe(
          true
        );
        expect(ID_REGEX.test('principle/patterns/observer')).toBe(true);
        expect(ID_REGEX.test('principle/testing/unit-testing')).toBe(true);
      });

      it('should match technology tier modules', () => {
        expect(ID_REGEX.test('technology/javascript/async-patterns')).toBe(
          true
        );
        expect(ID_REGEX.test('technology/react/hooks-patterns')).toBe(true);
        expect(ID_REGEX.test('technology/nodejs/error-handling')).toBe(true);
      });

      it('should match execution tier modules', () => {
        expect(ID_REGEX.test('execution/debugging/systematic-debugging')).toBe(
          true
        );
        expect(ID_REGEX.test('execution/deployment/ci-cd-pipeline')).toBe(true);
        expect(ID_REGEX.test('execution/code-review/checklist')).toBe(true);
      });

      it('should match nested directory structures', () => {
        expect(ID_REGEX.test('foundation/logic/reasoning/deductive')).toBe(
          true
        );
        expect(
          ID_REGEX.test('technology/frontend/react/hooks/use-effect')
        ).toBe(true);
      });

      it('should match single character module names', () => {
        expect(ID_REGEX.test('foundation/logic/a')).toBe(true);
        expect(ID_REGEX.test('principle/patterns/x')).toBe(true);
      });

      it('should match hyphenated module names', () => {
        expect(
          ID_REGEX.test('foundation/problem-solving/root-cause-analysis')
        ).toBe(true);
        expect(ID_REGEX.test('technology/web-dev/responsive-design')).toBe(
          true
        );
      });
    });

    describe('invalid module IDs', () => {
      it('should reject empty strings', () => {
        expect(ID_REGEX.test('')).toBe(false);
      });

      it('should reject invalid tiers', () => {
        expect(ID_REGEX.test('invalid/logic/reasoning')).toBe(false);
        expect(ID_REGEX.test('base/logic/reasoning')).toBe(false);
        expect(ID_REGEX.test('core/logic/reasoning')).toBe(false);
      });

      it('should reject missing category', () => {
        expect(ID_REGEX.test('foundation/reasoning')).toBe(false);
        expect(ID_REGEX.test('principle/single-responsibility')).toBe(false);
      });

      it('should reject uppercase characters', () => {
        expect(ID_REGEX.test('Foundation/logic/reasoning')).toBe(false);
        expect(ID_REGEX.test('foundation/Logic/reasoning')).toBe(false);
        expect(ID_REGEX.test('foundation/logic/Reasoning')).toBe(false);
      });

      it('should reject underscores', () => {
        expect(ID_REGEX.test('foundation/logic/deductive_reasoning')).toBe(
          false
        );
        expect(ID_REGEX.test('foundation/problem_solving/analysis')).toBe(
          false
        );
      });

      it('should reject spaces', () => {
        expect(ID_REGEX.test('foundation/logic/deductive reasoning')).toBe(
          false
        );
        expect(ID_REGEX.test('foundation/problem solving/analysis')).toBe(
          false
        );
      });

      it('should reject special characters except hyphens', () => {
        expect(ID_REGEX.test('foundation/logic/reasoning!')).toBe(false);
        expect(ID_REGEX.test('foundation/logic/reasoning@')).toBe(false);
        expect(ID_REGEX.test('foundation/logic/reasoning#')).toBe(false);
        expect(ID_REGEX.test('foundation/logic/reasoning$')).toBe(false);
        expect(ID_REGEX.test('foundation/logic/reasoning%')).toBe(false);
      });

      it('should reject module names starting with hyphen', () => {
        expect(ID_REGEX.test('foundation/logic/-reasoning')).toBe(false);
        expect(ID_REGEX.test('principle/patterns/-observer')).toBe(false);
      });

      it('should reject double slashes', () => {
        expect(ID_REGEX.test('foundation//logic/reasoning')).toBe(false);
        expect(ID_REGEX.test('foundation/logic//reasoning')).toBe(false);
      });

      it('should reject trailing slashes', () => {
        expect(ID_REGEX.test('foundation/logic/reasoning/')).toBe(false);
        expect(ID_REGEX.test('foundation/logic/')).toBe(false);
      });

      it('should reject leading slashes', () => {
        expect(ID_REGEX.test('/foundation/logic/reasoning')).toBe(false);
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
    it('should be set to version 1.0', () => {
      expect(UMS_SCHEMA_VERSION).toBe('1.0');
    });

    it('should be a string', () => {
      expect(typeof UMS_SCHEMA_VERSION).toBe('string');
    });
  });

  describe('File Extensions', () => {
    describe('MODULE_FILE_EXTENSION', () => {
      it('should be set to .module.yml', () => {
        expect(MODULE_FILE_EXTENSION).toBe('.module.yml');
      });

      it('should start with a dot', () => {
        expect(MODULE_FILE_EXTENSION.startsWith('.')).toBe(true);
      });
    });

    describe('PERSONA_FILE_EXTENSION', () => {
      it('should be set to .persona.yml', () => {
        expect(PERSONA_FILE_EXTENSION).toBe('.persona.yml');
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
