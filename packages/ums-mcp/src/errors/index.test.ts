/**
 * Error Classes and Formatter Tests
 */

import { describe, it, expect } from 'vitest';
import {
  MCPError,
  MCPToolError,
  MCPValidationError,
  MCPNotFoundError,
  formatErrorResponse,
} from './index.js';

describe('MCPError', () => {
  it('creates error with message and code', () => {
    const error = new MCPError('Something went wrong', 'CUSTOM_ERROR');

    expect(error.message).toBe('Something went wrong');
    expect(error.code).toBe('CUSTOM_ERROR');
    expect(error.name).toBe('MCPError');
  });

  it('extends Error', () => {
    const error = new MCPError('Test', 'TEST');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(MCPError);
  });
});

describe('MCPToolError', () => {
  it('creates error with default code', () => {
    const error = new MCPToolError('Tool execution failed');

    expect(error.message).toBe('Tool execution failed');
    expect(error.code).toBe('TOOL_ERROR');
    expect(error.name).toBe('MCPToolError');
  });

  it('accepts custom code', () => {
    const error = new MCPToolError('Custom failure', 'CUSTOM_TOOL_ERROR');

    expect(error.code).toBe('CUSTOM_TOOL_ERROR');
  });

  it('extends MCPError', () => {
    const error = new MCPToolError('Test');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(MCPError);
    expect(error).toBeInstanceOf(MCPToolError);
  });
});

describe('MCPValidationError', () => {
  it('creates error with validation code', () => {
    const error = new MCPValidationError('Invalid input');

    expect(error.message).toBe('Invalid input');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.name).toBe('MCPValidationError');
  });

  it('stores validation issues', () => {
    const issues = [
      { path: 'field1', message: 'Required' },
      { path: 'field2.nested', message: 'Must be number' },
    ];
    const error = new MCPValidationError('Validation failed', issues);

    expect(error.issues).toEqual(issues);
  });

  it('defaults to empty issues array', () => {
    const error = new MCPValidationError('Invalid');

    expect(error.issues).toEqual([]);
  });

  it('extends MCPError', () => {
    const error = new MCPValidationError('Test');

    expect(error).toBeInstanceOf(MCPError);
  });
});

describe('MCPNotFoundError', () => {
  it('creates error with formatted message', () => {
    const error = new MCPNotFoundError('Module', 'test-module');

    expect(error.message).toBe('Module not found: test-module');
    expect(error.code).toBe('NOT_FOUND');
    expect(error.name).toBe('MCPNotFoundError');
  });

  it('extends MCPError', () => {
    const error = new MCPNotFoundError('Persona', 'my-persona');

    expect(error).toBeInstanceOf(MCPError);
  });
});

describe('formatErrorResponse', () => {
  it('formats MCPError with code', () => {
    const error = new MCPError('Something failed', 'CUSTOM_CODE');
    const response = formatErrorResponse(error);

    expect(response.isError).toBe(true);
    expect(response.content).toHaveLength(1);
    expect(response.content[0].type).toBe('text');
    expect(response.content[0].text).toBe('Error [CUSTOM_CODE]: Something failed');
  });

  it('formats MCPToolError', () => {
    const error = new MCPToolError('Tool failed');
    const response = formatErrorResponse(error);

    expect(response.content[0].text).toBe('Error [TOOL_ERROR]: Tool failed');
  });

  it('formats MCPValidationError', () => {
    const error = new MCPValidationError('Invalid input');
    const response = formatErrorResponse(error);

    expect(response.content[0].text).toBe('Error [VALIDATION_ERROR]: Invalid input');
  });

  it('formats MCPNotFoundError', () => {
    const error = new MCPNotFoundError('Module', 'test');
    const response = formatErrorResponse(error);

    expect(response.content[0].text).toBe('Error [NOT_FOUND]: Module not found: test');
  });

  it('formats standard Error', () => {
    const error = new Error('Standard error');
    const response = formatErrorResponse(error);

    expect(response.content[0].text).toBe('Error [Error]: Standard error');
  });

  it('formats TypeError', () => {
    const error = new TypeError('Type mismatch');
    const response = formatErrorResponse(error);

    expect(response.content[0].text).toBe('Error [TypeError]: Type mismatch');
  });

  it('formats string error', () => {
    const response = formatErrorResponse('String error message');

    expect(response.content[0].text).toBe('Error [UNKNOWN_ERROR]: String error message');
  });

  it('formats unknown error types', () => {
    const response = formatErrorResponse({ custom: 'object' });

    expect(response.isError).toBe(true);
    expect(response.content[0].text).toContain('Error [UNKNOWN_ERROR]');
  });

  it('formats null error', () => {
    const response = formatErrorResponse(null);

    expect(response.content[0].text).toBe('Error [UNKNOWN_ERROR]: null');
  });

  it('formats undefined error', () => {
    const response = formatErrorResponse(undefined);

    expect(response.content[0].text).toBe('Error [UNKNOWN_ERROR]: undefined');
  });

  it('always returns isError: true', () => {
    expect(formatErrorResponse(new Error('test')).isError).toBe(true);
    expect(formatErrorResponse('string').isError).toBe(true);
    expect(formatErrorResponse(null).isError).toBe(true);
  });

  it('always returns single text content', () => {
    const response = formatErrorResponse(new Error('test'));

    expect(response.content).toHaveLength(1);
    expect(response.content[0].type).toBe('text');
    expect(typeof response.content[0].text).toBe('string');
  });
});
