---
name: 'TypeScript: Effective Generics'
description: 'Best practices for using generics (<T>) to create reusable, type-safe functions, classes, and components.'
tier: technology
schema: specification
layer: null
---

## Core Concept

Generics allow you to create reusable and type-safe functions, classes, and components that can work with a variety of types while maintaining a strong contract between the input and output.

## Key Rules

- You MUST use a generic type parameter (e.g., `<T>`) instead of `any` when a function or component performs the same logic on different types.
- You MUST constrain a generic type using `extends` when your logic needs to access a property or method on that type (e.g., `function getProperty<T, K extends keyof T>(obj: T, key: K)`).

## Best Practices

- **Descriptive Names:** For complex generics, use descriptive names that indicate their purpose (e.g., `<RequestData, ResponseData>`).
- **Minimal Constraints:** Generic constraints MUST be as minimal as possible to allow for maximum flexibility while ensuring type safety.
- **Reusable Types:** Use generics to define reusable type structures, such as a generic API response: `type ApiResponse<T> = { status: 'success'; data: T; }`.

## Anti-Patterns

- Using `any` when a generic type parameter would provide better type safety.
- Using a generic type parameter that is not used to link the types of inputs and outputs. If the type parameter is not used in at least two places, the function is not truly generic.
- Over-constraining a generic type, which limits its reusability unnecessarily.
