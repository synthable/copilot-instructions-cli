import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import type { Ora } from 'ora';
import { handleError } from './error-handler.js';

// Mock chalk
vi.mock('chalk', () => ({
  default: {
    red: vi.fn(str => str),
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

  it('should use spinner to fail and log error message if spinner is provided', () => {
    // Arrange
    const mockSpinner = {
      fail: vi.fn(),
    } as unknown as Ora;
    const error = new Error('Test error');

    // Act
    handleError(error, mockSpinner);

    // Assert
    expect(mockSpinner.fail).toHaveBeenCalledWith('Operation failed.');
    expect(console.error).toHaveBeenCalledWith('Test error');
  });

  it('should log to console if spinner is not provided', () => {
    // Arrange
    const error = new Error('Another test error');

    // Act
    handleError(error);

    // Assert
    expect(console.error).toHaveBeenCalledWith('Operation failed.');
    expect(console.error).toHaveBeenCalledWith('Another test error');
  });

  it('should handle non-Error objects', () => {
    // Arrange
    const error = 'A simple string error';

    // Act
    handleError(error);

    // Assert
    expect(console.error).toHaveBeenCalledWith('Operation failed.');
    expect(console.error).not.toHaveBeenCalledWith(error);
  });

  it('should not log error message if error is not an instance of Error', () => {
    // Arrange
    const nonError = { message: 'not an error instance' };

    // Act
    handleError(nonError);

    // Assert
    expect(console.error).toHaveBeenCalledWith('Operation failed.');
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
