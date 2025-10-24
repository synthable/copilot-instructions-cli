import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Module, ModuleConfig } from 'ums-lib';
import {
  discoverStandardModules,
  discoverLocalModules,
  discoverAllModules,
} from './module-discovery.js';

// Mock dependencies
vi.mock('./file-operations.js', () => ({
  discoverModuleFiles: vi.fn(),
}));

vi.mock('./config-loader.js', () => ({
  loadModuleConfig: vi.fn(),
  getConfiguredModulePaths: vi.fn(),
  getConflictStrategy: vi.fn(),
}));

vi.mock('./typescript-loader.js', () => ({
  loadTypeScriptModule: vi.fn(),
}));

vi.mock('ums-lib', () => ({
  ModuleRegistry: vi.fn().mockImplementation((strategy = 'warn') => {
    let mockSize = 0;
    return {
      strategy: strategy as string,
      modules: new Map(),
      add: vi.fn().mockImplementation(() => {
        mockSize++;
      }),
      resolve: vi.fn(),
      resolveAll: vi.fn(),
      size: vi.fn(() => mockSize),
      getConflicts: vi.fn(() => []),
      getConflictingIds: vi.fn(() => []),
    };
  }),
}));

// Import mocked functions
import { discoverModuleFiles } from './file-operations.js';
import {
  loadModuleConfig,
  getConfiguredModulePaths,
  getConflictStrategy,
} from './config-loader.js';
import { loadTypeScriptModule } from './typescript-loader.js';

describe('module-discovery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mock return value for getConflictStrategy
    vi.mocked(getConflictStrategy).mockReturnValue('warn');
  });

  describe('discoverStandardModules', () => {
    it('should discover and parse standard modules', async () => {
      const mockFiles = [
        './instructions-modules/foundation/logic.module.ts',
        './instructions-modules/principle/solid.module.ts',
      ];
      const mockModule1: Module = {
        id: 'foundation/logic',
        version: '2.0',
        schemaVersion: '2.0',
        capabilities: [],
        cognitiveLevel: 2,
        metadata: {
          name: 'Logic',
          description: 'Basic logic',
          semantic: 'Logic principles',
        },
      };
      const mockModule2: Module = {
        id: 'principle/solid',
        version: '2.0',
        schemaVersion: '2.0',
        capabilities: [],
        cognitiveLevel: 2,
        metadata: {
          name: 'SOLID',
          description: 'SOLID principles',
          semantic: 'SOLID principles',
        },
      };

      vi.mocked(discoverModuleFiles).mockResolvedValue(mockFiles);
      vi.mocked(loadTypeScriptModule)
        .mockResolvedValueOnce(mockModule1)
        .mockResolvedValueOnce(mockModule2);

      const result = await discoverStandardModules();

      expect(discoverModuleFiles).toHaveBeenCalledWith([
        './instructions-modules',
      ]);
      expect(loadTypeScriptModule).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
      // Verify that both expected files are present (order may vary)
      const filePaths = result.map(m => m.filePath);
      expect(filePaths).toContain(mockFiles[0]);
      expect(filePaths).toContain(mockFiles[1]);
    });

    it('should return empty array when no standard modules directory exists', async () => {
      vi.mocked(discoverModuleFiles).mockRejectedValue(
        new Error(
          "Failed to discover modules in path './instructions-modules': ENOENT"
        )
      );

      const result = await discoverStandardModules();

      expect(result).toEqual([]);
    });

    it('should throw error when module loading fails', async () => {
      const mockFiles = ['./test.module.ts'];
      vi.mocked(discoverModuleFiles).mockResolvedValue(mockFiles);
      vi.mocked(loadTypeScriptModule).mockRejectedValue(
        new Error('Invalid TypeScript module')
      );

      await expect(discoverStandardModules()).rejects.toThrow(
        "Failed to load standard module './test.module.ts': Invalid TypeScript module"
      );
    });
  });

  describe('discoverLocalModules', () => {
    it('should discover and parse local modules', async () => {
      const mockConfig: ModuleConfig = {
        localModulePaths: [{ path: './custom-modules' }],
      };
      const mockFiles = ['./custom-modules/custom.module.ts'];
      const mockModule: Module = {
        id: 'custom/module',
        version: '2.0',
        schemaVersion: '2.0',
        capabilities: [],
        cognitiveLevel: 2,
        metadata: {
          name: 'Custom',
          description: 'Custom module',
          semantic: 'Custom logic',
        },
      };

      vi.mocked(getConfiguredModulePaths).mockReturnValue(['./custom-modules']);
      vi.mocked(discoverModuleFiles).mockResolvedValue(mockFiles);
      vi.mocked(loadTypeScriptModule).mockResolvedValue(mockModule);

      const result = await discoverLocalModules(mockConfig);

      expect(getConfiguredModulePaths).toHaveBeenCalledWith(mockConfig);
      expect(discoverModuleFiles).toHaveBeenCalledWith(['./custom-modules']);
      expect(result).toHaveLength(1);
      expect(result[0].filePath).toBe(mockFiles[0]);
    });

    it('should handle empty local paths', async () => {
      const mockConfig: ModuleConfig = {
        localModulePaths: [],
      };

      vi.mocked(getConfiguredModulePaths).mockReturnValue([]);
      vi.mocked(discoverModuleFiles).mockResolvedValue([]);

      const result = await discoverLocalModules(mockConfig);

      expect(result).toEqual([]);
    });
  });

  describe('discoverAllModules', () => {
    it('should discover all modules with configuration', async () => {
      const mockConfig: ModuleConfig = {
        localModulePaths: [{ path: './local' }],
      };
      const localModule: Module = {
        id: 'local/module',
        version: '2.0',
        schemaVersion: '2.0',
        capabilities: [],
        cognitiveLevel: 2,
        metadata: {
          name: 'Local',
          description: 'Local module',
          semantic: 'Local',
        },
      };

      vi.mocked(loadModuleConfig).mockResolvedValue(mockConfig);
      vi.mocked(getConfiguredModulePaths).mockReturnValue(['./local']);
      vi.mocked(discoverModuleFiles).mockResolvedValue([
        './local/module.module.ts',
      ]);
      vi.mocked(loadTypeScriptModule).mockResolvedValue(localModule);

      const result = await discoverAllModules();

      expect(result.registry.size()).toBe(1);
      expect(result.warnings).toHaveLength(0);
    });

    it('should handle no configuration file', async () => {
      vi.mocked(loadModuleConfig).mockResolvedValue(null);

      const result = await discoverAllModules();

      // With no config, no modules should be discovered
      // (standard modules discovery is disabled - see line 123-132 in module-discovery.ts)
      expect(result.registry.size()).toBe(0);
      expect(result.warnings).toHaveLength(0);
    });
  });
});
