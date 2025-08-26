---
name: 'Vitest: Best Practices'
description: 'A guide to best practices for writing clean, effective, and maintainable tests with Vitest.'
tier: technology
schema: specification
layer: null
---

## Core Concept

Vitest is a modern, fast, and feature-rich testing framework. Adhering to its best practices ensures that test suites are reliable, performant, and easy to maintain.

## Key Rules

- Test files MUST be named with a `.test.ts` (or `.spec.ts`) suffix to be discovered by the test runner.
- Use `describe()` blocks to group related tests into logical suites, typically one per function or component.
- Use `it()` or `test()` for individual test cases. The description MUST clearly state the expected outcome for the specific condition being tested.
- Use `expect()` combined with matcher functions (e.g., `.toBe()`, `.toEqual()`, `.toThrow()`) for all assertions.

## Best Practices

- Prefer `.toEqual()` for deep equality checks on objects and arrays, and `.toBe()` for primitive value and reference equality checks.
- Use `test.each()` or `it.each()` to run the same test with multiple different inputs, reducing code duplication.
- Leverage Vitest's built-in snapshot testing (`.toMatchSnapshot()`) for large objects or UI components, but review snapshots carefully on each change.
- Use `describe.concurrent` to run tests within a suite in parallel for a significant performance boost, but only if the tests are properly isolated.

## Anti-Patterns

- Placing test logic directly inside a `describe()` block instead of within an `it()` or `test()` block.
- Writing overly long or complex test descriptions. The code should be clear enough that a simple description suffices.
- Including multiple, unrelated assertions in a single `it()` block. Each test should have a single, focused objective.
