/**
 * Build Result Formatter Tests
 */

import { describe, it, expect } from 'vitest';
import {
  formatBuildResultMarkdown,
  formatBuildResultStructured,
} from './build-result.js';
import type { BuildResult } from 'ums-sdk';

// Mock BuildResult for testing
const createMockBuildResult = (overrides: Partial<BuildResult> = {}): BuildResult => ({
  markdown: '# Test Persona\n\nThis is test markdown content.',
  persona: {
    id: 'test-persona',
    name: 'Test Persona',
    version: '1.0.0',
    schemaVersion: '2.1',
    description: 'A test persona',
    modules: ['module-1', 'module-2'],
    ...overrides.persona,
  },
  modules: [
    {
      id: 'module-1',
      version: '1.0.0',
      schemaVersion: '2.1',
      capabilities: ['reasoning'],
      cognitiveLevel: 1,
      metadata: { name: 'Module One', description: 'First module', semantic: '' },
      instruction: { purpose: '', process: [], constraints: [] },
      knowledge: { explanation: '', concepts: [], patterns: [] },
    },
    {
      id: 'module-2',
      version: '2.0.0',
      schemaVersion: '2.1',
      capabilities: ['coding'],
      cognitiveLevel: 2,
      metadata: { name: 'Module Two', description: 'Second module', semantic: '' },
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
  ...overrides,
});

describe('formatBuildResultMarkdown', () => {
  it('formats basic build result', () => {
    const result = createMockBuildResult();
    const markdown = formatBuildResultMarkdown(result);

    expect(markdown).toContain('# Build Result: Test Persona');
    expect(markdown).toContain('**Version**: 1.0.0');
    expect(markdown).toContain('**Modules**: 2');
    expect(markdown).toContain('**Warnings**: 0');
  });

  it('includes module list', () => {
    const result = createMockBuildResult();
    const markdown = formatBuildResultMarkdown(result);

    expect(markdown).toContain('## Modules Included');
    expect(markdown).toContain('**Module One** (module-1) v1.0.0');
    expect(markdown).toContain('**Module Two** (module-2) v2.0.0');
  });

  it('includes warnings when present', () => {
    const result = createMockBuildResult({
      warnings: ['Warning 1', 'Warning 2'],
    });
    const markdown = formatBuildResultMarkdown(result);

    expect(markdown).toContain('## Warnings');
    expect(markdown).toContain('- Warning 1');
    expect(markdown).toContain('- Warning 2');
  });

  it('includes generated markdown preview', () => {
    const result = createMockBuildResult();
    const markdown = formatBuildResultMarkdown(result);

    expect(markdown).toContain('## Generated Markdown');
    expect(markdown).toContain('```markdown');
    expect(markdown).toContain('# Test Persona');
  });

  it('truncates long markdown content', () => {
    const longContent = 'x'.repeat(3000);
    const result = createMockBuildResult({
      markdown: longContent,
    });
    const markdown = formatBuildResultMarkdown(result);

    expect(markdown).toContain('truncated');
    expect(markdown).toContain('3000 total characters');
  });

  it('handles empty modules array', () => {
    const result = createMockBuildResult({
      modules: [],
    });
    const markdown = formatBuildResultMarkdown(result);

    expect(markdown).toContain('**Modules**: 0');
    expect(markdown).toContain('## Modules Included');
  });
});

describe('formatBuildResultStructured', () => {
  it('returns success with persona info', () => {
    const result = createMockBuildResult();
    const structured = formatBuildResultStructured(result);

    expect(structured.success).toBe(true);
    expect(structured.persona.id).toBe('test-persona');
    expect(structured.persona.name).toBe('Test Persona');
    expect(structured.persona.version).toBe('1.0.0');
    expect(structured.persona.description).toBe('A test persona');
  });

  it('includes module count and list', () => {
    const result = createMockBuildResult();
    const structured = formatBuildResultStructured(result);

    expect(structured.modulesCount).toBe(2);
    expect(structured.modules).toHaveLength(2);
    expect(structured.modules[0]).toEqual({
      id: 'module-1',
      name: 'Module One',
      version: '1.0.0',
    });
  });

  it('includes markdown length', () => {
    const result = createMockBuildResult();
    const structured = formatBuildResultStructured(result);

    expect(structured.markdownLength).toBe(result.markdown.length);
  });

  it('includes build report metadata', () => {
    const result = createMockBuildResult();
    const structured = formatBuildResultStructured(result);

    expect(structured.buildReport.personaDigest).toBe('abc123');
    expect(structured.buildReport.buildTimestamp).toBe('2024-01-01T00:00:00Z');
  });

  it('includes warnings array', () => {
    const result = createMockBuildResult({
      warnings: ['Warning 1', 'Warning 2'],
    });
    const structured = formatBuildResultStructured(result);

    expect(structured.warnings).toEqual(['Warning 1', 'Warning 2']);
  });

  it('handles empty warnings', () => {
    const result = createMockBuildResult({ warnings: [] });
    const structured = formatBuildResultStructured(result);

    expect(structured.warnings).toEqual([]);
  });
});
