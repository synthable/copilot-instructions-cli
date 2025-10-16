# UMS CLI

A CLI tool for composing, managing, and building modular AI assistant instructions using the Unified Module System (UMS) v2.0.

**Package name**: `ums-cli`
**Binary commands**: `copilot-instructions`, `ums`

## Installation

```bash
npm install -g ums-cli
```

## Usage

**Note**: You can use either `copilot-instructions` or `ums` as the command. Both are equivalent.

### Build Instructions

```bash
# Build from persona file
copilot-instructions build --persona ./personas/my-persona.persona.ts
# or: ums build --persona ./personas/my-persona.persona.ts

# Build with custom output
copilot-instructions build --persona ./personas/my-persona.persona.ts --output ./dist/instructions.md
```

### List Modules

```bash
# List all modules
copilot-instructions list

# List modules by tier
copilot-instructions list --tier foundation
copilot-instructions list --tier technology
```

### Search Modules

```bash
# Search all modules
copilot-instructions search "React"

# Search by tier
copilot-instructions search "logic" --tier foundation
```

### Validate

```bash
# Validate all modules and personas in current directory
copilot-instructions validate

# Validate specific file or directory
copilot-instructions validate ./instructions-modules
copilot-instructions validate ./personas/my-persona.persona.yml

# Verbose validation output
copilot-instructions validate --verbose
```

## Features

- ✅ **UMS v2.0 Support**: Full UMS specification compliance with TypeScript-first module format
- ✅ **Persona Building**: Convert persona configs to instruction markdown
- ✅ **Module Management**: List, search, and validate UMS modules
- ✅ **Rich Output**: Progress indicators, colored output, and detailed reporting
- ✅ **Flexible Input**: File-based or stdin input support
- ✅ **Build Reports**: Detailed JSON reports with metadata

## Project Structure

The CLI expects this directory structure:

```
your-project/
├── instructions-modules/          # UMS modules organized by tier
│   ├── foundation/
│   ├── principle/
│   ├── technology/
│   └── execution/
└── personas/                      # Persona configuration files
    └── my-persona.persona.yml
```

## Dependencies

This CLI uses the `ums-lib` library for all UMS operations, ensuring consistency and reusability.

## License

GPL-3.0-or-later
