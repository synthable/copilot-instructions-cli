# AI Persona Builder CLI

A command-line interface (CLI) for building and managing AI persona instructions from modular files.

## Installation

```bash
npm install -g copilot-instructions
```

## Usage

### `build <personaFile>`

Builds a persona instruction file from a `.persona.jsonc` configuration.

**Arguments:**

- `personaFile`: (Required) The path to the `*.persona.jsonc` configuration file.

**Example:**

```bash
copilot-instructions build ./personas/my-persona.jsonc
```

### `list`

Lists all available instruction modules.

**Options:**

- `-t, --tier <name>`: Filter the list by a specific tier (e.g., `foundation`, `principle`, `technology`, `execution`).

**Example:**

```bash
copilot-instructions list --tier=foundation
```

### `search <query>`

Searches for modules by name or description.

**Arguments:**

- `query`: (Required) The text to search for.

**Options:**

- `-t, --tier <name>`: Restrict the search to a specific tier.

**Example:**

```bash
copilot-instructions search "React"
```

## Persona File Format

A `*.persona.jsonc` file is a JSONC file that defines the composition of an AI persona.

**Schema:**

- `name` (string, required): A descriptive name for the persona.
- `description` (string, optional): A brief description of the persona.
- `output` (string, optional): The output path for the built persona file. Defaults to the persona file's name with an `.md` extension.
- `attributions` (boolean, optional): Whether to include attribution comments for each module. Defaults to `false`.
- `modules` (array of strings, required): An ordered list of module IDs to include.

**Example:**

```json
{
  "name": "React TDD Developer",
  "description": "An AI assistant for developing React components using Test-Driven Development.",
  "output": "dist/react-tdd-developer.md",
  "attributions": true,
  "modules": [
    "foundation/logic/first-principles-thinking",
    "principle/methodology/test-driven-development",
    "technology/framework/react/rules-of-hooks",
    "execution/playbook/write-unit-tests"
  ]
}
```

## Module System

The module system is based on a four-tier hierarchy of directories within the `instructions-modules` directory.

- **Tier:** The top-level directory (e.g., `foundation`, `principle`, `technology`, `execution`).
- **Subject:** Subdirectories that further categorize the modules.
- **Module File:** A Markdown file with YAML frontmatter.

**Module Frontmatter:**

- `name` (string, required): A human-readable name for the module.
- `description` (string, required): A brief description of the module.
