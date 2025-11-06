/**
 * Tests for module validation edge cases
 */

import { describe, expect, it } from 'vitest';
import { validateModule } from './module-validator.js';
import type { Module } from '../../types/index.js';
import { CognitiveLevel, ComponentType } from '../../types/index.js';

describe('validateModule - edge cases', () => {
  const baseModule: Module = {
    id: 'test-module',
    version: '1.0.0',
    schemaVersion: '2.0',
    capabilities: ['testing'],
    cognitiveLevel: CognitiveLevel.UNIVERSAL_PATTERNS,
    metadata: {
      name: 'Test Module',
      description: 'A test module',
      semantic: 'test module semantic',
    },
    instruction: {
      type: ComponentType.Instruction,
      instruction: {
        purpose: 'Test purpose',
      },
    },
  };

  describe('cognitiveLevel validation', () => {
    it('should error on invalid cognitiveLevel (out of range)', () => {
      const module = { ...baseModule, cognitiveLevel: 99 as CognitiveLevel };
      const result = validateModule(module);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Invalid cognitiveLevel: 99');
      expect(result.errors[0].message).toContain(
        'Must be a valid CognitiveLevel (0-6)'
      );
    });

    it('should error on negative cognitiveLevel', () => {
      const module = { ...baseModule, cognitiveLevel: -1 as CognitiveLevel };
      const result = validateModule(module);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Invalid cognitiveLevel: -1');
    });

    it('should error on cognitiveLevel = 7 (just above max)', () => {
      const module = { ...baseModule, cognitiveLevel: 7 as CognitiveLevel };
      const result = validateModule(module);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Invalid cognitiveLevel: 7');
    });

    it('should accept all valid cognitiveLevel values (0-6)', () => {
      const validLevels = [0, 1, 2, 3, 4, 5, 6];

      for (const level of validLevels) {
        const module = {
          ...baseModule,
          cognitiveLevel: level as CognitiveLevel,
        };
        const result = validateModule(module);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      }
    });

    it('should error on non-integer cognitiveLevel', () => {
      const module = { ...baseModule, cognitiveLevel: 1.5 as CognitiveLevel };
      const result = validateModule(module);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(1);
      const integerError = result.errors.find(e =>
        e.message.includes('cognitiveLevel must be an integer')
      );
      expect(integerError).toBeTruthy();
    });
  });

  describe('components vs shorthand validation', () => {
    it('should warn when both components array and shorthand instruction exist', () => {
      const module: Module = {
        ...baseModule,
        components: [
          {
            type: ComponentType.Instruction,
            instruction: { purpose: 'From components' },
          },
        ],
        instruction: {
          type: ComponentType.Instruction,
          instruction: { purpose: 'From shorthand' },
        },
      };

      const result = validateModule(module);

      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].message).toContain(
        'both components array and shorthand properties'
      );
      expect(result.warnings[0].message).toContain(
        'components array will take precedence'
      );
    });

    it('should warn when both components array and shorthand knowledge exist', () => {
      const { instruction, ...baseWithoutInstruction } = baseModule;
      const module: Module = {
        ...baseWithoutInstruction,
        components: [
          {
            type: ComponentType.Knowledge,
            knowledge: { explanation: 'From components' },
          },
        ],
        knowledge: {
          type: ComponentType.Knowledge,
          knowledge: { explanation: 'From shorthand' },
        },
      };

      const result = validateModule(module);

      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].path).toBe('components');
    });

    it('should warn when both components array and shorthand data exist', () => {
      const { instruction, ...baseWithoutInstruction } = baseModule;
      const module: Module = {
        ...baseWithoutInstruction,
        components: [
          {
            type: ComponentType.Data,
            data: { format: 'json', value: { test: true } },
          },
        ],
        data: {
          type: ComponentType.Data,
          data: { format: 'json', value: { other: true } },
        },
      };

      const result = validateModule(module);

      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(1);
    });

    it('should warn when components array and multiple shorthands exist', () => {
      const module: Module = {
        ...baseModule,
        components: [
          {
            type: ComponentType.Instruction,
            instruction: { purpose: 'From components' },
          },
        ],
        instruction: {
          type: ComponentType.Instruction,
          instruction: { purpose: 'From shorthand instruction' },
        },
        knowledge: {
          type: ComponentType.Knowledge,
          knowledge: { explanation: 'From shorthand knowledge' },
        },
      };

      const result = validateModule(module);

      // Should have error for multiple shorthands AND warning for components+shorthand
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('deprecated and replacedBy validation', () => {
    it('should allow deprecated module with replacedBy', () => {
      const module: Module = {
        ...baseModule,
        metadata: {
          ...baseModule.metadata,
          deprecated: true,
          replacedBy: 'new-module',
        },
      };

      const result = validateModule(module);

      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].message).toContain('deprecated');
    });

    it('should error when replacedBy exists without deprecated', () => {
      const module: Module = {
        ...baseModule,
        metadata: {
          ...baseModule.metadata,
          deprecated: false,
          replacedBy: 'new-module',
        },
      };

      const result = validateModule(module);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain(
        'replacedBy requires deprecated: true'
      );
    });

    it('should error when replacedBy exists with deprecated undefined', () => {
      const module: Module = {
        ...baseModule,
        metadata: {
          ...baseModule.metadata,
          replacedBy: 'new-module',
        },
      };

      const result = validateModule(module);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
    });
  });

  describe('tags validation', () => {
    it('should error on non-lowercase tags', () => {
      const module: Module = {
        ...baseModule,
        metadata: {
          ...baseModule.metadata,
          tags: ['lowercase', 'UPPERCASE', 'MixedCase'],
        },
      };

      const result = validateModule(module);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      const tagErrors = result.errors.filter(e =>
        e.message.includes('lowercase')
      );
      expect(tagErrors.length).toBeGreaterThan(0);
      expect(tagErrors[0].message).toContain('UPPERCASE');
      expect(tagErrors[0].message).toContain('MixedCase');
    });

    it('should allow all lowercase tags', () => {
      const module: Module = {
        ...baseModule,
        metadata: {
          ...baseModule.metadata,
          tags: ['lowercase', 'kebab-case', 'snake_case'],
        },
      };

      const result = validateModule(module);

      expect(result.valid).toBe(true);
      const tagErrors = result.errors.filter(e =>
        e.message.includes('lowercase')
      );
      expect(tagErrors).toHaveLength(0);
    });
  });

  describe('multiple shorthand components', () => {
    it('should error when multiple shorthand components exist', () => {
      const module: Module = {
        ...baseModule,
        instruction: {
          type: ComponentType.Instruction,
          instruction: { purpose: 'Instruction' },
        },
        knowledge: {
          type: ComponentType.Knowledge,
          knowledge: { explanation: 'Knowledge' },
        },
      };

      const result = validateModule(module);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('mutually exclusive');
    });

    it('should error when all three shorthand components exist', () => {
      const module: Module = {
        ...baseModule,
        instruction: {
          type: ComponentType.Instruction,
          instruction: { purpose: 'Instruction' },
        },
        knowledge: {
          type: ComponentType.Knowledge,
          knowledge: { explanation: 'Knowledge' },
        },
        data: {
          type: ComponentType.Data,
          data: { format: 'json', value: {} },
        },
      };

      const result = validateModule(module);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
    });
  });

  describe('module ID format validation', () => {
    it('should allow flat module IDs', () => {
      const module: Module = { ...baseModule, id: 'test-module' };
      const result = validateModule(module);

      expect(result.valid).toBe(true);
    });

    it('should allow hierarchical module IDs', () => {
      const module: Module = {
        ...baseModule,
        id: 'foundation/ethics/do-no-harm',
      };
      const result = validateModule(module);

      expect(result.valid).toBe(true);
    });

    it('should error on invalid module ID with uppercase', () => {
      const module: Module = { ...baseModule, id: 'Test-Module' };
      const result = validateModule(module);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Invalid module ID format');
    });

    it('should error on invalid module ID with spaces', () => {
      const module: Module = { ...baseModule, id: 'test module' };
      const result = validateModule(module);

      expect(result.valid).toBe(false);
    });
  });

  describe('version validation', () => {
    it('should accept valid semantic versions', () => {
      const validVersions = [
        '1.0.0',
        '0.1.0',
        '2.3.4',
        '1.0.0-alpha',
        '1.0.0+build',
      ];

      for (const version of validVersions) {
        const module: Module = { ...baseModule, version };
        const result = validateModule(module);

        expect(result.valid).toBe(true);
      }
    });

    it('should error on invalid version format', () => {
      const module: Module = { ...baseModule, version: '1.0' };
      const result = validateModule(module);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Invalid version format');
    });
  });

  describe('capabilities validation', () => {
    it('should error on empty capabilities array', () => {
      const module: Module = { ...baseModule, capabilities: [] };
      const result = validateModule(module);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain(
        'Module must have at least one capability'
      );
    });

    it('should accept multiple capabilities', () => {
      const module: Module = {
        ...baseModule,
        capabilities: ['testing', 'validation', 'quality'],
      };
      const result = validateModule(module);

      expect(result.valid).toBe(true);
    });
  });
});
