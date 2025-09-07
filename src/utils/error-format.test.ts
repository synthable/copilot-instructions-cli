/**
 * Basic tests for M0.5 error message format compliance
 */

import { describe, it, expect } from 'vitest';
import { formatError } from './error-formatting.js';

describe('M0.5 Error Message Format', () => {
  it('should format basic error message with required structure', () => {
    const result = formatError({
      command: 'build',
      context: 'validation',
      issue: 'missing field',
      suggestion: 'add the field',
    });

    expect(result).toBe(
      '[ERROR] build: validation - missing field (add the field)'
    );
  });

  it('should include file path when provided', () => {
    const result = formatError({
      command: 'validate',
      context: 'parsing',
      issue: 'syntax error',
      suggestion: 'fix syntax',
      filePath: '/path/to/file.yml',
    });

    expect(result).toContain('[ERROR] validate: parsing - syntax error');
    expect(result).toContain('File: /path/to/file.yml');
  });

  it('should include key path when provided', () => {
    const result = formatError({
      command: 'validate',
      context: 'validation',
      issue: 'invalid type',
      suggestion: 'use correct type',
      keyPath: 'meta.name',
    });

    expect(result).toContain('Key path: meta.name');
  });

  it('should include section reference when provided', () => {
    const result = formatError({
      command: 'validate',
      context: 'schema check',
      issue: 'wrong version',
      suggestion: 'update version',
      sectionReference: 'Section 2.1',
    });

    expect(result).toContain('Reference: UMS v1.0 Section 2.1');
  });
});
