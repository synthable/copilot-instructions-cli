/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function, @typescript-eslint/no-unsafe-argument */
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { promises as fs } from 'fs';
import { glob } from 'glob';

// Mock chalk and console
vi.mock('chalk', () => ({
  default: {
    bold: {
      red: vi.fn(str => str),
    },
    green: vi.fn(str => str),
    red: vi.fn(str => str),
    yellow: vi.fn(str => str),
    gray: vi.fn(str => str),
  },
}));
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

import { handleValidate } from './validate.js';
import { loadModule, loadPersona } from 'ums-lib';
import { handleError } from '../utils/error-handler.js';

const mockLoadModule = vi.mocked(loadModule);
const mockLoadPersona = vi.mocked(loadPersona);
const mockGlobFn = vi.mocked(glob);

// Mock dependencies for UMS v1.0
vi.mock('fs', () => ({
  promises: {
    stat: vi.fn(),
    readFile: vi.fn(),
  },
}));

vi.mock('glob');
vi.mock('ums-lib', () => ({
  loadModule: vi.fn(),
  loadPersona: vi.fn(),
}));
vi.mock('../utils/error-handler.js');

// Mock ora
const mockSpinner = {
  start: vi.fn().mockReturnThis(),
  succeed: vi.fn().mockReturnThis(),
  fail: vi.fn().mockReturnThis(),
  warn: vi.fn().mockReturnThis(),
  text: '',
  stop: vi.fn().mockReturnThis(),
};

vi.mock('ora', () => ({
  default: vi.fn(() => mockSpinner),
}));

describe('handleValidate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  describe('validateAll', () => {
    it('should validate all found module and persona files using UMS v1.0 patterns', async () => {
      // Arrange
      mockGlobFn.mockImplementation((pattern: string | string[]) => {
        const patternStr = Array.isArray(pattern) ? pattern[0] : pattern;
        if (patternStr.includes('module.yml')) {
          return Promise.resolve(['module1.module.yml', 'module2.module.yml']);
        } else if (patternStr.includes('persona.yml')) {
          return Promise.resolve(['persona1.persona.yml']);
        }
        return Promise.resolve([]);
      });

      mockLoadModule.mockResolvedValue({} as any);
      mockLoadPersona.mockResolvedValue({} as any);

      // Act
      await handleValidate();

      // Assert - M7: expect UMS v1.0 patterns
      expect(glob).toHaveBeenCalledWith(
        'instructions-modules/**/*.module.yml',
        { nodir: true, ignore: ['**/node_modules/**'] }
      );
      expect(glob).toHaveBeenCalledWith('personas/**/*.persona.yml', {
        nodir: true,
        ignore: ['**/node_modules/**'],
      });
      expect(loadModule).toHaveBeenCalledTimes(2);
      expect(loadPersona).toHaveBeenCalledTimes(1);
    });

    it('should handle no files found', async () => {
      // Arrange
      mockGlobFn.mockResolvedValue([]);

      // Act
      await handleValidate();

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('No UMS v1.0 files found')
      );
    });
  });

  describe('validateFile', () => {
    it('should validate a single UMS v1.0 module file', async () => {
      // Arrange
      const filePath = 'test-module.module.yml';
      vi.mocked(fs.stat).mockResolvedValue({
        isFile: () => true,
        isDirectory: () => false,
      } as any);
      mockLoadModule.mockResolvedValue({} as any);

      // Act
      await handleValidate({ targetPath: filePath });

      // Assert
      expect(fs.stat).toHaveBeenCalledWith(filePath);
      expect(loadModule).toHaveBeenCalledWith(filePath);
    });

    it('should validate a single UMS v1.0 persona file', async () => {
      // Arrange
      const filePath = 'test-persona.persona.yml';
      vi.mocked(fs.stat).mockResolvedValue({
        isFile: () => true,
        isDirectory: () => false,
      } as any);
      mockLoadPersona.mockResolvedValue({} as any);

      // Act
      await handleValidate({ targetPath: filePath });

      // Assert
      expect(fs.stat).toHaveBeenCalledWith(filePath);
      expect(loadPersona).toHaveBeenCalledWith(filePath);
    });

    it('should handle unsupported file types', async () => {
      // Arrange
      const filePath = 'unsupported.txt';
      vi.mocked(fs.stat).mockResolvedValue({
        isFile: () => true,
        isDirectory: () => false,
      } as any);

      // Act
      await handleValidate({ targetPath: filePath });

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Unsupported file type')
      );
    });
  });

  describe('validateDirectory', () => {
    it('should validate all UMS v1.0 files within a directory', async () => {
      // Arrange
      const dirPath = 'test-directory';
      vi.mocked(fs.stat).mockResolvedValue({
        isFile: () => false,
        isDirectory: () => true,
      } as any);
      mockGlobFn.mockImplementation((pattern: string | string[]) => {
        const patternStr = Array.isArray(pattern) ? pattern[0] : pattern;
        if (patternStr.includes('module.yml')) {
          return Promise.resolve([
            'test-directory/instructions-modules/test.module.yml',
          ]);
        } else if (patternStr.includes('persona.yml')) {
          return Promise.resolve(['test-directory/personas/test.persona.yml']);
        }
        return Promise.resolve([]);
      });
      mockLoadModule.mockResolvedValue({} as any);
      mockLoadPersona.mockResolvedValue({} as any);

      // Act
      await handleValidate({ targetPath: dirPath });

      // Assert
      expect(fs.stat).toHaveBeenCalledWith(dirPath);
      expect(glob).toHaveBeenCalledWith(
        `${dirPath}/instructions-modules/**/*.module.yml`,
        { nodir: true, ignore: ['**/node_modules/**'] }
      );
      expect(glob).toHaveBeenCalledWith(
        `${dirPath}/personas/**/*.persona.yml`,
        { nodir: true, ignore: ['**/node_modules/**'] }
      );
    });
  });

  describe('Error Handling and Reporting', () => {
    it('should handle file system errors gracefully', async () => {
      // Arrange
      const targetPath = 'non-existent-path';
      vi.mocked(fs.stat).mockRejectedValue(
        new Error('ENOENT: no such file or directory')
      );

      // Act
      await handleValidate({ targetPath });

      // Assert
      expect(handleError).toHaveBeenCalled();
      expect(mockSpinner.fail).toHaveBeenCalledWith('Validation failed.');
    });

    it('should print a detailed error report for failed validations', async () => {
      // Arrange - this test is kept as is since it tests output formatting
      const filePath = 'failing-module.md';
      vi.mocked(fs.stat).mockResolvedValue({
        isFile: () => true,
        isDirectory: () => false,
      } as any);

      // Mock validation failure
      mockLoadModule.mockRejectedValue(new Error('Validation error'));

      // Act
      await handleValidate({ targetPath: filePath, verbose: true });

      // Assert - should show detailed error output in verbose mode
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('✗'));
    });
  });
});
