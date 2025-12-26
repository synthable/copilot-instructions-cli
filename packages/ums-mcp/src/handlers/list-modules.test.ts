/**
 * List Modules Handler Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createListModulesHandler } from './list-modules.js';
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

describe('createListModulesHandler', () => {
  let mockService: ModuleService;
  let handler: ReturnType<typeof createListModulesHandler>;

  beforeEach(() => {
    mockService = {
      list: vi.fn(),
      search: vi.fn(),
    } as unknown as ModuleService;
    handler = createListModulesHandler(mockService);
  });

  it('calls service.list with options', async () => {
    vi.mocked(mockService.list).mockResolvedValue([createMockModuleInfo()]);

    await handler({
      includeStandard: false,
      capability: 'coding',
      tag: 'core',
    });

    expect(mockService.list).toHaveBeenCalledWith({
      includeStandard: false,
      capability: 'coding',
      tag: 'core',
    });
  });

  it('omits undefined optional fields', async () => {
    vi.mocked(mockService.list).mockResolvedValue([]);

    await handler({ includeStandard: true });

    expect(mockService.list).toHaveBeenCalledWith({
      includeStandard: true,
    });
  });

  it('returns MCP response with text content', async () => {
    vi.mocked(mockService.list).mockResolvedValue([
      createMockModuleInfo({ name: 'Module One' }),
      createMockModuleInfo({ name: 'Module Two' }),
    ]);

    const response = await handler({ includeStandard: true });

    expect(response.content).toHaveLength(1);
    expect(response.content[0].type).toBe('text');
    expect(response.content[0].text).toContain('# Available Modules (2)');
    expect(response.content[0].text).toContain('## Module One');
    expect(response.content[0].text).toContain('## Module Two');
  });

  it('returns structured content with module list', async () => {
    vi.mocked(mockService.list).mockResolvedValue([createMockModuleInfo()]);

    const response = await handler({ includeStandard: true });

    expect(response.structuredContent).toBeDefined();
    expect(response.structuredContent.success).toBe(true);
    expect(response.structuredContent.count).toBe(1);
    expect(response.structuredContent.modules).toHaveLength(1);
  });

  it('handles empty results', async () => {
    vi.mocked(mockService.list).mockResolvedValue([]);

    const response = await handler({ includeStandard: true });

    expect(response.content[0].text).toContain('No modules found');
    expect(response.structuredContent.count).toBe(0);
  });

  it('propagates errors from service', async () => {
    vi.mocked(mockService.list).mockRejectedValue(new Error('List failed'));

    await expect(handler({ includeStandard: true })).rejects.toThrow('List failed');
  });
});
