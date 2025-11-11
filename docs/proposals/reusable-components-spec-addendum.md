### 2.5. Composing Modules from Reusable Components (Proposed Addendum)

While the UMS is designed to compose *modules* into *personas*, the TypeScript-native architecture also supports composing *modules* from reusable *components*. This is a recommended best practice for promoting maintainability and consistency.

#### 2.5.1. Core Principle

Authors SHOULD extract any component (`Instruction`, `Knowledge`, or `Data`) that is intended for reuse in more than one module into its own TypeScript file. Modules can then import and use these shared components.

#### 2.5.2. Implementation Pattern

This pattern uses standard TypeScript `import`/`export` functionality. The UMS build toolchain will automatically resolve these local dependencies.

**Step 1: Define and Export a Reusable Component**

Create a dedicated file for the component (e.g., `*.component.ts`). The component MUST be a typed constant that conforms to a `Component` interface. Use a `Component` suffix in the export name for clarity.

The component's `metadata` block SHOULD include a stable `id` and a semantic `version` to aid discovery and change management.

```typescript
// file: src/components/knowledge/common-rest-principles.component.ts
import type { KnowledgeComponent } from 'ums-lib'; // 'import type' is preferred for type-only imports
import { ComponentType } from 'ums-lib';

// Note the 'Component' suffix on the export name
export const commonRestPrinciplesComponent: KnowledgeComponent = {
  type: ComponentType.Knowledge,
  metadata: {
    id: 'knowledge/rest/common-rest-principles',
    version: '1.0.0', // MUST follow semantic versioning (x.y.z)
    purpose: 'To provide a foundational understanding of REST principles.',
    // Optional: Add deprecation info if this component is superseded
    deprecation: {
      since: '1.1.0',
      replacement: 'knowledge/rest/next-gen-principles',
      note: 'This component is outdated; use next-gen-principles instead.'
    }
  },
  knowledge: {
    explanation: 'REST is an architectural style for designing networked applications...',
    // ... rest of the component definition
  },
};
```

**Step 2: Import and Use the Component in a Module**

In a `.module.ts` file, import the component and place it directly into the `components` array. Note that import paths in TypeScript source are typically extension-less.

```typescript
// file: src/modules/api/rest-api-design.module.ts
import { Module } from 'ums-lib';
import { commonRestPrinciplesComponent } from '../../components/knowledge/common-rest-principles.component';

export const restApiDesign: Module = {
  id: 'api/rest/rest-api-design',
  // ... other metadata
  components: [
    commonRestPrinciplesComponent,
    { /* another component specific to this module */ }
  ],
};
```

#### 2.5.3. Architectural Guidance

**Component Purity and Safety**

To prevent circular dependencies and unexpected side effects, reusable components MUST be **pure data artifacts**.
- **DO NOT** import other modules or module-level code into a component file.
- **DO NOT** include any runtime logic or side effects that execute on import.
- **DO** centralize reusable components in a dedicated directory (e.g., `src/components/`) separate from modules.

**Change Management**

- The `metadata.version` field MUST follow semantic versioning (`major.minor.patch`). Increment the **major** version for any breaking changes.
- When a component is superseded, populate the `metadata.deprecation` object to provide a clear migration path for consumers.

**Validation**

While a full test suite is optional, it is highly recommended to create a lightweight unit test for any reusable component to validate its shape and required metadata (e.g., assert that `metadata.id` and `metadata.version` are present and correctly formatted).

**When to Extract a Component:**

- **High Reusability:** The component is used, or is likely to be used, in two or more modules.
- **High Stability:** The content is foundational and changes infrequently.

**When to Keep a Component Inline:**

- **Low Reusability:** The component is tightly coupled to a single module's purpose.
- **High Volatility:** The component's content is likely to change whenever the parent module changes.
