/**
 * Persona Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PersonaService } from './persona-service.js';

// Mock ums-sdk
vi.mock('ums-sdk', () => ({
  buildPersona: vi.fn(),
}));

import { buildPersona } from 'ums-sdk';
import type { BuildResult } from 'ums-sdk';

const mockBuildPersona = vi.mocked(buildPersona);

const createMockBuildResult = (): BuildResult => ({
  markdown: '# Test',
  persona: {
    id: 'test',
    name: 'Test',
    version: '1.0.0',
    schemaVersion: '2.1',
    description: 'Test',
    modules: [],
  },
  modules: [],
  buildReport: {
    personaDigest: 'abc',
    buildTimestamp: '2024-01-01T00:00:00Z',
    moduleDigests: {},
  },
  warnings: [],
});

describe('PersonaService', () => {
  let service: PersonaService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new PersonaService();
  });

  describe('build', () => {
    it('delegates to buildPersona with path', async () => {
      const mockResult = createMockBuildResult();
      mockBuildPersona.mockResolvedValue(mockResult);

      const result = await service.build('./test.persona.ts');

      expect(mockBuildPersona).toHaveBeenCalledWith('./test.persona.ts', undefined);
      expect(result).toBe(mockResult);
    });

    it('passes options to buildPersona', async () => {
      const mockResult = createMockBuildResult();
      mockBuildPersona.mockResolvedValue(mockResult);

      const options = { includeStandard: false, emitDeclarations: true };
      await service.build('./test.persona.ts', options);

      expect(mockBuildPersona).toHaveBeenCalledWith('./test.persona.ts', options);
    });

    it('propagates errors from buildPersona', async () => {
      const error = new Error('Build failed');
      mockBuildPersona.mockRejectedValue(error);

      await expect(service.build('./invalid.persona.ts')).rejects.toThrow('Build failed');
    });

    it('returns full BuildResult structure', async () => {
      const mockResult = createMockBuildResult();
      mockResult.warnings = ['Warning 1'];
      mockBuildPersona.mockResolvedValue(mockResult);

      const result = await service.build('./test.persona.ts');

      expect(result.markdown).toBe('# Test');
      expect(result.warnings).toEqual(['Warning 1']);
      expect(result.buildReport.personaDigest).toBe('abc');
    });
  });
});
