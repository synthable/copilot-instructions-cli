# UMS SDK User Guide

**Version:** 1.0.0
**Target:** Node.js 22.0.0+

The UMS SDK is a Node.js library that provides file system operations, TypeScript module loading, and build orchestration for the Unified Module System (UMS) v2.0. This guide will help you understand what the SDK does and how to use it effectively.

---

## What is the UMS SDK?

The SDK bridges the gap between UMS domain logic (in `ums-lib`) and real-world file operations. Think of it as the **I/O layer** that:

- Loads TypeScript modules and personas from your file system
- Discovers and organizes modules across directories
- Orchestrates complete build workflows
- Manages configuration files
- Provides convenient high-level APIs for common tasks

### Architecture Overview

```
┌──────────────────────────────────┐
│     Your Application / CLI       │
│  (Uses UMS SDK for workflows)    │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│          UMS SDK                 │
│  • File system operations        │
│  • TypeScript loading            │
│  • Module discovery              │
│  • Build orchestration           │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│         UMS Library              │
│  • Data validation               │
│  • Module registry               │
│  • Markdown rendering            │
└──────────────────────────────────┘
```

**Key Principle**: The SDK handles files and workflows; the library handles data and logic.

---

## Installation

```bash
npm install ums-sdk
```

The SDK requires:
- Node.js 22.0.0 or higher
- TypeScript module loader (tsx) for loading `.module.ts` and `.persona.ts` files

```bash
npm install tsx
```

---

## Quick Start

```typescript
import { buildPersona } from 'ums-sdk';

// Build a persona from a TypeScript file
const result = await buildPersona('./personas/my-persona.persona.ts');

console.log(result.markdown);      // Rendered Markdown output
console.log(result.modules.length); // Number of modules included
console.log(result.buildReport);    // Build metadata
```

---

## Core Capabilities

### 1. Build Personas

The `buildPersona()` function provides a complete workflow for building AI personas:

```typescript
import { buildPersona } from 'ums-sdk';

const result = await buildPersona('./personas/developer.persona.ts', {
  configPath: './modules.config.yml',  // Configuration file
  conflictStrategy: 'warn',            // How to handle duplicate modules
  includeStandard: true,               // Include standard library modules
});

// Access the results
console.log(result.markdown);        // Final Markdown output
console.log(result.persona);         // Loaded persona object
console.log(result.modules);         // Resolved modules in order
console.log(result.buildReport);     // Build metadata with SHA-256 hash
console.log(result.warnings);        // Any warnings generated
```

**What it does:**
1. Loads your persona file
2. Discovers available modules (standard library + local)
3. Resolves module dependencies
4. Validates everything
5. Renders to Markdown
6. Generates a build report

### 2. Validate Modules and Personas

The `validateAll()` function checks all modules and personas for correctness:

```typescript
import { validateAll } from 'ums-sdk';

const report = await validateAll({
  includeStandard: true,   // Validate standard library modules
  includePersonas: true,   // Also validate persona files
});

// Check the results
console.log(`Modules: ${report.validModules}/${report.totalModules}`);
console.log(`Personas: ${report.validPersonas}/${report.totalPersonas}`);

// Handle errors
if (report.errors.size > 0) {
  for (const [id, errors] of report.errors) {
    console.error(`${id}:`, errors);
  }
}
```

### 3. List Available Modules

The `listModules()` function queries your module library:

```typescript
import { listModules } from 'ums-sdk';

// List all modules
const allModules = await listModules();

// Filter by tier
const foundationModules = await listModules({ tier: 'foundation' });

// Filter by capability
const reasoningModules = await listModules({ capability: 'reasoning' });

// Display results
foundationModules.forEach(module => {
  console.log(`${module.id}`);
  console.log(`  Name: ${module.name}`);
  console.log(`  Description: ${module.description}`);
  console.log(`  Capabilities: ${module.capabilities.join(', ')}`);
  console.log(`  Source: ${module.source}`); // 'standard' or 'local'
});
```

---

## Working with Configuration

### Configuration File

Create a `modules.config.yml` file in your project root:

```yaml
# Optional: Set global conflict resolution strategy
conflictStrategy: warn  # 'error' | 'warn' | 'replace'

# Define where to find your modules
localModulePaths:
  - path: ./instruct-modules-v2
  - path: ./custom-modules
```

**Configuration Options:**

- **`conflictStrategy`** (optional, default: `'error'`)
  - `error`: Fail build if duplicate module IDs are found
  - `warn`: Log warning and skip duplicate
  - `replace`: Replace existing module with new one

- **`localModulePaths`** (required)
  - Array of directories containing your `.module.ts` files
  - Paths are relative to the config file location

### Runtime Configuration

You can override config settings at runtime:

