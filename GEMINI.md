# GEMINI.md

## Gemini Added Memories

- Use the "claude-code" server as a peer to brainstorm with, validate ideas, and get feedback from.
- Use the "ums-module-evaluator" agent to validate new UMS modules and get feedback on them.

## Project Overview

This project is a command-line interface (CLI) tool named "ums-cli" for composing, managing, and building modular AI assistant instructions. It allows users to create and manage "personas" for AI assistants by combining reusable "modules" of instructions.

The project is built with [TypeScript](https://www.typescriptlang.org/) and runs on [Node.js](https://nodejs.org/). It uses the [commander](https://github.com/tj/commander.js/) library to create the CLI and `vitest` for testing.

The core philosophy of the project is to treat AI instructions as source code, with a modular, version-controlled, and collaborative approach.

## Building and Running

The following commands are used for building, running, and testing the project:

- **Install dependencies:**

  ```bash
  npm install
  ```

- **Build the project:**

  ```bash
  npm run build
  ```

- **Run the CLI:**

  ```bash
  npm start
  ```

- **Run tests:**

  ```bash
  npm run test
  ```

- **Lint the codebase:**
  ```bash
  npm run lint
  ```

## Development Conventions

- **Code Style:** The project uses [Prettier](https://prettier.io/) for code formatting and [ESLint](https://eslint.org/) for linting. The configuration files for these tools are `.prettierrc` and `eslint.config.js` respectively.
- **Testing:** The project uses [Vitest](https://vitest.dev/) for testing. Test files are located alongside the source files with a `.test.ts` extension.
- **Commits:** The project uses [Husky](https://typicode.github.io/husky/) for pre-commit and pre-push hooks, which run type checking, linting, and testing. This ensures code quality and consistency.
- **Modularity:** The project is structured around modules and personas using a TypeScript-first approach. Modules are small, single-purpose files (`.module.ts`) that represent one atomic concept. Personas are defined in `.persona.ts` files and are composed of a list of modules. (Legacy `.module.yml` and `.persona.yml` formats are also supported for compatibility.)

---

<!--./.gemini/supermemory.md-->

---
