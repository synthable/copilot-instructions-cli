# UMS v1.0 Documentation (Archived)

⚠️ **OUTDATED DOCUMENTATION - ARCHIVED FOR HISTORICAL REFERENCE ONLY**

This directory contains documentation for **UMS v1.0/v1.1** which used a YAML-based format. This version has been **completely superseded** by UMS v2.0, which uses TypeScript-first modules.

## Why This is Archived

The Unified Module System underwent a major breaking change from v1.0 to v2.0:

| v1.0 (This Archive) | v2.0 (Current) |
|--------------------|----------------|
| YAML format (`.module.yml`) | TypeScript format (`.module.ts`) |
| YAML personas (`.persona.yml`) | TypeScript personas (`.persona.ts`) |
| `shape` field (specification, procedure, etc.) | `components` array (Instruction, Knowledge, Data) |
| `meta` block | `metadata` block |
| `body` block with directives | Component-specific structures |
| No export convention | Named exports with camelCase transformation |

## Current Documentation

For up-to-date documentation, see:

- **Official Specification**: `docs/spec/unified_module_system_v2_spec.md`
- **User Guides**: `docs/guides/` (coming soon)
- **Project Overview**: `CLAUDE.md`
- **CLI Reference**: `packages/ums-cli/README.md`

## Historical Value

This documentation is preserved for:
- Understanding the evolution of UMS
- Migration reference for legacy projects
- Historical context for architectural decisions

**Do not use this documentation for current development.**

---

**Archived**: October 2025
**Last Updated**: October 2025 (v1.1 format)
