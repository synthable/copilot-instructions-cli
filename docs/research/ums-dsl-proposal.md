# UMS TypeScript DSL Proposal

**Status**: Proposal
**Version**: 1.0.0
**Date**: 2025-10-16
**Target**: ums-sdk v1.2.0 or v2.0.0

---

## Table of Contents <!-- omit from toc -->

- [Executive Summary](#executive-summary)
- [DSL Design Philosophy](#dsl-design-philosophy)
  - [Guiding Principles](#guiding-principles)
  - [Comparison](#comparison)
- [Module DSL](#module-dsl)
  - [Basic Module Definition](#basic-module-definition)
  - [Instruction Component DSL](#instruction-component-dsl)
  - [Knowledge Component DSL](#knowledge-component-dsl)
  - [Data Component DSL](#data-component-dsl)
  - [Advanced Features](#advanced-features)
- [Persona DSL](#persona-dsl)
  - [Basic Persona Definition](#basic-persona-definition)
  - [Conditional Module Inclusion](#conditional-module-inclusion)
  - [Persona with Constraints](#persona-with-constraints)
- [Type Safety Features](#type-safety-features)
  - [Type Inference](#type-inference)
  - [Compile-Time Validation](#compile-time-validation)
  - [Context-Aware Autocomplete](#context-aware-autocomplete)
- [Implementation Architecture](#implementation-architecture)
  - [Builder Pattern with Type State](#builder-pattern-with-type-state)
  - [Component Builders](#component-builders)
- [Usage Examples](#usage-examples)
  - [Example 1: Simple Instruction Module](#example-1-simple-instruction-module)
  - [Example 2: Knowledge Module with Examples](#example-2-knowledge-module-with-examples)
  - [Example 3: Persona with Groups](#example-3-persona-with-groups)
- [Benefits](#benefits)
  - [Developer Experience](#developer-experience)
  - [Code Quality](#code-quality)
  - [Comparison](#comparison-1)
- [Migration Path](#migration-path)
  - [Gradual Adoption](#gradual-adoption)
  - [Automated Conversion](#automated-conversion)
- [Implementation Plan](#implementation-plan)
  - [Phase 1: Core DSL (3 weeks)](#phase-1-core-dsl-3-weeks)
  - [Phase 2: Advanced Features (2 weeks)](#phase-2-advanced-features-2-weeks)
- [Open Questions](#open-questions)
- [Alternatives Considered](#alternatives-considered)
  - [1. Tagged Template Literals](#1-tagged-template-literals)
  - [2. Function Composition](#2-function-composition)
  - [3. Decorator-Based (future TypeScript)](#3-decorator-based-future-typescript)
- [Success Criteria](#success-criteria)
- [Next Steps](#next-steps)

---

## Executive Summary

Propose a TypeScript-native DSL (Domain-Specific Language) for defining UMS v2.0 modules and personas with superior type safety, IDE support, and developer experience.

**Goals**:
1. **More expressive** than plain object literals
2. **Type-safe** with full inference throughout
3. **Self-documenting** through fluent API
4. **IDE-friendly** with autocomplete at every step
5. **Validated** as you type, not at build time

---



## DSL Design Philosophy

### Guiding Principles

1. **TypeScript-Native**: Leverage TypeScript's type system, not a string-based DSL
2. **Fluent & Chainable**: Natural reading flow (subject → verb → object)
3. **Gradual Complexity**: Simple things simple, complex things possible
4. **Type Inference**: Minimal type annotations required
5. **Validation Built-In**: Invalid states unrepresentable

### Comparison

**Current (Object Literal)**:
```typescript
export const errorHandling: Module = {
  id: 'error-handling',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['error-handling', 'debugging'],
  metadata: {
    name: 'Error Handling',
    description: 'Best practices for error handling',
    semantic: 'error exception handling debugging recovery',
  },
  instruction: {
    purpose: 'Guide error handling implementation',
    process: [
      'Identify error boundaries',
      'Implement error handlers',
      'Log errors appropriately',
    ],
  },
};
```

**Proposed (DSL)**:
```typescript
export const errorHandling = module('error-handling')
  .capabilities('error-handling', 'debugging')
  .describe('Error Handling', 'Best practices for error handling')
  .instruct(i => i
    .purpose('Guide error handling implementation')
    .step('Identify error boundaries')
    .step('Implement error handlers')
    .step('Log errors appropriately')
  );
```

**Savings**: ~30% fewer lines, more readable, fully typed

---

## Module DSL

### Basic Module Definition

```typescript
import { module } from 'ums-sdk/dsl';

// Minimal module
const myModule = module('my-module-id')
  .capabilities('capability1', 'capability2')
  .describe('Module Name', 'Module description that is at least 20 characters')
  .instruct(i => i
    .purpose('What this module teaches')
  );

// Type: Module (fully validated)
// All smart defaults applied automatically
```

### Instruction Component DSL

```typescript
const instructionModule = module('error-handling')
  .capabilities('error-handling')
  .describe('Error Handling', 'Best practices for error handling')

  // Fluent instruction builder
  .instruct(i => i
    .purpose('Guide developers in implementing robust error handling')

    // Process steps
    .step('Identify potential error sources')
    .step('Implement appropriate error boundaries')
    .step('Log errors with sufficient context')

    // Optional: Constraints
    .constraint('Never swallow errors silently')
    .constraint('Always clean up resources in error paths')

    // Optional: Principles
    .principle('Fail fast and loud')
    .principle('Provide actionable error messages')

    // Optional: Criteria
    .criteria({
      aspect: 'Error Coverage',
      description: 'All error paths are handled',
      threshold: 'All critical paths must have error handling',
    })
  );
```

### Knowledge Component DSL

```typescript
const knowledgeModule = module('solid-principles')
  .capabilities('solid', 'oop', 'design')
  .describe('SOLID Principles', 'Core object-oriented design principles')

  // Fluent knowledge builder
  .teach(k => k
    .explain('SOLID is an acronym for five design principles...')

    // Concepts
    .concept('Single Responsibility',
      'A class should have one reason to change')

    .concept('Open/Closed Principle',
      'Open for extension, closed for modification')

    // Examples
    .example('SRP Violation', {
      code: 'class UserManager { save() {} sendEmail() {} }',
      explanation: 'UserManager has two responsibilities',
    })

    .example('SRP Fixed', {
      code: 'class UserRepository { save() {} }\nclass EmailService { send() {} }',
      explanation: 'Each class has a single responsibility',
    })

    // Patterns
    .pattern({
      name: 'Dependency Injection',
      context: 'Applying Dependency Inversion Principle',
      solution: 'Inject dependencies through constructor',
    })
  );
```

### Data Component DSL

```typescript
const dataModule = module('http-status-codes')
  .capabilities('http', 'reference')
  .describe('HTTP Status Codes', 'Reference of standard HTTP status codes')

  // Fluent data builder
  .data(d => d
    .format('json')
    .describe('Standard HTTP status codes with descriptions')
    .value({
      '200': 'OK',
      '201': 'Created',
      '400': 'Bad Request',
      '404': 'Not Found',
      '500': 'Internal Server Error',
    })
  );
```

### Advanced Features

```typescript
const advancedModule = module('advanced-error-handling')
  .capabilities('error-handling', 'advanced')
  .describe('Advanced Error Handling', 'Advanced patterns for error handling')

  // Versioning
  .version('2.1.0')

  // Custom semantic keywords
  .keywords('exception', 'recovery', 'resilience')

  // Relationships
  .requires('foundation/logic/reasoning')
  .extends('error-handling')
  .recommends('logging/structured-logging')

  // Quality metadata
  .quality({
    reviewed: true,
    reviewedBy: 'team-lead',
    reviewedAt: new Date('2025-01-15'),
  })

  // Component
  .instruct(i => i
    .purpose('Advanced error handling patterns')
    .step('Implement retry logic')
    .step('Use circuit breakers')
  );
```

---

## Persona DSL

### Basic Persona Definition

```typescript
import { persona } from 'ums-sdk/dsl';

const developer = persona('Full-Stack Developer')
  .version('1.0.0')
  .describe('Expert in full-stack web development')

  // Add modules
  .include('foundation/ethics/do-no-harm')
  .include('foundation/reasoning/critical-thinking')
  .include('technology/typescript/best-practices')
  .include('technology/react/hooks')

  // Or use groups
  .group('Foundation', g => g
    .include('foundation/ethics/do-no-harm')
    .include('foundation/reasoning/critical-thinking')
  )

  .group('Technology', g => g
    .include('technology/typescript/best-practices')
    .include('technology/react/hooks')
  );
```

### Conditional Module Inclusion

```typescript
const adaptivePersona = persona('Adaptive Developer')
  .describe('Developer that adapts to project needs')

  // Required modules
  .require('foundation/ethics/do-no-harm')

  // Conditional inclusion
  .when(ctx => ctx.language === 'typescript', p => p
    .include('technology/typescript/best-practices')
    .include('technology/typescript/advanced-types')
  )

  .when(ctx => ctx.framework === 'react', p => p
    .include('technology/react/hooks')
    .include('technology/react/patterns')
  )

  // Capability-based inclusion
  .requireCapability('code-generation')
  .requireCapability('code-review');
```

### Persona with Constraints

```typescript
const constrainedPersona = persona('Production Developer')
  .describe('Developer with production constraints')

  // Modules
  .include('foundation/ethics/do-no-harm')
  .include('technology/typescript/best-practices')

  // Runtime constraints
  .maxTokens(100000)
  .timeout(30000)
  .maxModules(50)

  // Capability restrictions
  .allowCapabilities(['code-generation', 'code-review'])
  .denyCapabilities(['system-access']);
```

---

## Type Safety Features

### Type Inference

The DSL provides full type inference:

```typescript
// Type inference example
const myModule = module('test')
  .capabilities('cap1')
  .describe('Test', 'Test module')
  .instruct(i => i  // 'i' is InstructionBuilder, fully typed
    .purpose('Test')
    .step('Step 1')  // Autocomplete available
  );

// myModule is typed as Module
type ModuleType = typeof myModule; // Module

// Can be used anywhere a Module is expected
function buildPersona(modules: Module[]) { }
buildPersona([myModule]); // ✓ Type-safe
```

### Compile-Time Validation

```typescript
// ❌ Compile error: Missing required fields
const invalid = module('test')
  .capabilities('cap1')
  // Missing .describe()
  .instruct(i => i.purpose('Test'));
// Error: Property 'describe' must be called before 'instruct'

// ❌ Compile error: Invalid constraint
const invalid2 = module('test')
  .capabilities('cap1')
  .describe('Test', 'Too short'); // Error: Description must be at least 20 chars

// ✓ Valid
const valid = module('test')
  .capabilities('cap1')
  .describe('Test Module', 'This is a valid description with enough characters')
  .instruct(i => i.purpose('Test purpose'));
```

### Context-Aware Autocomplete

```typescript
const m = module('test')
  .capabilities('cap1')
  .describe('Name', 'Description...')
  .instruct(i => {
    // IDE shows available methods:
    // - purpose(string)
    // - step(string)
    // - constraint(string)
    // - principle(string)
    // - criteria(Criterion)

    return i.purpose('...')
      .step('...') // After purpose, IDE suggests step/constraint/principle
  });
```

---

## Implementation Architecture

### Builder Pattern with Type State

```typescript
// Type-state pattern ensures compile-time safety
type ModuleBuilder<State extends BuilderState> = {
  capabilities(...caps: string[]): ModuleBuilder<State & HasCapabilities>;
  describe(name: string, desc: string): ModuleBuilder<State & HasMetadata>;

  // instruct() only available when State has HasCapabilities & HasMetadata
  instruct<S extends HasCapabilities & HasMetadata>(
    this: ModuleBuilder<S>,
    builder: (i: InstructionBuilder) => InstructionBuilder
  ): Module;

  teach<S extends HasCapabilities & HasMetadata>(
    this: ModuleBuilder<S>,
    builder: (k: KnowledgeBuilder) => KnowledgeBuilder
  ): Module;

  data<S extends HasCapabilities & HasMetadata>(
    this: ModuleBuilder<S>,
    builder: (d: DataBuilder) => DataBuilder
  ): Module;
};

// State markers
type HasCapabilities = { _hasCapabilities: true };
type HasMetadata = { _hasMetadata: true };
type BuilderState = Partial<HasCapabilities & HasMetadata>;
```

### Component Builders

```typescript
// Instruction builder
class InstructionBuilder {
  private config: Partial<InstructionComponent> = {};

  purpose(text: string): this {
    this.config.purpose = guards.required(text);
    return this;
  }

  step(text: string): this {
    if (!this.config.process) this.config.process = [];
    this.config.process.push(text);
    return this;
  }

  constraint(text: string): this {
    if (!this.config.constraints) this.config.constraints = [];
    this.config.constraints.push(text);
    return this;
  }

  principle(text: string): this {
    if (!this.config.principles) this.config.principles = [];
    this.config.principles.push(text);
    return this;
  }

  criteria(criterion: Criterion): this {
    if (!this.config.criteria) this.config.criteria = [];
    this.config.criteria.push(criterion);
    return this;
  }

  build(): InstructionComponent {
    return validateInstructionComponent(this.config);
  }
}

// Knowledge builder
class KnowledgeBuilder {
  private config: Partial<KnowledgeComponent> = {};

  explain(text: string): this {
    this.config.explanation = guards.required(text);
    return this;
  }

  concept(term: string, definition: string): this {
    if (!this.config.concepts) this.config.concepts = [];
    this.config.concepts.push({ term, definition });
    return this;
  }

  example(title: string, config: { code?: string; explanation: string }): this {
    if (!this.config.examples) this.config.examples = [];
    this.config.examples.push({ title, ...config });
    return this;
  }

  pattern(pattern: Pattern): this {
    if (!this.config.patterns) this.config.patterns = [];
    this.config.patterns.push(pattern);
    return this;
  }

  build(): KnowledgeComponent {
    return validateKnowledgeComponent(this.config);
  }
}
```

---

## Usage Examples

### Example 1: Simple Instruction Module

```typescript
import { module } from 'ums-sdk/dsl';

export const codeReview = module('process/code-review')
  .capabilities('code-review', 'quality')
  .describe('Code Review Process', 'Step-by-step guide for effective code reviews')
  .instruct(i => i
    .purpose('Guide developers through code review process')
    .step('Review code for logic errors')
    .step('Check code style and conventions')
    .step('Verify test coverage')
    .step('Provide constructive feedback')
    .principle('Focus on the code, not the person')
    .principle('Ask questions rather than make demands')
  );
```

### Example 2: Knowledge Module with Examples

```typescript
import { module } from 'ums-sdk/dsl';

export const asyncPatterns = module('technology/javascript/async-patterns')
  .capabilities('async', 'javascript', 'patterns')
  .describe('Async Patterns', 'Common patterns for asynchronous JavaScript programming')
  .teach(k => k
    .explain('JavaScript provides multiple patterns for handling async operations')

    .concept('Promises', 'Objects representing eventual completion of async operations')
    .concept('Async/Await', 'Syntactic sugar for working with promises')

    .example('Promise Chain', {
      code: `
        fetchUser(id)
          .then(user => fetchPosts(user.id))
          .then(posts => console.log(posts))
          .catch(err => console.error(err));
      `,
      explanation: 'Chain promises to sequence async operations',
    })

    .example('Async/Await', {
      code: `
        async function getPosts(id) {
          try {
            const user = await fetchUser(id);
            const posts = await fetchPosts(user.id);
            return posts;
          } catch (err) {
            console.error(err);
          }
        }
      `,
      explanation: 'Use async/await for cleaner async code',
    })
  );
```

### Example 3: Persona with Groups

```typescript
import { persona } from 'ums-sdk/dsl';

export const fullStackDev = persona('Full-Stack Developer')
  .version('1.0.0')
  .describe('Expert full-stack web developer')

  .group('Foundation', g => g
    .include('foundation/ethics/do-no-harm')
    .include('foundation/reasoning/critical-thinking')
    .include('foundation/reasoning/systems-thinking')
  )

  .group('Backend', g => g
    .include('technology/typescript/best-practices')
    .include('technology/node/apis')
    .include('principle/architecture/rest')
  )

  .group('Frontend', g => g
    .include('technology/react/hooks')
    .include('technology/react/patterns')
    .include('principle/ui/accessibility')
  )

  .maxTokens(100000)
  .maxModules(50);
```

---

## Benefits

### Developer Experience

1. **Discoverability**: IDE autocomplete shows what's available at each step
2. **Validation**: Errors at compile-time, not runtime
3. **Documentation**: Method names are self-documenting
4. **Less Boilerplate**: No need to specify schemaVersion, version defaults, etc.
5. **Type Safety**: Full type inference throughout

### Code Quality

1. **Consistency**: DSL enforces consistent structure
2. **Readability**: Fluent API reads like natural language
3. **Maintainability**: Easy to understand and modify
4. **Correctness**: Invalid states are unrepresentable

### Comparison

| Feature | Object Literal | defineModule() | DSL |
|---------|---------------|----------------|-----|
| Type Safety | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Autocomplete | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Validation | Runtime | Runtime | Compile-time |
| Readability | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Learning Curve | Easy | Medium | Medium |
| Flexibility | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## Migration Path

### Gradual Adoption

```typescript
// Old way still works
import type { Module } from 'ums-sdk';
export const oldModule: Module = { ... };

// defineModule() still works
import { defineModule } from 'ums-sdk/authoring';
export const mediumModule = defineModule({ ... });

// DSL is optional
import { module } from 'ums-sdk/dsl';
export const newModule = module('id')...;
```

### Automated Conversion

```bash
# CLI tool to convert existing modules to DSL
$ copilot-instructions convert-to-dsl ./error-handling.module.ts

# Shows diff and asks for confirmation
```

---

## Implementation Plan

### Phase 1: Core DSL (3 weeks)

1. **Week 1**: Module builder with type-state pattern
   - Basic module builder
   - Instruction builder
   - Type safety implementation

2. **Week 2**: Component builders
   - Knowledge builder
   - Data builder
   - Integration tests

3. **Week 3**: Persona builder
   - Basic persona builder
   - Group support
   - Conditional inclusion

**Deliverables**:
- ums-sdk v1.2.0 with DSL support
- Comprehensive tests
- Migration guide

### Phase 2: Advanced Features (2 weeks)

4. **Week 4**: Advanced module features
   - Relationships DSL
   - Quality metadata
   - Custom validators

5. **Week 5**: Tooling
   - VSCode snippets
   - Automated conversion tool
   - Documentation

**Deliverables**:
- Full-featured DSL
- Conversion tooling
- Documentation

---

## Open Questions

1. **Naming**: `module()` vs `defineModule()` vs `createModule()`?
2. **Persona DSL**: Should personas also use fluent API or simpler?
3. **Escape Hatches**: How to handle edge cases not covered by DSL?
4. **Performance**: Is builder overhead acceptable?
5. **Bundle Size**: Will DSL increase bundle size significantly?

---

## Alternatives Considered

### 1. Tagged Template Literals

```typescript
const myModule = module`
  id: error-handling
  capabilities: error-handling, debugging

  instruction:
    purpose: Guide error handling
    steps:
      - Identify error boundaries
      - Implement handlers
`;
```

**Pros**: Very concise, YAML-like
**Cons**: No type safety, no autocomplete, string parsing

### 2. Function Composition

```typescript
const myModule = compose(
  id('error-handling'),
  capabilities('error-handling', 'debugging'),
  instruction(
    purpose('Guide error handling'),
    step('Identify error boundaries'),
    step('Implement handlers')
  )
);
```

**Pros**: Very functional, composable
**Cons**: Less IDE support, harder to read

### 3. Decorator-Based (future TypeScript)

```typescript
@Module({ id: 'error-handling' })
class ErrorHandling {
  @Capabilities('error-handling', 'debugging')
  @Metadata({ name: 'Error Handling', description: '...' })

  @Instruction
  guide() {
    return {
      purpose: 'Guide error handling',
      process: [...]
    };
  }
}
```

**Pros**: Very OOP-friendly
**Cons**: Requires decorators, not available in all contexts

**Decision**: Builder pattern provides best balance of type safety, readability, and IDE support.

---

## Success Criteria

1. **Adoption**: 30%+ of new modules use DSL within 3 months
2. **Satisfaction**: Developer satisfaction >8/10
3. **Errors**: 50% reduction in authoring errors
4. **Speed**: 30% faster module creation

---

## Next Steps

1. **Review & Approve** this proposal
2. **Prototype** core module builder with type-state
3. **User Testing** with 5 module authors
4. **Iterate** based on feedback
5. **Implement** full DSL
6. **Document** and release

---

**Status**: Ready for review and feedback
