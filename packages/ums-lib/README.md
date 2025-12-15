# UMS Library (`ums-lib`)

[![NPM Version](https://img.shields.io/npm/v/ums-lib.svg)](https://www.npmjs.com/package/ums-lib)
[![License](https://img.shields.io/npm/l/ums-lib.svg)](https://github.com/synthable/copilot-instructions-cli/blob/main/LICENSE)

A reusable, platform-agnostic library for UMS (Unified Module System) v2.0/v2.1/v2.2 operations, providing pure functions for parsing, validating, and building modular AI instructions.

## Core Philosophy

This library is designed to be a pure data transformation engine. It is completely decoupled from the file system and has no Node.js-specific dependencies, allowing it to be used in any JavaScript environment (e.g., Node.js, Deno, browsers).

The calling application is responsible for all I/O operations (like reading files). This library operates only on string content and JavaScript objects, ensuring predictable and testable behavior.

## Features

- ✅ **Platform Agnostic**: Contains no file-system or Node.js-specific APIs. Runs anywhere.
- ✅ **Conflict-Aware Registry**: Intelligent handling of module conflicts with configurable resolution strategies.
- ✅ **Tree-Shakable**: Modular exports allow importing only what you need for optimal bundle size.
- ✅ **Pure Functional API**: Operates on data structures and strings, not file paths, ensuring predictable behavior.
- ✅ **UMS v2.0/v2.1/v2.2 Compliant**: Full implementation of the specification for parsing, validation, and rendering.
- ✅ **TypeScript Support**: Fully typed for a robust developer experience.
- ✅ **Comprehensive Validation**: Detailed validation for both modules and personas against the UMS specification.
- ✅ **Performance Optimized**: Microsecond-level operations with comprehensive benchmarking.
- ✅ **URI Scheme Support**: UMS v2.2 URI utilities for resource identification.

## Architecture Overview

The following diagram illustrates the separation of concerns between your application and the `ums-lib`:

```mermaid
graph LR
    subgraph Your Application
        A(File System) -- reads files --> B[YAML/String Content];
        B -- passes content to --> C;
        F -- returns final string to --> G(File System);
    end

    subgraph UMS Library
        C[1. Parse & Validate] --> D{Memory Objects};
        D --> E[2. Resolve & Render];
        E --> F{Markdown String};
    end
```

## Installation

```bash
npm install ums-lib
```

## Usage

The library provides a `ModuleRegistry` for advanced use cases involving conflict resolution, as well as a pure functional API for simple data transformations.

### Recommended: Using `ModuleRegistry`

The `ModuleRegistry` is the recommended approach for applications that load modules from multiple sources, as it provides robust conflict detection and resolution.

```typescript
import {
  ModuleRegistry,
  parseModule,
  parsePersona,
  renderMarkdown,
} from 'ums-lib';
import type { Module, Persona } from 'ums-lib';

// 1. Create a registry with a conflict resolution strategy ('error', 'warn', or 'replace')
const registry = new ModuleRegistry('warn');

// 2. Create module objects (typically loaded from .module.ts files)
import { CognitiveLevel, ComponentType } from 'ums-lib';

const moduleObj: Module = {
  id: 'testing/module-a',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['testing', 'example'],
  cognitiveLevel: CognitiveLevel.UNIVERSAL_PATTERNS,
  metadata: {
    name: 'Module A',
    description: 'A test module for demonstration.',
    semantic: 'Test module demonstrating UMS v2.0 structure and validation.',
  },
  instruction: {
    type: ComponentType.Instruction,
    instruction: {
      purpose: 'Demonstrate module structure',
      principles: [
        'Follow UMS v2.0 specification',
        'Include all required fields',
      ],
    },
  },
};

// 3. Parse and validate the module, then add to registry
const module = parseModule(moduleObj);
registry.add(module, { type: 'local', path: './modules/module-a.module.ts' });

// 4. Create persona object (typically loaded from .persona.ts file)
const personaObj: Persona = {
  id: 'test-persona',
  name: 'My Test Persona',
  version: '1.0.0',
  schemaVersion: '2.0',
  description: 'A test persona for demonstration.',
  semantic: 'Demonstration persona showing UMS v2.0 composition patterns.',
  modules: [
    {
      group: 'Core',
      ids: ['testing/module-a'],
    },
  ],
};

// 5. Parse and validate the persona
const persona = parsePersona(personaObj);

// 6. Resolve all modules required by the persona
const resolvedModules: Module[] = [];
for (const entry of persona.modules) {
  if (typeof entry === 'string') {
    // Simple module ID string
    const resolvedModule = registry.resolve(entry);
    if (resolvedModule) resolvedModules.push(resolvedModule);
  } else {
    // Grouped format with 'ids' array
    for (const moduleId of entry.ids) {
      const resolvedModule = registry.resolve(moduleId);
      if (resolvedModule) resolvedModules.push(resolvedModule);
    }
  }
}

// 7. Render the final Markdown output
const markdownOutput = renderMarkdown(persona, resolvedModules);
console.log(markdownOutput);
```

### Pure Functional API

For simpler use cases where you manage the module collection yourself, you can use the pure functional API.

```typescript
import {
  parseModule,
  parsePersona,
  resolvePersonaModules,
  renderMarkdown,
} from 'ums-lib';
import type { Module, Persona } from 'ums-lib';

// 1. Create and parse module objects
import { CognitiveLevel, ComponentType } from 'ums-lib';

const moduleObj: Module = {
  id: 'testing/example',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['testing'],
  cognitiveLevel: CognitiveLevel.UNIVERSAL_PATTERNS,
  metadata: {
    name: 'Example Module',
    description: 'An example module.',
    semantic: 'Example module for testing pure functional API.',
  },
  instruction: {
    type: ComponentType.Instruction,
    instruction: {
      purpose: 'Demonstrate functional API usage',
      principles: ['Use pure functions', 'Manage state externally'],
    },
  },
};

const module = parseModule(moduleObj);
const allAvailableModules: Module[] = [module];

// 2. Create and parse persona object
const personaObj: Persona = {
  id: 'test-persona',
  name: 'Test Persona',
  version: '1.0.0',
  schemaVersion: '2.0',
  description: 'A test persona.',
  semantic: 'Test persona demonstrating functional API.',
  modules: ['testing/example'],
};

const persona = parsePersona(personaObj);

// 3. Resolve and render
const resolutionResult = resolvePersonaModules(persona, allAvailableModules);
if (resolutionResult.missingModules.length > 0) {
  console.error('Missing modules:', resolutionResult.missingModules);
}

const markdownOutput = renderMarkdown(persona, resolutionResult.modules);
console.log(markdownOutput);
```

## API Reference

The library is organized into functional domains, and its exports are tree-shakable.

### Main Entrypoint (`ums-lib`)

This exports all core functions, types, and error classes.

### Parsing (`ums-lib/core/parsing`)

- `parseModule(obj: unknown): Module`: Parses and validates a raw object as a UMS v2.0/v2.1/v2.2 module.
- `parsePersona(obj: unknown): Persona`: Parses and validates a raw object as a UMS v2.0/v2.1/v2.2 persona.

### Validation (`ums-lib/core/validation`)

- `validateModule(module: Module): ValidationResult`: Validates a module object against the UMS specification.
- `validatePersona(persona: Persona): ValidationResult`: Validates a persona object against the UMS specification.

### Resolution (`ums-lib/core/resolution`)

- `resolvePersonaModules(persona: Persona, modules: Module[]): ModuleResolutionResult`: A high-level function to resolve all modules for a persona from a flat list.
- `resolveModules(moduleEntries: ModuleEntry[], registry: Map<string, Module>): ModuleResolutionResult`: Resolves modules from persona module entries using a registry map.
- `resolveImplementations(modules: Module[], registry: Map<string, Module>): Module[]`: Resolves module implementations using the synergistic pairs pattern.
- `createModuleRegistry(modules: Module[]): Map<string, Module>`: Creates a simple `Map` from an array of modules.
- `validateModuleReferences(persona: Persona, registry: Map<string, Module>): ValidationResult`: Checks if all modules referenced in a persona exist in a given registry map.

### Rendering (`ums-lib/core/rendering`)

- `renderMarkdown(persona: Persona, modules: Module[]): string`: Renders a complete persona and its resolved modules into a final Markdown string.
- `renderModule(module: Module): string`: Renders a single module to a Markdown string.
- `renderComponent(component: Component): string`: Renders a single component to Markdown.
- `renderInstructionComponent(component: InstructionComponent): string`: Renders an instruction component to Markdown.
- `renderKnowledgeComponent(component: KnowledgeComponent): string`: Renders a knowledge component to Markdown.
- `renderConcept(concept: Concept): string`: Renders a concept to Markdown.
- `renderExample(example: Example): string`: Renders an example to Markdown.
- `renderPattern(pattern: Pattern): string`: Renders a pattern to Markdown.
- `generateBuildReport(persona, modules, moduleFileContents?, moduleMetadata?): BuildReport`: Generates a build report compliant with the UMS specification.
- `generatePersonaDigest(persona: Persona): string`: Generates a SHA-256 digest of persona content.
- `generateModuleDigest(content: string): string`: Generates a SHA-256 digest of module content.

### Registry (`ums-lib/core/registry`)

- `ModuleRegistry`: A class that provides a conflict-aware storage and retrieval mechanism for UMS modules.
  - `new ModuleRegistry(strategy: ConflictStrategy = 'error')`
  - `.add(module: Module, source: ModuleSource): void`
  - `.addAll(modules: Module[], source: ModuleSource): void`
  - `.resolve(moduleId: string, strategy?: ConflictStrategy): Module | null`
  - `.resolveAll(strategy: ConflictStrategy): Map<string, Module>`
  - `.has(moduleId: string): boolean`
  - `.size(): number`
  - `.getConflicts(moduleId: string): RegistryEntry[] | null`
  - `.getConflictingIds(): string[]`
  - `.getAllEntries(): Map<string, RegistryEntry[]>`
  - `.getSourceSummary(): Record<string, number>`

### URI (`ums-lib/core/uri`)

UMS v2.2 URI scheme utilities for working with UMS resource identifiers.

- `parseURI(uri: string): ParsedURI | null`: Parses a UMS URI into its components.
- `validateURI(uri: string): URIValidationResult`: Validates a UMS URI.
- `buildURI(moduleId: string, componentId?: string, primitiveType?: PrimitiveType): string`: Builds a UMS URI from components.
- `isValidURI(uri: string): boolean`: Checks if a string is a valid UMS URI.
- `UMS_PROTOCOL`: The UMS URI protocol prefix (`'ums://'`).

### Types (`ums-lib/types`)

All UMS v2.0/v2.1/v2.2 interfaces are exported, including:

**Core Types:**

- `Module`, `Persona`, `ModuleMetadata`, `Attribution`
- `ModuleGroup`, `ModuleEntry`, `PersonaModuleGroup`

**Component Types:**

- `Component`, `InstructionComponent`, `KnowledgeComponent`
- `ComponentType` (enum: `Instruction`, `Knowledge`)
- `ComponentMetadata`
- `ProcessStep`, `Constraint`, `ConstraintObject`, `ConstraintGroup`
- `Criterion`, `CriterionObject`, `CriterionGroup`
- `Concept`, `Example`, `Pattern`

**Validation Types:**

- `ValidationResult`, `ValidationError`, `ValidationWarning`

**Registry Types:**

- `RegistryEntry`, `ModuleSource`, `ConflictStrategy`

**Build Report Types:**

- `BuildReport`, `BuildReportGroup`, `BuildReportModule`

**Cognitive Level:**

- `CognitiveLevel` (enum: `AXIOMS_AND_ETHICS`, `REASONING_FRAMEWORKS`, `UNIVERSAL_PATTERNS`, `DOMAIN_SPECIFIC_GUIDANCE`, `PROCEDURES_AND_PLAYBOOKS`, `SPECIFICATIONS_AND_STANDARDS`, `META_COGNITION`)
- `getCognitiveLevelName(level): string | undefined`
- `getCognitiveLevelDescription(level): string | undefined`
- `parseCognitiveLevel(value: string | number): CognitiveLevel | undefined`
- `isValidCognitiveLevel(value: unknown): value is CognitiveLevel`

**Primitive Types (v2.2):**

- `PrimitiveType` (enum)
- `AtomicPrimitive`

**Type Guards:**

- `isProcessStepObject(value): value is ProcessStep`
- `isConstraintObject(value): value is ConstraintObject`
- `isConstraintGroup(value): value is ConstraintGroup`
- `isCriterionObject(value): value is CriterionObject`
- `isCriterionGroup(value): value is CriterionGroup`
- `isExampleObject(value): value is Example`

### Adapters (`ums-lib/adapters`)

Type-only interfaces that define contracts between ums-lib and implementation layers (CLI, loaders, web services):

- `ModuleSourceType`: Source type for modules (`'standard' | 'local' | 'remote'`)
- `ModuleSourceInfo`: Metadata about where a module came from
- `FileLocation`: File location information for diagnostics
- `LoaderDiagnostic`: Diagnostic message from the loader
- `LoadedModule`: Result of loading a single module file
- `LoadedPersona`: Result of loading a single persona file
- `LoadResult<T>`: Discriminated union for load operations
- `ModuleEntryForRegistry`: Simplified module entry for registry operations
- `ModuleConfig`: Configuration for module loading paths and conflict resolution

### Utilities (`ums-lib/utils`)

Custom error classes for robust error handling:

- `UMSError` (base class)
- `UMSValidationError` (alias: `ValidationError`)
- `ModuleLoadError` (alias: `ModuleParseError`)
- `PersonaLoadError` (alias: `PersonaParseError`)
- `BuildError`
- `ConflictError`
- `isUMSError(error): error is UMSError`
- `isValidationError(error): error is UMSValidationError`

Transformation utilities:

- `moduleIdToExportName(moduleId: string): string`: Transforms a module ID to its expected TypeScript export name.

### Constants

Exported constants for validation and configuration:

- `MODULE_ID_REGEX`: Regex pattern for validating module IDs
- `COMPONENT_ID_REGEX`: Regex pattern for validating component IDs (v2.2)
- `UMS_SCHEMA_VERSION`: Current UMS schema version

## License

[GPL-3.0-or-later](https://github.com/synthable/copilot-instructions-cli/blob/main/LICENSE)
