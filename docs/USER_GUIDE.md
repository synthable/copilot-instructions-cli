# Instructions Composer User Guide

Welcome to the official user guide for the Instructions Composer project. This guide provides a comprehensive overview of the project, its features, and how to use it effectively.

## Introduction

The Instructions Composer is a powerful command-line interface (CLI) designed to revolutionize how developers create and manage instructions for AI assistants. It shifts from monolithic, hard-to-maintain prompt files to a modular, reusable, and powerful ecosystem.

The core philosophy is that a persona is a **cognitive architecture** for an AI. By carefully layering modules, you define not just _what_ the AI should do, but _how it should think_.

### What Problem Does It Solve?

Modern AI is incredibly powerful, but instructing it is often a chaotic and frustrating process. Developers and teams who rely on AI assistants face a critical set of problems:

*   **Inconsistency:** The same prompt can yield wildly different results.
*   **Maintenance Nightmare:** Prompts quickly become monolithic and difficult to debug.
*   **Lack of Reusability:** Expert knowledge and effective instructions are trapped inside giant prompts.
*   **No Collaboration:** There is no effective way for a team to collaboratively build, manage, and version-control a shared set of AI instructions.

The Instructions Composer solves this by treating AI instructions with the same rigor and structure as we treat source code.

## Core Concepts

The project is built around a few core concepts that enable a modular and structured approach to building AI instructions.

### Modules

Modules are the building blocks of your AI's knowledge and skills. They are individual Markdown files (`.module.yml`) containing specific instructions, principles, or data. Each module is a self-contained unit of knowledge that can be mixed and matched to create different AI personas.

### The Four-Tier Hierarchy

Modules are organized into a strict four-tier hierarchy, ensuring that the AI's reasoning is built on a logical and predictable foundation. The tiers are processed in order, moving from the most abstract to the most concrete:

1.  **Foundation:** The universal, abstract truths of logic, reason, ethics, and problem-solving. These are the bedrock principles that guide all other instructions.
2.  **Principle:** Established, technology-agnostic best practices and methodologies. This includes things like architectural patterns, coding standards, and development processes.
3.  **Technology:** Specific, factual knowledge about a named tool, language, or platform. This tier contains the "how-to" for specific technologies.
4.  **Execution:** Imperative, step-by-step playbooks for performing a specific, concrete action. These are the actionable instructions for the AI.

### Personas

A persona is a collection of modules that define the behavior and capabilities of an AI assistant. Personas are defined in `.persona.yml` files, which specify the modules to include, the output file for the generated instructions, and other configuration options. By combining modules, you can create sophisticated personas that can handle complex tasks with a high degree of consistency and reliability.

## Installation and Setup

### Prerequisites

Before you can use the Instructions Composer CLI, you need to have the following software installed on your system:

*   **Node.js**: Version 22.0.0 or higher.
*   **npm**: The Node.js package manager, which is included with Node.js.

You can check your Node.js version by running:

```sh
node -v
```

### Installation

To install the Instructions Composer CLI globally on your system, run the following command:

```sh
npm install -g instructions-composer-cli
```

This will make the `copilot-instructions` command available in your terminal.

### Project Setup

To start using the Instructions Composer in a project, you need to create a directory for your instruction modules. By default, the CLI looks for a directory named `instructions-modules` in the root of your project.

```sh
mkdir instructions-modules
cd instructions-modules
mkdir foundation principle technology execution
```

You will also need a `modules.config.yml` file in the root of your project that tells the CLI where to find your modules. Create a file named `modules.config.yml` with the following content:

```yaml
localModulePaths:
  - path: "./instructions-modules"
    onConflict: "warn"
```


## CLI Commands

The `copilot-instructions` CLI provides a set of commands for managing your modules and personas.

### `build`

Builds a persona instruction file from a `.persona.yml` configuration.

```sh
copilot-instructions build [options]
```

**Options:**

*   `-p, --persona <file>`: Path to the persona configuration file.
*   `-o, --output <file>`: Specify the output file for the build.
*   `-v, --verbose`: Enable verbose output.

**Examples:**

```sh
# Build a persona from a specific file
copilot-instructions build --persona ./personas/my-persona.persona.yml

# Build a persona and specify the output file
copilot-instructions build --persona ./personas/my-persona.persona.yml --output ./dist/my-persona.md

# Build from a persona file piped via stdin
cat persona.yml | copilot-instructions build --output ./dist/my-persona.md
```

### `list`

Lists all available instruction modules.

```sh
copilot-instructions list [options]
```

**Options:**

*   `-t, --tier <name>`: Filter by tier (`foundation`, `principle`, `technology`, `execution`).
*   `-v, --verbose`: Enable verbose output.

**Examples:**

```sh
# List all modules
copilot-instructions list

# List all modules in the foundation tier
copilot-instructions list --tier foundation
```

### `search`

Searches for modules by name, description, or tags.

```sh
copilot-instructions search <query> [options]
```

**Arguments:**

*   `<query>`: The search query.

**Options:**

*   `-t, --tier <name>`: Filter by tier (`foundation`, `principle`, `technology`, `execution`).
*   `-v, --verbose`: Enable verbose output.

**Examples:**

```sh
# Search for modules with the query "logic"
copilot-instructions search "logic"

# Search for modules with the query "reasoning" in the foundation tier
copilot-instructions search "reasoning" --tier foundation
```

### `validate`

Validates all modules and persona files.

```sh
copilot-instructions validate [path] [options]
```

**Arguments:**

*   `[path]`: Path to validate (file or directory, defaults to current directory).

**Options:**

*   `-v, --verbose`: Enable verbose output with detailed validation steps.

