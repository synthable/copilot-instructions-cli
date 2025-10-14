# UMS SDK

[![Version](https://img.shields.io/npm/v/ums-sdk.svg)](https://www.npmjs.com/package/ums-sdk)
[![License](https://img.shields.io/badge/license-GPL--3.0--or--later-blue.svg)](https://github.com/synthable/copilot-instructions-cli/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

Node.js SDK for the Unified Module System (UMS) v2.0. Provides file system operations, TypeScript module loading, and high-level orchestration for building AI persona instructions from modular components.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Core Components](#core-components)
  - [High-Level API](#high-level-api)
  - [Loaders](#loaders)
  - [Discovery](#discovery)
  - [Orchestration](#orchestration)
- [Usage Examples](#usage-examples)
  - [Building a Persona](#building-a-persona)
  - [Validating Modules](#validating-modules)
  - [Listing Modules](#listing-modules)
  - [Using the Orchestrator](#using-the-orchestrator)
- [TypeScript Support](#typescript-support)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Development](#development)
- [Relationship to Other Packages](#relationship-to-other-packages)
- [License](#license)

## Overview

The UMS SDK is the Node.js implementation layer for UMS v2.0, providing:

- **File System Operations**: Load `.module.ts` and `.persona.ts` files from disk
- **TypeScript Module Loading**: Execute TypeScript files on-the-fly using `tsx`
- **Module Discovery**: Automatically find and load modules from configured directories
- **Build Orchestration**: Complete workflow for building personas from modular components
- **Configuration Management**: Load and validate `modules.config.yml` files
- **Standard Library Support**: Integrated standard module library

The SDK sits between the pure domain logic in `ums-lib` and the CLI/UI layer, providing the I/O and orchestration needed for real-world applications.

## Installation

```bash
npm install ums-sdk
```

The SDK requires Node.js 22.0.0 or higher and includes `ums-lib` as a dependency.

### Optional Dependencies

- **tsx**: Required for loading TypeScript modules (`.module.ts`, `.persona.ts`)
- **TypeScript**: Peer dependency (optional)

If you need to load TypeScript files, install tsx:

```bash
npm install tsx
```

## Architecture

The UMS ecosystem follows a three-tier architecture:

```
┌─────────────────────────────────────────────┐
│            CLI / UI Layer                    │
│  (ums-cli, ums-mcp)                         │
│  - User interface                           │
│  - Command handling                         │
│  - Output formatting                        │
└─────────────────┬───────────────────────────┘
                  │
                  │ uses
                  ▼
┌─────────────────────────────────────────────┐
│           UMS SDK (this package)            │
│  - File system operations                   │
│  - TypeScript module loading                │
│  - Module discovery                         │
│  - Build orchestration                      │
│  - Configuration management                 │
└─────────────────┬───────────────────────────┘
                  │
                  │ uses
                  ▼
┌─────────────────────────────────────────────┐
│              UMS Library                    │
│  - Pure domain logic                        │
│  - Module/persona parsing                   │
│  - Validation                               │
│  - Module registry                          │
│  - Markdown rendering                       │
└─────────────────────────────────────────────┘
```

**Separation of Concerns:**

- **ums-lib**: Platform-agnostic domain logic, no I/O operations
- **ums-sdk**: Node.js-specific I/O, file loading, and orchestration
- **CLI/UI**: User-facing interfaces consuming the SDK

## Quick Start

```typescript
import { buildPersona } from 'ums-sdk';

// Build a persona from a TypeScript configuration file
const result = await buildPersona('./personas/my-persona.persona.ts');

console.log(result.markdown); // Rendered Markdown content
console.log(result.buildReport); // Build metadata and statistics
```

## Core Components

### High-Level API

The SDK provides three main convenience functions for common workflows:

#### `buildPersona(personaPath, options)`

Complete workflow for building a persona:

```typescript
import { buildPersona } from 'ums-sdk';

const result = await buildPersona('./personas/my-persona.persona.ts', {
  configPath: './modules.config.yml',
  conflictStrategy: 'warn',
  includeStandard: true,
});

// result contains:
// - markdown: Rendered output
// - persona: Loaded persona object
// - modules: Resolved modules in composition order
// - buildReport: Build metadata (SHA-256 hash, module list, etc.)
// - warnings: Any warnings generated during build
```

#### `validateAll(options)`

Validate all discovered modules and personas:

```typescript
import { validateAll } from 'ums-sdk';

const report = await validateAll({
  configPath: './modules.config.yml',
  includeStandard: true,
  includePersonas: true,
});

console.log(`Valid modules: ${report.validModules}/${report.totalModules}`);
console.log(`Valid personas: ${report.validPersonas}/${report.totalPersonas}`);

// Check for errors
if (report.errors.size > 0) {
  for (const [id, errors] of report.errors) {
    console.error(`${id}:`, errors);
  }
}
```

#### `listModules(options)`

List all available modules with metadata:

```typescript
import { listModules } from 'ums-sdk';

const modules = await listModules({
  tier: 'foundation', // Optional: filter by tier
  capability: 'reasoning', // Optional: filter by capability
});

modules.forEach(module => {
  console.log(`${module.id}: ${module.name}`);
  console.log(`  Description: ${module.description}`);
  console.log(`  Source: ${module.source}`);
  console.log(`  Capabilities: ${module.capabilities.join(', ')}`);
});
```

### Loaders

Loaders handle file I/O and TypeScript execution:

#### `ModuleLoader`

Loads and validates `.module.ts` files:

```typescript
import { ModuleLoader } from 'ums-sdk';

const loader = new ModuleLoader();

// Load a single module
const module = await loader.loadModule(
  '/path/to/error-handling.module.ts',
  'error-handling'
);

// Load raw file content (for hashing, etc.)
const content = await loader.loadRawContent('/path/to/module.ts');
```

#### `PersonaLoader`

Loads and validates `.persona.ts` files:

```typescript
import { PersonaLoader } from 'ums-sdk';

const loader = new PersonaLoader();

// Load a persona (supports default or named exports)
const persona = await loader.loadPersona(
  './personas/systems-architect.persona.ts'
);

console.log(persona.name);
console.log(persona.modules); // Module IDs to compose
```

#### `ConfigManager`

Loads and validates `modules.config.yml`:

```typescript
import { ConfigManager } from 'ums-sdk';

const configManager = new ConfigManager();

// Load configuration
const config = await configManager.load('./modules.config.yml');

// config contains:
// - localModulePaths: Array of { path }

// Validate configuration structure
const validation = configManager.validate(configObject);
if (!validation.valid) {
  console.error('Config errors:', validation.errors);
}
```

### Discovery

Discovery components find and load modules from directories:

#### `ModuleDiscovery`

Discovers all `.module.ts` files in configured paths:

```typescript
import { ModuleDiscovery } from 'ums-sdk';

const discovery = new ModuleDiscovery();

// Discover modules from configuration
const modules = await discovery.discover(config);

// Or discover from specific paths
const modules = await discovery.discoverInPaths([
  './instruct-modules-v2',
  './custom-modules',
]);
```

#### `StandardLibrary`

Manages standard library modules:

```typescript
import { StandardLibrary } from 'ums-sdk';

const standardLib = new StandardLibrary();

// Discover all standard library modules
const modules = await standardLib.discoverStandard();

// Check if a module is from standard library
const isStandard = standardLib.isStandardModule('foundation/ethics/do-no-harm');

// Get standard library path
const path = standardLib.getStandardLibraryPath();
```

### Orchestration

#### `BuildOrchestrator`

Coordinates the complete build workflow:

```typescript
import { BuildOrchestrator } from 'ums-sdk';

const orchestrator = new BuildOrchestrator();

const result = await orchestrator.build('./personas/my-persona.persona.ts', {
  configPath: './modules.config.yml',
  conflictStrategy: 'warn',
  includeStandard: true,
});

// Orchestrator handles:
// 1. Loading persona file
// 2. Loading configuration
// 3. Discovering modules (standard + local)
// 4. Building module registry
// 5. Resolving persona modules
// 6. Rendering to Markdown
// 7. Generating build report
```

## Usage Examples

### Building a Persona

Complete example building a persona from a TypeScript file:

```typescript
import { buildPersona } from 'ums-sdk';
import { writeFile } from 'node:fs/promises';

async function buildMyPersona() {
  try {
    // Build persona
    const result = await buildPersona(
      './personas/systems-architect.persona.ts',
      {
        configPath: './modules.config.yml',
        conflictStrategy: 'warn',
        includeStandard: true,
      }
    );

    // Write output to file
    await writeFile('./dist/systems-architect.md', result.markdown);

    // Log build information
    console.log(`Built persona: ${result.persona.name}`);
    console.log(`Version: ${result.persona.version}`);
    console.log(`Modules: ${result.modules.length}`);
    console.log(`Build ID: ${result.buildReport.buildId}`);

    // Handle warnings
    if (result.warnings.length > 0) {
      console.warn('Warnings:');
      result.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildMyPersona();
```

### Validating Modules

Validate all modules and personas in your project:

```typescript
import { validateAll } from 'ums-sdk';

async function validateProject() {
  const report = await validateAll({
    includeStandard: true,
    includePersonas: true,
  });

  console.log('\n=== Validation Report ===');
  console.log(`Modules: ${report.validModules}/${report.totalModules} valid`);

  if (report.totalPersonas !== undefined) {
    console.log(
      `Personas: ${report.validPersonas}/${report.totalPersonas} valid`
    );
  }

  // Show errors
  if (report.errors.size > 0) {
    console.error('\nErrors:');
    for (const [id, errors] of report.errors) {
      console.error(`\n${id}:`);
      errors.forEach(error => {
        console.error(`  - ${error.path || ''}: ${error.message}`);
      });
    }
    process.exit(1);
  }

  console.log('\nAll validations passed!');
}

validateProject();
```

### Listing Modules

Query available modules with filtering:

```typescript
import { listModules } from 'ums-sdk';

async function listFoundationModules() {
  // List all foundation tier modules
  const modules = await listModules({
    tier: 'foundation',
  });

  console.log(`Found ${modules.length} foundation modules:\n`);

  modules.forEach(module => {
    console.log(`${module.id}`);
    console.log(`  Name: ${module.name}`);
    console.log(`  Description: ${module.description}`);
    console.log(`  Version: ${module.version}`);
    console.log(`  Capabilities: ${module.capabilities.join(', ')}`);
    console.log(`  Source: ${module.source}`);
    console.log();
  });
}

// List modules with a specific capability
async function listReasoningModules() {
  const modules = await listModules({
    capability: 'reasoning',
  });

  console.log(`Modules with reasoning capability: ${modules.length}`);
  modules.forEach(m => console.log(`  - ${m.id}`));
}

listFoundationModules();
listReasoningModules();
```

### Using the Orchestrator

Direct use of the orchestrator for custom workflows:

```typescript
import { BuildOrchestrator, ModuleRegistry } from 'ums-sdk';

async function customBuild() {
  const orchestrator = new BuildOrchestrator();

  // Build with custom options
  const result = await orchestrator.build('./personas/my-persona.persona.ts', {
    conflictStrategy: 'replace', // Replace duplicate modules
    includeStandard: true,
  });

  // Access detailed information
  console.log('Persona Identity:');
  console.log(`  Name: ${result.persona.name}`);
  console.log(`  Description: ${result.persona.description}`);
  console.log(`  Semantic: ${result.persona.semantic || 'N/A'}`);

  console.log('\nModule Composition:');
  result.modules.forEach((module, index) => {
    console.log(`  ${index + 1}. ${module.id} (v${module.version})`);
    console.log(`     ${module.metadata.name}`);
  });

  console.log('\nBuild Report:');
  console.log(`  Build ID: ${result.buildReport.buildId}`);
  console.log(`  Timestamp: ${result.buildReport.timestamp}`);
  console.log(`  Module Count: ${result.buildReport.moduleList.length}`);

  return result;
}

customBuild();
```

## TypeScript Support

The SDK uses `tsx` to load TypeScript files on-the-fly, allowing you to write modules and personas in TypeScript without a separate compilation step.

### Module ID Extraction

The SDK uses **path-based module ID extraction**. Module IDs are automatically extracted from the file path relative to the configured base path:

- Example: `./modules/foundation/ethics/do-no-harm.module.ts` with base `./modules` → Module ID: `foundation/ethics/do-no-harm`
- The SDK validates that the module's declared `id` field matches the expected ID from the file path
- This ensures consistency between file organization and module identifiers

### SDK Validation Responsibilities

The SDK performs the following validations:

- **Module ID Matching**: Validates that the declared module ID matches the file path
- **Export Naming**: Validates that exported module names follow the camelCase convention
- **File Loading**: Wraps file system errors with contextual information

The SDK delegates module structure validation to `ums-lib`, which validates:

- **UMS v2.0 Compliance**: Module structure, required fields, schema version
- **Module Content**: Instruction format, metadata completeness
- **Registry Operations**: Conflict detection, dependency resolution

### Module Files (`.module.ts`)

```typescript
import type { Module } from 'ums-lib';

export const errorHandling: Module = {
  id: 'error-handling',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['error-handling', 'debugging'],
  metadata: {
    name: 'Error Handling',
    description: 'Best practices for error handling',
    semantic: 'exception error handling debugging recovery',
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

### Persona Files (`.persona.ts`)

```typescript
import type { Persona } from 'ums-lib';

export default {
  name: 'Systems Architect',
  version: '1.0.0',
  schemaVersion: '2.0',
  description: 'Expert in system design and architecture',
  semantic: 'architecture design systems scalability patterns',
  modules: [
    'foundation/reasoning/systems-thinking',
    'principle/architecture/separation-of-concerns',
    'technology/typescript/best-practices',
  ],
} satisfies Persona;
```

### Export Conventions

**Modules:**

- Must use **named exports**
- Export name is camelCase transformation of the **full module ID path**
- Example: `foundation/ethics/do-no-harm` → `export const foundationEthicsDoNoHarm`
- The entire path (including tier and category) is converted: slashes removed, segments capitalized

**Personas:**

- Can use **default export** (preferred) or named export
- SDK will find any valid Persona object in exports

## Configuration

The SDK uses `modules.config.yml` for configuration:

```yaml
# Optional: Global conflict resolution strategy (default: 'error')
conflictStrategy: warn # 'error' | 'warn' | 'replace'

localModulePaths:
  - path: ./instruct-modules-v2
  - path: ./custom-modules
```

### Configuration Fields

- **`conflictStrategy`** (optional): Global conflict resolution strategy
  - `error`: Fail on duplicate module IDs (default)
  - `warn`: Log warning and skip duplicate
  - `replace`: Replace existing module with new one

- **`localModulePaths`** (required): Array of module search paths
  - **`path`**: Directory containing modules

### Conflict Resolution

Conflict resolution is controlled **globally** and follows this priority order:

1. **Runtime override**: `BuildOptions.conflictStrategy` (if provided)
2. **Config file default**: `conflictStrategy` in `modules.config.yml` (if specified)
3. **System default**: `'error'`

**Example with config file default**:

```yaml
# modules.config.yml
conflictStrategy: warn # Project-wide default

localModulePaths:
  - path: ./modules
```

```typescript
// Uses 'warn' from config file
const result1 = await buildPersona('./personas/my-persona.persona.ts');

// Overrides config file with 'replace'
const result2 = await buildPersona('./personas/my-persona.persona.ts', {
  conflictStrategy: 'replace',
});
```

**Note:** Per-path conflict resolution (the `onConflict` field) was removed in v1.0 to simplify configuration. This feature is reserved for potential inclusion in v2.x based on user feedback.

### Environment Variables

- **`INSTRUCTIONS_MODULES_PATH`**: Override standard library location (default: `./instructions-modules`)

## API Reference

### High-Level API

| Function         | Parameters                                      | Returns                     | Description                       |
| ---------------- | ----------------------------------------------- | --------------------------- | --------------------------------- |
| `buildPersona()` | `personaPath: string`, `options?: BuildOptions` | `Promise<BuildResult>`      | Build a persona from file         |
| `validateAll()`  | `options?: ValidateOptions`                     | `Promise<ValidationReport>` | Validate all modules and personas |
| `listModules()`  | `options?: ListOptions`                         | `Promise<ModuleInfo[]>`     | List all available modules        |

### Loaders

| Class           | Methods                            | Description              |
| --------------- | ---------------------------------- | ------------------------ |
| `ModuleLoader`  | `loadModule()`, `loadRawContent()` | Load `.module.ts` files  |
| `PersonaLoader` | `loadPersona()`                    | Load `.persona.ts` files |
| `ConfigManager` | `load()`, `validate()`             | Load and validate config |

### Discovery

| Class             | Methods                                    | Description             |
| ----------------- | ------------------------------------------ | ----------------------- |
| `ModuleDiscovery` | `discover()`, `discoverInPaths()`          | Find and load modules   |
| `StandardLibrary` | `discoverStandard()`, `isStandardModule()` | Manage standard library |

### Orchestration

| Class               | Methods   | Description             |
| ------------------- | --------- | ----------------------- |
| `BuildOrchestrator` | `build()` | Complete build workflow |

### Error Types

| Error                 | Extends    | Description             |
| --------------------- | ---------- | ----------------------- |
| `SDKError`            | `Error`    | Base SDK error          |
| `ModuleNotFoundError` | `SDKError` | File not found          |
| `InvalidExportError`  | `SDKError` | Invalid module export   |
| `ModuleLoadError`     | `SDKError` | Module loading failed   |
| `ConfigError`         | `SDKError` | Configuration error     |
| `DiscoveryError`      | `SDKError` | Module discovery failed |

### Type Definitions

```typescript
interface BuildOptions {
  configPath?: string;
  conflictStrategy?: 'error' | 'warn' | 'replace';
  attribution?: boolean;
  includeStandard?: boolean;
}

interface BuildResult {
  markdown: string;
  persona: Persona;
  modules: Module[];
  buildReport: BuildReport;
  warnings: string[];
}

interface ValidateOptions {
  configPath?: string;
  includeStandard?: boolean;
  includePersonas?: boolean;
}

interface ValidationReport {
  totalModules: number;
  validModules: number;
  errors: Map<string, ValidationError[]>;
  warnings: Map<string, SDKValidationWarning[]>;
  totalPersonas?: number;
  validPersonas?: number;
}

interface ListOptions {
  configPath?: string;
  includeStandard?: boolean;
  tier?: string;
  capability?: string;
}

interface ModuleInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  capabilities: string[];
  source: 'standard' | 'local';
  filePath?: string;
}
```

## Development

### Setup

```bash
# Install dependencies
npm install

# Build the SDK
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Type checking
npm run typecheck

# Lint
npm run lint
npm run lint:fix

# Format
npm run format
npm run format:check

# Quality check (all validations)
npm run quality-check
```

### Project Structure

```
packages/ums-sdk/
├── src/
│   ├── api/
│   │   └── high-level-api.ts      # Convenience functions
│   ├── loaders/
│   │   ├── module-loader.ts       # Load .module.ts files
│   │   ├── persona-loader.ts      # Load .persona.ts files
│   │   └── config-loader.ts       # Load modules.config.yml
│   ├── discovery/
│   │   ├── module-discovery.ts    # Find modules in directories
│   │   └── standard-library.ts    # Manage standard library
│   ├── orchestration/
│   │   └── build-orchestrator.ts  # Build workflow coordination
│   ├── errors/
│   │   └── index.ts               # SDK-specific errors
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   └── index.ts                   # Main exports
├── dist/                          # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```

### Testing

The SDK includes comprehensive unit tests using Vitest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test -- --watch

# Run specific test file
npx vitest run src/loaders/module-loader.test.ts

# Coverage report
npm run test:coverage
```

### Contributing

1. Follow the project's TypeScript configuration
2. Write tests for new features
3. Maintain 80% code coverage
4. Use ESLint and Prettier for code style
5. Update documentation for API changes

## Relationship to Other Packages

### Dependencies

- **ums-lib**: Pure domain logic (validation, rendering, registry)
- **yaml**: YAML parsing for configuration files
- **glob**: File pattern matching for module discovery
- **tsx** (optional): TypeScript execution for `.module.ts` and `.persona.ts` files

### Consumers

- **ums-cli**: Command-line interface using the SDK
- **ums-mcp**: MCP server for AI assistant integration

### Design Principles

The SDK follows these architectural principles:

1. **Separation of Concerns**: I/O operations are isolated from domain logic
2. **Composition**: Uses ums-lib for all domain logic
3. **Node.js Specific**: Leverages Node.js APIs for file system operations
4. **Type Safety**: Full TypeScript support with exported type definitions
5. **Error Handling**: Comprehensive error types for different failure modes

## License

GPL-3.0-or-later

Copyright (c) 2025 synthable

This package is part of the ums-cli project.

## Resources

- [UMS v2.0 Specification](../../docs/spec/ums_v2_spec.md)
- [SDK Specification](../../docs/spec/ums_sdk_v1_spec.md)
- [GitHub Repository](https://github.com/synthable/copilot-instructions-cli)
- [Issues](https://github.com/synthable/copilot-instructions-cli/issues)

## Support

For questions, issues, or contributions, please visit the [GitHub repository](https://github.com/synthable/copilot-instructions-cli).
