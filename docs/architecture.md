# Architecture Overview

## 1. Introduction

This document details the internal architecture of the `copilot-instructions` CLI tool. It is intended for developers who want to understand how the system is structured, how the different components interact, and the design principles that guide its development.

## 2. Guiding Principles

The architecture is designed around established software engineering principles to ensure the codebase is maintainable, scalable, and easy to reason about:

- **Modularity & Separation of Concerns (SoC):** Each component of the application has a distinct responsibility. For example, the logic for parsing files is separate from the logic that defines the CLI commands.
- **Single Responsibility Principle (SRP):** Functions and modules are kept small and focused on a single task.
- **Dependency Inversion:** High-level modules (like command handlers) depend on abstractions (like the `Module` interface or function signatures), not on the low-level implementation details of other modules. This decouples the components and makes them easier to test.

## 3. High-Level Architecture

The application can be broken down into three main layers:

1.  **CLI Entry Point & Command Registration (`src/index.ts`):** This is the outermost layer. Its sole responsibility is to initialize the `commander.js` framework, define the structure of the CLI commands (e.g., `build`, `list`), and link them to their corresponding handler functions. It does not contain any business logic.

2.  **Command Handlers (`src/commands/*.ts`):** This layer contains the logic for each individual CLI command. Each command file (e.g., `build.ts`, `list.ts`) exports an asynchronous handler function that takes the user's input (arguments and options) and orchestrates the steps needed to execute the command. These handlers are responsible for user feedback (spinners, error messages) and coordinating calls to the core services.

3.  **Core Services (`src/core/*.ts`):** This is the heart of the application. It contains the shared business logic that is used by multiple commands. The primary service is the `ModuleService`, which is responsible for all interactions with the `instructions-modules/` directory.

## 4. Key Components & Data Flow

### 4.1. `ModuleService` (`src/core/module-service.ts`)

- **Responsibility:** To be the single source of truth for discovering, parsing, and providing access to all available instruction modules.
- **Key Functionality:** The `scanModules()` function is the primary public method. It performs the following steps:
  1.  Recursively traverses the `instructions-modules/` directory to find all `*.md` files.
  2.  For each file, it calls a private helper function to parse the file content.
  3.  The parsing function reads the file, uses `gray-matter` to separate the YAML frontmatter from the Markdown content, and derives the module's `id`, `tier`, and `subject` from its file path.
  4.  It validates the frontmatter to ensure the required `name` and `description` fields are present.
  5.  It returns a `Map<string, Module>`, which provides an efficient, O(1) lookup for modules by their unique ID.

### 4.2. Data Structures (`src/types/index.ts`)

- **Responsibility:** To provide a single, centralized location for all custom type definitions and interfaces used throughout the application.
- **Key Interfaces:**
  - `Module`: Represents a single, parsed instruction module. It is the canonical data structure for a module within the application.
  - `PersonaConfig`: Represents the structure of a `*.persona.jsonc` file.

By centralizing these types, we ensure data consistency and leverage TypeScript's static analysis capabilities across the entire codebase.

### 4.3. Data Flow for the `build` Command

To illustrate how the components interact, here is the data flow for the `build` command:

1.  **`index.ts`** receives the `build` command and invokes `handleBuild()` from `src/commands/build.ts`, passing the persona file path.
2.  **`handleBuild()`** orchestrates the process:
    a. It shows a spinner to the user.
    b. It reads the user-provided `*.persona.jsonc` file.
    c. It uses `jsonc-parser` to parse the file content into a `PersonaConfig` object.
    d. It validates the `PersonaConfig` object using `validatePersona()` from the `ModuleService`.
    e. It calls `scanModules()` from the `ModuleService` to get a map of all available modules.
    f. It iterates through the `modules` array in the `PersonaConfig` and uses the module IDs to look up the full `Module` objects from the map returned by the service.
    g. It assembles the `content` of the resolved modules into a single string, adding separators and attributions as specified in the `PersonaConfig`.
    h. It writes the final string to the appropriate output file.
    i. It updates the user with success or failure messages.

This decoupled architecture makes the system robust and easy to extend. To add a new command, a developer only needs to create a new file in `src/commands/` and register it in `src/index.ts`, without modifying any of the core service logic.
