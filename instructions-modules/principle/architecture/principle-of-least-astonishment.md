---
name: 'Principle of Least Astonishment'
description: "A rule that a system's components should behave in a way that users expect, without surprising them. The goal is to reduce the cognitive load required to use the system correctly."
tags:
  - architecture
  - design principle
  - usability
  - POLA
---

# Principle of Least Astonishment

## Primary Directive

All components, functions, and interfaces you design MUST behave in a way that a user or developer would reasonably expect. Avoid surprising or counter-intuitive behaviors.

## Process

1.  **Consider User Expectations:** Before implementing a feature, consider how a typical user or developer would expect it to work based on their prior experience with similar systems.
2.  **Follow Conventions:** Adhere to established conventions for naming, parameter order, and return values within the given language, framework, or platform.
3.  **Be Consistent:** Ensure that similar components behave in similar ways. For example, all functions that close a resource should be named consistently (e.g., `close()`, not a mix of `close()`, `shutdown()`, and `release()` for different resources).
4.  **Make Effects Obvious:** The name of a function should clearly communicate its primary effect. A function named `getUser()` should not also delete the user.

## Constraints

- Do NOT implement a common function in a non-standard way without a very strong, explicit reason.
- Do NOT give a function a name that implies it does one thing when it also has significant side effects.
- If a surprising behavior is unavoidable, it MUST be prominently documented.
layer: null
