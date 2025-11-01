/**
 * @file Tests for defineModule() and fromObject()
 */

import { describe, it, expect } from 'vitest';
import { defineModule } from './define-module.js';
import { ComponentType } from 'ums-lib';

describe('defineModule()', () => {
  it('should create a valid module with builder API', () => {
    const module = defineModule(m =>
      m
        .id('test/example-module')
        .version('1.0.0')
        .capabilities(['testing'])
        .cognitiveLevel(2)
        .metadata(meta =>
          meta
            .name('Example Module')
            .description('A test module')
            .semantic('test example module for unit testing')
        )
        .instruction(i =>
          i.purpose('Test the builder').process(['Step 1', 'Step 2'])
        )
    );

    expect(module).toBeDefined();
    expect(module.id).toBe('test/example-module');
    expect(module.version).toBe('1.0.0');
    expect(module.schemaVersion).toBe('2.0');
    expect(module.capabilities).toEqual(['testing']);
    expect(module.cognitiveLevel).toBe(2);
    expect(module.metadata.name).toBe('Example Module');
    expect(module.instruction?.type).toBe(ComponentType.Instruction);
  });

  it('should support nested metadata builder', () => {
    const module = defineModule(m =>
      m
        .id('test/metadata')
        .version('1.0.0')
        .capabilities(['metadata'])
        .cognitiveLevel(1)
        .metadata(meta =>
          meta
            .name('Metadata Test')
            .description('Testing metadata')
            .semantic('metadata test')
            .tags(['tag1', 'tag2'])
            .quality(q => q.maturity('stable').confidence(0.95))
        )
        .instruction(i => i.purpose('Test metadata'))
    );

    expect(module.metadata.tags).toEqual(['tag1', 'tag2']);
    expect(module.metadata.quality?.maturity).toBe('stable');
    expect(module.metadata.quality?.confidence).toBe(0.95);
  });

  it('should support instruction component with all fields', () => {
    const module = defineModule(m =>
      m
        .id('test/instruction')
        .version('1.0.0')
        .capabilities(['instruction'])
        .cognitiveLevel(3)
        .metadata(meta =>
          meta
            .name('Instruction Test')
            .description('Testing instruction')
            .semantic('instruction test')
        )
        .instruction(i =>
          i
            .purpose('Test instruction component')
            .process(['Step 1', 'Step 2'])
            .constraint('Never do X', 'error')
            .principle('Always do Y')
            .criterion('All tests pass', 'critical')
        )
    );

    const instruction = module.instruction;
    expect(instruction?.type).toBe(ComponentType.Instruction);
    expect(instruction?.instruction.purpose).toBe('Test instruction component');
    expect(instruction?.instruction.process).toHaveLength(2);
    expect(instruction?.instruction.constraints).toHaveLength(1);
    expect(instruction?.instruction.principles).toHaveLength(1);
    expect(instruction?.instruction.criteria).toHaveLength(1);
  });

  it('should support knowledge component', () => {
    const module = defineModule(m =>
      m
        .id('test/knowledge')
        .version('1.0.0')
        .capabilities(['knowledge'])
        .cognitiveLevel(2)
        .metadata(meta =>
          meta
            .name('Knowledge Test')
            .description('Testing knowledge')
            .semantic('knowledge test')
        )
        .knowledge(k =>
          k
            .explanation('This is a detailed explanation')
            .concept({
              name: 'Test Concept',
              description: 'A concept for testing',
              rationale: 'Because we need to test',
            })
            .example({
              title: 'Example 1',
              rationale: 'Shows the pattern',
              snippet: 'const x = 1;',
              language: 'typescript',
            })
        )
    );

    const knowledge = module.knowledge;
    expect(knowledge?.type).toBe(ComponentType.Knowledge);
    expect(knowledge?.knowledge.explanation).toBe(
      'This is a detailed explanation'
    );
    expect(knowledge?.knowledge.concepts).toHaveLength(1);
    expect(knowledge?.knowledge.examples).toHaveLength(1);
  });

  it('should support data component', () => {
    const module = defineModule(m =>
      m
        .id('test/data')
        .version('1.0.0')
        .capabilities(['data'])
        .cognitiveLevel(4)
        .metadata(meta =>
          meta
            .name('Data Test')
            .description('Testing data')
            .semantic('data test')
        )
        .data(d =>
          d.format('json').value({ key: 'value' }).description('Test data')
        )
    );

    const data = module.data;
    expect(data?.type).toBe(ComponentType.Data);
    expect(data?.data.format).toBe('json');
    expect(data?.data.value).toEqual({ key: 'value' });
    expect(data?.data.description).toBe('Test data');
  });

  it('should throw error if required fields are missing', () => {
    expect(() =>
      defineModule(m =>
        m
          .version('1.0.0')
          .capabilities(['test'])
          .cognitiveLevel(1)
          .metadata(meta =>
            meta.name('Test').description('Test').semantic('test')
          )
          .instruction(i => i.purpose('Test'))
      )
    ).toThrow('Module requires an id');

    expect(() =>
      defineModule(m =>
        m
          .id('test/module')
          .capabilities(['test'])
          .cognitiveLevel(1)
          .metadata(meta =>
            meta.name('Test').description('Test').semantic('test')
          )
          .instruction(i => i.purpose('Test'))
      )
    ).toThrow('Module requires a version');
  });

  it('should validate cognitive level range', () => {
    expect(() =>
      defineModule(m =>
        m
          .id('test/module')
          .version('1.0.0')
          .capabilities(['test'])
          .cognitiveLevel(10) // Invalid: > 6
          .metadata(meta =>
            meta.name('Test').description('Test').semantic('test')
          )
          .instruction(i => i.purpose('Test'))
      )
    ).toThrow('Cognitive level must be an integer between 0 and 6');
  });

  it('should return immutable module', () => {
    const module = defineModule(m =>
      m
        .id('test/immutable')
        .version('1.0.0')
        .capabilities(['immutable'])
        .cognitiveLevel(1)
        .metadata(meta =>
          meta.name('Immutable').description('Test').semantic('immutable')
        )
        .instruction(i => i.purpose('Test immutability'))
    );

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (module as any).id = 'changed';
    }).toThrow();
  });
});

