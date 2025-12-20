/**
 * Tests for file-utils.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkFileExists, isFileNotFoundError } from './file-utils.js';
import { ModuleNotFoundError } from '../errors/index.js';
import * as fs from 'node:fs/promises';

// Mock fs/promises
vi.mock('node:fs/promises', () => ({
  access: vi.fn(),
  constants: { F_OK: 0 },
}));

describe('file-utils', () => {
  describe('isFileNotFoundError', () => {
    it('should return true for ENOENT error', () => {
      const error = Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
      expect(isFileNotFoundError(error)).toBe(true);
    });

    it('should return false for other error codes', () => {
      const error = Object.assign(new Error('EACCES'), { code: 'EACCES' });
      expect(isFileNotFoundError(error)).toBe(false);
    });

    it('should return false for errors without code property', () => {
      const error = new Error('Some error');
      expect(isFileNotFoundError(error)).toBe(false);
    });

    it('should return false for errors with non-string code property', () => {
      const error = Object.assign(new Error('Error'), { code: 123 });
      expect(isFileNotFoundError(error)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isFileNotFoundError(null)).toBe(false);
    });

    it('should return false for non-object errors', () => {
      expect(isFileNotFoundError('string error')).toBe(false);
      expect(isFileNotFoundError(123)).toBe(false);
      expect(isFileNotFoundError(undefined)).toBe(false);
    });
  });

  describe('checkFileExists', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should not throw when file exists', async () => {
      vi.mocked(fs.access).mockResolvedValue(undefined);

      await expect(
        checkFileExists('/path/to/file.ts')
      ).resolves.toBeUndefined();
      expect(fs.access).toHaveBeenCalledWith('/path/to/file.ts', 0);
    });

    it('should throw ModuleNotFoundError when file does not exist (ENOENT)', async () => {
      const enoentError = Object.assign(new Error('ENOENT'), {
        code: 'ENOENT',
      });
      vi.mocked(fs.access).mockRejectedValue(enoentError);

      await expect(checkFileExists('/path/to/missing.ts')).rejects.toThrow(
        ModuleNotFoundError
      );
      await expect(checkFileExists('/path/to/missing.ts')).rejects.toThrow(
        'Module file not found: /path/to/missing.ts'
      );
    });

    it('should re-throw non-ENOENT errors', async () => {
      const permissionError = Object.assign(new Error('Permission denied'), {
        code: 'EACCES',
      });
      vi.mocked(fs.access).mockRejectedValue(permissionError);

      await expect(checkFileExists('/path/to/protected.ts')).rejects.toThrow(
        'Permission denied'
      );
    });

    it('should re-throw errors without code property', async () => {
      const genericError = new Error('Unknown error');
      vi.mocked(fs.access).mockRejectedValue(genericError);

      await expect(checkFileExists('/path/to/file.ts')).rejects.toThrow(
        'Unknown error'
      );
    });

    it('should re-throw non-object errors', async () => {
      vi.mocked(fs.access).mockRejectedValue('string error');

      await expect(checkFileExists('/path/to/file.ts')).rejects.toBe(
        'string error'
      );
    });

    it('should handle null error', async () => {
      vi.mocked(fs.access).mockRejectedValue(null);

      await expect(checkFileExists('/path/to/file.ts')).rejects.toBeNull();
    });
  });
});
