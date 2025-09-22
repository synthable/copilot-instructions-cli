import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parse } from 'yaml';
import { fileExists, readModuleFile } from './file-operations.js';
import {
  loadModuleConfig,
  validateConfigPaths,
  getConfiguredModulePaths,
  getConflictStrategy,
} from './config-loader.js';
import type { ModuleConfig } from 'ums-lib';

// Mock dependencies
vi.mock('./file-operations.js', () => ({
  fileExists: vi.fn(),
  readModuleFile: vi.fn(),
}));

vi.mock('yaml', () => ({
  parse: vi.fn(),
}));

describe('config-loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadModuleConfig', () => {
    it('should return null when config file does not exist', async () => {
      vi.mocked(fileExists).mockReturnValue(false);

      const result = await loadModuleConfig();

      expect(fileExists).toHaveBeenCalledWith('modules.config.yml');
      expect(result).toBeNull();
    });

    it('should load and parse valid config file', async () => {
      const mockConfigContent = `
localModulePaths:
  - path: "./instructions-modules-v1-compliant"
    onConflict: "error"
  - path: "./custom-modules"
    onConflict: "warn"
`;
      const mockParsedConfig: ModuleConfig = {
        localModulePaths: [
          { path: './instructions-modules-v1-compliant', onConflict: 'error' },
          { path: './custom-modules', onConflict: 'warn' },
        ],
      };

      vi.mocked(fileExists).mockReturnValue(true);
      vi.mocked(readModuleFile).mockResolvedValue(mockConfigContent);
      vi.mocked(parse).mockReturnValue(mockParsedConfig);

      const result = await loadModuleConfig();

      expect(fileExists).toHaveBeenCalledWith('modules.config.yml');
      expect(readModuleFile).toHaveBeenCalledWith('modules.config.yml');
      expect(parse).toHaveBeenCalledWith(mockConfigContent);
      expect(result).toEqual(mockParsedConfig);
    });

    it('should use custom config path when provided', async () => {
      const customPath = './custom-config.yml';
      vi.mocked(fileExists).mockReturnValue(false);

      await loadModuleConfig(customPath);

      expect(fileExists).toHaveBeenCalledWith(customPath);
    });

    it('should throw error for invalid config structure - missing localModulePaths', async () => {
      const invalidConfig = { someOtherField: 'value' };

      vi.mocked(fileExists).mockReturnValue(true);
      vi.mocked(readModuleFile).mockResolvedValue('invalid yaml');
      vi.mocked(parse).mockReturnValue(invalidConfig);

      await expect(loadModuleConfig()).rejects.toThrow(
        'Failed to load modules.config.yml: Invalid modules.config.yml format - missing localModulePaths'
      );
    });

    it('should throw error when localModulePaths is not an array', async () => {
      const invalidConfig = { localModulePaths: 'not-an-array' };

      vi.mocked(fileExists).mockReturnValue(true);
      vi.mocked(readModuleFile).mockResolvedValue('invalid yaml');
      vi.mocked(parse).mockReturnValue(invalidConfig);

      await expect(loadModuleConfig()).rejects.toThrow(
        'Failed to load modules.config.yml: localModulePaths must be an array'
      );
    });

    it('should throw error when entry missing path', async () => {
      const invalidConfig = {
        localModulePaths: [{ onConflict: 'error' }], // missing path
      };

      vi.mocked(fileExists).mockReturnValue(true);
      vi.mocked(readModuleFile).mockResolvedValue('invalid yaml');
      vi.mocked(parse).mockReturnValue(invalidConfig);

      await expect(loadModuleConfig()).rejects.toThrow(
        'Failed to load modules.config.yml: Each localModulePaths entry must have a path'
      );
    });

    it('should throw error for invalid conflict resolution strategy', async () => {
      const invalidConfig = {
        localModulePaths: [
          { path: './modules', onConflict: 'invalid-strategy' },
        ],
      };

      vi.mocked(fileExists).mockReturnValue(true);
      vi.mocked(readModuleFile).mockResolvedValue('invalid yaml');
      vi.mocked(parse).mockReturnValue(invalidConfig);

      await expect(loadModuleConfig()).rejects.toThrow(
        'Failed to load modules.config.yml: Invalid conflict resolution strategy: invalid-strategy'
      );
    });

    it('should allow valid conflict resolution strategies', async () => {
      const validConfig = {
        localModulePaths: [
          { path: './modules1', onConflict: 'error' },
          { path: './modules2', onConflict: 'replace' },
          { path: './modules3', onConflict: 'warn' },
          { path: './modules4' }, // onConflict is optional
        ],
      };

      vi.mocked(fileExists).mockReturnValue(true);
      vi.mocked(readModuleFile).mockResolvedValue('valid yaml');
      vi.mocked(parse).mockReturnValue(validConfig);

      const result = await loadModuleConfig();

      expect(result).toEqual(validConfig);
    });

    it('should handle YAML parsing errors', async () => {
      vi.mocked(fileExists).mockReturnValue(true);
      vi.mocked(readModuleFile).mockResolvedValue('invalid yaml');
      vi.mocked(parse).mockImplementation(() => {
        throw new Error('YAML parsing failed');
      });

      await expect(loadModuleConfig()).rejects.toThrow(
        'Failed to load modules.config.yml: YAML parsing failed'
      );
    });

    it('should handle file read errors', async () => {
      vi.mocked(fileExists).mockReturnValue(true);
      vi.mocked(readModuleFile).mockRejectedValue(
        new Error('File read failed')
      );

      await expect(loadModuleConfig()).rejects.toThrow(
        'Failed to load modules.config.yml: File read failed'
      );
    });

    it('should handle non-object parsed YAML', async () => {
      vi.mocked(fileExists).mockReturnValue(true);
      vi.mocked(readModuleFile).mockResolvedValue('yaml content');
      vi.mocked(parse).mockReturnValue('not an object');

      await expect(loadModuleConfig()).rejects.toThrow(
        'Failed to load modules.config.yml: Invalid modules.config.yml format - missing localModulePaths'
      );
    });

    it('should handle null parsed YAML', async () => {
      vi.mocked(fileExists).mockReturnValue(true);
      vi.mocked(readModuleFile).mockResolvedValue('yaml content');
      vi.mocked(parse).mockReturnValue(null);

      await expect(loadModuleConfig()).rejects.toThrow(
        'Failed to load modules.config.yml: Invalid modules.config.yml format - missing localModulePaths'
      );
    });
  });

  describe('validateConfigPaths', () => {
    it('should validate that all configured paths exist', () => {
      const config: ModuleConfig = {
        localModulePaths: [
          { path: './existing-path1' },
          { path: './existing-path2' },
        ],
      };

      vi.mocked(fileExists).mockReturnValue(true);

      expect(() => {
        validateConfigPaths(config);
      }).not.toThrow();

      expect(fileExists).toHaveBeenCalledTimes(2);
      expect(fileExists).toHaveBeenCalledWith('./existing-path1');
      expect(fileExists).toHaveBeenCalledWith('./existing-path2');
    });

    it('should throw error when paths do not exist', () => {
      const config: ModuleConfig = {
        localModulePaths: [
          { path: './existing-path' },
          { path: './missing-path1' },
          { path: './missing-path2' },
        ],
      };

      vi.mocked(fileExists)
        .mockReturnValueOnce(true) // existing-path exists
        .mockReturnValueOnce(false) // missing-path1 doesn't exist
        .mockReturnValueOnce(false); // missing-path2 doesn't exist

      expect(() => {
        validateConfigPaths(config);
      }).toThrow(
        'Invalid module paths in configuration: ./missing-path1, ./missing-path2'
      );
    });

    it('should handle empty localModulePaths array', () => {
      const config: ModuleConfig = {
        localModulePaths: [],
      };

      expect(() => {
        validateConfigPaths(config);
      }).not.toThrow();

      expect(fileExists).not.toHaveBeenCalled();
    });
  });

  describe('getConfiguredModulePaths', () => {
    it('should extract all module paths from config', () => {
      const config: ModuleConfig = {
        localModulePaths: [
          { path: './path1', onConflict: 'error' },
          { path: './path2', onConflict: 'warn' },
          { path: './path3' },
        ],
      };

      const result = getConfiguredModulePaths(config);

      expect(result).toEqual(['./path1', './path2', './path3']);
    });

    it('should return empty array for empty config', () => {
      const config: ModuleConfig = {
        localModulePaths: [],
      };

      const result = getConfiguredModulePaths(config);

      expect(result).toEqual([]);
    });
  });

  describe('getConflictStrategy', () => {
    it('should return correct conflict strategy for existing path', () => {
      const config: ModuleConfig = {
        localModulePaths: [
          { path: './path1', onConflict: 'error' },
          { path: './path2', onConflict: 'warn' },
          { path: './path3', onConflict: 'replace' },
        ],
      };

      expect(getConflictStrategy(config, './path1')).toBe('error');
      expect(getConflictStrategy(config, './path2')).toBe('warn');
      expect(getConflictStrategy(config, './path3')).toBe('replace');
    });

    it('should return default "error" strategy for non-existent path', () => {
      const config: ModuleConfig = {
        localModulePaths: [{ path: './path1', onConflict: 'warn' }],
      };

      const result = getConflictStrategy(config, './non-existent-path');

      expect(result).toBe('error');
    });

    it('should return default "error" strategy when onConflict is not specified', () => {
      const config: ModuleConfig = {
        localModulePaths: [
          { path: './path1' }, // no onConflict specified
        ],
      };

      const result = getConflictStrategy(config, './path1');

      expect(result).toBe('error');
    });

    it('should handle empty config', () => {
      const config: ModuleConfig = {
        localModulePaths: [],
      };

      const result = getConflictStrategy(config, './any-path');

      expect(result).toBe('error');
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle string errors in loadModuleConfig', async () => {
      vi.mocked(fileExists).mockReturnValue(true);
      vi.mocked(readModuleFile).mockRejectedValue('String error');

      await expect(loadModuleConfig()).rejects.toThrow(
        'Failed to load modules.config.yml: String error'
      );
    });

    it('should handle undefined errors in loadModuleConfig', async () => {
      vi.mocked(fileExists).mockReturnValue(true);
      vi.mocked(readModuleFile).mockRejectedValue(undefined);

      await expect(loadModuleConfig()).rejects.toThrow(
        'Failed to load modules.config.yml: undefined'
      );
    });

    it('should handle complex config with various edge cases', async () => {
      const complexConfig = {
        localModulePaths: [
          { path: './modules', onConflict: 'error' },
          { path: '../shared/modules', onConflict: 'replace' },
          { path: '/absolute/path/modules' }, // no onConflict
          { path: './path with spaces/modules', onConflict: 'warn' },
        ],
      };

      vi.mocked(fileExists).mockReturnValue(true);
      vi.mocked(readModuleFile).mockResolvedValue('yaml content');
      vi.mocked(parse).mockReturnValue(complexConfig);

      const result = await loadModuleConfig();

      expect(result).toEqual(complexConfig);
    });
  });
});
