/**
 * @file Usage examples for the UMS v2.0 Builder API
 *
 * This file demonstrates various patterns for using the defineModule() builder API
 * and the defineModule.fromObject() gateway.
 */

import { defineModule } from '../src/authoring/index.js';
import { ComponentType } from 'ums-lib';

// ==============================================================================
// Example 1: Simple Instruction Module
// ==============================================================================

export const simpleInstruction = defineModule(m =>
  m
    .id('examples/simple-instruction')
    .version('1.0.0')
    .capabilities(['example', 'instruction'])
    .cognitiveLevel(2)
    .metadata(meta =>
      meta
        .name('Simple Instruction Example')
        .description('A basic example of an instruction module')
        .semantic('simple instruction example demonstration builder api')
    )
    .instruction(i =>
      i
        .purpose('Demonstrate the simplest form of an instruction module')
        .process(['Step 1: Read the documentation', 'Step 2: Try the builder'])
    )
);

// ==============================================================================
// Example 2: Complex Instruction with Constraints and Principles
// ==============================================================================

export const complexInstruction = defineModule(m =>
  m
    .id('examples/complex-instruction')
    .version('1.0.0')
    .capabilities(['example', 'instruction', 'validation'])
    .cognitiveLevel(3)
    .domain('software-engineering')
    .metadata(meta =>
      meta
        .name('Complex Instruction Example')
        .description('An instruction module with all features')
        .semantic('complex instruction constraints principles criteria validation')
        .tags(['example', 'advanced', 'instruction'])
        .quality(q => q.maturity('stable').confidence(0.95))
    )
    .instruction(i =>
      i
        .purpose('Guide developers through a complex validation process')
        .process([
          'Read the requirements carefully',
          {
            step: 'Validate inputs',
            detail: 'Check all inputs against the schema',
            validate: {
              check: 'All fields present and valid types',
              severity: 'error',
            },
          },
          'Process the data',
          {
            step: 'Handle errors gracefully',
            when: 'An error occurs',
            do: 'Log error and return user-friendly message',
          },
        ])
        .constraint('Never skip validation', 'error')
        .constraint({
          rule: 'Always use type-safe validation',
          severity: 'error',
          rationale: 'Prevents runtime errors',
          examples: {
            valid: ['TypeScript interfaces', 'Zod schemas'],
            invalid: ['Unchecked any types', 'Implicit validation'],
          },
        })
        .principle('Fail fast in development')
        .principle('Provide clear error messages')
        .criterion('All tests pass', 'critical')
        .criterion({
          item: 'Code coverage above 80%',
          severity: 'important',
          category: 'testing',
        })
    )
);

// ==============================================================================
// Example 3: Knowledge Module
// ==============================================================================

export const knowledgeModule = defineModule(m =>
  m
    .id('examples/knowledge-module')
    .version('1.0.0')
    .capabilities(['example', 'knowledge', 'concepts'])
    .cognitiveLevel(2)
    .metadata(meta =>
      meta
        .name('Knowledge Module Example')
        .description('Demonstrates knowledge component structure')
        .semantic('knowledge concepts examples patterns builder api')
    )
    .knowledge(k =>
      k
        .explanation(
          'This module demonstrates how to structure knowledge using the builder API. ' +
            'Knowledge modules explain concepts, provide examples, and document patterns.'
        )
        .concept({
          name: 'Builder Pattern',
          description:
            'A design pattern that provides a fluent interface for constructing complex objects',
          rationale:
            'Improves discoverability, reduces errors, and provides better developer experience',
          examples: [
            'new StringBuilder().append("Hello").append(" World").toString()',
            'defineModule(m => m.id("example").version("1.0.0"))',
          ],
          tradeoffs: [
            'Pro: Better discoverability through method chaining',
            'Pro: Compile-time validation of required fields',
            'Con: Slightly more verbose than object literals',
          ],
        })
        .example({
          title: 'Basic Builder Usage',
          rationale: 'Shows the simplest builder pattern implementation',
          language: 'typescript',
          snippet: `
class PersonBuilder {
  private name?: string;
  private age?: number;

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setAge(age: number): this {
    this.age = age;
    return this;
  }

  build(): Person {
    if (!this.name) throw new Error('Name required');
    return { name: this.name, age: this.age };
  }
}

const person = new PersonBuilder()
  .setName('Alice')
  .setAge(30)
  .build();
          `.trim(),
        })
        .pattern({
          name: 'Nested Builders',
          useCase: 'When building complex objects with nested structures',
          description:
            'Use callback functions to provide dedicated builders for nested objects',
          advantages: [
            'Clear separation of concerns',
            'Better type inference',
            'Improved discoverability',
          ],
          disadvantages: [
            'Slightly more complex API',
            'Requires understanding of callbacks',
          ],
          example: {
            title: 'Nested Builder Example',
            rationale: 'Demonstrates nested builder pattern',
            language: 'typescript',
            snippet: `
.metadata(meta =>
  meta
    .name('Module Name')
    .quality(q =>
      q.maturity('stable').confidence(0.95)
    )
)
            `.trim(),
          },
        })
    )
);

