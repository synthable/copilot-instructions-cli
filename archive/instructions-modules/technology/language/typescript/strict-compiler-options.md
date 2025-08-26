---
name: 'TypeScript: Strict Compiler Options'
description: 'A specification for enforcing a strict, safe coding style by enabling advanced TypeScript compiler flags.'
tier: technology
layer: null
schema: specification
---

## Core Concept

To maximize type safety and catch entire classes of errors at compile time, the TypeScript compiler MUST be configured with a comprehensive set of strictness flags.

## Key Rules

- The `"strict": true` flag in `tsconfig.json` MUST be enabled as the baseline for all strictness checks.
- The `"noUncheckedIndexedAccess": true` flag MUST be enabled. This correctly types array and object property access as potentially `undefined`, forcing developers to write safer code.
- When accessing an array element or object property where `noUncheckedIndexedAccess` is active, you MUST perform an explicit check to ensure the value is not `undefined` before using it.

## Best Practices

```typescript
// tsconfig.json includes "noUncheckedIndexedAccess": true
const names = ['Alex', 'Jordan'];
const thirdName = names[2]; // Type is `string | undefined`
if (thirdName) {
  console.log(thirdName.toUpperCase()); // Safe
}
```

## Anti-Patterns

- Accessing an array element by index and assuming it exists without a check. This can lead to runtime errors.
  ```typescript
  // This pattern is forbidden
  const names = ['Alex', 'Jordan'];
  const thirdName: string = names[2];
  console.log(thirdName.toUpperCase()); // TypeError: Cannot read properties of undefined
  ```