**Examples:**

```sh
# Validate all files in the current directory and subdirectories
copilot-instructions validate

# Validate a specific directory
copilot-instructions validate ./instructions-modules

# Validate a specific persona file
copilot-instructions validate ./personas/my-persona.persona.yml
```

## The Module and Persona System

The Instructions Composer is built on a system of modules and personas, which are defined in YAML files. This section details the structure and conventions for these files.

### The `.persona.yml` File

A persona file is a YAML file that defines a specific AI persona. It specifies the persona's identity and the modules that make up its knowledge and skills.

**Example:**

```yaml
name: "JavaScript Frontend React Developer"
version: "1.0.0"
schemaVersion: "1.0"
description: "A JavaScript Frontend React Developer persona that specializes in building user-facing web applications with React."
semantic: |
  This JavaScript Frontend React Developer persona focused on building accessible, performant, and maintainable user interfaces.
identity: |
  You are an expert frontend engineer with a calm, collaborative tone.
attribution: true
moduleGroups:
  - groupName: "Core Reasoning Framework"
    modules:
      - "foundation/ethics/do-no-harm"
      - "foundation/reasoning/first-principles-thinking"
  - groupName: "Professional Standards"
    modules:
      - "principle/testing/test-driven-development"
      - "principle/architecture/separation-of-concerns"
```

**Fields:**

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | The human-readable name of the persona. |
| `version` | `string` | The semantic version of the persona. |
| `schemaVersion` | `string` | The UMS schema version (should be "1.0"). |
| `description` | `string` | A concise, single-sentence summary of the persona. |
| `semantic` | `string` | A dense, keyword-rich paragraph for semantic search. |
| `identity` | `string` | A prologue describing the persona's role, voice, and traits. |
| `attribution` | `boolean` | Whether to append attribution comments after each module in the output. |
| `moduleGroups` | `array` | An array of module groups. |

### The `.module.yml` File

A module file is a YAML file that contains a single, atomic unit of instruction.

**Example:**

```yaml
id: "technology/config/build-target-matrix"
version: "1.0.0"
schemaVersion: "1.0"
shape: data
declaredDirectives:
  required: [goal, data]
  optional: [examples]
meta:
  name: "Build Target Matrix"
  description: "Provides a small JSON matrix of supported build targets and Node versions."
  semantic: |
    Data block listing supported build targets, platforms, and versions.
body:
  goal: |
    Make supported build targets machine-readable for CI and documentation automation.
  data:
    mediaType: application/json
    value: |
      { "targets": [
        { "name": "linux-x64", "node": "20.x" },
        { "name": "darwin-arm64", "node": "20.x" }
      ] }
```

**Fields:**

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | A unique identifier for the module, including its path from the tier root. |
| `version` | `string` | The semantic version of the module. |
| `schemaVersion` | `string` | The UMS schema version (should be "1.0"). |
| `shape` | `string` | The structural type of the module (e.g., `data`, `procedure`, `specification`). |
| `declaredDirectives` | `object` | Specifies which body directives are required and optional. |
| `meta` | `object` | An object containing human-readable metadata. |
| `body` | `object` | An object containing the instructional content, structured according to the `shape`. |

## Practical Examples

This section provides practical examples for common tasks you'll perform with the Instructions Composer CLI.

### Building a Persona

To build a persona, you need a `.persona.yml` file. Let's assume you have the following file at `personas/react-developer.persona.yml`:

```yaml
name: "React Developer"
version: "1.0.0"
schemaVersion: "1.0"
description: "A React developer persona."
semantic: "A React developer."
identity: "You are a React developer."
moduleGroups:
  - groupName: "React"
    modules:
      - "technology/framework/react/component-best-practices"
      - "technology/framework/react/rules-of-hooks"
```

To build this persona, you would run the following command:

```sh
copilot-instructions build -p personas/react-developer.persona.yml -o dist/react-developer.md
```

This will create a new file at `dist/react-developer.md` that contains the composed instructions from the specified modules.

### Listing Modules

To see a list of all available modules, you can use the `list` command.

```sh
copilot-instructions list
```

To filter the list by tier, you can use the `--tier` option.

```sh
copilot-instructions list --tier technology
```

### Searching for Modules

To search for modules, you can use the `search` command.

```sh
copilot-instructions search "state management"
```

This will search for modules that have "state management" in their name, description, or tags.

### Validating Instructions

To validate all your modules and personas, you can run the `validate` command from the root of your project.

```sh
copilot-instructions validate
```

This will check for issues like incorrect file formats, missing fields, and broken module references.

## Troubleshooting

Here are some common issues you might encounter and how to resolve them.

### "Module not found" error during build

This error usually means that a module listed in your `.persona.yml` file cannot be found. Check the following:

*   **Verify the module path:** Ensure the path in your persona file is correct and that the module file exists at that location within your `instructions-modules` directory.
*   **Check your `modules.config.yml`:** Make sure the `localModulePaths` in your `modules.config.yml` file points to the correct directory where your modules are stored.

### Validation errors

If the `validate` command reports errors, use the output to identify the problematic file and line number. Common validation errors include:

*   **Missing required fields:** Ensure that all required fields in your `.persona.yml` and `.module.yml` files are present.
*   **Incorrect data types:** Check that all fields have the correct data type (e.g., a string for `name`, an array for `moduleGroups`).
*   **Schema version mismatch:** Ensure the `schemaVersion` is set to "1.0".

## Reference

For more detailed information, please refer to the following sections of this guide:

*   [Core Concepts](#core-concepts)
*   [CLI Commands](#cli-commands)
*   [The Module and Persona System](#the-module-and-persona-system)
