import { describe, it, expect } from 'vitest';
import { ID_REGEX } from './constants.js';

describe('ID_REGEX validation', () => {
  describe('valid patterns', () => {
    it('should validate basic tier/subject/module patterns', () => {
      const validIds = [
        'foundation/reasoning/systems-thinking',
        'principle/architecture/separation-of-concerns',
        'technology/language/typescript/generics',
        'execution/release/cut-minor-release',
      ];

      validIds.forEach(id => {
        expect(ID_REGEX.test(id)).toBe(true);
      });
    });

    it('should validate multi-level subjects', () => {
      const validIds = [
        'technology/language/python/pep8-style-guide',
        'execution/playbooks/refactor-for-dependency-injection',
        'principle/testing/test-driven-development',
        'foundation/ethics/do-no-harm',
      ];

      validIds.forEach(id => {
        expect(ID_REGEX.test(id)).toBe(true);
      });
    });

    it('should validate hyphenated names', () => {
      const validIds = [
        'foundation/reasoning/first-principles-thinking',
        'principle/design/adapter-pattern',
        'technology/config/build-target-matrix',
        'execution/incidents/production-rollback-playbook',
      ];

      validIds.forEach(id => {
        expect(ID_REGEX.test(id)).toBe(true);
      });
    });

    it('should validate single character segments', () => {
      const validIds = [
        'foundation/a/b',
        'principle/x/y-z',
        'technology/1/2-3',
        'execution/a-b/c',
      ];

      validIds.forEach(id => {
        expect(ID_REGEX.test(id)).toBe(true);
      });
    });

    it('should validate numbers in segments', () => {
      const validIds = [
        'foundation/version2/algo-v3',
        'principle/http2/optimization',
        'technology/node18/features',
        'execution/step1/process-v2',
      ];

      validIds.forEach(id => {
        expect(ID_REGEX.test(id)).toBe(true);
      });
    });

    it('should validate module names starting with numbers', () => {
      const validIds = [
        'foundation/reasoning/1st-principles',
        'principle/architecture/3-layer-architecture',
        'technology/language/es2023-features',
        'execution/release/2-factor-auth',
      ];

      validIds.forEach(id => {
        expect(ID_REGEX.test(id)).toBe(true);
      });
    });
  });

  describe('invalid patterns', () => {
    it('should reject uppercase letters', () => {
      const invalidIds = [
        'Foundation/reasoning/systems-thinking', // uppercase tier
        'principle/Architecture/separation', // uppercase subject
        'technology/language/TypeScript', // uppercase module name
        'execution/Release/cut-minor', // uppercase subject
      ];

      invalidIds.forEach(id => {
        expect(ID_REGEX.test(id)).toBe(false);
      });
    });

    it('should reject empty segments', () => {
      const invalidIds = [
        'foundation//systems-thinking', // empty subject
        'principle/architecture/', // empty module name
        '/architecture/separation', // empty tier
        'execution//refactor-for-dependency-injection', // empty subject segment
      ];

      invalidIds.forEach(id => {
        expect(ID_REGEX.test(id)).toBe(false);
      });
    });

    it('should reject trailing slashes', () => {
      const invalidIds = [
        'foundation/reasoning/systems-thinking/',
        'principle/architecture/separation-of-concerns/',
        'technology/language/go/',
        'execution/release/cut-minor-release/',
      ];

      invalidIds.forEach(id => {
        expect(ID_REGEX.test(id)).toBe(false);
      });
    });

    it('should reject leading slashes', () => {
      const invalidIds = [
        '/foundation/reasoning/systems-thinking',
        '/principle/architecture/separation',
        '/technology/language/typescript',
        '/execution/release/cut-minor',
      ];

      invalidIds.forEach(id => {
        expect(ID_REGEX.test(id)).toBe(false);
      });
    });

    it('should reject invalid tiers', () => {
      const invalidIds = [
        'invalid-tier/reasoning/systems-thinking',
        'core/architecture/separation',
        'framework/language/typescript',
        'workflow/release/cut-minor',
      ];

      invalidIds.forEach(id => {
        expect(ID_REGEX.test(id)).toBe(false);
      });
    });

    it('should reject special characters', () => {
      const invalidIds = [
        'foundation/reasoning@/systems-thinking',
        'principle/architecture!/separation',
        'technology/language$/typescript',
        'execution/release#/cut-minor',
        'foundation/reasoning/systems_thinking', // underscore
        'principle/architecture/separation.concerns', // period
        'technology/language/type*script', // asterisk
        'execution/release/cut+minor', // plus sign
      ];

      invalidIds.forEach(id => {
        expect(ID_REGEX.test(id)).toBe(false);
      });
    });

    it('should reject module names starting with hyphens', () => {
      const invalidIds = [
        'foundation/reasoning/-systems-thinking',
        'principle/architecture/-separation',
        'technology/language/-typescript',
        'execution/release/-cut-minor',
      ];

      invalidIds.forEach(id => {
        expect(ID_REGEX.test(id)).toBe(false);
      });
    });

    it('should reject insufficient segments', () => {
      const invalidIds = [
        'foundation', // only tier
        'foundation/reasoning', // missing module name
        '', // empty string
        'foundation/', // tier with trailing slash only
      ];

      invalidIds.forEach(id => {
        expect(ID_REGEX.test(id)).toBe(false);
      });
    });

    it('should reject whitespace', () => {
      const invalidIds = [
        'foundation/reasoning/systems thinking',
        'principle/architecture /separation',
        'technology/ language/typescript',
        ' execution/release/cut-minor',
      ];

      invalidIds.forEach(id => {
        expect(ID_REGEX.test(id)).toBe(false);
      });
    });
  });

  describe('boundary cases', () => {
    it('should validate minimum length identifiers', () => {
      // Shortest possible valid IDs
      const minIds = [
        'foundation/a/b',
        'principle/x/1',
        'technology/1/a',
        'execution/z/9',
      ];

      minIds.forEach(id => {
        expect(ID_REGEX.test(id)).toBe(true);
      });
    });

    it('should validate maximum reasonable length identifiers', () => {
      // Very long but valid IDs
      const longIds = [
        'foundation/very-long-subject-path/extremely-long-module-name-with-many-hyphens',
        'principle/multi/level/deep/subject/hierarchy/comprehensive-architecture-pattern',
        'technology/complex/framework/specific/implementation/detailed-configuration-guide',
        'execution/detailed/step/by/step/procedure/comprehensive-deployment-rollback-playbook',
      ];

      longIds.forEach(id => {
        expect(ID_REGEX.test(id)).toBe(true);
      });
    });
  });
});
