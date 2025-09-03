/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function, @typescript-eslint/unbound-method */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { handleError, handleErrorLegacy } from './error-handler.js';
import type { Ora } from 'ora';

// Mock chalk
vi.mock('chalk', () => ({
  default: {
    red: vi.fn(str => str),
    gray: vi.fn(str => str),
  },
}));

describe('handleError', () => {
  const consoleErrorSpy = vi
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  it('should handle error with M0.5 structured format', () => {
    // Arrange
    const error = new Error('Test error');

    // Act
    handleError(error, {
      command: 'build',
      context: 'validation process',
      suggestion: 'check your input files',
      verbose: true,
      timestamp: true,
    });

    // Assert
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/),
      '[ERROR] build: validation process - Test error (check your input files)'
    );
  });

  it('should handle error with minimal M0.5 options', () => {
    // Arrange
    const error = new Error('Simple error');

    // Act
    handleError(error, {
      command: 'test',
      context: 'operation',
      suggestion: 'retry the operation',
    });

    // Assert
    expect(console.error).toHaveBeenCalledWith(
      '[ERROR] test: operation - Simple error (retry the operation)'
    );
  });

  it('should handle error with required command parameter', () => {
    // Arrange
    const error = new Error('Default error');

    // Act
    handleError(error, {
      command: 'validate',
    });

    // Assert
    expect(console.error).toHaveBeenCalledWith(
      '[ERROR] validate: operation failed - Default error (check the error details and try again)'
    );
  });

  it('should handle non-Error objects', () => {
    // Arrange
    const error = 'String error';

    // Act
    handleError(error, {
      command: 'test',
      context: 'processing',
      suggestion: 'check input format',
    });

    // Assert
    expect(console.error).toHaveBeenCalledWith(
      '[ERROR] test: processing - String error (check input format)'
    );
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});

describe('handleErrorLegacy', () => {
  const consoleErrorSpy = vi
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  it('should use spinner to fail and log error message if spinner is provided', () => {
    // Arrange
    const mockSpinner = {
      fail: vi.fn(),
    } as unknown as Ora;
    const error = new Error('Test error');

    // Act
    handleErrorLegacy(error, mockSpinner);

    // Assert
    expect(mockSpinner.fail).toHaveBeenCalledWith('Operation failed.');
    expect(console.error).toHaveBeenCalledWith('Test error');
  });

  it('should log to console if spinner is not provided', () => {
    // Arrange
    const error = new Error('Another test error');

    // Act
    handleErrorLegacy(error);

    // Assert
    expect(console.error).toHaveBeenCalledWith('Operation failed.');
    expect(console.error).toHaveBeenCalledWith('Another test error');
  });
});
