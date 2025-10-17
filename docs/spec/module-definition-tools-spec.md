# Module Definition Tools & Helpers Specification

**Status**: Draft Proposal
**Version**: 1.0.0
**Date**: 2025-10-16
**Target**: ums-lib v1.1.0 + ums-sdk v1.1.0

---

## Executive Summary

Provide a comprehensive set of tools and helpers to make UMS v2.0 module authoring easier, safer, and more consistent. Focus on reducing boilerplate, providing validation guardrails, and ensuring module quality.

**Goals**:
1. **Reduce cognitive load** for module authors
2. **Prevent common errors** through validation and type safety
3. **Ensure consistency** across the module library
4. **Accelerate authoring** with smart defaults and templates

---

## Problem Statement

### Current Module Authoring Experience

```typescript
import type { Module } from 'ums-sdk';

// Authors must:
// 1. Remember all required fields
// 2. Manually calculate export name from ID
// 3. Ensure ID matches file path
// 4. Optimize semantic metadata manually
// 5. Choose appropriate component type
// 6. Structure component correctly

export const errorHandling: Module = {
  id: 'error-handling',                    // Must match file path
  version: '1.0.0',                        // Semver
  schemaVersion: '2.0',                    // Always '2.0' (boilerplate)
  capabilities: ['error-handling', 'debugging'],
  metadata: {
    name: 'Error Handling',
    description: 'Best practices for error handling',
    semantic: 'exception error handling debugging recovery', // Manual optimization
  },
  instruction: {                           // Must use correct component type
    purpose: 'Guide error handling',
    process: [
      'Identify error boundaries',
      'Implement error handlers',
      'Log errors appropriately',
    ],
  },
};
```

**Pain Points**:
- 25+ lines of structure for simple modules
- Easy to forget required fields
- Export name calculation is manual and error-prone
- No validation until build-time
- Semantic metadata optimization is guesswork
- Component structure must be memorized

---

## Solution Overview

### Clean Package Separation

```
┌─────────────────────────────────────────────────┐
│              ums-lib (Domain)                   │
│  Public API:                                    │
│  • Module/Persona types                         │
│  • validateModule() / validatePersona()         │
│  • validateInstructionComponent()               │
│  • validateKnowledgeComponent()                 │
│  • validateDataComponent()                      │
│                                                 │
│  Internal Implementation:                       │
│  • Validation guards (INTERNAL - not exposed)   │
│  • ModuleRegistry (in-memory)                   │
│  • renderMarkdown()                             │
│  • generateBuildReport()                        │
└─────────────────────────────────────────────────┘
                        ▲
                        │ uses public validators
                        │
┌─────────────────────────────────────────────────┐
│         ums-sdk (Node.js + Dev Tools)           │
│  I/O Layer:                                     │
│  • File loaders                                 │
│  • Module discovery                             │
│  • Configuration management                     │
│                                                 │
│  Authoring Layer (NEW):                         │
│  • defineModule() (uses ums-lib validators)     │
│  • Smart defaults (generateSemantic, etc)       │
│  • Path inference                               │
│  • ModuleBuilder (optional)                     │
└─────────────────────────────────────────────────┘
```

**Key Principle**:
- **ums-lib** exposes validation functions publicly, uses guards internally
- **ums-sdk** uses ums-lib's public validation API only
- **Guards are implementation details** - not part of public API

### Developer Experience

```typescript
// Authoring helpers from ums-sdk
import { defineModule } from 'ums-sdk/authoring';

// Clean, validated module definition
// Validation happens automatically via ums-lib's public validators
export const myModule = defineModule({
  id: 'error-handling',
  capabilities: ['error-handling'],
  name: 'Error Handling',
  description: 'Best practices for error handling',
  // ↑ Smart defaults applied automatically
  // ↑ Validated using ums-lib's validateModule() internally

  instruction: {
    purpose: 'Guide developers...',
    process: [...],
  },
});
```

**Benefits**:
- ✅ Clean API: validation happens automatically
- ✅ Implementation details hidden (guards are internal)
- ✅ ums-lib validators reusable across platforms
- ✅ Type safety throughout

---

## Validation Guards (ums-lib - INTERNAL)

Pure validation functions used internally by ums-lib validators. **Not exposed in public API.**

