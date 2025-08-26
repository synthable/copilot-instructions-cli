import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';

import ora from 'ora';
import { parse } from 'jsonc-parser';
import { handleBuild } from './build.js';
import { scanModules, validateModuleFile } from '../core/module-service.js';
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
vi.mock('../core/module-service.js', () => ({
  scanModules: vi.fn(),
  validateModuleFile: vi.fn(),
}));
vi.mock('../core/persona-service.js', () => ({ validatePersona: vi.fn() }));
vi.mock('../utils/error-handler.js', () => ({ handleError: vi.fn() }));

const mockExit = vi
  .spyOn(process, 'exit')
  .mockImplementation(() => undefined as never);
const mockConsoleError = vi
  .spyOn(console, 'error')
  .mockImplementation(() => {});
const mockStdoutWrite = vi
  .spyOn(process.stdout, 'write')
  .mockImplementation(() => true);

describe('handleBuild', () => {
  const mockSpinner = ora();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(validateModuleFile).mockResolvedValue({
      filePath: mockModule.filePath,
      isValid: true,
      errors: [],
    });
  });

  afterEach(() => {
    mockExit.mockClear();
    mockConsoleError.mockClear();
    mockStdoutWrite.mockClear();
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
      'Module content\n[Attribution: foundation/logic/test]'
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
      'Persona configuration validation failed.'
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

  it.skip('should correctly assemble content without attributions', async () => {
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
    const expectedContent = `Content1\n\n---\nContent2`;
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
    expect(fs.writeFile).toHaveBeenCalledWith(
      expectedPath,
      'Module content\n[Attribution: foundation/logic/test]'
    );
    expect(fs.mkdir).toHaveBeenCalledWith(path.dirname(expectedPath), {
      recursive: true,
    });
  });

  it('should correctly assemble content with attributions for all modules', async () => {
    // Arrange
    const attrConfig: PersonaConfig = {
      ...mockPersonaConfig,
      attributions: true,
      modules: ['mod1', 'mod2'],
    };
    const module1: Module = { ...mockModule, id: 'mod1', content: 'Content1' };
    const module2: Module = { ...mockModule, id: 'mod2', content: 'Content2' };
    const moduleMap = new Map<string, Module>([
      ['mod1', module1],
      ['mod2', module2],
    ]);

    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(attrConfig));
    vi.mocked(parse).mockReturnValue(attrConfig);
    vi.mocked(validatePersona).mockReturnValue({ isValid: true, errors: [] });
    vi.mocked(scanModules).mockResolvedValue(moduleMap);
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
    vi.mocked(fs.mkdir).mockResolvedValue(undefined);

    // Act
    await handleBuild({ personaFilePath });

    // Assert
    const expectedContent =
      'Content1\n[Attribution: mod1]\n\n---\nContent2\n[Attribution: mod2]';
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      expectedContent
    );
  });

  it('should build from modules, overriding name and description', async () => {
    // Arrange
    const modules = ['mod1'];
    const name = 'Custom Name';
    const description = 'Custom Description';
    const moduleMap = new Map<string, Module>([
      ['mod1', { ...mockModule, id: 'mod1' }],
    ]);
    vi.mocked(scanModules).mockResolvedValue(moduleMap);
    vi.mocked(validatePersona).mockReturnValue({ isValid: true, errors: [] });

    // Act
    await handleBuild({ modules, name, description, output: 'output.md' });

    // Assert
    expect(validatePersona).toHaveBeenCalledWith(
      expect.objectContaining({ name, description })
    );
    expect(fs.writeFile).toHaveBeenCalled();
  });

  it('should write to stdout when specified', async () => {
    // Arrange
    const modules = ['mod1'];
    const moduleMap = new Map<string, Module>([
      ['mod1', { ...mockModule, id: 'mod1' }],
    ]);
    vi.mocked(scanModules).mockResolvedValue(moduleMap);
    vi.mocked(validatePersona).mockReturnValue({ isValid: true, errors: [] });

    // Act
    await handleBuild({ modules, stdout: true });

    // Assert
    expect(mockStdoutWrite).toHaveBeenCalledWith(
      'Module content\n[Attribution: mod1]'
    );
  });

  it('should handle --no-attributions flag', async () => {
    // Arrange
    const modules = ['mod1'];
    const moduleMap = new Map<string, Module>([
      ['mod1', { ...mockModule, id: 'mod1' }],
    ]);
    vi.mocked(scanModules).mockResolvedValue(moduleMap);
    vi.mocked(validatePersona).mockReturnValue({ isValid: true, errors: [] });

    // Act
    await handleBuild({ modules, noAttributions: true, output: 'output.md' });

    // Assert
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      'Module content'
    );
  });
});

