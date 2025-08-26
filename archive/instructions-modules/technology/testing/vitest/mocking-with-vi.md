---
name: 'Vitest: Mocking with vi'
description: 'A procedure for using the `vi` utility to create mocks for external dependencies, ensuring unit tests are isolated and deterministic.'
tier: technology
layer: null
schema: procedure
---

## Primary Directive

You MUST use the `vi` utility to create mocks for all external dependencies to ensure unit tests are isolated, deterministic, and fast.

## Process

1.  **Identify the Dependency:** Determine the external module or function that needs to be mocked (e.g., an API client, a database utility).
2.  **Mock the Module:** At the top level of your test file (outside of any `beforeEach` or `it` blocks), call `vi.mock()` with the path to the module you want to mock. This replaces all exports of that module with mock functions.
3.  **Provide Mock Implementations (if needed):**
    - To provide a custom return value for a mocked function, use `mocked(dependency.function).mockResolvedValue(value)` for async functions or `.mockReturnValue(value)` for sync functions.
    - To create a simple mock function for a callback, use `vi.fn()`.
4.  **Spy on Existing Methods (for partial mocking):**
    - If you only need to observe calls to a real object's method without replacing its implementation, use `vi.spyOn(object, 'methodName')`.
5.  **Act:** Call the function under test, which will now invoke the mocked dependencies instead of the real ones.
6.  **Assert on Mocks:** Use mock-specific matchers to verify interactions:
    - `expect(mockFunction).toHaveBeenCalled()`
    - `expect(mockFunction).toHaveBeenCalledWith(expected, args)`
    - `expect(mockFunction).toHaveBeenCalledTimes(number)`
7.  **Clean Up Mocks:** In an `afterEach` hook, call `vi.restoreAllMocks()` to reset all spies and restore original implementations, or `vi.clearAllMocks()` to clear call history without restoring implementations.

## Constraints

- Do NOT mock the module or function that is the subject of the test itself.
- You MUST call `vi.mock()` at the top level of the test file's scope, not inside test blocks.
- You MUST include a cleanup hook (e.g., `afterEach(() => { vi.restoreAllMocks(); });`) in any test file that uses `vi.spyOn` to prevent mock state from leaking between tests.