**Location**: `packages/ums-lib/src/validation/guards.ts` (internal)
**Visibility**: Private implementation detail

### Basic Validators

```typescript
export const guards = {
  /**
   * Ensures value is not null/undefined
   */
  required<T>(value: T | null | undefined, message?: string): T {
    if (value === null || value === undefined) {
      throw new ValidationError(message || 'Value is required');
    }
    return value;
  },

  /**
   * Ensures string meets minimum length
   */
  minLength(min: number) {
    return (value: string): string => {
      if (value.length < min) {
        throw new ValidationError(`String must be at least ${min} characters`);
      }
      return value;
    };
  },

  /**
   * Ensures string doesn't exceed maximum length
   */
  maxLength(max: number) {
    return (value: string): string => {
      if (value.length > max) {
        throw new ValidationError(`String must be at most ${max} characters`);
      }
      return value;
    };
  },

  /**
   * Ensures string matches pattern
   */
  pattern(regex: RegExp, message?: string) {
    return (value: string): string => {
      if (!regex.test(value)) {
        throw new ValidationError(message || `Value must match pattern ${regex}`);
      }
      return value;
    };
  },

  /**
   * Ensures array has minimum number of items
   */
  minItems<T>(min: number) {
    return (value: T[]): T[] => {
      if (value.length < min) {
        throw new ValidationError(`Array must have at least ${min} items`);
      }
      return value;
    };
  },

  /**
   * Ensures value is one of allowed values
   */
  oneOf<T>(allowed: T[]) {
    return (value: T): T => {
      if (!allowed.includes(value)) {
        throw new ValidationError(`Value must be one of: ${allowed.join(', ')}`);
      }
      return value;
    };
  },

  /**
   * Ensures semantic metadata includes required keywords
   */
  keywords(required: string[]) {
    return (value: string): string => {
      const missing = required.filter(kw => !value.toLowerCase().includes(kw.toLowerCase()));
      if (missing.length > 0) {
        throw new ValidationError(`Semantic metadata must include: ${missing.join(', ')}`);
      }
      return value;
    };
  },

  /**
   * Validates semver format
   */
  semver(value: string): string {
    const semverRegex = /^\d+\.\d+\.\d+(-[a-z0-9.]+)?$/i;
    if (!semverRegex.test(value)) {
      throw new ValidationError(`Invalid semver: ${value}`);
    }
    return value;
  },

  /**
   * Validates module ID format (kebab-case, can include slashes)
   */
  moduleId(value: string): string {
    const idRegex = /^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/;
    if (!idRegex.test(value)) {
      throw new ValidationError(`Invalid module ID format: ${value}`);
    }
    return value;
  },
};
```

### Internal Usage (within ums-lib only)

```typescript
// These guards are used INTERNALLY by ums-lib validators
// NOT exported in public API

import { guards } from './guards.js'; // Internal import

// Used inside validateModule() implementation
const id = guards.required(config.id, 'Module ID is required');
const name = guards.minLength(3)(config.metadata.name);
const version = guards.semver(config.version);
const capabilities = guards.minItems(1)(config.capabilities);

// Chain validators internally
const description = guards.minLength(20)(
  guards.maxLength(200)(config.metadata.description)
);
```

---

## Authoring Helpers (ums-sdk)

Developer-facing tools that use ums-lib validation under the hood.

### Smart Defaults

**Location**: `packages/ums-sdk/src/authoring/defaults.ts`

