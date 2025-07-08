import { vi, describe, it, expect } from 'vitest';
import { readFile } from 'fs/promises';

import {
  loadPersonaFile,
  personaToOptions,
  mergeConfigurations,
  compileModules,
} from './build.js';
import type { TierOrderedResolutionResult } from '../core/resolver.js';

vi.mock('fs/promises');

const mockedReadFile = vi.mocked(readFile);

describe('build command', () => {
  describe('loadPersonaFile', () => {
    it('should load and parse a valid persona file', async () => {
      const persona = { name: 'test', output: { file: 'out.md' }, modules: [] };
      mockedReadFile.mockResolvedValue(JSON.stringify(persona));
      const result = await loadPersonaFile('persona.json');
      expect(result).toEqual(persona);
    });

    it('should return null for a non-existent file', async () => {
      const error: NodeJS.ErrnoException = new Error('Not found');
      error.code = 'ENOENT';
      mockedReadFile.mockRejectedValue(error);
      const result = await loadPersonaFile('non-existent.json');
      expect(result).toBeNull();
    });

    it('should return null for an invalid JSON file', async () => {
      mockedReadFile.mockResolvedValue('invalid json');
      const result = await loadPersonaFile('invalid.json');
      expect(result).toBeNull();
    });
  });

  describe('personaToOptions', () => {
    it('should convert a persona file to build options', () => {
      const persona = {
        name: 'test',
        output: {
          file: 'out.md',
          format: { includeAttribution: true, header: 'h', footer: 'f' },
        },
        modules: ['mod1'],
        optional_modules: ['opt1'],
      };
      const options = personaToOptions(persona);
      expect(options).toEqual({
        output: 'out.md',
        includeAttribution: true,
        header: 'h',
        footer: 'f',
        modules: ['mod1'],
        optionalModules: ['opt1'],
      });
    });
  });

  describe('mergeConfigurations', () => {
    it('should give precedence to CLI options', () => {
      const personaOptions = { output: 'persona.md', header: 'persona-header' };
      const cliOptions = { output: 'cli.md' };
      const merged = mergeConfigurations(personaOptions, cliOptions);
      expect(merged.output).toBe('cli.md');
      expect(merged.header).toBe('persona-header');
    });
  });

  describe('compileModules', () => {
    it('should compile modules into a single string', () => {
      const resolutionResult: TierOrderedResolutionResult = {
        byTier: {
          foundation: [
            {
              id: 'f1',
              path: '',
              metadata: {
                name: 'F1',
                tier: 'foundation',
                subject: 's',
                description: 'd',
              },
              content: 'foundation content',
            },
          ],
          principle: [],
          technology: [],
          execution: [],
        },
        failed: [],
        notFound: [],
      };
      const config = {};
      const result = compileModules(resolutionResult, config);
      expect(result).toContain('## Foundation Tier');
      expect(result).toContain('foundation content');
    });

    it('should include header and footer', () => {
      const resolutionResult: TierOrderedResolutionResult = {
        byTier: {
          foundation: [],
          principle: [],
          technology: [],
          execution: [],
        },
        failed: [],
        notFound: [],
      };
      const config = { header: 'my-header', footer: 'my-footer' };
      const result = compileModules(resolutionResult, config);
      expect(result).toContain('my-header');
      expect(result).toContain('my-footer');
    });

    it('should include attribution when enabled', () => {
      const resolutionResult: TierOrderedResolutionResult = {
        byTier: {
          foundation: [
            {
              id: 'f1',
              path: '',
              metadata: {
                name: 'F1',
                tier: 'foundation',
                subject: 's',
                description: 'd',
              },
              content: 'foundation content',
            },
          ],
          principle: [],
          technology: [],
          execution: [],
        },
        failed: [],
        notFound: [],
      };
      const config = { includeAttribution: true };
      const result = compileModules(resolutionResult, config);
      expect(result).toContain('### F1');
      expect(result).toContain('*Source: f1*');
    });
  });
});
