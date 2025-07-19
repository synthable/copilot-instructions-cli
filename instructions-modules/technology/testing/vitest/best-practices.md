---
name: 'Vitest Best Practices'
description: 'A guide to best practices for writing clean, effective, and maintainable tests with Vitest.'
tags:
  - testing
  - vitest
  - javascript
  - typescript
  - best-practices
---

# Vitest Best Practices

## Primary Directive

You MUST write tests that are fast, reliable, and easy to maintain. Leverage Vitest's modern features, such as its ESM-first architecture and smart test runner, to create a highly efficient testing workflow.

## Process

1.  **Follow AAA Pattern:** Structure your tests using the Arrange-Act-Assert (AAA) pattern. This makes tests readable and easy to follow.
2.  **Use `describe`, `test`, and `expect`:** Use `describe` to group related tests. Use `test` (or `it`) to define a specific test case. Use `expect` for assertions, leveraging Vitest's Chai-based assertion library.
3.  **Leverage In-Source Testing:** For simple functions, consider using Vitest's in-source testing feature to write tests directly alongside your code. This can improve developer experience and code locality.
4.  **Use Mocks for Isolation:** Use `vi.mock` to mock dependencies and isolate the code under test. Vitest's mocking capabilities are similar to Jest's but are designed for an ESM-first world.
5.  **Take Advantage of Hot Module Replacement (HMR):** Use Vitest's watch mode to get near-instant feedback as you write your code and tests. The HMR-powered test runner is one of Vitest's key strengths.

## Constraints

- You MUST NOT write tests that are dependent on each other. Each test must be atomic and runnable in isolation.
- You MUST NOT test implementation details. Focus on the public API and the observable behavior of your code.
- You MUST NOT over-mock. Only mock what is necessary to isolate the unit under test. Excessive mocking can lead to brittle tests that are tightly coupled to the implementation.
