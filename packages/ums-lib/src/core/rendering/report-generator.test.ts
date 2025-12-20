/**
 * Tests for build report generation functions
 */

import { describe, expect, it } from 'vitest';
import {
  generateBuildReport,
  generatePersonaDigest,
  generateModuleDigest,
} from './report-generator.js';
import type { Module, Persona } from '../../types/index.js';
import { CognitiveLevel, ComponentType } from '../../types/index.js';

describe('generateModuleDigest', () => {
  it('should generate SHA-256 digest for module content', () => {
    const content = 'test module content';
    const digest = generateModuleDigest(content);

    expect(digest).toBeTruthy();
    expect(digest).toHaveLength(71); // sha256: prefix (7) + 64 hex characters
    expect(digest).toMatch(/^sha256:[a-f0-9]{64}$/); // Prefixed hex string
  });

  it('should generate consistent digests for same content', () => {
    const content = 'test module content';
    const digest1 = generateModuleDigest(content);
    const digest2 = generateModuleDigest(content);

    expect(digest1).toBe(digest2);
  });

  it('should generate different digests for different content', () => {
    const content1 = 'test module content 1';
    const content2 = 'test module content 2';
    const digest1 = generateModuleDigest(content1);
    const digest2 = generateModuleDigest(content2);

    expect(digest1).not.toBe(digest2);
  });

  it('should handle empty string', () => {
    const digest = generateModuleDigest('');

    expect(digest).toBeTruthy();
    expect(digest).toHaveLength(71); // sha256: prefix (7) + 64 hex characters
  });

  it('should handle special characters and unicode', () => {
    const content = '特殊字符 ñ © 🎉';
    const digest = generateModuleDigest(content);

    expect(digest).toBeTruthy();
    expect(digest).toHaveLength(71); // sha256: prefix (7) + 64 hex characters
  });
});

describe('generatePersonaDigest', () => {
  const basePersona: Persona = {
    id: 'test-persona',
    name: 'Test Persona',
    version: '1.0.0',
    schemaVersion: '2.0',
    description: 'A test persona',
    semantic: 'test persona for testing',
    modules: ['module-1'],
  };

  it('should generate SHA-256 digest for persona', () => {
    const digest = generatePersonaDigest(basePersona);

    expect(digest).toBeTruthy();
    expect(digest).toHaveLength(71); // sha256: prefix (7) + 64 hex characters
    expect(digest).toMatch(/^sha256:[a-f0-9]{64}$/); // Prefixed hex string
  });

  it('should generate consistent digests for same persona', () => {
    const digest1 = generatePersonaDigest(basePersona);
    const digest2 = generatePersonaDigest(basePersona);

    expect(digest1).toBe(digest2);
  });

  it('should generate different digests when modules change', () => {
    const persona1 = { ...basePersona, modules: ['module-1'] };
    const persona2 = { ...basePersona, modules: ['module-2'] };

    const digest1 = generatePersonaDigest(persona1);
    const digest2 = generatePersonaDigest(persona2);

    expect(digest1).not.toBe(digest2);
  });

  it('should generate different digests when description changes', () => {
    const persona1 = { ...basePersona, description: 'Description 1' };
    const persona2 = { ...basePersona, description: 'Description 2' };

    const digest1 = generatePersonaDigest(persona1);
    const digest2 = generatePersonaDigest(persona2);

    expect(digest1).not.toBe(digest2);
  });

  it('should include identity in digest if present', () => {
    const persona1 = { ...basePersona };
    const persona2 = { ...basePersona, identity: 'Custom identity' };

    const digest1 = generatePersonaDigest(persona1);
    const digest2 = generatePersonaDigest(persona2);

    expect(digest1).not.toBe(digest2);
  });

  it('should handle persona with grouped modules', () => {
    const persona: Persona = {
      ...basePersona,
      modules: [
        { group: 'Group 1', ids: ['module-1', 'module-2'] },
        'module-3',
      ],
    };

    const digest = generatePersonaDigest(persona);

    expect(digest).toBeTruthy();
    expect(digest).toHaveLength(71); // sha256: prefix (7) + 64 hex characters
  });
});

