import { describe, it, expect, vi, beforeEach } from 'vitest';
import { writeOutputFile, readFromStdin } from '../utils/file-operations.js';
import { handleBuild } from './build.js';
import {
  parsePersona,
  renderMarkdown,
  generateBuildReport,
  resolvePersonaModules,
  type Persona,
  type Module,
  type BuildReport,
  ModuleRegistry,
} from 'ums-lib';
import { discoverAllModules } from '../utils/module-discovery.js';

// Mock dependencies
vi.mock('fs/promises', () => ({
  writeFile: vi.fn(),
  readFile: vi.fn(),
}));

vi.mock('chalk', () => ({
  default: {
    green: vi.fn((str: string) => str),
    red: vi.fn((str: string) => str),
    yellow: vi.fn((str: string) => str),
    gray: vi.fn((str: string) => str),
  },
}));

vi.mock('ora', () => {
  const mockSpinner = {
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
    text: '',
  };
  return { default: vi.fn(() => mockSpinner) };
});

// Mock pure functions from UMS library
vi.mock('ums-lib', () => ({
  parsePersona: vi.fn(),
  renderMarkdown: vi.fn(),
  generateBuildReport: vi.fn(),
  resolvePersonaModules: vi.fn(),
  ModuleRegistry: vi.fn().mockImplementation((strategy = 'warn') => {
    let mockSize = 0;
    const mockModules = new Map();
    return {
      strategy: strategy as string,
      modules: mockModules,
      add: vi.fn().mockImplementation((module: { id: string }) => {
        mockModules.set(module.id, module);
        mockSize++;
      }),
      resolve: vi.fn().mockImplementation(id => mockModules.get(id)),
      resolveAll: vi.fn(),
      size: vi.fn(() => mockSize),
      getConflicts: vi.fn(() => []),
      getConflictingIds: vi.fn(() => []),
    };
  }),
}));

// Mock utility functions
vi.mock('../utils/file-operations.js', () => ({
  writeOutputFile: vi.fn(),
  readFromStdin: vi.fn(),
}));

vi.mock('../utils/module-discovery.js', () => ({
  discoverAllModules: vi.fn(),
}));

vi.mock('../utils/error-handler.js', () => ({
  handleError: vi.fn(),
}));

// Mock process.exit
const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error('process.exit called with code 1');
});

