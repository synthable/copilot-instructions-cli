/**
 * Module Service Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModuleService } from './module-service.js';

// Mock ums-sdk
vi.mock('ums-sdk', () => ({
  listModules: vi.fn(),
}));

import { listModules } from 'ums-sdk';
import type { ModuleInfo } from 'ums-sdk';

const mockListModules = vi.mocked(listModules);

const createMockModuleInfo = (overrides: Partial<ModuleInfo> = {}): ModuleInfo => ({
  id: 'test-module',
  name: 'Test Module',
  description: 'A test module',
  version: '1.0.0',
  capabilities: ['reasoning'],
  source: 'local',
  ...overrides,
});

describe('ModuleService', () => {
  let service: ModuleService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ModuleService();
  });

  describe('list', () => {
    it('delegates to listModules without options', async () => {
      const mockModules = [createMockModuleInfo()];
      mockListModules.mockResolvedValue(mockModules);

      const result = await service.list();

      expect(mockListModules).toHaveBeenCalledWith(undefined);
      expect(result).toBe(mockModules);
    });

    it('passes options to listModules', async () => {
      const mockModules = [createMockModuleInfo()];
      mockListModules.mockResolvedValue(mockModules);

      const options = { includeStandard: false, capability: 'coding' };
      await service.list(options);

      expect(mockListModules).toHaveBeenCalledWith(options);
    });

    it('propagates errors from listModules', async () => {
      mockListModules.mockRejectedValue(new Error('List failed'));

      await expect(service.list()).rejects.toThrow('List failed');
    });
  });

  describe('search', () => {
    const mockModules = [
      createMockModuleInfo({ id: 'error-handler', name: 'Error Handler', description: 'Handles errors' }),
      createMockModuleInfo({ id: 'error-logger', name: 'Error Logger', description: 'Logs errors' }),
      createMockModuleInfo({ id: 'data-validator', name: 'Data Validator', description: 'Validates data' }),
      createMockModuleInfo({ id: 'config-loader', name: 'Config Loader', description: 'Loads configuration' }),
    ];

    beforeEach(() => {
      mockListModules.mockResolvedValue(mockModules);
    });

    it('filters modules by query in name', async () => {
      const result = await service.search('Error');

      expect(result).toHaveLength(2);
      expect(result.map(m => m.id)).toEqual(['error-handler', 'error-logger']);
    });

    it('filters modules by query in description', async () => {
      const result = await service.search('validates');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('data-validator');
    });

    it('filters modules by query in ID', async () => {
      const result = await service.search('config');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('config-loader');
    });

    it('is case-insensitive', async () => {
      const result = await service.search('ERROR');

      expect(result).toHaveLength(2);
    });

    it('returns empty array for no matches', async () => {
      const result = await service.search('nonexistent');

      expect(result).toEqual([]);
    });

    it('applies limit when specified', async () => {
      const result = await service.search('er', { limit: 1 });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('error-handler');
    });

    it('ignores limit of 0', async () => {
      const result = await service.search('error', { limit: 0 });

      expect(result).toHaveLength(2);
    });

    it('ignores negative limit', async () => {
      const result = await service.search('error', { limit: -1 });

      expect(result).toHaveLength(2);
    });

    it('passes other options to listModules', async () => {
      await service.search('test', { capability: 'coding', includeStandard: false });

      expect(mockListModules).toHaveBeenCalledWith({
        capability: 'coding',
        includeStandard: false,
      });
    });

    it('combines filtering with limit', async () => {
      // Add more modules that match
      mockListModules.mockResolvedValue([
        ...mockModules,
        createMockModuleInfo({ id: 'error-reporter', name: 'Error Reporter', description: 'Reports errors' }),
      ]);

      const result = await service.search('error', { limit: 2 });

      expect(result).toHaveLength(2);
    });

    it('propagates errors from listModules', async () => {
      mockListModules.mockRejectedValue(new Error('Search failed'));

      await expect(service.search('test')).rejects.toThrow('Search failed');
    });

    it('matches partial strings', async () => {
      const result = await service.search('hand');

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Error Handler');
    });
  });
});
