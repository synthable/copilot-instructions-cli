---
name: 'Open/Closed Principle'
description: 'Software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification.'
tier: principle
layer: null
schema: pattern
---

## Summary

The Open/Closed Principle states that software entities should be open for extension but closed for modification. This means that you should be able to add new functionality to a system without changing existing code.

## Core Principles

- **Extension**: The behavior of a module can be extended.
- **Modification**: The source code of the module is not changed.

## Advantages / Use Cases

- **Improved Stability**: By not changing existing code, you reduce the risk of introducing new bugs.
- **Enhanced Maintainability**: New functionality can be added with minimal changes to the existing codebase.
- **Increased Flexibility**: The system can be easily adapted to new requirements.

## Disadvantages / Trade-offs

- **Increased Complexity**: Applying the Open/Closed Principle can require more complex designs, using interfaces and abstractions.
- **Over-Engineering**: In simple cases, it might be easier to modify existing code than to create a new abstraction.
