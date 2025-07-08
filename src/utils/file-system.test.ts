import { vi, describe, it, expect, beforeEach } from 'vitest';
import { findMarkdownFiles } from './file-system.js';
import { readdir, stat } from 'fs/promises';

vi.mock('fs/promises');

const mockedReaddir = vi.mocked(readdir);
const mockedStat = vi.mocked(stat);

describe('findMarkdownFiles', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should find markdown files in a directory', async () => {
    const files = ['test.md', 'test2.md'];
    mockedReaddir.mockResolvedValue(files as any);
    mockedStat.mockResolvedValue({
      isDirectory: () => false,
      isFile: () => true,
    } as any);

    const result = await findMarkdownFiles('/fake/dir');
    expect(result).toEqual(['/fake/dir/test.md', '/fake/dir/test2.md']);
  });

  it('should recursively find files in subdirectories', async () => {
    // Setup root directory
    mockedReaddir.mockResolvedValueOnce(['subdir', 'root.md'] as any);
    mockedStat
      .mockResolvedValueOnce({
        isDirectory: () => true,
        isFile: () => false,
      } as any) // subdir
      .mockResolvedValueOnce({
        isDirectory: () => false,
        isFile: () => true,
      } as any); // root.md

    // Setup subdirectory
    mockedReaddir.mockResolvedValueOnce(['sub.md'] as any);
    mockedStat.mockResolvedValueOnce({
      isDirectory: () => false,
      isFile: () => true,
    } as any); // sub.md

    const result = await findMarkdownFiles('/fake/dir');
    expect(mockedReaddir).toHaveBeenCalledWith('/fake/dir');
    expect(mockedReaddir).toHaveBeenCalledWith('/fake/dir/subdir');
    expect(result).toEqual(['/fake/dir/root.md', '/fake/dir/subdir/sub.md']);
  });

  it('should return an empty array for a directory with no markdown files', async () => {
    const files = ['test.txt', 'test2.js'];
    mockedReaddir.mockResolvedValue(files as any);
    mockedStat.mockResolvedValue({
      isDirectory: () => false,
      isFile: () => true,
    } as any);

    const result = await findMarkdownFiles('/fake/dir');
    expect(result).toEqual([]);
  });

  it('should throw an error for a non-existent directory', async () => {
    mockedReaddir.mockRejectedValue(new Error('ENOENT'));
    await expect(findMarkdownFiles('/non/existent')).rejects.toThrow(
      'Failed to read directory "/non/existent": ENOENT'
    );
  });

  it('should ignore files that are not markdown', async () => {
    const files = ['test.md', 'test.txt'];
    mockedReaddir.mockResolvedValue(files as any);
    mockedStat.mockResolvedValue({
      isDirectory: () => false,
      isFile: () => true,
    } as any);

    const result = await findMarkdownFiles('/fake/dir');
    expect(result).toEqual(['/fake/dir/test.md']);
  });
});
