# UMS v2.2 Specification

This directory contains the specification for UMS v2.2, a non-breaking enhancement release that prepares the runtime for v3.0's structural changes.

## Documents

- **[unified_module_system_v2.2_spec.md](./unified_module_system_v2.2_spec.md)** - Complete v2.2 specification
- **[ums_v2.2_taxonomies.md](./ums_v2.2_taxonomies.md)** - Recommended taxonomies for capabilities, domains, and tags
- **[migration_from_v2.1.md](./migration_from_v2.1.md)** - Migration guide from v2.1 to v2.2

## Key Changes from v2.1

### Non-Breaking Additions

1. **Component Metadata Enhancement**
   - Added optional `id` field to components for stable addressing
   - Added optional `tags` field to components for fine-grained categorization
   - Components can now be individually identified and tagged

2. **Runtime Preparation**
   - Documented 6 atomic primitive types (Procedure, Policy, Evaluation, Concept, Demonstration, Reference)
   - Build tools MAY optionally compile to primitives for vector search
   - URI addressing scheme documented for forward compatibility

3. **Tooling Enhancements**
   - `.d.ts` type definition generation for published modules
   - Improved IDE autocomplete for persona composition
   - Better type checking for module imports

## Philosophy

v2.2 maintains **100% backward compatibility** with v2.1 while adding optional features that:

- Enable advanced tooling and IDE support
- Prepare the ecosystem for v3.0's RAG-optimized architecture
- Provide migration path without forcing changes

## Status

**Current Status**: Draft
**Target Release**: Q1 2025
**Breaking Changes**: None (fully backward compatible with v2.1)

## Next Steps

See [UMS v3.0](../v3.0/) for the next major version with breaking structural changes.
