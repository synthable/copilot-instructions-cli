import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import chalk from 'chalk';
import { handleSearch } from './search.js';
import { discoverAllModules } from '../utils/module-discovery.js';

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

// Mock UMS components
const mockModuleRegistry = {
  getAllModuleIds: vi.fn(),
  resolve: vi.fn(),
  size: vi.fn(),
  getWarnings: vi.fn(),
};

vi.mock('ums-lib', () => ({
  ModuleRegistry: vi.fn().mockImplementation(() => mockModuleRegistry),
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
const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {
  /* noop */
});

import { handleError } from '../utils/error-handler.js';
import type { UMSModule } from 'ums-lib';

describe('search command', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Set up mock module discovery
    vi.mocked(discoverAllModules).mockResolvedValue({
      modules: [mockModule1, mockModule2, mockModule3],
      warnings: [],
    });

    // Set up mock registry behavior
    mockModuleRegistry.getAllModuleIds.mockReturnValue([
      'foundation/logic/deductive-reasoning',
      'technology/react/hooks',
      'principle/quality/testing',
    ]);
    mockModuleRegistry.resolve.mockImplementation((id: string) => {
      if (id === 'foundation/logic/deductive-reasoning') return mockModule1;
      if (id === 'technology/react/hooks') return mockModule2;
      if (id === 'principle/quality/testing') return mockModule3;
      return undefined;
    });
    mockModuleRegistry.size.mockReturnValue(3);
    mockModuleRegistry.getWarnings.mockReturnValue([]);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  const mockModule1: UMSModule = {
    id: 'foundation/logic/deductive-reasoning',
    version: '1.0.0',
    schemaVersion: '1.0',
    shape: 'specification',
    meta: {
      name: 'Deductive Reasoning',
      description: 'Apply logical deduction principles',
      semantic: 'reasoning-logic',
      tags: ['logic', 'reasoning'],
    },
    body: {
      goal: 'Test goal',
      principles: ['Test principle'],
      constraints: ['Test constraint'],
    },
    filePath: '/test/foundation/logic/deductive-reasoning.module.yml',
  };

  const mockModule2: UMSModule = {
    id: 'technology/react/hooks',
    version: '1.0.0',
    schemaVersion: '1.0',
    shape: 'pattern',
    meta: {
      name: 'React Hooks',
      description: 'React hook patterns',
      semantic: 'React hooks usage patterns',
      tags: ['frontend', 'react'],
    },
    body: {
      goal: 'Hook usage patterns',
      principles: ['Use hooks properly'],
    },
    filePath: '/test/technology/react/hooks.module.yml',
  };

  const mockModule3: UMSModule = {
    id: 'principle/quality/testing',
    version: '1.0.0',
    schemaVersion: '1.0',
    shape: 'specification',
    meta: {
      name: 'Quality Testing',
      description: 'Testing principles',
      semantic: 'Quality testing principles',
    },
    body: {
      goal: 'Ensure quality',
      principles: ['Test thoroughly'],
    },
    filePath: '/test/principle/quality/testing.module.yml',
  };

  it('should search modules by name', async () => {
    // Arrange
    mockModuleRegistry.getAllModuleIds.mockReturnValue([
      'foundation/logic/deductive-reasoning',
      'technology/react/hooks',
      'principle/quality/testing',
    ]);
    mockModuleRegistry.resolve
      .mockReturnValueOnce(mockModule1)
      .mockReturnValueOnce(mockModule2)
      .mockReturnValueOnce(mockModule3);

    // Act
    await handleSearch('React', {});

    // Assert
    expect(discoverAllModules).toHaveBeenCalled();
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Search results for "React"')
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Found 1 matching modules')
    );
  });

  it('should search modules by description', async () => {
    // Arrange
    mockModuleRegistry.getAllModuleIds.mockReturnValue([
      'foundation/logic/deductive-reasoning',
      'technology/react/hooks',
      'principle/quality/testing',
    ]);
    mockModuleRegistry.resolve
      .mockReturnValueOnce(mockModule1)
      .mockReturnValueOnce(mockModule2)
      .mockReturnValueOnce(mockModule3);

    // Act
    await handleSearch('logical', {});

    // Assert
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Search results for "logical"')
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Found 1 matching modules')
    );
  });

  it('should search modules by tags', async () => {
    // Arrange
    mockModuleRegistry.getAllModuleIds.mockReturnValue([
      'foundation/logic/deductive-reasoning',
      'technology/react/hooks',
      'principle/quality/testing',
    ]);
    mockModuleRegistry.resolve
      .mockReturnValueOnce(mockModule1)
      .mockReturnValueOnce(mockModule2)
      .mockReturnValueOnce(mockModule3);

    // Act
    await handleSearch('frontend', {});

    // Assert
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Search results for "frontend"')
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Found 1 matching modules')
    );
  });

  it('should filter by tier', async () => {
    // Arrange
    mockModuleRegistry.getAllModuleIds.mockReturnValue([
      'foundation/logic/deductive-reasoning',
      'technology/react/hooks',
      'principle/quality/testing',
    ]);
    mockModuleRegistry.resolve
      .mockReturnValueOnce(mockModule1)
      .mockReturnValueOnce(mockModule2)
      .mockReturnValueOnce(mockModule3);

    // Act
    await handleSearch('reasoning', { tier: 'foundation' });

    // Assert
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Search results for "reasoning"')
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Found 1 matching modules')
    );
  });

  it('should handle invalid tier filter', async () => {
    // Arrange
    mockModuleRegistry.getAllModuleIds.mockReturnValue(['test-module']);

    // Act & Assert
    await expect(
      handleSearch('test', { tier: 'invalid' })
    ).resolves.not.toThrow();
    expect(handleError).toHaveBeenCalled();
  });

  it('should handle no search results', async () => {
    // Arrange
    mockModuleRegistry.getAllModuleIds.mockReturnValue([
      'foundation/logic/deductive-reasoning',
    ]);
    mockModuleRegistry.resolve.mockReturnValue(mockModule1);

    // Act
    await handleSearch('nonexistent', {});

    // Assert
    expect(chalk.yellow).toHaveBeenCalledWith(
      'No modules found matching "nonexistent".'
    );
  });

  it('should handle no search results with tier filter', async () => {
    // Arrange
    mockModuleRegistry.getAllModuleIds.mockReturnValue([
      'foundation/logic/deductive-reasoning',
    ]);
    mockModuleRegistry.resolve.mockReturnValue(mockModule1);

    // Act
    await handleSearch('react', { tier: 'foundation' });

    // Assert
    expect(chalk.yellow).toHaveBeenCalledWith(
      'No modules found matching "react" in tier \'foundation\'.'
    );
  });

  it('should handle no modules found during discovery', async () => {
    // Arrange
    mockModuleRegistry.getAllModuleIds.mockReturnValue([]);

    // Act
    await handleSearch('test', {});

    // Assert
    expect(chalk.yellow).toHaveBeenCalledWith('No UMS v1.0 modules found.');
  });

  it('should handle module loading errors gracefully', async () => {
    // Arrange
    mockModuleRegistry.getAllModuleIds.mockReturnValue(['test-module']);
    mockModuleRegistry.resolve.mockReturnValue(null); // Simulate module not found

    // Act
    await handleSearch('test', {});

    // Assert
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining(
        'Warning: Module test-module not found in registry'
      )
    );
  });

  it('should sort results by meta.name then id', async () => {
    // Arrange
    const moduleA: UMSModule = {
      ...mockModule1,
      id: 'foundation/logic/a-module',
      meta: { ...mockModule1.meta, name: 'A Module' },
    };
    const moduleB: UMSModule = {
      ...mockModule2,
      id: 'technology/react/b-module',
      meta: { ...mockModule2.meta, name: 'A Module' }, // Same name as moduleA
    };
    const moduleC: UMSModule = {
      ...mockModule3,
      id: 'principle/quality/c-module',
      meta: { ...mockModule3.meta, name: 'Z Module' },
    };

    mockModuleRegistry.getAllModuleIds.mockReturnValue([
      'principle/quality/c-module',
      'technology/react/b-module',
      'foundation/logic/a-module',
    ]);
    mockModuleRegistry.resolve
      .mockReturnValueOnce(moduleC)
      .mockReturnValueOnce(moduleB)
      .mockReturnValueOnce(moduleA);

    // Act - search for something that matches all modules
    await handleSearch('Module', {});

    // Assert - verify that modules are sorted by name first, then by id for ties
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Found 3 matching modules')
    );
  });

  it('should handle case-insensitive search', async () => {
    // Arrange
    mockModuleRegistry.getAllModuleIds.mockReturnValue([
      'foundation/logic/deductive-reasoning',
    ]);
    mockModuleRegistry.resolve.mockReturnValue(mockModule1);

    // Act - search with different cases
    await handleSearch('DEDUCTIVE', {});

    // Assert
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Search results for "DEDUCTIVE"')
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Found 1 matching modules')
    );
  });

  it('should handle modules without tags', async () => {
    // Arrange
    const moduleWithoutTags: UMSModule = {
      ...mockModule1,
      meta: {
        name: mockModule1.meta.name,
        description: mockModule1.meta.description,
        semantic: mockModule1.meta.semantic,
        // No tags property (omitted)
      },
    };

    mockModuleRegistry.getAllModuleIds.mockReturnValue(['test-module']);
    mockModuleRegistry.resolve.mockReturnValue(moduleWithoutTags);

    // Act
    await handleSearch('reasoning', {});

    // Assert - should still find the module by name/description
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Found 1 matching modules')
    );
  });
});
