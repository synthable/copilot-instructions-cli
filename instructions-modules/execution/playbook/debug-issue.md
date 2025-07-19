---
name: 'Debug an Issue'
description: 'A systematic playbook for debugging, leveraging foundational modules like root-cause-analysis and causal-reasoning.'
tags:
  - execution
  - playbook
  - debugging
  - root-cause-analysis
---

# Playbook: Debug an Issue

## Primary Directive

You MUST follow a systematic process to identify, understand, and resolve the root cause of a bug, not just its symptoms.

## Process

1.  **Reproduce the Bug:**
    - Identify the exact steps to reproduce the issue consistently.
    - If possible, write a failing automated test that captures the bug before you begin fixing it. This test will serve as your validation.
2.  **Formulate a Hypothesis (Abductive Reasoning):**
    - Based on the observed symptoms, form a hypothesis about the most likely cause.
    - Ask: "What is the simplest explanation for why this is failing?"
3.  **Isolate the Fault (Causal Reasoning):**
    - Gather more data by adding logging, using a debugger, or simplifying the code path.
    - Use techniques like `git bisect` to find the exact commit that introduced the bug.
    - Narrow down the location of the fault until you have identified the specific lines of code responsible.
4.  **Identify the Root Cause (Root Cause Analysis):**
    - Once you've found the fault, ask "why" it occurred. Was it a typo? A flawed logical assumption? A misunderstanding of an API?
    - Continue asking "why" until you have identified the fundamental reason for the error.
5.  **Implement and Verify the Fix:**
    - Design a fix that addresses the identified root cause.
    - If you wrote a failing test in step 1, ensure your fix makes it pass. If not, write a test now.
    - Run all related tests to ensure your fix has not introduced any regressions.

## Constraints

- Do NOT fix only the symptom. A fix MUST address the root cause.
- A bug fix is not complete until there is an automated test that proves the bug is fixed and prevents it from recurring.
- Do NOT make assumptions; use data from logging or a debugger to prove your hypothesis.
layer: null
