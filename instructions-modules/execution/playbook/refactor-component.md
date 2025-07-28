---
name: 'Refactor a Component'
description: 'A step-by-step process for safely improving the internal structure of a piece of code without changing its external behavior.'
tier: execution
layer: null
schema: procedure
---

## Primary Directive

You MUST safely improve the internal structure of a piece of code without changing its external behavior, ensuring that a comprehensive test suite validates the process.

## Process

1.  **Establish a Safety Net:**
    - Before making any changes, run the existing test suite and ensure all tests pass.
    - If test coverage is inadequate, you MUST first write the necessary tests to cover the component's current behavior. These tests define the contract that your refactoring must not break.
2.  **Identify the "Code Smell":**
    - Clearly identify and state the specific reason for the refactoring. Common reasons include:
      - **Duplicated Code:** Violates the `DRY Principle`.
      - **High Complexity:** A large function or class with too many responsibilities.
      - **Poor Naming:** Unclear or misleading variable and function names.
      - **Poor Testability:** The code has hardcoded dependencies that prevent isolated unit testing.
3.  **Propose a Refactoring Strategy:**
    - Based on the identified smell, propose a specific refactoring pattern.
    - For **Poor Testability**, the strategy MUST be to apply Dependency Injection by moving hardcoded dependencies (e.g., `new ApiClient()`) to the function's parameters.
4.  **Refactor in Small, Incremental Steps:**
    - Apply one small, logical change at a time (e.g., rename a variable, extract a method, inject a dependency).
    - After each small change, run the entire test suite. If any test fails, revert the change and try a different approach.
5.  **Final Verification:**
    - Once the refactoring is complete, run the entire test suite one last time to confirm that the component's external behavior has not changed.

## Constraints

- Refactoring MUST NOT add new functionality.
- Refactoring MUST NOT change the existing functionality.
- You MUST NOT begin refactoring if the existing tests are failing.
- Each small refactoring step MUST leave the code in a working, fully-tested state.
