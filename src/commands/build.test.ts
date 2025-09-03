import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { writeFile } from 'fs/promises';
import { handleBuild } from './build.js';
import { BuildEngine } from '../core/ums-build-engine.js';

// Mock dependencies
vi.mock('fs/promises', () => ({
  writeFile: vi.fn(),
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

const mockBuildEngine = {
  build: vi.fn(),
  generateBuildReport: vi.fn(),
};

vi.mock('../core/ums-build-engine.js', () => ({
  BuildEngine: vi.fn().mockImplementation(() => mockBuildEngine),
}));

vi.mock('../utils/error-handler.js', () => ({
  handleError: vi.fn(),
}));

// Mock console and process
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {
  // Mock implementation
});
const mockProcessStdin = {
  isTTY: false,
  on: vi.fn(),
  setEncoding: vi.fn(),
};

// Mock stdin for testing
Object.defineProperty(process, 'stdin', {
  value: mockProcessStdin,
  writable: true,
});

describe('build command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should build persona from file with output to file', async () => {
    // Arrange
    const mockPersona = { name: 'Test Persona', moduleGroups: [] };
    const mockMarkdown = '# Test Persona Instructions';
    const mockBuildReport = {
      persona: mockPersona,
      modules: [],
      moduleGroups: [],
    };

    vi.mocked(mockBuildEngine.build).mockResolvedValue({
      persona: mockPersona,
      markdown: mockMarkdown,
      modules: [],
      buildReport: mockBuildReport,
      warnings: [],
    });

    const options = {
      persona: 'test.persona.yml',
      output: 'output.md',
    };

    // Act
    await handleBuild(options);

    // Assert
    expect(BuildEngine).toHaveBeenCalled();
    expect(mockBuildEngine.build).toHaveBeenCalledWith({
      personaSource: 'test.persona.yml',
      outputTarget: 'output.md',
    });
    expect(writeFile).toHaveBeenCalledWith('output.md', mockMarkdown, 'utf8');
    expect(writeFile).toHaveBeenCalledWith(
      'output.build.json',
      JSON.stringify(mockBuildReport, null, 2),
      'utf8'
    );
  });

  it('should build persona from stdin with output to stdout', async () => {
    // Arrange
    const mockPersona = { name: 'Test Persona', moduleGroups: [] };
    const mockMarkdown = '# Test Persona Instructions';
    const mockBuildReport = {
      persona: mockPersona,
      modules: [],
      moduleGroups: [],
    };

    vi.mocked(mockBuildEngine.build).mockResolvedValue({
      persona: mockPersona,
      markdown: mockMarkdown,
      modules: [],
      buildReport: mockBuildReport,
      warnings: [],
    });

    // Mock process.stdin for this test
    const mockStdin = {
      isTTY: false,
      on: vi.fn((event: string, handler: (data?: Buffer) => void) => {
        if (event === 'data') {
          setTimeout(
            () => handler(Buffer.from('name: Test Persona\nmodules: []')),
            0
          );
        } else if (event === 'end') {
          setTimeout(() => handler(), 0);
        }
      }),
      resume: vi.fn(),
    };
    Object.defineProperty(process, 'stdin', {
      value: mockStdin,
      writable: true,
    });

    const options = {};

    // Act
    await handleBuild(options);

    // Assert
    expect(mockBuildEngine.build).toHaveBeenCalledWith({
      personaSource: 'stdin',
      outputTarget: 'stdout',
      personaContent: 'name: Test Persona\nmodules: []',
    });
    expect(mockConsoleLog).toHaveBeenCalledWith(mockMarkdown);
    expect(writeFile).not.toHaveBeenCalled();
  });

  it('should handle verbose mode', async () => {
    // Arrange
    const mockPersona = { name: 'Test Persona', moduleGroups: [] };
    const mockMarkdown = '# Test Persona Instructions';
    const mockBuildReport = {
      persona: mockPersona,
      modules: [],
      moduleGroups: [],
    };

    vi.mocked(mockBuildEngine.build).mockResolvedValue({
      persona: mockPersona,
      markdown: mockMarkdown,
      modules: [],
      buildReport: mockBuildReport,
      warnings: [],
    });

    const options = {
      persona: 'test.persona.yml',
      verbose: true,
    };

    // Act
    await handleBuild(options);

    // Assert
    expect(mockBuildEngine.build).toHaveBeenCalledWith({
      personaSource: 'test.persona.yml',
      outputTarget: 'stdout',
      verbose: true,
    });
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining(
        '[INFO] build: Reading persona from test.persona.yml'
      )
    );
  });

  it('should build persona from file with output to stdout', async () => {
    // Arrange
    const mockPersona = { name: 'Test Persona', moduleGroups: [] };
    const mockMarkdown = '# Test Persona Instructions';
    const mockBuildReport = {
      persona: mockPersona,
      modules: [],
      moduleGroups: [],
    };

    vi.mocked(mockBuildEngine.build).mockResolvedValue({
      persona: mockPersona,
      markdown: mockMarkdown,
      modules: [],
      buildReport: mockBuildReport,
      warnings: [],
    });

    const options = {
      persona: 'test.persona.yml',
    };

    // Act
    await handleBuild(options);

    // Assert
    expect(mockBuildEngine.build).toHaveBeenCalledWith({
      personaSource: 'test.persona.yml',
      outputTarget: 'stdout',
    });
    expect(mockConsoleLog).toHaveBeenCalledWith(mockMarkdown);
    expect(writeFile).not.toHaveBeenCalled();
  });

  it('should handle persona from stdin with file output', async () => {
    // Arrange
    const mockPersona = { name: 'Test Persona', moduleGroups: [] };
    const mockMarkdown = '# Test Persona Instructions';
    const mockBuildReport = {
      persona: mockPersona,
      modules: [],
      moduleGroups: [],
    };

    vi.mocked(mockBuildEngine.build).mockResolvedValue({
      persona: mockPersona,
      markdown: mockMarkdown,
      modules: [],
      buildReport: mockBuildReport,
      warnings: [],
    });

    // Mock process.stdin for this test
    const mockStdin = {
      isTTY: false,
      on: vi.fn((event: string, handler: (data?: Buffer) => void) => {
        if (event === 'data') {
          setTimeout(
            () => handler(Buffer.from('name: Test Persona\nmodules: []')),
            0
          );
        } else if (event === 'end') {
          setTimeout(() => handler(), 0);
        }
      }),
      resume: vi.fn(),
    };
    Object.defineProperty(process, 'stdin', {
      value: mockStdin,
      writable: true,
    });

    const options = {
      output: 'output.md',
    };

    // Act
    await handleBuild(options);

    // Assert
    expect(mockBuildEngine.build).toHaveBeenCalledWith({
      personaSource: 'stdin',
      outputTarget: 'output.md',
      personaContent: 'name: Test Persona\nmodules: []',
    });
    expect(writeFile).toHaveBeenCalledWith('output.md', mockMarkdown, 'utf8');
    expect(writeFile).toHaveBeenCalledWith(
      'output.build.json',
      JSON.stringify(mockBuildReport, null, 2),
      'utf8'
    );
  });

  it('should handle build errors gracefully', async () => {
    // Arrange
    const error = new Error('Build failed');
    vi.mocked(mockBuildEngine.build).mockRejectedValue(error);

    const { handleError } = await import('../utils/error-handler.js');

    const options = {
      persona: 'test.persona.yml',
    };

    // Act & Assert - expect process.exit to be called
    const mockExit = vi
      .spyOn(process, 'exit')
      .mockImplementation((code?: string | number | null) => {
        throw new Error(`process.exit called with code ${code}`);
      });

    await expect(handleBuild(options)).rejects.toThrow(
      'process.exit called with code 1'
    );

    expect(handleError).toHaveBeenCalledWith(error, {
      command: 'build',
      operation: 'build',
    });
    expect(mockExit).toHaveBeenCalledWith(1);

    mockExit.mockRestore();
  });

  it('should skip build report for stdout output', async () => {
    // Arrange
    const mockPersona = { name: 'Test Persona', moduleGroups: [] };
    const mockMarkdown = '# Test Persona Instructions';
    const mockBuildReport = {
      persona: mockPersona,
      modules: [],
      moduleGroups: [],
    };

    vi.mocked(mockBuildEngine.build).mockResolvedValue({
      persona: mockPersona,
      markdown: mockMarkdown,
      modules: [],
      buildReport: mockBuildReport,
      warnings: [],
    });

    const options = {
      persona: 'test.persona.yml',
      // No output specified = stdout
    };

    // Act
    await handleBuild(options);

    // Assert
    expect(mockBuildEngine.build).toHaveBeenCalledWith({
      personaSource: 'test.persona.yml',
      outputTarget: 'stdout',
    });
    expect(writeFile).not.toHaveBeenCalled();
    expect(mockConsoleLog).toHaveBeenCalledWith(mockMarkdown);
  });
});
