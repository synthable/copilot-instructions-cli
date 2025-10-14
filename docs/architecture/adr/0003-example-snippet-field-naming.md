# ADR 0003: Use `snippet` as Primary Field Name for Example Code

**Status:** Accepted  
**Date:** 2025-10-12  
**Context:** UMS v2.0 Type System

## Decision

The `Example` interface will use `snippet` as the primary field name for code examples, with `code` provided as a deprecated alias for backwards compatibility.

## Context

During the UMS v2.0 type system implementation, we needed to decide on the field name for code examples within the `Example` interface. Two options were considered:

1. **`code`** - Generic, used in many documentation systems
2. **`snippet`** - More specific, commonly used in developer documentation, matches v1.0

## Decision Rationale

We chose `snippet` as the primary field name for the following reasons:

### 1. Developer Familiarity
The term "snippet" is widely recognized in developer documentation contexts:
- Code snippet libraries (GitHub Gists, StackOverflow)
- IDE snippet systems (VS Code snippets, IntelliJ Live Templates)
- Documentation generators (JSDoc `@example`)

### 2. Semantic Clarity
"Snippet" is more semantically specific than "code":
- **Snippet** → A small, focused example of code
- **Code** → Could mean any code (full files, modules, etc.)

The specificity helps users understand that examples should be concise and focused.

### 3. Backwards Compatibility
UMS v1.0 used `snippet`, so maintaining this name provides:
- Zero migration effort for existing v1.0 examples
- Consistent API evolution
- Reduced confusion for existing users

### 4. Naming Consistency
In the UMS module system:
- `body` → Contains module content
- `snippet` → Contains example code
- `format` → Describes data format

The noun-based naming pattern is more consistent than mixing verbs/nouns.

## Implementation

```typescript
export interface Example {
  title: string;
  rationale: string;
  snippet: string;      // Primary v2.0 field
  language?: string;
  code?: string;        // Deprecated alias
}
```

## Consequences

### Positive
- ✅ Intuitive API for developers
- ✅ Aligns with industry conventions
- ✅ Maintains v1.0 compatibility
- ✅ Reduces test fixture migration burden

### Negative
- ⚠️ Diverges from some documentation systems that use `code`
- ⚠️ Requires updating any spec documents that referenced `code`

### Neutral
- The `code` field remains available as an alias, so either name works
- All existing code using `snippet` is immediately correct

## Alternatives Considered

### Alternative 1: Use `code` as Primary
**Rejected** because:
- Would require migrating all v1.0 examples
- Less semantically specific
- Generic naming doesn't add clarity

### Alternative 2: Use Both Equally
**Rejected** because:
- Ambiguity when both are set
- Validation complexity
- Poor developer experience

## Notes

This decision was made during the v1.0 → v2.0 backwards compatibility implementation. The rendering code (`markdown-renderer.ts`) was already using `snippet`, making this a natural choice that required minimal code changes.

## References

- UMS v2.0 Implementation Guide: `docs/ums-v2-lib-implementation.md`
- Type Definitions: `packages/ums-lib/src/types/index.ts`
- Related: ADR 0001 (Standard Library), ADR 0002 (Dynamic TypeScript Loading)
