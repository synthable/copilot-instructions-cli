/**
 * Tests for ModuleRegistry
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ModuleRegistry } from './module-registry.js';
import { ConflictError } from '../../utils/errors.js';
import type {
  Module,
  ModuleSource,
  ConflictStrategy,
} from '../../types/index.js';

describe('ModuleRegistry', () => {
  let registry: ModuleRegistry;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  // Mock modules for testing
  const mockModule1: Module = {
    id: 'foundation/logic/reasoning',
    version: '1.0.0',
    schemaVersion: '2.0',
    capabilities: ['reasoning', 'logic'],
    metadata: {
      name: 'Reasoning Framework',
      description: 'A framework for logical reasoning',
      semantic: 'logical reasoning cognitive framework',
    },
  };

  const mockModule2: Module = {
    id: 'foundation/logic/reasoning',
    version: '2.0.0',
    schemaVersion: '2.0',
    capabilities: ['reasoning', 'logic', 'advanced'],
    metadata: {
      name: 'Advanced Reasoning Framework',
      description: 'An advanced framework for logical reasoning',
      semantic: 'advanced logical reasoning cognitive framework',
    },
  };

  const mockModule3: Module = {
    id: 'principle/design/modularity',
    version: '1.0.0',
    schemaVersion: '2.0',
    capabilities: ['design', 'modularity'],
    metadata: {
      name: 'Modularity Pattern',
      description: 'Design pattern for modular systems',
      semantic: 'modularity design pattern architecture',
    },
  };

  const standardSource: ModuleSource = {
    type: 'standard',
    path: 'std/foundation/logic',
  };

  const localSource: ModuleSource = {
    type: 'local',
    path: './custom/modules',
  };

  beforeEach(() => {
    registry = new ModuleRegistry();
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('constructor', () => {
    it('should create registry with default "error" strategy', () => {
      const reg = new ModuleRegistry();
      expect(reg).toBeInstanceOf(ModuleRegistry);
    });

    it('should create registry with custom default strategy', () => {
      const reg = new ModuleRegistry('warn');
      expect(reg).toBeInstanceOf(ModuleRegistry);
    });
  });

  describe('add and basic operations', () => {
    it('should add a single module', () => {
      registry.add(mockModule1, standardSource);
      expect(registry.has('foundation/logic/reasoning')).toBe(true);
      expect(registry.size()).toBe(1);
    });

    it('should add multiple modules with different IDs', () => {
      registry.add(mockModule1, standardSource);
      registry.add(mockModule3, standardSource);
      expect(registry.size()).toBe(2);
      expect(registry.has('foundation/logic/reasoning')).toBe(true);
      expect(registry.has('principle/design/modularity')).toBe(true);
    });

    it('should allow multiple modules with same ID (conflicts)', () => {
      registry.add(mockModule1, standardSource);
      registry.add(mockModule2, localSource);
      expect(registry.size()).toBe(1); // Same ID, so size is 1
      expect(registry.has('foundation/logic/reasoning')).toBe(true);
    });

    it('should return false for non-existent modules', () => {
      expect(registry.has('non/existent/module')).toBe(false);
    });
  });

  describe('addAll', () => {
    it('should add multiple modules at once', () => {
      registry.addAll([mockModule1, mockModule3], standardSource);
      expect(registry.size()).toBe(2);
      expect(registry.has('foundation/logic/reasoning')).toBe(true);
      expect(registry.has('principle/design/modularity')).toBe(true);
    });

    it('should add empty array without error', () => {
      registry.addAll([], standardSource);
      expect(registry.size()).toBe(0);
    });
  });

  describe('resolve without conflicts', () => {
    beforeEach(() => {
      registry.add(mockModule1, standardSource);
      registry.add(mockModule3, standardSource);
    });

    it('should resolve existing module', () => {
      const resolved = registry.resolve('foundation/logic/reasoning');
      expect(resolved).toBe(mockModule1);
    });

    it('should return null for non-existent module', () => {
      const resolved = registry.resolve('non/existent/module');
      expect(resolved).toBeNull();
    });
  });

  describe('conflict detection', () => {
    beforeEach(() => {
      registry.add(mockModule1, standardSource);
      registry.add(mockModule2, localSource);
      registry.add(mockModule3, standardSource);
    });

    it('should detect conflicts correctly', () => {
      const conflicts = registry.getConflicts('foundation/logic/reasoning');
      expect(conflicts).toHaveLength(2);
      expect(conflicts?.[0]?.module).toBe(mockModule1);
      expect(conflicts?.[1]?.module).toBe(mockModule2);
    });

    it('should return null for non-conflicting modules', () => {
      const conflicts = registry.getConflicts('principle/design/modularity');
      expect(conflicts).toBeNull();
    });

    it('should return conflicting IDs', () => {
      const conflictingIds = registry.getConflictingIds();
      expect(conflictingIds).toEqual(['foundation/logic/reasoning']);
    });
  });

  describe('conflict resolution strategies', () => {
    beforeEach(() => {
      registry.add(mockModule1, standardSource);
      registry.add(mockModule2, localSource);
    });

    describe('error strategy', () => {
      it('should throw ConflictError by default', () => {
        expect(() => registry.resolve('foundation/logic/reasoning')).toThrow(
          ConflictError
        );
      });

      it('should throw ConflictError when explicitly specified', () => {
        expect(() =>
          registry.resolve('foundation/logic/reasoning', 'error')
        ).toThrow(ConflictError);
      });

      it('should include module ID and conflict count in error', () => {
        try {
          registry.resolve('foundation/logic/reasoning', 'error');
          expect.fail('Should have thrown ConflictError');
        } catch (error) {
          expect(error).toBeInstanceOf(ConflictError);
          const conflictError = error as ConflictError;
          expect(conflictError.moduleId).toBe('foundation/logic/reasoning');
          expect(conflictError.conflictCount).toBe(2);
        }
      });
    });

    describe('warn strategy', () => {
      it('should resolve to first module silently', () => {
        const resolved = registry.resolve('foundation/logic/reasoning', 'warn');
        expect(resolved).toBe(mockModule1);
        expect(consoleWarnSpy).not.toHaveBeenCalled();
      });

      it('should allow caller to inspect conflicts separately', () => {
        const resolved = registry.resolve('foundation/logic/reasoning', 'warn');
        expect(resolved).toBe(mockModule1);

        // Caller can check for conflicts if they want to handle warnings
        const conflicts = registry.getConflicts('foundation/logic/reasoning');
        expect(conflicts).toHaveLength(2);
        expect(conflicts?.[0]?.module).toBe(mockModule1);
        expect(conflicts?.[1]?.module).toBe(mockModule2);
      });
    });

    describe('replace strategy', () => {
      it('should resolve to last added module', () => {
        const resolved = registry.resolve(
          'foundation/logic/reasoning',
          'replace'
        );
        expect(resolved).toBe(mockModule2); // Last added
      });
    });

    it('should throw error for unknown strategy', () => {
      expect(() =>
        registry.resolve(
          'foundation/logic/reasoning',
          'unknown' as ConflictStrategy
        )
      ).toThrow('Unknown conflict strategy: unknown');
    });
  });

  describe('resolveAll', () => {
    beforeEach(() => {
      registry.add(mockModule1, standardSource);
      registry.add(mockModule2, localSource); // Conflict with mockModule1
      registry.add(mockModule3, standardSource);
    });

    it('should resolve all modules with replace strategy', () => {
      const resolved = registry.resolveAll('replace');
      expect(resolved.size).toBe(2);
      expect(resolved.get('foundation/logic/reasoning')).toBe(mockModule2);
      expect(resolved.get('principle/design/modularity')).toBe(mockModule3);
    });

    it('should resolve all modules with warn strategy', () => {
      const resolved = registry.resolveAll('warn');
      expect(resolved.size).toBe(2);
      expect(resolved.get('foundation/logic/reasoning')).toBe(mockModule1);
      expect(resolved.get('principle/design/modularity')).toBe(mockModule3);
    });

    it('should throw on error strategy with conflicts', () => {
      expect(() => registry.resolveAll('error')).toThrow(ConflictError);
    });
  });

  describe('getAllEntries', () => {
    it('should return all entries', () => {
      registry.add(mockModule1, standardSource);
      registry.add(mockModule2, localSource);

      const entries = registry.getAllEntries();
      expect(entries.size).toBe(1);
      expect(entries.get('foundation/logic/reasoning')).toHaveLength(2);
    });

    it('should return copy of internal state', () => {
      registry.add(mockModule1, standardSource);
      const entries = registry.getAllEntries();

      // Modifying returned entries should not affect registry
      entries.clear();
      expect(registry.size()).toBe(1);
    });
  });

  describe('getSourceSummary', () => {
    it('should return source summary', () => {
      registry.add(mockModule1, standardSource);
      registry.add(mockModule2, localSource);
      registry.add(mockModule3, standardSource);

      const summary = registry.getSourceSummary();
      expect(summary['standard:std/foundation/logic']).toBe(2);
      expect(summary['local:./custom/modules']).toBe(1);
    });

    it('should return empty summary for empty registry', () => {
      const summary = registry.getSourceSummary();
      expect(summary).toEqual({});
    });
  });

  describe('default strategy behavior', () => {
    it('should use custom default strategy', () => {
      const warnRegistry = new ModuleRegistry('warn');
      warnRegistry.add(mockModule1, standardSource);
      warnRegistry.add(mockModule2, localSource);

      const resolved = warnRegistry.resolve('foundation/logic/reasoning');
      expect(resolved).toBe(mockModule1);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should override default strategy with explicit parameter', () => {
      const warnRegistry = new ModuleRegistry('warn');
      warnRegistry.add(mockModule1, standardSource);
      warnRegistry.add(mockModule2, localSource);

      const resolved = warnRegistry.resolve(
        'foundation/logic/reasoning',
        'replace'
      );
      expect(resolved).toBe(mockModule2);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle empty registry', () => {
      expect(registry.size()).toBe(0);
      expect(registry.getConflictingIds()).toEqual([]);
      expect(registry.resolve('any/module')).toBeNull();
    });

    it('should track addedAt timestamp', () => {
      const before = Date.now();
      registry.add(mockModule1, standardSource);
      const after = Date.now();

      const entries = registry
        .getAllEntries()
        .get('foundation/logic/reasoning');
      expect(entries).toBeDefined();
      expect(entries?.[0]?.addedAt).toBeGreaterThanOrEqual(before);
      expect(entries?.[0]?.addedAt).toBeLessThanOrEqual(after);
    });
  });
});