```typescript
export const defaults = {
  /**
   * Generate semantic metadata from name, description, and capabilities
   */
  generateSemantic(input: {
    name: string;
    description?: string;
    capabilities?: string[];
    keywords?: string[];
  }): string {
    const parts: string[] = [];

    // Extract keywords from name
    parts.push(...input.name.toLowerCase().split(/\s+/));

    // Extract keywords from description
    if (input.description) {
      const words = input.description
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 4); // Only meaningful words
      parts.push(...words.slice(0, 10)); // Limit to top 10
    }

    // Add capabilities
    if (input.capabilities) {
      parts.push(...input.capabilities);
    }

    // Add custom keywords
    if (input.keywords) {
      parts.push(...input.keywords);
    }

    // Deduplicate and join
    return [...new Set(parts)].join(' ');
  },

  /**
   * Generate export name from module ID
   * Example: "foundation/ethics/do-no-harm" -> "foundationEthicsDoNoHarm"
   */
  exportName(moduleId: string): string {
    return moduleId
      .split('/')
      .map((part, index) => {
        const camelCase = part
          .split('-')
          .map((word, wordIndex) => {
            if (index === 0 && wordIndex === 0) {
              // First word of first part stays lowercase
              return word;
            }
            // Capitalize first letter
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join('');
        return camelCase;
      })
      .join('');
  },

  /**
   * Infer tier from module ID
   */
  inferTier(moduleId: string): string | undefined {
    const tiers = ['foundation', 'principle', 'technology', 'execution'];
    const firstPart = moduleId.split('/')[0];
    return tiers.includes(firstPart) ? firstPart : undefined;
  },

  /**
   * Generate default version
   */
  defaultVersion(): string {
    return '1.0.0';
  },

  /**
   * Get schema version (always 2.0 for UMS v2.0)
   */
  schemaVersion(): string {
    return '2.0';
  },
};
```

---

## Component Validation (ums-lib - PUBLIC API)

**Location**: `packages/ums-lib/src/validation/components.ts`
**Visibility**: Public API - exported from ums-lib

Component validators are the public interface for validation. They use guards internally:

```typescript
import { guards } from './guards.js';

/**
 * Validate instruction component structure
 */
export function validateInstructionComponent(
  component: unknown
): InstructionComponent {
  const comp = component as Partial<InstructionComponent>;

  return {
    purpose: guards.required(comp.purpose, 'Instruction must have a purpose'),
    process: comp.process,
    constraints: comp.constraints,
    principles: comp.principles,
    criteria: comp.criteria,
  };
}

/**
 * Validate knowledge component structure
 */
export function validateKnowledgeComponent(
  component: unknown
): KnowledgeComponent {
  const comp = component as Partial<KnowledgeComponent>;

  return {
    explanation: guards.required(comp.explanation, 'Knowledge must have an explanation'),
    concepts: comp.concepts,
    examples: comp.examples,
    patterns: comp.patterns,
    problemSolution: comp.problemSolution,
  };
}

/**
 * Validate data component structure
 */
export function validateDataComponent(component: unknown): DataComponent {
  const comp = component as Partial<DataComponent>;

  return {
    description: guards.required(comp.description, 'Data must have a description'),
    format: guards.required(comp.format, 'Data must have a format'),
    value: guards.required(comp.value, 'Data must have a value'),
  };
}
```

---

## defineModule() Helper (ums-sdk)

**Location**: `packages/ums-sdk/src/authoring/define-module.ts`

The main authoring helper that uses ums-lib's public validation API:

```typescript
import { validateModule, validateInstructionComponent, validateKnowledgeComponent, validateDataComponent } from 'ums-lib';
import { defaults } from './defaults.js';

/**
 * Create a module with smart defaults and validation
 */
export function defineModule(config: {
  id: string;
  capabilities: string[];
  name: string;
  description: string;

  // Optional fields with smart defaults
  version?: string;
  keywords?: string[];

  // Component (one required)
  instruction?: Partial<InstructionComponent>;
  knowledge?: Partial<KnowledgeComponent>;
  data?: Partial<DataComponent>;

  // Optional advanced fields
  relationships?: ModuleRelationships;
  quality?: QualityMetadata;
}): Module {
  // Apply smart defaults (SDK's job)
  const version = config.version || defaults.defaultVersion();
  const schemaVersion = defaults.schemaVersion();
  const semantic = defaults.generateSemantic({
    name: config.name,
    description: config.description,
    capabilities: config.capabilities,
    keywords: config.keywords,
  });

  // Build module object
  const module: Module = {
    id: config.id,
    version,
    schemaVersion,
    capabilities: config.capabilities,
    metadata: {
      name: config.name,
      description: config.description,
      semantic,
    },
    // Component will be added below
    relationships: config.relationships,
    quality: config.quality,
  };

  // Add validated component using ums-lib public validators
  if (config.instruction) {
    module.instruction = validateInstructionComponent(config.instruction);
  } else if (config.knowledge) {
    module.knowledge = validateKnowledgeComponent(config.knowledge);
  } else if (config.data) {
    module.data = validateDataComponent(config.data);
  } else {
    throw new Error('Module must have instruction, knowledge, or data component');
  }

  // Validate complete module using ums-lib's public validateModule()
  return validateModule(module);
}
```