```typescript
// Use config file defaults
await buildPersona('./persona.persona.ts');

// Override conflict strategy
await buildPersona('./persona.persona.ts', {
  conflictStrategy: 'replace',
});

// Use different config file
await buildPersona('./persona.persona.ts', {
  configPath: './custom-config.yml',
});
```

---

## Import Patterns

The SDK provides a clean API surface with these import patterns:

### Import SDK Workflows

```typescript
// High-level API functions
import { buildPersona, validateAll, listModules } from 'ums-sdk';
```

### Import Types

```typescript
// Types are re-exported from ums-lib for convenience
import type { Module, Persona, BuildReport } from 'ums-sdk';
```

### Import Domain Functions

```typescript
// For advanced use cases, import domain functions from ums-lib
import { validateModule, renderMarkdown } from 'ums-lib';
```

**Recommended Pattern**: Use the SDK's high-level API (`buildPersona`, etc.) for 99% of use cases. It handles validation, rendering, and orchestration automatically.

---

## Advanced Usage

### Low-Level Loaders

For custom workflows, you can use the SDK's low-level loaders:

#### ModuleLoader

```typescript
import { ModuleLoader } from 'ums-sdk';

const loader = new ModuleLoader();

// Load a single module file
const module = await loader.loadModule(
  '/path/to/module.module.ts',
  'expected-module-id'
);

// Load raw file content (for hashing, etc.)
const content = await loader.loadRawContent('/path/to/module.ts');
```

#### PersonaLoader

```typescript
import { PersonaLoader } from 'ums-sdk';

const loader = new PersonaLoader();

// Load a persona file (supports default or named exports)
const persona = await loader.loadPersona('./persona.persona.ts');

console.log(persona.name);
console.log(persona.modules); // Array of module IDs
```

#### ConfigManager

```typescript
import { ConfigManager } from 'ums-sdk';

const manager = new ConfigManager();

// Load configuration
const config = await manager.load('./modules.config.yml');

// Validate configuration structure
const validation = manager.validate(config);
if (!validation.valid) {
  console.error('Config errors:', validation.errors);
}
```

### Discovery Components

#### ModuleDiscovery

```typescript
import { ModuleDiscovery } from 'ums-sdk';

const discovery = new ModuleDiscovery();

// Discover from specific directories
const modules = await discovery.discoverInPaths([
  './instruct-modules-v2',
  './custom-modules',
]);

// Or use configuration
const config = await configManager.load('./modules.config.yml');
const modules = await discovery.discover(config);
```

#### StandardLibrary

```typescript
import { StandardLibrary, ConfigManager } from 'ums-sdk';

const configManager = new ConfigManager();
const config = await configManager.load('./modules.config.yml');

const standardLib = new StandardLibrary();

// Discover all standard library modules
const modules = await standardLib.discoverStandard();

// Check if a module is from standard library
const isStandard = standardLib.isStandardModule('foundation/ethics/do-no-harm');

// Get standard library path
const path = standardLib.getStandardLibraryPath();
```

---

## Module and Persona Files

### Module Files (`.module.ts`)

Modules are TypeScript files with a specific export convention:

```typescript
import type { Module } from 'ums-sdk';

// Export name is camelCase of module ID
// File: error-handling.module.ts → export const errorHandling
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

**Export Convention:**
- Module ID from file path: `foundation/ethics/do-no-harm.module.ts` → `foundation/ethics/do-no-harm`
- Export name is camelCase: `foundation/ethics/do-no-harm` → `foundationEthicsDoNoHarm`

### Persona Files (`.persona.ts`)

Personas can use default or named exports:

```typescript
import type { Persona } from 'ums-sdk';

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

---

## Error Handling

The SDK provides specific error types for different failure scenarios:

```typescript
import {
  SDKError,
  ModuleNotFoundError,
  InvalidExportError,
  ModuleLoadError,
  ConfigError,
  DiscoveryError,
} from 'ums-sdk';

try {
  const result = await buildPersona('./persona.persona.ts');
} catch (error) {
  if (error instanceof ModuleNotFoundError) {
    console.error('Module file not found:', error.filePath);
  } else if (error instanceof InvalidExportError) {
    console.error('Invalid export:', error.expectedExport);
    console.error('Available exports:', error.availableExports);
  } else if (error instanceof ConfigError) {
    console.error('Configuration error:', error.configPath);
  }
}
```

All SDK errors include:
- Clear error messages
- File paths (when applicable)
- Expected vs. actual values
- Suggestions for fixing

---

## Complete Example

Here's a complete example building a persona and handling results:

