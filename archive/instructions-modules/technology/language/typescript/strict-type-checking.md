---
name: 'TypeScript: Strict Type-Checking'
description: 'A rule enforcing the use of strict type-checking options in tsconfig.json to catch common errors at compile time.'
tier: technology
schema: specification
layer: null
---

## Core Concept

TypeScript's `strict` mode and its related compiler options enable a suite of type-checking behaviors that lead to more robust and error-free code. Enabling these options is a non-negotiable best practice for professional TypeScript development.

## Key Rules

- The `strict` property in `tsconfig.json`'s `compilerOptions` MUST be set to `true`.
- This master rule implicitly enables all of the following strict mode family options:
  - `noImplicitAny`: Raises an error on expressions and declarations with an implied `any` type.
  - `strictNullChecks`: Differentiates `null` and `undefined` from other types, preventing a wide class of common errors.
  - `strictFunctionTypes`: Ensures contravariant checking for function parameters.
  - `strictBindCallApply`: Enforces stricter checking on the `bind`, `call`, and `apply` methods on functions.
  - `strictPropertyInitialization`: Ensures that each instance property of a class gets initialized in the constructor.
  - `noImplicitThis`: Raises an error on `this` expressions with an implied `any` type.
  - `alwaysStrict`: Parses in strict mode and emits `"use strict"` for each source file.

## Best Practices

- For new projects, `strict: true` MUST be the default from the very first line of code.
- When migrating a legacy JavaScript project, it may be acceptable to disable `strict` initially and enable the sub-rules one by one to manage the refactoring effort.

## Anti-Patterns

- Using `// @ts-ignore` to suppress type errors instead of fixing the underlying type issue.
- Explicitly typing a variable as `any` to bypass type-checking.
- Setting `strict` to `false` in any new, greenfield project.
