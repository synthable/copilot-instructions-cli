import { describe, it, expect } from 'vitest';
import { validateModule } from '../validation/module-validator.js';
import { ComponentType } from '../../types/index.js';
import type { Module } from '../../types/index.js';

describe('UMS v2.0 Module Validation', () => {
  describe('validateModule', () => {
    it('should validate a complete valid instruction module', () => {
      const validModule: Module = {
        id: 'principle/architecture/separation-of-concerns',
        version: '1.0.0',
        schemaVersion: '2.0',
        capabilities: ['architecture', 'design'],
        metadata: {
          name: 'Separation of Concerns',
          description: 'A specification that mandates decomposing systems.',
          semantic:
            'Separation of Concerns specification describing decomposition strategies.',
          tags: ['architecture', 'design-principles'],
          license: 'MIT',
          authors: ['Jane Doe <jane.doe@example.com>'],
          homepage: 'https://github.com/example/modules',
        },
        instruction: {
          type: ComponentType.Instruction,
          instruction: {
            purpose:
              'Define mandatory rules to ensure each component addresses a single responsibility.',
            constraints: [
              'Components MUST encapsulate a single responsibility.',
              'Dependencies MUST flow in one direction.',
            ],
            principles: [
              'Identify distinct concerns',
              'Separate interface from implementation',
            ],
          },
        },
      };

      const result = validateModule(validModule);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate a valid knowledge module', () => {
      const validModule: Module = {
        id: 'principle/patterns/observer',
        version: '1.0.0',
        schemaVersion: '2.0',
        capabilities: ['patterns', 'design'],
        metadata: {
          name: 'Observer Pattern',
          description: 'Behavioral design pattern for event handling.',
          semantic:
            'Observer pattern knowledge for event-driven architectures.',
        },
        knowledge: {
          type: ComponentType.Knowledge,
          knowledge: {
            explanation:
              'The Observer pattern defines a one-to-many dependency between objects.',
            concepts: [
              {
                name: 'Subject',
                description: 'The object being observed',
                rationale: 'Centralizes state management',
              },
            ],
            examples: [
              {
                title: 'Basic Observer',
                rationale: 'Simple implementation',
                snippet: 'subject.subscribe(observer);',
                language: 'javascript',
              },
            ],
          },
        },
      };

      const result = validateModule(validModule);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate a valid data module', () => {
      const validModule: Module = {
        id: 'technology/config/build-target-matrix',
        version: '1.0.0',
        schemaVersion: '2.0',
        capabilities: ['data', 'configuration'],
        metadata: {
          name: 'Build Target Matrix',
          description: 'Provides a JSON matrix of supported build targets.',
          semantic: 'Data block listing supported build targets and versions.',
        },
        data: {
          type: ComponentType.Data,
          data: {
            format: 'json',
            value: { targets: [{ name: 'linux-x64', node: '20.x' }] },
            description: 'Supported build targets',
          },
        },
      };

      const result = validateModule(validModule);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate module with components array', () => {
      const validModule: Module = {
        id: 'principle/testing/comprehensive',
        version: '1.0.0',
        schemaVersion: '2.0',
        capabilities: ['testing', 'quality'],
        metadata: {
          name: 'Comprehensive Testing',
          description: 'Complete testing guidance.',
          semantic: 'Testing knowledge and procedures.',
        },
        components: [
          {
            type: ComponentType.Instruction,
            instruction: {
              purpose: 'Ensure comprehensive test coverage',
              process: ['Write unit tests', 'Write integration tests'],
            },
          },
          {
            type: ComponentType.Knowledge,
            knowledge: {
              explanation: 'Testing pyramid concept',
              concepts: [
                {
                  name: 'Test Pyramid',
                  description: 'More unit tests, fewer E2E tests',
                },
              ],
            },
          },
        ],
      };

      const result = validateModule(validModule);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject module with invalid ID format', () => {
      const invalidModule = {
        id: 'Invalid_Format', // Uppercase and underscore are invalid
        version: '1.0.0',
        schemaVersion: '2.0',
        capabilities: ['test'],
        metadata: {
          name: 'Test',
          description: 'Test',
          semantic: 'Test',
        },
        instruction: {
          type: ComponentType.Instruction,
          instruction: {
            purpose: 'Test purpose',
          },
        },
      } as Module;

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.path === 'id')).toBe(true);
      expect(
        result.errors.some(e => e.message.includes('Invalid_Format'))
      ).toBe(true);
    });

    it('should reject module with uppercase ID', () => {
      const invalidModule = {
        id: 'Principle/testing/tdd',
        version: '1.0.0',
        schemaVersion: '2.0',
        capabilities: ['test'],
        metadata: {
          name: 'Test',
          description: 'Test',
          semantic: 'Test',
        },
        instruction: {
          type: ComponentType.Instruction,
          instruction: {
            purpose: 'Test purpose',
          },
        },
      } as Module;

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path === 'id')).toBe(true);
      expect(
        result.errors.some(e => e.message.includes('Invalid module ID format'))
      ).toBe(true);
    });

    it('should reject module with wrong schema version', () => {
      const invalidModule = {
        id: 'principle/testing/tdd',
        version: '1.0.0',
        schemaVersion: '1.0', // v1.0 not supported anymore
        capabilities: ['test'],
        metadata: {
          name: 'Test',
          description: 'Test',
          semantic: 'Test',
        },
        instruction: {
          type: ComponentType.Instruction,
          instruction: {
            purpose: 'Test purpose',
          },
        },
      } as Module;

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path === 'schemaVersion')).toBe(true);
      expect(
        result.errors.some(e => e.message.includes('Invalid schema version'))
      ).toBe(true);
    });

    it('should reject module with missing required fields', () => {
      const invalidModule = {
        id: 'principle/testing/tdd',
        version: '1.0.0',
        schemaVersion: '2.0',
        // missing capabilities, metadata, and component
      } as unknown as Module;

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject module without any component', () => {
      const invalidModule = {
        id: 'principle/testing/empty',
        version: '1.0.0',
        schemaVersion: '2.0',
        capabilities: ['test'],
        metadata: {
          name: 'Test',
          description: 'Test',
          semantic: 'Test',
        },
        // No instruction, knowledge, data, or components
      } as Module;

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.message.includes('component'))).toBe(
        true
      );
    });

    it('should reject module with multiple shorthand components', () => {
      const invalidModule = {
        id: 'principle/testing/multiple',
        version: '1.0.0',
        schemaVersion: '2.0',
        capabilities: ['test'],
        metadata: {
          name: 'Test',
          description: 'Test',
          semantic: 'Test',
        },
        instruction: {
          type: ComponentType.Instruction,
          instruction: { purpose: 'Test' },
        },
        knowledge: {
          type: ComponentType.Knowledge,
          knowledge: { explanation: 'Test' },
        },
      } as unknown as Module;

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(
        result.errors.some(e => e.message.includes('mutually exclusive'))
      ).toBe(true);
    });

    it('should handle deprecated module with valid replacement', () => {
      const deprecatedModule: Module = {
        id: 'execution/refactoring/old-refactor',
        version: '1.0.0',
        schemaVersion: '2.0',
        capabilities: ['procedure'],
        metadata: {
          name: 'Old Refactoring Procedure',
          description: 'Deprecated refactoring procedure.',
          semantic: 'Old refactoring approach.',
          deprecated: true,
          replacedBy: 'execution/refactoring/new-refactor',
        },
        instruction: {
          type: ComponentType.Instruction,
          instruction: {
            purpose: 'Old refactoring approach',
            process: ['Old step 1', 'Old step 2'],
          },
        },
      };

      const result = validateModule(deprecatedModule);

      const deprecatedWarnings = result.warnings.filter(w =>
        w.message.includes('deprecated')
      );

      expect(result.valid).toBe(true);
      expect(deprecatedWarnings.length).toBeGreaterThan(0);
      expect(deprecatedWarnings[0].message).toContain('replaced');
    });

    it('should reject deprecated module with invalid replacedBy ID', () => {
      const invalidModule: Module = {
        id: 'execution/refactoring/bad-replacement',
        version: '1.0.0',
        schemaVersion: '2.0',
        capabilities: ['procedure'],
        metadata: {
          name: 'Bad Replacement',
          description: 'Invalid replacement reference.',
          semantic: 'Test semantic content.',
          deprecated: true,
          replacedBy: 'Invalid-ID-Format',
        },
        instruction: {
          type: ComponentType.Instruction,
          instruction: {
            purpose: 'Test purpose',
            process: ['Test step'],
          },
        },
      };

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path?.includes('replacedBy'))).toBe(
        true
      );
    });

    it('should reject non-deprecated module with replacedBy field', () => {
      const invalidModule: Module = {
        id: 'execution/refactoring/non-deprecated-with-replacement',
        version: '1.0.0',
        schemaVersion: '2.0',
        capabilities: ['procedure'],
        metadata: {
          name: 'Non-deprecated with replacement',
          description: 'Should not have replacedBy.',
          semantic: 'Test semantic content.',
          deprecated: false,
          replacedBy: 'execution/refactoring/some-other-module',
        },
        instruction: {
          type: ComponentType.Instruction,
          instruction: {
            purpose: 'Test purpose',
            process: ['Test step'],
          },
        },
      };

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path?.includes('replacedBy'))).toBe(
        true
      );
    });

    it('should reject module with uppercase tags', () => {
      const invalidModule: Module = {
        id: 'principle/testing/uppercase-tags',
        version: '1.0.0',
        schemaVersion: '2.0',
        capabilities: ['test'],
        metadata: {
          name: 'Uppercase Tags',
          description: 'Module with uppercase tags.',
          semantic: 'Test semantic content.',
          tags: ['testing', 'UPPERCASE', 'valid-tag'],
        },
        instruction: {
          type: ComponentType.Instruction,
          instruction: {
            purpose: 'Test purpose',
          },
        },
      };

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path?.includes('tags'))).toBe(true);
      expect(result.errors.some(e => e.message.includes('lowercase'))).toBe(
        true
      );
    });

    it('should reject module with invalid version format', () => {
      const invalidModule = {
        id: 'principle/testing/bad-version',
        version: 'not-semver',
        schemaVersion: '2.0',
        capabilities: ['test'],
        metadata: {
          name: 'Test',
          description: 'Test',
          semantic: 'Test',
        },
        instruction: {
          type: ComponentType.Instruction,
          instruction: {
            purpose: 'Test purpose',
          },
        },
      } as Module;

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path === 'version')).toBe(true);
      expect(result.errors.some(e => e.message.includes('SemVer'))).toBe(true);
    });

    it('should reject module with empty capabilities array', () => {
      const invalidModule: Module = {
        id: 'principle/testing/no-capabilities',
        version: '1.0.0',
        schemaVersion: '2.0',
        capabilities: [],
        metadata: {
          name: 'Test',
          description: 'Test',
          semantic: 'Test',
        },
        instruction: {
          type: ComponentType.Instruction,
          instruction: {
            purpose: 'Test purpose',
          },
        },
      };

      const result = validateModule(invalidModule);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path === 'capabilities')).toBe(true);
    });

    it('should validate instruction component with all fields', () => {
      const validModule: Module = {
        id: 'execution/testing/comprehensive-testing',
        version: '1.0.0',
        schemaVersion: '2.0',
        capabilities: ['testing'],
        metadata: {
          name: 'Comprehensive Testing',
          description: 'Complete testing procedure.',
          semantic: 'Testing procedure with all instruction fields.',
        },
        instruction: {
          type: ComponentType.Instruction,
          instruction: {
            purpose: 'Ensure comprehensive test coverage',
            process: [
              'Write unit tests',
              {
                step: 'Write integration tests',
                detail: 'Focus on API contracts',
              },
            ],
            constraints: [
              'All tests must pass before deployment',
              { rule: 'Coverage must exceed 80%', severity: 'error' as const },
            ],
            principles: ['Test early and often', 'Write tests first'],
            criteria: [
              'All critical paths covered',
              {
                item: 'Performance tests included',
                severity: 'critical' as const,
              },
            ],
          },
        },
      };

      const result = validateModule(validModule);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
