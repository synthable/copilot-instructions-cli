---
name: 'TypeScript: Module Resolution and Paths'
description: 'A guide to configuring tsconfig.json for robust module resolution and path aliasing.'
tier: technology
schema: specification
layer: null
---

## Core Concept

Module resolution is the process the TypeScript compiler uses to figure out what an import refers to. Properly configuring module resolution and using path aliases in `tsconfig.json` is critical for creating a maintainable, large-scale project by eliminating fragile, relative import paths. To improve the clarity and maintainability of a large codebase, you MUST use non-relative path aliases defined in `tsconfig.json` to avoid long, fragile relative import paths (e.g., `../../../../services/api`).

## Key Rules

- The `moduleResolution` compiler option MUST be set to `"NodeNext"` or `"Node"` for modern Node.js projects to correctly handle file extensions and package entry points.
- The `baseUrl` compiler option MUST be set to `"."` or `"src"` to establish the root directory for non-relative module imports.
- The `paths` compiler option MUST be used to create short, absolute aliases for commonly imported directories. Path aliases MUST start with a prefix (e.g., `@/`) to avoid conflicts with node modules.

## Best Practices

- The following `tsconfig.json` configuration represents the gold standard for a modern TypeScript project. It establishes a base URL and defines a common `@/*` alias to map directly to the `src` directory, promoting clean, absolute imports.

  ```json
  {
    "compilerOptions": {
      "module": "NodeNext",
      "moduleResolution": "NodeNext",
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"]
      }
    }
  }
  ```

## Anti-Patterns

- **Relative Path Hell:** Using long, nested relative paths (e.g., `import { MyService } from '../../../../services/my-service';`). This is fragile and makes refactoring difficult.
- **Implicit `baseUrl`:** Relying on an implicit `baseUrl`, which can lead to unpredictable import resolution.
- **Missing `paths`:** Not using `paths` for common directories, leading to inconsistent and verbose import statements.
- **Multiple Alias Prefixes:** Do not use multiple, inconsistent prefixes (e.g., `~`, `#`, `@`) in the same project.
- **Bare Aliases:** Using aliases that could conflict with `node_modules` packages (e.g., `"utils/*": ["src/utils/*"]` instead of `"@/utils/*"`).
