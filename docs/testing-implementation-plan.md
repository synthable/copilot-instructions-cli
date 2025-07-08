# Testing Implementation Plan

This document outlines the plan for implementing the testing strategy defined in `docs/testing.md` for the source code in the `src/` directory.

## 1. Unit Testing

Unit tests will be created for each module to verify its functionality in isolation. All external dependencies will be mocked.

### 1.1. `src/utils/file-system.ts`

- **File:** `src/utils/file-system.test.ts`
- **Status:** ✅ Implemented
- **Strategy:**
  - Mock the `fs/promises` module using `vi.mock`.
  - **`findMarkdownFiles`:**
    - Test that it correctly finds markdown files.
    - Test that it recursively searches subdirectories.
    - Test that it returns an empty array for directories with no markdown files.
    - Test that it throws an error for non-existent directories.

### 1.2. `src/core/parser.ts`

- **File:** `src/core/parser.test.ts`
- **Status:** ✅ Implemented
- **Strategy:**
  - **`parseModuleMetadata`:**
    - Test with well-formed module files.
    - Test with missing required frontmatter fields.
    - Test with invalid path structures and tiers.
    - Test error handling when `readFile` fails.
  - **`isValidTier` and `getValidTiers`:**
    - Test with valid and invalid tier strings.
    - Test that `getValidTiers` returns the correct array.

### 1.3. `src/core/resolver.ts`

- **File:** `src/core/resolver.test.ts`
- **Status:** ✅ Implemented
- **Strategy:**
  - Mock `file-system.ts` and `parser.ts`.
  - **`ModuleResolver` class:**
    - Test `buildIndex` and `getIndex` with and without a pre-configured index.
    - Test `resolveModule` for valid and invalid module IDs.
    - Test other resolution methods like `resolveModules`, `resolveByTier`, etc.

### 1.4. `src/commands/build.ts`

- **File:** `src/commands/build.test.ts`
- **Status:** ✅ Implemented
- **Strategy:**
  - Mock `fs/promises` and other dependencies.
  - **Helper Functions:**
    - Test `loadPersonaFile` for valid, missing, and invalid files.
    - Test `personaToOptions` for correct conversion.
    - Test `mergeConfigurations` for correct precedence.
    - Test `compileModules` for correct output generation.

### 1.5. `src/commands/list.ts` and `src/commands/search.ts`

- **Files:** `src/commands/list.test.ts`, `src/commands/search.test.ts`
- **Status:** ✅ Implemented
- **Strategy:**
  - Mock `fs/promises` to simulate reading an index file.
  - **`list` helpers:** Test `getSelectedTiers`, `filterModulesByTiers`, and `prepareTableData`.
  - **`search` helpers:** Test `searchModules` with various queries.

### 1.6. `src/cli.ts`

- **File:** `src/cli.test.ts`
- **Status:** ✅ Implemented
- **Strategy:**
  - Mock the command modules (`build`, `list`, `search`, `index`).
  - Test that the correct command is invoked based on command-line arguments.
  - Test that `commander` is configured correctly with all commands.

## 2. Integration Testing

- **Location:** `tests/integration/`
- **Status:** ⏳ To be implemented
- **Strategy:**
  - Create a temporary directory with a mock `instructions-modules` structure and a test `instructions-modules.index.json`.
  - These tests will involve multiple components working together with minimal mocking.

### 2.1. `build-command.integration.test.ts`

- **Scenario:** Test the `build` command from the entry point to file output.
- **Steps:**
  1. Programmatically invoke the `build` command function.
  2. Use a real (but temporary) file system structure.
  3. Let the `resolver` and `parser` interact without mocks.
  4. Verify that the output file is created with the correctly assembled content.
  5. Clean up created files and directories after the test.

## 3. End-to-End (E2E) Testing

- **Location:** `tests/e2e/`
- **Status:** ⏳ To be implemented
- **Strategy:**
  - Use `child_process.exec` to run the compiled CLI (`dist/cli.js`).
  - Set up a dedicated test fixture directory with sample personas, modules, and index files.

### 3.1. `cli.e2e.test.ts`

- **Scenarios:**
  - **`build` command:**
    - Run `node dist/cli.js build --persona <test-persona> --output <test-output.md>`.
    - Assert that the command exits with code 0.
    - Read `<test-output.md>` and verify its content against a snapshot.
    - Test validation: run with a non-existent persona and assert it exits with a non-zero code and prints an error message.
  - **`list` command:**
    - Run `node dist/cli.js list`.
    - Assert that the output (stdout) matches a snapshot of the expected module list.
  - **`search` command:**
    - Run `node dist/cli.js search <query>`.
    - Assert that the output matches a snapshot of the expected search results.
  - **Help and Version:**
    - Run `node dist/cli.js --help` and `node dist/cli.js --version` and verify the output.

## 4. Tooling & CI Configuration

- **`package.json`:** ✅ Implemented
  - Add the following scripts:
    - `"test": "vitest run"`
    - `"test:watch": "vitest"`
    - `"coverage": "vitest run --coverage"`
- **`vitest.config.ts`:** ✅ Implemented
  - Create this configuration file at the root.
  - Configure test paths, coverage reporters (e.g., `text`, `html`, `lcov`).
  - Set coverage thresholds as per `docs/testing.md` (e.g., `branches: 80, functions: 80, lines: 80, statements: 80`).
- **`.github/workflows/ci.yml`:** ✅ Implemented
  - Add a "Test" step that runs `npm test` after the build step.
  - (Optional) Add a step to upload coverage reports to a service like Codecov.
