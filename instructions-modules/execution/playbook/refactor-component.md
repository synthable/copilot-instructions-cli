---
name: 'Refactor a Component'
description: 'A step-by-step process for safely refactoring a piece of code, emphasizing that tests must pass before and after.'
tags:
  - execution
  - playbook
  - refactoring
  - testing
  - quality
---

# Playbook: Refactor a Component

## Primary Directive

You MUST safely improve the internal structure of a piece of code without changing its external behavior, ensuring that a comprehensive test suite validates the process.

## Process

1.  **Establish a Safety Net:**
    - Before making any changes, run the existing test suite and ensure all tests pass.
    - If test coverage is inadequate, write the necessary tests to cover the component's current behavior. These tests define the contract that your refactoring must not break.
2.  **Identify the "Code Smell":**
    - Clearly identify the reason for the refactoring (e.g., duplicated code, a large function, high complexity, poor naming).
3.  **Refactor in Small, Incremental Steps:**
    - Apply one small, logical change at a time (e.g., rename a variable, extract a method).
    - After each small change, run the test suite again. If any test fails, revert the change and try a different approach.
4.  **Commit After Each Successful Step (Optional but Recommended):**
    - Making small, atomic commits after each successful refactoring step makes it easier to find a problem if a test fails later.
5.  **Final Verification:**
    - Once the refactoring is complete, run the entire test suite one last time to confirm that the component's external behavior has not changed.

## Constraints

- Refactoring MUST NOT add new functionality.
- Refactoring MUST NOT change the existing functionality.
- You MUST NOT begin refactoring if the existing tests are failing.
- Each small refactoring step MUST leave the code in a working state.
layer: null
