import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Command } from 'commander';

process.env['NODE_ENV'] = 'test';

// Mock the command modules
vi.mock('./commands/build.js', () => ({
  createBuildCommand: vi.fn(() => new Command('build')),
}));
vi.mock('./commands/list.js', () => ({
  createListCommand: vi.fn(() => new Command('list')),
}));
vi.mock('./commands/search.js', () => ({
  createSearchCommand: vi.fn(() => new Command('search')),
}));
vi.mock('./commands/index.js', () => ({
  createIndexCommand: vi.fn(() => new Command('index')),
}));

import { createBuildCommand } from './commands/build.js';
import { createListCommand } from './commands/list.js';
import { createSearchCommand } from './commands/search.js';
import { createIndexCommand } from './commands/index.js';

describe('cli', () => {
  beforeEach(async () => {
    vi.resetModules();
    // To test the CLI, we need to re-import it in each test
    // to get a fresh instance of the program.
    await import('./cli.js');
  });

  it('should register the build command', () => {
    expect(createBuildCommand).toHaveBeenCalled();
  });

  it('should register the list command', () => {
    expect(createListCommand).toHaveBeenCalled();
  });

  it('should register the search command', () => {
    expect(createSearchCommand).toHaveBeenCalled();
  });

  it('should register the index command', () => {
    expect(createIndexCommand).toHaveBeenCalled();
  });
});
