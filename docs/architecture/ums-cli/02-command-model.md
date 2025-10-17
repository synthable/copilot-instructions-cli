# CLI: Command Model

**Author:** Gemini
**Date:** 2025-10-10

## 1. Introduction

The `ums-cli` uses the `commander` library to define and manage its command structure. Each command is implemented in its own module within the `src/commands` directory, promoting separation of concerns.

## 2. Command Architecture

The main entry point, `src/index.ts`, is responsible for initializing `commander`, defining the commands, and parsing the command-line arguments. Each command then delegates to a specific handler function.

### 2.1 `build`

*   **Handler:** `handleBuild` in `src/commands/build.ts`
*   **Purpose:** To compile a persona and its modules into a single Markdown document.
*   **Flow:**
    1.  Initializes a progress indicator.
    2.  Calls `discoverAllModules` to populate the `ModuleRegistry`.
    3.  Reads the persona file from disk or `stdin`.
    4.  Calls `parsePersona` from `ums-lib` to validate the persona.
    5.  Resolves the required modules from the registry.
    6.  Calls `renderMarkdown` from `ums-lib` to generate the output.
    7.  Writes the output to a file or `stdout`.

### 2.2 `list`

*   **Handler:** `handleList` in `src/commands/list.ts`
*   **Purpose:** To list all discoverable UMS modules.
*   **Flow:**
    1.  Calls `discoverAllModules`.
    2.  Filters the modules by tier if the `--tier` option is provided.
    3.  Sorts the modules by name and then by ID.
    4.  Renders the results in a formatted table using `cli-table3`.

### 2.3 `search`

*   **Handler:** `handleSearch` in `src/commands/search.ts`
*   **Purpose:** To search for modules by keyword.
*   **Flow:**
    1.  Calls `discoverAllModules`.
    2.  Performs a case-insensitive search on the module's name, description, and tags.
    3.  Filters the results by tier if the `--tier` option is provided.
    4.  Renders the results in a formatted table.

### 2.4 `validate`

*   **Handler:** `handleValidate` in `src/commands/validate.ts`
*   **Purpose:** To validate module and persona files against the UMS v2.0 specification.
*   **Flow:**
    1.  Uses `glob` to find all `.module.ts` and `.persona.ts` files in the target path.
    2.  For each file, it calls the appropriate parsing function (`parseModule` or `parsePersona`) from `ums-lib`.
    3.  The parsing functions in `ums-lib` contain the validation logic.
    4.  Reports the validation results to the console.

### 2.5 `inspect`

*   **Handler:** `handleInspect` in `src/commands/inspect.ts`
*   **Purpose:** To inspect the module registry for conflicts and other metadata.
*   **Flow:**
    1.  Calls `discoverAllModules` to get a populated `ModuleRegistry` instance.
    2.  Uses the methods on the `ModuleRegistry` (`getConflicts`, `getSourceSummary`, etc.) to gather information.
    3.  Presents the information to the user in a formatted table or as JSON.
