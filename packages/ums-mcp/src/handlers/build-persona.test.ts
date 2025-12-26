/**
 * Build Persona Handler Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBuildPersonaHandler } from './build-persona.js';
import type { PersonaService } from '../services/persona-service.js';
import type { BuildResult } from 'ums-sdk';

const createMockBuildResult = (): BuildResult => ({
  markdown: '# Test Persona\n\nContent here.',
  persona: {
    id: 'test-persona',
    name: 'Test Persona',
    version: '1.0.0',
    schemaVersion: '2.1',
    description: 'A test persona',
    modules: ['mod-1'],
  },
  modules: [
    {
      id: 'mod-1',
      version: '1.0.0',
      schemaVersion: '2.1',
      capabilities: ['reasoning'],
      cognitiveLevel: 1,
      metadata: { name: 'Module One', description: 'First module', semantic: '' },
      instruction: { purpose: '', process: [], constraints: [] },
      knowledge: { explanation: '', concepts: [], patterns: [] },
    },
  ],
  buildReport: {
    personaDigest: 'abc123',
    buildTimestamp: '2024-01-01T00:00:00Z',
    moduleDigests: {},
  },
  warnings: [],
});

describe('createBuildPersonaHandler', () => {
  let mockService: PersonaService;
  let handler: ReturnType<typeof createBuildPersonaHandler>;

  beforeEach(() => {
    mockService = {
      build: vi.fn(),
    } as unknown as PersonaService;
    handler = createBuildPersonaHandler(mockService);
  });

  it('calls service with personaPath and options', async () => {
    const mockResult = createMockBuildResult();
    vi.mocked(mockService.build).mockResolvedValue(mockResult);

    await handler({
      personaPath: './test.persona.ts',
      includeStandard: false,
      emitDeclarations: true,
    });

    expect(mockService.build).toHaveBeenCalledWith('./test.persona.ts', {
      includeStandard: false,
      emitDeclarations: true,
    });
  });

  it('returns MCP response with text content', async () => {
    const mockResult = createMockBuildResult();
    vi.mocked(mockService.build).mockResolvedValue(mockResult);

    const response = await handler({
      personaPath: './test.persona.ts',
      includeStandard: true,
      emitDeclarations: false,
    });

    expect(response.content).toHaveLength(1);
    expect(response.content[0].type).toBe('text');
    expect(response.content[0].text).toContain('# Build Result: Test Persona');
  });

  it('returns structured content with persona info', async () => {
    const mockResult = createMockBuildResult();
    vi.mocked(mockService.build).mockResolvedValue(mockResult);

    const response = await handler({
      personaPath: './test.persona.ts',
      includeStandard: true,
      emitDeclarations: false,
    });

    expect(response.structuredContent).toBeDefined();
    expect(response.structuredContent.success).toBe(true);
    expect(response.structuredContent.persona.name).toBe('Test Persona');
    expect(response.structuredContent.modulesCount).toBe(1);
  });

  it('propagates errors from service', async () => {
    vi.mocked(mockService.build).mockRejectedValue(new Error('Build failed'));

    await expect(
      handler({
        personaPath: './invalid.persona.ts',
        includeStandard: true,
        emitDeclarations: false,
      })
    ).rejects.toThrow('Build failed');
  });

  it('handles warnings in result', async () => {
    const mockResult = createMockBuildResult();
    mockResult.warnings = ['Warning 1', 'Warning 2'];
    vi.mocked(mockService.build).mockResolvedValue(mockResult);

    const response = await handler({
      personaPath: './test.persona.ts',
      includeStandard: true,
      emitDeclarations: false,
    });

    expect(response.content[0].text).toContain('Warning 1');
    expect(response.structuredContent.warnings).toEqual(['Warning 1', 'Warning 2']);
  });
});
