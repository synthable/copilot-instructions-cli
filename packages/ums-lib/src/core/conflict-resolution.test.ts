import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { glob } from 'glob';
import { parse } from 'yaml';
import { ModuleRegistry } from './build-engine.js';
import { loadModule } from './module-loader.js';
import type { ModuleConfig, UMSModule } from '../types/index.js';

// Mock file system and dependencies
vi.mock('fs', () => ({
  existsSync: vi.fn(),
}));

vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
}));

vi.mock('glob', () => ({
  glob: vi.fn(),
}));

vi.mock('yaml', () => ({
  parse: vi.fn(),
}));

vi.mock('./module-loader.js', () => ({
  loadModule: vi.fn(),
}));

const mockExistsSync = vi.mocked(existsSync);
const mockReadFile = vi.mocked(readFile);
const mockGlob = vi.mocked(glob);
const mockYamlParse = vi.mocked(parse);
const mockLoadModule = vi.mocked(loadModule);

// Helper to create test modules
function createTestModule(
  id: string,
  name = 'Test Module',
  filePath = `/modules/${id.replace(/\//g, '-')}.module.yml`
): UMSModule {
  return {
    id,
    version: '1.0.0',
    schemaVersion: '1.0',
    shape: 'procedure',
    meta: {
      name,
      description: `Test module ${name}`,
      semantic: `Keywords for ${name}`,
    },
    body: {
      goal: 'Test goal',
    },
    filePath,
  };
}

// Helper to create module config
function createModuleConfig(
  localModulePaths: ModuleConfig['localModulePaths']
): ModuleConfig {
  return {
    localModulePaths,
  };
}