---

## Path-Based Helpers

**Location**: `packages/ums-sdk/src/authoring/path-helpers.ts`

```typescript
/**
 * Infer module ID from file path
 *
 * Example:
 * File: /app/modules/foundation/ethics/do-no-harm.module.ts
 * Base: /app/modules
 * Result: foundation/ethics/do-no-harm
 */
export function inferModuleId(filePath: string, basePath: string): string {
  const relativePath = path.relative(basePath, filePath);
  const withoutExtension = relativePath.replace(/\.module\.ts$/, '');
  return withoutExtension;
}

/**
 * Validate that module ID matches file path
 */
export function validateModuleIdMatchesPath(
  moduleId: string,
  filePath: string,
  basePath: string
): boolean {
  const inferred = inferModuleId(filePath, basePath);
  return moduleId === inferred;
}

/**
 * Get expected export name for file path
 */
export function expectedExportName(filePath: string, basePath: string): string {
  const moduleId = inferModuleId(filePath, basePath);
  return defaults.exportName(moduleId);
}
```

---

## Builder API (Optional)

**Location**: `packages/ums-sdk/src/authoring/module-builder.ts`

```typescript
/**
 * Fluent builder API for module creation
 * Validation happens in defineModule() which uses ums-lib validators
 */
export class ModuleBuilder {
  private config: Partial<{
    id: string;
    capabilities: string[];
    name: string;
    description: string;
    version?: string;
    instruction?: any;
    knowledge?: any;
    data?: any;
  }> = {};

  constructor(private filePath?: string, private basePath?: string) {
    if (filePath && basePath) {
      // Auto-infer ID from path
      this.config.id = inferModuleId(filePath, basePath);
    }
  }

  id(id: string): this {
    this.config.id = id;
    return this;
  }

  capabilities(...caps: string[]): this {
    this.config.capabilities = caps;
    return this;
  }

  name(name: string): this {
    this.config.name = name;
    return this;
  }

  description(desc: string): this {
    this.config.description = desc;
    return this;
  }

  instruction(comp: Partial<InstructionComponent>): this {
    this.config.instruction = comp;
    return this;
  }

  knowledge(comp: Partial<KnowledgeComponent>): this {
    this.config.knowledge = comp;
    return this;
  }

  data(comp: Partial<DataComponent>): this {
    this.config.data = comp;
    return this;
  }

  version(v: string): this {
    this.config.version = v;
    return this;
  }

  build(): Module {
    if (!this.config.id) throw new Error('Module ID required');
    if (!this.config.capabilities) throw new Error('Capabilities required');
    if (!this.config.name) throw new Error('Name required');
    if (!this.config.description) throw new Error('Description required');

    // defineModule() handles all validation via ums-lib
    return defineModule({
      id: this.config.id,
      capabilities: this.config.capabilities,
      name: this.config.name,
      description: this.config.description,
      version: this.config.version,
      instruction: this.config.instruction,
      knowledge: this.config.knowledge,
      data: this.config.data,
    });
  }
}
```

---

## Usage Examples

### Example 1: Minimal Module with Helpers

```typescript
import { defineModule } from 'ums-sdk/authoring';

// Validation happens automatically via ums-lib's public validators
// No need to import or use validation guards directly

export const errorHandling = defineModule({
  id: 'error-handling',
  capabilities: ['error-handling', 'debugging'],
  name: 'Error Handling',
  description: 'Best practices for error handling in software development',

  // Optional: auto-generated if not provided
  // version: '1.0.0',
  // schemaVersion: '2.0',
  // semantic: 'error handling best practices debugging...'

  instruction: {
    purpose: 'Guide developers in implementing robust error handling',
    process: [
      'Identify potential error sources',
      'Implement appropriate error boundaries',
      'Log errors with sufficient context',
    ],
  },
});

// Result: Fully validated Module object with smart defaults applied
```

**Saved**:
- 5+ lines of boilerplate (version, schemaVersion, semantic)
- Export name calculation (automatic from ID)
- Semantic metadata optimization (auto-generated)
- Manual validation (handled automatically)

