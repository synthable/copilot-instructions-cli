import { describe, it, expect } from 'vitest';
import { validatePersona } from '../validation/persona-validator.js';
import type { Persona } from '../../types/index.js';
import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { join } from 'path';

// Helper to load fixture files
function loadPersonaFixture(filename: string): unknown {
  const fixturePath = join(process.cwd(), '../../tests/fixtures', filename);
  const content = readFileSync(fixturePath, 'utf-8');
  return parse(content) as unknown;
}

describe('UMS Persona Loader', () => {
  describe('validatePersona', () => {
    it('should validate a complete valid persona', () => {
      const validPersona = loadPersonaFixture(
        'valid-persona.persona.yml'
      ) as Persona;

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate a minimal valid persona', () => {
      const validPersona = loadPersonaFixture(
        'valid-minimal.persona.yml'
      ) as Persona;

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate persona without optional fields', () => {
      const validPersona = loadPersonaFixture(
        'valid-basic.persona.yml'
      ) as Persona;

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-object persona', () => {
      const invalidPersona = 'not an object' as unknown as Persona;

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toBe('Persona must be an object');
    });

    it('should reject persona with missing required fields', () => {
      const invalidPersona = {
        name: 'Test Persona',
        // missing description, semantic, moduleGroups
      } as unknown as Persona;

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(3);

      const missingFields = result.errors.filter(e =>
        e.message.includes('Missing required field')
      );
      expect(missingFields.length).toBe(6); // version, schemaVersion, description, semantic, identity, moduleGroups
    });

    it('should reject persona with wrong field types', () => {
      const invalidPersona = {
        name: 123, // Should be string
        description: true, // Should be string
        semantic: [], // Should be string
        role: 456, // Should be string
        attribution: 'yes', // Should be boolean
        moduleGroups: 'not an array', // Should be array
      } as unknown as Persona;

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
      const validPersona = loadPersonaFixture(
        'valid-undefined-optional.persona.yml'
      ) as Persona;

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty moduleGroups array', () => {
      const invalidPersona = loadPersonaFixture(
        'valid-empty-modulegroups.persona.yml'
      ) as Persona;

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(true); // Valid but should have warning
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].message).toContain('empty');
    });

    it('should reject moduleGroups with non-object entries', () => {
      const invalidPersona = loadPersonaFixture(
        'invalid-non-object-modulegroups.persona.yml'
      ) as Persona;

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.path === 'moduleGroups[0]')).toBe(true);
      expect(
        result.errors.some(e => e.message.includes('must be an object'))
      ).toBe(true);
    });

    it('should reject moduleGroups with missing required fields', () => {
      const invalidPersona = loadPersonaFixture(
        'invalid-missing-modules.persona.yml'
      ) as Persona;

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
        result.errors.some(e => e.path === 'moduleGroups[0].modules')
      ).toBe(true);
    });

    it('should reject duplicate group names', () => {
      const invalidPersona = loadPersonaFixture(
        'invalid-duplicate-groups.persona.yml'
      ) as Persona;

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
        result.errors.some(e => e.path === 'moduleGroups[1].groupName')
      ).toBe(true);
      expect(
        result.errors.some(e => e.message.includes('Duplicate group name'))
      ).toBe(true);
    });

    it('should reject invalid module IDs', () => {
      const invalidPersona = {
        name: 'Invalid Module IDs Persona',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'Persona with invalid module IDs.',
        semantic: 'Test semantic',
        modules: [
          {
            id: 'invalid-format',
          },
          {
            id: 'foundation/ethics/do-no-harm',
          },
          {
            id: 'Uppercase/module/id',
          },
        ],
        moduleGroups: [
          {
            group: 'Bad Modules',
            ids: [
              'invalid-format', // Invalid ID format
              'foundation/ethics/do-no-harm', // Valid
              'Uppercase/module/id', // Invalid uppercase
            ],
            groupName: 'Bad Modules',
            modules: [
              'invalid-format', // Invalid ID format
              'foundation/ethics/do-no-harm', // Valid
              'Uppercase/module/id', // Invalid uppercase
            ],
          },
        ],
      } as unknown as Persona;

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
      const invalidPersona = loadPersonaFixture(
        'invalid-duplicate-modules.persona.yml'
      ) as Persona;

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
        result.errors.some(e => e.path === 'moduleGroups[0].modules[1]')
      ).toBe(true);
      expect(
        result.errors.some(e => e.message.includes('Duplicate module ID'))
      ).toBe(true);
    });

    it('should allow same module ID in different groups', () => {
      const validPersona = loadPersonaFixture(
        'valid-same-module-different-groups.persona.yml'
      ) as Persona;

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-string module IDs', () => {
      const invalidPersona = {
        name: 'Non-String Module IDs',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'Persona with non-string module IDs.',
        semantic: 'Test semantic',
        modules: [
          {
            id: 'foundation/ethics/do-no-harm',
          },
        ],
        moduleGroups: [
          {
            group: 'Bad Module Types',
            ids: [
              'foundation/ethics/do-no-harm', // Valid string
            ],
            groupName: 'Bad Module Types',
            modules: [
              'foundation/ethics/do-no-harm', // Valid string
              123, // Invalid number
              { id: 'not-a-string' }, // Invalid object
            ],
          },
        ],
      } as unknown as Persona;

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
      const validPersona = loadPersonaFixture(
        'valid-empty-modules.persona.yml'
      ) as Persona;

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].message).toContain('has no modules');
    });

    it('should handle wrong modules field type', () => {
      const invalidPersona = loadPersonaFixture(
        'invalid-wrong-modules-type.persona.yml'
      ) as Persona;

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
        result.errors.some(e => e.path === 'moduleGroups[0].modules')
      ).toBe(true);
      expect(result.errors.some(e => e.message.includes('array'))).toBe(true);
    });

    it('should handle wrong groupName type', () => {
      const invalidPersona = loadPersonaFixture(
        'invalid-wrong-groupname-type.persona.yml'
      ) as Persona;

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(
        result.errors.some(e => e.path === 'moduleGroups[0].groupName')
      ).toBe(true);
      expect(result.errors.some(e => e.message.includes('string'))).toBe(true);
    });
  });
});
