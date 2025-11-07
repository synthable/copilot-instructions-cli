# ADR-0008: External Graph Tool for Module Dependency Management

**Status**: Planned
**Date**: 2025-11-07
**Replaces**: ModuleRelationships (removed in UMS v2.1)

## Context

In UMS v2.0, module dependencies and relationships were expressed inline within module definitions using the `ModuleRelationships` type. This included fields like `requires`, `conflictsWith`, `enhances`, etc.

In UMS v2.1, `ModuleRelationships` was removed from module definitions for several reasons:
- **Separation of concerns**: Dependency information is metadata about modules, not intrinsic to module content
- **Centralized management**: Dependencies are better managed in a dedicated system that can validate across the entire module ecosystem
- **Flexibility**: External tooling can provide richer querying, visualization, and validation capabilities

## Decision

We will develop an **External Graph Tool** that manages module dependencies and relationships outside of individual module files. This tool will:

1. **Store dependency metadata** in a centralized registry/graph database
2. **Validate persona composition** before build by checking dependency constraints
3. **Provide querying capabilities** for module discovery and relationship traversal
4. **Support the Cognitive Hierarchy** as the primary organizational structure
5. **Integrate with the build process** to ensure valid module compositions

## Planned Architecture

### Core Components

1. **Graph Database/Registry**
   - Stores modules as nodes
   - Relationships as directed edges
   - Supports queries like "what depends on X?" and "are modules A and B compatible?"

2. **Relationship Types** (to be defined)
   - `requires`: Module A needs module B
   - `conflicts_with`: Module A cannot coexist with module B
   - `enhances`: Module A provides additional value when used with module B
   - `supersedes`: Module A replaces deprecated module B
   - Additional types TBD

3. **Validation Engine**
   - Checks persona module lists against dependency constraints
   - Reports conflicts, missing dependencies, and circular references
   - Integrates with UMS SDK build orchestration

4. **CLI/API Interface**
   - Query module relationships
   - Validate persona compositions
   - Generate dependency graphs
   - Register new modules with dependencies

### Integration Points

- **UMS SDK**: Build orchestrator calls validation before persona compilation
- **CLI**: Commands for querying and managing dependencies
- **Module Registry**: Metadata storage alongside module files

## Design Principles

1. **Non-intrusive**: Modules remain self-contained content definitions
2. **Cognitive-first**: Leverage cognitive hierarchy for implicit dependency inference
3. **Explicit when needed**: Allow explicit dependency declarations for special cases
4. **Validatable**: All constraints must be machine-checkable
5. **Discoverable**: Support rich queries for module exploration

## Rationale

### Why External vs Embedded?

**Embedded (v2.0 approach)**:
- ❌ Duplicated information across modules
- ❌ Harder to maintain consistency
- ❌ Limited query capabilities
- ❌ Validation happens too late (during build)

**External (v2.1 approach)**:
- ✅ Single source of truth for dependencies
- ✅ Centralized validation
- ✅ Rich querying and visualization
- ✅ Validation before build attempts
- ✅ Easier to evolve relationship model

### Why Cognitive Hierarchy First?

The cognitive hierarchy (levels 0-6) provides implicit ordering that handles most dependency needs:
- Lower levels (0-2: axioms, reasoning, patterns) have no dependencies
- Higher levels (3-6: domain-specific, procedures) may depend on lower levels
- This natural ordering eliminates need for explicit dependencies in 80%+ of cases

Explicit relationships are only needed for:
- Conflicts between same-level modules
- Enhancement relationships
- Technology-specific dependencies

## Implementation Status

**Status**: Design phase

**Next Steps**:
1. Define complete relationship type taxonomy
2. Choose graph database/storage mechanism
3. Design validation algorithm
4. Prototype CLI interface
5. Integrate with UMS SDK build process
6. Create migration tooling for any existing relationship metadata

**Timeline**: TBD

## References

- UMS v2.1 Specification, Section 5.5
- Cognitive Hierarchy documentation (tier-to-tags migration guide)
- Module composition patterns (to be documented)

## Notes

This ADR serves as a placeholder while detailed design work is in progress. The actual implementation may differ based on design discoveries and community feedback.

For questions or to contribute to design discussions, see [GitHub Issues](https://github.com/synthable/copilot-instructions-cli/issues).
