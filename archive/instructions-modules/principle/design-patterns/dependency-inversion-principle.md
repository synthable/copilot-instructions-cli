---
name: 'Dependency Inversion Principle'
description: 'High-level modules should not depend on low-level modules. Both should depend on abstractions.'
tier: principle
layer: null
schema: pattern
---

## Summary

The Dependency Inversion Principle states that high-level modules should not depend on low-level modules; both should depend on abstractions. Abstractions should not depend on details; details should depend on abstractions.

## Core Principles

- **Decoupling**: High-level modules, which contain complex logic, should be independent of low-level modules, which handle basic operations.
- **Abstraction**: Both high-level and low-level modules should depend on the same abstractions (e.g., interfaces).

## Advantages / Use Cases

- **Increased Flexibility**: It is easier to replace low-level modules without affecting high-level modules.
- **Improved Testability**: High-level modules can be tested in isolation by using mock implementations of the abstractions.
- **Enhanced Reusability**: Modules that depend on abstractions are easier to reuse in different contexts.

## Disadvantages / Trade-offs

- **Increased Complexity**: The use of abstractions and dependency injection can add complexity to the codebase.
- **More Code**: It often requires writing more code to create the abstractions and manage the dependencies.
