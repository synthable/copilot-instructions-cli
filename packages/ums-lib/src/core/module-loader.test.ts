import { describe, it, expect } from 'vitest';
import { validateModule } from './module-loader.js';

describe('UMS Module Loader', () => {
  describe('validateModule', () => {
    it('should validate a complete valid specification module', () => {
      const validModule = {
        id: 'principle/architecture/separation-of-concerns',
        version: '1.0.0',
        schemaVersion: '1.0',
        shape: 'specification',
        declaredDirectives: {
          required: ['goal', 'constraints'],
          optional: ['principles', 'examples'],
        },
        meta: {
          name: 'Separation of Concerns',
          description: 'A specification that mandates decomposing systems.',
          semantic:
            'Separation of Concerns specification describing decomposition strategies.',
          tags: ['architecture', 'design-principles'],
          license: 'MIT',
          authors: ['Jane Doe <jane.doe@example.com>'],
          homepage: 'https://github.com/example/modules',
        },
        body: {
          goal: 'Define mandatory rules to ensure each component addresses a single responsibility.',
          constraints: [
            'Components MUST encapsulate a single responsibility.',
            'Dependencies MUST flow in one direction.',
          ],
          principles: [
            'Prefer composition over inheritance.',
            'Favor pure functions at boundaries.',
          ],
        },
      };

      const result = validateModule(validModule);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate a valid procedure module', () => {
      const validModule = {
        id: 'execution/release/cut-minor-release',
        version: '1.0.0',
        schemaVersion: '1.0',
        shape: 'procedure',
        declaredDirectives: {
          required: ['goal', 'process'],
          optional: ['constraints', 'examples'],
        },
        meta: {
          name: 'Cut Minor Release',
          description: 'A procedure to cut a minor release.',
          semantic: 'Step-by-step process for minor releases.',
        },
        body: {
          goal: 'Produce a clean, tagged minor release.',
          process: [
            'Ensure main branch is green.',
            'Generate the changelog.',
            'Bump the minor version.',
          ],
        },
      };

      const result = validateModule(validModule);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate a valid data module', () => {
      const validModule = {
        id: 'technology/config/build-target-matrix',
        version: '1.0.0',
        schemaVersion: '1.0',
        shape: 'data',
        declaredDirectives: {
          required: ['goal', 'data'],
          optional: ['examples'],
        },
        meta: {
          name: 'Build Target Matrix',
          description: 'Provides a JSON matrix of supported build targets.',
          semantic: 'Data block listing supported build targets and versions.',
        },
        body: {
          goal: 'Make supported build targets machine-readable.',
          data: {
            mediaType: 'application/json',
            value: '{ "targets": [{ "name": "linux-x64", "node": "20.x" }] }',
          },
        },
      };

      const result = validateModule(validModule);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate module with examples directive', () => {
      const validModule = {
        id: 'principle/testing/unit-testing-examples',
        version: '1.0.0',
        schemaVersion: '1.0',
        shape: 'specification',
        declaredDirectives: {
          required: ['goal', 'constraints'],
          optional: ['examples'],
        },
        meta: {
          name: 'Unit Testing Examples',
          description: 'Examples of unit testing patterns.',
          semantic: 'Collection of unit testing examples and patterns.',
        },
        body: {
          goal: 'Demonstrate unit testing best practices.',
          constraints: ['Tests MUST be isolated.'],
          examples: [
            {
              title: 'Basic Test',
              rationale: 'Shows a simple unit test structure.',
              snippet:
                'test("adds 1 + 2", () => { expect(add(1, 2)).toBe(3); });',
              language: 'javascript',
            },
            {
              title: 'Mock Test',
              rationale: 'Demonstrates mocking dependencies.',
              snippet: 'const mockDb = jest.mock("./db");',
              language: 'javascript',
            },
          ],
        },
      };

      const result = validateModule(validModule);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject module with invalid ID format', () => {
      const invalidModule = {
        id: 'invalid-format',
        version: '1.0.0',
        schemaVersion: '1.0',
        shape: 'specification',
        declaredDirectives: { required: ['goal'], optional: [] },
        meta: {
          name: 'Test',
          description: 'Test module.',
          semantic: 'Test semantic content.',
        },
        body: { goal: 'Test goal.' },
      };

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('id');
      expect(result.errors[0].message).toContain('invalid-format');
    });

    it('should reject module with uppercase ID', () => {
      const invalidModule = {
        id: 'Principle/testing/tdd',
        version: '1.0.0',
        schemaVersion: '1.0',
        shape: 'specification',
        declaredDirectives: { required: ['goal'], optional: [] },
        meta: {
          name: 'Test',
          description: 'Test module.',
          semantic: 'Test semantic content.',
        },
        body: { goal: 'Test goal.' },
      };

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('id');
      expect(result.errors[0].message).toContain('uppercase characters');
    });

    it('should reject module with wrong schema version', () => {
      const invalidModule = {
        id: 'principle/testing/tdd',
        version: '1.0.0',
        schemaVersion: '2.0',
        shape: 'specification',
        declaredDirectives: { required: ['goal'], optional: [] },
        meta: {
          name: 'Test',
          description: 'Test module.',
          semantic: 'Test semantic content.',
        },
        body: { goal: 'Test goal.' },
      };

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('schemaVersion');
      expect(result.errors[0].message).toContain('Invalid schema version');
    });

    it('should reject module with missing required fields', () => {
      const invalidModule = {
        id: 'principle/testing/tdd',
        version: '1.0.0',
        // missing schemaVersion, shape, declaredDirectives, meta, body
      };

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);

      const missingFields = result.errors.filter(e =>
        e.message.includes('Missing required field')
      );
      expect(missingFields.length).toBe(5); // schemaVersion, shape, declaredDirectives, meta, body
    });

    it('should reject module with undeclared directive in body', () => {
      const invalidModule = {
        id: 'execution/build/invalid-undeclared-key',
        version: '1.0.0',
        schemaVersion: '1.0',
        shape: 'procedure',
        declaredDirectives: {
          required: ['goal', 'process'],
          optional: [],
        },
        meta: {
          name: 'Invalid Module',
          description: 'Contains undeclared directive.',
          semantic: 'Test semantic content.',
        },
        body: {
          goal: 'Build something.',
          process: ['Do stuff.'],
          steps: ['This is undeclared'], // Not in declaredDirectives
        },
      };

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('body.steps');
      expect(result.errors[0].message).toContain('Undeclared directive');
    });

    it('should reject module with missing required directive', () => {
      const invalidModule = {
        id: 'execution/build/missing-required',
        version: '1.0.0',
        schemaVersion: '1.0',
        shape: 'procedure',
        declaredDirectives: {
          required: ['goal', 'process'],
          optional: [],
        },
        meta: {
          name: 'Invalid Module',
          description: 'Missing required directive.',
          semantic: 'Test semantic content.',
        },
        body: {
          goal: 'Build something.',
          // missing 'process' which is required
        },
      };

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('body.process');
      expect(result.errors[0].message).toContain('Missing required directive');
    });

    it('should reject module with wrong directive types', () => {
      const invalidModule = {
        id: 'execution/build/wrong-types',
        version: '1.0.0',
        schemaVersion: '1.0',
        shape: 'procedure',
        declaredDirectives: {
          required: ['goal', 'process'],
          optional: [],
        },
        meta: {
          name: 'Invalid Module',
          description: 'Wrong directive types.',
          semantic: 'Test semantic content.',
        },
        body: {
          goal: 123, // Should be string
          process: 'Not an array', // Should be array
        },
      };

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
      expect(result.errors.some(e => e.path === 'body.goal')).toBe(true);
      expect(result.errors.some(e => e.path === 'body.process')).toBe(true);
    });

    it('should reject data directive with missing fields', () => {
      const invalidModule = {
        id: 'technology/config/invalid-data',
        version: '1.0.0',
        schemaVersion: '1.0',
        shape: 'data',
        declaredDirectives: {
          required: ['goal', 'data'],
          optional: [],
        },
        meta: {
          name: 'Invalid Data Module',
          description: 'Invalid data directive.',
          semantic: 'Test semantic content.',
        },
        body: {
          goal: 'Test goal.',
          data: {
            mediaType: 'application/json',
            // missing 'value' field
          },
        },
      };

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('body.data.value');
    });

    it('should reject examples directive with duplicate titles', () => {
      const invalidModule = {
        id: 'principle/testing/duplicate-titles',
        version: '1.0.0',
        schemaVersion: '1.0',
        shape: 'specification',
        declaredDirectives: {
          required: ['goal', 'constraints'],
          optional: ['examples'],
        },
        meta: {
          name: 'Duplicate Titles',
          description: 'Examples with duplicate titles.',
          semantic: 'Test semantic content.',
        },
        body: {
          goal: 'Test goal.',
          constraints: ['Test constraint.'],
          examples: [
            {
              title: 'Same Title',
              rationale: 'First example.',
              snippet: 'code1',
            },
            {
              title: 'Same Title', // Duplicate!
              rationale: 'Second example.',
              snippet: 'code2',
            },
          ],
        },
      };

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Duplicate title');
    });

    it('should handle deprecated module with valid replacement', () => {
      const deprecatedModule = {
        id: 'execution/refactoring/old-refactor',
        version: '1.0.0',
        schemaVersion: '1.0',
        shape: 'procedure',
        declaredDirectives: {
          required: ['goal', 'process'],
          optional: [],
        },
        meta: {
          name: 'Old Refactoring Procedure',
          description: 'Deprecated refactoring procedure.',
          semantic: 'Old refactoring approach.',
          deprecated: true,
          replacedBy: 'execution/refactoring/new-refactor',
        },
        body: {
          goal: 'Old refactoring approach.',
          process: ['Old step 1', 'Old step 2'],
        },
      };

      const result = validateModule(deprecatedModule);

      const deprecatedWarnings = result.warnings.filter(e =>
        e.message.includes('is deprecated')
      );

      expect(result.valid).toBe(true);
      expect(deprecatedWarnings).toHaveLength(1);
      expect(deprecatedWarnings[0].message).toContain('replaced by');
      expect(deprecatedWarnings[0].message).toContain(
        'execution/refactoring/new-refactor'
      );
    });

    it('should reject deprecated module with invalid replacedBy ID', () => {
      const invalidModule = {
        id: 'execution/refactoring/bad-replacement',
        version: '1.0.0',
        schemaVersion: '1.0',
        shape: 'procedure',
        declaredDirectives: {
          required: ['goal', 'process'],
          optional: [],
        },
        meta: {
          name: 'Bad Replacement',
          description: 'Invalid replacement reference.',
          semantic: 'Test semantic content.',
          deprecated: true,
          replacedBy: 'Invalid-ID-Format',
        },
        body: {
          goal: 'Test goal.',
          process: ['Test step'],
        },
      };

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path === 'meta.replacedBy')).toBe(true);
    });

    it('should reject non-deprecated module with replacedBy field', () => {
      const invalidModule = {
        id: 'execution/refactoring/non-deprecated-with-replacement',
        version: '1.0.0',
        schemaVersion: '1.0',
        shape: 'procedure',
        declaredDirectives: {
          required: ['goal', 'process'],
          optional: [],
        },
        meta: {
          name: 'Non-deprecated with replacement',
          description: 'Should not have replacedBy.',
          semantic: 'Test semantic content.',
          deprecated: false,
          replacedBy: 'execution/refactoring/some-other-module',
        },
        body: {
          goal: 'Test goal.',
          process: ['Test step'],
        },
      };

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path === 'meta.replacedBy')).toBe(true);
    });

    it('should reject module with uppercase tags', () => {
      const invalidModule = {
        id: 'principle/testing/uppercase-tags',
        version: '1.0.0',
        schemaVersion: '1.0',
        shape: 'specification',
        declaredDirectives: {
          required: ['goal', 'constraints'],
          optional: [],
        },
        meta: {
          name: 'Uppercase Tags',
          description: 'Module with uppercase tags.',
          semantic: 'Test semantic content.',
          tags: ['testing', 'UPPERCASE', 'valid-tag'], // UPPERCASE is invalid
        },
        body: {
          goal: 'Test goal.',
          constraints: ['Test constraint.'],
        },
      };

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path === 'meta.tags[1]')).toBe(true);
      expect(result.errors.some(e => e.message.includes('lowercase'))).toBe(
        true
      );
    });
  });
});
