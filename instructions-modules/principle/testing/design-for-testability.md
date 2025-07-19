---
name: 'Design for Testability'
description: 'The principle of designing components to be easily testable in isolation.'
tags:
  - quality
  - testing
  - tdd
  - design principle
---

# Design for Testability

## Primary Directive

You MUST design components to be loosely coupled and easily testable in isolation, without requiring a live database, network, or other external systems.

## Process

1.  **Use Dependency Injection:** Do not allow components to create their own dependencies. Instead, "inject" dependencies (e.g., as constructor arguments or function parameters).
2.  **Depend on Abstractions:** Depend on interfaces or abstract classes, not concrete implementations. This allows for "mock" or "stub" implementations to be used during testing.
3.  **Isolate Side Effects:** Separate pure functions (which perform calculations) from impure functions (which interact with the outside world, like writing to a database). Pure functions are trivial to test.
4.  **Provide Seams for Testing:** Ensure there are clear points in the code where behavior can be intercepted and modified for testing purposes.

## Constraints

- Do NOT instantiate concrete dependencies directly within a class or function (e.g., `new DatabaseConnection()`).
- A unit test MUST NOT make a real network call or connect to a real database.
layer: null
