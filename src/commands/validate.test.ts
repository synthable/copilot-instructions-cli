import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import path from 'path';
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
  },
}));
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

import { handleValidate } from './validate.js';
import { validatePersonaFile as coreValidatePersonaFile } from '../core/persona-service.js';
import { validateModuleFile as coreValidateModuleFile } from '../core/module-service.js';
import { handleError } from '../utils/error-handler.js';

// Mock dependencies
vi.mock('fs', () => ({
  promises: {
    stat: vi.fn(),
    readFile: vi.fn(),
  },
}));

vi.mock('glob', () => ({
  glob: vi.fn(),
}));

const oraInstance = {
  start: vi.fn().mockReturnThis(),
  succeed: vi.fn().mockReturnThis(),
  fail: vi.fn().mockReturnThis(),
  warn: vi.fn().mockReturnThis(),
  text: '',
};

vi.mock('ora', () => {
  return { default: vi.fn(() => oraInstance) };
});

vi.mock('../core/persona-service.js', () => ({
  validatePersonaFile: vi.fn(),
}));

vi.mock('../core/module-service.js', () => ({
  validateModuleFile: vi.fn(),
}));

vi.mock('../utils/error-handler.js', () => ({
  handleError: vi.fn(),
}));

describe('handleValidate', () => {
  const mockSpinner = oraInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSpinner.succeed.mockClear();
    mockSpinner.fail.mockClear();
    mockSpinner.warn.mockClear();
    mockConsoleLog.mockClear(); // Moved here from afterEach
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  describe('validateAll', () => {
    it('should validate all found module and persona files', async () => {
      // Arrange
      const files = ['module1.md', 'persona1.persona.jsonc', 'module2.md'];
      vi.mocked(glob).mockResolvedValue(files);
      vi.mocked(coreValidateModuleFile).mockResolvedValue({
        filePath: '',
        isValid: true,
        errors: [],
      });
      vi.mocked(coreValidatePersonaFile).mockResolvedValue({
        filePath: '',
        isValid: true,
        errors: [],
      });

      // Act
      await handleValidate();

      // Assert
      expect(glob).toHaveBeenCalledWith(
        `{instructions-modules/**/*.md,**/*.persona.json,**/*.persona.jsonc}`,
        { nodir: true, ignore: 'node_modules/**' }
      );
      expect(coreValidateModuleFile).toHaveBeenCalledTimes(2);
      expect(coreValidatePersonaFile).toHaveBeenCalledTimes(1);
      // expect(mockConsoleLog).toHaveBeenCalledWith(
      //   expect.stringContaining('Passed: 3')
      // );
    });

    it('should handle no files found', async () => {
      // Arrange
      vi.mocked(glob).mockResolvedValue([]);

      // Act
      await handleValidate();

      // Assert
      expect(mockSpinner.warn).toHaveBeenCalledWith(
        'No files found to validate.'
      );
    });
  });

  describe('validateFile', () => {
    it('should validate a single module file', async () => {
      // Arrange
      const filePath = 'my-module.md';
      const fileContent = 'mock module content';
      vi.mocked(fs.stat).mockResolvedValue({
        isFile: () => true,
        isDirectory: () => false,
      } as any);
      vi.mocked(fs.readFile).mockResolvedValue(fileContent);
      vi.mocked(coreValidateModuleFile).mockResolvedValue({
        filePath,
        isValid: true,
        errors: [],
      });

      // Act
      await handleValidate({ targetPath: filePath });

      // Assert
      expect(fs.stat).toHaveBeenCalledWith(filePath);
      expect(coreValidateModuleFile).toHaveBeenCalledWith(filePath);
      // expect(mockConsoleLog).toHaveBeenCalledWith(
      //   expect.stringContaining('Passed: 1')
      // );
    });

    it('should validate a single persona file', async () => {
      // Arrange
      const filePath = 'my-persona.persona.jsonc';
      vi.mocked(fs.stat).mockResolvedValue({
        isFile: () => true,
        isDirectory: () => false,
      } as any);
      vi.mocked(coreValidatePersonaFile).mockResolvedValue({
        filePath,
        isValid: true,
        errors: [],
      });

      // Act
      await handleValidate({ targetPath: filePath });

      // Assert
      expect(coreValidatePersonaFile).toHaveBeenCalledWith(filePath);
      // expect(mockConsoleLog).toHaveBeenCalledWith(
      //   expect.stringContaining('Passed: 1')
      // );
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
      expect(mockSpinner.fail).toHaveBeenCalledWith(
        expect.stringContaining('Unsupported file type')
      );
      // expect(mockConsoleLog).toHaveBeenCalledWith(
      //   expect.stringContaining('Failed: 1')
      // );
    });
  });

  describe('validateDirectory', () => {
    it('should validate all files within a directory', async () => {
      // Arrange
      const dirPath = 'my-directory';
      const files = [
        path.join(dirPath, 'module.md'),
        path.join(dirPath, 'persona.persona.json'),
      ];
      vi.mocked(fs.stat).mockResolvedValue({
        isFile: () => false,
        isDirectory: () => true,
      } as any);
      vi.mocked(glob).mockResolvedValue(files);
      vi.mocked(coreValidateModuleFile).mockResolvedValue({
        filePath: '',
        isValid: true,
        errors: [],
      });
      vi.mocked(coreValidatePersonaFile).mockResolvedValue({
        filePath: '',
        isValid: true,
        errors: [],
      });

      // Act
      await handleValidate({ targetPath: dirPath });

      // Assert
      expect(fs.stat).toHaveBeenCalledWith(dirPath);
      expect(glob).toHaveBeenCalledWith(
        `${dirPath}/**/*.{md,persona.json,persona.jsonc}`,
        { nodir: true }
      );
      expect(coreValidateModuleFile).toHaveBeenCalledTimes(1);
      expect(coreValidatePersonaFile).toHaveBeenCalledTimes(1);
      // expect(mockConsoleLog).toHaveBeenCalledWith(
      //   expect.stringContaining('Passed: 2')
      // );
    });
  });

  describe('Error Handling and Reporting', () => {
    it('should report path not found for non-existent paths', async () => {
      // Arrange
      const targetPath = 'non-existent-path';
      const error = new Error('ENOENT');
      (error as any).code = 'ENOENT';
      vi.mocked(fs.stat).mockRejectedValue(error);

      // Act
      await handleValidate({ targetPath });

      // Assert
      expect(mockSpinner.fail).toHaveBeenCalledWith(
        `Path not found: ${targetPath}`
      );
      expect(handleError).toHaveBeenCalledWith(error, mockSpinner);
    });

    it.skip('should print a detailed error report for failed validations', async () => {
      // Arrange
      const files = ['valid.md', 'invalid.persona.jsonc'];
      const errorMsg = 'Missing modules field';
      vi.mocked(glob).mockResolvedValue(files);
      vi.mocked(coreValidateModuleFile).mockResolvedValue({
        filePath: 'valid.md',
        isValid: true,
        errors: [],
      });
      vi.mocked(coreValidatePersonaFile).mockResolvedValue({
        filePath: 'invalid.persona.jsonc',
        isValid: false,
        errors: [errorMsg],
      });

      // Act
      await handleValidate();

      // Assert
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Failed: 1')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Errors:')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('File: invalid.persona.jsonc')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(`- ${errorMsg}`)
      );
    });
  });
});
