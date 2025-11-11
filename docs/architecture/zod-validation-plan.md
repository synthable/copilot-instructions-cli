# Planning Document: UMS v2 Zod-based Runtime Validation

## 1. Overview & Goals

This document outlines the plan to implement a comprehensive, schema-driven runtime validation layer for the Unified Module System (UMS) v2.0 using Zod.

Currently, validation is delegated to the TypeScript compiler (`tsc --noEmit`), which is insufficient. This new approach aims to:

-   **Decouple Validation:** Separate UMS validation from the TypeScript build process, allowing for language-agnostic module creation and consumption.
-   **Enhance Robustness:** Implement complex domain-specific validation rules (e.g., ID uniqueness, inter-module conflicts) that are not possible with static type-checking alone.
-   **Improve Developer Experience:** Provide clear, context-aware error messages that pinpoint specific issues in modules or personas, accelerating the development cycle.
-   **Centralize Logic:** Create a single source of truth for validation logic within the `ums-lib` package, ensuring consistency across the entire toolchain (SDK, CLI, MCP).

## 2. Core Deliverables

1.  **Zod Schemas:** A complete set of Zod schemas that define the structure, types, and constraints for all UMS v2 entities, including `Module` and `Persona`.
2.  **Validation Engine:** A service within `ums-lib` that uses the Zod schemas to validate raw JavaScript objects, returning a structured result with either the validated data or a detailed error report.
3.  **Toolchain Integration:** Update the `ums-sdk`, `ums-cli`, and `ums-mcp` packages to use the new validation engine during module loading, building, and serving.
4.  **Comprehensive Unit Tests:** A new suite of tests for the validation engine, leveraging existing invalid fixture files to ensure correctness.
5.  **Updated Documentation:** Revisions to developer guides and `README.md` files reflecting the new validation process.

## 3. Proposed Implementation Details

### 3.1. Zod Schema Definition

**Location:** `packages/ums-lib/src/schemas/zod-schemas.ts`

We will define a series of composable Zod schemas that mirror the existing TypeScript types in `instruct-modules-v2/types/index.ts`.

```typescript
// packages/ums-lib/src/schemas/zod-schemas.ts (Illustrative Example)
import { z } from 'zod';

// Regex for UMS IDs: tier/category/name-v2-0
const umsIdRegex = /^[a-z-]+\/[a-z-]+\/[a-z0-9-]+-v\d+-\d+$/;

export const qualityMetadataSchema = z.object({
  maturity: z.enum(['alpha', 'beta', 'stable', 'deprecated']),
  confidence: z.number().min(0).max(1),
  lastVerified: z.string().datetime().optional(),
  experimental: z.boolean().optional(),
});

export const moduleRelationshipsSchema = z.object({
  requires: z.array(z.string().regex(umsIdRegex)).optional(),
  recommends: z.array(z.string().regex(umsIdRegex)).optional(),
  conflictsWith: z.array(z.string().regex(umsIdRegex)).optional(),
  extends: z.string().regex(umsIdRegex).optional(),
});

export const moduleMetadataSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  semantic: z.string().min(1),
  // ... other metadata fields
  relationships: moduleRelationshipsSchema.optional(),
  quality: qualityMetadataSchema.optional(),
});

export const moduleSchema = z.object({
  id: z.string().regex(umsIdRegex),
  version: z.string().semver(),
  schemaVersion: z.literal('2.0'),
  metadata: moduleMetadataSchema,
  // ... other module fields like components
});

export const moduleGroupSchema = z.object({
  group: z.string(),
  ids: z.array(z.string().regex(umsIdRegex)),
});

export const moduleEntrySchema = z.union([
  z.string().regex(umsIdRegex),
  moduleGroupSchema,
]);

export const personaSchema = z.object({
  name: z.string().min(1),
  version: z.string().semver(),
  schemaVersion: z.literal('2.0'),
  modules: z.array(moduleEntrySchema),
  // ... other persona fields
});
```

### 3.2. Validation Engine

**Location:** `packages/ums-lib/src/validation/engine.ts`

