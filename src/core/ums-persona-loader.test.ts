import { describe, it, expect } from 'vitest';
import { validatePersona } from './ums-persona-loader.js';

describe('UMS Persona Loader', () => {
  describe('validatePersona', () => {
    it('should validate a complete valid persona', () => {
      const validPersona = {
        name: 'JavaScript Frontend React Developer',
        description:
          'A JavaScript Frontend React Developer persona that specializes in building user-facing web applications.',
        semantic:
          'This JavaScript Frontend React Developer persona focused on building accessible, performant, and maintainable user interfaces.',
        role: 'You are an expert frontend engineer with a calm, collaborative tone.',
        attribution: true,
        moduleGroups: [
          {
            groupName: 'Core Reasoning Framework',
            modules: [
              'foundation/ethics/do-no-harm',
              'foundation/reasoning/first-principles-thinking',
            ],
          },
          {
            groupName: 'Professional Standards',
            modules: [
              'principle/testing/test-driven-development',
              'principle/architecture/separation-of-concerns',
            ],
          },
        ],
      };

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate a minimal valid persona', () => {
      const validPersona = {
        name: 'Minimal Reviewer',
        description:
          'A lightweight reviewer persona for quick code review checks.',
        semantic:
          'Minimal reviewer persona focused on fast, basic code review using a single checklist module.',
        moduleGroups: [
          {
            groupName: 'Review',
            modules: ['execution/review/pr-code-review-checklist'],
          },
        ],
      };

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate persona without optional fields', () => {
      const validPersona = {
        name: 'Basic Persona',
        description: 'Basic persona without role or attribution.',
        semantic: 'Basic persona semantic description.',
        moduleGroups: [
          {
            groupName: 'Basic Group',
            modules: ['foundation/ethics/do-no-harm'],
          },
        ],
      };

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-object persona', () => {
      const invalidPersona = 'not an object';

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toBe('Persona must be an object');
    });

    it('should reject persona with missing required fields', () => {
      const invalidPersona = {
        name: 'Test Persona',
        // missing description, semantic, moduleGroups
      };

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(3);

      const missingFields = result.errors.filter(e =>
        e.message.includes('is missing')
      );
      expect(missingFields.length).toBe(3); // description, semantic, moduleGroups
    });

    it('should reject persona with wrong field types', () => {
      const invalidPersona = {
        name: 123, // Should be string
        description: true, // Should be string
        semantic: [], // Should be string
        role: 456, // Should be string
        attribution: 'yes', // Should be boolean
        moduleGroups: 'not an array', // Should be array
      };

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(6);

      // Check that all wrong type errors are present
      expect(
        result.errors.some(
          e => e.path === 'name' && e.message.includes('string')
        )
      ).toBe(true);
      expect(
        result.errors.some(
          e => e.path === 'description' && e.message.includes('string')
        )
      ).toBe(true);
      expect(
        result.errors.some(
          e => e.path === 'semantic' && e.message.includes('string')
        )
      ).toBe(true);
      expect(
        result.errors.some(
          e => e.path === 'role' && e.message.includes('string')
        )
      ).toBe(true);
      expect(
        result.errors.some(
          e => e.path === 'attribution' && e.message.includes('boolean')
        )
      ).toBe(true);
      expect(
        result.errors.some(
          e => e.path === 'moduleGroups' && e.message.includes('array')
        )
      ).toBe(true);
    });

    it('should handle undefined optional fields correctly', () => {
      const validPersona = {
        name: 'Test Persona',
        description: 'Test description',
        semantic: 'Test semantic',
        role: undefined, // Explicitly undefined should be okay
        attribution: undefined, // Explicitly undefined should be okay
        moduleGroups: [
          {
            groupName: 'Test Group',
            modules: ['foundation/ethics/do-no-harm'],
          },
        ],
      };

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty moduleGroups array', () => {
      const invalidPersona = {
        name: 'Empty Groups Persona',
        description: 'Persona with empty moduleGroups.',
        semantic: 'Test semantic',
        moduleGroups: [], // Empty array
      };

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(true); // Valid but should have warning
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].message).toContain('empty');
    });

    it('should reject moduleGroups with non-object entries', () => {
      const invalidPersona = {
        name: 'Bad Groups Persona',
        description: 'Persona with invalid group entries.',
        semantic: 'Test semantic',
        moduleGroups: [
          'not an object', // Invalid
          { groupName: 'Valid Group', modules: [] }, // Valid
        ],
      };

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('moduleGroups[0]');
      expect(result.errors[0].message).toContain('must be an object');
    });

    it('should reject moduleGroups with missing required fields', () => {
      const invalidPersona = {
        name: 'Missing Fields Persona',
        description: 'Persona with groups missing required fields.',
        semantic: 'Test semantic',
        moduleGroups: [
          {
            // missing groupName and modules
          },
        ],
      };

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(
        result.errors.some(e => e.path === 'moduleGroups[0].groupName')
      ).toBe(true);
      expect(
        result.errors.some(e => e.path === 'moduleGroups[0].modules')
      ).toBe(true);
    });

    it('should reject duplicate group names', () => {
      const invalidPersona = {
        name: 'Duplicate Groups Persona',
        description: 'Persona with duplicate group names.',
        semantic: 'Test semantic',
        moduleGroups: [
          {
            groupName: 'Same Name',
            modules: ['foundation/ethics/do-no-harm'],
          },
          {
            groupName: 'Same Name', // Duplicate!
            modules: ['principle/testing/test-driven-development'],
          },
        ],
      };

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('moduleGroups[1].groupName');
      expect(result.errors[0].message).toContain('Duplicate group name');
    });

    it('should reject invalid module IDs', () => {
      const invalidPersona = {
        name: 'Invalid Module IDs Persona',
        description: 'Persona with invalid module IDs.',
        semantic: 'Test semantic',
        moduleGroups: [
          {
            groupName: 'Bad Modules',
            modules: [
              'invalid-format', // Invalid ID format
              'foundation/ethics/do-no-harm', // Valid
              'Uppercase/module/id', // Invalid uppercase
            ],
          },
        ],
      };

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
      expect(
        result.errors.some(e => e.path === 'moduleGroups[0].modules[0]')
      ).toBe(true);
      expect(
        result.errors.some(e => e.path === 'moduleGroups[0].modules[2]')
      ).toBe(true);
    });

    it('should reject duplicate module IDs within a group', () => {
      const invalidPersona = {
        name: 'Duplicate Modules Persona',
        description: 'Persona with duplicate module IDs in same group.',
        semantic: 'Test semantic',
        moduleGroups: [
          {
            groupName: 'Duplicate Modules',
            modules: [
              'foundation/ethics/do-no-harm',
              'foundation/ethics/do-no-harm', // Duplicate!
            ],
          },
        ],
      };

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('moduleGroups[0].modules[1]');
      expect(result.errors[0].message).toContain('appears multiple times');
    });

    it('should allow same module ID in different groups', () => {
      const validPersona = {
        name: 'Same Module Different Groups',
        description: 'Persona with same module in different groups.',
        semantic: 'Test semantic',
        moduleGroups: [
          {
            groupName: 'Group 1',
            modules: ['foundation/ethics/do-no-harm'],
          },
          {
            groupName: 'Group 2',
            modules: ['foundation/ethics/do-no-harm'], // Same module, different group - OK
          },
        ],
      };

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-string module IDs', () => {
      const invalidPersona = {
        name: 'Non-String Module IDs',
        description: 'Persona with non-string module IDs.',
        semantic: 'Test semantic',
        moduleGroups: [
          {
            groupName: 'Bad Module Types',
            modules: [
              'foundation/ethics/do-no-harm', // Valid string
              123, // Invalid number
              { id: 'not-a-string' }, // Invalid object
            ],
          },
        ],
      };

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
      expect(
        result.errors.some(e => e.path === 'moduleGroups[0].modules[1]')
      ).toBe(true);
      expect(
        result.errors.some(e => e.path === 'moduleGroups[0].modules[2]')
      ).toBe(true);
    });

    it('should warn about empty modules array', () => {
      const validPersona = {
        name: 'Empty Modules Persona',
        description: 'Persona with empty modules array.',
        semantic: 'Test semantic',
        moduleGroups: [
          {
            groupName: 'Empty Group',
            modules: [], // Empty modules array
          },
        ],
      };

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].message).toContain('has no modules');
    });

    it('should handle wrong modules field type', () => {
      const invalidPersona = {
        name: 'Wrong Modules Type',
        description: 'Persona with wrong modules field type.',
        semantic: 'Test semantic',
        moduleGroups: [
          {
            groupName: 'Bad Modules Type',
            modules: 'not-an-array', // Should be array
          },
        ],
      };

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('moduleGroups[0].modules');
      expect(result.errors[0].message).toContain('array');
    });

    it('should handle wrong groupName type', () => {
      const invalidPersona = {
        name: 'Wrong GroupName Type',
        description: 'Persona with wrong groupName type.',
        semantic: 'Test semantic',
        moduleGroups: [
          {
            groupName: 123, // Should be string
            modules: ['foundation/ethics/do-no-harm'],
          },
        ],
      };

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toBe('moduleGroups[0].groupName');
      expect(result.errors[0].message).toContain('string');
    });
  });
});
