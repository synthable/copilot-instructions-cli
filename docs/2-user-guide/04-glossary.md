# 📖 Glossary of Terms

This document provides definitions for the core concepts and terminology used in the AI Persona Builder ecosystem.

---

### C

- **CLI (Command-Line Interface)**
  - The primary tool for interacting with the AI Persona Builder system. It provides commands for building personas, managing modules, and validating configurations.

### E

- **Execution Tier**
  - The fourth and final tier in the module hierarchy. Contains imperative, step-by-step playbooks for performing a specific, concrete action. See also: [Tier](#tier).

### F

- **Foundation Tier**
  - The first and most abstract tier in the module hierarchy. Contains the universal, timeless rules of reasoning, logic, and ethics. See also: [Tier](#tier), [Layer](#layer).

### L

- **Layer**
  - A numerical property (0-4) specific to `Foundation` modules that defines their position in the cognitive hierarchy. It enables validation of the logical flow, ensuring bedrock concepts are processed before dependent ones.

### M

- **Module**
  - The atomic unit of instruction in the ecosystem. A single Markdown file (`.md`) that represents one, and only one, self-contained concept. It consists of YAML frontmatter for metadata and Markdown content for the AI instructions.

### P

- **Persona**
  - A specialized, task-oriented AI agent created by combining a set of modular instructions. The goal is to build a complete cognitive architecture that defines how an AI thinks and behaves.

- **Persona File**
  - The `persona.jsonc` file that acts as the "recipe" for building a persona. It specifies which modules to include, in what order, and how the final output should be formatted.

- **Principle Tier**
  - The second tier in the module hierarchy. Contains technology-agnostic best practices, methodologies, and professional standards (e.g., SOLID principles, TDD). See also: [Tier](#tier).

### S

- **Schema**
  - A formal declaration in a module's frontmatter that defines the purpose and required structure of its Markdown content. The six schemas are `procedure`, `specification`, `pattern`, `checklist`, `data`, and `rule`.

### T

- **Technology Tier**
  - The third tier in the module hierarchy. Contains specific, factual knowledge about a named tool, language, or platform (e.g., React, Python, AWS). See also: [Tier](#tier).

- **Tier**
  - The primary organizational structure for modules, representing a level of abstraction. The strict compilation order is `Foundation` -> `Principle` -> `Technology` -> `Execution`.
