---
name: 'TypeScript: Type Guards and Narrowing'
description: 'A guide to using type guards to narrow down the type of a variable within a conditional block.'
tier: technology
schema: specification
layer: null
---

## Core Concept

Type narrowing is the process by which TypeScript can determine a more specific type for a variable within a certain block of code. Type guards are expressions that perform a runtime check that guarantees the type in some scope.

## Key Rules

- You MUST use a type guard when working with a variable of a union type (`string | number`), `any`, or `unknown` to ensure type safety before performing operations on it.
- **`typeof`:** For primitives, you MUST use `typeof` checks (e.g., `if (typeof myVar === 'string')`).
- **`instanceof`:** For class instances, you MUST use `instanceof` checks (e.g., `if (myVar instanceof MyClass)`).
- **`in` operator:** To check for the presence of a property on an object, you MUST use the `in` operator (e.g., `if ('prop' in myVar)`).

## Best Practices

- **Custom Type Guards:** For complex validation, create a custom type guard function with a type predicate return type (e.g., `function isUser(obj: any): obj is User`). This allows you to reuse validation logic while still getting the benefits of type narrowing.
- **`unknown` over `any`:** Prefer `unknown` to `any` for values whose type is not known at compile time. `unknown` forces you to use a type guard before operating on the value, preventing unsafe operations.

## Anti-Patterns

- Using type assertions (`as Type`) to force a type when you are not certain it is correct. This can lead to runtime errors and should be avoided in favor of a proper type guard.
- Performing deep property checks without first verifying the object is not `null` or `undefined`.
