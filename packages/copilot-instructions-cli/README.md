# Copilot Instructions CLI

A CLI tool for composing, managing, and building modular AI assistant instructions using UMS v1.0.

## Installation

```bash
npm install -g copilot-instructions-cli
```

## Usage

### Build Instructions

```bash
# Build from persona file
copilot-instructions build --persona ./personas/my-persona.persona.yml

# Build with custom output
copilot-instructions build --persona ./personas/my-persona.persona.yml --output ./dist/instructions.md

# Build from stdin
cat persona.yml | copilot-instructions build --output ./dist/instructions.md
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

- ✅ **UMS v1.0 Support**: Full UMS specification compliance
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
