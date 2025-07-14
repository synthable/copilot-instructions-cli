# Quick Start Guide

Get up and running with Copilot Instructions Builder in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/copilot-instructions-builder.git
cd copilot-instructions-builder

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (optional)
npm link
```

## Creating Your First Module

You can create a module manually or use the CLI:

### Manual Creation

Create `instructions-modules/principle/code-quality/clean-code.md`:

```markdown
---
name: 'Clean Code Principles'
description: 'Fundamental principles for writing clean, maintainable code'
tags: ['quality', 'best-practices']
---

# Clean Code Principles

- Write code that clearly expresses intent
- Use meaningful variable and function names
- Keep functions small and focused
- Follow the DRY principle
```

### Using the CLI

```bash
copilot-instructions create-module principle code-quality "Clean Code Principles" "Fundamental principles for writing clean, maintainable code"
```

Options:

- `-l, --layer <number>`: Specify layer for foundation modules (0-5).

## Creating a Persona

You can create a persona manually or use the CLI:

### Manual Creation

Create `personas/quality-focused-developer.persona.jsonc`:

```json
{
  "name": "Quality-Focused Developer",
  "description": "A developer who prioritizes code quality",
  "output": ".github/copilot-instructions.md",
  "modules": ["foundation/reasoning/*", "principle/code-quality/*"]
}
```

### Using the CLI

```bash
copilot-instructions create-persona "Quality-Focused Developer" "A developer who prioritizes code quality"
```

Options:

- `--no-attributions`: Exclude attributions in the persona file.
- `-p, --persona-output <path>`: Output path for persona file.
- `-b, --build-output <file>`: Output file for generated markdown.
- `-t, --template <name>`: Use a template from `./templates/persona`.

## Building Instructions

```bash
copilot-instructions build personas/quality-focused-developer.persona.jsonc
```

## CLI Reference

### build

Builds a persona instruction file from a `.persona.json` configuration.

```bash
copilot-instructions build <personaFile>
```

- `<personaFile>`: Path to the persona configuration file.

### list

Lists all available instruction modules.

```bash
copilot-instructions list
copilot-instructions list --tier foundation
```

Options:

- `-t, --tier <name>`: Filter by tier (`foundation`, `principle`, `technology`, `execution`).

### search

Searches for modules by name or description.

```bash
copilot-instructions search "logic"
copilot-instructions search "reasoning" --tier foundation
```

Options:

- `-t, --tier <name>`: Restrict search to a specific tier.

### validate

Validates all modules and persona files, or a specific file/directory.

```bash
copilot-instructions validate
copilot-instructions validate ./modules/my-module.md
copilot-instructions validate ./personas/my-persona.persona.jsonc
```

### create-module

Creates a new instruction module file.

```bash
copilot-instructions create-module <tier> <subject> <name> [description]
```

Options:

- `-l, --layer <number>`: Layer for foundation modules (0-5).

### create-persona

Creates a new persona configuration file.

```bash
copilot-instructions create-persona <name> [description] [options]
```

Options:

- `--no-attributions`
- `-p, --persona-output <path>`
- `-b, --build-output <file>`
- `-t, --template <name>`

## Advanced Usage

- **Filtering:** Use `--tier` to filter modules in `list` and `search`.
- **Templates:** Use `--template` in `create-persona` to base your persona on a template from `./templates/persona`.
- **Validation:** Use `validate` to check modules and personas for errors before building.

## Next Steps

- Read the [Module System](./module-system.md) documentation
- Explore the [Usage Guide](./usage.md) for advanced features
- Check out [example modules](../examples/) for inspiration
