import { describe, it, expect } from 'vitest';
import { isTypeScriptUMSFile } from './typescript-loader.js';

describe('TypeScript Loader Utilities', () => {
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
});
