# Project Overview: AI Persona Builder CLI

- [Project Overview: AI Persona Builder CLI](#project-overview-ai-persona-builder-cli)
  - [1. Introduction](#1-introduction)
  - [2. Core Concepts](#2-core-concepts)
  - [3. Technology Stack](#3-technology-stack)
  - [4. The Four-Tier Module System](#4-the-four-tier-module-system)
  - [5. Persona File Format](#5-persona-file-format)
  - [6. Command-Line Interface (CLI)](#6-command-line-interface-cli)
  - [7. Directory \& File Structure](#7-directory--file-structure)
  - [8. Best Practices](#8-best-practices)
  - [9. Further Reading](#9-further-reading)

## 1. Introduction

This document provides a high-level overview of the `copilot-instructions` command-line interface (CLI) tool. The purpose of this project is to provide a powerful and flexible system for building custom AI instruction sets from a library of reusable, modular components.

The tool enables developers to define, manage, and combine granular "instruction modules" into a cohesive "persona" that can be used to guide the behavior of an AI assistant.

## 2. Core Concepts

The system is built around two primary concepts:

- **Instruction Modules (`*.md`):** Individual Markdown files, each representing a single, atomic concept (e.g., a reasoning technique, coding standard, or playbook). Each module contains YAML frontmatter for metadata (`name`, `description`, and optionally `layer` for Foundation modules) and a Markdown body for instructions. Modules are organized into a four-tier hierarchy: `foundation`, `principle`, `technology`, and `execution`.
- **Persona Files (`*.persona.jsonc`):** A persona is a blueprint that defines a specific AI assistant. It is a JSONC file that lists which instruction modules to include, in what order, and how to format the final output. This allows for the creation of specialized assistants (e.g., "React TDD Developer," "Creative Architect") by combining different modules.

## 3. Technology Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **CLI Framework:** `commander.js`
- **Console Styling:** `chalk` and `ora`
- **Frontmatter Parsing:** `gray-matter`
- **JSONC Parsing:** `jsonc-parser`

## 4. The Four-Tier Module System

Modules are organized in a strict four-tier hierarchy, each representing a different level of abstraction:

1. **Foundation**: Universal truths and cognitive architecture (e.g., logic, reasoning, ethics).
2. **Principle**: Technology-agnostic best practices and methodologies (e.g., SOLID principles, TDD).
3. **Technology**: Specific knowledge about tools, languages, or platforms (e.g., React, Python, AWS).
4. **Execution**: Imperative, step-by-step playbooks for concrete actions (e.g., create API endpoint, refactor component).

Modules are stored in the `instructions-modules/` directory, organized by tier and subject.

## 5. Persona File Format

A persona file (`*.persona.jsonc`) defines the composition of an AI persona.

**Schema:**

- `name` (string, required): Descriptive name for the persona.
- `description` (string, optional): Brief description.
- `output` (string, optional): Output path for the built persona file.
- `attributions` (boolean, optional): Whether to include attribution comments for each module.
- `modules` (array of strings, required): Ordered list of module IDs to include.

**Example:**

```jsonc
{
  "name": "React TDD Developer",
  "description": "An AI assistant for developing React components using Test-Driven Development.",
  "output": "dist/react-tdd-developer.md",
  "attributions": true,
  "modules": [
    "foundation/logic/first-principles-thinking",
    "principle/methodology/test-driven-development",
    "technology/framework/react/rules-of-hooks",
    "execution/playbook/write-unit-tests",
  ],
}
```

## 6. Command-Line Interface (CLI)

The CLI provides commands for managing and building personas:

- `build <personaFile>`: Compiles a persona file into a single, consolidated instruction file. Resolves specified modules, assembles their content in order, and writes the result to an output file.
- `list`: Displays all available instruction modules, filterable by tier.
- `search <query>`: Searches for modules by name or description.
- `validate [path]`: Validates all modules and persona files, or a specific file/directory.
- `create-module <tier> <subject> <name> [description]`: Creates a new instruction module file.
- `create-persona <name> [description]`: Creates a new persona configuration file.

## 7. Directory & File Structure

```
copilot-instructions-builder/
├── personas/
│   └── secure-react-developer.persona.jsonc
│
├── instructions-modules/
│   ├── foundation/
│   │   └── reasoning/
│   │       └── first-principles-thinking.md
│   ├── principle/
│   │   └── quality/
│   │       └── solid-principles.md
│   ├── technology/
│   │   └── framework/
│   │       └── react/
│   │           └── rules-of-hooks.md
│   └── execution/
│       └── playbook/
│           └── create-api-endpoint.md
└── package.json
```

## 8. Best Practices

- Keep modules focused, atomic, and well-documented.
- Use machine-centric, imperative language in modules.
- Regularly validate modules and personas after changes.
- Leverage the four-tier system for logical, maintainable builds.
- Use persona templates for quick onboarding and best-practice structure.

## 9. Further Reading

- [Module System Design & Philosophy](./module_system.md)
- [Module Authoring Guide](./module_authoring_guide.md)
- [Architecture Overview](./architecture.md)
- [Quick Start Guide](./quickstart.md)
- [Templates](./templates.md)
- [Usage Guide](./usage.md)
- [Examples](./examples.md)
