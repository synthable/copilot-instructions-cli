---
name: 'TypeScript: Types vs. Interfaces'
description: 'A specification outlining the pragmatic conventions for choosing between `type` aliases and `interface` declarations.'
tier: technology
layer: null
schema: specification
---

## Core Concept

A consistent, project-wide convention for using `type` and `interface` improves code clarity and maintainability. The choice depends on the need for extensibility versus constraint.

## Key Rules

- You MUST use `type` for defining the shape of internal application code, such as component props, state, and other non-exported types. Types are preferred for their constrained nature, preventing accidental modification via declaration merging.
- You MUST use `interface` when defining the shape of a public API or any type that is explicitly designed to be extended by consumers, such as a theme object for a library.

## Best Practices

- **Using `type` for application code:**
  ```typescript
  type UserCardProps = {
    userId: string;
    size: 'small' | 'large';
  };
  ```
- **Using `interface` for extensible library code:**

  ```typescript
  // In a third-party library
  interface Theme {
    primaryColor: string;
  }

  // In your own `app.d.ts` file
  declare module 'some-library' {
    interface Theme {
      secondaryColor: string;
    }
  }
  ```

## Anti-Patterns

- Using `interface` for union types (e.g., `type Result = Success | Failure;`), which is not possible.
- Using `type` for a library's public API object shape, which prevents consumers from using declaration merging to augment it.