### Example 2: Knowledge Module

```typescript
import { defineModule } from 'ums-sdk/authoring';

export const solidPrinciples = defineModule({
  id: 'concepts/solid-principles',
  capabilities: ['solid', 'oop', 'design-patterns'],
  name: 'SOLID Principles',
  description: 'Explanation of SOLID object-oriented design principles',

  // Knowledge component instead of instruction
  knowledge: {
    explanation: 'SOLID is an acronym for five design principles that make software designs more maintainable and flexible.',
    concepts: [
      {
        term: 'Single Responsibility',
        definition: 'A class should have only one reason to change',
      },
      {
        term: 'Open/Closed',
        definition: 'Software entities should be open for extension but closed for modification',
      },
      // ... more concepts
    ],
  },
});

// Validation happens automatically - errors thrown if invalid
```

### Example 3: Builder API

```typescript
import { ModuleBuilder } from 'ums-sdk/authoring';

export const errorHandling = new ModuleBuilder(__filename, __dirname)
  // ID inferred from file path automatically
  .capabilities('error-handling', 'debugging')
  .name('Error Handling')
  .description('Best practices for error handling in software development')
  .instruction({
    purpose: 'Guide developers in implementing robust error handling',
    process: [
      'Identify potential error sources',
      'Implement appropriate error boundaries',
      'Log errors with sufficient context',
    ],
  })
  .build();

// Fluent API with IDE autocomplete
```

### Example 4: Module with Relationships

```typescript
import { defineModule } from 'ums-sdk/authoring';

// Module that depends on other modules
export const advancedErrorHandling = defineModule({
  id: 'advanced-error-handling',
  capabilities: ['error-handling', 'resilience', 'monitoring'],
  name: 'Advanced Error Handling',
  description: 'Advanced patterns for error handling including retry logic, circuit breakers, and monitoring',

  // Module relationships
  relationships: {
    requires: ['error-handling'], // Must have basic error handling first
    extends: ['foundation/logic/reasoning'], // Builds on reasoning principles
    recommends: ['monitoring/observability'], // Works well with observability
  },

  instruction: {
    purpose: 'Guide implementation of advanced error handling patterns',
    process: [
      'Implement retry logic with exponential backoff',
      'Add circuit breakers for failing dependencies',
      'Set up error monitoring and alerting',
      'Create graceful degradation strategies',
    ],
    principles: [
      'Fail fast, recover gracefully',
      'Design for failure from the start',
    ],
  },
});

// defineModule validates everything automatically including relationships
```

---

## API Reference

### ums-lib (Public API)

**Validation Functions** (exported from `ums-lib`):

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `validateModule` | `module: unknown` | `Module` | Validates complete module structure |
| `validatePersona` | `persona: unknown` | `Persona` | Validates complete persona structure |
| `validateInstructionComponent` | `component: unknown` | `InstructionComponent` | Validates instruction component |
| `validateKnowledgeComponent` | `component: unknown` | `KnowledgeComponent` | Validates knowledge component |
| `validateDataComponent` | `component: unknown` | `DataComponent` | Validates data component |

**Note**: Validation guards are internal implementation details and not exposed in the public API.

### ums-sdk/authoring/defaults

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `generateSemantic` | `{ name, description?, capabilities?, keywords? }` | `string` | Auto-generates semantic metadata |
| `exportName` | `moduleId: string` | `string` | Calculates export name from ID |
| `inferTier` | `moduleId: string` | `string \| undefined` | Infers tier from ID |
| `defaultVersion` | - | `'1.0.0'` | Returns default version |
| `schemaVersion` | - | `'2.0'` | Returns schema version |

### ums-sdk/authoring/define-module

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `defineModule` | `ModuleConfig` | `Module` | Creates module with smart defaults and validation |

### ums-sdk/authoring/path-helpers

| Class/Function | Description |
|----------------|-------------|
| `ModuleBuilder` | Fluent API for module creation |
| `inferModuleId` | Infer module ID from file path |
| `expectedExportName` | Get expected export name for path |
| `validateModuleIdMatchesPath` | Validate ID matches file location |

---

## Implementation Plan

### Phase 1: Validation in ums-lib (Week 1)

**Package**: `ums-lib v1.1.0`

