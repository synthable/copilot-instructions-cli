# ADR-0009: Remove Data Component from UMS v3.0

**Status:** Accepted
**Date:** 2025-11-25
**Deciders:** Jason Knight
**Related:** UMS v3.0 Specification, ADR-0004 (Machine-First Module Architecture)

---

## Context

In UMS v2.0 through v2.2, modules could include a `DataComponent` for storing reference information such as configuration data, schemas, or structured reference content. The component was designed to hold raw data in various formats (JSON, YAML, XML) with minimal contextual information:

```typescript
interface DataComponent {
  type: "data";
  metadata?: ComponentMetadata;
  data: {
    format: string;       // Media type (json, yaml, xml, etc.)
    description?: string; // What this data represents
    value: unknown;       // The actual data
  };
}
```

**Example Usage in v2.2:**
```typescript
data: {
  id: 'config',
  format: 'json',
  description: 'Database configuration',
  value: {
    host: 'localhost',
    port: 5432,
    maxConnections: 20
  }
}
```

While the Data component appeared useful for reference data, practical experience and the introduction of UMS v3.0's architectural improvements revealed fundamental issues that made it incompatible with the system's design goals.

### Problems Identified

1. **No Clear Cognitive Level**
   - The Cognitive Hierarchy (levels 0-6) classifies content by abstraction: from universal axioms (level 0) to meta-cognition (level 6)
   - Raw data does not fit this hierarchy—it is neither instructional, conceptual, nor foundational
   - Data lacks the pedagogical or operational intent that defines all other components

2. **Vector Search Noise**
   - Raw JSON/YAML produces poor-quality embeddings in vector databases
   - Structured data without prose context generates semantically weak vectors
   - Search queries for concepts or instructions return irrelevant data matches
   - Degrades RAG retrieval precision across the entire module ecosystem

3. **No Clear Zone in Layered Cake Assembler**
   - UMS v3.0 introduces the Layered Cake assembler with 4 attention-optimized zones:
     - Zone 0 (Constitution): Policies + Principles
     - Zone 1 (Context): Patterns + Concepts + References
     - Zone 2 (Action): Procedures + Evaluations
     - Zone 3 (Steering): Demonstrations
   - Data component cannot be logically placed in any zone
   - Raw data is neither instructional (Zone 2), conceptual (Zone 1), nor exemplary (Zone 3)

4. **TypeScript Type Safety Hole**
   - The `value: unknown` type eliminates type checking
   - Defeats UMS v2.0+ goal of TypeScript-first type safety
   - Creates runtime errors that should be caught at compile time
   - Incompatible with the typed primitive system in v3.0

5. **Architectural Mismatch**
   - Data component was the only component without clear pedagogical purpose
   - Other components (Foundation, Instruction, Knowledge) teach principles, guide actions, or explain concepts
   - Data simply stores—it doesn't instruct, explain, or guide

---

## Decision

**Remove the `DataComponent` entirely from UMS v3.0.**

Modules may no longer include a `data` field or Data component. All reference information must be presented with appropriate context using existing Knowledge or Foundation components.

### Key Changes

1. **Removed from Module Schema**
   - `data?: DataComponent` removed from Module interface
   - `DataComponent` type removed from component union
   - No primitive mappings for Data component in v3.0

2. **Migration Path Provided**
   - Convert Data to `Knowledge.examples` (Demonstration primitive)
   - Or convert to `Knowledge.concepts` (Concept primitive)
   - Add contextual explanation and rationale

3. **Updated Component Structure**
   - Three core components remain: Foundation, Instruction, Knowledge
   - All components map cleanly to the 7 atomic primitives
   - All primitives have clear Layered Cake zones

---

## Consequences

### Positive

1. **Cleaner Cognitive Hierarchy**
   - All components now fit the 0-6 cognitive level classification
   - No special-case handling for "contentless" components

2. **Improved Vector Search Quality**
   - All embedded content includes prose context and explanation
   - Better semantic relevance in RAG retrieval
   - Reduced false positives in module discovery

