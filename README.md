# Copilot Instructions CLI

[![NPM Version](https://img.shields.io/npm/v/instructions-composer-cli.svg)](https://www.npmjs.com/package/instructions-composer-cli)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Node.js Version](https://img.shields.io/badge/node-v22.17.1-blue.svg)](https://nodejs.org/en/)

The Copilot Instructions CLI is a powerful command-line interface (CLI) designed to revolutionize how developers create and manage instructions for AI assistants. It shifts from monolithic, hard-to-maintain prompt files to a modular, reusable, and powerful ecosystem.

## Table of Contents

- [Copilot Instructions CLI](#copilot-instructions-cli)
  - [Table of Contents](#table-of-contents)
  - [🚀 Introduction \& Philosophy](#-introduction--philosophy)
    - [What Problem Does It Solve?](#what-problem-does-it-solve)
    - [How Does It Solve This?](#how-does-it-solve-this)
    - [Who Would Use It?](#who-would-use-it)
    - [Why Would They Use It?](#why-would-they-use-it)
  - [Core Concepts](#core-concepts)
    - [Modules](#modules)
    - [Personas](#personas)
  - [Features](#features)
  - [Project Structure](#project-structure)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [CLI Commands](#cli-commands)
  - [Development](#development)
  - [Contributing](#contributing)
  - [License](#license)

## 🚀 Introduction & Philosophy

The Copilot Instructions CLI is a powerful command-line interface (CLI) designed to revolutionize how developers create and manage instructions for AI assistants. It shifts from monolithic, hard-to-maintain prompt files to a modular, reusable, and powerful ecosystem.

Our core philosophy is that a persona is a **cognitive architecture** for an AI. By carefully layering modules, you define not just _what_ the AI should do, but _how it should think_.

- **Modular:** Build complex instruction sets from small, reusable parts.
- **Version-Controlled:** Manage your prompts with the power of Git.
- **Collaborative:** Share and reuse modules across projects and teams.
- **Reliable:** Create deterministic, predictable AI behavior.
- **Composable:** Combine modules to create sophisticated personas that can handle complex tasks.
- **Extensible:** Add custom modules and personas to fit your specific needs.
- **Declarative:** Use a simple, structured format to define your AI's capabilities.

### What Problem Does It Solve?

Modern AI is incredibly powerful, but instructing it is often a chaotic and frustrating process. Developers and teams who rely on AI assistants face a critical set of problems:

- **Inconsistency:** The same prompt can yield wildly different results, making the AI feel more like an unpredictable oracle than a reliable tool.
- **Maintenance Nightmare:** Prompts quickly become monolithic, thousand-line text files that are brittle, impossible to debug, and terrifying to modify.
- **Lack of Reusability:** Expert knowledge and effective instructions are trapped inside these giant prompts, leading to endless copy-pasting and duplicated effort.
- **No Collaboration:** There is no effective way for a team to collaboratively build, manage, and version-control a shared set of AI instructions.

In short, prompt engineering today feels more like an arcane art than a disciplined engineering practice. **The Copilot Instructions CLI solves this by treating AI instructions with the same rigor and structure as we treat source code.**

### How Does It Solve This?

The Copilot Instructions CLI deconstructs the monolithic prompt into a modular, version-controlled ecosystem. It provides a complete methodology and a command-line interface (CLI) to build powerful, specialized AI agents called "Personas."

This is achieved through a set of core architectural principles:

1.  **Atomic Modules:** The system is built on **Modules**—small, single-purpose Markdown files that represent one atomic concept (e.g., a reasoning skill, a coding standard, a security principle). This makes instructions reusable, testable, and easy to maintain.
2.  **The 4-Tier System:** We enforce a strict **"waterfall of abstraction"** during compilation. Modules are organized into four tiers (`Foundation`, `Principle`, `Technology`, `Execution`), ensuring the AI's reasoning is built on a logical and predictable foundation, moving from universal truths down to specific actions.
3.  **Structured Schemas:** Every module adheres to a specific **Schema** (`procedure`, `specification`, `pattern`, etc.). This provides a machine-readable "API" for the AI's thought process, transforming vague requests into deterministic, structured instructions.
4.  **The Persona File:** A simple `persona.jsonc` file acts as a "recipe" or a `package.json` for your AI. It declaratively lists the modules to include, allowing you to compose, version, and share complex AI personalities with ease.

By combining these elements, the system assembles a final, optimized prompt that is not just a list of instructions, but a complete **cognitive architecture** for the AI.

### Who Would Use It?

This system is designed for anyone who wants to move beyond simple AI conversations and build reliable, professional-grade AI agents.

- **Software Development Teams:** To create a consistent "team copilot" that enforces shared coding standards, follows the team's architectural patterns, and writes code in a uniform style, regardless of which developer is prompting it.
- **Senior Engineers & Architects:** To codify their expert knowledge and design principles into reusable modules, allowing them to scale their expertise across the entire organization.
- **AI Power Users & Prompt Engineers:** To build and manage highly complex, multi-layered instruction sets that are simply not feasible with single-file prompts.
- **AI Safety & Governance Teams:** To create "Auditor" personas with a provably consistent set of ethical rules and logical frameworks, enabling them to build AI agents that are aligned, predictable, and safe.

### Why Would They Use It?

The ultimate goal of the Copilot Instructions CLI is to give you **control and reliability**. Instead of wrestling with an unpredictable AI, you can finally start engineering it.

Users choose this system to:

- **Achieve Consistent, High-Quality Results:** Stop gambling on your AI's output. The structured, machine-centric approach dramatically reduces randomness and produces reliable, deterministic behavior.
- **Build a Reusable Knowledge Base:** Stop writing the same instructions over and over. Create a module once and reuse it across dozens of personas and projects.
- **Codify and Scale Expertise:** Capture the "secret sauce" of your best engineers in a library of modules that can elevate the entire team's performance.
- **Collaborate Effectively:** Manage your AI's instruction set as a shared, version-controlled codebase. Use pull requests to propose changes and build a collective "AI brain" for your team.
- **Maintain and Evolve with Ease:** When a standard changes, simply update a single module, and every persona that uses it is instantly updated. This is maintainability for the AI era.

The Copilot Instructions CLI is for those who believe that the power of AI should be harnessed with the discipline of engineering.

## Core Concepts

> [!TIP]
> To dive deeper into the project's vision, read the [**Core Concepts**](./docs/2-user-guide/01-core-concepts.md) documentation.

### Modules

Modules are the building blocks of your AI's knowledge and skills. They are individual Markdown files containing specific instructions, principles, or data. Each module is a self-contained unit of knowledge that can be mixed and matched to create different AI personas.

Modules are organized into a four-tier hierarchy:

- **`foundation`**: The universal, abstract truths of logic, reason, ethics, and problem-solving.
- **`principle`**: Established, technology-agnostic best practices and methodologies.
- **`technology`**: Specific, factual knowledge about a named tool, language, or platform.
- **`execution`**: Imperative, step-by-step playbooks for performing a specific, concrete action.

> [!TIP]
> Learn how to create your own modules in the [**Module Authoring Guide**](./docs/3-authoring/01-module-authoring-guide.md).

### Personas

A persona is a collection of modules that define the behavior and capabilities of an AI assistant. Personas are defined in `.persona.jsonc` files, which specify the modules to include, the output file for the generated instructions, and other configuration options.

> [!TIP]
> Get started quickly by using pre-built [**Persona Templates**](./docs/1-getting-started/02-persona-templates.md).

## Features

- **Modular Architecture**: Build complex AI personas by combining reusable instruction modules.
- **Tiered Organization**: Modules are organized into a four-tier hierarchy for logical instruction composition.
- **Easy Scaffolding**: Quickly create new modules and persona configurations with interactive CLI commands.
- **Validation**: Ensure the integrity of your modules and personas with built-in validation.
- **Customizable Output**: Configure the output path and attribution settings for your built persona files.

## Project Structure

```
.
├── instructions-modules/
│   ├── foundation/
│   ├── principle/
│   ├── technology/
│   └── execution/
├── personas/
│   └── my-persona.persona.jsonc
├── dist/
│   └── my-persona.md
└── ...
```

- **`instructions-modules/`**: Contains the instruction modules, organized by tier.
- **`personas/`**: Contains the persona configuration files.
- **`dist/`**: The default output directory for built persona files.

> [!TIP]
> For a detailed explanation of the codebase, see the [**Project Architecture**](./docs/4-contributing/02-project-architecture.md) document.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 22.17.1 or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)

## Installation

```bash
npm install -g copilot-instructions-cli
```

> [!TIP]
> For a more detailed installation guide, see the [**Quick Start Guide**](./docs/1-getting-started/01-quickstart.md).

## CLI Commands

The CLI provides a set of commands for managing your modules and personas.

- `build`: Builds a persona instruction file from a configuration.
- `list`: Lists all available instruction modules.
- `search`: Searches for modules by name or description.
- `create-module`: Creates a new instruction module.
- `create-persona`: Creates a new persona configuration file.
- `validate`: Validates all modules and persona files.

> [!TIP]
> For a complete list of commands, options, and examples, see the [**CLI Reference**](./docs/2-user-guide/02-cli-reference.md).

## Development

This project uses `npm` for package management.

- `npm install`: Install dependencies.
- `npm run build`: Build the project.
- `npm run test`: Run tests.
- `npm run lint`: Lint the codebase.
- `npm run format`: Format the codebase.

## Contributing

Contributions are welcome! Please read our [**Code of Conduct**](./docs/4-contributing/04-code-of-conduct.md) and follow the [**Governance**](./docs/4-contributing/01-governance.md) process to open an issue or submit a pull request.

> [!TIP]
> Before contributing, please review our [**Testing Strategy**](./docs/4-contributing/03-testing-strategy.md).

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.
