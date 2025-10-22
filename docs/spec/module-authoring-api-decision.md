# Module Authoring API: Final Decision

**Status**: Approved
**Date**: 2025-10-16
**Decision**: Use `defineModule()` / `definePersona()` with convenience helpers

---

## Decision

We will implement **`defineModule()` and `definePersona()`** as the primary authoring API, supplemented by **convenience helper functions** for common patterns.

This approach provides the best balance of:
- ✅ Type safety (full TypeScript inference)
- ✅ Composability (object spreading + helpers)
- ✅ Simplicity (familiar pattern)
- ✅ IDE support (autocomplete, type checking)
- ✅ Flexibility (use what you need)

---

## Core API

### Module Definition

```typescript
import { defineModule } from 'ums-sdk/authoring';

export const errorHandling = defineModule({
  id: 'error-handling',
  capabilities: ['error-handling', 'debugging'],
  name: 'Error Handling',
  description: 'Best practices for error handling in software development',

  // Smart defaults applied automatically:
  // - version: '1.0.0'
  // - schemaVersion: '2.0'
  // - semantic: (auto-generated from name, description, capabilities)

  instruction: {
    purpose: 'Guide developers in implementing robust error handling',
    process: [
      'Identify potential error sources',
      'Implement appropriate error boundaries',
      'Log errors with sufficient context'
    ],
    constraints: [
      'Never swallow errors silently',
      'Always clean up resources in error paths'
    ],
    principles: [
      'Fail fast and loud',
      'Provide actionable error messages'
    ]
  }
});
```

### Persona Definition

```typescript
import { definePersona } from 'ums-sdk/authoring';

export const developer = definePersona({
  name: 'Full-Stack Developer',
  version: '1.0.0',
  description: 'Expert in full-stack web development',

  modules: [
    'foundation/ethics/do-no-harm',
    'foundation/reasoning/critical-thinking',
    'technology/typescript/best-practices',
    'technology/react/hooks'
  ]
});

// Or with groups
export const developerGrouped = definePersona({
  name: 'Full-Stack Developer',
  version: '1.0.0',
  description: 'Expert in full-stack web development',

  modules: [
    {
      group: 'Foundation',
      ids: [
        'foundation/ethics/do-no-harm',
        'foundation/reasoning/critical-thinking'
      ]
    },
    {
      group: 'Technology',
      ids: [
        'technology/typescript/best-practices',
        'technology/react/hooks'
      ]
    }
  ]
});
```

---

## Convenience Helpers

### Pattern 1: Reusable Configuration Fragments

```typescript
import { defineModule } from 'ums-sdk/authoring';

// Define reusable fragments
const errorHandlingCapabilities = {
  capabilities: ['error-handling', 'debugging']
};

const errorHandlingMeta = {
  name: 'Error Handling',
  description: 'Best practices for error handling'
};

const commonErrorSteps = [
  'Identify error boundaries',
  'Implement error handlers',
  'Log errors with context'
];

// Use with spreading
export const basicErrorHandling = defineModule({
  id: 'error-handling',
  ...errorHandlingCapabilities,
  ...errorHandlingMeta,
  instruction: {
    purpose: 'Guide basic error handling',
    process: commonErrorSteps
  }
});

export const advancedErrorHandling = defineModule({
  id: 'advanced-error-handling',
  ...errorHandlingCapabilities, // Reuse!
  name: 'Advanced Error Handling',
  description: 'Advanced patterns for error handling',
  instruction: {
    purpose: 'Guide advanced error handling',
    process: [
      ...commonErrorSteps, // Reuse and extend!
      'Implement retry logic',
      'Add circuit breakers'
    ]
  }
});
```

### Pattern 2: Helper Functions for Common Configs

```typescript
// Helper functions in ums-sdk/authoring/helpers.ts
export const withCapabilities = (...caps: string[]) => ({
  capabilities: caps
});

export const withMeta = (name: string, description: string, keywords?: string[]) => ({
  name,
  description,
  keywords
});

export const withRelationships = (config: {
  requires?: string[];
  extends?: string[];
  recommends?: string[];
}) => ({
  relationships: config
});

// Usage
import { defineModule, withCapabilities, withMeta, withRelationships } from 'ums-sdk/authoring';

export const myModule = defineModule({
  id: 'my-module',
  ...withCapabilities('capability1', 'capability2'),
  ...withMeta('My Module', 'Description of my module'),
  ...withRelationships({
    requires: ['foundation/logic/reasoning'],
    extends: ['base-module']
  }),
  instruction: {
    purpose: 'Guide users...',
    process: ['Step 1', 'Step 2']
  }
});
```

