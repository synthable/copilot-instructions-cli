import { describe, it, expect, vi, beforeEach } from 'vitest';
import { writeOutputFile } from '../utils/file-operations.js';
import { handleBuild } from './build.js';
import { buildPersona, type BuildResult, type Persona, type Module, type BuildReport } from 'ums-sdk';

// Mock dependencies
vi.mock('chalk', () => ({
  default: {
    green: vi.fn((str: string) => str),
    red: vi.fn((str: string) => str),
    yellow: vi.fn((str: string) => str),
    gray: vi.fn((str: string) => str),
    cyan: vi.fn((str: string) => str),
    bold: {
      green: vi.fn((str: string) => str),
    },
  },
}));

vi.mock('ora', () => {
  const mockSpinner = {
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    text: '',
  };
  return { default: vi.fn(() => mockSpinner) };
});

// Mock SDK's buildPersona function
vi.mock('ums-sdk', async () => {
  const actual = await vi.importActual<typeof import('ums-sdk')>('ums-sdk');
  return {
    ...actual,
    buildPersona: vi.fn(),
  };
});

// Mock utility functions
vi.mock('../utils/file-operations.js', () => ({
  writeOutputFile: vi.fn(),
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
  const mockBuildPersona = vi.mocked(buildPersona);
  const mockWriteOutputFile = vi.mocked(writeOutputFile);

  const mockPersona: Persona = {
    name: 'Test Persona',
    version: '1.0',
    schemaVersion: '2.0',
    description: 'A test persona',
    semantic: '',
    identity: 'You are a helpful test assistant',
    modules: [
      {
        group: 'Test Group',
        ids: ['test/module-1', 'test/module-2'],
      },
    ],
  };

  const mockModules: Module[] = [
    {
      id: 'test/module-1',
      version: '1.0.0',
      schemaVersion: '2.0',
      capabilities: ['testing'],
      metadata: {
        name: 'Test Module 1',
        description: 'First test module',
        semantic: 'Test semantic content',
      },
      instruction: {
        type: 'instruction',
        instruction: {
          purpose: 'Test goal',
          process: ['Step 1', 'Step 2'],
        },
      },
    } as Module,
    {
      id: 'test/module-2',
      version: '1.0.0',
      schemaVersion: '2.0',
      capabilities: ['testing'],
      metadata: {
        name: 'Test Module 2',
        description: 'Second test module',
        semantic: 'Test semantic content',
      },
      instruction: {
        type: 'instruction',
        instruction: {
          purpose: 'Test specification',
        },
      },
    } as Module,
  ];

  const mockBuildReport: BuildReport = {
    personaName: 'Test Persona',
    schemaVersion: '2.0',
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

    // Setup default mock for buildPersona - returns successful build result
    const mockResult: BuildResult = {
      markdown: '# Test Persona Instructions\\n\\nTest content',
      persona: mockPersona,
      modules: mockModules,
      buildReport: mockBuildReport,
      warnings: [],
    };

    mockBuildPersona.mockResolvedValue(mockResult);
    mockWriteOutputFile.mockResolvedValue();
  });

  it('should build persona from file with output to file', async () => {
    // Arrange
    const options = {
      persona: 'test.persona.yml',
      output: 'output.md',
      verbose: false,
    };

    // Act
    await handleBuild(options);

    // Assert
    expect(mockBuildPersona).toHaveBeenCalledWith('test.persona.yml', {
      includeStandard: true,
    });
    expect(mockWriteOutputFile).toHaveBeenCalledWith(
      'output.md',
      '# Test Persona Instructions\\n\\nTest content'
    );
    expect(mockWriteOutputFile).toHaveBeenCalledWith(
      'output.build.json',
      JSON.stringify(mockBuildReport, null, 2)
    );
  });

  it('should build persona from file with output to stdout', async () => {
    // Arrange
    const options = {
      persona: 'test.persona.yml',
      verbose: false,
      // No output specified - should write to stdout
    };

    const mockConsoleLog = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {});

    // Act
    await handleBuild(options);

    // Assert
    expect(mockBuildPersona).toHaveBeenCalledWith('test.persona.yml', {
      includeStandard: true,
    });
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
    mockBuildPersona.mockRejectedValue(error);
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

    // Mock buildPersona to throw missing modules error
    const error = new Error('Missing modules: test/module-1');
    mockBuildPersona.mockRejectedValue(error);

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

    // Mock buildPersona to return warnings
    const resultWithWarnings: BuildResult = {
      markdown: '# Test Persona Instructions\\n\\nTest content',
      persona: mockPersona,
      modules: mockModules,
      buildReport: mockBuildReport,
      warnings: ['Test warning', 'Resolution warning'],
    };

    mockBuildPersona.mockResolvedValue(resultWithWarnings);

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
