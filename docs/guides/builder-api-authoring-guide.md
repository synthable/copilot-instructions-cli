# UMS v2.0 Builder API Authoring Guide

**Status**: Proposed Architecture
**Version**: 1.0.0
**Last Updated**: 2025-01-30

## Table of Contents

- [Overview](#overview)
- [Why a Builder API?](#why-a-builder-api)
- [The Hybrid Architecture](#the-hybrid-architecture)
- [Primary Path: defineModule()](#primary-path-definemodule)
- [Universal Gateway: defineModule.fromObject()](#universal-gateway-definemodulefromobject)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [Advanced Usage](#advanced-usage)

## Overview

The UMS v2.0 Builder API provides a fluent, type-safe, and discoverable way to author modules and personas. It addresses the limitations of static object literals by offering:

- **Guided construction** with method chaining
- **IDE autocomplete** and type safety at every step
- **Nested builders** for complex structures
- **Validation at construction time** instead of post-hoc
- **Universal validation gateway** for programmatic generation

## Why a Builder API?

### The Problem with Static Objects

The traditional approach to module authoring uses large TypeScript object literals:

```typescript
// Traditional static approach (verbose and error-prone)
export const errorHandling: Module = {
  id: 'technology/typescript/error-handling',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['error-handling', 'debugging'],
  metadata: {
    name: 'TypeScript Error Handling',
    description: 'Best practices for error handling',
    semantic: 'typescript error handling exceptions try catch...',
  },
  instruction: {
    type: ComponentType.Instruction,
    instruction: {
      purpose: 'Guide developers in implementing robust error handling',
      process: [
        'Use custom error classes',
        'Always include error context',
        'Use type guards',
      ],
      constraints: [
        {
          rule: 'Always type your catch blocks',
          severity: 'error',
        },
      ],
      principles: [
        'Fail fast and fail loud in development',
        'Provide actionable error messages',
      ],
    },
  },
};
```

**Problems:**

1. **Verbosity**: Deeply nested object literals are hard to read and maintain
2. **No guidance**: Authors must memorize the entire schema
3. **Late validation**: Errors discovered after authoring, not during
4. **Poor discoverability**: No IDE hints for what fields are available
5. **Nested complexity**: Nested structures (instruction, knowledge, data) are particularly cumbersome

### The Builder Solution

The builder pattern addresses these issues:

```typescript
// Builder approach (guided, discoverable, validated)
export const errorHandling = defineModule(m =>
  m
    .id('technology/typescript/error-handling')
    .version('1.0.0')
    .capabilities(['error-handling', 'debugging'])
    .metadata(meta =>
      meta
        .name('TypeScript Error Handling')
        .description('Best practices for error handling')
        .semantic('typescript error handling exceptions try catch...')
    )
    .instruction(i =>
      i
        .purpose('Guide developers in implementing robust error handling')
        .process([
          'Use custom error classes',
          'Always include error context',
          'Use type guards',
        ])
        .constraint('Always type your catch blocks', 'error')
        .principle('Fail fast and fail loud in development')
        .principle('Provide actionable error messages')
    )
);
```

**Benefits:**

1. **Guided construction**: Each method reveals the next available options
2. **Type safety**: TypeScript ensures you can't call invalid methods
3. **Reduced verbosity**: No repetitive type annotations or wrapper objects
4. **Immediate feedback**: Validation happens as you build
5. **Discoverability**: IDE autocomplete shows all available methods
6. **Nested builders**: Complex structures use dedicated builders (e.g., `.instruction(i => ...)`)

## The Hybrid Architecture

The proposed architecture offers **two entry points** into the UMS authoring system:

```
┌─────────────────────────────────────────────────────────┐
│                    UMS Authoring API                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐        ┌──────────────────────┐  │
│  │  defineModule()  │        │ defineModule.        │  │
│  │                  │        │   fromObject()       │  │
│  │ Primary Path     │        │                      │  │
│  │ (Guided Builder) │        │ Universal Gateway    │  │
│  │                  │        │ (Plain Objects)      │  │
│  └────────┬─────────┘        └─────────┬────────────┘  │
│           │                            │               │
│           └────────────┬───────────────┘               │
│                        │                               │
│                        ▼                               │
│            ┌───────────────────────┐                   │
│            │  Canonical Builder    │                   │
│            │  (Internal)           │                   │
│            └───────────┬───────────┘                   │
│                        │                               │
│                        ▼                               │
│            ┌───────────────────────┐                   │
│            │  Validation Engine    │                   │
│            └───────────┬───────────┘                   │
│                        │                               │
│                        ▼                               │
│            ┌───────────────────────┐                   │
│            │   Immutable Module    │                   │
│            └───────────────────────┘                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Path 1: defineModule() - The Paved Road

**Purpose**: The primary, recommended path for most module authors

**Characteristics**:
- Fluent, chainable API
- Nested builders for complex structures
- Progressive disclosure of options
- Guided validation
- Best developer experience

**When to use**:
- Writing new modules from scratch
- Learning UMS module authoring
- Interactive development in IDE
- When you want maximum safety and guidance

### Path 2: defineModule.fromObject() - The Universal Gateway

**Purpose**: A validated escape hatch for programmatic generation and interoperability

**Characteristics**:
- Accepts plain JavaScript objects
- Hydrates objects into the canonical builder
- Runs same validation as defineModule()
- Enables other patterns (factories, DSLs, migrations, etc.)
- Re-enables all object-creation patterns safely

**When to use**:
- Migrating from v1.0 or static objects
- Programmatic module generation
- Building authoring tools/DSLs
- Reading from external formats (JSON, YAML)
- Interoperating with other systems

## Primary Path: defineModule()

### Basic Usage

```typescript
import { defineModule } from 'ums-sdk/authoring';

export const myModule = defineModule(m =>
  m
    .id('technology/typescript/my-module')
    .version('1.0.0')
    .capabilities(['capability-1', 'capability-2'])
    .metadata(meta =>
      meta
        .name('My Module')
        .description('What this module does')
        .semantic('keyword-rich description for AI search')
    )
    .instruction(i =>
      i
        .purpose('What this instruction accomplishes')
        .process(['Step 1', 'Step 2', 'Step 3'])
    )
);
```

### Method Chaining

All builder methods return `this`, enabling fluent chaining:

```typescript
defineModule(m =>
  m
    .id('module-id')
    .version('1.0.0')
    .capabilities(['cap1', 'cap2'])
    .cognitiveLevel(3)
    .domain('typescript')
    .metadata(/* ... */)
    .instruction(/* ... */)
);
```

### Nested Builders

Complex nested structures use dedicated builders via callbacks:

```typescript
// Metadata builder
.metadata(meta =>
  meta
    .name('Module Name')
    .description('Brief description')
    .semantic('keyword-rich text')
    .tags(['tag1', 'tag2'])
    .quality(q =>
      q
        .maturity('stable')
        .confidence(0.95)
    )
)

// Instruction builder
.instruction(i =>
  i
    .purpose('Purpose statement')
    .process(['Step 1', 'Step 2'])
    .constraint('Never do X', 'error')
    .principle('Always do Y')
)

// Knowledge builder
.knowledge(k =>
  k
    .explanation('Detailed explanation...')
    .concept({
      name: 'Concept Name',
      description: 'What it means',
      rationale: 'Why it matters',
    })
    .example({
      title: 'Example Title',
      rationale: 'What it demonstrates',
      language: 'typescript',
      snippet: 'const x = 1;',
    })
)
```

### Component Builders

#### Instruction Component

```typescript
.instruction(i =>
  i
    .purpose('What this instruction accomplishes')
    .process([
      'Simple step',
      {
        step: 'Complex step with details',
        detail: 'Additional information',
        validate: {
          check: 'How to verify success',
          severity: 'error',
        },
      },
    ])
    .constraint('Never skip validation', 'error')
    .constraint({
      rule: 'Always handle errors',
      severity: 'error',
      examples: {
        valid: ['Good example'],
        invalid: ['Bad example'],
      },
    })
    .principle('Fail fast in development')
    .criterion('All tests pass', 'critical')
)
```

#### Knowledge Component

```typescript
.knowledge(k =>
  k
    .explanation('Comprehensive explanation of the concept...')
    .concept({
      name: 'Key Concept',
      description: 'What it means',
      rationale: 'Why it matters',
      examples: ['Example 1', 'Example 2'],
    })
    .example({
      title: 'Practical Example',
      rationale: 'Demonstrates the pattern',
      language: 'typescript',
      snippet: `
        function example() {
          return 'value';
        }
      `,
    })
    .pattern({
      name: 'Design Pattern Name',
      useCase: 'When to use',
      description: 'How it works',
      advantages: ['Pro 1', 'Pro 2'],
      disadvantages: ['Con 1', 'Con 2'],
    })
)
```

#### Data Component

```typescript
.data(d =>
  d
    .format('json')
    .description('Configuration template')
    .value({
      setting1: 'value1',
      setting2: 'value2',
    })
)
```

### Multiple Components

```typescript
.components([
  builder => builder.instruction(i => /* ... */),
  builder => builder.knowledge(k => /* ... */),
  builder => builder.data(d => /* ... */),
])
```

### Type Safety

The builder provides full type safety:

```typescript
defineModule(m =>
  m
    .id('module-id') // ✓ string required
    .version('1.0.0') // ✓ semver format
    .capabilities(['cap1']) // ✓ string array
    .cognitiveLevel(3) // ✓ 0-6 only
    .cognitiveLevel(10) // ✗ TypeScript error: outside valid range
    .unknownMethod() // ✗ TypeScript error: method doesn't exist
);
```

## Universal Gateway: defineModule.fromObject()

### Purpose

The `fromObject()` method provides a validated entry point for plain JavaScript objects. This enables:

1. **Migration** from v1.0 or static objects
2. **Programmatic generation** (AI-assisted, templates, DSLs)
3. **External formats** (JSON, YAML deserialization)
4. **Interoperability** with other systems
5. **Tooling** (module generators, validators, transformers)

### Basic Usage

```typescript
import { defineModule } from 'ums-sdk/authoring';

// Plain object (from anywhere: JSON, migration, generation, etc.)
const moduleData = {
  id: 'technology/typescript/error-handling',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['error-handling'],
  metadata: {
    name: 'Error Handling',
    description: 'Best practices',
    semantic: 'typescript error handling...',
  },
  instruction: {
    type: 'instruction',
    instruction: {
      purpose: 'Guide error handling implementation',
      process: ['Step 1', 'Step 2'],
    },
  },
};

// Hydrate and validate through the builder
export const errorHandling = defineModule.fromObject(moduleData);
```

### How It Works

```typescript
// Conceptual implementation
defineModule.fromObject = (data: unknown): Module => {
  // 1. Hydrate object into builder
  const builder = new ModuleBuilder();
  builder.hydrate(data);

  // 2. Run canonical validation
  builder.validate();

  // 3. Return immutable module
  return builder.build();
};
```

The key insight: `fromObject()` uses the **same internal builder and validation logic** as `defineModule()`, ensuring consistency and safety regardless of entry point.

### Use Cases

#### Migrating from Static Objects

```typescript
// Old: Static object literal
const oldModule = {
  id: 'module-id',
  version: '1.0.0',
  // ... rest of module
};

// New: Validated through fromObject()
export const newModule = defineModule.fromObject(oldModule);
```

#### Programmatic Generation

```typescript
function generateModule(config: ModuleConfig): Module {
  const data = {
    id: config.moduleId,
    version: config.version,
    capabilities: config.capabilities,
    metadata: {
      name: config.displayName,
      description: config.description,
      semantic: generateSemanticKeywords(config),
    },
    instruction: buildInstructionFromTemplate(config.template),
  };

  return defineModule.fromObject(data);
}
```

#### Loading from External Formats

```typescript
import yaml from 'yaml';

// Load from YAML
const yamlContent = fs.readFileSync('module.yaml', 'utf8');
const moduleData = yaml.parse(yamlContent);
export const module = defineModule.fromObject(moduleData);

// Load from JSON
const jsonContent = fs.readFileSync('module.json', 'utf8');
const moduleData = JSON.parse(jsonContent);
export const module = defineModule.fromObject(moduleData);
```

#### AI-Assisted Generation

```typescript
// AI generates module spec as JSON
const aiGeneratedSpec = await generateWithAI(prompt);

// Validate and convert to Module
export const module = defineModule.fromObject(aiGeneratedSpec);
```

### Validation

`fromObject()` runs the same validation as the builder:

```typescript
// ✓ Valid object
const validModule = defineModule.fromObject({
  id: 'module-id',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['cap1'],
  metadata: { /* ... */ },
  instruction: { /* ... */ },
});

// ✗ Invalid: Missing required fields
try {
  const invalid = defineModule.fromObject({
    id: 'module-id',
    // Missing version, schemaVersion, capabilities, metadata
  });
} catch (error) {
  console.error('Validation failed:', error.message);
  // Error: Missing required field: version
}
```

## API Reference

### defineModule(callback)

Primary entry point for guided module authoring.

**Signature:**
```typescript
function defineModule(
  callback: (builder: ModuleBuilder) => ModuleBuilder
): Module
```

**Parameters:**
- `callback`: Function receiving a `ModuleBuilder` instance and returning the configured builder

**Returns:** Immutable `Module` object

**Example:**
```typescript
const module = defineModule(m =>
  m
    .id('module-id')
    .version('1.0.0')
    // ... configure module
);
```

### defineModule.fromObject(data)

Universal validation gateway for plain objects.

**Signature:**
```typescript
function fromObject(data: unknown): Module
```

**Parameters:**
- `data`: Plain JavaScript object representing a module

**Returns:** Immutable `Module` object

**Throws:** Validation errors if object is invalid

**Example:**
```typescript
const module = defineModule.fromObject({
  id: 'module-id',
  version: '1.0.0',
  // ... module data
});
```

### ModuleBuilder Methods

#### Core Identity

```typescript
.id(id: string): this
.version(version: string): this
.schemaVersion(version: string): this  // Default: '2.0'
```

#### Capabilities & Classification

```typescript
.capabilities(capabilities: string[]): this
.capability(cap: string): this  // Add single capability
.cognitiveLevel(level: 0 | 1 | 2 | 3 | 4 | 5 | 6): this
.domain(domain: string | string[]): this
```

#### Metadata

```typescript
.metadata(callback: (builder: MetadataBuilder) => MetadataBuilder): this
```

**MetadataBuilder methods:**
```typescript
.name(name: string): this
.description(description: string): this
.semantic(semantic: string): this
.tags(tags: string[]): this
.tag(tag: string): this
.quality(callback: (builder: QualityBuilder) => QualityBuilder): this
```

#### Components

```typescript
.instruction(callback: (builder: InstructionBuilder) => InstructionBuilder): this
.knowledge(callback: (builder: KnowledgeBuilder) => KnowledgeBuilder): this
.data(callback: (builder: DataBuilder) => DataBuilder): this
.components(builders: Array<(b: ComponentBuilder) => ComponentBuilder>): this
```

### InstructionBuilder Methods

```typescript
.purpose(purpose: string): this
.process(steps: Array<string | ProcessStep>): this
.step(step: string | ProcessStep): this
.constraint(rule: string | Constraint, severity?: Severity): this
.principle(principle: string): this
.criterion(item: string | SuccessCriterion, severity?: Severity): this
```

### KnowledgeBuilder Methods

```typescript
.explanation(explanation: string): this
.concept(concept: Concept): this
.example(example: Example): this
.pattern(pattern: Pattern): this
```

### DataBuilder Methods

```typescript
.format(format: string): this
.description(description: string): this
.value(value: unknown): this
```

## Examples

### Complete Module Example

```typescript
import { defineModule } from 'ums-sdk/authoring';

export const errorHandling = defineModule(m =>
  m
    .id('technology/typescript/error-handling')
    .version('1.0.0')
    .capabilities(['error-handling', 'debugging', 'best-practices'])
    .cognitiveLevel(3)
    .domain('typescript')
    .metadata(meta =>
      meta
        .name('TypeScript Error Handling')
        .description('Best practices for error handling in TypeScript')
        .semantic('typescript error handling exceptions try catch throw async errors custom error classes')
        .tags(['typescript', 'error-handling', 'best-practices'])
        .quality(q => q.maturity('stable').confidence(0.95))
    )
    .instruction(i =>
      i
        .purpose('Guide developers in implementing robust error handling')
        .process([
          'Use custom error classes extending Error',
          'Always include error context (timestamp, user ID, operation)',
          'Use type guards to handle different error types',
          {
            step: 'Implement error boundaries for React components',
            detail: 'Wrap components in ErrorBoundary for graceful failures',
            validate: {
              check: 'Verify error boundary catches and logs errors',
              severity: 'error',
            },
          },
        ])
        .constraint({
          rule: 'Always type catch blocks as (error: unknown)',
          severity: 'error',
          examples: {
            valid: ['try { } catch (error: unknown) { }'],
            invalid: ['try { } catch (error) { }', 'try { } catch (e: any) { }'],
          },
        })
        .constraint('Never swallow errors silently', 'error')
        .principle('Fail fast and fail loud in development')
        .principle('Provide actionable error messages')
        .criterion('All error paths tested', 'critical')
    )
);
```

### Module with Multiple Components

```typescript
export const asyncPatterns = defineModule(m =>
  m
    .id('technology/typescript/async-patterns')
    .version('1.0.0')
    .capabilities(['async', 'promises', 'concurrency'])
    .metadata(meta =>
      meta
        .name('TypeScript Async Patterns')
        .description('Patterns for asynchronous programming')
        .semantic('typescript async await promises concurrency parallel')
    )
    .components([
      b =>
        b.instruction(i =>
          i
            .purpose('Guide async/await usage')
            .process(['Use async/await for sequential operations', 'Use Promise.all for parallel operations'])
        ),
      b =>
        b.knowledge(k =>
          k
            .explanation('Async/await is syntactic sugar over promises...')
            .concept({
              name: 'Event Loop',
              description: 'JavaScript runtime environment',
              rationale: 'Understanding async behavior',
            })
            .example({
              title: 'Parallel Execution',
              rationale: 'Demonstrates Promise.all',
              language: 'typescript',
              snippet: `
                const [user, posts] = await Promise.all([
                  fetchUser(id),
                  fetchPosts(id),
                ]);
              `,
            })
        ),
    ])
);
```

### Migration Example

```typescript
// Before: Static object
const oldModule = {
  id: 'technology/typescript/testing',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['testing', 'unit-tests'],
  metadata: {
    name: 'Testing',
    description: 'Testing best practices',
    semantic: 'testing unit tests vitest jest',
  },
  instruction: {
    type: 'instruction',
    instruction: {
      purpose: 'Guide testing implementation',
      process: ['Write tests first', 'Test behavior not implementation'],
    },
  },
};

// After: Using fromObject()
export const testing = defineModule.fromObject(oldModule);

// Or refactored to builder API
export const testing = defineModule(m =>
  m
    .id('technology/typescript/testing')
    .version('1.0.0')
    .capabilities(['testing', 'unit-tests'])
    .metadata(meta =>
      meta
        .name('Testing')
        .description('Testing best practices')
        .semantic('testing unit tests vitest jest')
    )
    .instruction(i =>
      i
        .purpose('Guide testing implementation')
        .process(['Write tests first', 'Test behavior not implementation'])
    )
);
```

## Best Practices

### 1. Use the Guided Path by Default

Prefer `defineModule()` over `fromObject()` for hand-authored modules:

```typescript
// ✓ Preferred: Guided builder
export const module = defineModule(m =>
  m.id('module-id').version('1.0.0') /* ... */
);

// ✗ Avoid: Manual objects (unless necessary)
export const module = defineModule.fromObject({
  id: 'module-id',
  version: '1.0.0',
  /* ... */
});
```

### 2. Use Nested Builders for Complex Structures

Don't inline complex objects; use nested builders:

```typescript
// ✓ Good: Nested builder
.metadata(meta =>
  meta
    .name('Name')
    .description('Description')
    .quality(q => q.maturity('stable').confidence(0.9))
)

// ✗ Avoid: Inline objects
.metadata({
  name: 'Name',
  description: 'Description',
  quality: { maturity: 'stable', confidence: 0.9 },
})
```

### 3. Chain Related Methods

Group related configuration together:

```typescript
// ✓ Good: Logical grouping
defineModule(m =>
  m
    // Identity
    .id('module-id')
    .version('1.0.0')

    // Classification
    .capabilities(['cap1', 'cap2'])
    .cognitiveLevel(3)
    .domain('typescript')

    // Content
    .metadata(/* ... */)
    .instruction(/* ... */)
);
```

### 4. Use Type Safety

Let TypeScript guide you:

```typescript
// TypeScript will catch errors at compile time
defineModule(m =>
  m
    .id('module-id')
    .version('1.0.0')
    .cognitiveLevel(10) // ✗ Error: Must be 0-6
    .unknownMethod() // ✗ Error: Method doesn't exist
);
```

### 5. Validate External Data

Always use `fromObject()` for untrusted data:

```typescript
// ✓ Good: Validated
const externalData = JSON.parse(input);
const module = defineModule.fromObject(externalData); // Throws if invalid

// ✗ Dangerous: Unchecked
const module = externalData as Module; // No validation!
```

## Advanced Usage

### Custom Validation Logic

Extend the builder with custom validation:

```typescript
class CustomModuleBuilder extends ModuleBuilder {
  validate(): void {
    super.validate();

    // Custom validation logic
    if (this.data.id.startsWith('internal/') && !this.data.metadata.tags?.includes('internal')) {
      throw new Error('Internal modules must have "internal" tag');
    }
  }
}
```

### Builder Decorators

Add cross-cutting concerns:

```typescript
function withLogging<T extends ModuleBuilder>(builder: T): T {
  return new Proxy(builder, {
    get(target, prop) {
      const value = target[prop];
      if (typeof value === 'function') {
        return (...args: unknown[]) => {
          console.log(`Called ${String(prop)}`, args);
          return value.apply(target, args);
        };
      }
      return value;
    },
  });
}

const module = defineModule(m => withLogging(m).id('module-id') /* ... */);
```

### Composable Builders

Create reusable builder fragments:

```typescript
// Reusable builder fragments
const withStandardMetadata = (meta: MetadataBuilder, name: string) =>
  meta
    .name(name)
    .quality(q => q.maturity('stable').confidence(0.9))
    .tags(['standard', 'curated']);

const withTypescriptDefaults = (m: ModuleBuilder) =>
  m.domain('typescript').capability('typescript').capability('best-practices');

// Use fragments
export const module = defineModule(m =>
  withTypescriptDefaults(m)
    .id('technology/typescript/module')
    .version('1.0.0')
    .metadata(meta => withStandardMetadata(meta, 'Module Name'))
    .instruction(/* ... */)
);
```

### Template Functions

Create module templates:

```typescript
function createTechnologyModule(
  technology: string,
  name: string,
  capability: string,
  instruction: (i: InstructionBuilder) => InstructionBuilder
) {
  return defineModule(m =>
    m
      .id(`technology/${technology}/${capability}`)
      .version('1.0.0')
      .domain(technology)
      .capabilities([capability, 'best-practices'])
      .metadata(meta =>
        meta
          .name(`${name} ${capability}`)
          .description(`${capability} guidance for ${name}`)
          .semantic(`${technology} ${capability} best practices`)
      )
      .instruction(instruction)
  );
}

// Use template
export const errorHandling = createTechnologyModule(
  'typescript',
  'TypeScript',
  'error-handling',
  i => i.purpose('Guide error handling').process(['Step 1', 'Step 2'])
);
```

---

## Summary

The UMS v2.0 Builder API provides two powerful pathways:

1. **defineModule()**: The paved road for human authors—guided, safe, discoverable
2. **defineModule.fromObject()**: The universal gateway for programmatic generation and interoperability

Together, they create a flexible ecosystem that makes best practices easy while enabling advanced use cases. Choose the path that fits your workflow, knowing both lead to validated, high-quality modules.

**Next Steps:**

- Read the [Migration Guide](../migration/static-to-builder-migration.md) to transition existing modules
- Explore the [API Reference](#api-reference) for complete method documentation
- See [Examples](#examples) for common patterns and use cases
