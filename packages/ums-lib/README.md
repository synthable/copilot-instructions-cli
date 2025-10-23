# UMS Library (`ums-lib`)

[![NPM Version](https://img.shields.io/npm/v/ums-lib.svg)](https://www.npmjs.com/package/ums-lib)
[![License](https://img.shields.io/npm/l/ums-lib.svg)](https://github.com/synthable/copilot-instructions-cli/blob/main/LICENSE)

A reusable, platform-agnostic library for UMS (Unified Module System) v2.0 operations, providing pure functions for parsing, validating, and building modular AI instructions.

## Core Philosophy

This library is designed to be a pure data transformation engine. It is completely decoupled from the file system and has no Node.js-specific dependencies, allowing it to be used in any JavaScript environment (e.g., Node.js, Deno, browsers).

The calling application is responsible for all I/O operations (like reading files). This library operates only on string content and JavaScript objects, ensuring predictable and testable behavior.

## Features

- ✅ **Platform Agnostic**: Contains no file-system or Node.js-specific APIs. Runs anywhere.
- ✅ **Conflict-Aware Registry**: Intelligent handling of module conflicts with configurable resolution strategies.
- ✅ **Tree-Shakable**: Modular exports allow importing only what you need for optimal bundle size.
- ✅ **Pure Functional API**: Operates on data structures and strings, not file paths, ensuring predictable behavior.
- ✅ **UMS v2.0 Compliant**: Full implementation of the specification for parsing, validation, and rendering.
- ✅ **TypeScript Support**: Fully typed for a robust developer experience.
- ✅ **Comprehensive Validation**: Detailed validation for both modules and personas against the UMS specification.
- ✅ **Performance Optimized**: Microsecond-level operations with comprehensive benchmarking.

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
import type { UMSModule, UMSPersona } from 'ums-lib';

// 1. Create a registry with a conflict resolution strategy ('error', 'warn', or 'replace')
const registry = new ModuleRegistry('warn');

// 2. Parse and add modules to the registry from different sources
const moduleContent = `
id: foundation/test/module-a
version: "1.0.0"
schemaVersion: "1.0"
shape: specification
meta:
  name: Module A
  description: A test module.
  semantic: A test module.
body:
  goal: This is a test goal.
`;
const module = parseModule(moduleContent);
registry.add(module, { type: 'local', path: './modules/module-a.yml' });

// 3. Parse the persona file
const personaContent = `
name: My Test Persona
version: "1.0.0"
schemaVersion: "1.0"
description: A test persona.
semantic: A test persona for demonstration.
identity: I am a test persona.
moduleGroups:
  - groupName: Core
    modules:
      - foundation/test/module-a
`;
const persona = parsePersona(personaContent);

// 4. Resolve all modules required by the persona
const requiredModuleIds = persona.moduleGroups.flatMap(group => group.modules);
const resolvedModules: UMSModule[] = [];
for (const moduleId of requiredModuleIds) {
  const resolvedModule = registry.resolve(moduleId);
  if (resolvedModule) {
    resolvedModules.push(resolvedModule);
  }
}

// 5. Render the final Markdown output
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
import type { UMSModule, UMSPersona } from 'ums-lib';

// 1. Parse all content
const persona = parsePersona(personaContent);
const module = parseModule(moduleContent);
const allAvailableModules: UMSModule[] = [module];

// 2. Resolve and render
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

- `parseModule(obj: unknown): Module`: Parses and validates a raw object as a UMS v2.0 module.
- `parsePersona(obj: unknown): Persona`: Parses and validates a raw object as a UMS v2.0 persona.

### Validation (`ums-lib/core/validation`)

- `validateModule(data: unknown): ValidationResult`: Validates a raw JavaScript object against the UMS v2.0 module schema.
- `validatePersona(data: unknown): ValidationResult`: Validates a raw JavaScript object against the UMS v2.0 persona schema.

### Resolution (`ums-lib/core/resolution`)

- `resolvePersonaModules(persona: UMSPersona, modules: UMSModule[]): ModuleResolutionResult`: A high-level function to resolve all modules for a persona from a flat list.
- `createModuleRegistry(modules: UMSModule[]): Map<string, UMSModule>`: Creates a simple `Map` from an array of modules.
- `validateModuleReferences(persona: UMSPersona, registry: Map<string, UMSModule>): ValidationResult`: Checks if all modules referenced in a persona exist in a given registry map.

### Rendering (`ums-lib/core/rendering`)

- `renderMarkdown(persona: UMSPersona, modules: UMSModule[]): string`: Renders a complete persona and its resolved modules into a final Markdown string.
- `renderModule(module: UMSModule): string`: Renders a single module to a Markdown string.
- `generateBuildReport(...)`: Generates a build report compliant with the UMS v2.0 specification.

### Registry (`ums-lib/core/registry`)

- `ModuleRegistry`: A class that provides a conflict-aware storage and retrieval mechanism for UMS modules.
  - `new ModuleRegistry(strategy: ConflictStrategy = 'error')`
  - `.add(module: UMSModule, source: ModuleSource): void`
  - `.resolve(moduleId: string, strategy?: ConflictStrategy): UMSModule | null`
  - `.resolveAll(strategy: ConflictStrategy): Map<string, UMSModule>`
  - `.getConflicts(moduleId: string): ModuleEntry[] | null`
  - `.getConflictingIds(): string[]`

### Types (`ums-lib/types`)

All UMS v2.0 interfaces are exported, including:

- `Module`, `Persona`, `Component`, `ModuleMetadata`, `ModuleGroup`
- `ValidationResult`, `ValidationError`, `ValidationWarning`
- `ModuleResolutionResult`
- `IModuleRegistry`, `ModuleEntry`, `ModuleSource`, `ConflictStrategy`
- `BuildReport`, `BuildReportGroup`, `BuildReportModule`

### Utilities (`ums-lib/utils`)

Custom error classes for robust error handling:

- `UMSError` (base class)
- `UMSValidationError`
- `ModuleLoadError`
- `PersonaLoadError`
- `BuildError`
- `ConflictError`

## License

[GPL-3.0-or-later](https://github.com/synthable/copilot-instructions-cli/blob/main/LICENSE)
