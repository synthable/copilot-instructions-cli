---
name: 'Code Organization'
description: 'Principles for structuring a codebase to ensure clarity, logical cohesion, and maintainability.'
tags:
  - quality
  - architecture
  - organization
  - encapsulation
  - dependency management
---

# Code Organization

## Primary Directive

You MUST structure the codebase to be clear, logically organized, and maintainable, with a focus on loose coupling and high cohesion.

## Process

1.  **Logical Cohesion:** Group related functionality together. Files and directories MUST have a clear, focused purpose.
2.  **Encapsulation:** Hide implementation details behind well-defined, minimal interfaces. Minimize the visibility of classes, methods, and variables (e.g., use `private` or `protected` where appropriate).
3.  **Dependency Management:** Control dependencies between modules. High-level modules should not depend on the implementation details of low-level modules. Use dependency injection to keep components loosely coupled.
4.  **Consistent Patterns:** Apply consistent, well-known design patterns throughout the codebase to reduce cognitive load and make the system more predictable.
5.  **Prefer Composition:** Favor composition over inheritance as the primary mechanism for code reuse. Deep inheritance hierarchies often lead to brittle and hard-to-maintain systems.

## Constraints

- Do NOT create "God Objects" or modules that know too much about other parts of the system.
- Do NOT expose internal state or implementation details through public interfaces.
- Avoid circular dependencies between modules.
