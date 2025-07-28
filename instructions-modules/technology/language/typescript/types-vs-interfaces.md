---
name: 'TypeScript: Types vs. Interfaces'
description: 'A decision-making guide on when to use type aliases versus interface declarations for defining object shapes.'
tier: technology
schema: specification
layer: null
---

## Core Concept

In TypeScript, both `type` aliases and `interface` declarations can be used to define the shape of an object. The choice between them depends on the specific use case and the need for extensibility.

## Key Rules

- You MUST use `interface` when defining the shape of an object or a class that is meant to be extended or implemented.
- You MUST use `type` when defining a type alias for a primitive, union, intersection, or tuple.

## Best Practices

- **Prefer `interface` for public APIs:** Use `interface` for defining object shapes that are part of a public-facing API, as they can be extended via declaration merging by consumers.
- **Use `type` for complex types:** Use `type` for more complex type definitions that combine existing types, such as `type Result = Success | Failure;`.
- **Maintain Consistency:** Within a project, adhere to a consistent style. If the existing codebase prefers one over the other for object shapes, follow that convention.

## Anti-Patterns

- Using `type` to define an object shape that you know will need to be extended by a third party.
- Using `interface` to attempt to define a union or tuple type, which is not possible.
