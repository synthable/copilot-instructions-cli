import { describe, it, expect, vi, beforeEach } from 'vitest';
import chalk from 'chalk';
import { handleSearch } from './search.js';
import { discoverAllModules } from '../utils/module-discovery.js';
import { ModuleRegistry, type Module } from 'ums-lib';
import { deductiveReasoning } from '../__fixtures__/modules/deductive-reasoning.module.js';
import { testingPrinciples } from '../__fixtures__/modules/testing-principles.module.js';
import { errorHandling } from '../__fixtures__/modules/error-handling.module.js';

// Mock dependencies
vi.mock('chalk', () => ({
  default: {
    yellow: vi.fn((text: string) => text),
    cyan: Object.assign(
      vi.fn((text: string) => text),
      {
        bold: vi.fn((text: string) => text),
      }
    ),
    green: vi.fn((text: string) => text),
    white: Object.assign(
      vi.fn((text: string) => text),
      {
        bold: vi.fn((text: string) => text),
      }
    ),
    gray: vi.fn((text: string) => text),
    bold: vi.fn((text: string) => text),
  },
}));

vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
  })),
}));

vi.mock('cli-table3', () => ({
  default: vi.fn().mockImplementation(() => ({
    push: vi.fn(),
    toString: vi.fn(() => 'mocked table'),
  })),
}));

vi.mock('../utils/module-discovery.js', () => ({
  discoverAllModules: vi.fn(),
}));

vi.mock('../utils/error-handler.js', () => ({
  handleError: vi.fn(),
}));

vi.mock('../utils/progress.js', () => ({
  createDiscoveryProgress: vi.fn(() => ({
    start: vi.fn(),
    update: vi.fn(),
    succeed: vi.fn(),
    fail: vi.fn(),
  })),
}));

// Mock console
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {
  /* noop */
});

describe('search command', () => {
  const mockDiscoverAllModules = vi.mocked(discoverAllModules);

  // Use real test fixtures instead of inline mocks
  const mockModule1 = deductiveReasoning;
  const mockModule2 = testingPrinciples;
  const mockModule3 = errorHandling;

  // Helper function to create registry with test modules
  function createMockRegistry(modules: Module[]): ModuleRegistry {
    const registry = new ModuleRegistry('warn');
    for (const module of modules) {
      registry.add(module, { type: 'standard', path: 'test' });
    }
    return registry;
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TODO: Fix chalk mocks - see GitHub issue #XXX
  // The fixtures are valid and the search logic works, but console.log mocks
  // aren't capturing the output from renderSearchResults() correctly.
  it.skip('debug: check console.log calls', async () => {
    // Arrange
    const testRegistry = createMockRegistry([mockModule1, mockModule2]);
    mockDiscoverAllModules.mockResolvedValue({
      registry: testRegistry,
      warnings: [],
    });

    // Act
    await handleSearch('Deductive', { verbose: false });

    // Check console.log calls in detail
    console.error('Console.log call count:', mockConsoleLog.mock.calls.length);
    console.error('All console.log calls:');
    mockConsoleLog.mock.calls.forEach((call, index) => {
      console.error(`  Call ${index}:`, JSON.stringify(call));
    });

    // Check if chalk methods were called
    console.error('chalk.cyan calls:', (chalk.cyan as any).mock?.calls?.length || 'not mocked');
    console.error('chalk.cyan.bold calls:', (chalk.cyan.bold as any).mock?.calls?.length || 'not mocked');
  });

  it('should search modules by name', async () => {
    // Arrange
    mockDiscoverAllModules.mockResolvedValue({
      registry: createMockRegistry([mockModule1, mockModule2]),
      warnings: [],
    });

    // Act
    await handleSearch('Deductive', { verbose: false });

    // Assert
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Search results for "Deductive"')
    );
  });

  it('should search modules by description', async () => {
    // Arrange
    mockDiscoverAllModules.mockResolvedValue({
      registry: createMockRegistry([mockModule1, mockModule2]),
      warnings: [],
    });

    // Act
    await handleSearch('quality', { verbose: false });

    // Assert
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Search results for "quality"')
    );
  });

  it('should search modules by tags', async () => {
    // Arrange
    mockDiscoverAllModules.mockResolvedValue({
      registry: createMockRegistry([mockModule1]),
      warnings: [],
    });

    // Act
    await handleSearch('reasoning', { verbose: false });

    // Assert
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Search results for "reasoning"')
    );
  });

  it('should filter by tag', async () => {
    // Arrange
    mockDiscoverAllModules.mockResolvedValue({
      registry: createMockRegistry([mockModule1, mockModule2]),
      warnings: [],
    });

    // Act
    await handleSearch('', { tag: 'logic', verbose: false });

    // Assert - should only show modules with 'logic' tag
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Found 1 matching modules')
    );
  });

  it('should handle no search results', async () => {
    // Arrange
    mockDiscoverAllModules.mockResolvedValue({
      registry: createMockRegistry([mockModule1, mockModule2]),
      warnings: [],
    });

    // Act
    await handleSearch('nonexistent', { verbose: false });

    // Assert
    expect(mockConsoleLog).toHaveBeenCalledWith(
      'No modules found matching "nonexistent".'
    );
  });

  it('should handle no modules found during discovery', async () => {
    // Arrange
    mockDiscoverAllModules.mockResolvedValue({
      registry: createMockRegistry([]),
      warnings: [],
    });

    // Act
    await handleSearch('test', { verbose: false });

    // Assert
    expect(chalk.yellow).toHaveBeenCalledWith('No UMS v2.0 modules found.');
  });

  it('should handle case-insensitive search', async () => {
    // Arrange
    mockDiscoverAllModules.mockResolvedValue({
      registry: createMockRegistry([mockModule1]),
      warnings: [],
    });

    // Act
    await handleSearch('DEDUCTIVE', { verbose: false });

    // Assert
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Found 1 matching modules')
    );
  });

  it('should handle modules without tags', async () => {
    // Arrange - Use mockModule3 (errorHandling) which has no tags
    mockDiscoverAllModules.mockResolvedValue({
      registry: createMockRegistry([mockModule3]),
      warnings: [],
    });

    // Act - Search by word in description
    await handleSearch('handling', { verbose: false });

    // Assert - should still find module by description
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Found 1 matching modules')
    );
  });
});
