---
name: 'Vitest Configuration'
description: 'A guide to setting up vitest.config.ts with proper TypeScript, coverage, and environment configuration for optimal testing.'
tier: technology
schema: specification
tags:
  - testing
  - vitest
  - configuration
  - typescript
layer: null
---

## Core Concept

Vitest configuration determines the testing environment, coverage reporting, TypeScript integration, and test execution behavior. Proper configuration ensures reliable test execution, accurate coverage reporting, and seamless TypeScript integration across different project structures.

## Key Rules

- The configuration file MUST be named `vitest.config.ts` (preferred) or `vite.config.ts` with test configuration block to ensure proper TypeScript support and IDE integration.
- The `test.globals` option MUST be set to `true` to enable global test functions (`describe`, `it`, `expect`) without explicit imports, maintaining consistency with other testing frameworks.
- The `test.environment` option MUST be explicitly set to `'node'` for server-side code or `'jsdom'` for browser-like testing to ensure correct API availability and behavior.
- Coverage configuration MUST include `provider: 'v8'` for accurate coverage reporting and specify appropriate `include` and `exclude` patterns to focus on source code.
- TypeScript paths and module resolution MUST be configured using `resolve.alias` to ensure test files can properly import source modules using project-specific path mappings.

## Best Practices

- Use `test.setupFiles` to configure global test setup including DOM polyfills, test utilities, and mock configurations that apply across all test files.
- Configure `test.coverage.threshold` with minimum coverage requirements (typically 80% for statements, branches, functions, and lines) to maintain code quality standards.
- Set `test.testTimeout` to appropriate values (default 5000ms) based on application complexity, increasing for integration tests and decreasing for unit tests.
- Use `test.pool` set to `'threads'` for CPU-intensive tests or `'forks'` for tests requiring process isolation to optimize test execution performance.
- Configure `test.include` and `test.exclude` patterns to precisely control which files are considered test files, typically including `**/*.{test,spec}.{js,ts,jsx,tsx}` patterns.
- Enable `test.reporter` options like `['verbose', 'html']` for comprehensive test output during development and CI/CD pipeline execution.

## Anti-Patterns

- **Missing environment specification:** Failing to set `test.environment` leads to incorrect API availability and unpredictable test behavior across different codebases.
- **Inadequate coverage configuration:** Using default coverage settings without specifying thresholds, include/exclude patterns, or appropriate providers results in misleading coverage reports.
- **Ignoring TypeScript integration:** Not configuring proper module resolution and path aliases causes import failures and reduces development experience quality.
- **Overly broad test patterns:** Including non-test files in test execution through poorly configured `include` patterns slows down test runs and creates confusion.
- **Inconsistent timeout settings:** Using default timeouts for all test types without considering test complexity leads to false failures or unnecessarily slow test execution.
