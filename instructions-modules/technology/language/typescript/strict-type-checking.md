---
name: 'Strict Type-Checking'
description: 'A rule enforcing the use of strict type-checking options in tsconfig.json to catch common errors at compile time.'
tags:
  - typescript
  - configuration
  - quality
  - strict-mode
---

# Strict Type-Checking

## Primary Directive

You MUST enable and adhere to TypeScript's strict mode (`"strict": true`) in the `tsconfig.json` file to ensure maximum type safety and catch a wide range of potential runtime errors at compile time.

## Process

1.  **Enable Strict Mode:** In your `tsconfig.json` file, set the `strict` compiler option to `true`. This enables all strict type-checking options.
2.  **`noImplicitAny`:** You MUST NOT have any variables or parameters with an implicit `any` type. Explicitly type them, or if `any` is truly necessary, declare it as `any`.
3.  **`strictNullChecks`:** You MUST handle `null` and `undefined` explicitly. Check for nullish values before attempting to access their properties. Do not assume a value is present.
4.  **`strictFunctionTypes`:** You MUST ensure that function parameters are checked contravariantly, which provides more accurate and safe function type checking.
5.  **`strictBindCallApply`:** You MUST use the correct types for `this` and parameters when using `bind`, `call`, and `apply`.

## Constraints

- The `"strict": true` flag MUST NOT be disabled in any production-level project.
- Do NOT use the `@ts-ignore` comment to suppress type errors. If a type error exists, you MUST fix the underlying type issue.
- The `any` type should be avoided whenever possible. Use the `unknown` type for values where the type is not known at compile time and perform type-checking before use.
