---
name: 'Playbook: Refactor for Testability'
description: 'A playbook for analyzing a hard-to-test function and refactoring it to use dependency injection, then writing a new unit test using vi.mock.'
tier: execution
schema: procedure
layer: null
---

## Primary Directive

Given a function that is difficult to unit test due to hardcoded internal dependencies, you MUST refactor it to use dependency injection and then provide a new, isolated unit test that uses mocks.

## Process

1.  **Identify Hardcoded Dependencies:** Analyze the source code to find where it directly creates instances of its dependencies (e.g., `const apiClient = new ApiClient()`) instead of receiving them as parameters.
2.  **Propose Refactored Signature:** Propose a new function signature where the hardcoded dependencies are moved to the function's parameter list, allowing them to be injected.
3.  **Generate Refactored Code:** Provide the complete, refactored source code for the function that uses the injected dependencies instead of creating them internally.
4.  **Explain the Refactoring:** Briefly explain that this change applies the Dependency Injection pattern to improve testability, as described in `principle/testing/design-for-testability`.
5.  **Generate an Isolated Unit Test:**
    a. Create a new Vitest test file for the refactored function.
    b. Use `vi.mock()` to create mock versions of the injected dependencies.
    c. In the `Arrange` step of the test, create instances of the mocks.
    d. In the `Act` step, call the refactored function, passing the mock objects as arguments.
    e. In the `Assert` step, verify the function's return value and assert that the mock dependencies were called with the expected parameters (e.g., `expect(mockApiClient.post).toHaveBeenCalledWith(...)`).

## Constraints

- The refactoring MUST NOT change the core business logic of the function.
- The proposed unit test MUST NOT use any real dependencies; all dependencies identified in Step 1 MUST be mocked.
- The final output MUST include both the refactored source code and the new unit test code.
