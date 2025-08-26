---
name: "Don't Repeat Yourself (DRY)"
description: 'The principle of reducing repetition of software patterns, replacing it with abstractions or using data normalization to avoid redundancy.'
tier: principle
layer: null
schema: pattern
---

## Summary

The Don't Repeat Yourself (DRY) principle is aimed at reducing repetition of information of all kinds. It states that every piece of knowledge must have a single, unambiguous, authoritative representation within a system.

## Core Principles

- **Single Source of Truth**: Every piece of knowledge in a system should have one and only one representation.
- **Abstraction**: Repetitive code should be abstracted into functions, classes, or modules that can be reused.

## Advantages / Use Cases

- **Improved Maintainability**: When a change is needed, it only needs to be made in one place.
- **Reduced Errors**: Less code means fewer opportunities for bugs.
- **Improved Readability**: Code becomes cleaner and easier to understand when repetitive logic is abstracted away.

## Disadvantages / Trade-offs

- **Over-Abstraction**: Creating abstractions for everything can lead to code that is difficult to understand and trace.
- **Incorrect Abstraction**: A wrong abstraction can be more costly to fix than duplicated code.
