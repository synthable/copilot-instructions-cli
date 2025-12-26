/**
 * Search Modules Handler Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSearchModulesHandler } from './search-modules.js';
import type { ModuleService } from '../services/module-service.js';
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

describe('createSearchModulesHandler', () => {
  let mockService: ModuleService;
  let handler: ReturnType<typeof createSearchModulesHandler>;

  beforeEach(() => {
    mockService = {
      list: vi.fn(),
      search: vi.fn(),
    } as unknown as ModuleService;
    handler = createSearchModulesHandler(mockService);
  });

  it('calls service.search with query and options', async () => {
    vi.mocked(mockService.search).mockResolvedValue([createMockModuleInfo()]);

    await handler({
      query: 'error',
      capability: 'debugging',
      limit: 5,
    });

    expect(mockService.search).toHaveBeenCalledWith('error', {
      limit: 5,
      capability: 'debugging',
    });
  });

  it('omits undefined capability', async () => {
    vi.mocked(mockService.search).mockResolvedValue([]);

    await handler({
      query: 'test',
      limit: 10,
    });

    expect(mockService.search).toHaveBeenCalledWith('test', {
      limit: 10,
    });
  });

  it('returns MCP response with text content', async () => {
    vi.mocked(mockService.search).mockResolvedValue([
      createMockModuleInfo({ name: 'Error Handler' }),
      createMockModuleInfo({ name: 'Error Logger' }),
    ]);

    const response = await handler({
      query: 'error',
      limit: 10,
    });

    expect(response.content).toHaveLength(1);
    expect(response.content[0].type).toBe('text');
    expect(response.content[0].text).toContain('# Available Modules (2)');
    expect(response.content[0].text).toContain('Error Handler');
  });

  it('returns structured content with search results', async () => {
    vi.mocked(mockService.search).mockResolvedValue([createMockModuleInfo()]);

    const response = await handler({
      query: 'test',
      limit: 10,
    });

    expect(response.structuredContent).toBeDefined();
    expect(response.structuredContent.success).toBe(true);
    expect(response.structuredContent.query).toBe('test');
    expect(response.structuredContent.count).toBe(1);
  });

  it('handles empty search results', async () => {
    vi.mocked(mockService.search).mockResolvedValue([]);

    const response = await handler({
      query: 'nonexistent',
      limit: 10,
    });

    expect(response.content[0].text).toContain('No modules found matching "nonexistent"');
    expect(response.structuredContent.count).toBe(0);
  });

  it('propagates errors from service', async () => {
    vi.mocked(mockService.search).mockRejectedValue(new Error('Search failed'));

    await expect(
      handler({
        query: 'test',
        limit: 10,
      })
    ).rejects.toThrow('Search failed');
  });

  it('preserves query in structured content', async () => {
    vi.mocked(mockService.search).mockResolvedValue([]);

    const response = await handler({
      query: 'Complex Query String',
      limit: 10,
    });

    expect(response.structuredContent.query).toBe('Complex Query String');
  });
});
