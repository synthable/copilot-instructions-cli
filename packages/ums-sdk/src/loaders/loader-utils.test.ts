/**
 * Tests for loader utilities
 */

import { describe, it, expect } from 'vitest';
import { filePathToUrl, formatValidationErrors } from './loader-utils.js';
import type { ValidationResult } from 'ums-lib';

describe('loader-utils', () => {
  describe('filePathToUrl', () => {
    it('should convert file path to file URL', () => {
      const filePath = '/path/to/module.ts';
      const url = filePathToUrl(filePath);
      
      expect(url).toContain('file://');
      expect(url).toContain('module.ts');
    });

    it('should handle paths with special characters', () => {
      const filePath = '/path/to/my module.ts';
      const url = filePathToUrl(filePath);
      
      expect(url).toContain('file://');
      expect(url).toContain('my%20module.ts');
    });
  });

  describe('formatValidationErrors', () => {
    it('should format validation errors with paths', () => {
      const validation: ValidationResult = {
        valid: false,
        errors: [
          { path: 'metadata.name', message: 'Name is required' },
          { path: 'components[0]', message: 'Invalid component' }
        ],
        warnings: []
      };

      const result = formatValidationErrors(validation);
      expect(result).toBe('metadata.name: Name is required; components[0]: Invalid component');
    });

    it('should use default path for errors without path', () => {
      const validation: ValidationResult = {
        valid: false,
        errors: [
          { message: 'Invalid structure' }
        ],
        warnings: []
      };

      const result = formatValidationErrors(validation);
      expect(result).toBe('module: Invalid structure');
    });

    it('should use custom default path', () => {
      const validation: ValidationResult = {
        valid: false,
        errors: [
          { message: 'Invalid structure' }
        ],
        warnings: []
      };

      const result = formatValidationErrors(validation, 'persona');
      expect(result).toBe('persona: Invalid structure');
    });

    it('should handle mixed errors with and without paths', () => {
      const validation: ValidationResult = {
        valid: false,
        errors: [
          { path: 'id', message: 'ID is required' },
          { message: 'Missing schema version' },
          { path: 'version', message: 'Invalid version format' }
        ],
        warnings: []
      };

      const result = formatValidationErrors(validation);
      expect(result).toBe('id: ID is required; module: Missing schema version; version: Invalid version format');
    });

    it('should handle single error', () => {
      const validation: ValidationResult = {
        valid: false,
        errors: [
          { path: 'id', message: 'ID is required' }
        ],
        warnings: []
      };

      const result = formatValidationErrors(validation);
      expect(result).toBe('id: ID is required');
    });

    it('should handle empty errors array', () => {
      const validation: ValidationResult = {
        valid: true,
        errors: [],
        warnings: []
      };

      const result = formatValidationErrors(validation);
      expect(result).toBe('');
    });
  });
});
