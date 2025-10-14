# CLI: Core Utilities

**Author:** Gemini
**Date:** 2025-10-10

## 1. Introduction

The `copilot-instructions-cli` contains a set of core utilities in its `src/utils` directory. These modules provide shared functionality that supports the main CLI commands and helps to keep the command handlers clean and focused on their primary tasks.

## 2. Utility Modules

### 2.1 Module Discovery (`module-discovery.ts`)

*   **Responsibility:** To discover all available UMS modules, both from the standard library and from any locally configured paths.
*   **Key Function:**
    *   `discoverAllModules()`: This is the main function, which loads the module configuration, discovers standard and local modules, and populates a `ModuleRegistry` instance from `ums-lib`.

### 2.2 File Operations (`file-operations.ts`)

*   **Responsibility:** To handle all interactions with the file system.
*   **Key Functions:**
    *   `readModuleFile(path: string)` and `readPersonaFile(path: string)`: Read and return the content of module and persona files.
    *   `writeOutputFile(path: string, content: string)`: Writes content to a specified output file.
    *   `discoverModuleFiles(paths: string[])`: Uses `glob` to find all `.module.yml` files within a given set of directories.

### 2.3 Error Handling (`error-handler.ts` & `error-formatting.ts`)

*   **Responsibility:** To provide a centralized and consistent way of handling and displaying errors.
*   **Key Functions:**
    *   `handleError(error: unknown, options: ErrorHandlerOptions)`: The main error handling function. It can format and display different types of errors, including the custom error types from `ums-lib`.
    *   `formatError(...)`, `formatWarning(...)`, etc.: A set of functions for creating consistently formatted error and warning messages.

### 2.4 Progress Indicators (`progress.ts`)

*   **Responsibility:** To provide user-facing progress indicators for long-running operations.
*   **Key Class:**
    *   `ProgressIndicator`: A wrapper around the `ora` library that provides a consistent interface for starting, updating, and stopping spinners.

### 2.5 Configuration Loader (`config-loader.ts`)

*   **Responsibility:** To load and validate the `modules.config.yml` file.
*   **Key Function:**
    *   `loadModuleConfig(path?: string)`: Reads and parses the YAML configuration file, validates its structure, and returns a `ModuleConfig` object.
