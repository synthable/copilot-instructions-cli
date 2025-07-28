---
name: 'Vitest Test Organization'
description: 'A guide to structuring test files, naming conventions, and test suite organization for maintainable and scalable test suites.'
tier: technology
schema: specification
tags:
  - testing
  - vitest
  - organization
  - structure
layer: null
---

## Core Concept

Test organization in Vitest involves structuring test files, grouping related tests, and establishing consistent naming conventions to create maintainable, discoverable, and scalable test suites that parallel the application's architecture and facilitate efficient debugging and development workflows.

## Key Rules

- Test files MUST be placed adjacent to source files with `.test.ts` or `.spec.ts` extensions, or organized in dedicated `__tests__` directories to ensure discoverability and maintain clear source-to-test relationships.
- Each source file MUST have a corresponding test file with identical base name (e.g., `user-service.ts` → `user-service.test.ts`) to establish clear testing accountability and coverage expectations.
- Test suites MUST use `describe()` blocks to group related tests by logical functionality, typically one describe block per public method or feature to create hierarchical test organization.
- Individual test cases MUST use descriptive names following the pattern "should [expected behavior] when [specific condition]" to clearly communicate test intent and failure scenarios.
- Test files MUST import only the specific modules being tested plus necessary testing utilities to maintain focused scope and minimize test coupling dependencies.

## Best Practices

- Organize test describe blocks hierarchically with top-level describe for the module/class, nested describes for methods/features, and it/test blocks for specific scenarios.
- Use consistent file naming patterns across the project, preferring `.test.ts` for unit tests and `.integration.test.ts` or `.e2e.test.ts` for broader test scopes.
- Group setup and teardown logic using `beforeEach`, `afterEach`, `beforeAll`, and `afterAll` hooks within appropriate describe blocks to ensure proper test isolation.
- Create shared test utilities and fixtures in dedicated `test-utils` or `__fixtures__` directories to promote reusability and consistency across test files.
- Follow the Arrange-Act-Assert pattern within individual tests, using clear variable names and comments to delineate each phase of the test execution.
- Use nested describe blocks to organize tests by different scenarios or contexts, such as "when user is authenticated" vs "when user is anonymous".

## Anti-Patterns

- **Monolithic test files:** Creating single large test files that cover multiple unrelated modules or features, making tests difficult to navigate and maintain.
- **Unclear test descriptions:** Using vague or implementation-focused test names like "test function X" instead of behavior-focused descriptions that explain business value.
- **Mixed test scopes:** Combining unit tests, integration tests, and end-to-end tests in the same file without clear separation or organization strategy.
- **Shared mutable state:** Allowing test state to leak between test cases by not properly isolating setup and teardown, leading to flaky test behavior.
- **Deep nesting abuse:** Creating excessively nested describe blocks (more than 3-4 levels) that make test structure confusing and reduce readability.
- **Inconsistent naming:** Using different naming conventions for test files and describe blocks across the project, making test discovery and navigation difficult.
