import { describe, it, expect } from 'vitest';
import { validatePersona } from '../validation/persona-validator.js';
import type { Persona } from '../../types/index.js';

describe('UMS v2.0 Persona Validation', () => {
  describe('validatePersona', () => {
    it('should validate a complete valid persona', () => {
      const validPersona: Persona = {
        name: 'Software Engineer',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'A persona for software engineering tasks',
        semantic:
          'Software engineering assistant with focus on code quality and best practices',
        identity:
          'I am a software engineering assistant focused on helping you write clean, maintainable code.',
        tags: ['engineering', 'code-quality'],
        domains: ['software-development'],
        attribution: false,
        modules: [
          'foundation/logic/deductive-reasoning',
          'principle/architecture/separation-of-concerns',
          'technology/typescript/best-practices',
        ],
      };

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate a minimal valid persona', () => {
      const validPersona: Persona = {
        name: 'Minimal Persona',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'A minimal persona',
        semantic: 'Minimal persona for testing',
        modules: ['foundation/logic/deductive-reasoning'],
      };

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate persona with grouped modules', () => {
      const validPersona: Persona = {
        name: 'Grouped Persona',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'A persona with grouped modules',
        semantic: 'Grouped persona for testing',
        modules: [
          {
            group: 'Foundation',
            ids: ['foundation/logic/deductive-reasoning'],
          },
          {
            group: 'Principles',
            ids: ['principle/architecture/separation-of-concerns'],
          },
        ],
      };

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate persona with mixed module entries', () => {
      const validPersona: Persona = {
        name: 'Mixed Persona',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'A persona with mixed module entries',
        semantic: 'Mixed persona for testing',
        modules: [
          'foundation/logic/deductive-reasoning',
          {
            group: 'Principles',
            ids: ['principle/architecture/separation-of-concerns'],
          },
          'technology/typescript/best-practices',
        ],
      };

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-object persona', () => {
      const invalidPersona = 'not an object' as unknown as Persona;

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject persona with missing required fields', () => {
      const invalidPersona = {
        name: 'Test Persona',
        // missing version, schemaVersion, description, semantic, modules
      } as unknown as Persona;

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject persona with wrong schema version', () => {
      const invalidPersona: Persona = {
        name: 'Test Persona',
        version: '1.0.0',
        schemaVersion: '1.0', // v1.0 not supported anymore
        description: 'Test',
        semantic: 'Test',
        modules: ['foundation/logic/deductive-reasoning'],
      };

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path === 'schemaVersion')).toBe(true);
      expect(
        result.errors.some(e => e.message.includes('Invalid schema version'))
      ).toBe(true);
    });

    it('should reject persona with invalid version format', () => {
      const invalidPersona = {
        name: 'Test Persona',
        version: 'not-semver',
        schemaVersion: '2.0',
        description: 'Test',
        semantic: 'Test',
        modules: ['foundation/logic/deductive-reasoning'],
      } as Persona;

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path === 'version')).toBe(true);
      expect(result.errors.some(e => e.message.includes('SemVer'))).toBe(true);
    });

    it('should reject persona with empty modules array', () => {
      const invalidPersona: Persona = {
        name: 'Empty Modules',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'Persona with empty modules',
        semantic: 'Test',
        modules: [],
      };

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path === 'modules')).toBe(true);
      expect(result.errors.some(e => e.message.includes('at least one'))).toBe(
        true
      );
    });

    it('should reject persona with non-array modules', () => {
      const invalidPersona = {
        name: 'Invalid Modules Type',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'Test',
        semantic: 'Test',
        modules: 'not-an-array',
      } as unknown as Persona;

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject module entry with invalid structure', () => {
      const invalidPersona = {
        name: 'Invalid Entry',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'Test',
        semantic: 'Test',
        modules: [
          123, // Invalid: not string or object
          'foundation/logic/deductive-reasoning', // Valid
        ],
      } as unknown as Persona;

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path?.includes('modules[0]'))).toBe(
        true
      );
    });

    it('should reject grouped module with empty ids array', () => {
      const invalidPersona: Persona = {
        name: 'Empty IDs',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'Test',
        semantic: 'Test',
        modules: [
          { group: 'Test Group', ids: [] }, // Empty ids array
        ],
      };

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path?.includes('ids'))).toBe(true);
      expect(result.errors.some(e => e.message.includes('non-empty'))).toBe(
        true
      );
    });

    it('should reject grouped module without ids array', () => {
      const invalidPersona = {
        name: 'Missing IDs',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'Test',
        semantic: 'Test',
        modules: [
          { group: 'Test Group' }, // Missing ids
        ],
      } as unknown as Persona;

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path?.includes('ids'))).toBe(true);
    });

    it('should reject duplicate module IDs', () => {
      const invalidPersona: Persona = {
        name: 'Duplicate Modules',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'Test',
        semantic: 'Test',
        modules: [
          'foundation/logic/deductive-reasoning',
          'principle/architecture/separation-of-concerns',
          'foundation/logic/deductive-reasoning', // Duplicate!
        ],
      };

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(
        result.errors.some(e => e.message.includes('Duplicate module ID'))
      ).toBe(true);
    });

    it('should reject duplicate module IDs in grouped entries', () => {
      const invalidPersona: Persona = {
        name: 'Duplicate in Groups',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'Test',
        semantic: 'Test',
        modules: [
          {
            group: 'Test Group',
            ids: [
              'foundation/logic/deductive-reasoning',
              'foundation/logic/deductive-reasoning', // Duplicate within group
            ],
          },
        ],
      };

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(
        result.errors.some(e => e.message.includes('Duplicate module ID'))
      ).toBe(true);
    });

    it('should reject duplicate module IDs across different entries', () => {
      const invalidPersona: Persona = {
        name: 'Duplicate Across Entries',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'Test',
        semantic: 'Test',
        modules: [
          'foundation/logic/deductive-reasoning',
          {
            group: 'Test Group',
            ids: ['foundation/logic/deductive-reasoning'], // Duplicate from above
          },
        ],
      };

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(
        result.errors.some(e => e.message.includes('Duplicate module ID'))
      ).toBe(true);
    });

    it('should reject non-string module IDs', () => {
      const invalidPersona = {
        name: 'Non-String IDs',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'Test',
        semantic: 'Test',
        modules: [
          {
            group: 'Test Group',
            ids: [
              'foundation/logic/deductive-reasoning', // Valid
              123, // Invalid: number
              { id: 'not-a-string' }, // Invalid: object
            ],
          },
        ],
      } as unknown as Persona;

      const result = validatePersona(invalidPersona);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.path?.includes('ids'))).toBe(true);
      expect(result.errors.some(e => e.message.includes('string'))).toBe(true);
    });

    it('should allow optional identity field', () => {
      const validPersona: Persona = {
        name: 'No Identity',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'Persona without identity',
        semantic: 'Test',
        modules: ['foundation/logic/deductive-reasoning'],
      };

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should allow empty identity string', () => {
      const validPersona: Persona = {
        name: 'Empty Identity',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'Persona with empty identity',
        semantic: 'Test',
        identity: '',
        modules: ['foundation/logic/deductive-reasoning'],
      };

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should allow optional attribution field', () => {
      const validPersona: Persona = {
        name: 'No Attribution',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'Persona without attribution',
        semantic: 'Test',
        modules: ['foundation/logic/deductive-reasoning'],
      };

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate attribution as boolean', () => {
      const validWithAttribution: Persona = {
        name: 'With Attribution',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'Persona with attribution',
        semantic: 'Test',
        attribution: true,
        modules: ['foundation/logic/deductive-reasoning'],
      };

      const result = validatePersona(validWithAttribution);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should allow optional tags array', () => {
      const validPersona: Persona = {
        name: 'With Tags',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'Persona with tags',
        semantic: 'Test',
        tags: ['engineering', 'code-quality'],
        modules: ['foundation/logic/deductive-reasoning'],
      };

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should allow optional domains array', () => {
      const validPersona: Persona = {
        name: 'With Domains',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'Persona with domains',
        semantic: 'Test',
        domains: ['software-development', 'devops'],
        modules: ['foundation/logic/deductive-reasoning'],
      };

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate grouped modules with optional group name', () => {
      const validPersona: Persona = {
        name: 'No Group Name',
        version: '1.0.0',
        schemaVersion: '2.0',
        description: 'Grouped modules without group name',
        semantic: 'Test',
        modules: [
          { ids: ['foundation/logic/deductive-reasoning'] }, // No group field
        ],
      };

      const result = validatePersona(validPersona);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
