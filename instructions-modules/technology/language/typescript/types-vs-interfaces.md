---
name: 'Types vs. Interfaces'
description: 'A decision-making guide on when to use type aliases versus interface declarations for defining object shapes.'
tags:
  - typescript
  - types
  - interfaces
  - best-practices
layer: null
---

# Types vs. Interfaces

## Primary Directive

You MUST use the appropriate tool (`type` or `interface`) for defining types in TypeScript based on the specific use case, following a consistent project-wide convention.

## Process

1.  **Use `interface` for Object Shapes and Classes:**
    - When defining the shape of an object or a class, you MUST prefer `interface`.
    - Interfaces support declaration merging, which allows you or third-party packages to extend them. This makes them ideal for defining extensible public APIs.
    - Example: `interface User { id: string; name: string; }`
2.  **Use `type` for Primitives, Unions, and Tuples:**
    - When creating a type alias for a primitive (`string`, `number`), a union (`string | number`), or a tuple (`[string, number]`), you MUST use `type`.
    - `type` is more versatile for defining complex types that are not simple object shapes.
    - Example: `type Status = 'success' | 'error';`
3.  **Consistency is Key:**
    - Within a single project or codebase, you MUST establish and follow a consistent convention. If the project primarily uses `type` for object shapes, continue to do so. If it uses `interface`, follow that pattern.

## Constraints

- Do NOT use `type` to define a shape that is meant to be extended or implemented by a class; use `interface`.
- Do NOT use an `interface` to define a union or tuple type; you MUST use `type`.
- While `type` can be used for object shapes, `interface` is generally preferred for its better error messages and support for declaration merging.