describe('defineModule.fromObject()', () => {
  it('should create module from plain object', () => {
    const moduleData = {
      id: 'test/from-object',
      version: '1.0.0',
      schemaVersion: '2.0',
      capabilities: ['from-object'],
      cognitiveLevel: 2,
      metadata: {
        name: 'From Object',
        description: 'Created from plain object',
        semantic: 'from object test',
      },
      instruction: {
        type: ComponentType.Instruction,
        instruction: {
          purpose: 'Test fromObject',
          process: ['Step 1'],
        },
      },
    };

    const module = defineModule.fromObject(moduleData);

    expect(module.id).toBe('test/from-object');
    expect(module.version).toBe('1.0.0');
    expect(module.metadata.name).toBe('From Object');
  });

  it('should validate object and throw errors for invalid data', () => {
    const invalidData = {
      // Missing required fields
      version: '1.0.0',
    };

    expect(() => defineModule.fromObject(invalidData)).toThrow();
  });

  it('should handle migration from static objects', () => {
    // Simulate a v1.0 static module
    const staticModule = {
      id: 'migration/example',
      version: '1.0.0',
      schemaVersion: '2.0',
      capabilities: ['migration'],
      cognitiveLevel: 1,
      metadata: {
        name: 'Migration Example',
        description: 'Migrated from static',
        semantic: 'migration static object',
      },
      instruction: {
        type: ComponentType.Instruction,
        instruction: {
          purpose: 'Demonstrate migration',
          process: ['Step 1', 'Step 2'],
        },
      },
    };

    const module = defineModule.fromObject(staticModule);

    expect(module).toBeDefined();
    expect(module.id).toBe('migration/example');
    expect(module.metadata.name).toBe('Migration Example');
  });

  it('should throw for non-object input', () => {
    expect(() => defineModule.fromObject('not an object')).toThrow(
      'Cannot hydrate from non-object value'
    );
    expect(() => defineModule.fromObject(null)).toThrow(
      'Cannot hydrate from non-object value'
    );
  });
});

describe('defineModule() vs fromObject() equivalence', () => {
  it('should produce equivalent modules via both paths', () => {
    // Create via builder
    const viaBuilder = defineModule(m =>
      m
        .id('equivalence/test')
        .version('1.0.0')
        .capabilities(['equivalence'])
        .cognitiveLevel(2)
        .metadata(meta =>
          meta
            .name('Equivalence Test')
            .description('Testing equivalence')
            .semantic('equivalence test')
        )
        .instruction(i =>
          i.purpose('Test equivalence').process(['Step 1', 'Step 2'])
        )
    );

    // Create via fromObject
    const viaFromObject = defineModule.fromObject({
      id: 'equivalence/test',
      version: '1.0.0',
      schemaVersion: '2.0',
      capabilities: ['equivalence'],
      cognitiveLevel: 2,
      metadata: {
        name: 'Equivalence Test',
        description: 'Testing equivalence',
        semantic: 'equivalence test',
      },
      instruction: {
        type: ComponentType.Instruction,
        instruction: {
          purpose: 'Test equivalence',
          process: ['Step 1', 'Step 2'],
        },
      },
    });

    // Both should have the same structure
    expect(viaBuilder.id).toBe(viaFromObject.id);
    expect(viaBuilder.version).toBe(viaFromObject.version);
    expect(viaBuilder.capabilities).toEqual(viaFromObject.capabilities);
    expect(viaBuilder.metadata.name).toBe(viaFromObject.metadata.name);
  });
});
