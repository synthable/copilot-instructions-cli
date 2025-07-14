# Usage Guide

## Workflows

### Project-Local Workflow (Default)

- The `instructions-modules` directory is inside the project.
- Recommended for collaborative, version-controlled development.

### Centralized (Global) Workflow

- Maintain a master modules directory (e.g., `~/.instructions-modules`).
- Reference it from multiple projects using the `--modules-path` CLI option or the `modulesPath` property in a persona file.

### Configuration Precedence

1. CLI option (`--modules-path`)
2. Persona file setting (`modulesPath`)
3. Default (`./instructions-modules`)

---

## Command-Line Interface (CLI)

### Global Option

- `--modules-path <path>`: Specify the path to the modules directory.

---

### Commands

#### `build <personaFile>`

Builds a persona instruction file from a `.persona.json` or `.persona.jsonc` configuration.

**Usage:**

```bash
copilot-instructions build ./personas/my-persona.persona.jsonc
```

**Arguments:**

- `<personaFile>`: Path to the persona configuration file.

---

#### `list`

Lists all available instruction modules.

**Options:**

- `-t, --tier <name>`: Filter by tier (`foundation`, `principle`, `technology`, `execution`).

**Examples:**

```bash
copilot-instructions list
copilot-instructions list --tier foundation
```

---

#### `search <query>`

Searches for modules by name or description.

**Arguments:**

- `<query>`: The text to search for.

**Options:**

- `-t, --tier <name>`: Restrict the search to a specific tier (`foundation`, `principle`, `technology`, `execution`).

**Examples:**

```bash
copilot-instructions search "logic"
copilot-instructions search "reasoning" --tier foundation
```

---

#### `validate [path]`

Validates all modules and persona files, or a specific file/directory.

**Arguments:**

- `[path]`: Optional path to a specific file or directory.

**Examples:**

```bash
copilot-instructions validate
copilot-instructions validate ./modules/my-module.md
copilot-instructions validate ./personas/my-persona.persona.jsonc
```

---

#### `create-module <tier> <subject> <name> [description]`

Creates a new instruction module file.

**Arguments:**

- `<tier>`: The tier for the new module (`foundation`, `principle`, `technology`, `execution`).
- `<subject>`: The subject path within the tier (e.g., `logic/reasoning`).
- `<name>`: The name for the new module.
- `[description]`: A short description for the module.

**Options:**

- `-l, --layer <number>`: The layer for foundation modules (0-5).

---

#### `create-persona <name> [description]`

Creates a new persona configuration file.

**Arguments:**

- `<name>`: The name for the new persona.
- `[description]`: A short description for the persona.

**Options:**

- `--no-attributions`: Do not include attributions in the persona file.
- `-p, --persona-output <path>`: The path where the persona file will be saved.
- `-b, --build-output <file>`: The file name for the generated persona markdown.
- `-t, --template <name>`: The name of a template file from `./templates/persona` to use as a base.

**Examples:**

```bash
copilot-instructions create-persona "My New Persona"
copilot-instructions create-persona "My New Persona" "A description of my persona."
copilot-instructions create-persona "My New Persona" --persona-output ./personas/my-new-persona.persona.jsonc --build-output ./dist/my-new-persona.md
copilot-instructions create-persona "My New Persona" --no-attributions
copilot-instructions create-persona "My New Persona" --template code-critic
```

---

## Best Practices

- Keep modules focused and well-documented.
- Regularly validate modules and personas after changes.
- Use persona files to capture and share custom instruction sets.
- Leverage the four-tier system for logical, maintainable builds.
