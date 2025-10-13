import { describe, it, expect } from 'vitest';
import {
  detectUMSVersion,
  isTypeScriptUMSFile,
  isYAMLUMSFile,
} from './typescript-loader.js';

describe('TypeScript Loader Utilities', () => {
  describe('detectUMSVersion', () => {
    it('should detect v2.0 from .module.ts files', () => {
      expect(detectUMSVersion('/path/to/error-handling.module.ts')).toBe('2.0');
    });

    it('should detect v2.0 from .persona.ts files', () => {
      expect(detectUMSVersion('/path/to/engineer.persona.ts')).toBe('2.0');
    });

    it('should detect v1.0 from .module.yml files', () => {
      expect(detectUMSVersion('/path/to/error-handling.module.yml')).toBe(
        '1.0'
      );
    });

    it('should detect v1.0 from .persona.yml files', () => {
      expect(detectUMSVersion('/path/to/engineer.persona.yml')).toBe('1.0');
    });

    it('should throw for unknown file formats', () => {
      expect(() => detectUMSVersion('/path/to/file.txt')).toThrow(
        'Unknown UMS file format'
      );
    });
  });

  describe('isTypeScriptUMSFile', () => {
    it('should return true for .module.ts files', () => {
      expect(isTypeScriptUMSFile('error-handling.module.ts')).toBe(true);
    });

    it('should return true for .persona.ts files', () => {
      expect(isTypeScriptUMSFile('engineer.persona.ts')).toBe(true);
    });

    it('should return false for .yml files', () => {
      expect(isTypeScriptUMSFile('error-handling.module.yml')).toBe(false);
    });

    it('should return false for other files', () => {
      expect(isTypeScriptUMSFile('file.ts')).toBe(false);
    });
  });

  describe('isYAMLUMSFile', () => {
    it('should return true for .module.yml files', () => {
      expect(isYAMLUMSFile('error-handling.module.yml')).toBe(true);
    });

    it('should return true for .persona.yml files', () => {
      expect(isYAMLUMSFile('engineer.persona.yml')).toBe(true);
    });

    it('should return false for .ts files', () => {
      expect(isYAMLUMSFile('error-handling.module.ts')).toBe(false);
    });

    it('should return false for other files', () => {
      expect(isYAMLUMSFile('file.yml')).toBe(false);
    });
  });
});
