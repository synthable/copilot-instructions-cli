import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleInspect } from './inspect.js';
import type { Module, ModuleRegistry } from 'ums-lib';

// Mock dependencies
vi.mock('../utils/error-handler.js', () => ({
  handleError: vi.fn(),
}));

vi.mock('../utils/progress.js', () => ({
  createDiscoveryProgress: vi.fn(() => ({
    start: vi.fn(),
    succeed: vi.fn(),
    fail: vi.fn(),
    update: vi.fn(),
  })),
}));

vi.mock('../utils/module-discovery.js', () => ({
  discoverAllModules: vi.fn(),
}));

// Mock console methods
const consoleMock = {
  log: vi.fn(),
  error: vi.fn(),
};

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(consoleMock.log);
  vi.spyOn(console, 'error').mockImplementation(consoleMock.error);
  vi.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('process.exit called');
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  consoleMock.log.mockClear();
  consoleMock.error.mockClear();
});

// Create mock modules
const createMockModule = (id: string, version = '1.0.0'): Module => ({
  id,
  version,
  schemaVersion: '1.0',
  capabilities: [],
  metadata: {
    name: `Module ${id}`,
    description: `Test module ${id}`,
    semantic: `Test module ${id}`,
  },
});

// Mock module entry interface
interface MockModuleEntry {
  module: Module;
  source: { type: string; path: string };
  addedAt: number;
}

// Import mocked functions
import { discoverAllModules } from '../utils/module-discovery.js';