describe('Synergistic Pair Build Validation', () => {
  const mockModule1: Module = {
    id: 'proc-implement-valid',
    tier: 'execution',
    subject: '',
    name: 'Valid Implementing Procedure',
    description: 'A procedure that correctly implement a spec.',
    content: 'Procedure content',
    filePath: '/test/proc-implement-valid.md',
    implement: ['spec-for-implementing'],
  };

  const mockModule2: Module = {
    id: 'spec-for-implementing',
    tier: 'principle',
    subject: '',
    name: 'Example Specification',
    description: 'A spec to be implemented.',
    content: 'Specification content',
    filePath: '/test/spec-for-implementing.md',
  };

  beforeEach(() => {
    vi.mocked(validatePersona).mockReturnValue({ isValid: true, errors: [] });
    vi.mocked(validateModuleFile).mockResolvedValue({
      filePath: '',
      isValid: true,
      errors: [],
    });
    vi.mocked(fs.mkdir).mockResolvedValue(undefined);
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
  });

  it('should warn if modules are out of order for synergistic pairs', async () => {
    // Arrange
    const modules = ['proc-implement-valid', 'spec-for-implementing'];
    const moduleMap = new Map([
      ['proc-implement-valid', mockModule1],
      ['spec-for-implementing', mockModule2],
    ]);
    vi.mocked(scanModules).mockResolvedValue(moduleMap);
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Act
    await handleBuild({ modules, output: 'output.md' });

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "Warning: Module 'proc-implement-valid' implements 'spec-for-implementing', but it appears after it in the module list. For best results, 'spec-for-implementing' should appear before 'proc-implement-valid'."
      )
    );
    expect(fs.writeFile).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle multiple implementing modules correctly', async () => {
    // Create a module that implements multiple specs
    const multiImplModule: Module = {
      id: 'multi-impl-proc',
      tier: 'execution',
      subject: '',
      name: 'Multi Implementation Procedure',
      description: 'A procedure that implements multiple specs.',
      content: 'Multi implementation content',
      filePath: '/test/multi-impl-proc.md',
      implement: ['spec-for-implementing', 'other-spec'],
    };

    const otherSpecModule: Module = {
      id: 'other-spec',
      tier: 'principle',
      subject: '',
      name: 'Other Specification',
      description: 'Another spec to be implemented.',
      content: 'Other specification content',
      filePath: '/test/other-spec.md',
    };

    // Arrange
    const modules = ['multi-impl-proc', 'spec-for-implementing', 'other-spec'];
    const moduleMap = new Map([
      ['multi-impl-proc', multiImplModule],
      ['spec-for-implementing', mockModule2],
      ['other-spec', otherSpecModule],
    ]);
    vi.mocked(scanModules).mockResolvedValue(moduleMap);
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Act
    await handleBuild({ modules, output: 'output.md' });

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "Warning: Module 'multi-impl-proc' implements 'spec-for-implementing', but it appears after it in the module list. For best results, 'spec-for-implementing' should appear before 'multi-impl-proc'."
      )
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "Warning: Module 'multi-impl-proc' implements 'other-spec', but it appears after it in the module list. For best results, 'other-spec' should appear before 'multi-impl-proc'."
      )
    );
    expect(fs.writeFile).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should warn when implemented module is missing from persona', async () => {
    // Arrange
    const modules = ['proc-implement-valid']; // Missing 'spec-for-implementing'
    const moduleMap = new Map([['proc-implement-valid', mockModule1]]);
    vi.mocked(scanModules).mockResolvedValue(moduleMap);
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Act
    await handleBuild({ modules, output: 'output.md' });

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "Warning: Module 'proc-implement-valid' implements 'spec-for-implementing', but it is not included in the persona modules list."
      )
    );
    expect(fs.writeFile).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