// ==============================================================================
// Example 4: Data Module
// ==============================================================================

export const dataModule = defineModule(m =>
  m
    .id('examples/data-module')
    .version('1.0.0')
    .capabilities(['example', 'data', 'configuration'])
    .cognitiveLevel(4)
    .metadata(meta =>
      meta
        .name('Data Module Example')
        .description('Demonstrates data component structure')
        .semantic('data configuration structured json builder api')
    )
    .data(d =>
      d
        .format('json')
        .description('Example configuration data for the builder API')
        .value({
          defaultCognitiveLevel: 2,
          validationRules: {
            requireMetadata: true,
            requireComponent: true,
            maxIdLength: 100,
          },
          supportedFormats: ['json', 'yaml', 'xml'],
          qualityThresholds: {
            minConfidence: 0.7,
            minCoverage: 0.8,
          },
        })
    )
);

// ==============================================================================
// Example 5: Module with Relationships
// ==============================================================================

export const moduleWithRelationships = defineModule(m =>
  m
    .id('examples/module-with-relationships')
    .version('1.0.0')
    .capabilities(['example', 'relationships'])
    .cognitiveLevel(3)
    .metadata(meta =>
      meta
        .name('Module with Relationships')
        .description('Demonstrates module relationship metadata')
        .semantic('relationships dependencies requires recommends extends')
        .requires(['examples/simple-instruction'])
        .recommends(['examples/knowledge-module'])
        .authors(['Builder API Team'])
        .license('MIT')
        .homepage('https://github.com/example/ums-builder-api')
    )
    .instruction(i =>
      i
        .purpose('Demonstrate how modules can declare relationships')
        .process([
          'Use requires() for hard dependencies',
          'Use recommends() for optional enhancements',
          'Use extends() for inheritance',
        ])
    )
);

// ==============================================================================
// Example 6: Migration from Static Object using fromObject()
// ==============================================================================

// Original static module (before migration)
const staticModuleData = {
  id: 'examples/migrated-module',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['example', 'migration'],
  cognitiveLevel: 2,
  metadata: {
    name: 'Migrated Module',
    description: 'Migrated from static object to builder API',
    semantic: 'migration static object builder api validation',
  },
  instruction: {
    type: ComponentType.Instruction,
    instruction: {
      purpose: 'Demonstrate migration path from static objects',
      process: [
        'Wrap existing object with defineModule.fromObject()',
        'Verify output is identical',
        'Optionally refactor to builder syntax later',
      ],
    },
  },
};

// Migrated using fromObject() gateway
export const migratedModule = defineModule.fromObject(staticModuleData);

// ==============================================================================
// Example 7: Programmatic Module Generation
// ==============================================================================

interface ModuleTemplate {
  id: string;
  name: string;
  purpose: string;
  steps: string[];
  domain?: string;
}

/**
 * Factory function that generates modules from templates
 */
export function generateModuleFromTemplate(
  template: ModuleTemplate
): ReturnType<typeof defineModule> {
  return defineModule(m => {
    const builder = m
      .id(template.id)
      .version('1.0.0')
      .capabilities(['generated', 'template'])
      .cognitiveLevel(3)
      .metadata(meta =>
        meta
          .name(template.name)
          .description(`Generated from template: ${template.name}`)
          .semantic(`${template.name.toLowerCase()} generated template`)
      )
      .instruction(i => i.purpose(template.purpose).process(template.steps));

    // Conditionally add domain
    if (template.domain) {
      builder.domain(template.domain);
    }

    return builder;
  });
}