describe('inspect command', () => {
  const mockDiscoverAllModules = vi.mocked(discoverAllModules);

  const mockModule1 = createMockModule('foundation/test-module-1');
  const mockModule2 = createMockModule('foundation/test-module-2');
  const mockConflictModule1 = createMockModule(
    'foundation/conflict-module',
    '1.0.0'
  );
  const mockConflictModule2 = createMockModule(
    'foundation/conflict-module',
    '1.1.0'
  );

  const createMockRegistry = (hasConflicts = false): ModuleRegistry => {
    const modules = new Map<string, MockModuleEntry[]>();

    if (hasConflicts) {
      modules.set('foundation/test-module-1', [
        {
          module: mockModule1,
          source: {
            type: 'standard',
            path: 'instructions-modules-v1-compliant',
          },
          addedAt: Date.now() - 1000,
        },
      ]);
      modules.set('foundation/conflict-module', [
        {
          module: mockConflictModule1,
          source: {
            type: 'standard',
            path: 'instructions-modules-v1-compliant',
          },
          addedAt: Date.now() - 2000,
        },
        {
          module: mockConflictModule2,
          source: { type: 'local', path: './custom-modules' },
          addedAt: Date.now() - 1000,
        },
      ]);
    } else {
      modules.set('foundation/test-module-1', [
        {
          module: mockModule1,
          source: {
            type: 'standard',
            path: 'instructions-modules-v1-compliant',
          },
          addedAt: Date.now(),
        },
      ]);
      modules.set('foundation/test-module-2', [
        {
          module: mockModule2,
          source: {
            type: 'standard',
            path: 'instructions-modules-v1-compliant',
          },
          addedAt: Date.now(),
        },
      ]);
    }

    return {
      modules,
      has: vi.fn((id: string) => modules.has(id)),
      resolve: vi.fn((id: string) => {
        const entries = modules.get(id);
        return entries && entries.length > 0 ? entries[0].module : null;
      }),
      size: vi.fn(() => modules.size),
      getConflicts: vi.fn((id: string) => {
        const entries = modules.get(id);
        return entries && entries.length > 1 ? entries : null;
      }),
      getConflictingIds: vi.fn(() => {
        return Array.from(modules.entries())
          .filter(([, entries]) => entries.length > 1)
          .map(([id]) => id);
      }),
      getSourceSummary: vi.fn(() => ({
        'standard:instructions-modules-v1-compliant': hasConflicts ? 2 : 2,
        ...(hasConflicts && { 'local:./custom-modules': 1 }),
      })),
      // Add missing methods from ModuleRegistry interface
      add: vi.fn(),
      addAll: vi.fn(),
      resolveAll: vi.fn(),
      getAllEntries: vi.fn(() => modules),
    } as unknown as ModuleRegistry;
  };

  describe('registry overview', () => {
    it('should display registry overview with no conflicts', async () => {
      const mockRegistry = createMockRegistry(false);

      mockDiscoverAllModules.mockResolvedValue({
        registry: mockRegistry,
        warnings: [],
      });

      await handleInspect({ verbose: false });

      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Registry Overview')
      );
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Total unique modules:')
      );
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('0') // No conflicts
      );
    });

    it('should display registry overview with conflicts', async () => {
      const mockRegistry = createMockRegistry(true);

      mockDiscoverAllModules.mockResolvedValue({
        registry: mockRegistry,
        warnings: [],
      });

      await handleInspect({ verbose: false });

      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Registry Overview')
      );
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Conflicting modules:')
      );
    });

    it('should display verbose overview information', async () => {
      const mockRegistry = createMockRegistry(true);

      mockDiscoverAllModules.mockResolvedValue({
        registry: mockRegistry,
        warnings: [],
      });

      await handleInspect({ verbose: true });

      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Conflicting Module IDs:')
      );
    });
  });

  describe('specific module inspection', () => {
    it('should inspect a specific module with no conflicts', async () => {
      const mockRegistry = createMockRegistry(false);

      mockDiscoverAllModules.mockResolvedValue({
        registry: mockRegistry,
        warnings: [],
      });

      await handleInspect({
        moduleId: 'foundation/test-module-1',
        verbose: false,
      });

      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Inspecting Module: foundation/test-module-1')
      );
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('No conflicts found')
      );
    });

    it('should inspect a specific module with conflicts', async () => {
      const mockRegistry = createMockRegistry(true);

      mockDiscoverAllModules.mockResolvedValue({
        registry: mockRegistry,
        warnings: [],
      });

      await handleInspect({
        moduleId: 'foundation/conflict-module',
        verbose: false,
      });

      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Inspecting Module: foundation/conflict-module')
      );
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Found 2 conflicting entries')
      );
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Current Resolution:')
      );
    });

    it('should handle non-existent module', async () => {
      const mockRegistry = createMockRegistry(false);

      mockDiscoverAllModules.mockResolvedValue({
        registry: mockRegistry,
        warnings: [],
      });

      await handleInspect({
        moduleId: 'foundation/non-existent',
        verbose: false,
      });

      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('not found in registry')
      );
    });

    it('should display verbose module details', async () => {
      const mockRegistry = createMockRegistry(false);

      mockDiscoverAllModules.mockResolvedValue({
        registry: mockRegistry,
        warnings: [],
      });

      await handleInspect({
        moduleId: 'foundation/test-module-1',
        verbose: true,
      });

      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Module Details:')
      );
    });
  });

  describe('conflicts-only inspection', () => {
    it('should show conflicts-only view when no conflicts exist', async () => {
      const mockRegistry = createMockRegistry(false);

      mockDiscoverAllModules.mockResolvedValue({
        registry: mockRegistry,
        warnings: [],
      });

      await handleInspect({ conflictsOnly: true });

      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Module Conflicts Overview')
      );
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('No module conflicts found')
      );
    });

    it('should show conflicts-only view with conflicts', async () => {
      const mockRegistry = createMockRegistry(true);

      mockDiscoverAllModules.mockResolvedValue({
        registry: mockRegistry,
        warnings: [],
      });

      await handleInspect({ conflictsOnly: true });

      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Module Conflicts Overview')
      );
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Found 1 modules with conflicts')
      );
    });
  });

  describe('sources inspection', () => {
    it('should show sources summary', async () => {
      const mockRegistry = createMockRegistry(true);

      mockDiscoverAllModules.mockResolvedValue({
        registry: mockRegistry,
        warnings: [],
      });

      await handleInspect({ sources: true });

      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Registry Sources Summary')
      );
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Total sources:')
      );
    });

    it('should show verbose source statistics', async () => {
      const mockRegistry = createMockRegistry(true);

      mockDiscoverAllModules.mockResolvedValue({
        registry: mockRegistry,
        warnings: [],
      });

      await handleInspect({ sources: true, verbose: true });

      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Conflict Statistics:')
      );
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Unique modules:')
      );
    });
  });

  describe('JSON format output', () => {
    it('should output JSON format for overview', async () => {
      const mockRegistry = createMockRegistry(true);

      mockDiscoverAllModules.mockResolvedValue({
        registry: mockRegistry,
        warnings: [],
      });

      await handleInspect({ format: 'json' });

      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('"totalUniqueModules":')
      );
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('"conflictingModules":')
      );
    });

    it('should output JSON format for specific module conflicts', async () => {
      const mockRegistry = createMockRegistry(true);

      mockDiscoverAllModules.mockResolvedValue({
        registry: mockRegistry,
        warnings: [],
      });

      await handleInspect({
        moduleId: 'foundation/conflict-module',
        format: 'json',
      });

      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('"index":')
      );
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('"source":')
      );
    });
  });

  describe('error handling', () => {
    it('should handle discovery errors gracefully', async () => {
      const error = new Error('Discovery failed');
      mockDiscoverAllModules.mockRejectedValue(error);
      const { handleError } = await import('../utils/error-handler.js');

      await expect(handleInspect()).rejects.toThrow('process.exit called');

      expect(handleError).toHaveBeenCalledWith(
        error,
        expect.objectContaining({
          command: 'inspect',
          context: 'module inspection',
        })
      );
    });
  });

  describe('warnings display', () => {
    it('should display module discovery warnings in verbose mode', async () => {
      const mockRegistry = createMockRegistry(false);

      mockDiscoverAllModules.mockResolvedValue({
        registry: mockRegistry,
        warnings: ['Test warning 1', 'Test warning 2'],
      });

      await handleInspect({ verbose: true });

      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Module Discovery Warnings:')
      );
      expect(consoleMock.log).toHaveBeenCalledWith(
        expect.stringContaining('Test warning 1')
      );
    });

    it('should not display warnings when not in verbose mode', async () => {
      const mockRegistry = createMockRegistry(false);

      mockDiscoverAllModules.mockResolvedValue({
        registry: mockRegistry,
        warnings: ['Test warning'],
      });

      await handleInspect({ verbose: false });

      expect(consoleMock.log).not.toHaveBeenCalledWith(
        expect.stringContaining('Module Discovery Warnings:')
      );
    });
  });
});
