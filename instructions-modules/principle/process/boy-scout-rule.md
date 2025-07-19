---
name: 'Boy Scout Rule'
description: 'The principle that one should always leave the codebase cleaner than they found it. This encourages continuous, incremental improvement of code quality.'
tags:
  - process
  - quality
  - refactoring
  - clean code
---

# Boy Scout Rule

## Primary Directive

Whenever you work on a piece of code, you MUST leave it in a better state than you found it.

## Process

1.  **Identify the Primary Task:** Focus on completing your main task (e.g., fixing a bug, adding a feature).
2.  **Identify Small Improvements:** While working, identify small, related opportunities for cleanup. This could include:
    - Improving a variable name.
    - Breaking a large function into smaller ones.
    - Removing a small piece of duplicated code.
    - Adding a missing comment or clarifying an existing one.
3.  **Make the Improvement:** Make the small improvement as part of your primary task. The cleanup should be related to the code you are already touching.
4.  **Commit the Improvement:** The small cleanup is committed along with the main feature or bug fix.

## Constraints

- The cleanup MUST be small and related to the code you are already working on.
- Do NOT embark on a large-scale refactoring under the guise of the Boy Scout Rule.
- The primary goal is still to complete your original task; the cleanup is a secondary benefit.
layer: null
