# UMS SDK (`ums-sdk`)

[![License](https://img.shields.io/npm/l/ums-sdk.svg)](https://github.com/synthable/copilot-instructions-cli/blob/main/LICENSE)

Node.js SDK for UMS (Unified Module System) v2.0 - provides file system operations, TypeScript module loading, and high-level orchestration for building UMS personas.

## Overview

The UMS SDK bridges the gap between the pure domain logic of `ums-lib` and platform-specific implementations. It handles:

- **File System I/O**: Loading `.module.ts` and `.persona.ts` files
- **TypeScript Execution**: Dynamic TypeScript module loading via `tsx`
- **Module Discovery**: Finding modules across configured directories
- **Configuration Management**: Parsing `modules.config.yml`
- **High-Level Workflows**: One-function build, validate, and list operations

## Architecture

```
┌────────────────────────────┐
│        ums-lib             │  Pure domain logic
│  (validation, rendering)   │
└────────────────────────────┘
            ↑
            │ uses
            │
┌────────────────────────────┐
│        ums-sdk             │  Application logic (this package)
│  (I/O, orchestration)      │
└────────────────────────────┘
            ↑
            │ uses
            │
┌────────────────────────────┐
│    CLI / Tools             │  Presentation
└────────────────────────────┘
```

## Installation

```bash
npm install ums-sdk
```

## Quick Start

### Build a Persona

```typescript
import { buildPersona } from 'ums-sdk';

const result = await buildPersona('./my-persona.persona.ts');

console.log(result.markdown);
// Save to file, etc.
```

### Validate All Modules

```typescript
import { validateAll } from 'ums-sdk';

const report = await validateAll();

console.log(`Valid: ${report.validModules}/${report.totalModules}`);
```

### List Available Modules

```typescript
import { listModules } from 'ums-sdk';

const modules = await listModules({ tier: 'foundation' });

for (const mod of modules) {
  console.log(`${mod.id}: ${mod.description}`);
}
```

## API Reference

### High-Level API

#### `buildPersona(personaPath, options?)`

Complete build workflow - load, validate, resolve, and render a persona.

**Parameters:**

- `personaPath` (string): Path to `.persona.ts` file
- `options` (optional):
  - `configPath`: Path to `modules.config.yml`
  - `conflictStrategy`: `'error' | 'warn' | 'replace'`
  - `attribution`: Include module attribution in output
  - `includeStandard`: Include standard library modules

**Returns:** `Promise<BuildResult>`

#### `validateAll(options?)`

Validate all discovered modules and personas.

**Returns:** `Promise<ValidationReport>`

#### `listModules(options?)`

List all available modules with metadata.

**Returns:** `Promise<ModuleInfo[]>`

### Low-Level Components

For custom workflows, use the low-level components:

```typescript
import {
  ModuleLoader,
  PersonaLoader,
  ConfigManager,
  ModuleDiscovery,
} from 'ums-sdk';

// Custom workflow
const loader = new ModuleLoader();
const module = await loader.loadModule('./path/to/module.ts', 'module-id');
```

## Configuration

Create a `modules.config.yml` in your project root:

```yaml
localModulePaths:
  - path: './my-modules'
    onConflict: 'error'
  - path: './overrides'
    onConflict: 'replace'
```

## Error Handling

The SDK provides detailed error types:

```typescript
import { ModuleLoadError, InvalidExportError } from 'ums-sdk';

try {
  const result = await buildPersona('./persona.ts');
} catch (error) {
  if (error instanceof ModuleLoadError) {
    console.error(`Failed to load: ${error.filePath}`);
  } else if (error instanceof InvalidExportError) {
    console.error(`Invalid export: expected ${error.expectedExport}`);
  }
}
```

## Requirements

- Node.js 22.0.0+
- TypeScript 5.0.0+ (peer dependency)
- `ums-lib` 2.0.0+

## Documentation

- [UMS SDK Specification](../../docs/spec/ums_sdk_v1_spec.md)
- [UMS v2.0 Specification](../../docs/spec/unified_module_system_v2_spec.md)

## License

[GPL-3.0-or-later](https://github.com/synthable/copilot-instructions-cli/blob/main/LICENSE)
