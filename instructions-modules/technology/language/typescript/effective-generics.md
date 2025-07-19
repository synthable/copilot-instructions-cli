---
tier: technology
name: 'Effective Generics'
description: 'Best practices for using generics (<T>) to create reusable, type-safe functions, classes, and components.'
tags:
  - typescript
  - generics
  - types
  - reusability
layer: null
---

# Effective Generics

## Primary Directive

You MUST use generics to create reusable and type-safe functions, classes, and components that can work with a variety of types while maintaining a strong contract between the input and output.

## Process

1.  **Identify the Need for a Generic:** When you have a function or component that performs the same logic on different types, you MUST use a generic type parameter (e.g., `<T>`) instead of `any` or creating multiple overloads.
2.  **Use Descriptive Generic Names:** For simple generics, `T`, `U`, and `K` are acceptable. For more complex generics, use descriptive names that indicate their purpose, such as `<RequestData, ResponseData>`.
3.  **Use Generic Constraints:** When your generic function needs to access a property or method, you MUST constrain the generic type using the `extends` keyword. This ensures that any type passed to the generic will have the required shape.
    - Example: `function getProperty<T, K extends keyof T>(obj: T, key: K)`
4.  **Use Generics in Type Definitions:** Use generics to define reusable type structures, such as a generic API response.
    - Example: `type ApiResponse<T> = { status: 'success'; data: T; } | { status: 'error'; error: string; };`

## Constraints

- Do NOT use `any` when a generic type parameter would provide better type safety.
- Do NOT use a generic type if the function does not use the type in a way that creates a link between the input and output. If the type is not used, the function is not truly generic.
- Generic constraints MUST be as minimal as possible to allow for maximum flexibility while ensuring type safety.
