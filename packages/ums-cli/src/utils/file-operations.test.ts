import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { existsSync } from 'fs';
import {
  readFile as readFileAsync,
  writeFile as writeFileAsync,
} from 'fs/promises';
import { glob } from 'glob';
import {
  readPersonaFile,
  readModuleFile,
  writeOutputFile,
  discoverModuleFiles,
  fileExists,
  readFromStdin,
  isPersonaFile,
  validatePersonaFile,
} from './file-operations.js';

// Mock the fs module
vi.mock('fs', () => ({
  existsSync: vi.fn(),
}));

vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
}));

vi.mock('glob', () => ({
  glob: vi.fn(),
}));

describe('file-operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('readPersonaFile', () => {
    it('should read and return file content', async () => {
      const mockContent = 'name: test-persona\ndescription: test';
      vi.mocked(readFileAsync).mockResolvedValue(mockContent);

      const result = await readPersonaFile('/path/to/persona.yml');

      expect(readFileAsync).toHaveBeenCalledWith(
        '/path/to/persona.yml',
        'utf-8'
      );
      expect(result).toBe(mockContent);
    });

    it('should throw error when file read fails', async () => {
      const mockError = new Error('File not found');
      vi.mocked(readFileAsync).mockRejectedValue(mockError);

      await expect(readPersonaFile('/invalid/path.yml')).rejects.toThrow(
        "Failed to read persona file '/invalid/path.yml': File not found"
      );
    });

    it('should handle non-Error exceptions', async () => {
      vi.mocked(readFileAsync).mockRejectedValue('String error');

      await expect(readPersonaFile('/invalid/path.yml')).rejects.toThrow(
        "Failed to read persona file '/invalid/path.yml': String error"
      );
    });
  });

  describe('readModuleFile', () => {
    it('should read and return module file content', async () => {
      const mockContent = 'id: test/module\nversion: 1.0';
      vi.mocked(readFileAsync).mockResolvedValue(mockContent);

      const result = await readModuleFile('/path/to/module.yml');

      expect(readFileAsync).toHaveBeenCalledWith(
        '/path/to/module.yml',
        'utf-8'
      );
      expect(result).toBe(mockContent);
    });

    it('should throw error when module file read fails', async () => {
      const mockError = new Error('Permission denied');
      vi.mocked(readFileAsync).mockRejectedValue(mockError);

      await expect(readModuleFile('/restricted/module.yml')).rejects.toThrow(
        "Failed to read module file '/restricted/module.yml': Permission denied"
      );
    });
  });

  describe('writeOutputFile', () => {
    it('should write content to file', async () => {
      vi.mocked(writeFileAsync).mockResolvedValue(undefined);

      await writeOutputFile('/output/file.md', 'content to write');

      expect(writeFileAsync).toHaveBeenCalledWith(
        '/output/file.md',
        'content to write',
        'utf-8'
      );
    });

    it('should throw error when file write fails', async () => {
      const mockError = new Error('Disk full');
      vi.mocked(writeFileAsync).mockRejectedValue(mockError);

      await expect(
        writeOutputFile('/output/file.md', 'content')
      ).rejects.toThrow(
        "Failed to write output file '/output/file.md': Disk full"
      );
    });

    it('should handle non-Error write exceptions', async () => {
      vi.mocked(writeFileAsync).mockRejectedValue('Write failed');

      await expect(
        writeOutputFile('/output/file.md', 'content')
      ).rejects.toThrow(
        "Failed to write output file '/output/file.md': Write failed"
      );
    });
  });

  describe('discoverModuleFiles', () => {
    it('should discover module files in multiple paths', async () => {
      const mockFiles1Ts = [
        '/path1/module1.module.ts',
        '/path1/module2.module.ts',
      ];
      const mockFiles2Ts = ['/path2/module3.module.ts'];

      vi.mocked(glob)
        .mockResolvedValueOnce(mockFiles1Ts)
        .mockResolvedValueOnce(mockFiles2Ts);

      const result = await discoverModuleFiles(['/path1', '/path2']);

      expect(glob).toHaveBeenCalledTimes(2); // 2 paths × 1 extension
      expect(glob).toHaveBeenCalledWith('/path1/**/*.module.ts', {
        nodir: true,
      });
      expect(glob).toHaveBeenCalledWith('/path2/**/*.module.ts', {
        nodir: true,
      });
      expect(result).toEqual([...mockFiles1Ts, ...mockFiles2Ts]);
    });

    it('should handle empty paths array', async () => {
      const result = await discoverModuleFiles([]);

      expect(glob).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should throw error when glob fails', async () => {
      const mockError = new Error('Access denied');
      vi.mocked(glob).mockRejectedValue(mockError);

      await expect(discoverModuleFiles(['/restricted/path'])).rejects.toThrow(
        "Failed to discover modules in path '/restricted/path': Access denied"
      );
    });

    it('should continue processing other paths if one fails', async () => {
      const mockFiles = ['/path2/module.module.yml'];

      vi.mocked(glob)
        .mockRejectedValueOnce(new Error('Access denied'))
        .mockResolvedValueOnce(mockFiles);

      await expect(
        discoverModuleFiles(['/restricted', '/path2'])
      ).rejects.toThrow(
        "Failed to discover modules in path '/restricted': Access denied"
      );
    });
  });

  describe('fileExists', () => {
    it('should return true when file exists', () => {
      vi.mocked(existsSync).mockReturnValue(true);

      const result = fileExists('/existing/file.yml');

      expect(existsSync).toHaveBeenCalledWith('/existing/file.yml');
      expect(result).toBe(true);
    });

    it('should return false when file does not exist', () => {
      vi.mocked(existsSync).mockReturnValue(false);

      const result = fileExists('/missing/file.yml');

      expect(existsSync).toHaveBeenCalledWith('/missing/file.yml');
      expect(result).toBe(false);
    });
  });

  describe('readFromStdin', () => {
    it('should read content from stdin', async () => {
      const mockChunks = [Buffer.from('chunk1'), Buffer.from('chunk2')];
      const mockStdin = {
        on: vi.fn(),
        resume: vi.fn(),
      };

      // Mock process.stdin
      const originalStdin = process.stdin;
      Object.defineProperty(process, 'stdin', {
        value: mockStdin,
        configurable: true,
      });

      // Simulate stdin events
      const promise = readFromStdin();

      // Get the event handlers
      const onCalls = mockStdin.on.mock.calls as [
        string,
        (...args: any[]) => void,
      ][];
      const dataHandler = onCalls.find(call => call[0] === 'data')?.[1];
      const endHandler = onCalls.find(call => call[0] === 'end')?.[1];

      // Simulate data events
      mockChunks.forEach(chunk => {
        dataHandler?.(chunk);
      });
      endHandler?.();

      const result = await promise;

      expect(result).toBe('chunk1chunk2');
      expect(mockStdin.resume).toHaveBeenCalled();

      // Restore process.stdin
      Object.defineProperty(process, 'stdin', {
        value: originalStdin,
        configurable: true,
      });
    });

    it('should handle stdin error', async () => {
      const mockStdin = {
        on: vi.fn(),
        resume: vi.fn(),
      };

      // Mock process.stdin
      const originalStdin = process.stdin;
      Object.defineProperty(process, 'stdin', {
        value: mockStdin,
        configurable: true,
      });

      const promise = readFromStdin();

      // Get the error handler
      const onCalls = mockStdin.on.mock.calls as [
        string,
        (...args: any[]) => void,
      ][];
      const errorHandler = onCalls.find(call => call[0] === 'error')?.[1];

      // Simulate error event
      const testError = new Error('Stdin error');
      errorHandler?.(testError);

      await expect(promise).rejects.toThrow('Stdin error');

      // Restore process.stdin
      Object.defineProperty(process, 'stdin', {
        value: originalStdin,
        configurable: true,
      });
    });
  });

  describe('isPersonaFile', () => {
    it('should return true for valid persona file extensions', () => {
      expect(isPersonaFile('test.persona.ts')).toBe(true);
      expect(isPersonaFile('/path/to/test.persona.ts')).toBe(true);
      expect(isPersonaFile('complex-name-v1.persona.ts')).toBe(true);
    });

    it('should return false for invalid extensions', () => {
      expect(isPersonaFile('test.ts')).toBe(false);
      expect(isPersonaFile('test.yml')).toBe(false);
      expect(isPersonaFile('test.persona.yml')).toBe(false);
      expect(isPersonaFile('test.module.ts')).toBe(false);
      expect(isPersonaFile('test.txt')).toBe(false);
      expect(isPersonaFile('test')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isPersonaFile('')).toBe(false);
      expect(isPersonaFile('.persona.ts')).toBe(true);
      expect(isPersonaFile('persona.ts')).toBe(false);
    });
  });

  describe('validatePersonaFile', () => {
    it('should not throw for valid persona files', () => {
      expect(() => {
        validatePersonaFile('test.persona.ts');
      }).not.toThrow();
      expect(() => {
        validatePersonaFile('/path/to/test.persona.ts');
      }).not.toThrow();
    });

    it('should throw for invalid persona file extensions', () => {
      expect(() => {
        validatePersonaFile('test.yml');
      }).toThrow(
        'Persona file must have .persona.ts extension, got: test.yml\n' +
          'UMS v2.0 uses TypeScript format (.persona.ts) for personas.'
      );

      expect(() => {
        validatePersonaFile('test.persona.yaml');
      }).toThrow(
        'Persona file must have .persona.ts extension, got: test.persona.yaml\n' +
          'UMS v2.0 uses TypeScript format (.persona.ts) for personas.'
      );

      expect(() => {
        validatePersonaFile('test.module.yml');
      }).toThrow(
        'Persona file must have .persona.ts extension, got: test.module.yml\n' +
          'UMS v2.0 uses TypeScript format (.persona.ts) for personas.'
      );
    });

    it('should handle empty and edge case inputs', () => {
      expect(() => {
        validatePersonaFile('');
      }).toThrow(
        'Persona file must have .persona.ts extension, got: \n' +
          'UMS v2.0 uses TypeScript format (.persona.ts) for personas.'
      );
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle various error types consistently', async () => {
      // Test with different error types
      vi.mocked(readFileAsync).mockRejectedValue(new TypeError('Type error'));
      await expect(readPersonaFile('/test.yml')).rejects.toThrow(
        "Failed to read persona file '/test.yml': Type error"
      );

      vi.mocked(readFileAsync).mockRejectedValue(null);
      await expect(readPersonaFile('/test.yml')).rejects.toThrow(
        "Failed to read persona file '/test.yml': null"
      );

      vi.mocked(readFileAsync).mockRejectedValue(undefined);
      await expect(readPersonaFile('/test.yml')).rejects.toThrow(
        "Failed to read persona file '/test.yml': undefined"
      );
    });

    it('should handle special characters in file paths', async () => {
      const specialPath = '/path with spaces/émoji-📁/test.yml';
      vi.mocked(readFileAsync).mockResolvedValue('content');

      await readPersonaFile(specialPath);

      expect(readFileAsync).toHaveBeenCalledWith(specialPath, 'utf-8');
    });
  });
});
