import { describe, it, expect, vi, beforeEach } from 'vitest';
import chalk from 'chalk';
import { handleSearch } from './search.js';
import { discoverAllModules } from '../utils/module-discovery.js';
import { ModuleRegistry, type Module, ComponentType, CognitiveLevel } from 'ums-lib';
import type { CLIModule } from '../types/cli-extensions.js';

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

  const mockModule1: CLIModule = {
    id: 'foundation/logic/deductive-reasoning',
    filePath: '/test/foundation/logic/deductive-reasoning.md',
    version: '1.0.0',
    schemaVersion: '2.0',
    capabilities: ['reasoning', 'logic'],
    cognitiveLevel: CognitiveLevel.UNIVERSAL_PATTERNS,
    metadata: {
      name: 'Deductive Reasoning',
      description: 'Logical reasoning from premises',
      semantic: 'Logical reasoning from premises',
      tags: ['logic', 'reasoning'],
    },
    instruction: {
      type: ComponentType.Instruction,
      instruction: {
        purpose: 'Apply deductive reasoning',
        principles: ['Reason from premises to conclusions'],
      },
    },
  };

  const mockModule2: CLIModule = {
    id: 'principle/quality/testing',
    filePath: '/test/principle/quality/testing.md',
    version: '1.0.0',
    schemaVersion: '2.0',
    capabilities: ['testing', 'quality-assurance'],
    cognitiveLevel: CognitiveLevel.UNIVERSAL_PATTERNS,
    metadata: {
      name: 'Testing Principles',
      description: 'Quality assurance through testing',
      semantic: 'Quality assurance through testing',
    },
    instruction: {
      type: ComponentType.Instruction,
      instruction: {
        purpose: 'Apply testing principles',
        principles: ['Test thoroughly'],
      },
    },
  };

  // Helper function to create registry with test modules
  function createMockRegistry(modules: CLIModule[]): ModuleRegistry {
    const registry = new ModuleRegistry('warn');
    for (const module of modules) {
      registry.add(module as Module, { type: 'standard', path: 'test' });
    }
    return registry;
  }

  beforeEach(() => {
    vi.clearAllMocks();
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
    // Arrange - Create module without tags property
    const moduleWithoutTags: CLIModule = {
      ...mockModule2,
      metadata: {
        name: 'Testing Principles',
        description: 'Quality assurance through testing',
        semantic: 'Quality assurance through testing',
      },
    };

    mockDiscoverAllModules.mockResolvedValue({
      registry: createMockRegistry([moduleWithoutTags]),
      warnings: [],
    });

    // Act
    await handleSearch('testing', { verbose: false });

    // Assert - should still find module by description
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Found 1 matching modules')
    );
  });
});
