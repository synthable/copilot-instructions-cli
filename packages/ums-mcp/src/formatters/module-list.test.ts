/**
 * Module List Formatter Tests
 */

import { describe, it, expect } from 'vitest';
import {
  formatModuleListMarkdown,
  formatModuleListStructured,
} from './module-list.js';
import type { ModuleInfo } from 'ums-sdk';

const createMockModuleInfo = (overrides: Partial<ModuleInfo> = {}): ModuleInfo => ({
  id: 'test-module',
  name: 'Test Module',
  description: 'A test module',
  version: '1.0.0',
  capabilities: ['reasoning', 'coding'],
  source: 'local',
  ...overrides,
});

describe('formatModuleListMarkdown', () => {
  it('formats single module', () => {
    const modules = [createMockModuleInfo()];
    const markdown = formatModuleListMarkdown(modules);

    expect(markdown).toContain('# Available Modules (1)');
    expect(markdown).toContain('## Test Module');
    expect(markdown).toContain('**ID**: test-module');
    expect(markdown).toContain('**Version**: 1.0.0');
    expect(markdown).toContain('**Source**: local');
    expect(markdown).toContain('**Description**: A test module');
    expect(markdown).toContain('**Capabilities**: reasoning, coding');
  });

  it('formats multiple modules', () => {
    const modules = [
      createMockModuleInfo({ id: 'mod-1', name: 'Module One' }),
      createMockModuleInfo({ id: 'mod-2', name: 'Module Two' }),
      createMockModuleInfo({ id: 'mod-3', name: 'Module Three' }),
    ];
    const markdown = formatModuleListMarkdown(modules);

    expect(markdown).toContain('# Available Modules (3)');
    expect(markdown).toContain('## Module One');
    expect(markdown).toContain('## Module Two');
    expect(markdown).toContain('## Module Three');
  });

  it('handles empty modules array', () => {
    const markdown = formatModuleListMarkdown([]);

    expect(markdown).toBe('No modules found matching the criteria.');
  });

  it('handles module without capabilities', () => {
    const modules = [createMockModuleInfo({ capabilities: [] })];
    const markdown = formatModuleListMarkdown(modules);

    expect(markdown).not.toContain('**Capabilities**');
  });

  it('shows standard source correctly', () => {
    const modules = [createMockModuleInfo({ source: 'standard' })];
    const markdown = formatModuleListMarkdown(modules);

    expect(markdown).toContain('**Source**: standard');
  });
});

describe('formatModuleListStructured', () => {
  it('returns success with count', () => {
    const modules = [
      createMockModuleInfo({ id: 'mod-1' }),
      createMockModuleInfo({ id: 'mod-2' }),
    ];
    const structured = formatModuleListStructured(modules);

    expect(structured.success).toBe(true);
    expect(structured.count).toBe(2);
  });

  it('includes all module fields', () => {
    const modules = [createMockModuleInfo()];
    const structured = formatModuleListStructured(modules);

    expect(structured.modules[0]).toEqual({
      id: 'test-module',
      name: 'Test Module',
      description: 'A test module',
      version: '1.0.0',
      capabilities: ['reasoning', 'coding'],
      source: 'local',
    });
  });

  it('handles empty array', () => {
    const structured = formatModuleListStructured([]);

    expect(structured.success).toBe(true);
    expect(structured.count).toBe(0);
    expect(structured.modules).toEqual([]);
  });

  it('preserves module order', () => {
    const modules = [
      createMockModuleInfo({ id: 'first' }),
      createMockModuleInfo({ id: 'second' }),
      createMockModuleInfo({ id: 'third' }),
    ];
    const structured = formatModuleListStructured(modules);

    expect(structured.modules.map(m => m.id)).toEqual(['first', 'second', 'third']);
  });
});
