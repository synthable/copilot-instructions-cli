import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import ora from 'ora';

import { handleCreatePersona } from './create-persona.js';
import { handleError } from '../utils/error-handler.js';

// Mock dependencies
vi.mock('fs', () => ({
  promises: {
    access: vi.fn(),
    mkdir: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
}));

vi.mock('ora', () => {
  const oraInstance = {
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
    text: '',
  };
  return { default: vi.fn(() => oraInstance) };
});

vi.mock('jsonc-parser', () => ({
  parse: vi.fn(content => JSON.parse(content)),
}));

vi.mock('../utils/error-handler.js', () => ({
  handleError: vi.fn(),
}));

const mockExit = vi
  .spyOn(process, 'exit')
  .mockImplementation(() => undefined as never);
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('handleCreatePersona', () => {
  const mockSpinner = ora();

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock: file does not exist
    vi.mocked(fs.access).mockRejectedValue({ code: 'ENOENT' });
  });

  afterEach(() => {
    mockExit.mockClear();
  });

  it('should create a new persona with default options', async () => {
    // Arrange
    const name = 'My Test Persona';
    const description = 'A test description.';
    const expectedSlug = 'my-test-persona';
    const expectedPath = path.resolve(
      process.cwd(),
      `${expectedSlug}.persona.jsonc`
    );

    // Act
    await handleCreatePersona(name, description, {});

    // Assert
    expect(fs.access).toHaveBeenCalledWith(expectedPath);
    expect(fs.mkdir).toHaveBeenCalledWith(path.dirname(expectedPath), {
      recursive: true,
    });

    const expectedConfig = {
      name,
      description,
      output: `${expectedSlug}.md`,
      attributions: true,
      modules: [],
    };
    expect(fs.writeFile).toHaveBeenCalledWith(
      expectedPath,
      JSON.stringify(expectedConfig, null, 2)
    );
    expect(mockSpinner.succeed).toHaveBeenCalledWith(
      expect.stringContaining(
        `Successfully created new persona at: ${expectedPath}`
      )
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Remember to edit the "modules" array')
    );
  });

  it('should use a template when specified', async () => {
    // Arrange
    const name = 'Templated Persona';
    const description = 'Using a template.';
    const templateName = 'code-critic';
    const templatePath = path.resolve(
      process.cwd(),
      'templates',
      'persona',
      `${templateName}.persona.jsonc`
    );
    const templateContent = {
      name: 'Original Name',
      description: 'Original Description',
      modules: ['template/module'],
    };
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(templateContent));

    // Act
    await handleCreatePersona(name, description, { template: templateName });

    // Assert
    expect(fs.readFile).toHaveBeenCalledWith(templatePath, 'utf-8');
    const expectedConfig = {
      ...templateContent,
      name, // Overridden
      description, // Overridden
      output: 'templated-persona.md', // Overridden
    };
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify(expectedConfig, null, 2)
    );
  });

  it('should exit if specified template is not found', async () => {
    // Arrange
    const templateName = 'non-existent-template';
    const error = new Error('File not found');
    (error as NodeJS.ErrnoException).code = 'ENOENT';
    vi.mocked(fs.readFile).mockRejectedValue(error);

    // Act
    await handleCreatePersona('Test', '', { template: templateName });

    // Assert
    expect(mockSpinner.fail).toHaveBeenCalledWith(
      expect.stringContaining('Template file not found')
    );
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should exit if the output persona file already exists', async () => {
    // Arrange
    vi.mocked(fs.access).mockResolvedValue(undefined); // File exists

    // Act
    await handleCreatePersona('Existing Persona', '', {});

    // Assert
    expect(mockSpinner.fail).toHaveBeenCalledWith(
      expect.stringContaining('Persona file already exists at:')
    );
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should respect custom output paths and options', async () => {
    // Arrange
    const name = 'Custom Persona';
    const options = {
      personaOutput: 'custom/path/persona.jsonc',
      buildOutput: 'dist/custom.md',
      attributions: false,
    };
    const expectedPath = path.resolve(process.cwd(), options.personaOutput);

    // Act
    await handleCreatePersona(name, 'A description', options);

    // Assert
    const expectedConfig = {
      name,
      description: 'A description',
      output: options.buildOutput,
      attributions: options.attributions,
      modules: [],
    };
    expect(fs.writeFile).toHaveBeenCalledWith(
      expectedPath,
      JSON.stringify(expectedConfig, null, 2)
    );
  });

  it('should call handleError on unexpected errors', async () => {
    // Arrange
    const error = new Error('Something went wrong');
    vi.mocked(fs.mkdir).mockRejectedValue(error);

    // Act
    await handleCreatePersona('Error Persona', '', {});

    // Assert
    expect(handleError).toHaveBeenCalledWith(error, mockSpinner);
  });
});
