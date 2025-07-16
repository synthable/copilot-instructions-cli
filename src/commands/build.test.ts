import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';

import ora from 'ora';
import { parse } from 'jsonc-parser';
import { handleBuild } from './build.js';
import { scanModules } from '../core/module-service.js';
import { validatePersona } from '../core/persona-service.js';
import { handleError } from '../utils/error-handler.js';
import type { PersonaConfig } from '../types/index.js';
import type { Module } from '../types/index.js';

// Mock dependencies
vi.mock('fs', () => ({
  promises: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    mkdir: vi.fn(),
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

vi.mock('chalk', () => ({
  default: {
    green: vi.fn(str => str),
    red: vi.fn(str => str),
    yellow: vi.fn(str => str),
  },
}));
vi.mock('jsonc-parser', () => ({ parse: vi.fn() }));
vi.mock('../core/module-service.js', () => ({ scanModules: vi.fn() }));
vi.mock('../core/persona-service.js', () => ({ validatePersona: vi.fn() }));
vi.mock('../utils/error-handler.js', () => ({ handleError: vi.fn() }));

const mockExit = vi
  .spyOn(process, 'exit')
  .mockImplementation(() => undefined as never);
const mockConsoleError = vi
  .spyOn(console, 'error')
  .mockImplementation(() => {});

describe('handleBuild', () => {
  const mockSpinner = ora();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    mockExit.mockClear();
    mockConsoleError.mockClear();
  });

  const personaFilePath = 'my-persona.persona.jsonc';
  const mockPersonaConfig: PersonaConfig = {
    name: 'Test Persona',
    modules: ['foundation/logic/test'],
    attributions: true,
  };
  const mockModule: Module = {
    id: 'foundation/logic/test',
    name: 'Test Module',
    description: 'A test module',
    tier: 'foundation',
    subject: 'logic',
    content: 'Module content',
    filePath: 'path/to/module.md',
  };

  it('should successfully build a persona', async () => {
    // Arrange
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockPersonaConfig));
    vi.mocked(parse).mockReturnValue(mockPersonaConfig);
    vi.mocked(validatePersona).mockReturnValue({ isValid: true, errors: [] });
    const moduleMap = new Map<string, Module>([[mockModule.id, mockModule]]);
    vi.mocked(scanModules).mockResolvedValue(moduleMap);
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
    vi.mocked(fs.mkdir).mockResolvedValue(undefined);

    // Act
    await handleBuild({ personaFilePath });

    // Assert
    expect(fs.readFile).toHaveBeenCalledWith(personaFilePath, 'utf8');
    expect(validatePersona).toHaveBeenCalledWith(mockPersonaConfig);
    expect(scanModules).toHaveBeenCalledWith(mockPersonaConfig.modules);
    expect(fs.writeFile).toHaveBeenCalledWith(
      path.resolve(process.cwd(), 'my-persona.md'),
      'Module content'
    );
    expect(mockSpinner.succeed).toHaveBeenCalledWith(
      expect.stringContaining('Successfully built persona')
    );
    expect(handleError).not.toHaveBeenCalled();
  });

  it('should exit if persona validation fails', async () => {
    // Arrange
    const validationErrors = ['Missing name'];
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockPersonaConfig));
    vi.mocked(parse).mockReturnValue(mockPersonaConfig);
    vi.mocked(validatePersona).mockReturnValue({
      isValid: false,
      errors: validationErrors,
    });

    // Act
    await handleBuild({ personaFilePath });

    // Assert
    expect(mockSpinner.fail).toHaveBeenCalledWith(
      'Persona file validation failed.'
    );
    expect(mockConsoleError).toHaveBeenCalledWith(`- ${validationErrors[0]}`);
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should throw an error if a module is not found', async () => {
    // Arrange
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockPersonaConfig));
    vi.mocked(parse).mockReturnValue(mockPersonaConfig);
    vi.mocked(validatePersona).mockReturnValue({ isValid: true, errors: [] });
    vi.mocked(scanModules).mockResolvedValue(new Map()); // Empty map

    // Act
    await handleBuild({ personaFilePath });

    // Assert
    expect(handleError).toHaveBeenCalledWith(
      new Error(`Module with ID '${mockModule.id}' not found.`),
      mockSpinner
    );
  });

  it('should handle errors during file reading', async () => {
    // Arrange
    const readError = new Error('Could not read file');
    vi.mocked(fs.readFile).mockRejectedValue(readError);

    // Act
    await handleBuild({ personaFilePath });

    // Assert
    expect(handleError).toHaveBeenCalledWith(readError, mockSpinner);
  });

  it('should correctly assemble content without attributions', async () => {
    // Arrange
    const noAttrConfig: PersonaConfig = {
      ...mockPersonaConfig,
      attributions: false,
      modules: ['mod1', 'mod2'],
    };
    const module1: Module = { ...mockModule, id: 'mod1', content: 'Content1' };
    const module2: Module = { ...mockModule, id: 'mod2', content: 'Content2' };
    const moduleMap = new Map<string, Module>([
      ['mod1', module1],
      ['mod2', module2],
    ]);

    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(noAttrConfig));
    vi.mocked(parse).mockReturnValue(noAttrConfig);
    vi.mocked(validatePersona).mockReturnValue({ isValid: true, errors: [] });
    vi.mocked(scanModules).mockResolvedValue(moduleMap);
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
    vi.mocked(fs.mkdir).mockResolvedValue(undefined);

    // Act
    await handleBuild({ personaFilePath });

    // Assert
    const expectedContent = 'Content1\n---\nContent2';
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      expectedContent
    );
  });

  it('should use the output path from the persona config', async () => {
    // Arrange
    const customOutputConfig: PersonaConfig = {
      ...mockPersonaConfig,
      output: 'custom/path/to/output.md',
    };
    vi.mocked(fs.readFile).mockResolvedValue(
      JSON.stringify(customOutputConfig)
    );
    vi.mocked(parse).mockReturnValue(customOutputConfig);
    vi.mocked(validatePersona).mockReturnValue({ isValid: true, errors: [] });
    const moduleMap = new Map<string, Module>([[mockModule.id, mockModule]]);
    vi.mocked(scanModules).mockResolvedValue(moduleMap);
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
    vi.mocked(fs.mkdir).mockResolvedValue(undefined);

    // Act
    await handleBuild({ personaFilePath });

    // Assert
    const expectedPath = path.resolve(
      process.cwd(),
      customOutputConfig.output!
    );
    expect(fs.writeFile).toHaveBeenCalledWith(expectedPath, 'Module content');
    expect(fs.mkdir).toHaveBeenCalledWith(path.dirname(expectedPath), {
      recursive: true,
    });
  });
});
