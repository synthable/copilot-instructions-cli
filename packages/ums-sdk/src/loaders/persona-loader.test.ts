/* eslint-disable vitest/expect-expect */
import { describe, it } from 'vitest';

describe.skip('PersonaLoader', () => {
  describe('constructor', () => {
    it('should create a PersonaLoader instance');

    it('should initialize with default options');
  });

  describe('loadPersona', () => {
    it('should load a .persona.ts file');

    it('should execute TypeScript on-the-fly with tsx');

    it('should extract default export');

    it('should extract named export when no default');

    it('should validate Persona structure');

    it('should return parsed Persona object');

    it('should throw error when file does not exist');

    it('should throw error when no valid Persona export found');

    it('should throw error when Persona structure invalid');

    it('should handle TypeScript syntax errors gracefully');
  });

  describe('loadPersonaWithModules', () => {
    it('should load persona and resolve all modules');

    it('should use ModuleLoader to load dependencies');

    it('should return Persona and Module array');

    it('should throw error when modules cannot be resolved');

    it('should handle missing module IDs gracefully');
  });
});
