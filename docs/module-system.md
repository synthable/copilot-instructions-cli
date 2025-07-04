# Module System

## Core Concepts

### Module
- **Definition:** The atomic unit of instruction—a single Markdown file with focused guidance and YAML frontmatter for metadata (`name`, `description`).
- **Purpose:** Enables modular, reusable, and maintainable instruction sets.

### Tier
- **Definition:** The module's high-level scope and its compilation priority, determined by its top-level directory.
- **Tiers:** `foundation`, `principle`, `technology`, `execution`.

### Subject
- **Definition:** The module's specific topic, represented by a directory path within a tier (max depth: two directories).
- **Purpose:** Organizes modules for clarity and discoverability.

### Persona File
- **Definition:** A self-contained JSON file (`*.persona.json`) defining a single build, specifying the output file and required modules.
- **Purpose:** Allows users to define and share custom AI personas.

### Module Path
- **Definition:** The root directory for modules (default: `./instructions-modules`).
- **Customization:** Can be overridden via CLI or persona file.

### Module Index
- **Definition:** A pre-compiled JSON cache of all module metadata (`instructions-modules.index.json`).
- **Purpose:** Accelerates `list` and `search` commands.

---

## Data Structures

```typescript
// src/types/index.ts
export type ModuleTier = 'foundation' | 'principle' | 'technology' | 'execution';

export interface ModuleMetadata { name: string; description: string; }

export interface IndexedModule {
  path: string; tier: ModuleTier; subject: string; metadata: ModuleMetadata;
}

export interface Module extends IndexedModule { content: string; }

export interface PersonaFile {
  output: string;
  modulesPath?: string;
  foundation?: string[];
  principle?: string[];
  technology?: string[];
  execution?: string[];
}
```

---

## Relationships

- **Modules** are grouped by **tier** and **subject** within the modules directory.
- **Persona files** reference specific modules from each tier to build a persona.
- The **module index** provides fast lookup and search capabilities for all modules.

---

## Example

**Module file:**  
`instructions-modules/principle/security/1-owasp-top-10.md`
```markdown
---
name: OWASP Top 10
description: Key security risks every developer should know.
---
# OWASP Top 10
...
```

**Persona file:**  
`personas/secure-react-developer.persona.json`
```json
{
  "output": "secure-react-developer.md",
  "principle": ["security/1-owasp-top-10.md"],
  "technology": ["framework/react/1-hooks-rules.md"]
}