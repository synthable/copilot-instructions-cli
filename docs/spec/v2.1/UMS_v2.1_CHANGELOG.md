# UMS v2.1 Spec Update Changelog

## Summary of Changes

This document summarizes the changes made to the UMS v2.1 specification based on the efficiency review.

---

## 1. `semantic` Field — Now Optional, Auto-Generated

**Before:**

```typescript
metadata: {
  semantic: string; // Required - manually written
}
```

**After:**

```typescript
metadata: {
  semantic?: string; // Optional - override for auto-generated content
}
```

**Build-time behavior:**

```typescript
const generatedSemantic = [
  module.metadata.name,
  module.metadata.description,
  module.capabilities.join(", "),
  module.metadata.tags?.join(", ") ?? "",
  module.instruction?.purpose ?? "",
  module.knowledge?.explanation ?? "",
]
  .filter(Boolean)
  .join(" ");
```

**Spec sections updated:** 2.3, 6.1, 6.1.1

---

## 2. DataComponent — Removed

**Before:** Three component types (Instruction, Knowledge, Data)

**After:** Two component types (Instruction, Knowledge)

**Rationale:**

- Semantic ambiguity between Data and Knowledge
- `value: unknown` indicated unclear structure
- Minimal rendering value (just a code block)
- Use cases can migrate to Knowledge.examples or Instruction.criteria

**Spec sections updated:** 1.1, 2.1, 2.2, all component references

---

## 3. Examples — Unified to `Array<string | Example>`

**Before:**

```typescript
// Concept.examples
examples?: string[];

// Pattern.example (singular!)
example?: Example;

// Knowledge.examples
examples?: Example[];
```

**After:**

```typescript
// All use the same type
examples?: Array<string | Example>;
```

**Spec sections updated:** 3.4 (Concept), 3.6 (Pattern), 2.2 (Knowledge), 6.3.4, 6.3.6

---

## 4. Constraint — Grouped Structure (Replaces `category` Field)

**Before:**

```typescript
type Constraint =
  | string
  | {
      rule: string;
      category?: string; // Per-item category (verbose)
      notes?: string[];
    };
```

**After:**

```typescript
interface ConstraintObject {
  rule: string;
  notes?: string[];
}

interface ConstraintGroup {
  group: string; // Group name renders as ### heading
  rules: Array<string | ConstraintObject>;
}

type ConstraintEntry = string | ConstraintObject | ConstraintGroup;
```

**Usage:**

```typescript
constraints: [
  // Ungrouped
  "All code MUST be reviewed",

  // Grouped (no per-item duplication)
  {
    group: "Security",
    rules: [
      "MUST use HTTPS",
      "MUST validate input",
      {
        rule: "MUST NOT log secrets",
        notes: ["Good: { userId }", "Bad: { password }"],
      },
    ],
  },
];
```

**Reusable via import:**

```typescript
// shared/constraints/security.ts
export const SECURITY_CONSTRAINTS: ConstraintGroup = {
  group: "Security",
  rules: ["MUST use HTTPS", "MUST validate input"]
};

// my-module.module.ts
import { SECURITY_CONSTRAINTS } from "../shared/constraints/security.ts";
constraints: [SECURITY_CONSTRAINTS, ...]
```

**Spec sections updated:** 3.2, 6.3.2

---

## 5. Criterion — Grouped Structure (Replaces `category` Field)

**Before:**

```typescript
type Criterion =
  | string
  | {
      item: string;
      category?: string; // Per-item category (verbose)
      notes?: string[];
    };
```

**After:**

```typescript
interface CriterionObject {
  item: string;
  notes?: string[];
}

interface CriterionGroup {
  group: string; // Group name renders as ### heading
  items: Array<string | CriterionObject>;
}

type CriterionEntry = string | CriterionObject | CriterionGroup;
```

**Usage:**

```typescript
criteria: [
  // Ungrouped
  "All tests pass",

  // Grouped
  {
    group: "Security",
    items: [
      "HTTPS enforced",
      { item: "Rate limiting active", notes: ["Test: 100 req/min"] },
    ],
  },
];
```

**Spec sections updated:** 3.3, 6.3.3

---

## 6. Export Naming — Relaxed + Single Module Requirement

**Before:**

> The export name MUST match a camelCase transformation of the module ID's final segment

**After:**

- Export name is a convention, not requirement
- Module `id` field is the source of truth
- **Each file MUST export exactly one Module object** (prevents collisions)
- Additional exports (shared arrays, types, helpers) permitted

**Valid examples:**

