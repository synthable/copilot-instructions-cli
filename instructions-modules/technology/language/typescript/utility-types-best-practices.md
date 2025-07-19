---
name: 'Utility Types Best Practices'
description: "A guide to effectively using TypeScript's built-in utility types (Partial, Pick, Omit, Record, etc.) to manipulate and create new types."
tags:
  - typescript
  - utility-types
  - types
  - best-practices
layer: null
---

# Utility Types Best Practices

## Primary Directive

You MUST use TypeScript's built-in utility types to create new types from existing ones in a way that is clear, concise, and maintainable. Do not redefine types manually when a utility type can do it for you.

## Process

1.  **For Optional Properties, Use `Partial<T>`:** When you need to create a type where all properties of `T` are optional (e.g., for an update payload), you MUST use `Partial<T>`.
2.  **For Required Properties, Use `Required<T>`:** To create a type where all properties of `T` are required, you MUST use `Required<T>`.
3.  **To Select a Subset of Properties, Use `Pick<T, K>`:** When you need a new type with only a few properties from `T`, you MUST use `Pick<T, 'prop1' | 'prop2'>`.
4.  **To Remove a Subset of Properties, Use `Omit<T, K>`:** When you need a new type with most properties from `T` but want to exclude a few, you MUST use `Omit<T, 'prop1' | 'prop2'>`.
5.  **For Key-Value Maps, Use `Record<K, T>`:** When creating a type for an object with a specific set of keys (`K`) and a uniform value type (`T`), you MUST use `Record<string, number>`.
6.  **To Extract a Type, Use `ReturnType<T>` and `Parameters<T>`:** To get the return type of a function or the types of its parameters as a tuple, you MUST use `ReturnType<typeof myFunction>` or `Parameters<typeof myFunction>`.

## Constraints

- Do NOT manually create a new type by copying properties from another type if `Pick` or `Omit` could be used instead.
- Do NOT define an object with optional properties (`?:`) if the use case is better represented by `Partial<T>`.
- You MUST choose the utility type that most clearly expresses your intent. For example, `Pick` is often clearer than multiple `Omit` calls.
