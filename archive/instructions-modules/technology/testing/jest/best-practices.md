---
tier: technology
name: 'Jest Best Practices'
description: 'A guide to best practices for writing clean, effective, and maintainable tests with Jest.'
tags:
  - testing
  - jest
  - javascript
  - best-practices
layer: null
---

# Jest Best Practices

## Primary Directive

You MUST write tests that are clear, concise, and reliable. Tests should be easy to understand, maintain, and debug, following the principle that tests are first-class citizens in the codebase.

## Process

1.  **Arrange, Act, Assert (AAA):** Structure your tests using the AAA pattern:
    - **Arrange:** Set up the test environment, including any necessary data, mocks, or stubs.
    - **Act:** Execute the function or component you are testing.
    - **Assert:** Verify that the outcome of the action is what you expected.
2.  **Use `describe` and `it` Clearly:** Use `describe` blocks to group related tests for a specific function or component. Use `it` blocks to describe the specific behavior being tested in a clear, human-readable sentence.
3.  **Avoid Logic in Tests:** Tests should be simple and declarative. Avoid loops, conditional logic, or complex operations within a test. If a test becomes too complex, it is a sign that the code under test may need to be refactored.
4.  **Test One Thing at a Time:** Each `it` block should test a single, specific piece of functionality. This makes it easier to identify the cause of a failure.
5.  **Use `beforeEach` and `afterEach` for Setup/Teardown:** Use `beforeEach` to perform setup that is common to all tests in a `describe` block. Use `afterEach` to clean up any side effects, such as restoring mocks.

## Constraints

- You MUST NOT have tests that depend on the state of other tests. Each test MUST be independent and runnable on its own.
- You MUST NOT test implementation details. Focus on testing the public API and the observable behavior of a component or function.
- You MUST NOT write tests that are tightly coupled to the implementation. This makes the tests brittle and difficult to maintain.
- Avoid using `jest.fn()` without a clear purpose. Mocks should be used to isolate the code under test, not to create complex test logic.