### Pattern 3: Component Template Helpers

```typescript
// Component template helpers
export const instructionTemplate = (
  purpose: string,
  steps: string[]
) => ({
  instruction: {
    purpose,
    process: steps
  }
});

export const knowledgeTemplate = (
  explanation: string,
  concepts: Array<{ term: string; definition: string }>
) => ({
  knowledge: {
    explanation,
    concepts
  }
});

// Usage
export const myModule = defineModule({
  id: 'my-module',
  capabilities: ['teaching'],
  name: 'My Module',
  description: 'Teaching module',
  ...knowledgeTemplate(
    'This module explains...',
    [
      { term: 'Concept 1', definition: 'Definition 1' },
      { term: 'Concept 2', definition: 'Definition 2' }
    ]
  )
});
```

### Pattern 4: Persona Group Helpers

```typescript
// Reusable persona module groups
export const foundationGroup = {
  group: 'Foundation',
  ids: [
    'foundation/ethics/do-no-harm',
    'foundation/reasoning/critical-thinking',
    'foundation/reasoning/systems-thinking'
  ]
};

export const typescriptGroup = {
  group: 'TypeScript',
  ids: [
    'technology/typescript/best-practices',
    'technology/typescript/advanced-types'
  ]
};

export const reactGroup = {
  group: 'React',
  ids: [
    'technology/react/hooks',
    'technology/react/patterns'
  ]
};

// Helper function to create groups
export const group = (name: string, ...moduleIds: string[]) => ({
  group: name,
  ids: moduleIds
});

// Usage
import { definePersona, foundationGroup, typescriptGroup, reactGroup, group } from 'ums-sdk/authoring';

export const frontendDev = definePersona({
  name: 'Frontend Developer',
  version: '1.0.0',
  description: 'Frontend specialist',
  modules: [
    foundationGroup,
    typescriptGroup,
    reactGroup
  ]
});

export const customPersona = definePersona({
  name: 'Custom Developer',
  version: '1.0.0',
  description: 'Custom specialist',
  modules: [
    foundationGroup, // Reuse standard group
    group('Custom Tech', // Or create inline group
      'technology/custom/module1',
      'technology/custom/module2'
    )
  ]
});
```

### Pattern 5: Conditional Composition

```typescript
// Conditional helpers
export const when = <T>(condition: boolean, value: T): T | {} =>
  condition ? value : {};

export const whenEnv = (env: string, value: any) =>
  when(process.env.NODE_ENV === env, value);

// Usage
export const myModule = defineModule({
  id: 'my-module',
  capabilities: ['feature'],
  name: 'My Module',
  description: 'My module description',

  // Conditional spreading
  ...when(process.env.INCLUDE_ADVANCED === 'true', {
    relationships: {
      extends: ['advanced-base']
    }
  }),

  ...whenEnv('production', {
    quality: {
      reviewed: true,
      reviewedBy: 'team-lead'
    }
  }),

  instruction: {
    purpose: 'Guide users...',
    process: ['Step 1', 'Step 2']
  }
});
```

---

## Complete Example Library

