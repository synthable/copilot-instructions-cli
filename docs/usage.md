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

### Commands

#### `index`
- **Purpose:** Scan the module directory and create/update the index file.
- **Usage:**  
  - `cli index`
  - `cli index --modules-path ~/.instructions-modules`
- **Note:** Run this whenever modules are added, removed, or their frontmatter changes.

#### `list`
- **Purpose:** Display available modules from the index.
- **Usage:**  
  - `cli list`
  - `cli list --foundation`
  - `cli list --foundation --technology`
- **Options:** `--foundation`, `--principle`, `--technology`, `--execution`

#### `search <query>`
- **Purpose:** Search modules from the index.
- **Usage:**  
  - `cli search "hooks"`
  - `cli search --technology "hooks"`
- **Options:** `--foundation`, `--principle`, `--technology`, `--execution`

#### `build [personaFile]`
- **Purpose:** Compile instructions into a final output file.
- **Usage:**  
  - `cli build ./personas/my-persona.json`
  - `cli --output "temp.md" --foundation "reasoning/*"`
- **Options:**  
  - `--output <path>`
  - `--foundation <modules...>`
  - `--principle <modules...>`
  - `--technology <modules...>`
  - `--execution <modules...>`

---

## Practical Example

**Build a persona:**
```bash
cli build ./personas/secure-react-developer.persona.json
```

**List all technology modules:**
```bash
cli list --technology
```

**Search for modules about "hooks":**
```bash
cli search --technology "hooks"
```

---

## Best Practices

- Keep modules focused and well-documented.
- Regularly update the module index after changes.
- Use persona files to capture and share custom instruction sets.
- Leverage the four-tier system for logical, maintainable builds.