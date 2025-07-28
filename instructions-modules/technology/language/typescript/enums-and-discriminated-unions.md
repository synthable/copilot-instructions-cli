---
name: 'TypeScript: Enums and Discriminated Unions'
description: 'A guide for using enums and discriminated unions to create type-safe state machines and variant types.'
tier: technology
schema: specification
layer: null
---

## Core Concept

A discriminated union is a powerful pattern for working with objects that can have different shapes. It involves creating a union of types that all share a common, literal property (the "discriminant") which TypeScript can use to narrow down the exact type within the union.

## Key Rules

- A discriminated union MUST be composed of two or more types that are unioned together (`|`).
- Each type in the union MUST have a common property with a unique, literal type (e.g., a string literal like 'success' or a string enum member).
- You MUST use a `switch` statement or a series of `if/else if` statements on the discriminant property to narrow the type.

## Best Practices

- **Use String Literals or String Enums:** Prefer string literals (e.g., `type: 'ADD_ITEM'`) or string enums for the discriminant property, as they are more descriptive than numeric enums.
- **Exhaustiveness Checking:** When using a `switch` statement for narrowing, include a `default` case that throws an error. This ensures that if a new type is added to the union, the compiler will raise an error until all cases are handled.
- **Co-location:** Define the individual variant types and the final union type together for better readability and maintainability.

## Anti-Patterns

- Relying on optional properties (`?`) to differentiate between types in a union. This is not type-safe and is the primary problem that discriminated unions solve.
- Using non-literal types (e.g., `string`, `number`) for the discriminant property, as this prevents TypeScript from performing effective narrowing.
- Forgetting to handle all possible cases in a `switch` statement, which can lead to runtime errors.
