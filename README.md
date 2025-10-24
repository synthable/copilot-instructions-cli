# Instructions Composer

[Build Status](#) &nbsp;&nbsp; [NPM Version](#) &nbsp;&nbsp; [License: GPL-3.0-or-later](./LICENSE)

> A CLI tool for building modular AI instructions. Treat your prompts like code.

---

The Instructions Composer helps you move away from monolithic, hard-to-maintain prompts and towards a structured, collaborative, and version-controlled workflow.

## Features

- **🧱 Modular by Design**: Break down large, complex prompts into small, reusable `Modules` that are easy to manage.
- **🧩 Composable**: Build powerful and targeted `Personas` by combining modules in a specific, layered order.
- **♻️ Reusable & Consistent**: Share modules across different personas to ensure consistency and save time.
- **✅ Version-Controlled**: Instructions are defined in TypeScript files with full type safety, making them easy to track in Git.
- **🔍 Discoverable**: Easily `list` and `search` your library of modules to find the building blocks you need.
- **🏷️ Tag-Based Classification**: Flexible tag system for organizing modules by capability, domain, pattern, and complexity level.
- **🔌 MCP Integration**: Built-in Model Context Protocol server for Claude Desktop and other AI assistants
- **🎯 TypeScript-First**: UMS v2.0 uses TypeScript for modules and personas, providing compile-time type checking and better IDE support

## Monorepo Structure

This project is organized as a monorepo with four packages:

```
instructions-composer/
├── packages/
│   ├── ums-lib/                    # Core UMS v2.0 library
│   ├── ums-sdk/                    # Node.js SDK for UMS v2.0
│   ├── ums-cli/                    # CLI tool for developers
│   └── ums-mcp/                    # MCP server for AI assistants
```

**[ums-lib](./packages/ums-lib)**: Platform-agnostic library for parsing, validating, and rendering UMS v2.0 modules (pure domain logic)

**[ums-sdk](./packages/ums-sdk)**: Node.js SDK providing file system operations, TypeScript module loading, and high-level orchestration for UMS v2.0

**[ums-cli](./packages/ums-cli)**: Command-line interface for building and managing personas using the UMS SDK

**[ums-mcp](./packages/ums-mcp)**: MCP server providing AI assistants with module discovery capabilities

## Getting Started

Get up and running with a single command to build the example persona.

```bash
# 1. Clone the repository
git clone https://github.com/synthable/copilot-instructions-cli.git
cd copilot-instructions-cli

# 2. Install dependencies
npm install

# 3. Build the example persona!
npm start build personas/example-persona.persona.ts -o example-build.md
```

Now, check `example-build.md` to see the final, compiled instruction set.

> **Note**: UMS v2.0 uses TypeScript format (`.module.ts` and `.persona.ts`) for better type safety and IDE support.

## Core Concepts in Action: A 5-Minute Example

Here’s how you create your own persona from scratch.

#### Step 1: Create a Module

A module is a small, atomic piece of instruction. Create a file named `be-concise.module.ts`:

```typescript
// ./modules/communication/be-concise.module.ts
import { type Module, CognitiveLevel } from 'ums-lib';

export const beConcise: Module = {
  id: 'communication/be-concise',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['communication', 'conciseness'],
  cognitiveLevel: CognitiveLevel.UNIVERSAL_PATTERNS,
  metadata: {
    name: 'Be Concise',
    description: 'Instructs the AI to be concise and to the point.',
    semantic:
      'The AI should provide clear, concise answers without unnecessary verbosity.',
    tags: ['communication', 'clarity'],
  },
  instruction: {
    purpose: 'Ensure responses are concise and direct',
    principles: [
      'Be concise and to the point',
      'Eliminate unnecessary words',
      'Focus on clarity over length',
    ],
  },
};
```

#### Step 2: Create a Persona

A persona combines one or more modules. Create `my-persona.persona.ts`:

```typescript
// ./personas/my-persona.persona.ts
import type { Persona } from 'ums-lib';

export default {
  name: 'Concise Assistant',
  version: '1.0.0',
  schemaVersion: '2.0',
  description: 'A persona that is always concise.',
  semantic: 'An AI assistant focused on providing clear, concise responses.',
  modules: ['communication/be-concise'], // Reference the module by its ID
} satisfies Persona;
```

#### Step 3: Build It!

Run the `build` command to compile your new persona:

```bash
npm start build ./personas/my-persona.persona.ts -o concise-assistant.md
```

That's it! You now have a custom-built instruction set in `concise-assistant.md` with full TypeScript type safety.

## CLI Command Reference

| Command    | Description                                                     | Example Usage                                   |
| :--------- | :-------------------------------------------------------------- | :---------------------------------------------- |
| `build`    | Compiles a `.persona.ts` into a single instruction document.    | `npm start build ./personas/my-persona.ts`      |
| `list`     | Lists all discoverable modules with filtering options.          | `npm start list --level 2 --capability testing` |
| `search`   | Searches for modules by keyword with filtering options.         | `npm start search "error" --domain typescript`  |
| `validate` | Validates the syntax and integrity of module and persona files. | `npm start validate ./instructions-modules/`    |
| `inspect`  | Inspects module conflicts and registry state.                   | `npm start inspect --conflicts-only`            |
| `mcp`      | MCP server development and testing tools.                       | `npm start mcp start --stdio`                   |

### MCP Server Commands

The CLI also provides commands for working with the MCP server:

| Subcommand            | Description                               | Example Usage                           |
| :-------------------- | :---------------------------------------- | :-------------------------------------- |
| `mcp start`           | Start the MCP server                      | `npm start mcp start --transport stdio` |
| `mcp test`            | Test the MCP server with sample requests  | `npm start mcp test`                    |
| `mcp validate-config` | Validate Claude Desktop MCP configuration | `npm start mcp validate-config`         |
| `mcp list-tools`      | List available MCP tools                  | `npm start mcp list-tools`              |

## Documentation

For a deep dive into the Unified Module System, advanced features, and configuration, please read our **[Comprehensive Guide](./docs/comprehensive_guide.md)**.

## Module Classification System

UMS v2.0 uses a multi-dimensional classification system for organizing and discovering modules:

### Classification Fields

Every module has these classification fields:

- **`capabilities`** (required): Array of functional capabilities the module provides
  - Examples: `['communication', 'conciseness']`, `['error-handling', 'debugging']`
  - Describes **what** the module helps you accomplish

- **`cognitiveLevel`** (required): `CognitiveLevel` enum value indicating cognitive abstraction level
  - Use `CognitiveLevel` enum from `ums-lib` for type-safe level specification
  - **0 / `AXIOMS_AND_ETHICS`**: Universal truths, ethical bedrock
  - **1 / `REASONING_FRAMEWORKS`**: How to think and analyze
  - **2 / `UNIVERSAL_PATTERNS`**: Cross-domain patterns and principles
  - **3 / `DOMAIN_SPECIFIC_GUIDANCE`**: Field-specific but technology-agnostic
  - **4 / `PROCEDURES_AND_PLAYBOOKS`**: Step-by-step instructions
  - **5 / `SPECIFICATIONS_AND_STANDARDS`**: Precise requirements and criteria
  - **6 / `META_COGNITION`**: Self-reflection and process improvement

- **`domain`** (optional): Technology or field the module applies to
  - Examples: `'typescript'`, `'python'`, `['web-development', 'frontend']`
  - Can be a string or array of strings

- **`metadata.tags`** (optional): Additional keywords, patterns, or classifications
  - Examples: `['tdd', 'best-practices']`, `['solid', 'architecture']`
  - Flexible array for any additional categorization

### CLI Filtering

Use these fields to filter modules with the CLI:

```bash
# Filter by cognitive level (numeric or enum name)
npm start list --level 2
npm start list --level UNIVERSAL_PATTERNS
npm start list --level AXIOMS_AND_ETHICS,REASONING_FRAMEWORKS

# Filter by capabilities
npm start search "error" --capability debugging

# Filter by domain
npm start list --domain typescript

# Combine filters (comma-separated values supported)
npm start list --level 2,3 --capability testing,debugging --domain typescript
npm start list --level DOMAIN_SPECIFIC_GUIDANCE --capability architecture
```

### Module ID Format

Module IDs use a flexible hierarchical format:

- Format: `category/name` or `domain/category/name`
- Examples: `communication/be-concise`, `typescript/error-handling/try-catch`
- All segments use kebab-case (lowercase with hyphens)

For complete specification details, see [UMS v2.0 Specification](./spec/unified_module_system_v2_spec.md).

## Contributing

Contributions are welcome! We encourage you to open issues and submit pull requests. Please follow the existing code style and ensure all tests pass.

- Run tests: `npm run test`
- Check linting: `npm run lint`

## License

This project is licensed under the **[GPL-3.0-or-later](./LICENSE)**.
