---
name: 'Jest Mocking'
description: 'A guide to effectively using mocking in Jest to isolate components and functions for focused testing.'
tags:
  - testing
  - jest
  - javascript
  - mocking
layer: null
---

# Jest Mocking

## Primary Directive

You MUST use mocks to isolate the unit of code under test from its dependencies. Mocks should be used to control the test environment, simulate specific scenarios, and prevent tests from having external side effects (e.g., making real network requests).

## Process

1.  **Mock Dependencies with `jest.mock`:** Use `jest.mock` to automatically mock a module's dependencies. This is the easiest way to mock modules and should be your default choice.
2.  **Use `jest.fn()` for Spies and Stubs:** Use `jest.fn()` to create a "spy" that can track calls to a function or to create a "stub" that replaces a function with a controlled implementation.
3.  **Restore Mocks with `afterEach`:** In your test setup, use `afterEach(() => { jest.restoreAllMocks(); });` to ensure that mocks are reset between tests. This prevents tests from interfering with each other.
4.  **Mock Implementations with `mockImplementation`:** When you need to provide a custom implementation for a mocked function, use `mockImplementation` or `mockReturnValue`.
5.  **Keep Mocks Simple:** Mocks should be as simple as possible. If a mock becomes too complex, it is a sign that the code under test may have too many responsibilities.

## Constraints

- You MUST NOT mock everything. Only mock the dependencies that are necessary to isolate the code under test.
- You MUST NOT mock the code you are trying to test. The purpose of a mock is to control dependencies, not to replace the subject under test.
- You MUST NOT use mocks to test implementation details. Mocks should be used to verify interactions with dependencies, not to assert the internal state of the code under test.
