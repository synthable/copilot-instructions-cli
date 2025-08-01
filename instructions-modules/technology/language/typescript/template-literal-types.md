---
name: 'TypeScript: Template Literal Types'
description: 'A specification for using template literal types to create precise, type-safe string unions for events, routes, or other string-based APIs.'
tier: technology
layer: null
schema: specification
---

## Core Concept

Template literal types allow you to combine existing string literal types to create new, more complex string literal types. This is a powerful tool for ensuring type safety in event-driven or routing systems.

## Key Rules

- To enforce type-safety and prevent runtime errors from typos or invalid string values, you MUST use template literal types to model string-based APIs where the string follows a predictable pattern (e.g., `feature:action`).

## Best Practices

- Combine multiple string literal union types to generate a complete, type-safe set of possible event names, preventing typos and ensuring all handled events are valid.

  ```typescript
  type Feature = 'cart' | 'profile';
  type Action = 'add' | 'remove' | 'update';

  type AppEvent = `${Feature}:${Action}`; // e.g., "cart:add", "profile:update"

  function emit(event: AppEvent, payload: unknown) {
    /* ... */
  }

  emit('cart:add', { id: 123 }); // OK
  emit('user:update', {}); // Compile Error! 'user' is not a Feature
  ```

## Anti-Patterns

- Using a generic `string` type for event names when a more precise template literal type could be used.
- Manually writing out every possible event string in a union type when a template literal could generate them programmatically.