describe('ModuleRegistry Conflict Resolution', () => {
  let registry: ModuleRegistry;

  beforeEach(() => {
    vi.clearAllMocks();
    registry = new ModuleRegistry();

    // Default mocks
    mockExistsSync.mockReturnValue(false);
    mockReadFile.mockResolvedValue('');
    mockGlob.mockResolvedValue([]);
    mockYamlParse.mockReturnValue({});
    mockLoadModule.mockResolvedValue(
      createTestModule('foundation/test/default')
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Error Strategy Testing', () => {
    // NOTE: Current implementation catches errors and converts them to warnings
    // This is a gap in the UMS v1.0 implementation that should be addressed
    it('should convert error strategy conflicts to warnings (current behavior)', async () => {
      const config = createModuleConfig([
        { path: 'modules/set1', onConflict: 'error' },
        { path: 'modules/set2', onConflict: 'error' },
      ]);

      const duplicateModule = createTestModule('foundation/logic/reasoning');

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue(
        'localModulePaths:\n  - path: modules/set1\n    onConflict: error'
      );
      mockYamlParse.mockReturnValue(config);

      // Mock glob to return files from both paths with same module ID
      mockGlob
        .mockResolvedValueOnce([
          'modules/set1/foundation-logic-reasoning.module.yml',
        ])
        .mockResolvedValueOnce([
          'modules/set2/foundation-logic-reasoning.module.yml',
        ]);

      // Mock loadModule to return the same module ID from both paths
      mockLoadModule.mockResolvedValue(duplicateModule);

      // Current implementation doesn't throw, just warns
      await registry.discover();

      const warnings = registry.getWarnings();
      expect(
        warnings.some(
          w =>
            w.includes("Duplicate module ID 'foundation/logic/reasoning'") &&
            w.includes('modules/set2')
        )
      ).toBe(true);
    });

    it('should provide clear error messages in warnings for conflicts', async () => {
      const config = createModuleConfig([
        { path: 'first/path' }, // onConflict defaults to 'error'
        { path: 'second/path' },
      ]);

      const conflictingModule = createTestModule(
        'principle/solid/srp',
        'Single Responsibility Principle'
      );

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue(JSON.stringify(config));
      mockYamlParse.mockReturnValue(config);
      mockGlob
        .mockResolvedValueOnce(['first/path/principle-solid-srp.module.yml'])
        .mockResolvedValueOnce(['second/path/principle-solid-srp.module.yml']);
      mockLoadModule.mockResolvedValue(conflictingModule);

      await registry.discover();

      const warnings = registry.getWarnings();
      const errorWarning = warnings.find(w =>
        w.includes('principle/solid/srp')
      );
      expect(errorWarning).toBeDefined();
      expect(errorWarning).toContain('second/path');
      expect(errorWarning).toContain('Duplicate module ID');
    });

    it('should continue processing after error strategy conflicts (current behavior)', async () => {
      const config = createModuleConfig([
        { path: 'modules/path1', onConflict: 'error' },
        { path: 'modules/path2', onConflict: 'error' },
        { path: 'modules/path3', onConflict: 'error' },
      ]);

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(config);

      // First two paths have conflicting modules, third has unique
      mockGlob
        .mockResolvedValueOnce(['modules/path1/test.module.yml'])
        .mockResolvedValueOnce(['modules/path2/test.module.yml'])
        .mockResolvedValueOnce(['modules/path3/unique.module.yml']);

      mockLoadModule
        .mockResolvedValueOnce(createTestModule('foundation/test/conflict'))
        .mockResolvedValueOnce(createTestModule('foundation/test/conflict'))
        .mockResolvedValueOnce(createTestModule('foundation/test/unique'));

      await registry.discover();

      // All three globs should be called (doesn't fail fast)
      expect(mockGlob).toHaveBeenCalledTimes(3);

      // Should have both modules registered
      expect(registry.resolve('foundation/test/conflict')).toBeDefined();
      expect(registry.resolve('foundation/test/unique')).toBeDefined();
      expect(registry.size()).toBe(2);
    });
  });

  describe('Replace Strategy Testing', () => {
    it('should replace earlier modules with later ones using replace strategy', async () => {
      const config = createModuleConfig([
        { path: 'modules/v1', onConflict: 'replace' },
        { path: 'modules/v2', onConflict: 'replace' },
      ]);

      const moduleV1 = createTestModule(
        'foundation/logic/reasoning',
        'Logic V1',
        'modules/v1/logic.module.yml'
      );
      const moduleV2 = createTestModule(
        'foundation/logic/reasoning',
        'Logic V2',
        'modules/v2/logic.module.yml'
      );

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(config);
      mockGlob
        .mockResolvedValueOnce(['modules/v1/logic.module.yml'])
        .mockResolvedValueOnce(['modules/v2/logic.module.yml']);

      mockLoadModule
        .mockResolvedValueOnce(moduleV1)
        .mockResolvedValueOnce(moduleV2);

      await registry.discover();

      // Should resolve to the later (v2) version
      const resolvedPath = registry.resolve('foundation/logic/reasoning');
      expect(resolvedPath).toBe('modules/v2/logic.module.yml');

      // Should have a warning about replacement
      const warnings = registry.getWarnings();
      expect(warnings).toContainEqual(
        expect.stringContaining(
          "Duplicate module ID 'foundation/logic/reasoning' in path 'modules/v2' - replacing previous entry"
        )
      );
    });

    it('should handle multiple replacements in sequence', async () => {
      const config = createModuleConfig([
        { path: 'modules/original', onConflict: 'replace' },
        { path: 'modules/update1', onConflict: 'replace' },
        { path: 'modules/update2', onConflict: 'replace' },
        { path: 'modules/final', onConflict: 'replace' },
      ]);

      const moduleId = 'technology/javascript/async';
      const modules = [
        createTestModule(
          moduleId,
          'Async Original',
          'modules/original/async.module.yml'
        ),
        createTestModule(
          moduleId,
          'Async Update 1',
          'modules/update1/async.module.yml'
        ),
        createTestModule(
          moduleId,
          'Async Update 2',
          'modules/update2/async.module.yml'
        ),
        createTestModule(
          moduleId,
          'Async Final',
          'modules/final/async.module.yml'
        ),
      ];

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(config);

      mockGlob
        .mockResolvedValueOnce(['modules/original/async.module.yml'])
        .mockResolvedValueOnce(['modules/update1/async.module.yml'])
        .mockResolvedValueOnce(['modules/update2/async.module.yml'])
        .mockResolvedValueOnce(['modules/final/async.module.yml']);

      mockLoadModule
        .mockResolvedValueOnce(modules[0])
        .mockResolvedValueOnce(modules[1])
        .mockResolvedValueOnce(modules[2])
        .mockResolvedValueOnce(modules[3]);

      await registry.discover();

      // Should resolve to the final version
      expect(registry.resolve(moduleId)).toBe('modules/final/async.module.yml');

      // Should have 3 replacement warnings
      const warnings = registry.getWarnings();
      const replacementWarnings = warnings.filter(w =>
        w.includes('replacing previous entry')
      );
      expect(replacementWarnings).toHaveLength(3);
    });

    it('should completely replace module metadata with replace strategy', async () => {
      const config = createModuleConfig([
        { path: 'modules/old', onConflict: 'replace' },
        { path: 'modules/new', onConflict: 'replace' },
      ]);

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(config);
      mockGlob
        .mockResolvedValueOnce(['modules/old/test.module.yml'])
        .mockResolvedValueOnce(['modules/new/test.module.yml']);

      mockLoadModule
        .mockResolvedValueOnce(
          createTestModule('foundation/test/replace', 'Old Version')
        )
        .mockResolvedValueOnce(
          createTestModule('foundation/test/replace', 'New Version')
        );

      await registry.discover();

      // Registry should only contain one entry for the module
      const allModuleIds = registry.getAllModuleIds();
      expect(
        allModuleIds.filter(id => id === 'foundation/test/replace')
      ).toHaveLength(1);
      expect(registry.size()).toBe(1);
    });
  });

  describe('Warn Strategy Testing', () => {
    it('should keep first module and warn with warn strategy', async () => {
      const config = createModuleConfig([
        { path: 'modules/first', onConflict: 'warn' },
        { path: 'modules/second', onConflict: 'warn' },
      ]);

      const firstModule = createTestModule(
        'execution/debugging/systematic',
        'First Debug',
        'modules/first/debug.module.yml'
      );
      const secondModule = createTestModule(
        'execution/debugging/systematic',
        'Second Debug',
        'modules/second/debug.module.yml'
      );

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(config);
      mockGlob
        .mockResolvedValueOnce(['modules/first/debug.module.yml'])
        .mockResolvedValueOnce(['modules/second/debug.module.yml']);

      mockLoadModule
        .mockResolvedValueOnce(firstModule)
        .mockResolvedValueOnce(secondModule);

      await registry.discover();

      // Should resolve to the first version
      expect(registry.resolve('execution/debugging/systematic')).toBe(
        'modules/first/debug.module.yml'
      );

      // Should have a warning about using first entry
      const warnings = registry.getWarnings();
      expect(warnings).toContainEqual(
        expect.stringContaining(
          "Duplicate module ID 'execution/debugging/systematic' in path 'modules/second' - using first entry"
        )
      );
    });

    it('should continue build after warnings with warn strategy', async () => {
      const config = createModuleConfig([
        { path: 'modules/set1', onConflict: 'warn' },
        { path: 'modules/set2', onConflict: 'warn' },
        { path: 'modules/set3', onConflict: 'warn' },
      ]);

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(config);

      // All paths return the same module ID (conflict)
      mockGlob
        .mockResolvedValueOnce(['modules/set1/common.module.yml'])
        .mockResolvedValueOnce(['modules/set2/common.module.yml'])
        .mockResolvedValueOnce(['modules/set3/common.module.yml']);

      mockLoadModule.mockResolvedValue(
        createTestModule('foundation/common/module')
      );

      // Should not throw
      await expect(registry.discover()).resolves.not.toThrow();

      // Should still have the module registered
      expect(registry.resolve('foundation/common/module')).toBeDefined();
      expect(registry.size()).toBe(1);

      // Should have warnings for the conflicts
      const warnings = registry.getWarnings();
      const conflictWarnings = warnings.filter(w =>
        w.includes('using first entry')
      );
      expect(conflictWarnings).toHaveLength(2); // Second and third paths should warn
    });

    it('should display clear warning messages with warn strategy', async () => {
      const config = createModuleConfig([
        { path: 'primary/modules' }, // Defaults to 'error', but we'll override in test
        { path: 'secondary/modules', onConflict: 'warn' },
      ]);

      // Override the first path to also use warn strategy
      config.localModulePaths[0].onConflict = 'warn';

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(config);
      mockGlob
        .mockResolvedValueOnce(['primary/modules/test.module.yml'])
        .mockResolvedValueOnce(['secondary/modules/test.module.yml']);

      mockLoadModule.mockResolvedValue(
        createTestModule('principle/patterns/observer')
      );

      await registry.discover();

      const warnings = registry.getWarnings();
      const warning = warnings.find(w => w.includes('using first entry'));
      expect(warning).toContain('principle/patterns/observer');
      expect(warning).toContain('secondary/modules');
      expect(warning).toContain('using first entry');
    });
  });

  describe('Nested Conflict Resolution', () => {
    it('should handle conflicts across multiple config levels', async () => {
      const config = createModuleConfig([
        { path: 'level1/foundation', onConflict: 'replace' },
        { path: 'level1/overrides', onConflict: 'warn' },
        { path: 'level2/foundation', onConflict: 'replace' },
        { path: 'level2/overrides', onConflict: 'error' },
      ]);

      const commonModuleId = 'foundation/ethics/core';

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(config);

      // Only first three paths have the conflicting module
      mockGlob
        .mockResolvedValueOnce([
          `level1/foundation/${commonModuleId.replace(/\//g, '-')}.module.yml`,
        ])
        .mockResolvedValueOnce([
          `level1/overrides/${commonModuleId.replace(/\//g, '-')}.module.yml`,
        ])
        .mockResolvedValueOnce([
          `level2/foundation/${commonModuleId.replace(/\//g, '-')}.module.yml`,
        ])
        .mockResolvedValueOnce([]); // Fourth path has no conflicting modules

      mockLoadModule.mockResolvedValue(createTestModule(commonModuleId));

      await registry.discover();

      // Should resolve to level2/foundation (last replace strategy wins over warn)
      expect(registry.resolve(commonModuleId)).toContain('level2/foundation');

      // Should have appropriate warnings
      const warnings = registry.getWarnings();
      expect(warnings.some(w => w.includes('using first entry'))).toBe(true);
      expect(warnings.some(w => w.includes('replacing previous entry'))).toBe(
        true
      );
    });

    it('should process paths in order for nested conflicts', async () => {
      const config = createModuleConfig([
        { path: 'base/modules', onConflict: 'replace' },
        { path: 'team/modules', onConflict: 'warn' },
        { path: 'project/modules', onConflict: 'replace' },
        { path: 'local/modules', onConflict: 'warn' },
      ]);

      const moduleId = 'technology/react/hooks';

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(config);

      // All paths have the same module
      mockGlob
        .mockResolvedValueOnce(['base/modules/react-hooks.module.yml'])
        .mockResolvedValueOnce(['team/modules/react-hooks.module.yml'])
        .mockResolvedValueOnce(['project/modules/react-hooks.module.yml'])
        .mockResolvedValueOnce(['local/modules/react-hooks.module.yml']);

      mockLoadModule.mockResolvedValue(createTestModule(moduleId));

      await registry.discover();

      // Final resolution should be project/modules (last replace wins)
      expect(registry.resolve(moduleId)).toBe(
        'project/modules/react-hooks.module.yml'
      );

      const warnings = registry.getWarnings();
      // Should have warn from team (using first), replace from project, and warn from local (using first)
      expect(
        warnings.filter(w => w.includes('using first entry'))
      ).toHaveLength(2);
      expect(
        warnings.filter(w => w.includes('replacing previous entry'))
      ).toHaveLength(1);
    });

    it('should handle empty paths in nested configs', async () => {
      const config = createModuleConfig([
        { path: 'modules/existing', onConflict: 'replace' },
        { path: 'modules/empty', onConflict: 'warn' },
        { path: 'modules/more', onConflict: 'error' },
      ]);

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(config);

      // Only first and third paths have modules
      mockGlob
        .mockResolvedValueOnce(['modules/existing/test.module.yml'])
        .mockResolvedValueOnce([]) // Empty path
        .mockResolvedValueOnce(['modules/more/different.module.yml']);

      mockLoadModule
        .mockResolvedValueOnce(createTestModule('foundation/test/one'))
        .mockResolvedValueOnce(createTestModule('foundation/test/two'));

      await registry.discover();

      // Should have both modules
      expect(registry.size()).toBe(2);
      expect(registry.resolve('foundation/test/one')).toBeDefined();
      expect(registry.resolve('foundation/test/two')).toBeDefined();
    });
  });

  describe('Performance Testing', () => {
    it('should handle large numbers of conflicts efficiently', async () => {
      const numPaths = 100;
      const numModulesPerPath = 10;
      const conflictingModuleId = 'performance/test/conflict';

      const config = createModuleConfig(
        Array.from({ length: numPaths }, (_, i) => ({
          path: `modules/path${i}`,
          onConflict: 'replace' as const,
        }))
      );

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(config);

      // Each path returns multiple modules, with one conflicting module
      for (let i = 0; i < numPaths; i++) {
        const files = Array.from(
          { length: numModulesPerPath },
          (_, j) => `modules/path${i}/module${j}.module.yml`
        );
        mockGlob.mockResolvedValueOnce(files);
      }

      // Mock loadModule to return unique modules except for one conflicting ID
      mockLoadModule.mockImplementation(async (filePath: string) => {
        if (filePath.includes('module0')) {
          return Promise.resolve(createTestModule(conflictingModuleId));
        }
        // Create unique module IDs for non-conflicting modules
        const pathMatch = /path(\d+).*module(\d+)/.exec(filePath);
        const pathNum = pathMatch?.[1] ?? '0';
        const moduleNum = pathMatch?.[2] ?? '0';
        return Promise.resolve(
          createTestModule(`performance/test/unique-${pathNum}-${moduleNum}`)
        );
      });

      const startTime = Date.now();
      await registry.discover();
      const duration = Date.now() - startTime;

      // Should complete within reasonable time (less than 1 second for mocked operations)
      expect(duration).toBeLessThan(1000);

      // Should have resolved the conflicting module to the last path
      expect(registry.resolve(conflictingModuleId)).toContain('path99');

      // Should have appropriate number of replacement warnings
      const warnings = registry.getWarnings();
      const replacementWarnings = warnings.filter(w =>
        w.includes('replacing previous entry')
      );
      expect(replacementWarnings).toHaveLength(numPaths - 1); // All but first should generate warnings
    });

    it('should not significantly slow down with complex conflict strategies', async () => {
      const complexConfig = createModuleConfig([
        { path: 'base', onConflict: 'error' },
        { path: 'team1', onConflict: 'warn' },
        { path: 'team2', onConflict: 'replace' },
        { path: 'team3', onConflict: 'warn' },
        { path: 'project', onConflict: 'replace' },
        { path: 'local', onConflict: 'warn' },
      ]);

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(complexConfig);

      // Generate different combinations of conflicts and unique modules
      // const moduleIds = [
      //   'foundation/logic/reasoning', // In all paths - complex conflicts
      //   'principle/solid/srp', // In some paths
      //   'technology/react/hooks', // Unique to some paths
      //   'execution/debug/systematic', // Another conflict pattern
      // ];

      mockGlob.mockImplementation(async (pattern: string | string[]) => {
        const patternStr = Array.isArray(pattern) ? pattern[0] : pattern;
        if (patternStr.includes('base/'))
          return Promise.resolve([
            'base/reasoning.module.yml',
            'base/srp.module.yml',
          ]);
        if (patternStr.includes('team1/'))
          return Promise.resolve([
            'team1/reasoning.module.yml',
            'team1/hooks.module.yml',
          ]);
        if (patternStr.includes('team2/'))
          return Promise.resolve([
            'team2/reasoning.module.yml',
            'team2/debug.module.yml',
          ]);
        if (patternStr.includes('team3/'))
          return Promise.resolve([
            'team3/reasoning.module.yml',
            'team3/srp.module.yml',
          ]);
        if (patternStr.includes('project/'))
          return Promise.resolve([
            'project/reasoning.module.yml',
            'project/unique.module.yml',
          ]);
        if (patternStr.includes('local/'))
          return Promise.resolve(['local/reasoning.module.yml']);
        return Promise.resolve([]);
      });

      mockLoadModule.mockImplementation(async (filePath: string) => {
        if (filePath.includes('reasoning'))
          return Promise.resolve(
            createTestModule('foundation/logic/reasoning')
          );
        if (filePath.includes('srp'))
          return Promise.resolve(createTestModule('principle/solid/srp'));
        if (filePath.includes('hooks'))
          return Promise.resolve(createTestModule('technology/react/hooks'));
        if (filePath.includes('debug'))
          return Promise.resolve(
            createTestModule('execution/debug/systematic')
          );
        return Promise.resolve(createTestModule('foundation/test/unique'));
      });

      const startTime = Date.now();
      await registry.discover();
      const duration = Date.now() - startTime;

      // Should complete quickly even with complex conflicts
      expect(duration).toBeLessThan(500);

      // Should have resolved modules according to conflict strategies
      expect(registry.resolve('foundation/logic/reasoning')).toBeDefined();
      expect(registry.size()).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty module configs', async () => {
      const emptyConfig = createModuleConfig([]);

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(emptyConfig);

      await registry.discover();

      expect(registry.size()).toBe(0);
      expect(registry.getAllModuleIds()).toHaveLength(0);
    });

    it('should handle malformed conflict strategies gracefully', async () => {
      const malformedConfig = createModuleConfig([
        { path: 'modules/valid', onConflict: 'warn' },
        {
          path: 'modules/invalid',
          onConflict: 'invalid-strategy' as 'error' | 'replace' | 'warn',
        },
      ]);

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(malformedConfig);

      await expect(registry.discover()).rejects.toThrow(
        'Invalid conflict resolution strategy: invalid-strategy'
      );
    });

    it('should handle circular replacement patterns', async () => {
      // This test verifies that the system doesn't get into infinite loops
      // with circular replacements (though the current implementation processes linearly)
      const config = createModuleConfig([
        { path: 'modules/a', onConflict: 'replace' },
        { path: 'modules/b', onConflict: 'replace' },
        { path: 'modules/c', onConflict: 'replace' },
      ]);

      const moduleId = 'foundation/circular/test';

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(config);

      // All paths have the same module ID
      mockGlob
        .mockResolvedValueOnce(['modules/a/test.module.yml'])
        .mockResolvedValueOnce(['modules/b/test.module.yml'])
        .mockResolvedValueOnce(['modules/c/test.module.yml']);

      mockLoadModule.mockResolvedValue(createTestModule(moduleId));

      await registry.discover();

      // Should resolve to the last path (c)
      expect(registry.resolve(moduleId)).toBe('modules/c/test.module.yml');
      expect(registry.size()).toBe(1);

      // Should have replacement warnings
      const warnings = registry.getWarnings();
      expect(
        warnings.filter(w => w.includes('replacing previous entry'))
      ).toHaveLength(2);
    });

    it('should handle missing module files during conflict resolution', async () => {
      const config = createModuleConfig([
        { path: 'modules/valid', onConflict: 'warn' },
        { path: 'modules/missing', onConflict: 'replace' },
      ]);

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(config);

      mockGlob
        .mockResolvedValueOnce(['modules/valid/test.module.yml'])
        .mockResolvedValueOnce(['modules/missing/test.module.yml']);

      // First module loads successfully, second fails
      mockLoadModule
        .mockResolvedValueOnce(createTestModule('foundation/test/valid'))
        .mockRejectedValueOnce(new Error('File not found'));

      await registry.discover();

      // Should have the valid module
      expect(registry.resolve('foundation/test/valid')).toBeDefined();

      // Should have a warning about the failed module
      const warnings = registry.getWarnings();
      expect(warnings.some(w => w.includes('Skipping invalid module'))).toBe(
        true
      );
      expect(warnings.some(w => w.includes('File not found'))).toBe(true);
    });

    it('should handle path access errors gracefully', async () => {
      const config = createModuleConfig([
        { path: 'modules/accessible', onConflict: 'warn' },
        { path: 'modules/restricted', onConflict: 'error' },
      ]);

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(config);

      // First path works, second path fails
      mockGlob
        .mockResolvedValueOnce(['modules/accessible/test.module.yml'])
        .mockRejectedValueOnce(new Error('Permission denied'));

      mockLoadModule.mockResolvedValue(
        createTestModule('foundation/test/accessible')
      );

      // Should not throw, just warn
      await registry.discover();

      expect(registry.resolve('foundation/test/accessible')).toBeDefined();

      const warnings = registry.getWarnings();
      expect(
        warnings.some(w =>
          w.includes("Failed to process module path 'modules/restricted'")
        )
      ).toBe(true);
      expect(warnings.some(w => w.includes('Permission denied'))).toBe(true);
    });

    it('should handle mixed success and failure across conflict strategies', async () => {
      const config = createModuleConfig([
        { path: 'modules/good1', onConflict: 'error' },
        { path: 'modules/bad', onConflict: 'warn' },
        { path: 'modules/good2', onConflict: 'replace' },
      ]);

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(config);

      mockGlob
        .mockResolvedValueOnce(['modules/good1/test1.module.yml'])
        .mockResolvedValueOnce(['modules/bad/test2.module.yml'])
        .mockResolvedValueOnce(['modules/good2/test3.module.yml']);

      mockLoadModule
        .mockResolvedValueOnce(createTestModule('foundation/test/one'))
        .mockRejectedValueOnce(new Error('Invalid module'))
        .mockResolvedValueOnce(createTestModule('foundation/test/three'));

      await registry.discover();

      // Should have the successful modules
      expect(registry.resolve('foundation/test/one')).toBeDefined();
      expect(registry.resolve('foundation/test/three')).toBeDefined();
      expect(registry.size()).toBe(2);

      // Should have warning about the failed module
      const warnings = registry.getWarnings();
      expect(warnings.some(w => w.includes('Skipping invalid module'))).toBe(
        true
      );
    });
  });

  describe('Integration with Module Discovery', () => {
    it('should fall back to directory discovery when config is missing', async () => {
      mockExistsSync.mockReturnValue(false); // No modules.config.yml
      mockGlob.mockResolvedValue([
        'instructions-modules/foundation/test/fallback.module.yml',
      ]);
      mockLoadModule.mockResolvedValue(
        createTestModule('foundation/test/fallback')
      );

      await registry.discover();

      expect(registry.resolve('foundation/test/fallback')).toBeDefined();
      expect(registry.size()).toBe(1);
    });

    it('should prefer configured modules over directory discovery', async () => {
      const config = createModuleConfig([
        { path: 'custom/modules', onConflict: 'warn' },
      ]);

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(config);
      mockGlob.mockResolvedValue(['custom/modules/test.module.yml']);
      mockLoadModule.mockResolvedValue(
        createTestModule('foundation/test/configured')
      );

      await registry.discover();

      expect(registry.resolve('foundation/test/configured')).toBe(
        'custom/modules/test.module.yml'
      );

      // Verify directory discovery glob was not called (since config exists)
      const globCalls = mockGlob.mock.calls;
      expect(
        globCalls.some(call => call[0].includes('instructions-modules'))
      ).toBe(false);
    });

    it('should aggregate warnings from all sources', async () => {
      const config = createModuleConfig([
        { path: 'modules/first', onConflict: 'warn' },
        { path: 'modules/second', onConflict: 'replace' },
      ]);

      mockExistsSync.mockReturnValue(true);
      mockReadFile.mockResolvedValue('test config');
      mockYamlParse.mockReturnValue(config);

      mockGlob
        .mockResolvedValueOnce([
          'modules/first/good.module.yml',
          'modules/first/bad.module.yml',
        ])
        .mockResolvedValueOnce(['modules/second/conflict.module.yml']);

      mockLoadModule
        .mockResolvedValueOnce(createTestModule('foundation/test/good'))
        .mockRejectedValueOnce(new Error('Bad module'))
        .mockResolvedValueOnce(createTestModule('foundation/test/good')); // Conflict

      await registry.discover();

      const warnings = registry.getWarnings();

      // Should have warning about bad module
      expect(warnings.some(w => w.includes('Skipping invalid module'))).toBe(
        true
      );

      // Should have warning about conflict resolution
      expect(warnings.some(w => w.includes('replacing previous entry'))).toBe(
        true
      );

      expect(warnings.length).toBeGreaterThan(1);
    });
  });
});
