import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleError } from './error-handler.js';
import {
  UMSError,
  UMSValidationError,
  ModuleLoadError,
  PersonaLoadError,
  BuildError,
  ConflictError,
} from 'ums-lib';

// Mock console methods
const consoleMock = {
  error: vi.fn(),
  warn: vi.fn(),
};

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(consoleMock.error);
  vi.spyOn(console, 'warn').mockImplementation(consoleMock.warn);
});

afterEach(() => {
  vi.restoreAllMocks();
  consoleMock.error.mockClear();
  consoleMock.warn.mockClear();
});

describe('error-handler', () => {
  describe('handleError', () => {
    it('should handle ConflictError with specific formatting and suggestions', () => {
      const error = new ConflictError(
        'Test conflict message',
        'test-module',
        3
      );
      const options = {
        command: 'build',
        context: 'module resolution',
        verbose: false,
      };

      handleError(error, options);

      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining(
          '[ERROR] build: module resolution - Test conflict message'
        )
      );
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('Conflict Details:')
      );
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('Module ID: test-module')
      );
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('Conflicting versions: 3')
      );
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('Suggestions:')
      );
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('Use --conflict-strategy=warn')
      );
    });

    it('should handle UMSValidationError with path and section info', () => {
      const error = new UMSValidationError(
        'Invalid field value',
        '/path/to/file.yml',
        'meta.name'
      );
      const options = {
        command: 'validate',
        context: 'validation',
        verbose: false,
      };

      handleError(error, options);

      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining(
          '[ERROR] validate: validation - Invalid field value'
        )
      );
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('File: /path/to/file.yml')
      );
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('Section: meta.name')
      );
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('Check YAML syntax and structure')
      );
    });

    it('should handle ModuleLoadError with file path', () => {
      const error = new ModuleLoadError(
        'Failed to load module',
        '/path/to/module.yml'
      );
      const options = {
        command: 'build',
        context: 'module loading',
        verbose: false,
      };

      handleError(error, options);

      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining(
          '[ERROR] build: module loading - Failed to load module'
        )
      );
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('File: /path/to/module.yml')
      );
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('Check file exists and is readable')
      );
    });

    it('should handle PersonaLoadError with file path', () => {
      const error = new PersonaLoadError(
        'Failed to load persona',
        '/path/to/persona.yml'
      );
      const options = {
        command: 'build',
        context: 'persona loading',
        verbose: false,
      };

      handleError(error, options);

      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining(
          '[ERROR] build: persona loading - Failed to load persona'
        )
      );
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('File: /path/to/persona.yml')
      );
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('Check persona file exists and is readable')
      );
    });

    it('should handle BuildError with appropriate suggestions', () => {
      const error = new BuildError('Build process failed');
      const options = {
        command: 'build',
        context: 'build process',
        verbose: false,
      };

      handleError(error, options);

      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining(
          '[ERROR] build: build process - Build process failed'
        )
      );
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('Check persona and module files are valid')
      );
    });

    it('should handle generic UMSError with context', () => {
      const error = new UMSError(
        'Generic UMS error',
        'GENERIC_ERROR',
        'test context'
      );
      const options = {
        command: 'test',
        context: 'UMS operation',
        verbose: false,
      };

      handleError(error, options);

      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining(
          '[ERROR] test: UMS operation - Generic UMS error'
        )
      );
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('Context: test context')
      );
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('Review error details and try again')
      );
    });

    it('should handle generic Error with M0.5 format', () => {
      const error = new Error('Generic error message');
      const options = {
        command: 'test',
        context: 'test operation',
        suggestion: 'check test configuration',
        verbose: false,
      };

      handleError(error, options);

      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining(
          '[ERROR] test: test operation - Generic error message (check test configuration)'
        )
      );
    });

    it('should include verbose output with timestamps when requested', () => {
      const error = new ConflictError('Test conflict', 'test-module', 2);
      const options = {
        command: 'build',
        context: 'module resolution',
        verbose: true,
        timestamp: true,
      };

      handleError(error, options);

      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/)
      );
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('Error code: CONFLICT_ERROR')
      );
    });

    it('should handle non-Error values', () => {
      const error = 'String error message';
      const options = {
        command: 'test',
        context: 'test operation',
        suggestion: 'check input',
        verbose: false,
      };

      handleError(error, options);

      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining(
          '[ERROR] test: test operation - String error message (check input)'
        )
      );
    });

    it('should use default context and suggestion when not provided', () => {
      const error = new Error('Test error');
      const options = {
        command: 'test',
        verbose: false,
      };

      handleError(error, options);

      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining(
          '[ERROR] test: operation failed - Test error (check the error details and try again)'
        )
      );
    });

    it('should include file and key path information when provided', () => {
      const error = new Error('Test error');
      const options = {
        command: 'test',
        context: 'test operation',
        filePath: '/path/to/file.yml',
        keyPath: 'meta.name',
        verbose: false,
      };

      handleError(error, options);

      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('File: /path/to/file.yml')
      );
      expect(consoleMock.error).toHaveBeenCalledWith(
        expect.stringContaining('Key path: meta.name')
      );
    });
  });
});