describe('build command', () => {
  // Type-safe mocks
  const mockParsePersona = vi.mocked(parsePersona);
  const mockRenderMarkdown = vi.mocked(renderMarkdown);
  const mockGenerateBuildReport = vi.mocked(generateBuildReport);
  const mockResolvePersonaModules = vi.mocked(resolvePersonaModules);
  const mockDiscoverAllModules = vi.mocked(discoverAllModules);
  const mockWriteOutputFile = vi.mocked(writeOutputFile);
  const mockReadFromStdin = vi.mocked(readFromStdin);

  const mockPersona: Persona = {
    name: 'Test Persona',
    version: '1.0',
    schemaVersion: '1.0',
    description: 'A test persona',
    semantic: '',
    identity: 'You are a helpful test assistant',
    modules: [ // v2.0 spec-compliant
      {
        groupName: 'Test Group',
        ids: ['test/module-1', 'test/module-2'],
        modules: ['test/module-1', 'test/module-2'], // v1.0 compat
      },
    ],
    moduleGroups: [ // v1.0 backwards compat
      {
        groupName: 'Test Group',
        ids: ['test/module-1', 'test/module-2'],
        modules: ['test/module-1', 'test/module-2'],
      },
    ],
  };

  const mockModules: Module[] = [
    {
      id: 'test/module-1',
      version: '1.0',
      schemaVersion: '1.0',
      shape: 'procedure',
      capabilities: [],
      meta: {
        name: 'Test Module 1',
        description: 'First test module',
        semantic: 'Test semantic content',
      },
      metadata: {
        name: 'Test Module 1',
        description: 'First test module',
        semantic: 'Test semantic content',
      },
      body: {
        goal: 'Test goal',
        process: ['Step 1', 'Step 2'],
      },
    } as Module,
    {
      id: 'test/module-2',
      version: '1.0',
      schemaVersion: '1.0',
      shape: 'specification',
      capabilities: [],
      meta: {
        name: 'Test Module 2',
        description: 'Second test module',
        semantic: 'Test semantic content',
      },
      metadata: {
        name: 'Test Module 2',
        description: 'Second test module',
        semantic: 'Test semantic content',
      },
      body: {
        goal: 'Test specification',
      },
    } as Module,
  ];

  const mockBuildReport: BuildReport = {
    personaName: 'Test Persona',
    schemaVersion: '1.0',
    toolVersion: '1.0.0',
    personaDigest: 'abc123',
    buildTimestamp: '2023-01-01T00:00:00.000Z',
    moduleGroups: [
      {
        groupName: 'Test Group',
        modules: [],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockExit.mockClear();

    // Setup default mocks with ModuleRegistry
    const mockRegistry = new ModuleRegistry('warn');
    for (const module of mockModules) {
      mockRegistry.add(module, { type: 'standard', path: 'test' });
    }

    mockDiscoverAllModules.mockResolvedValue({
      registry: mockRegistry,
      warnings: [],
    });

    mockParsePersona.mockReturnValue(mockPersona);
    mockRenderMarkdown.mockReturnValue(
      '# Test Persona Instructions\\n\\nTest content'
    );
    mockGenerateBuildReport.mockReturnValue(mockBuildReport);
    mockResolvePersonaModules.mockReturnValue({
      modules: mockModules,
      missingModules: [],
      warnings: [],
    });
  });

  it('should build persona from file with output to file', async () => {
    // Arrange
    const options = {
      persona: 'test.persona.yml',
      output: 'output.md',
      verbose: false,
    };

    mockReadFromStdin.mockResolvedValue('');
    mockWriteOutputFile.mockResolvedValue();

    // Act
    await handleBuild(options);

    // Assert
    expect(mockDiscoverAllModules).toHaveBeenCalled();
    expect(mockParsePersona).toHaveBeenCalled();
    expect(mockRenderMarkdown).toHaveBeenCalledWith(mockPersona, mockModules);
    expect(mockGenerateBuildReport).toHaveBeenCalledWith(
      mockPersona,
      mockModules
    );
    expect(mockWriteOutputFile).toHaveBeenCalledWith(
      'output.md',
      '# Test Persona Instructions\\n\\nTest content'
    );
    expect(mockWriteOutputFile).toHaveBeenCalledWith(
      'output.build.json',
      JSON.stringify(mockBuildReport, null, 2)
    );
  });

  it('should build persona from stdin with output to stdout', async () => {
    // Arrange
    const options = {
      verbose: false,
    };

    const mockStdinContent = `
name: Test Persona
description: A test persona
semantic: ""
identity: You are a helpful test assistant
moduleGroups:
  - groupName: Test Group
    modules:
      - test/module-1
`;

    mockReadFromStdin.mockResolvedValue(mockStdinContent);
    const mockConsoleLog = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {});

    // Act
    await handleBuild(options);

    // Assert
    expect(mockReadFromStdin).toHaveBeenCalled();
    expect(mockParsePersona).toHaveBeenCalledWith(mockStdinContent);
    expect(mockConsoleLog).toHaveBeenCalledWith(
      '# Test Persona Instructions\\n\\nTest content'
    );

    mockConsoleLog.mockRestore();
  });

  it('should handle verbose mode', async () => {
    // Arrange
    const options = {
      persona: 'test.persona.yml',
      verbose: true,
    };

    const mockConsoleLog = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {});

    // Act
    await handleBuild(options);

    // Assert
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('[INFO] build:')
    );

    mockConsoleLog.mockRestore();
  });

  it('should handle build errors gracefully', async () => {
    // Arrange
    const error = new Error('Build failed');
    mockDiscoverAllModules.mockRejectedValue(error);
    const { handleError } = await import('../utils/error-handler.js');
    const mockHandleError = vi.mocked(handleError);

    const options = {
      persona: 'test.persona.yml',
      verbose: false,
    };

    // Act & Assert
    await expect(handleBuild(options)).rejects.toThrow(
      'process.exit called with code 1'
    );
    expect(mockHandleError).toHaveBeenCalledWith(
      error,
      expect.objectContaining({
        command: 'build',
        context: 'build process',
      })
    );
  });

  it('should handle missing modules error', async () => {
    // Arrange
    const options = {
      persona: 'test.persona.yml',
      verbose: false,
    };

    // Create empty registry - modules will be missing
    const emptyRegistry = new ModuleRegistry('warn');

    mockDiscoverAllModules.mockResolvedValue({
      registry: emptyRegistry,
      warnings: [],
    });

    // Act & Assert
    await expect(handleBuild(options)).rejects.toThrow(
      'process.exit called with code 1'
    );
  });

  it('should display warnings when present', async () => {
    // Arrange
    const options = {
      persona: 'test.persona.yml',
      verbose: false,
    };

    const warningsRegistry = new ModuleRegistry('warn');
    for (const module of mockModules) {
      warningsRegistry.add(module, { type: 'standard', path: 'test' });
    }

    mockDiscoverAllModules.mockResolvedValue({
      registry: warningsRegistry,
      warnings: ['Test warning'],
    });

    mockResolvePersonaModules.mockReturnValue({
      modules: mockModules,
      missingModules: [],
      warnings: ['Resolution warning'],
    });

    const mockConsoleLog = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {});

    // Act
    await handleBuild(options);

    // Assert
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Warnings:')
    );

    mockConsoleLog.mockRestore();
  });
});
