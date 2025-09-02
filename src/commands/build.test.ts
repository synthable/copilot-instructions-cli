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
    const mockPersona = { name: 'Test Persona' };
    const mockMarkdown = '# Test Persona Instructions';
    const mockBuildReport = { persona: mockPersona };

    vi.mocked(mockBuildEngine.build).mockResolvedValue({
      persona: mockPersona,
      markdown: mockMarkdown,
    });
    vi.mocked(mockBuildEngine.generateBuildReport).mockReturnValue(
      mockBuildReport
    );

    const options = {
      persona: 'test.persona.yml',
      output: 'output.md',
    };

    // Act
    await handleBuild(options);

    // Assert
    expect(BuildEngine).toHaveBeenCalled();
    expect(mockBuildEngine.build).toHaveBeenCalledWith(
      'test.persona.yml',
      undefined
    );
    expect(writeFile).toHaveBeenCalledWith('output.md', mockMarkdown, 'utf8');
    expect(writeFile).toHaveBeenCalledWith(
      'output.build.json',
      JSON.stringify(mockBuildReport, null, 2),
      'utf8'
    );
  });

  it('should build persona from stdin with output to stdout', async () => {
    // Arrange
    const mockPersona = { name: 'Test Persona' };
    const mockMarkdown = '# Test Persona Instructions';

    vi.mocked(mockBuildEngine.build).mockResolvedValue({
      persona: mockPersona,
      markdown: mockMarkdown,
    });

    const options = {};

    // Act
    await handleBuild(options);

    // Assert
    expect(mockBuildEngine.build).toHaveBeenCalledWith(undefined, undefined);
    expect(mockConsoleLog).toHaveBeenCalledWith(mockMarkdown);
    expect(writeFile).not.toHaveBeenCalled();
  });

  it('should handle verbose mode', async () => {
    // Arrange
    const mockPersona = { name: 'Test Persona' };
    const mockMarkdown = '# Test Persona Instructions';

    vi.mocked(mockBuildEngine.build).mockResolvedValue({
      persona: mockPersona,
      markdown: mockMarkdown,
    });

    const options = {
      persona: 'test.persona.yml',
      verbose: true,
    };

    // Act
    await handleBuild(options);

    // Assert
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining(
        '[INFO] build: Reading persona from test.persona.yml'
      )
    );
  });

  it('should build persona from file with output to stdout', async () => {
    // Arrange
    const mockPersona = { name: 'Test Persona' };
    const mockMarkdown = '# Test Persona Instructions';

    vi.mocked(mockBuildEngine.build).mockResolvedValue({
      persona: mockPersona,
      markdown: mockMarkdown,
    });

    const options = {
      persona: 'test.persona.yml',
    };

    // Act
    await handleBuild(options);

    // Assert
    expect(mockBuildEngine.build).toHaveBeenCalledWith(
      'test.persona.yml',
      undefined
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(mockMarkdown);
    expect(writeFile).not.toHaveBeenCalled();
  });

  it('should handle persona from stdin with file output', async () => {
    // Arrange
    const mockPersona = { name: 'Test Persona' };
    const mockMarkdown = '# Test Persona Instructions';
    const mockBuildReport = { persona: mockPersona };

    vi.mocked(mockBuildEngine.build).mockResolvedValue({
      persona: mockPersona,
      markdown: mockMarkdown,
    });
    vi.mocked(mockBuildEngine.generateBuildReport).mockReturnValue(
      mockBuildReport
    );

    const options = {
      output: 'output.md',
    };

    // Act
    await handleBuild(options);

    // Assert
    expect(mockBuildEngine.build).toHaveBeenCalledWith(undefined, undefined);
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

    // Act
    await handleBuild(options);

    // Assert
    expect(handleError).toHaveBeenCalledWith(error);
  });

  it('should skip build report for stdout output', async () => {
    // Arrange
    const mockPersona = { name: 'Test Persona' };
    const mockMarkdown = '# Test Persona Instructions';

    vi.mocked(mockBuildEngine.build).mockResolvedValue({
      persona: mockPersona,
      markdown: mockMarkdown,
    });

    const options = {
      persona: 'test.persona.yml',
      // No output specified = stdout
    };

    // Act
    await handleBuild(options);

    // Assert
    expect(mockBuildEngine.generateBuildReport).not.toHaveBeenCalled();
    expect(writeFile).not.toHaveBeenCalled();
    expect(mockConsoleLog).toHaveBeenCalledWith(mockMarkdown);
  });
});
