---
name: 'Vitest Mocking'
description: 'A guide to effectively using mocking in Vitest to isolate components and functions for focused testing.'
tags:
  - testing
  - vitest
  - javascript
  - typescript
  - mocking
---

# Vitest Mocking

## Primary Directive

You MUST use mocks to create isolated, deterministic tests. Vitest's mocking system is designed to be intuitive and powerful, especially in an ES Modules (ESM) environment.

## Process

1.  **Use `vi.mock` for Modules:** Use `vi.mock` to mock entire modules. This is the standard way to mock dependencies in Vitest.
2.  **Use `vi.fn()` for Spies:** Use `vi.fn()` to create a spy, which allows you to track function calls, arguments, and return values without replacing the original implementation.
3.  **Use `vi.spyOn` to Spy on Methods:** To spy on a specific method of an object, use `vi.spyOn`. This is useful for testing interactions with objects and classes.
4.  **Restore Mocks with `vi.restoreAllMocks`:** Use `afterEach(() => { vi.restoreAllMocks(); });` to ensure that all mocks are restored to their original state after each test.
5.  **Mock Timers with `vi.useFakeTimers`:** When testing code that relies on timers (e.g., `setTimeout`, `setInterval`), use `vi.useFakeTimers()` to control the passage of time in your tests.

## Constraints

- You MUST NOT mock modules that are not direct dependencies of the code under test. This can lead to complex and brittle tests.
- You MUST NOT forget to restore mocks after each test, as this can cause tests to interfere with each other.
- You MUST NOT use mocks to make assertions about the internal implementation of a function or component.
layer: null
