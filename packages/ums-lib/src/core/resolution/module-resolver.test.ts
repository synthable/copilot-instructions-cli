/**
 * Tests for UMS v1.0 Module Resolution - Pure Functions
 */

import { describe, it, expect } from 'vitest';
import {
  resolveModules,
  resolveImplementations,
  validateModuleReferences,
  createModuleRegistry,
  resolvePersonaModules,
} from './module-resolver.js';
import type { UMSModule, UMSPersona } from '../../types/index.js';

// Mock modules for testing
const mockModule1: UMSModule = {
  id: 'foundation/logic/deductive-reasoning',
  version: '1.0',
  schemaVersion: '1.0',
  shape: 'specification',
  meta: {
    name: 'Deductive Reasoning',
    description: 'Logical deduction principles',
    semantic: 'Logic and reasoning framework',
  },
  body: {
    goal: 'Apply deductive reasoning principles',
  },
};

const mockModule2: UMSModule = {
  id: 'technology/react/hooks',
  version: '1.0',
  schemaVersion: '1.0',
  shape: 'procedure',
  meta: {
    name: 'React Hooks',
    description: 'React hooks best practices',
    semantic: 'Frontend development patterns',
    deprecated: true,
    replacedBy: 'technology/react/modern-hooks',
  },
  body: {
    process: ['Use useState for state', 'Use useEffect for side effects'],
  },
};

const mockModule3: UMSModule = {
  id: 'principle/quality/testing',
  version: '1.0',
  schemaVersion: '1.0',
  shape: 'pattern',
  meta: {
    name: 'Testing Principles',
    description: 'Software testing best practices',
    semantic: 'Quality assurance methodology',
  },
  body: {
    principles: [
      'Write tests first',
      'Test edge cases',
      'Maintain test coverage',
    ],
  },
};

const mockPersona: UMSPersona = {
  name: 'Test Persona',
  version: '1.0',
  schemaVersion: '1.0',
  description: 'A test persona',
  semantic: 'Testing framework',
  identity: 'I am a test persona',
  attribution: false,
  moduleGroups: [
    {
      groupName: 'Foundation',
      modules: ['foundation/logic/deductive-reasoning'],
    },
    {
      groupName: 'Technology',
      modules: ['technology/react/hooks', 'principle/quality/testing'],
    },
  ],
};

describe('resolver', () => {
  describe('createModuleRegistry', () => {
    it('should create a registry map from modules array', () => {
      const modules = [mockModule1, mockModule2, mockModule3];
      const registry = createModuleRegistry(modules);

      expect(registry.size).toBe(3);
      expect(registry.get('foundation/logic/deductive-reasoning')).toEqual(
        mockModule1
      );
      expect(registry.get('technology/react/hooks')).toEqual(mockModule2);
      expect(registry.get('principle/quality/testing')).toEqual(mockModule3);
    });

    it('should handle empty modules array', () => {
      const registry = createModuleRegistry([]);
      expect(registry.size).toBe(0);
    });
  });

  describe('resolveModules', () => {
    it('should resolve modules from persona module groups', () => {
      const modules = [mockModule1, mockModule2, mockModule3];
      const registry = createModuleRegistry(modules);

      const result = resolveModules(mockPersona.moduleGroups, registry);

      expect(result.modules).toHaveLength(3);
      expect(result.modules[0]).toEqual(mockModule1);
      expect(result.modules[1]).toEqual(mockModule2);
      expect(result.modules[2]).toEqual(mockModule3);
      expect(result.missingModules).toEqual([]);
    });

    it('should track missing modules', () => {
      const modules = [mockModule1]; // Missing mockModule2 and mockModule3
      const registry = createModuleRegistry(modules);

      const result = resolveModules(mockPersona.moduleGroups, registry);

      expect(result.modules).toHaveLength(1);
      expect(result.modules[0]).toEqual(mockModule1);
      expect(result.missingModules).toEqual([
        'technology/react/hooks',
        'principle/quality/testing',
      ]);
    });

    it('should generate deprecation warnings', () => {
      const modules = [mockModule1, mockModule2, mockModule3];
      const registry = createModuleRegistry(modules);

      const result = resolveModules(mockPersona.moduleGroups, registry);

      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('deprecated');
      expect(result.warnings[0]).toContain('technology/react/modern-hooks');
    });
  });

  describe('resolveImplementations', () => {
    it('should return modules as-is (placeholder implementation)', () => {
      const modules = [mockModule1, mockModule2, mockModule3];
      const registry = createModuleRegistry(modules);

      const result = resolveImplementations(modules, registry);

      expect(result).toEqual(modules);
    });
  });

  describe('validateModuleReferences', () => {
    it('should validate that all referenced modules exist', () => {
      const modules = [mockModule1, mockModule2, mockModule3];
      const registry = createModuleRegistry(modules);

      const result = validateModuleReferences(mockPersona, registry);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should report missing module references', () => {
      const modules = [mockModule1]; // Missing other modules
      const registry = createModuleRegistry(modules);

      const result = validateModuleReferences(mockPersona, registry);

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors[0].message).toContain('technology/react/hooks');
      expect(result.errors[1].message).toContain('principle/quality/testing');
    });
  });

  describe('resolvePersonaModules', () => {
    it('should resolve all modules for a persona', () => {
      const modules = [mockModule1, mockModule2, mockModule3];

      const result = resolvePersonaModules(mockPersona, modules);

      expect(result.modules).toHaveLength(3);
      expect(result.missingModules).toEqual([]);
      expect(result.warnings).toHaveLength(1); // Deprecation warning
    });

    it('should handle missing modules in persona resolution', () => {
      const modules = [mockModule1]; // Missing other modules

      const result = resolvePersonaModules(mockPersona, modules);

      expect(result.modules).toHaveLength(1);
      expect(result.missingModules).toEqual([
        'technology/react/hooks',
        'principle/quality/testing',
      ]);
    });
  });
});