describe('generateBuildReport', () => {
  const testModule: Module = {
    id: 'test-module',
    version: '1.0.0',
    schemaVersion: '2.0',
    capabilities: ['testing'],
    cognitiveLevel: CognitiveLevel.UNIVERSAL_PATTERNS,
    metadata: {
      name: 'Test Module',
      description: 'A test module',
      semantic: 'test module semantic',
    },
    instruction: {
      type: ComponentType.Instruction,
      purpose: 'Test purpose',
    },
  };

  const testPersona: Persona = {
    id: 'test-persona',
    name: 'Test Persona',
    version: '1.0.0',
    schemaVersion: '2.0',
    description: 'A test persona',
    semantic: 'test persona semantic',
    modules: ['test-module'],
  };

  it('should generate complete build report', () => {
    const report = generateBuildReport(testPersona, [testModule]);

    expect(report).toMatchObject({
      personaName: 'Test Persona',
      schemaVersion: '2.0',
    });
    expect(report.toolVersion).toBeTruthy();
    expect(report.personaDigest).toHaveLength(71); // sha256: prefix (7) + 64 hex characters
    expect(report.buildTimestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/); // ISO 8601
    expect(report.moduleGroups).toHaveLength(1);
  });

  it('should include module details in report', () => {
    const report = generateBuildReport(testPersona, [testModule]);
    const module = report.moduleGroups[0].modules[0];

    expect(module).toMatchObject({
      id: 'test-module',
      name: 'Test Module',
      version: '1.0.0',
      source: 'Local',
      deprecated: false,
    });
  });

  it('should generate module digest when content provided', () => {
    const moduleContents = new Map([['test-module', 'module file content']]);
    const report = generateBuildReport(
      testPersona,
      [testModule],
      moduleContents
    );
    const module = report.moduleGroups[0].modules[0];

    expect(module.digest).toMatch(/^sha256:[a-f0-9]{64}$/);
  });

  it('should have empty digest when module content not provided', () => {
    const report = generateBuildReport(testPersona, [testModule]);
    const module = report.moduleGroups[0].modules[0];

    expect(module.digest).toBe('');
  });

  it('should include replacedBy when module is deprecated', () => {
    const deprecatedModule: Module = {
      ...testModule,
      metadata: {
        ...testModule.metadata,
        deprecated: true,
        replacedBy: 'new-module',
      },
    };

    const report = generateBuildReport(testPersona, [deprecatedModule]);
    const module = report.moduleGroups[0].modules[0];

    expect(module.deprecated).toBe(true);
    expect(module.replacedBy).toBe('new-module');
  });

  it('should not include replacedBy when not deprecated', () => {
    const report = generateBuildReport(testPersona, [testModule]);
    const module = report.moduleGroups[0].modules[0];

    expect(module.replacedBy).toBeUndefined();
  });

  it('should handle grouped modules', () => {
    const persona: Persona = {
      ...testPersona,
      modules: [{ group: 'Foundation', ids: ['test-module'] }],
    };

    const report = generateBuildReport(persona, [testModule]);

    expect(report.moduleGroups).toHaveLength(1);
    expect(report.moduleGroups[0].groupName).toBe('Foundation');
    expect(report.moduleGroups[0].modules).toHaveLength(1);
  });

  it('should handle flat (ungrouped) modules', () => {
    const report = generateBuildReport(testPersona, [testModule]);

    expect(report.moduleGroups).toHaveLength(1);
    expect(report.moduleGroups[0].groupName).toBe('');
    expect(report.moduleGroups[0].modules).toHaveLength(1);
  });

  it('should handle multiple module groups', () => {
    const module2: Module = {
      ...testModule,
      id: 'test-module-2',
      metadata: {
        ...testModule.metadata,
        name: 'Test Module 2',
      },
    };

    const persona: Persona = {
      ...testPersona,
      modules: [
        { group: 'Group 1', ids: ['test-module'] },
        { group: 'Group 2', ids: ['test-module-2'] },
      ],
    };

    const report = generateBuildReport(persona, [testModule, module2]);

    expect(report.moduleGroups).toHaveLength(2);
    expect(report.moduleGroups[0].groupName).toBe('Group 1');
    expect(report.moduleGroups[1].groupName).toBe('Group 2');
  });

  it('should handle mixed grouped and ungrouped modules', () => {
    const module2: Module = {
      ...testModule,
      id: 'test-module-2',
      metadata: {
        ...testModule.metadata,
        name: 'Test Module 2',
      },
    };

    const persona: Persona = {
      ...testPersona,
      modules: ['test-module', { group: 'Group 1', ids: ['test-module-2'] }],
    };

    const report = generateBuildReport(persona, [testModule, module2]);

    expect(report.moduleGroups).toHaveLength(2);
    expect(report.moduleGroups[0].groupName).toBe('');
    expect(report.moduleGroups[1].groupName).toBe('Group 1');
  });

  it('should skip modules not found in provided modules array', () => {
    const persona: Persona = {
      ...testPersona,
      modules: ['test-module', 'missing-module'],
    };

    const report = generateBuildReport(persona, [testModule]);

    expect(report.moduleGroups[0].modules).toHaveLength(1);
    expect(report.moduleGroups[0].modules[0].id).toBe('test-module');
  });

  it('should generate valid ISO 8601 timestamp', () => {
    const report = generateBuildReport(testPersona, [testModule]);
    const timestamp = new Date(report.buildTimestamp);

    expect(timestamp.toISOString()).toBe(report.buildTimestamp);
    expect(isNaN(timestamp.getTime())).toBe(false);
  });

  it('should include persona identity in digest when present', () => {
    const persona1: Persona = { ...testPersona };
    const persona2: Persona = { ...testPersona, identity: 'Custom identity' };

    const report1 = generateBuildReport(persona1, [testModule]);
    const report2 = generateBuildReport(persona2, [testModule]);

    expect(report1.personaDigest).not.toBe(report2.personaDigest);
  });
});