```typescript
// All valid for module ID "error-handling"
export const errorHandling: Module = { id: "error-handling", ... };
export const errorHandlingModule: Module = { id: "error-handling", ... };

// Valid: co-export shared arrays
export const SECURITY_CONSTRAINTS: ConstraintGroup = { ... };
export const myModule: Module = { id: "my-module", ... };

// INVALID: multiple Module exports
export const v1: Module = { ... };
export const v2: Module = { ... };  // ❌ Use separate files
```

**Spec sections updated:** 2.1.1

---

## 7. Metadata — Nested Under Sub-Objects

**Before:**

```typescript
metadata: {
  name: string;
  description: string;
  semantic: string;
  tags?: string[];
  license?: string;        // Top-level
  authors?: string[];      // Top-level
  homepage?: string;       // Top-level
  deprecated?: boolean;    // Top-level
  replacedBy?: string;     // Top-level
}
```

**After:**

```typescript
metadata: {
  name: string;
  description: string;
  semantic?: string;  // Now optional
  tags?: string[];

  attribution?: {           // Nested
    license?: string;
    authors?: string[];
    homepage?: string;
  };

  lifecycle?: {             // Nested
    deprecated?: boolean;
    replacedBy?: string;
  };
}
```

**Spec sections updated:** 2.3

---

## 8. Build Report — Removed `composedFrom`

**Before:**

```typescript
interface ResolvedModule {
  id: string;
  version: string;
  source: string;
  digest: string;
  composedFrom?: CompositionEvent[]; // Complex merge tracking
}
```

**After:**

```typescript
interface ResolvedModule {
  id: string;
  version: string;
  source: string;
  digest: string;
  // composedFrom removed - vestigial after ModuleRelationships removal
}
```

**Spec sections updated:** 7.3, 7.4

---

## 9. Pattern.example → Pattern.examples (Plural)

**Before:**

```typescript
interface Pattern {
  // ...
  example?: Example; // Singular, one example max
}
```

**After:**

```typescript
interface Pattern {
  // ...
  examples?: Array<string | Example>; // Plural, multiple allowed
}
```

**Spec sections updated:** 3.6, 6.3.6

---

## Migration Guide

### For Module Authors

1. **Remove `semantic` field** (unless you need specific override)
2. **Migrate Data components:**
   - Checklists → `criteria` with groups
   - Reference data → `knowledge.examples`
   - Schemas → External files or documentation
3. **Update metadata structure:**

   ```typescript
   // Before
   metadata: { license: "MIT", deprecated: true }

   // After
   metadata: {
     attribution: { license: "MIT" },
     lifecycle: { deprecated: true }
   }
   ```

4. **Migrate per-item categories to groups:**

   ```typescript
   // Before
   constraints: [
     { rule: "MUST use HTTPS", category: "Security" },
     { rule: "MUST validate input", category: "Security" },
   ];

   // After
   constraints: [
     {
       group: "Security",
       rules: ["MUST use HTTPS", "MUST validate input"],
     },
   ];
   ```

5. **Update Pattern examples** (now plural, supports arrays)
6. **Ensure single Module export per file**

### For Tool Implementers

1. **Semantic generation:** Implement build-time concatenation
2. **Group rendering:** Update renderers for `ConstraintGroup` and `CriterionGroup`
3. **Remove Data component handling** from renderers
4. **Update build report schema** (remove `composedFrom`)
5. **Validate single Module export per file**

---

## Type Definition Summary

```typescript
// ProcessStep
type ProcessStep = string | { step: string; notes?: string[] };

// Constraint types
interface ConstraintObject {
  rule: string;
  notes?: string[];
}

interface ConstraintGroup {
  group: string;
  rules: Array<string | ConstraintObject>;
}

type ConstraintEntry = string | ConstraintObject | ConstraintGroup;

// Criterion types
interface CriterionObject {
  item: string;
  notes?: string[];
}

interface CriterionGroup {
  group: string;
  items: Array<string | CriterionObject>;
}

type CriterionEntry = string | CriterionObject | CriterionGroup;

// Example and unified examples
interface Example {
  title: string;
  rationale: string;
  snippet: string;
  language?: string;
}

// All examples now: Array<string | Example>

// Metadata
interface Attribution {
  license?: string;
  authors?: string[];
  homepage?: string;
}

interface Lifecycle {
  deprecated?: boolean;
  replacedBy?: string;
}

interface ModuleMetadata {
  name: string;
  description: string;
  semantic?: string; // Optional, auto-generated
  tags?: string[];
  attribution?: Attribution;
  lifecycle?: Lifecycle;
}
```
