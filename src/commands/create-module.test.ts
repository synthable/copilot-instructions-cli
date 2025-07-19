import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import ora from 'ora';
import { handleCreateModule } from './create-module.js';
import { handleError } from '../utils/error-handler.js';

// Mock dependencies
vi.mock('fs', () => ({
  promises: {
    access: vi.fn(),
    mkdir: vi.fn(),
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

vi.mock('../utils/error-handler.js', () => ({
  handleError: vi.fn(),
}));

const mockExit = vi
  .spyOn(process, 'exit')
  .mockImplementation(() => undefined as never);

describe('handleCreateModule', () => {
  const mockSpinner = ora();
  const MODULES_ROOT_DIR = path.resolve(process.cwd(), 'instructions-modules');

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock fs.access to simulate file not existing by default
    vi.mocked(fs.access).mockRejectedValue({ code: 'ENOENT' });
  });

  afterEach(() => {
    mockExit.mockClear();
  });

  it('should successfully create a new module', async () => {
    // Arrange
    const tier = 'foundation';
    const subject = 'logic';
    const name = 'Test Module';
    const description = 'A test module.';
    const options = { layer: 1 };
    const slugifiedName = 'test-module';
    const expectedDir = path.join(MODULES_ROOT_DIR, tier, subject);
    const expectedPath = path.join(expectedDir, `${slugifiedName}.md`);

    vi.mocked(fs.mkdir).mockResolvedValue(undefined);
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);

    // Act
    await handleCreateModule(tier, subject, name, description, options);

    // Assert
    expect(fs.access).toHaveBeenCalledWith(expectedPath);
    expect(fs.mkdir).toHaveBeenCalledWith(expectedDir, { recursive: true });
    expect(fs.writeFile).toHaveBeenCalledWith(expectedPath, expect.any(String));
    expect(mockSpinner.succeed).toHaveBeenCalledWith(
      expect.stringContaining(
        `Successfully created new module at: ${expectedPath}`
      )
    );
    expect(handleError).not.toHaveBeenCalled();
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('should exit if the module file already exists', async () => {
    // Arrange
    vi.mocked(fs.access).mockResolvedValue(undefined); // Simulate file exists

    // Act
    await handleCreateModule('foundation', 'logic', 'Existing Module', '', {});

    // Assert
    expect(mockSpinner.fail).toHaveBeenCalledWith(
      expect.stringContaining('Module already exists at:')
    );
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should use default layer for recognized foundation subjects', async () => {
    // Arrange
    const tier = 'foundation';
    const subject = 'reasoning'; // Has a default layer
    const name = 'Test Reasoning';
    const description = 'A test.';
    const slugifiedName = 'test-reasoning';
    const expectedDir = path.join(MODULES_ROOT_DIR, tier, subject);
    const expectedPath = path.join(expectedDir, `${slugifiedName}.md`);

    // Act
    await handleCreateModule(tier, subject, name, description, {}); // No layer option

    // Assert
    expect(fs.writeFile).toHaveBeenCalledWith(
      expectedPath,
      expect.stringContaining('layer: 1') // Default for reasoning is 1
    );
  });

  it('should exit if layer is required but not provided for foundation tier', async () => {
    // Arrange
    const tier = 'foundation';
    const subject = 'unknown-subject';
    const name = 'Test Unknown';
    const description = 'A test.';

    // Act
    await handleCreateModule(tier, subject, name, description, {}); // No layer, unrecognized subject

    // Assert
    expect(mockSpinner.fail).toHaveBeenCalledWith(
      expect.stringContaining(
        'Foundation tier modules require a --layer option'
      )
    );
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should exit for invalid layer value', async () => {
    // Arrange
    const tier = 'foundation';
    const subject = 'logic';
    const name = 'Test Invalid Layer';
    const description = 'A test.';
    const options = { layer: 99 };

    // Act
    await handleCreateModule(tier, subject, name, description, options);

    // Assert
    expect(mockSpinner.fail).toHaveBeenCalledWith(
      'Layer must be an integer between 0 and 5.'
    );
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should handle file system errors during creation', async () => {
    // Arrange
    const creationError = new Error('Disk full');
    vi.mocked(fs.writeFile).mockRejectedValue(creationError);

    // Act
    await handleCreateModule('principle', 'quality', 'Test Error', '', {});

    // Assert
    expect(mockSpinner.fail).toHaveBeenCalledWith(creationError.message);
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
