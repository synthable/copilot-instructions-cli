import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Module, ModuleConfig } from 'ums-lib';
import type { CLIModule } from '../types/cli-extensions.js';
import {
  discoverStandardModules,
  discoverLocalModules,
  discoverAllModules,
} from './module-discovery.js';

// Mock dependencies
vi.mock('./file-operations.js', () => ({
  discoverModuleFiles: vi.fn(),
  readModuleFile: vi.fn(),
}));

vi.mock('./config-loader.js', () => ({
  loadModuleConfig: vi.fn(),
  getConfiguredModulePaths: vi.fn(),
  getConflictStrategy: vi.fn(),
}));

vi.mock('ums-lib', () => ({
  parseModule: vi.fn(),
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
import { discoverModuleFiles, readModuleFile } from './file-operations.js';
import {
  loadModuleConfig,
  getConfiguredModulePaths,
  getConflictStrategy,
} from './config-loader.js';
import { parseModule } from 'ums-lib';

describe('module-discovery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mock return value for getConflictStrategy
    vi.mocked(getConflictStrategy).mockReturnValue('warn');
  });

  describe('discoverStandardModules', () => {
    it('should discover and parse standard modules', async () => {
      const mockFiles = [
        './instructions-modules/foundation/logic.module.yml',
        './instructions-modules/principle/solid.module.yml',
      ];
      const mockContent = 'id: foundation/logic\nversion: 1.0';
      const mockModule1: Module = {
        id: 'foundation/logic',
        version: '1.0',
        schemaVersion: '1.0',
        capabilities: [],
        metadata: {
          name: 'Logic',
          description: 'Basic logic',
          semantic: 'Logic principles',
        },
      };
      const mockModule2: Module = {
        id: 'principle/solid',
        version: '1.0',
        schemaVersion: '1.0',
        capabilities: [],
        metadata: {
          name: 'SOLID',
          description: 'SOLID principles',
          semantic: 'SOLID principles',
        },
      };

      vi.mocked(discoverModuleFiles).mockResolvedValue(mockFiles);
      vi.mocked(readModuleFile).mockResolvedValue(mockContent);
      vi.mocked(parseModule)
        .mockReturnValueOnce(mockModule1)
        .mockReturnValueOnce(mockModule2);

      const result = await discoverStandardModules();

      expect(discoverModuleFiles).toHaveBeenCalledWith([
        './instructions-modules',
      ]);
      expect(readModuleFile).toHaveBeenCalledTimes(2);
      expect(parseModule).toHaveBeenCalledTimes(2);
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

    it('should throw error when module parsing fails', async () => {
      const mockFiles = ['./test.module.yml'];
      vi.mocked(discoverModuleFiles).mockResolvedValue(mockFiles);
      vi.mocked(readModuleFile).mockResolvedValue('invalid content');
      vi.mocked(parseModule).mockImplementation(() => {
        throw new Error('Invalid YAML');
      });

      await expect(discoverStandardModules()).rejects.toThrow(
        "Failed to load standard module './test.module.yml': Invalid YAML"
      );
    });
  });

  describe('discoverLocalModules', () => {
    it('should discover and parse local modules', async () => {
      const mockConfig: ModuleConfig = {
        localModulePaths: [{ path: './custom-modules' }],
      };
      const mockFiles = ['./custom-modules/custom.module.yml'];
      const mockContent = 'id: custom/module\nversion: 1.0';
      const mockModule: Module = {
        id: 'custom/module',
        version: '1.0',
        schemaVersion: '1.0',
        capabilities: [],
        metadata: {
          name: 'Custom',
          description: 'Custom module',
          semantic: 'Custom logic',
        },
      };

      vi.mocked(getConfiguredModulePaths).mockReturnValue(['./custom-modules']);
      vi.mocked(discoverModuleFiles).mockResolvedValue(mockFiles);
      vi.mocked(readModuleFile).mockResolvedValue(mockContent);
      vi.mocked(parseModule).mockReturnValue(mockModule);

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
      const standardModule: CLIModule = {
        id: 'standard/module',
        version: '1.0',
        schemaVersion: '1.0',
        capabilities: [],
        metadata: {
          name: 'Standard',
          description: 'Standard module',
          semantic: 'Standard',
        },
        filePath: './standard/module.module.yml',
      };

      vi.mocked(loadModuleConfig).mockResolvedValue(mockConfig);
      vi.mocked(discoverModuleFiles)
        .mockResolvedValueOnce(['./standard/module.module.yml']) // Standard modules
        .mockResolvedValueOnce([]); // Local modules
      vi.mocked(readModuleFile).mockResolvedValue('content');
      vi.mocked(parseModule).mockReturnValue(standardModule);
      vi.mocked(getConfiguredModulePaths).mockReturnValue(['./local']);

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