A `ValidationEngine` class will be created to provide a simple interface for validation. It will not throw errors but will return a result object, aligning with project conventions.

```typescript
// packages/ums-lib/src/validation/engine.ts (Illustrative Example)
import { z } from 'zod';
import { moduleSchema, personaSchema } from '../schemas/zod-schemas';

type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; errors: z.ZodIssue[] };

export class ValidationEngine {
  public validateModule(data: unknown): ValidationResult<Module> {
    return moduleSchema.safeParse(data);
  }

  public validatePersona(data: unknown): ValidationResult<Persona> {
    // Add cross-field validation beyond schema shape
    const shapeResult = personaSchema.safeParse(data);
    if (!shapeResult.success) {
      return shapeResult;
    }
    
    // Example of a custom check: ensure no duplicate module IDs
    const allIds = shapeResult.data.modules.flatMap(m => typeof m === 'string' ? m : m.ids);
    const uniqueIds = new Set(allIds);
    if (allIds.length !== uniqueIds.size) {
      return {
        success: false,
        errors: [{
          code: z.ZodIssueCode.custom,
          path: ['modules'],
          message: 'Persona contains duplicate module IDs.',
        }],
      };
    }
    
    return shapeResult;
  }
}

export const validator = new ValidationEngine();
```

### 3.3. Toolchain Integration

1.  **`packages/ums-sdk`**: The `ModuleRegistry` and `PersonaLoader` will be modified to pass loaded module/persona objects through the `ValidationEngine` before they are used. If validation fails, a structured error should be thrown.
2.  **`packages/ums-cli`**:
    *   The `build` command will implicitly use the SDK's new validation step. Errors will be caught and printed in a user-friendly format.
    *   The `validate` command will be rewritten to use the `ValidationEngine` directly, providing detailed, verbose output on validation failures.
3.  **`packages/ums-mcp`**: The MCP server will validate modules upon loading to ensure it does not serve malformed module data to clients.

### 3.4. Testing Strategy

1.  **Unit Tests (`packages/ums-lib`):**
    *   Create `zod-schemas.test.ts` to test the schemas with valid and invalid data snippets.
    *   Create `engine.test.ts` to test the `ValidationEngine`.
    *   Port the logic from the invalid YAML fixtures in `tests/fixtures` to be test cases for the new engine (e.g., test that a persona with duplicate IDs fails validation).
2.  **Integration Tests (`packages/ums-cli`):**
    *   Create `validate.test.ts` to test the CLI `validate` command against fixture files.
    *   Update `build.test.ts` to ensure builds fail gracefully with clear error messages when using invalid modules or personas.

## 4. Phased Rollout Plan

-   **Phase 1: Dependency & Schema Implementation**
    1.  Add `zod` as a dependency to `packages/ums-lib`.
    2.  Implement all Zod schemas in `packages/ums-lib/src/schemas/zod-schemas.ts`.
    3.  Achieve passing unit tests for the schemas.

-   **Phase 2: Validation Engine & Unit Testing**
    1.  Implement the `ValidationEngine` in `packages/ums-lib/src/validation/engine.ts`.
    2.  Write comprehensive unit tests, using existing fixtures as test cases.
    3.  Ensure all custom validation logic (e.g., uniqueness checks) is covered.

-   **Phase 3: SDK & CLI Integration**
    1.  Integrate the `ValidationEngine` into `packages/ums-sdk`.
    2.  Update the `packages/ums-cli` commands (`build`, `validate`) to use the new validation logic and provide user-friendly error reporting.
    3.  Write integration tests for the CLI.

-   **Phase 4: Finalization & Cleanup**
    1.  Integrate the validator into `packages/ums-mcp`.
    2.  Update all relevant `README.md` files and other documentation.
    3.  Remove any old, redundant validation logic that is now superseded by the Zod engine.
    4.  Perform a final `npm run quality-check` to ensure project-wide compliance.

## 5. Prerequisites & Dependencies

-   **New Dependency:** `zod`.
-   **Action:** Add `zod` to the `dependencies` section of `packages/ums-lib/package.json`.
