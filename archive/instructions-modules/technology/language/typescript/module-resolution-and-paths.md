---
name: 'TypeScript: Module Resolution and Path Aliasing'
description: 'A specification for configuring tsconfig.json to use non-relative path aliases, eliminating fragile, relative import paths.'
tier: technology
layer: null
schema: specification
---

## Core Concept

To improve the clarity and maintainability of a large codebase, you MUST use non-relative path aliases defined in `tsconfig.json` to avoid long, fragile relative import paths (e.g., `../../../../services/api`).

## Key Rules

- The `baseUrl` compiler option MUST be set to `"."` or `"src"` to establish the root directory for non-relative module imports.
- The `paths` compiler option MUST be used to create short, absolute aliases for commonly imported directories.
- Path aliases MUST start with a prefix (e.g., `@/`) to avoid conflicts with node modules.

## Best Practices

- The following `tsconfig.json` configuration is the recommended setup. It establishes a base URL and defines a common `@/*` alias to map directly to the `src` directory, promoting clean, absolute imports.
  ```json
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"]
      }
    }
  }
  ```
- Code using this configuration will have clean, readable imports:
  ```typescript
  import { Button } from '@/components/ui/Button';
  import { useUserStore } from '@/stores/userStore';
  ```

## Anti-Patterns

- **Relative Path Hell:** Using long, nested relative paths (e.g., `import { MyService } from '../../../../services/my-service';`). This is fragile and makes refactoring difficult.
- **Bare Aliases:** Using aliases that could conflict with `node_modules` packages (e.g., `"utils/*": ["src/utils/*"]` instead of `"@/utils/*"`).
