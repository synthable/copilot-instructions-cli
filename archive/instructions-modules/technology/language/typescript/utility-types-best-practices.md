---
name: 'TypeScript: Utility Types Best Practices'
description: "A guide to effectively using TypeScript's built-in utility types (Partial, Pick, Omit, Record, etc.) to manipulate and create new types."
tier: technology
schema: specification
layer: null
---

## Core Concept

TypeScript's built-in utility types provide a powerful way to create new types from existing ones without manual redefinition, promoting code that is more maintainable, reusable, and type-safe.

## Key Rules

- You MUST use utility types to derive new types from existing ones instead of creating them manually.
- To make all properties of `T` optional, you MUST use `Partial<T>`.
- To select a subset of properties `K` from `T`, you MUST use `Pick<T, K>`.
- To exclude a subset of properties `K` from `T`, you MUST use `Omit<T, K>`.
- To create a key-value map type, you MUST use `Record<K, T>`.

## Best Practices

- **Clarity:** Choose the utility type that most clearly expresses the intent. `Pick` is often more readable than multiple `Omit`s.
- **Composition:** Combine utility types to create complex transformations (e.g., `Partial<Pick<User, 'name' | 'email'>>`).
- **Function Types:** Use `ReturnType<T>` and `Parameters<T>` to extract types from functions, avoiding manual duplication.

## Anti-Patterns

- Manually creating a new type by copying properties when `Pick` or `Omit` would suffice.
- Defining an object with all optional properties (`?:`) when the intent is better captured by `Partial<T>` applied to a base type.
- Not using `Record<K, T>` for dictionary-like objects, leading to less precise type definitions.
