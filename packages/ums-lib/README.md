# UMS Library

A reusable library for UMS (Unified Module System) v1.0 operations - parsing, validating, and building modular AI instructions.

## Installation

```bash
npm install ums-lib
```

## Usage

### Basic Example

```typescript
import { BuildEngine, loadModule, loadPersona } from 'ums-lib';

// Load and validate a UMS module
const module = await loadModule('./path/to/module.md');
console.log('Module:', module.meta.name);

// Load and validate a persona
const persona = await loadPersona('./path/to/persona.yml');
console.log('Persona:', persona.name);

// Build instructions from persona
const engine = new BuildEngine();
const result = await engine.build({
  personaSource: './path/to/persona.yml',
  outputTarget: './output.md',
});

console.log('Generated markdown:', result.markdown);
```

### Available Exports

- **Core Classes**:
  - `BuildEngine` - Main build orchestration
  - `ModuleRegistry` - Module discovery and indexing
- **Loader Functions**:
  - `loadModule(filePath)` - Load and validate a UMS module
  - `loadPersona(filePath)` - Load and validate a persona configuration

- **Error Classes**:
  - `UMSError` - Base error class
  - `ModuleLoadError` - Module loading failures
  - `PersonaLoadError` - Persona loading failures
  - `BuildError` - Build process failures
  - `UMSValidationError` - Validation failures

- **Type Definitions**: All UMS v1.0 types are exported

## Features

- ✅ **Zero CLI Dependencies**: Pure library with no CLI bloat
- ✅ **UMS v1.0 Compliant**: Full specification implementation
- ✅ **TypeScript Support**: Complete type definitions
- ✅ **Validation**: Comprehensive module and persona validation
- ✅ **Error Handling**: Detailed error messages and context
- ✅ **Extensible**: Clean API for integration

## License

GPL-3.0-or-later
