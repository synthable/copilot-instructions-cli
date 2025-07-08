# Module System

## Core Concepts

### Module

- **Definition:** The atomic unit of AI instruction—a single Markdown file with focused guidance and YAML frontmatter for metadata (`name`, `description`).
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

## System Relationships Diagram

```mermaid
graph TD
  A[Markdown Module<br>(.md with YAML)] --> B[Module Index<br>(JSON)]
  B --> C[Persona File<br>(.persona.json)]
  C --> D[Compiled Output]
  A --> D
```

## Data Structures

The core data structures are defined in `src/types/index.ts` and are essential for understanding how the system works.

```typescript
// src/types/index.ts

/**
 * The four tiers of the modular architecture, representing different levels
 * of abstraction and compilation priority.
 */
export type ModuleTier =
  | 'foundation'
  | 'principle'
  | 'technology'
  | 'execution';

/**
 * Metadata structure for module frontmatter (YAML)
 */
export interface ModuleMetadata {
  tier: ModuleTier;
  name: string;
  subject: string;
  description: string;
  tags?: string[];
  dependencies?: string[];
  conflicts?: string[];
}

/**
 * Lightweight module representation used in the module index
 */
export interface IndexedModule {
  id: string;
  path: string;
  tier: ModuleTier;
  subject: string;
  metadata: ModuleMetadata;
}

/**
 * Complete module data structure including content
 */
export interface Module {
  id: string;
  path: string;
  metadata: ModuleMetadata;
  content: string;
}

/**
 * Persona file structure defining instruction composition requirements
 */
export interface PersonaFile {
  name: string;
  description?: string;
  output: {
    file: string;
    format?: {
      includeAttribution?: boolean;
      header?: string;
      footer?: string;
    };
  };
  modules: string[];
  optional_modules?: string[];
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
  "name": "Secure React Developer",
  "description": "A persona for a React developer focused on security.",
  "output": {
    "file": "secure-react-developer.md"
  },
  "modules": [
    "principle/security/1-owasp-top-10.md",
    "technology/framework/react/1-hooks-rules.md"
  ]
}
```
