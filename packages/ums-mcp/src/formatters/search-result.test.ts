/**
 * Search Result Formatter Tests
 */

import { describe, it, expect } from 'vitest';
import {
  formatSearchResultMarkdown,
  formatSearchResultStructured,
} from './search-result.js';
import type { ModuleInfo } from 'ums-sdk';

const createMockModuleInfo = (overrides: Partial<ModuleInfo> = {}): ModuleInfo => ({
  id: 'test-module',
  name: 'Test Module',
  description: 'A test module',
  version: '1.0.0',
  capabilities: ['reasoning'],
  source: 'local',
  ...overrides,
});

describe('formatSearchResultMarkdown', () => {
  it('formats search results with matches', () => {
    const modules = [
      createMockModuleInfo({ id: 'mod-1', name: 'Error Handler' }),
      createMockModuleInfo({ id: 'mod-2', name: 'Error Logger' }),
    ];
    const markdown = formatSearchResultMarkdown(modules, 'error');

    expect(markdown).toContain('# Available Modules (2)');
    expect(markdown).toContain('## Error Handler');
    expect(markdown).toContain('## Error Logger');
  });

  it('shows no results message for empty array', () => {
    const markdown = formatSearchResultMarkdown([], 'nonexistent');

    expect(markdown).toBe('No modules found matching "nonexistent".');
  });

  it('formats single result', () => {
    const modules = [createMockModuleInfo({ name: 'Unique Module' })];
    const markdown = formatSearchResultMarkdown(modules, 'unique');

    expect(markdown).toContain('# Available Modules (1)');
    expect(markdown).toContain('## Unique Module');
  });
});

describe('formatSearchResultStructured', () => {
  it('returns success with query and count', () => {
    const modules = [
      createMockModuleInfo({ id: 'mod-1' }),
      createMockModuleInfo({ id: 'mod-2' }),
    ];
    const structured = formatSearchResultStructured(modules, 'test query');

    expect(structured.success).toBe(true);
    expect(structured.query).toBe('test query');
    expect(structured.count).toBe(2);
  });

  it('includes module details', () => {
    const modules = [createMockModuleInfo()];
    const structured = formatSearchResultStructured(modules, 'test');

    expect(structured.modules[0]).toEqual({
      id: 'test-module',
      name: 'Test Module',
      description: 'A test module',
      version: '1.0.0',
      capabilities: ['reasoning'],
      source: 'local',
    });
  });

  it('handles empty results', () => {
    const structured = formatSearchResultStructured([], 'no matches');

    expect(structured.success).toBe(true);
    expect(structured.query).toBe('no matches');
    expect(structured.count).toBe(0);
    expect(structured.modules).toEqual([]);
  });

  it('preserves query exactly as provided', () => {
    const structured = formatSearchResultStructured([], 'CamelCase Query');

    expect(structured.query).toBe('CamelCase Query');
  });
});
