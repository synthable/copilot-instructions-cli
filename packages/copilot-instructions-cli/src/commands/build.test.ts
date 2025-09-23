import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { writeFile } from 'fs/promises';
import { writeOutputFile, readFromStdin } from '../utils/file-operations.js';
import { handleBuild } from './build.js';
import { BuildEngine, parsePersona, renderMarkdown, generateBuildReport, resolvePersonaModules } from 'ums-lib';
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

const mockBuildEngine = {
  build: vi.fn(),
  generateBuildReport: vi.fn(),
};

const mockModuleRegistry = {
  resolve: vi.fn(),
  getAllModuleIds: vi.fn(),
  getWarnings: vi.fn(),
  size: vi.fn(),
};

vi.mock('ums-lib', () => ({
  BuildEngine: vi.fn().mockImplementation(() => mockBuildEngine),
  ModuleRegistry: vi.fn().mockImplementation(() => mockModuleRegistry),
  parsePersona: vi.fn(),
  renderMarkdown: vi.fn(),
  generateBuildReport: vi.fn(),
  resolvePersonaModules: vi.fn(),
}));

vi.mock('../utils/module-discovery.js', () => ({
  discoverAllModules: vi.fn(),
}));

vi.mock('../utils/file-operations.js', () => ({
  writeOutputFile: vi.fn(),
  readFromStdin: vi.fn(),
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
  const mockPersona = {
    name: 'Test Persona',
    version: '1.0',
    schemaVersion: '1.0',
    description: 'A test persona',
    semantic: 'Testing framework',
    identity: 'I am a test persona',
    attribution: false,
    moduleGroups: [
      {
        groupName: 'Foundation',
        modules: ['foundation/logic/deductive-reasoning'],
      },
    ],
  };

  const mockModule = {
    id: 'foundation/logic/deductive-reasoning',
    version: '1.0',
    schemaVersion: '1.0',
    shape: 'specification',
    meta: {
      name: 'Deductive Reasoning',
      description: 'Logical deduction principles',
      semantic: 'Logic and reasoning framework',
    },
    body: {
      goal: 'Apply deductive reasoning principles',
    },
  };

  const mockResolutionResult = {
    modules: [mockModule],
    warnings: [],
    missingModules: [],
  };

  const mockBuildReport = {
    personaName: 'Test Persona',
    schemaVersion: '1.0',
    toolVersion: '1.0.0',
    personaDigest: 'abc123',
    buildTimestamp: '2023-01-01T00:00:00.000Z',
    moduleGroups: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock return values
    vi.mocked(parsePersona).mockReturnValue(mockPersona);
    vi.mocked(renderMarkdown).mockReturnValue('# Test Persona\n\nGenerated markdown content');
    vi.mocked(generateBuildReport).mockReturnValue(mockBuildReport);
    vi.mocked(resolvePersonaModules).mockReturnValue(mockResolutionResult);

    // Set up mock module discovery
    vi.mocked(discoverAllModules).mockResolvedValue({
      modules: [],
      warnings: [],
    });

    // Set up mock registry behavior
    mockModuleRegistry.size.mockReturnValue(0);
    mockModuleRegistry.getWarnings.mockReturnValue([]);

    // Set up default build engine behavior
    mockBuildEngine.build.mockResolvedValue({
      persona: { name: 'Test Persona', moduleGroups: [] },
      markdown: '# Test Persona Instructions',
      modules: [],
      buildReport: {
        persona: { name: 'Test Persona', moduleGroups: [] },
        modules: [],
        moduleGroups: [],
      },
      warnings: [],
    });
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

    mockBuildEngine.build.mockResolvedValue({
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
    expect(writeOutputFile).toHaveBeenCalledWith('output.md', mockMarkdown);
    expect(writeOutputFile).toHaveBeenCalledWith(
      'output.build.json',
      JSON.stringify(mockBuildReport, null, 2)
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

    mockBuildEngine.build.mockResolvedValue({
      persona: mockPersona,
      markdown: mockMarkdown,
      modules: [],
      buildReport: mockBuildReport,
      warnings: [],
    });

    // Mock readFromStdin for this test
    vi.mocked(readFromStdin).mockResolvedValue(
      'name: Test Persona\nmoduleGroups: []'
    );

    const options = {};

    // Act
    await handleBuild(options);

    // Assert
    expect(mockBuildEngine.build).toHaveBeenCalledWith({
      personaSource: 'stdin',
      outputTarget: 'stdout',
      personaContent: 'name: Test Persona\nmoduleGroups: []',
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

    mockBuildEngine.build.mockResolvedValue({
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

    mockBuildEngine.build.mockResolvedValue({
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

    mockBuildEngine.build.mockResolvedValue({
      persona: mockPersona,
      markdown: mockMarkdown,
      modules: [],
      buildReport: mockBuildReport,
      warnings: [],
    });

    // Mock readFromStdin for this test
    vi.mocked(readFromStdin).mockResolvedValue(
      'name: Test Persona\nmoduleGroups: []'
    );

    const options = {
      output: 'output.md',
    };

    // Act
    await handleBuild(options);

    // Assert
    expect(mockBuildEngine.build).toHaveBeenCalledWith({
      personaSource: 'stdin',
      outputTarget: 'output.md',
      personaContent: 'name: Test Persona\nmoduleGroups: []',
    });
    expect(writeOutputFile).toHaveBeenCalledWith('output.md', mockMarkdown);
    expect(writeOutputFile).toHaveBeenCalledWith(
      'output.build.json',
      JSON.stringify(mockBuildReport, null, 2)
    );
  });

  it('should handle build errors gracefully', async () => {
    // Arrange
    const error = new Error('Build failed');
    mockBuildEngine.build.mockRejectedValue(error);

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
      context: 'build process',
      suggestion: 'check persona file syntax and module references',
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

    mockBuildEngine.build.mockResolvedValue({
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
