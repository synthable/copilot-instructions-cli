/**
 * Tests for TypeScript declaration (.d.ts) generator
 */

import { describe, it, expect } from 'vitest';
import type { Module } from 'ums-lib';
import { CognitiveLevel, ComponentType, moduleIdToExportName } from 'ums-lib';
import {
  generateDeclaration,
  generateDeclarations,
} from './declaration-generator.js';

describe('moduleIdToExportName', () => {
  it('should convert simple kebab-case to camelCase', () => {
    expect(moduleIdToExportName('error-handling')).toBe('errorHandling');
    expect(moduleIdToExportName('do-no-harm')).toBe('doNoHarm');
  });

  it('should handle module IDs with slashes', () => {
    expect(moduleIdToExportName('foundation/ethics/do-no-harm')).toBe(
      'doNoHarm'
    );
    expect(moduleIdToExportName('reasoning/critical-thinking')).toBe(
      'criticalThinking'
    );
  });

  it('should handle single-word IDs', () => {
    expect(moduleIdToExportName('ethics')).toBe('ethics');
  });
});

describe('generateDeclaration', () => {
  const mockModule: Module = {
    id: 'foundation/ethics/do-no-harm',
    version: '1.0.0',
    schemaVersion: '2.1',
    capabilities: ['ethics'],
    cognitiveLevel: CognitiveLevel.AXIOMS_AND_ETHICS,
    metadata: {
      name: 'Do No Harm',
      description: 'Fundamental ethical principle for AI behavior',
      semantic: 'ethics safety harm-prevention',
    },
    instruction: {
      type: ComponentType.Instruction,
      instruction: {
        purpose: 'Ensure AI actions prioritize user safety',
      },
    },
  };

  it('should generate declaration with JSDoc comments by default', () => {
    const result = generateDeclaration(
      mockModule,
      '/path/to/do-no-harm.module.ts'
    );

    expect(result.path).toBe('/path/to/do-no-harm.module.d.ts');
    expect(result.content).toContain("import type { Module } from 'ums-lib';");
    expect(result.content).toContain('/**');
    expect(result.content).toContain(' * Do No Harm');
    expect(result.content).toContain(
      ' * Fundamental ethical principle for AI behavior'
    );
    expect(result.content).toContain('export declare const doNoHarm: Module;');
  });

  it('should generate declaration without JSDoc when disabled', () => {
    const result = generateDeclaration(
      mockModule,
      '/path/to/do-no-harm.module.ts',
      { includeJSDoc: false }
    );

    expect(result.content).toContain("import type { Module } from 'ums-lib';");
    expect(result.content).not.toContain('/**');
    expect(result.content).toContain('export declare const doNoHarm: Module;');
  });

  it('should handle different module IDs correctly', () => {
    const errorHandlingModule: Module = {
      ...mockModule,
      id: 'error-handling',
      metadata: {
        name: 'Error Handling',
        description: 'Error handling patterns',
        semantic: 'errors exceptions',
      },
    };

    const result = generateDeclaration(
      errorHandlingModule,
      '/path/to/error-handling.module.ts'
    );

    expect(result.path).toBe('/path/to/error-handling.module.d.ts');
    expect(result.content).toContain(
      'export declare const errorHandling: Module;'
    );
  });
});

describe('generateDeclarations', () => {
  const mockModules = [
    {
      module: {
        id: 'ethics',
        version: '1.0.0',
        schemaVersion: '2.1' as const,
        capabilities: ['ethics'],
        cognitiveLevel: CognitiveLevel.AXIOMS_AND_ETHICS,
        metadata: {
          name: 'Ethics',
          description: 'Ethical guidelines',
          semantic: 'ethics morals',
        },
      } as Module,
      sourcePath: '/modules/ethics.module.ts',
    },
    {
      module: {
        id: 'error-handling',
        version: '1.0.0',
        schemaVersion: '2.1' as const,
        capabilities: ['error-handling'],
        cognitiveLevel: CognitiveLevel.UNIVERSAL_PATTERNS,
        metadata: {
          name: 'Error Handling',
          description: 'Error patterns',
          semantic: 'errors exceptions',
        },
      } as Module,
      sourcePath: '/modules/error-handling.module.ts',
    },
  ];

  it('should generate declarations for multiple modules', () => {
    const results = generateDeclarations(mockModules);

    expect(results).toHaveLength(2);
    expect(results[0].path).toBe('/modules/ethics.module.d.ts');
    expect(results[0].content).toContain(
      'export declare const ethics: Module;'
    );
    expect(results[1].path).toBe('/modules/error-handling.module.d.ts');
    expect(results[1].content).toContain(
      'export declare const errorHandling: Module;'
    );
  });

  it('should apply options to all modules', () => {
    const results = generateDeclarations(mockModules, { includeJSDoc: false });

    results.forEach(result => {
      expect(result.content).not.toContain('/**');
    });
  });
});
