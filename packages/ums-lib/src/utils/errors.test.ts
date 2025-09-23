import { describe, it, expect } from 'vitest';
import {
  UMSError,
  UMSValidationError,
  ModuleLoadError,
  PersonaLoadError,
  BuildError,
  isUMSError,
  isValidationError,
  ID_VALIDATION_ERRORS,
  SCHEMA_VALIDATION_ERRORS,
} from './errors.js';

describe('errors', () => {
  describe('UMSError', () => {
    it('should create basic UMS error', () => {
      const error = new UMSError('test message', 'TEST_CODE');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(UMSError);
      expect(error.name).toBe('UMSError');
      expect(error.message).toBe('test message');
      expect(error.code).toBe('TEST_CODE');
      expect(error.context).toBeUndefined();
    });

    it('should create UMS error with context', () => {
      const error = new UMSError('test message', 'TEST_CODE', 'test context');

      expect(error.message).toBe('test message');
      expect(error.code).toBe('TEST_CODE');
      expect(error.context).toBe('test context');
    });

    it('should handle empty strings', () => {
      const error = new UMSError('', '', '');

      expect(error.message).toBe('');
      expect(error.code).toBe('');
      expect(error.context).toBe('');
    });

    it('should handle undefined context explicitly', () => {
      const error = new UMSError('test', 'CODE', undefined);

      expect(error.context).toBeUndefined();
    });

    it('should maintain error stack trace', () => {
      const error = new UMSError('test', 'CODE');

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('UMSError');
    });
  });

  describe('UMSValidationError', () => {
    it('should create basic validation error', () => {
      const error = new UMSValidationError('validation failed');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(UMSError);
      expect(error).toBeInstanceOf(UMSValidationError);
      expect(error.name).toBe('UMSValidationError');
      expect(error.message).toBe('validation failed');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.path).toBeUndefined();
      expect(error.section).toBeUndefined();
      expect(error.context).toBeUndefined();
    });

    it('should create validation error with path', () => {
      const error = new UMSValidationError(
        'validation failed',
        'frontmatter.name'
      );

      expect(error.path).toBe('frontmatter.name');
      expect(error.section).toBeUndefined();
      expect(error.context).toBeUndefined();
    });

    it('should create validation error with section', () => {
      const error = new UMSValidationError(
        'validation failed',
        undefined,
        'Section 4.1'
      );

      expect(error.path).toBeUndefined();
      expect(error.section).toBe('Section 4.1');
      expect(error.context).toBeUndefined();
    });

    it('should create validation error with context', () => {
      const error = new UMSValidationError(
        'validation failed',
        undefined,
        undefined,
        'module parsing'
      );

      expect(error.path).toBeUndefined();
      expect(error.section).toBeUndefined();
      expect(error.context).toBe('module parsing');
    });

    it('should create validation error with all optional parameters', () => {
      const error = new UMSValidationError(
        'validation failed',
        'metadata.description',
        'Section 3.2',
        'schema validation'
      );

      expect(error.message).toBe('validation failed');
      expect(error.path).toBe('metadata.description');
      expect(error.section).toBe('Section 3.2');
      expect(error.context).toBe('schema validation');
      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should handle explicitly undefined parameters', () => {
      const error = new UMSValidationError(
        'test',
        undefined,
        undefined,
        undefined
      );

      expect(error.path).toBeUndefined();
      expect(error.section).toBeUndefined();
      expect(error.context).toBeUndefined();
    });
  });

  describe('ModuleLoadError', () => {
    it('should create basic module load error', () => {
      const error = new ModuleLoadError('failed to load module');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(UMSError);
      expect(error).toBeInstanceOf(ModuleLoadError);
      expect(error.name).toBe('ModuleLoadError');
      expect(error.message).toBe('failed to load module');
      expect(error.code).toBe('MODULE_LOAD_ERROR');
      expect(error.filePath).toBeUndefined();
      expect(error.context).toBeUndefined();
    });

    it('should create module load error with file path', () => {
      const error = new ModuleLoadError(
        'failed to load module',
        '/path/to/module.module.yml'
      );

      expect(error.filePath).toBe('/path/to/module.module.yml');
      expect(error.context).toBeUndefined();
    });

    it('should create module load error with context', () => {
      const error = new ModuleLoadError(
        'failed to load module',
        undefined,
        'YAML parsing'
      );

      expect(error.filePath).toBeUndefined();
      expect(error.context).toBe('YAML parsing');
    });

    it('should create module load error with all parameters', () => {
      const error = new ModuleLoadError(
        'failed to load module',
        '/path/to/module.module.yml',
        'file system error'
      );

      expect(error.message).toBe('failed to load module');
      expect(error.filePath).toBe('/path/to/module.module.yml');
      expect(error.context).toBe('file system error');
      expect(error.code).toBe('MODULE_LOAD_ERROR');
    });
  });

  describe('PersonaLoadError', () => {
    it('should create basic persona load error', () => {
      const error = new PersonaLoadError('failed to load persona');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(UMSError);
      expect(error).toBeInstanceOf(PersonaLoadError);
      expect(error.name).toBe('PersonaLoadError');
      expect(error.message).toBe('failed to load persona');
      expect(error.code).toBe('PERSONA_LOAD_ERROR');
      expect(error.filePath).toBeUndefined();
      expect(error.context).toBeUndefined();
    });

    it('should create persona load error with file path', () => {
      const error = new PersonaLoadError(
        'failed to load persona',
        '/path/to/persona.persona.yml'
      );

      expect(error.filePath).toBe('/path/to/persona.persona.yml');
    });

    it('should create persona load error with all parameters', () => {
      const error = new PersonaLoadError(
        'failed to load persona',
        '/path/to/persona.persona.yml',
        'schema validation'
      );

      expect(error.message).toBe('failed to load persona');
      expect(error.filePath).toBe('/path/to/persona.persona.yml');
      expect(error.context).toBe('schema validation');
      expect(error.code).toBe('PERSONA_LOAD_ERROR');
    });
  });

  describe('BuildError', () => {
    it('should create basic build error', () => {
      const error = new BuildError('build failed');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(UMSError);
      expect(error).toBeInstanceOf(BuildError);
      expect(error.name).toBe('BuildError');
      expect(error.message).toBe('build failed');
      expect(error.code).toBe('BUILD_ERROR');
      expect(error.context).toBeUndefined();
    });

    it('should create build error with context', () => {
      const error = new BuildError('build failed', 'persona compilation');

      expect(error.message).toBe('build failed');
      expect(error.context).toBe('persona compilation');
      expect(error.code).toBe('BUILD_ERROR');
    });
  });

  describe('Type Guards', () => {
    describe('isUMSError', () => {
      it('should return true for UMSError instances', () => {
        const error = new UMSError('test', 'CODE');

        expect(isUMSError(error)).toBe(true);
      });

      it('should return true for UMSError subclasses', () => {
        const validationError = new UMSValidationError('test');
        const moduleLoadError = new ModuleLoadError('test');
        const personaLoadError = new PersonaLoadError('test');
        const buildError = new BuildError('test');

        expect(isUMSError(validationError)).toBe(true);
        expect(isUMSError(moduleLoadError)).toBe(true);
        expect(isUMSError(personaLoadError)).toBe(true);
        expect(isUMSError(buildError)).toBe(true);
      });

      it('should return false for regular Error instances', () => {
        const error = new Error('test');

        expect(isUMSError(error)).toBe(false);
      });

      it('should return false for non-error values', () => {
        expect(isUMSError(null)).toBe(false);
        expect(isUMSError(undefined)).toBe(false);
        expect(isUMSError('string')).toBe(false);
        expect(isUMSError(123)).toBe(false);
        expect(isUMSError({})).toBe(false);
        expect(isUMSError([])).toBe(false);
      });

      it('should return false for objects that look like UMSError but are not', () => {
        const fakeError = {
          name: 'UMSError',
          message: 'test',
          code: 'TEST',
        };

        expect(isUMSError(fakeError)).toBe(false);
      });
    });

    describe('isValidationError', () => {
      it('should return true for UMSValidationError instances', () => {
        const error = new UMSValidationError('test');

        expect(isValidationError(error)).toBe(true);
      });

      it('should return false for other UMSError subclasses', () => {
        const moduleLoadError = new ModuleLoadError('test');
        const personaLoadError = new PersonaLoadError('test');
        const buildError = new BuildError('test');
        const umsError = new UMSError('test', 'CODE');

        expect(isValidationError(moduleLoadError)).toBe(false);
        expect(isValidationError(personaLoadError)).toBe(false);
        expect(isValidationError(buildError)).toBe(false);
        expect(isValidationError(umsError)).toBe(false);
      });

      it('should return false for regular Error instances', () => {
        const error = new Error('test');

        expect(isValidationError(error)).toBe(false);
      });

      it('should return false for non-error values', () => {
        expect(isValidationError(null)).toBe(false);
        expect(isValidationError(undefined)).toBe(false);
        expect(isValidationError('string')).toBe(false);
        expect(isValidationError(123)).toBe(false);
        expect(isValidationError({})).toBe(false);
        expect(isValidationError([])).toBe(false);
      });
    });
  });

  describe('ID_VALIDATION_ERRORS', () => {
    it('should have constant string values', () => {
      expect(ID_VALIDATION_ERRORS.INVALID_CHARS).toBe(
        'Module ID contains invalid characters'
      );
      expect(ID_VALIDATION_ERRORS.EMPTY_SEGMENT).toBe(
        'Module ID contains empty path segment'
      );
      expect(ID_VALIDATION_ERRORS.LEADING_SLASH).toBe(
        'Module ID cannot start with a slash'
      );
      expect(ID_VALIDATION_ERRORS.TRAILING_SLASH).toBe(
        'Module ID cannot end with a slash'
      );
      expect(ID_VALIDATION_ERRORS.CONSECUTIVE_SLASHES).toBe(
        'Module ID cannot contain consecutive slashes'
      );
    });

    describe('Function-based error messages', () => {
      describe('invalidFormat', () => {
        it('should return formatted invalid format message', () => {
          const result = ID_VALIDATION_ERRORS.invalidFormat('bad-id');

          expect(result).toBe('Invalid module ID format: bad-id');
        });
      });

      describe('uppercaseCharacters', () => {
        it('should return formatted uppercase characters message', () => {
          const result =
            ID_VALIDATION_ERRORS.uppercaseCharacters('Foundation/module');

          expect(result).toBe(
            'Module ID contains uppercase characters: Foundation/module'
          );
        });
      });

      describe('specialCharacters', () => {
        it('should return formatted special characters message', () => {
          const result = ID_VALIDATION_ERRORS.specialCharacters(
            'foundation/logic/test@module'
          );

          expect(result).toBe(
            'Module ID contains special characters: foundation/logic/test@module'
          );
        });
      });

      describe('invalidTier', () => {
        it('should return formatted invalid tier message', () => {
          const result = ID_VALIDATION_ERRORS.invalidTier('invalid');

          expect(result).toBe(
            "Invalid tier 'invalid'. Must be one of: foundation, principle, technology, execution"
          );
        });
      });

      describe('emptySegment', () => {
        it('should return formatted empty segment message', () => {
          const result =
            ID_VALIDATION_ERRORS.emptySegment('foundation//module');

          expect(result).toBe(
            "Module ID 'foundation//module' contains empty path segment"
          );
        });
      });

      describe('invalidCharacters', () => {
        it('should return formatted invalid characters message', () => {
          const result = ID_VALIDATION_ERRORS.invalidCharacters(
            'foundation/logic/test_module'
          );

          expect(result).toBe(
            "Module ID 'foundation/logic/test_module' contains invalid characters"
          );
        });
      });
    });
  });

  describe('SCHEMA_VALIDATION_ERRORS', () => {
    it('should have constant string values', () => {
      expect(SCHEMA_VALIDATION_ERRORS.MISSING_FRONTMATTER).toBe(
        'Module file must contain YAML frontmatter'
      );
      expect(SCHEMA_VALIDATION_ERRORS.INVALID_YAML).toBe(
        'Invalid YAML syntax in frontmatter'
      );
      expect(SCHEMA_VALIDATION_ERRORS.MISSING_REQUIRED_FIELD).toBe(
        'Missing required field'
      );
      expect(SCHEMA_VALIDATION_ERRORS.INVALID_FIELD_TYPE).toBe(
        'Invalid field type'
      );
      expect(SCHEMA_VALIDATION_ERRORS.INVALID_ENUM_VALUE).toBe(
        'Invalid enum value'
      );
    });

    describe('Function-based error messages', () => {
      describe('missingField', () => {
        it('should return formatted missing field message', () => {
          const result = SCHEMA_VALIDATION_ERRORS.missingField('name');

          expect(result).toBe('Missing required field: name');
        });
      });

      describe('wrongType', () => {
        it('should return formatted wrong type message', () => {
          const result = SCHEMA_VALIDATION_ERRORS.wrongType(
            'description',
            'string',
            'number'
          );

          expect(result).toBe(
            "Field 'description' expected string, got number"
          );
        });
      });

      describe('duplicateModuleId', () => {
        it('should return formatted duplicate module ID message', () => {
          const result = SCHEMA_VALIDATION_ERRORS.duplicateModuleId(
            'foundation/logic/reasoning',
            'core'
          );

          expect(result).toBe(
            "Duplicate module ID 'foundation/logic/reasoning' in group 'core'"
          );
        });
      });

      describe('invalidEnumValue', () => {
        it('should return formatted invalid enum value message', () => {
          const validValues = ['procedure', 'specification', 'pattern'];
          const result = SCHEMA_VALIDATION_ERRORS.invalidEnumValue(
            'schema',
            'invalid',
            validValues
          );

          expect(result).toBe(
            "Invalid value 'invalid' for schema. Valid values: procedure, specification, pattern"
          );
        });
      });

      describe('wrongSchemaVersion', () => {
        it('should return formatted wrong schema version message', () => {
          const result = SCHEMA_VALIDATION_ERRORS.wrongSchemaVersion('0.5');

          expect(result).toBe("Invalid schema version '0.5', expected '1.0'");
        });
      });

      describe('invalidShape', () => {
        it('should return formatted invalid shape message', () => {
          const validShapes = [
            'procedure',
            'specification',
            'pattern',
            'checklist',
            'data',
            'rule',
          ];
          const result = SCHEMA_VALIDATION_ERRORS.invalidShape(
            'unknown',
            validShapes
          );

          expect(result).toBe(
            "Invalid shape 'unknown'. Valid shapes: procedure, specification, pattern, checklist, data, rule"
          );
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
            "Undeclared directive 'invalid'. Declared directives: goal, process, constraints"
          );
        });
      });

      describe('missingRequiredDirective', () => {
        it('should return formatted missing required directive message', () => {
          const result =
            SCHEMA_VALIDATION_ERRORS.missingRequiredDirective('goal');

          expect(result).toBe('Missing required directive: goal');
        });
      });

      describe('invalidDirectiveType', () => {
        it('should return formatted invalid directive type message', () => {
          const result = SCHEMA_VALIDATION_ERRORS.invalidDirectiveType(
            'goal',
            'string',
            'number'
          );

          expect(result).toBe("Directive 'goal' expected string, got number");
        });
      });
    });
  });

  describe('Error Chaining and Inheritance', () => {
    it('should properly chain error causes', () => {
      const originalError = new Error('original error');
      const umsError = new UMSError('wrapped error', 'WRAP_ERROR');
      umsError.cause = originalError;

      expect(umsError.cause).toBe(originalError);
    });

    it('should maintain instanceof relationships', () => {
      const validationError = new UMSValidationError('test');

      expect(validationError instanceof Error).toBe(true);
      expect(validationError instanceof UMSError).toBe(true);
      expect(validationError instanceof UMSValidationError).toBe(true);
    });

    it('should have proper constructor names', () => {
      const errors = [
        new UMSError('test', 'CODE'),
        new UMSValidationError('test'),
        new ModuleLoadError('test'),
        new PersonaLoadError('test'),
        new BuildError('test'),
      ];

      expect(errors[0].constructor.name).toBe('UMSError');
      expect(errors[1].constructor.name).toBe('UMSValidationError');
      expect(errors[2].constructor.name).toBe('ModuleLoadError');
      expect(errors[3].constructor.name).toBe('PersonaLoadError');
      expect(errors[4].constructor.name).toBe('BuildError');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long error messages', () => {
      const longMessage = 'a'.repeat(10000);
      const error = new UMSError(longMessage, 'LONG_MESSAGE');

      expect(error.message).toBe(longMessage);
      expect(error.message.length).toBe(10000);
    });

    it('should handle special characters in error messages', () => {
      const specialMessage = 'Error with "quotes" and \n newlines \t tabs';
      const error = new UMSValidationError(specialMessage);

      expect(error.message).toBe(specialMessage);
    });

    it('should handle Unicode characters', () => {
      const unicodeMessage = 'Error with unicode: 🚨 ñáéíóú 中文';
      const error = new BuildError(unicodeMessage);

      expect(error.message).toBe(unicodeMessage);
    });
  });
});
