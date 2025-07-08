import { vi, describe, it, expect, beforeEach } from 'vitest';
import { readFile } from 'fs/promises';
import { parseModuleMetadata, isValidTier, getValidTiers } from './parser.js';

vi.mock('fs/promises');

const mockedReadFile = vi.mocked(readFile);

describe('parser', () => {
  describe('parseModuleMetadata', () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it('should parse a well-formed module file', async () => {
      const filePath = '/path/to/modules/foundation/core/basics.md';
      const modulesPath = '/path/to/modules';
      const fileContent = `---
name: Basics
description: Basic foundation concepts
tags: [core, foundation]
dependencies: [dep1]
conflicts: [con1]
---
Some content`;

      mockedReadFile.mockResolvedValue(fileContent);

      const result = await parseModuleMetadata(filePath, modulesPath);

      expect(result).toEqual({
        id: 'foundation/core/basics',
        path: filePath,
        tier: 'foundation',
        subject: 'core',
        metadata: {
          tier: 'foundation',
          name: 'Basics',
          subject: 'core',
          description: 'Basic foundation concepts',
          tags: ['core', 'foundation'],
          dependencies: ['dep1'],
          conflicts: ['con1'],
        },
      });
    });

    it('should throw an error if name is missing', async () => {
      const filePath = '/path/to/modules/foundation/core/basics.md';
      const modulesPath = '/path/to/modules';
      const fileContent = `---
description: Basic foundation concepts
---`;
      mockedReadFile.mockResolvedValue(fileContent);
      await expect(parseModuleMetadata(filePath, modulesPath)).rejects.toThrow(
        'Missing or invalid required field: name'
      );
    });

    it('should throw an error if description is missing', async () => {
      const filePath = '/path/to/modules/foundation/core/basics.md';
      const modulesPath = '/path/to/modules';
      const fileContent = `---
name: Basics
---`;
      mockedReadFile.mockResolvedValue(fileContent);
      await expect(parseModuleMetadata(filePath, modulesPath)).rejects.toThrow(
        'Missing or invalid required field: description'
      );
    });

    it('should throw an error for invalid path structure', async () => {
      const filePath = '/path/to/modules/basics.md';
      const modulesPath = '/path/to/modules';
      const fileContent = `---
name: Basics
description: desc
---`;
      mockedReadFile.mockResolvedValue(fileContent);
      await expect(parseModuleMetadata(filePath, modulesPath)).rejects.toThrow(
        'Invalid module path structure'
      );
    });

    it('should throw an error for invalid tier', async () => {
      const filePath = '/path/to/modules/invalid/core/basics.md';
      const modulesPath = '/path/to/modules';
      const fileContent = `---
name: Basics
description: desc
---`;
      mockedReadFile.mockResolvedValue(fileContent);
      await expect(parseModuleMetadata(filePath, modulesPath)).rejects.toThrow(
        'Invalid tier "invalid"'
      );
    });

    it('should throw an error if readFile fails', async () => {
      const filePath = '/path/to/modules/foundation/core/basics.md';
      const modulesPath = '/path/to/modules';
      mockedReadFile.mockRejectedValue(new Error('File not found'));
      await expect(parseModuleMetadata(filePath, modulesPath)).rejects.toThrow(
        'Failed to parse module metadata for "/path/to/modules/foundation/core/basics.md": File not found'
      );
    });
  });

  describe('isValidTier', () => {
    it('should return true for valid tiers', () => {
      expect(isValidTier('foundation')).toBe(true);
      expect(isValidTier('principle')).toBe(true);
      expect(isValidTier('technology')).toBe(true);
      expect(isValidTier('execution')).toBe(true);
    });

    it('should return false for invalid tiers', () => {
      expect(isValidTier('invalid')).toBe(false);
      expect(isValidTier('')).toBe(false);
    });
  });

  describe('getValidTiers', () => {
    it('should return all valid tiers', () => {
      expect(getValidTiers()).toEqual([
        'foundation',
        'principle',
        'technology',
        'execution',
      ]);
    });
  });
});
