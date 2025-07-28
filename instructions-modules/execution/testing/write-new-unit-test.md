---
name: 'Playbook: Write New Unit Test'
description: 'A step-by-step process for generating a new unit test file for a given source code function, strictly following the Arrange-Act-Assert pattern.'
tier: execution
schema: procedure
layer: null
---

## Primary Directive

Given a source code function and its file path, you MUST generate a complete and correct Vitest unit test file that provides meaningful coverage and adheres to all established principles.

## Process

1.  **Analyze Function Signature:** Ingest the source code. Identify and state the function's name, its input parameters, their types, and the return type.
2.  **Identify Dependencies:** Analyze the function body to identify all external modules or functions it imports and calls. These are candidates for mocking.
3.  **Formulate Test Scenarios:**
    a. Apply the `foundation/reasoning/edge-case-analysis` procedure to the function's inputs to generate a list of boundary conditions.
    b. Define at least one "happy path" scenario using typical, valid inputs.
    c. For each distinct logical branch or `if` statement in the function, define a scenario to test it.
4.  **Structure the Test File:**
    a. Create a `describe` block named after the function being tested.
    b. For each scenario identified in the previous step, create an `it` block with a clear, descriptive name following the "should [expected behavior] when [condition]" format.
5.  **Implement Each Test Case:** For each `it` block, you MUST follow the `principle/testing/arrange-act-assert-pattern`:
    a. **Arrange:** Set up all preconditions. Instantiate necessary classes, create test data (using fixtures where available), and configure any required mocks using `vi.mock`.
    b. **Act:** Call the function under test exactly once with the inputs for the current scenario.
    c. **Assert:** Use `expect()` to assert that the outcome of the "Act" step matches the expected result for the scenario. Assertions MUST be specific and check for both return values and any expected side effects (e.g., mock function calls).
6.  **Generate Final Code:** Assemble the complete test file, including all necessary imports (`vi`, `describe`, `it`, `expect`, the function under test, and any mocked modules).

## Constraints

- Do NOT write any test logic outside of an `it` or `test` block.
- Every generated test file MUST include the necessary imports from `vitest`.
- If external dependencies are identified, they MUST be mocked using `vi.mock` to ensure test isolation.
- All generated tests MUST follow the Arrange-Act-Assert structure, separated by blank lines for clarity.
