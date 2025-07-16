import { describe, it, expect, vi, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import { parse } from 'jsonc-parser';
import { validatePersona, validatePersonaFile } from './persona-service.js';
import type { PersonaConfig } from '../types/index.js';

// Mock dependencies
vi.mock('fs', () => ({
  promises: {
    readFile: vi.fn(),
  },
}));

vi.mock('jsonc-parser', () => ({
  parse: vi.fn(),
}));

describe('validatePersona', () => {
  it('should return valid for a correct persona config', () => {
    const persona: PersonaConfig = {
      name: 'Test Persona',
      description: 'A persona for testing.',
      output: 'test.md',
      attributions: true,
      modules: ['foundation/logic/test'],
    };
    const result = validatePersona(persona);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should handle optional fields being undefined', () => {
    const persona: PersonaConfig = {
      name: 'Test Persona',
      modules: ['foundation/logic/test'],
    };
    const result = validatePersona(persona);
    expect(result.isValid).toBe(true);
  });

  it('should return invalid if name is missing', () => {
    const persona = {
      description: 'A persona for testing.',
      modules: ['foundation/logic/test'],
    } as unknown as PersonaConfig;
    const result = validatePersona(persona);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'The "name" field is required and must be a non-empty string.'
    );
  });

  it('should return invalid if description is an empty string', () => {
    const persona: PersonaConfig = {
      name: 'Test Persona',
      description: ' ',
      modules: ['foundation/logic/test'],
    };
    const result = validatePersona(persona);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'The "description" field must be a non-empty string.'
    );
  });

  it('should return invalid if output is an empty string', () => {
    const persona: PersonaConfig = {
      name: 'Test Persona',
      output: ' ',
      modules: ['foundation/logic/test'],
    };
    const result = validatePersona(persona);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'The "output" field must be a non-empty string.'
    );
  });

  it('should return invalid if modules is missing', () => {
    const persona = {
      name: 'Test Persona',
    } as unknown as PersonaConfig;
    const result = validatePersona(persona);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('The "modules" field is required.');
  });

  it('should return invalid if modules is an empty array', () => {
    const persona: PersonaConfig = {
      name: 'Test Persona',
      modules: [],
    };
    const result = validatePersona(persona);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'The "modules" field must be a non-empty array.'
    );
  });

  it('should return invalid if modules contains non-string items', () => {
    const persona = {
      name: 'Test Persona',
      modules: ['foundation/logic/test', 123],
    } as unknown as PersonaConfig;
    const result = validatePersona(persona);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'All items in the "modules" array must be non-empty strings.'
    );
  });

  it('should return invalid if attributions is not a boolean', () => {
    const persona = {
      name: 'Test Persona',
      modules: ['foundation/logic/test'],
      attributions: 'true',
    } as unknown as PersonaConfig;
    const result = validatePersona(persona);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'The "attributions" field must be a boolean.'
    );
  });
});

describe('validatePersonaFile', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return valid for a correct persona file', async () => {
    const filePath = 'my-persona.persona.jsonc';
    const fileContent = `{ "name": "Test", "modules": ["id"] }`;
    const personaConfig: PersonaConfig = {
      name: 'Test',
      modules: ['id'],
    };

    vi.mocked(fs.readFile).mockResolvedValue(fileContent);
    vi.mocked(parse).mockReturnValue(personaConfig);

    const result = await validatePersonaFile(filePath);

    expect(fs.readFile).toHaveBeenCalledWith(filePath, 'utf8');
    expect(parse).toHaveBeenCalledWith(fileContent);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.filePath).toBe(filePath);
  });

  it('should return invalid for a persona file with validation errors', async () => {
    const filePath = 'invalid-persona.persona.jsonc';
    const fileContent = `{ "name": "Test" }`; // Missing modules
    const personaConfig = { name: 'Test' } as PersonaConfig;

    vi.mocked(fs.readFile).mockResolvedValue(fileContent);
    vi.mocked(parse).mockReturnValue(personaConfig);

    const result = await validatePersonaFile(filePath);

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('The "modules" field is required.');
  });

  it('should handle file read errors gracefully', async () => {
    const filePath = 'non-existent-persona.persona.jsonc';
    const readError = new Error('File not found');
    vi.mocked(fs.readFile).mockRejectedValue(readError);

    const result = await validatePersonaFile(filePath);

    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain(
      `Failed to read or parse persona ${filePath}: ${readError.message}`
    );
  });

  it('should handle JSON parsing errors gracefully', async () => {
    const filePath = 'malformed-persona.persona.jsonc';
    const fileContent = `{ "name": "Test', }`; // Malformed JSON
    const parseError = new Error('Invalid JSON');
    vi.mocked(fs.readFile).mockResolvedValue(fileContent);
    vi.mocked(parse).mockImplementation(() => {
      throw parseError;
    });

    const result = await validatePersonaFile(filePath);

    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain(
      `Failed to read or parse persona ${filePath}: ${parseError.message}`
    );
  });
});
