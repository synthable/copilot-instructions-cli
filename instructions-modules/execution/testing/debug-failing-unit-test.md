---
name: 'Playbook: Debug Failing Unit Test'
description: 'A playbook that uses root-cause-analysis to diagnose a failing test report from Vitest and propose a minimal, correct fix.'
tier: execution
schema: procedure
layer: null
---

## Primary Directive

Given the source code of a failing test and the full error output from the Vitest runner, you MUST perform a root cause analysis and propose a single, minimal code change that resolves the failure.

## Process

1.  **Ingest and State the Problem:**
    a. State the name of the failing test (`describe` and `it` block names).
    b. State the exact error message provided by Vitest (e.g., the `Expected` vs. `Received` diff).
2.  **Analyze the Failure:**
    a. Examine the error message. If it is an assertion failure (`expect` failed), identify the specific mismatch between the expected and actual values.
    b. If it is a runtime error (e.g., `TypeError: Cannot read properties of undefined`), identify the line number and the variable that caused the error.
3.  **Apply Root Cause Analysis:** Follow the `foundation/problem-solving/root-cause-analysis` procedure.
    a. Start with the symptom from the previous step.
    b. Trace the causality backward from the assertion or runtime error into the function's execution path.
    c. Formulate a hypothesis: Is the test's expectation incorrect, or is the source code's logic flawed?
4.  **Formulate a Solution:**
    a. **If the source code is flawed:** Propose a specific, minimal change to the source code logic to correct the behavior.
    b. **If the test is flawed:** Propose a specific, minimal change to the test's `Arrange` step (e.g., incorrect mock setup) or `Assert` step (e.g., incorrect expectation).
5.  **Provide Justification:** Generate a concise, one-to-two sentence explanation of _why_ the proposed change fixes the identified root cause.

## Constraints

- You MUST propose only one logical change. Do not suggest multiple alternative fixes.
- The proposed fix MUST be the minimum change required. Do not include unrelated refactoring.
- Do NOT propose changing a test's expectation to match a buggy output unless the original expectation was demonstrably incorrect based on the feature's requirements.
