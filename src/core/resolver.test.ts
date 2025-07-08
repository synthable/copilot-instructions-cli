import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ModuleResolver } from './resolver.js';
import * as fileSystem from '../utils/file-system.js';
import * as parser from './parser.js';
import { readFile } from 'fs/promises';
import type { IndexedModule } from '../types/index.js';

vi.mock('fs/promises');
vi.mock('../utils/file-system.js');
vi.mock('./parser.js');

const mockedReadFile = vi.mocked(readFile);
const mockedFindMarkdownFiles = vi.mocked(fileSystem.findMarkdownFiles);
const mockedParseModuleMetadata = vi.mocked(parser.parseModuleMetadata);

const mockIndexedModule: IndexedModule = {
  id: 'foundation/core/basics',
  path: '/path/to/modules/foundation/core/basics.md',
  tier: 'foundation',
  subject: 'core',
  metadata: {
    tier: 'foundation',
    name: 'Basics',
    subject: 'core',
    description: 'Basic foundation concepts',
  },
};

describe('ModuleResolver', () => {
  let resolver: ModuleResolver;

  beforeEach(() => {
    vi.resetAllMocks();
    resolver = new ModuleResolver({ modulesPath: '/path/to/modules' });
  });

  describe('buildIndex', () => {
    it('should build the index from the file system', async () => {
      mockedFindMarkdownFiles.mockResolvedValue([
        '/path/to/modules/foundation/core/basics.md',
      ]);
      mockedParseModuleMetadata.mockResolvedValue(mockIndexedModule);

      await resolver.buildIndex();
      const index = await resolver.getIndex();

      expect(index.size).toBe(1);
      expect(index.get('foundation/core/basics')).toEqual(mockIndexedModule);
    });

    it('should handle errors during index building', async () => {
      mockedFindMarkdownFiles.mockRejectedValue(
        new Error('Could not read dir')
      );
      await expect(resolver.buildIndex()).rejects.toThrow(
        'Failed to build module index: Could not read dir'
      );
    });
  });

  describe('getIndex', () => {
    it('should return a pre-configured index', async () => {
      const resolverWithIndex = new ModuleResolver({
        modulesPath: '/path/to/modules',
        index: [mockIndexedModule],
      });
      const index = await resolverWithIndex.getIndex();
      expect(index.size).toBe(1);
      expect(index.get('foundation/core/basics')).toEqual(mockIndexedModule);
    });

    it('should build the index if not pre-configured', async () => {
      mockedFindMarkdownFiles.mockResolvedValue([
        '/path/to/modules/foundation/core/basics.md',
      ]);
      mockedParseModuleMetadata.mockResolvedValue(mockIndexedModule);

      const index = await resolver.getIndex();
      expect(index.size).toBe(1);
      expect(mockedFindMarkdownFiles).toHaveBeenCalled();
    });
  });

  describe('resolveModule', () => {
    it('should resolve a valid module ID', async () => {
      resolver = new ModuleResolver({
        modulesPath: '/path/to/modules',
        index: [mockIndexedModule],
      });
      mockedReadFile.mockResolvedValue('content');
      const result = await resolver.resolveModule('foundation/core/basics');
      expect(result.success).toBe(true);
      expect(result.module?.id).toBe('foundation/core/basics');
    });

    it('should return not found for an invalid module ID', async () => {
      resolver = new ModuleResolver({
        modulesPath: '/path/to/modules',
        index: [mockIndexedModule],
      });
      const result = await resolver.resolveModule('invalid/id');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Module not found: invalid/id');
    });
  });
});