// Usage example
export const generatedModule = generateModuleFromTemplate({
  id: 'examples/generated-module',
  name: 'Generated Module',
  purpose: 'Demonstrate programmatic generation',
  steps: ['Step 1: Define template', 'Step 2: Generate module', 'Step 3: Use module'],
  domain: 'automation',
});

// ==============================================================================
// Example 8: Module with Multiple Components (using components array)
// ==============================================================================

export const multiComponentModule = defineModule(m =>
  m
    .id('examples/multi-component')
    .version('1.0.0')
    .capabilities(['example', 'multi-component'])
    .cognitiveLevel(2)
    .metadata(meta =>
      meta
        .name('Multi-Component Module')
        .description('A module with multiple components')
        .semantic('multiple components instruction knowledge data')
    )
    .components([
      builder =>
        builder.instruction(i =>
          i
            .purpose('First component: instructions')
            .process(['Read instruction', 'Apply knowledge'])
        ),
      builder =>
        builder.knowledge(k =>
          k
            .explanation('Second component: supporting knowledge')
            .concept({
              name: 'Multi-Component Pattern',
              description: 'Modules can have multiple components for rich content',
              rationale: 'Separates different types of information',
            })
        ),
      builder =>
        builder.data(d =>
          d
            .format('json')
            .description('Third component: reference data')
            .value({ supportedTypes: ['instruction', 'knowledge', 'data'] })
        ),
    ])
);

// ==============================================================================
// Example 9: Deprecated Module
// ==============================================================================

export const deprecatedModule = defineModule(m =>
  m
    .id('examples/deprecated-module')
    .version('1.0.0')
    .capabilities(['example', 'deprecated'])
    .cognitiveLevel(2)
    .metadata(meta =>
      meta
        .name('Deprecated Module')
        .description('This module has been deprecated')
        .semantic('deprecated legacy obsolete replaced')
        .deprecated(true)
        .replacedBy('examples/simple-instruction')
        .quality(q =>
          q.maturity('deprecated').confidence(0.5).experimental(false)
        )
    )
    .instruction(i =>
      i
        .purpose('This module is kept for backwards compatibility only')
        .process(['Use the replacement module instead'])
    )
);

// ==============================================================================
// Example 10: Loading from JSON file (simulated)
// ==============================================================================

/**
 * Demonstrates how to load modules from external JSON files
 */
export function loadModuleFromJSON(jsonString: string): ReturnType<typeof defineModule> {
  const data = JSON.parse(jsonString);
  return defineModule.fromObject(data);
}

// Simulated JSON content
const jsonModuleContent = JSON.stringify({
  id: 'examples/from-json',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['example', 'json', 'external'],
  cognitiveLevel: 1,
  metadata: {
    name: 'Module from JSON',
    description: 'Loaded from external JSON source',
    semantic: 'json external loading deserialization',
  },
  instruction: {
    type: 'instruction',
    instruction: {
      purpose: 'Demonstrate loading modules from JSON',
      process: [
        'Read JSON file',
        'Parse JSON content',
        'Pass to defineModule.fromObject()',
        'Use validated module',
      ],
    },
  },
});

export const jsonModule = loadModuleFromJSON(jsonModuleContent);

// ==============================================================================
// Summary
// ==============================================================================

/*
 * This file demonstrates the complete builder API for UMS v2.0:
 *
 * 1. Simple instruction modules (Example 1)
 * 2. Complex modules with all features (Example 2)
 * 3. Knowledge modules with concepts and examples (Example 3)
 * 4. Data modules with structured data (Example 4)
 * 5. Modules with relationships and metadata (Example 5)
 * 6. Migration from static objects (Example 6)
 * 7. Programmatic generation (Example 7)
 * 8. Multi-component modules (Example 8)
 * 9. Deprecated modules (Example 9)
 * 10. Loading from external formats (Example 10)
 *
 * Key Patterns:
 * - defineModule() - Primary guided builder path
 * - defineModule.fromObject() - Universal validation gateway
 * - Nested builders for complex structures
 * - Method chaining for fluent API
 * - Type safety throughout
 * - Validation at build time
 */
