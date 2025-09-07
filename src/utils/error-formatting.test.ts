/**
 * Tests for M0.5 standardized error message formatting
 */

import { describe, it, expect } from 'vitest';
import {
  formatError,
  formatValidationError,
  formatWarning,
  formatInfo,
  formatDeprecationWarning,
  ID_VALIDATION_ERRORS,
  SCHEMA_VALIDATION_ERRORS,
} from './error-formatting.js';

describe('M0.5 Error Message Standards', () => {
  describe('formatError', () => {
    it('should format error with required M0.5 structure', () => {
      const result = formatError({
        command: 'build',
        context: 'persona validation',
        issue: 'missing required field "name"',
        suggestion: 'add a "name" field to your persona file',
      });

      expect(result).toBe(
        '[ERROR] build: persona validation - missing required field "name" (add a "name" field to your persona file)'
      );
    });

    it('should include file path when provided', () => {
      const result = formatError({
        command: 'validate',
        context: 'module validation',
        issue: 'invalid schema version',
        suggestion: 'set schemaVersion to "1.0"',
        filePath: '/path/to/module.yml',
      });

      expect(result).toContain('[ERROR] validate: module validation');
      expect(result).toContain('File: /path/to/module.yml');
    });

    it('should include key path when provided', () => {
      const result = formatError({
        command: 'validate',
        context: 'schema validation',
        issue: 'wrong type',
        suggestion: 'use string type',
        keyPath: 'meta.name',
      });

      expect(result).toContain('Key path: meta.name');
    });

    it('should include UMS section reference when provided', () => {
      const result = formatError({
        command: 'validate',
        context: 'ID validation',
        issue: 'invalid tier',
        suggestion: 'use valid tier name',
        sectionReference: 'Section 2.1',
      });

      expect(result).toContain('Reference: UMS v1.0 Section 2.1');
    });

    it('should include all context when fully specified', () => {
      const result = formatError({
        command: 'build',
        context: 'module resolution',
        issue: 'module not found',
        suggestion: 'check module ID and path',
        filePath: '/path/to/persona.yml',
        keyPath: 'moduleGroups[0].modules[2]',
        sectionReference: 'Section 3.2',
      });

      expect(result).toContain('[ERROR] build: module resolution');
      expect(result).toContain('File: /path/to/persona.yml');
      expect(result).toContain('Key path: moduleGroups[0].modules[2]');
      expect(result).toContain('Reference: UMS v1.0 Section 3.2');
    });
  });

  describe('formatValidationError', () => {
    it('should format validation error with standard structure', () => {
      const result = formatValidationError(
        'validate',
        '/path/to/file.yml',
        'missing required field',
        'add the required field'
      );

      expect(result).toContain('[ERROR] validate: validation failed');
      expect(result).toContain('File: /path/to/file.yml');
    });

    it('should include key path and section reference when provided', () => {
      const result = formatValidationError(
        'validate',
        '/path/to/file.yml',
        'invalid type',
        'use correct type',
        'meta.description',
        'Section 2.3'
      );

      expect(result).toContain('Key path: meta.description');
      expect(result).toContain('Reference: UMS v1.0 Section 2.3');
    });
  });

  describe('formatWarning', () => {
    it('should format warning with standard structure', () => {
      const result = formatWarning({
        command: 'build',
        context: 'module composition',
        issue: 'deprecated module used',
        filePath: '/path/to/persona.yml',
      });

      expect(result).toContain('[WARN] build: module composition');
      expect(result).toContain('(continuing...)');
      expect(result).toContain('File: /path/to/persona.yml');
    });
  });

  describe('formatInfo', () => {
    it('should format info message with standard structure', () => {
      const result = formatInfo({
        command: 'build',
        message: 'Successfully processed 5 modules',
      });

      expect(result).toBe('[INFO] build: Successfully processed 5 modules');
    });
  });

  describe('formatDeprecationWarning', () => {
    it('should format deprecation warning with replacement guidance', () => {
      const result = formatDeprecationWarning(
        'build',
        'old/module/id',
        'new/module/id',
        '/path/to/persona.yml'
      );

      expect(result).toContain(
        "[WARN] build: Module 'old/module/id' is deprecated"
      );
      expect(result).toContain("replaced by 'new/module/id'");
      expect(result).toContain('Please update your persona file');
      expect(result).toContain('File: /path/to/persona.yml');
    });

    it('should format deprecation warning without replacement', () => {
      const result = formatDeprecationWarning('build', 'deprecated/module/id');

      expect(result).toContain(
        "[WARN] build: Module 'deprecated/module/id' is deprecated"
      );
      expect(result).toContain('may be removed in a future version');
      expect(result).not.toContain('replaced by');
    });
  });

  describe('ID_VALIDATION_ERRORS', () => {
    it('should provide clear error messages for ID validation', () => {
      expect(ID_VALIDATION_ERRORS.invalidFormat('bad-id')).toContain(
        'does not match required format'
      );
      expect(ID_VALIDATION_ERRORS.invalidTier('bad', ['foundation'])).toContain(
        'Must be one of: foundation'
      );
      expect(ID_VALIDATION_ERRORS.emptySegment('tier//module')).toContain(
        'empty segments'
      );
      expect(
        ID_VALIDATION_ERRORS.invalidCharacters('tier/sub@ject/module')
      ).toContain('invalid characters');
      expect(
        ID_VALIDATION_ERRORS.uppercaseCharacters('Tier/subject/module')
      ).toContain('uppercase characters');
      expect(ID_VALIDATION_ERRORS.invalidModuleName('-invalid')).toContain(
        'start with a letter or number'
      );
    });
  });

  describe('SCHEMA_VALIDATION_ERRORS', () => {
    it('should provide clear error messages for schema validation', () => {
      expect(SCHEMA_VALIDATION_ERRORS.missingField('name')).toContain(
        "Required field 'name' is missing"
      );
      expect(
        SCHEMA_VALIDATION_ERRORS.wrongType('name', 'string', 'number')
      ).toContain('must be string, got number');
      expect(SCHEMA_VALIDATION_ERRORS.wrongSchemaVersion('1.1')).toContain(
        "must be '1.0', got '1.1'"
      );
      expect(
        SCHEMA_VALIDATION_ERRORS.undeclaredDirective('goal', ['principles'])
      ).toContain('not declared');
      expect(
        SCHEMA_VALIDATION_ERRORS.missingRequiredDirective('goal')
      ).toContain("Required directive 'goal' is missing");
      expect(
        SCHEMA_VALIDATION_ERRORS.invalidDirectiveType('goal', 'string')
      ).toContain('must be string');
      expect(
        SCHEMA_VALIDATION_ERRORS.duplicateModuleId('test/id', 'group1')
      ).toContain('appears multiple times');
    });
  });

  describe('Error message format compliance', () => {
    it('should ensure all error messages follow M0.5 structure', () => {
      const testCases = [
        formatError({
          command: 'test',
          context: 'test context',
          issue: 'test issue',
          suggestion: 'test suggestion',
        }),
        formatValidationError('test', '/file', 'issue', 'suggestion'),
        formatWarning({
          command: 'test',
          context: 'test context',
          issue: 'test issue',
        }),
        formatInfo({ command: 'test', message: 'test message' }),
      ];

      testCases.forEach(message => {
        // Check that message starts with appropriate prefix
        const hasValidPrefix =
          message.startsWith('[ERROR]') ||
          message.startsWith('[WARN]') ||
          message.startsWith('[INFO]');

        expect(hasValidPrefix).toBe(true);

        // Check that command is included
        expect(message).toContain('test');
      });
    });

    it('should ensure error messages provide actionable suggestions', () => {
      const errorMessage = formatError({
        command: 'build',
        context: 'validation',
        issue: 'specific problem',
        suggestion: 'specific solution',
      });

      // Should contain the suggestion in parentheses
      expect(errorMessage).toMatch(/\(.*specific solution.*\)/);
    });

    it('should ensure all formatted messages are deterministic', () => {
      const input = {
        command: 'test',
        context: 'test context',
        issue: 'test issue',
        suggestion: 'test suggestion',
        filePath: '/test/path',
        keyPath: 'test.key',
        sectionReference: 'Section 1.1',
      };

      const result1 = formatError(input);
      const result2 = formatError(input);

      expect(result1).toBe(result2);
    });
  });
});