1. Add validation guards:
   ```
   packages/ums-lib/src/validation/
   ├── guards.ts              # All validation guards
   ├── components.ts          # Component validators
   └── index.ts               # Public exports
   ```

2. Implement validation functions:
   - All guard functions (required, minLength, pattern, etc.)
   - Component validators (validateInstructionComponent, etc.)
   - Comprehensive unit tests
   - Integration with existing validateModule()

**Deliverables**:
- ums-lib v1.1.0 with validation guards
- 100% test coverage
- Type definitions

### Phase 2: Authoring Helpers in ums-sdk (Week 2)

**Package**: `ums-sdk v1.1.0`

1. Create authoring tools that USE ums-lib:
   ```
   packages/ums-sdk/src/authoring/
   ├── defaults.ts           # Smart defaults
   ├── define-module.ts      # Main defineModule() function
   ├── path-helpers.ts       # Path inference utilities
   ├── module-builder.ts     # Optional builder API
   └── index.ts              # Public exports
   ```

2. Implement authoring helpers:
   - Smart default generators (generateSemantic, exportName, etc.)
   - defineModule() that uses ums-lib validators
   - Path inference utilities
   - Comprehensive tests

**Deliverables**:
- ums-sdk v1.1.0 with authoring helpers
- Integration tests with ums-lib
- Usage examples

### Phase 3: Integration & Polish (Week 3)

1. Update `ModuleLoader`:
   - Use path helpers for validation
   - Better error messages using guards
   - Integrate with authoring tools

2. Add migration tooling:
   - CLI command to convert existing modules
   - Automated refactoring assistance

**Deliverables**:
- Seamless integration with existing SDK
- Migration tooling for existing modules
- Performance benchmarks

### Phase 4: Documentation & Release (Week 4)

1. Documentation updates:
   - Update SDK user guide with authoring section
   - Create module authoring guide
   - Migration guide for existing modules
   - API reference for all authoring tools

2. Release preparation:
   - Changelog for v1.1.0
   - Breaking changes (none expected)
   - Upgrade guide

**Deliverables**:
- Complete documentation suite
- ums-sdk v1.1.0 release
- Community announcement

---

## Success Metrics

### Quantitative

- **Boilerplate Reduction**: 40% fewer lines for typical module
- **Error Reduction**: 80% fewer common authoring errors
- **Time Savings**: 50% faster module creation

### Qualitative

- **Developer Satisfaction**: >8/10 in user surveys
- **Adoption**: 50%+ of new modules use helpers within 3 months
- **Error Quality**: Better error messages reduce confusion

---

## Migration Strategy

### Backward Compatibility

**100% backward compatible** - existing modules continue to work:

```typescript
// Old way still works
import type { Module } from 'ums-sdk';

export const oldModule: Module = {
  id: 'old-module',
  version: '1.0.0',
  schemaVersion: '2.0',
  // ... rest of module
};

// New way is optional
import { defineModule } from 'ums-sdk/authoring';
// Uses ums-lib validation internally

export const newModule = defineModule({
  id: 'new-module',
  // ... simplified config
});
```

### Gradual Migration

Provide migration tooling:

```typescript
// CLI command to migrate existing module
$ copilot-instructions migrate-module ./error-handling.module.ts

// Shows diff and asks for confirmation
// Updates to use helpers while preserving functionality
```

---

## FAQ

### Q: Do I have to use the helpers?

**A**: No. They're completely optional. Existing modules work exactly as before.

### Q: What if I need more control?

**A**: All helpers accept full configuration. You can override any default.

```typescript
defineModule({
  id: 'my-module',
  version: '2.0.0',           // Override default
  semantic: 'custom keywords', // Override generated
  // ... full control
});
```

### Q: Does this change the Module type?

**A**: No. The output is always a standard `Module` object. Helpers just make creation easier.

### Q: What about existing modules?

**A**: They continue to work. No migration required (but migration tooling available).

---

## Next Steps

1. **Review & Approve** this specification
2. **Prototype** core helpers in ums-lib
3. **User Testing** with 3-5 module authors
4. **Iterate** based on feedback
5. **Implement** full feature set
6. **Document** and release

---

**Status**: Ready for review
**Feedback**: Open for comments and suggestions