```typescript
import { buildPersona } from 'ums-sdk';
import { writeFile } from 'node:fs/promises';

async function buildAndSave() {
  try {
    // Build the persona
    console.log('Building persona...');
    const result = await buildPersona(
      './personas/developer.persona.ts',
      {
        configPath: './modules.config.yml',
        conflictStrategy: 'warn',
        includeStandard: true,
      }
    );

    // Write output to file
    await writeFile('./dist/developer.md', result.markdown);

    // Display build information
    console.log('✅ Build successful!');
    console.log(`Persona: ${result.persona.name} v${result.persona.version}`);
    console.log(`Modules: ${result.modules.length}`);
    console.log(`Build ID: ${result.buildReport.buildId}`);
    console.log(`Output: ./dist/developer.md`);

    // Handle warnings
    if (result.warnings.length > 0) {
      console.warn('\n⚠️  Warnings:');
      result.warnings.forEach(warning => {
        console.warn(`  - ${warning}`);
      });
    }

    return result;
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildAndSave();
```

---

## API Reference Summary

### High-Level API

| Function         | Purpose                          | Returns                     |
| ---------------- | -------------------------------- | --------------------------- |
| `buildPersona()` | Build a persona from file        | `Promise<BuildResult>`      |
| `validateAll()`  | Validate modules and personas    | `Promise<ValidationReport>` |
| `listModules()`  | List available modules           | `Promise<ModuleInfo[]>`     |

### Low-Level Components

| Component         | Purpose                          |
| ----------------- | -------------------------------- |
| `ModuleLoader`    | Load `.module.ts` files          |
| `PersonaLoader`   | Load `.persona.ts` files         |
| `ConfigManager`   | Load and validate configuration  |
| `ModuleDiscovery` | Find modules in directories      |
| `StandardLibrary` | Manage standard library modules  |

### Error Types

| Error Type            | When It's Thrown                     |
| --------------------- | ------------------------------------ |
| `ModuleNotFoundError` | Module file doesn't exist            |
| `InvalidExportError`  | Module export name doesn't match ID  |
| `ModuleLoadError`     | Error loading or parsing module      |
| `ConfigError`         | Invalid configuration file           |
| `DiscoveryError`      | Error discovering modules            |

---

## Environment Variables

- **`INSTRUCTIONS_MODULES_PATH`**: Override standard library location (default: `./instructions-modules`)

---

## Best Practices

### 1. Use the High-Level API

For most use cases, use `buildPersona()`, `validateAll()`, or `listModules()`. These handle all the complexity for you.

```typescript
// ✅ Recommended
import { buildPersona } from 'ums-sdk';
const result = await buildPersona('./persona.persona.ts');

// ❌ Unnecessary complexity
import { ModuleLoader, PersonaLoader, ModuleDiscovery } from 'ums-sdk';
import { validateModule, renderMarkdown } from 'ums-lib';
// ... manually orchestrating everything
```

### 2. Import Types from SDK

Import types from the SDK instead of ums-lib directly:

```typescript
// ✅ Recommended
import type { Module, Persona } from 'ums-sdk';

// ❌ Works but less convenient
import type { Module, Persona } from 'ums-lib';
```

### 3. Configure Conflict Strategy

Set a project-wide default in your config file:

```yaml
# modules.config.yml
conflictStrategy: warn

localModulePaths:
  - path: ./modules
```

### 4. Handle Warnings

Always check for and handle warnings in build results:

```typescript
const result = await buildPersona('./persona.persona.ts');

if (result.warnings.length > 0) {
  result.warnings.forEach(warn => console.warn(warn));
}
```

### 5. Validate Before Building

Run validation during development:

```typescript
// In your test suite or CI pipeline
const report = await validateAll();
if (report.errors.size > 0) {
  throw new Error('Validation failed');
}
```

---

## Performance Considerations

The SDK is designed for good performance:

- **Lazy loading**: Modules are loaded only when needed
- **Parallel discovery**: File system operations run in parallel when safe
- **Caching**: Parsed modules are cached to avoid re-parsing

**Expected performance** (on modern hardware):
- Small projects (<10 modules): <1 second
- Medium projects (10-50 modules): <3 seconds
- Large projects (50-200 modules): <10 seconds

---

## Related Packages

- **ums-lib**: Pure domain logic (validation, rendering, registry)
- **copilot-instructions-cli**: Command-line interface built on the SDK
- **ums-mcp**: MCP server for AI assistant integration

---

## Support and Resources

- [GitHub Repository](https://github.com/synthable/copilot-instructions-cli)
- [UMS v2.0 Specification](../spec/unified_module_system_v2_spec.md)
- [SDK Technical Specification](../spec/ums_sdk_v1_spec.md)
- [Issue Tracker](https://github.com/synthable/copilot-instructions-cli/issues)

---

## License

GPL-3.0-or-later

Copyright (c) 2025 synthable
