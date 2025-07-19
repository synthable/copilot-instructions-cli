---
tier: principle
name: "YAGNI (You Ain't Gonna Need It)"
description: 'The principle of not adding functionality until it is demonstrably necessary. This avoids over-engineering and wasted effort on features that may not be needed.'
tags:
  - process
  - agile
  - simplicity
  - yagni
layer: null
---

# YAGNI (You Ain't Gonna Need It)

## Primary Directive

You MUST NOT add any functionality, code, or configuration until it is required by a concrete, immediate need. Avoid implementing features based on speculation about the future.

## Process

1.  **Identify the Current Requirement:** Clearly state the problem that needs to be solved right now.
2.  **Implement the Simplest Solution:** Write the simplest possible code that solves the current requirement (see `Keep It Simple (KISS)`).
3.  **Resist Speculative Generalization:** Do not add parameters, configuration options, or architectural layers to support a future use case that does not yet exist.
4.  **Refactor When Necessary:** When a new requirement emerges, refactor the existing simple solution to accommodate it. It is easier to adapt a simple, working system than to predict the future correctly.

## Constraints

- Do NOT add a feature just because you think it might be useful one day.
- Do NOT create abstract classes, complex frameworks, or configurable parameters for problems you do not have yet.
- You MUST be able to justify every piece of code with a current, explicit requirement.