3. **Type Safety Restored**
   - No `unknown` types in component structure
   - Full TypeScript inference across all primitives
   - Compile-time validation of module content

4. **Simplified Assembler Logic**
   - All primitives map cleanly to Layered Cake zones
   - No edge cases for "unzoned" content
   - Clearer mental model for module authors

5. **Pedagogical Consistency**
   - All components serve a teaching or guiding purpose
   - Data is always presented with "why" and "how to use"
   - Better learning experience for AI consumers

### Negative

1. **Migration Burden**
   - Existing modules with Data components must be rewritten
   - Requires manual review to add appropriate context
   - Cannot be fully automated (requires human judgment)

2. **Verbosity for Simple Reference Data**
   - Configuration examples now require explanation and rationale
   - More boilerplate than raw JSON in v2.2
   - May feel excessive for obvious data (e.g., port numbers)

3. **No Direct Data Storage**
   - Cannot store machine-readable config without prose wrapper
   - May frustrate users wanting pure key-value storage

---

## Migration Strategy

### For Modules Using Data Component

**Before (v2.2 with Data component):**
```typescript
data: {
  id: 'config',
  format: 'json',
  description: 'Database configuration',
  value: {
    host: 'localhost',
    port: 5432,
    maxConnections: 20
  }
}
```

**After (v3.0 using Knowledge.examples):**
```typescript
knowledge: {
  id: 'setup-examples',
  explanation: 'Configuration examples for database setup',
  examples: [
    {
      title: 'Production Database Configuration',
      rationale: 'Shows recommended production settings with SSL and connection pooling',
      language: 'json',
      snippet: `{
  "host": "db.production.example.com",
  "port": 5432,
  "maxConnections": 20,
  "ssl": true,
  "pooling": {
    "min": 2,
    "max": 10
  }
}`
    }
  ]
}
```

### Alternative: Use Concept for Schema Definitions

**For structural/schema data:**
```typescript
knowledge: {
  id: 'api-schema',
  explanation: 'Data structures for API communication',
  concepts: [
    {
      name: 'UserProfile',
      description: 'User account information structure',
      rationale: 'Standardized across all user-facing endpoints',
      example: `interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
}`
    }
  ]
}
```

### Decision Criteria

| Use Case | Recommended Approach | Rationale |
|----------|---------------------|-----------|
| Configuration examples | `Knowledge.examples` | Show concrete usage with context |
| Schema definitions | `Knowledge.concepts` | Define structure conceptually |
| Large reference data | External files + reference | Keep modules focused |
| Key-value lookup | Wait for Reference RAG | Future dedicated system |

---

## Future Direction

### Reference RAG Strategy (Post-v3.0)

A dedicated "Reference RAG" system may be introduced as a **sidecar tool** for key-value lookup use cases:

- **Separate storage**: Reference data stored outside module files
- **Optimized retrieval**: Direct key-value lookup without vector search
- **No embedding noise**: Reference data excluded from semantic search
- **Typed interfaces**: Full TypeScript support without `unknown` types

This would serve use cases like:
- Large configuration dictionaries
- API reference tables
- Error code mappings
- Translation tables

**Status:** Planned for post-v3.0, pending demand validation

---

## References

- UMS v3.0 Specification: `docs/spec/v3.0/unified_module_system_v3.0_spec.md`
- Migration Guide: `docs/spec/v3.0/migration_from_v2.2.md`, Section 5.3
- UMS v2.2 Data Component: `docs/spec/unified_module_system_v2_spec.md`, Section 2.2.3
- Layered Cake Assembler: UMS v3.0 Specification, Section 4.2
- ADR-0004: Machine-First Module Architecture

---

## Notes

This decision reflects lessons learned from practical usage of UMS v2.x systems. While the Data component appeared useful in theory, its implementation created more problems than it solved. By requiring all content to have clear pedagogical purpose and contextual framing, v3.0 maintains architectural consistency and improves AI consumption quality.

For users needing pure data storage, the recommended approach is to keep reference data in separate configuration files and reference them by name in Knowledge components. This separation of concerns aligns with best practices for both human and machine consumption.
