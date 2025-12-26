/**
 * Schema Tests
 *
 * Tests Zod input validation for all MCP tool schemas.
 */

import { describe, it, expect } from 'vitest';
import {
  BuildPersonaInputSchema,
  ListModulesInputSchema,
  ValidateModulesInputSchema,
  SearchModulesInputSchema,
} from './index.js';

describe('BuildPersonaInputSchema', () => {
  it('accepts valid input with required fields', () => {
    const result = BuildPersonaInputSchema.safeParse({
      personaPath: './personas/test.persona.ts',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.personaPath).toBe('./personas/test.persona.ts');
      expect(result.data.includeStandard).toBe(true); // default
      expect(result.data.emitDeclarations).toBe(false); // default
    }
  });

  it('accepts valid input with all fields', () => {
    const result = BuildPersonaInputSchema.safeParse({
      personaPath: './personas/test.persona.ts',
      includeStandard: false,
      emitDeclarations: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.includeStandard).toBe(false);
      expect(result.data.emitDeclarations).toBe(true);
    }
  });

  it('rejects empty personaPath', () => {
    const result = BuildPersonaInputSchema.safeParse({
      personaPath: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Persona path is required');
    }
  });

  it('rejects missing personaPath', () => {
    const result = BuildPersonaInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects unknown fields (strict mode)', () => {
    const result = BuildPersonaInputSchema.safeParse({
      personaPath: './test.persona.ts',
      unknownField: 'value',
    });
    expect(result.success).toBe(false);
  });
});

describe('ListModulesInputSchema', () => {
  it('accepts empty input with defaults', () => {
    const result = ListModulesInputSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.includeStandard).toBe(true);
      expect(result.data.capability).toBeUndefined();
      expect(result.data.tag).toBeUndefined();
    }
  });

  it('accepts valid input with all optional fields', () => {
    const result = ListModulesInputSchema.safeParse({
      capability: 'reasoning',
      tag: 'core',
      includeStandard: false,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.capability).toBe('reasoning');
      expect(result.data.tag).toBe('core');
      expect(result.data.includeStandard).toBe(false);
    }
  });

  it('rejects unknown fields (strict mode)', () => {
    const result = ListModulesInputSchema.safeParse({
      extraField: 'value',
    });
    expect(result.success).toBe(false);
  });
});

describe('ValidateModulesInputSchema', () => {
  it('accepts empty input with defaults', () => {
    const result = ValidateModulesInputSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.includePersonas).toBe(true);
      expect(result.data.includeStandard).toBe(true);
    }
  });

  it('accepts valid input with all fields', () => {
    const result = ValidateModulesInputSchema.safeParse({
      includePersonas: false,
      includeStandard: false,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.includePersonas).toBe(false);
      expect(result.data.includeStandard).toBe(false);
    }
  });

  it('rejects unknown fields (strict mode)', () => {
    const result = ValidateModulesInputSchema.safeParse({
      unknownOption: true,
    });
    expect(result.success).toBe(false);
  });
});

describe('SearchModulesInputSchema', () => {
  it('accepts valid input with required fields', () => {
    const result = SearchModulesInputSchema.safeParse({
      query: 'error handling',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.query).toBe('error handling');
      expect(result.data.limit).toBe(10); // default
      expect(result.data.capability).toBeUndefined();
    }
  });

  it('accepts valid input with all fields', () => {
    const result = SearchModulesInputSchema.safeParse({
      query: 'typescript',
      capability: 'coding',
      limit: 25,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.query).toBe('typescript');
      expect(result.data.capability).toBe('coding');
      expect(result.data.limit).toBe(25);
    }
  });

  it('rejects empty query', () => {
    const result = SearchModulesInputSchema.safeParse({
      query: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Search query is required');
    }
  });

  it('rejects missing query', () => {
    const result = SearchModulesInputSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects limit below 1', () => {
    const result = SearchModulesInputSchema.safeParse({
      query: 'test',
      limit: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rejects limit above 100', () => {
    const result = SearchModulesInputSchema.safeParse({
      query: 'test',
      limit: 101,
    });
    expect(result.success).toBe(false);
  });

  it('rejects non-integer limit', () => {
    const result = SearchModulesInputSchema.safeParse({
      query: 'test',
      limit: 10.5,
    });
    expect(result.success).toBe(false);
  });

  it('accepts boundary limit values', () => {
    const result1 = SearchModulesInputSchema.safeParse({ query: 'test', limit: 1 });
    const result100 = SearchModulesInputSchema.safeParse({ query: 'test', limit: 100 });
    expect(result1.success).toBe(true);
    expect(result100.success).toBe(true);
  });

  it('rejects unknown fields (strict mode)', () => {
    const result = SearchModulesInputSchema.safeParse({
      query: 'test',
      unknownField: 'value',
    });
    expect(result.success).toBe(false);
  });
});