```typescript
// ums-sdk/authoring/helpers.ts

// Capability helpers
export const withCapabilities = (...caps: string[]) => ({
  capabilities: caps
});

// Metadata helpers
export const withMeta = (name: string, description: string, keywords?: string[]) => ({
  name,
  description,
  ...(keywords && { keywords })
});

// Relationship helpers
export const withRelationships = (config: {
  requires?: string[];
  extends?: string[];
  recommends?: string[];
}) => ({
  relationships: config
});

export const requires = (...modules: string[]) => ({
  relationships: { requires: modules }
});

export const extends_ = (...modules: string[]) => ({
  relationships: { extends: modules }
});

export const recommends = (...modules: string[]) => ({
  relationships: { recommends: modules }
});

// Quality helpers
export const withQuality = (config: {
  reviewed?: boolean;
  reviewedBy?: string;
  reviewedAt?: Date;
}) => ({
  quality: config
});

export const reviewed = (by: string, at: Date = new Date()) =>
  withQuality({ reviewed: true, reviewedBy: by, reviewedAt: at });

// Component helpers
export const instructionComponent = (
  purpose: string,
  steps: string[],
  options?: {
    constraints?: string[];
    principles?: string[];
  }
) => ({
  instruction: {
    purpose,
    process: steps,
    ...options
  }
});

export const knowledgeComponent = (
  explanation: string,
  concepts?: Array<{ term: string; definition: string }>,
  examples?: Array<{ title: string; code?: string; explanation: string }>
) => ({
  knowledge: {
    explanation,
    ...(concepts && { concepts }),
    ...(examples && { examples })
  }
});

export const dataComponent = (
  format: string,
  description: string,
  value: unknown
) => ({
  data: {
    format,
    description,
    value
  }
});

// Persona helpers
export const group = (name: string, ...moduleIds: string[]) => ({
  group: name,
  ids: moduleIds
});

export const modules = (...moduleIds: string[]) => moduleIds;

// Conditional helpers
export const when = <T>(condition: boolean, value: T): T | {} =>
  condition ? value : {};

export const whenEnv = (env: string, value: any) =>
  when(process.env.NODE_ENV === env, value);

// Common module groups (for personas)
export const foundationGroup = group(
  'Foundation',
  'foundation/ethics/do-no-harm',
  'foundation/reasoning/critical-thinking',
  'foundation/reasoning/systems-thinking'
);

export const typescriptGroup = group(
  'TypeScript',
  'technology/typescript/best-practices',
  'technology/typescript/advanced-types'
);
```

---

## Usage Examples

### Example 1: Simple Module

```typescript
import { defineModule } from 'ums-sdk/authoring';

export const codeReview = defineModule({
  id: 'process/code-review',
  capabilities: ['code-review', 'quality'],
  name: 'Code Review Process',
  description: 'Step-by-step guide for effective code reviews',
  instruction: {
    purpose: 'Guide developers through code review process',
    process: [
      'Review code for logic errors',
      'Check code style and conventions',
      'Verify test coverage',
      'Provide constructive feedback'
    ],
    principles: [
      'Focus on the code, not the person',
      'Ask questions rather than make demands'
    ]
  }
});
```

### Example 2: Module with Helpers

```typescript
import {
  defineModule,
  withCapabilities,
  withMeta,
  requires,
  reviewed,
  instructionComponent
} from 'ums-sdk/authoring';

export const advancedErrorHandling = defineModule({
  id: 'advanced-error-handling',
  ...withCapabilities('error-handling', 'advanced', 'resilience'),
  ...withMeta('Advanced Error Handling', 'Advanced patterns for resilient error handling'),
  ...requires('foundation/logic/reasoning', 'error-handling'),
  ...reviewed('tech-lead', new Date('2025-01-15')),
  ...instructionComponent(
    'Guide advanced error handling patterns',
    [
      'Implement retry logic with exponential backoff',
      'Add circuit breakers for failing services',
      'Use bulkheads for resource isolation',
      'Implement graceful degradation'
    ],
    {
      principles: [
        'Design for failure',
        'Fail fast, recover gracefully'
      ]
    }
  )
});
```

### Example 3: Knowledge Module

```typescript
import {
  defineModule,
  withCapabilities,
  withMeta,
  knowledgeComponent
} from 'ums-sdk/authoring';

export const solidPrinciples = defineModule({
  id: 'concepts/solid-principles',
  ...withCapabilities('solid', 'oop', 'design'),
  ...withMeta('SOLID Principles', 'Core object-oriented design principles'),
  ...knowledgeComponent(
    'SOLID is an acronym for five design principles that make software more maintainable',
    [
      { term: 'Single Responsibility', definition: 'A class should have one reason to change' },
      { term: 'Open/Closed', definition: 'Open for extension, closed for modification' },
      { term: 'Liskov Substitution', definition: 'Subtypes must be substitutable for base types' },
      { term: 'Interface Segregation', definition: 'Many specific interfaces over one general' },
      { term: 'Dependency Inversion', definition: 'Depend on abstractions, not concretions' }
    ],
    [
      {
        title: 'SRP Violation',
        code: 'class UserManager { save() {} sendEmail() {} }',
        explanation: 'This class has two responsibilities'
      },
      {
        title: 'SRP Fixed',
        code: 'class UserRepository { save() {} }\nclass EmailService { send() {} }',
        explanation: 'Each class now has a single responsibility'
      }
    ]
  )
});
```

### Example 4: Persona with Groups

