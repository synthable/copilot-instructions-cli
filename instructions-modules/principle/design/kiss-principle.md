---
tier: principle
name: 'KISS Principle (Keep It Simple, Stupid)'
description: 'The design principle that states that most systems work best if they are kept simple rather than made complicated.'
tags:
  - kiss
  - simplicity
  - design principle
layer: null
---

# KISS Principle (Keep It Simple, Stupid)

## Primary Directive

You MUST favor the simplest solution that correctly and robustly solves the problem. Avoid unnecessary complexity.

## Process

1.  **Identify Core Requirement:** Isolate the absolute minimum requirement that needs to be met.
2.  **Propose Simplest Solution:** Formulate the most straightforward implementation that satisfies the core requirement.
3.  **Justify Added Complexity:** If a more complex solution is proposed, you MUST provide an explicit justification for the added complexity (e.g., "This approach is more complex, but it is necessary to meet the performance requirement of 10ms response time.").
4.  **Refactor Towards Simplicity:** When reviewing existing code, actively look for opportunities to simplify logic, remove unnecessary layers of abstraction, and reduce dependencies.

## Constraints

- Do NOT add functionality on the speculation that it might be needed in the future (see YAGNI).
- Do NOT choose a complex design pattern if a simpler one suffices.
- Do NOT mistake "clever" or "terse" code for "simple" code. Simple code is easy to understand.
