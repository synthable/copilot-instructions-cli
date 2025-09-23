import { describe, it, expect } from 'vitest';
import {
  formatError,
  formatCommandError,
  formatValidationError,
  formatWarning,
  formatInfo,
  formatDeprecationWarning,
  ID_VALIDATION_ERRORS,
  SCHEMA_VALIDATION_ERRORS,
  type ErrorContext,
  type WarningContext,
  type InfoContext,
} from './error-formatting.js';

describe('error-formatting', () => {
  describe('formatError', () => {
    it('should format basic error message', () => {
      const ctx: ErrorContext = {
        command: 'build',
        context: 'module validation',
        issue: 'missing required field',
        suggestion: 'add the missing field',
      };

      const result = formatError(ctx);

      expect(result).toBe(
        '[ERROR] build: module validation - missing required field (add the missing field)'
      );
    });

    it('should include file path when provided', () => {
      const ctx: ErrorContext = {
        command: 'validate',
        context: 'schema validation',
        issue: 'invalid structure',
        suggestion: 'fix the structure',
        filePath: '/path/to/module.module.yml',
      };

      const result = formatError(ctx);

      expect(result).toBe(
        '[ERROR] validate: schema validation - invalid structure (fix the structure)\n  File: /path/to/module.module.yml'
      );
    });

    it('should include key path when provided', () => {
      const ctx: ErrorContext = {
        command: 'build',
        context: 'field validation',
        issue: 'wrong type',
        suggestion: 'use correct type',
        keyPath: 'metadata.name',
      };

      const result = formatError(ctx);

      expect(result).toBe(
        '[ERROR] build: field validation - wrong type (use correct type)\n  Key path: metadata.name'
      );
    });

    it('should include section reference when provided', () => {
      const ctx: ErrorContext = {
        command: 'validate',
        context: 'specification compliance',
        issue: 'invalid format',
        suggestion: 'follow the specification',
        sectionReference: 'Section 4.2',
      };

      const result = formatError(ctx);

      expect(result).toBe(
        '[ERROR] validate: specification compliance - invalid format (follow the specification)\n  Reference: UMS v1.0 Section 4.2'
      );
    });

    it('should include all optional fields when provided', () => {
      const ctx: ErrorContext = {
        command: 'build',
        context: 'module processing',
        issue: 'validation failed',
        suggestion: 'check the documentation',
        filePath: '/modules/test.module.yml',
        keyPath: 'frontmatter.schema',
        sectionReference: 'Section 3.1',
      };

      const result = formatError(ctx);

      expect(result).toBe(
        '[ERROR] build: module processing - validation failed (check the documentation)\n  File: /modules/test.module.yml\n  Key path: frontmatter.schema\n  Reference: UMS v1.0 Section 3.1'
      );
    });

    it('should handle empty strings in context', () => {
      const ctx: ErrorContext = {
        command: '',
        context: '',
        issue: '',
        suggestion: '',
      };

      const result = formatError(ctx);

      expect(result).toBe('[ERROR] :  -  ()');
    });
  });

  describe('formatCommandError', () => {
    it('should format basic command error', () => {
      const result = formatCommandError('list', 'operation failed');

      expect(result).toBe('[ERROR] list: operation failed');
    });

    it('should include file path when provided', () => {
      const result = formatCommandError(
        'build',
        'compilation failed',
        '/path/to/persona.persona.yml'
      );

      expect(result).toBe(
        '[ERROR] build: compilation failed\n  File: /path/to/persona.persona.yml'
      );
    });

    it('should handle empty command and message', () => {
      const result = formatCommandError('', '');

      expect(result).toBe('[ERROR] : ');
    });

    it('should handle undefined file path', () => {
      const result = formatCommandError(
        'search',
        'no results found',
        undefined
      );

      expect(result).toBe('[ERROR] search: no results found');
    });
  });

  describe('formatValidationError', () => {
    it('should format validation error with all required fields', () => {
      const result = formatValidationError(
        'validate',
        '/modules/test.module.yml',
        'missing name field',
        'add a name field'
      );

      expect(result).toBe(
        '[ERROR] validate: validation failed - missing name field (add a name field)\n  File: /modules/test.module.yml'
      );
    });

    it('should include key path when provided', () => {
      const result = formatValidationError(
        'build',
        '/modules/test.module.yml',
        'invalid type',
        'use correct type',
        'frontmatter.schema'
      );

      expect(result).toBe(
        '[ERROR] build: validation failed - invalid type (use correct type)\n  File: /modules/test.module.yml\n  Key path: frontmatter.schema'
      );
    });

    it('should include section reference when provided', () => {
      const result = formatValidationError(
        'validate',
        '/modules/test.module.yml',
        'invalid format',
        'follow specification',
        undefined,
        'Section 4.1'
      );

      expect(result).toBe(
        '[ERROR] validate: validation failed - invalid format (follow specification)\n  File: /modules/test.module.yml\n  Reference: UMS v1.0 Section 4.1'
      );
    });

    it('should include all optional parameters', () => {
      const result = formatValidationError(
        'build',
        '/modules/test.module.yml',
        'schema violation',
        'fix schema',
        'metadata.description',
        'Section 3.2'
      );

      expect(result).toBe(
        '[ERROR] build: validation failed - schema violation (fix schema)\n  File: /modules/test.module.yml\n  Key path: metadata.description\n  Reference: UMS v1.0 Section 3.2'
      );
    });
  });

  describe('formatWarning', () => {
    it('should format basic warning message', () => {
      const ctx: WarningContext = {
        command: 'build',
        context: 'module processing',
        issue: 'deprecated feature used',
      };

      const result = formatWarning(ctx);

      expect(result).toBe(
        '[WARN] build: module processing - deprecated feature used (continuing...)'
      );
    });

    it('should include file path when provided', () => {
      const ctx: WarningContext = {
        command: 'validate',
        context: 'compatibility check',
        issue: 'using old format',
        filePath: '/modules/legacy.module.yml',
      };

      const result = formatWarning(ctx);

      expect(result).toBe(
        '[WARN] validate: compatibility check - using old format (continuing...)\n  File: /modules/legacy.module.yml'
      );
    });

    it('should handle empty strings', () => {
      const ctx: WarningContext = {
        command: '',
        context: '',
        issue: '',
      };

      const result = formatWarning(ctx);

      expect(result).toBe('[WARN] :  -  (continuing...)');
    });
  });

  describe('formatInfo', () => {
    it('should format info message', () => {
      const ctx: InfoContext = {
        command: 'list',
        message: 'found 5 modules',
      };

      const result = formatInfo(ctx);

      expect(result).toBe('[INFO] list: found 5 modules');
    });

    it('should handle empty strings', () => {
      const ctx: InfoContext = {
        command: '',
        message: '',
      };

      const result = formatInfo(ctx);

      expect(result).toBe('[INFO] : ');
    });
  });

  describe('formatDeprecationWarning', () => {
    it('should format deprecation warning without replacement', () => {
      const result = formatDeprecationWarning(
        'build',
        'foundation/old-logic/deprecated-module'
      );

      expect(result).toBe(
        "[WARN] build: Module 'foundation/old-logic/deprecated-module' is deprecated. This module may be removed in a future version."
      );
    });

    it('should format deprecation warning with replacement', () => {
      const result = formatDeprecationWarning(
        'validate',
        'foundation/old-logic/deprecated-module',
        'foundation/logic/new-module'
      );

      expect(result).toBe(
        "[WARN] validate: Module 'foundation/old-logic/deprecated-module' is deprecated and has been replaced by 'foundation/logic/new-module'. Please update your persona file to use the replacement module."
      );
    });

    it('should include file path when provided', () => {
      const result = formatDeprecationWarning(
        'build',
        'foundation/old-logic/deprecated-module',
        'foundation/logic/new-module',
        '/personas/test.persona.yml'
      );

      expect(result).toBe(
        "[WARN] build: Module 'foundation/old-logic/deprecated-module' is deprecated and has been replaced by 'foundation/logic/new-module'. Please update your persona file to use the replacement module.\n  File: /personas/test.persona.yml"
      );
    });

    it('should handle empty module ID', () => {
      const result = formatDeprecationWarning('build', '');

      expect(result).toBe(
        "[WARN] build: Module '' is deprecated. This module may be removed in a future version."
      );
    });
  });

  describe('ID_VALIDATION_ERRORS', () => {
    describe('invalidFormat', () => {
      it('should return formatted invalid format message', () => {
        const result = ID_VALIDATION_ERRORS.invalidFormat('invalid-id');

        expect(result).toBe(
          "Module ID 'invalid-id' does not match required format '<tier>/<subject>/<module-name>'"
        );
      });
    });

    describe('invalidTier', () => {
      it('should return formatted invalid tier message', () => {
        const validTiers = [
          'foundation',
          'principle',
          'technology',
          'execution',
        ];
        const result = ID_VALIDATION_ERRORS.invalidTier('invalid', validTiers);

        expect(result).toBe(
          "Tier 'invalid' is invalid. Must be one of: foundation, principle, technology, execution"
        );
      });

      it('should handle single tier', () => {
        const result = ID_VALIDATION_ERRORS.invalidTier('wrong', [
          'foundation',
        ]);

        expect(result).toBe(
          "Tier 'wrong' is invalid. Must be one of: foundation"
        );
      });

      it('should handle empty valid tiers array', () => {
        const result = ID_VALIDATION_ERRORS.invalidTier('any', []);

        expect(result).toBe("Tier 'any' is invalid. Must be one of: ");
      });
    });

    describe('emptySegment', () => {
      it('should return formatted empty segment message', () => {
        const result = ID_VALIDATION_ERRORS.emptySegment('foundation//module');

        expect(result).toBe(
          "Module ID 'foundation//module' contains empty segments (double slashes or leading/trailing slashes)"
        );
      });
    });

    describe('invalidCharacters', () => {
      it('should return formatted invalid characters message', () => {
        const result = ID_VALIDATION_ERRORS.invalidCharacters(
          'foundation/logic/test_module'
        );

        expect(result).toBe(
          "Module ID 'foundation/logic/test_module' contains invalid characters. Only lowercase letters, numbers, and hyphens are allowed"
        );
      });
    });

    describe('uppercaseCharacters', () => {
      it('should return formatted uppercase characters message', () => {
        const result = ID_VALIDATION_ERRORS.uppercaseCharacters(
          'Foundation/logic/module'
        );

        expect(result).toBe(
          "Module ID 'Foundation/logic/module' contains uppercase characters. All segments must be lowercase"
        );
      });
    });

    describe('invalidModuleName', () => {
      it('should return formatted invalid module name message', () => {
        const result = ID_VALIDATION_ERRORS.invalidModuleName('-invalid-start');

        expect(result).toBe(
          "Module name '-invalid-start' is invalid. Must start with a letter or number and contain only lowercase letters, numbers, and hyphens"
        );
      });
    });
  });

  describe('SCHEMA_VALIDATION_ERRORS', () => {
    describe('missingField', () => {
      it('should return formatted missing field message', () => {
        const result = SCHEMA_VALIDATION_ERRORS.missingField('name');

        expect(result).toBe("Required field 'name' is missing");
      });
    });

    describe('wrongType', () => {
      it('should return formatted wrong type message', () => {
        const result = SCHEMA_VALIDATION_ERRORS.wrongType(
          'description',
          'string',
          'number'
        );

        expect(result).toBe("Field 'description' must be string, got number");
      });
    });

    describe('wrongSchemaVersion', () => {
      it('should return formatted wrong schema version message', () => {
        const result = SCHEMA_VALIDATION_ERRORS.wrongSchemaVersion('0.5');

        expect(result).toBe("Schema version must be '1.0', got '0.5'");
      });
    });

    describe('undeclaredDirective', () => {
      it('should return formatted undeclared directive message', () => {
        const declared = ['goal', 'process', 'constraints'];
        const result = SCHEMA_VALIDATION_ERRORS.undeclaredDirective(
          'invalid',
          declared
        );

        expect(result).toBe(
          "Directive 'invalid' is not declared. Declared directives: goal, process, constraints"
        );
      });

      it('should handle empty declared array', () => {
        const result = SCHEMA_VALIDATION_ERRORS.undeclaredDirective('test', []);

        expect(result).toBe(
          "Directive 'test' is not declared. Declared directives: "
        );
      });
    });

    describe('missingRequiredDirective', () => {
      it('should return formatted missing required directive message', () => {
        const result =
          SCHEMA_VALIDATION_ERRORS.missingRequiredDirective('goal');

        expect(result).toBe("Required directive 'goal' is missing from body");
      });
    });

    describe('invalidDirectiveType', () => {
      it('should return formatted invalid directive type message', () => {
        const result = SCHEMA_VALIDATION_ERRORS.invalidDirectiveType(
          'goal',
          'string'
        );

        expect(result).toBe("Directive 'goal' must be string");
      });
    });

    describe('duplicateModuleId', () => {
      it('should return formatted duplicate module ID message', () => {
        const result = SCHEMA_VALIDATION_ERRORS.duplicateModuleId(
          'foundation/logic/reasoning',
          'core-group'
        );

        expect(result).toBe(
          "Module ID 'foundation/logic/reasoning' appears multiple times in group 'core-group'. Each ID must be unique within a group."
        );
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null and undefined values gracefully', () => {
      const ctx: ErrorContext = {
        command: 'test',
        context: 'null test',
        issue: 'null issue',
        suggestion: 'handle nulls',
      };

      const result = formatError(ctx);

      expect(result).toBe(
        '[ERROR] test: null test - null issue (handle nulls)'
      );
    });

    it('should handle very long messages', () => {
      const longMessage = 'a'.repeat(1000);
      const ctx: ErrorContext = {
        command: 'test',
        context: longMessage,
        issue: longMessage,
        suggestion: longMessage,
      };

      const result = formatError(ctx);

      expect(result).toContain(longMessage);
      expect(result.length).toBeGreaterThan(3000);
    });

    it('should handle special characters in messages', () => {
      const specialChars = 'test with "quotes" and \n newlines \t tabs';
      const ctx: ErrorContext = {
        command: 'test',
        context: specialChars,
        issue: specialChars,
        suggestion: specialChars,
      };

      const result = formatError(ctx);

      expect(result).toContain(specialChars);
    });
  });
});