```typescript
import {
  definePersona,
  foundationGroup,
  typescriptGroup,
  group
} from 'ums-sdk/authoring';

export const fullStackDev = definePersona({
  name: 'Full-Stack Developer',
  version: '1.0.0',
  description: 'Expert full-stack web developer',
  modules: [
    foundationGroup,
    typescriptGroup,
    group('Backend',
      'technology/node/apis',
      'technology/databases/sql',
      'principle/architecture/rest'
    ),
    group('Frontend',
      'technology/react/hooks',
      'technology/react/patterns',
      'principle/ui/accessibility'
    )
  ]
});
```

### Example 5: Conditional Module

```typescript
import {
  defineModule,
  withCapabilities,
  withMeta,
  when,
  whenEnv,
  instructionComponent
} from 'ums-sdk/authoring';

const isProduction = process.env.NODE_ENV === 'production';
const includeAdvanced = process.env.INCLUDE_ADVANCED === 'true';

export const myModule = defineModule({
  id: 'my-module',
  ...withCapabilities('feature'),
  ...withMeta('My Module', 'My module description'),

  // Conditional spreading
  ...when(includeAdvanced, {
    relationships: {
      extends: ['advanced-base'],
      requires: ['advanced-dependency']
    }
  }),

  ...whenEnv('production', {
    quality: {
      reviewed: true,
      reviewedBy: 'team-lead'
    }
  }),

  ...instructionComponent(
    'Guide users through the feature',
    [
      'Step 1',
      'Step 2',
      ...(includeAdvanced ? ['Advanced Step 3', 'Advanced Step 4'] : [])
    ]
  )
});
```

---

## Benefits

### Type Safety
✅ Full TypeScript inference
✅ Autocomplete for all fields
✅ Compile-time type checking
✅ Refactoring support

### Composability
✅ Object spreading for reuse
✅ Helper functions for common patterns
✅ Extract and share configurations
✅ Conditional composition

### Developer Experience
✅ Familiar pattern (like defineConfig(), defineComponent())
✅ IDE support (autocomplete, type hints, go-to-definition)
✅ Progressive complexity (simple cases simple, complex cases possible)
✅ Smart defaults reduce boilerplate

### Maintainability
✅ Standard TypeScript - no new concepts
✅ Easy to test (pure functions)
✅ Easy to debug (just objects)
✅ Easy to extend (add more helpers)

---

## Implementation Architecture

### Package Responsibilities

**ums-lib** (Pure domain logic):
- **Public API**: `validateModule()`, `validateInstructionComponent()`, etc.
- **Internal**: Validation guards (not exposed)
- Platform-agnostic validation logic

**ums-sdk** (Node.js runtime + authoring):
- **Public API**: `defineModule()`, `definePersona()`, helper functions
- **Implementation**: Uses ums-lib's public validators
- Never imports or exposes validation guards

### Clean Abstraction

```typescript
// ums-lib/src/validation/index.ts (Public API)
export { validateModule } from './validators.js';
export { validateInstructionComponent } from './validators.js';
// guards.ts is NOT exported (internal only)

// ums-sdk/src/authoring/define-module.ts
import { validateModule } from 'ums-lib'; // Only public API

export function defineModule(config) {
  const module = applySmartDefaults(config);
  return validateModule(module); // Validation happens here
}
```

Users never see or interact with guards - validation is automatic and internal.

---

## Implementation Status

- ✅ Specified in `module-definition-tools-spec.md`
- 🔲 Implement core `defineModule()` / `definePersona()` (Phase 1)
- 🔲 Implement convenience helpers library (Phase 2)
- 🔲 Create helper function examples and docs (Phase 3)
- 🔲 Release ums-sdk v1.1.0

---

## Rejected Alternatives

### Builder Pattern (Fluent API)
**Pros**: Maximum type safety with type-state pattern
**Cons**: Less composable, more complex, steeper learning curve
**Decision**: Type safety gains don't justify complexity

### Composable Functions DSL
**Pros**: Maximum composability, functional style
**Cons**: Less type safety, runtime validation needed
**Decision**: Type safety is more important than pure functional composition

### Tagged Template Literals
**Pros**: Very concise, YAML-like
**Cons**: No type safety, no autocomplete, string parsing
**Decision**: Type safety and IDE support are critical

---

## Next Steps

1. Implement `defineModule()` and `definePersona()` in ums-sdk
2. Create convenience helpers library (`ums-sdk/authoring/helpers`)
3. Document patterns and helpers
4. Provide migration guide from object literals
5. Release as ums-sdk v1.1.0

---

**Status**: Approved
**Date**: 2025-10-16
