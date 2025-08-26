---
name: 'Layered Architecture'
description: 'An architectural pattern that organizes software into layers, each with a specific responsibility.'
tier: principle
layer: null
schema: pattern
---

## Summary

Layered architecture is a traditional architectural pattern that organizes software into horizontal layers, each with a specific responsibility. The most common layers are the presentation layer, business logic layer, and data access layer.

## Core Principles

- **Separation of Concerns**: Each layer has a specific responsibility.
- **Hierarchical Dependency**: Dependencies flow in one direction, typically from upper layers to lower layers.

## Advantages / Use Cases

- **Simplicity**: The pattern is easy to understand and implement.
- **Maintainability**: Changes in one layer have a limited impact on other layers.
- **Reusability**: Layers can be reused in different applications.

## Disadvantages / Trade-offs

- **Performance**: Communication between layers can introduce performance overhead.
- **Scalability**: The monolithic nature of the architecture can make it difficult to scale.
- **Tight Coupling**: If not designed carefully, layers can become tightly coupled, making the system difficult to maintain.
