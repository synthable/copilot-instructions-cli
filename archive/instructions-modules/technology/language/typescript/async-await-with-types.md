---
name: 'TypeScript: Async/Await with Types'
description: 'A guide to correctly typing asynchronous functions and handling Promises to ensure type safety.'
tier: technology
schema: specification
layer: null
---

## Core Concept

In TypeScript, asynchronous operations are typed using the `Promise<T>` generic, where `T` is the type of the value that the promise will resolve with. Correctly typing promises is essential for writing robust, predictable async code.

## Key Rules

- An `async` function MUST always have a return type of `Promise<T>`.
- If an `async` function does not return a value, its return type MUST be explicitly annotated as `Promise<void>`.
- When you `await` a `Promise<T>`, the resulting value will have the type `T`.
- When using `Promise.all()`, the resolved value will be an array of the resolved promise types (e.g., `Promise<[T, U]>` from `Promise.all([Promise<T>, Promise<U>])`).

## Best Practices

- **Explicit Return Types:** Always add an explicit return type annotation to `async` functions. This prevents TypeScript from inferring a potentially incorrect or overly permissive type.
- **Error Handling:** When catching errors in a `try/catch` block, the `error` variable is of type `unknown` by default. You MUST use a type guard to narrow its type before accessing its properties.
- **`Awaited<T>` Utility Type:** Use the `Awaited<T>` utility type to get the resolved type of a promise. This is useful for defining types based on the output of an async function.

## Anti-Patterns

- Forgetting to `await` a promise and attempting to use the `Promise` object itself instead of its resolved value.
- Wrapping the return value of an `async` function in `Promise.resolve()`. The `async` keyword handles this automatically.
- Using `.then()` and `.catch()` in the same `async` function where `await` and `try/catch` would be clearer and more readable.
