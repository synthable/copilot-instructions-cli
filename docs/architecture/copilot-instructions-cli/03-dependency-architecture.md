# CLI: Dependency Architecture

**Author:** Gemini
**Date:** 2025-10-10

## 1. Introduction

The `copilot-instructions-cli` has a minimal and well-defined dependency architecture. Its primary goal is to consume the `ums-lib` for core logic and use a small set of libraries for CLI-specific functionality like argument parsing and terminal output styling.

## 2. Core Dependency: `ums-lib`

The most critical dependency is the `ums-lib` package. The CLI is architected as a consumer of this library, following the "Functional Core, Imperative Shell" pattern. `ums-lib` provides all the necessary functions for:

*   Parsing and validating UMS modules and personas.
*   Resolving module dependencies.
*   Rendering the final Markdown output.
*   Managing module conflicts through the `ModuleRegistry`.

By relying on `ums-lib`, the CLI avoids duplicating business logic and remains focused on its role as the user-facing interface.

## 3. Production Dependencies

The `package.json` for `copilot-instructions-cli` lists the following production dependencies:

*   **`ums-lib`**: The core functional library for all UMS operations.
*   **`chalk`**: Used for adding color to terminal output, improving readability of messages and errors.
*   **`cli-table3`**: Used by the `list` and `search` commands to render results in a clean, tabular format.
*   **`commander`**: The framework used to build the entire command-line interface, including parsing arguments and options.
*   **`ora`**: Provides spinners and progress indicators for long-running operations like module discovery and building personas.

## 4. Dependency Strategy

The dependency strategy for the CLI is characterized by:

*   **Minimalism:** The number of external dependencies is kept to a minimum to reduce the attack surface and maintenance overhead.
*   **Separation of Concerns:** Core logic is delegated to `ums-lib`, while CLI-specific dependencies are used only for presentation and user interaction.
*   **No Transitive Conflicts:** The small number of dependencies and the monorepo structure help to avoid transitive dependency conflicts.
