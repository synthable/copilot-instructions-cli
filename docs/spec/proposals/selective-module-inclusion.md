# Proposal: Selective Module Inclusion for UMS v2.x

**Status**: Approved for Implementation
**Author**: Generated from user feedback
**Date**: 2025-10-13
**Last Reviewed**: 2025-10-13
**Target Version**: UMS v2.1 or v2.2
**Tracking Issue**: TBD

---

## Abstract

This proposal introduces **selective module inclusion** to the Unified Module System (UMS) v2.0, allowing personas to compose partial modules by selecting specific components or capabilities. This enhancement increases module reusability, reduces module proliferation, and provides finer-grained control over persona composition without sacrificing the benefits of atomicity.

---

## Technical Review Summary

**Overall Assessment**: **Highly Recommended for Implementation**

This proposal represents a mature, well-reasoned evolution of the Unified Module System that directly addresses the practical problem of module proliferation while maintaining architectural integrity. The design prioritizes backward compatibility through an opt-in, explicit approach, significantly de-risking its introduction.

### Key Strengths

- **Problem-Solution Fit**: Precisely targets real-world scaling issues identified through usage
- **Architectural Soundness**: Extends rather than replaces the core atomic model
- **Risk Mitigation**: Demonstrates foresight in identifying risks (complexity, validation, dependencies) with reasonable mitigations
- **Phased Rollout**: Pragmatic migration path from v2.1 (core features) to v2.2 (advanced capabilities)

### Implementation Recommendation

**Proceed with phased implementation:**

1. **v2.1 (Initial Release)**: Component-Type and Component-ID selection modes
   - Provides immediate value with manageable complexity
   - Focus on `include`/`exclude` by type and ID
   - Retrofit 5-10 key standard library modules

2. **v2.2 (Enhancement)**: Capability-Driven Filtering
   - Add component-level capability metadata
   - Implement capability-based selection
   - Gather feedback and refine validation heuristics

### Critical Success Factors

- **Documentation**: Module authoring guide must emphasize designing for divisibility
- **Validation**: Build warnings (not errors) for potential incoherence
- **Standard Library**: Retrofit high-value modules to validate real-world utility
- **Community Feedback**: Release v2.1 as experimental feature, stabilize based on usage data

---

## Motivation

### Current Limitation

UMS v2.0 modules are atomic units - when a persona composes a module, it includes **everything**: all capabilities, all components, all content. This design ensures coherence but limits reusability.

**Example Problem:**

```typescript
// A comprehensive error-handling module
export const errorHandling: Module = {
  id: 'error-handling',
  capabilities: ['error-handling', 'logging', 'monitoring', 'alerting'],
  components: [
    { type: ComponentType.Instruction, ... },   // How to handle errors
    { type: ComponentType.Knowledge, ... },     // Error theory and patterns
    { type: ComponentType.Data, ... },          // Error code reference tables
  ]
};
```

**Scenario A**: A persona needs quick error-handling instructions only
**Scenario B**: A persona needs error-handling + logging, but not monitoring
**Scenario C**: A persona needs instruction + data, but not knowledge

**Current Solution**: Create three separate modules (module proliferation)
**Proposed Solution**: Allow selective inclusion from one well-designed module

### Use Cases

1. **Lightweight Personas**: Include only instruction components for quick reference guides
2. **Domain-Specific Filtering**: Include only capabilities relevant to a specific domain
3. **Incremental Adoption**: Start with basic instruction, add knowledge/data as needed
4. **Context Management**: Reduce token usage by excluding unnecessary components
5. **Specialized Roles**: Different personas need different subsets of comprehensive modules

### Benefits

- **Higher Module Reusability**: One module serves multiple use cases
- **Reduced Proliferation**: Fewer tiny, hyper-specific modules
- **Precision Composition**: Get exactly what you need, nothing more
- **Token Efficiency**: Exclude verbose components when not needed
- **Flexibility**: Adjust module usage per persona without duplicating content

---

## Current State (UMS v2.0)

### Module Composition Syntax

```typescript
interface Persona {
  modules: ModuleEntry[]; // Array of module IDs or groups
}

type ModuleEntry = string | ModuleGroup;

interface ModuleGroup {
  group: string;
  ids: string[];
}
```

**Example:**

```typescript
export default {
  name: "Backend Engineer",
  modules: [
    "foundation/ethics/do-no-harm",
    {
      group: "Professional Standards",
      ids: ["principle/testing/test-driven-development", "error-handling"],
    },
  ],
} satisfies Persona;
```

**Result**: All modules are included in their entirety.

---

## Proposed Design

### Design Principles

1. **Backward Compatible**: Existing personas continue to work unchanged
2. **Opt-In**: Default behavior remains atomic inclusion
3. **Explicit**: Selective inclusion must be declared explicitly
4. **Validated**: Build system validates partial modules for coherence
5. **Component-First**: Selection granularity aligns with component architecture

### Extended Module Entry Syntax

```typescript
type ModuleEntry = string | ModuleGroup | SelectiveModuleEntry;

interface SelectiveModuleEntry {
  id: string; // Module ID (required)
  include?: InclusionSpec; // What to include
  exclude?: ExclusionSpec; // What to exclude (alternative syntax)
}

interface InclusionSpec {
  components?: ComponentSelector[]; // Select specific components
  capabilities?: string[]; // Filter by capabilities
}

interface ExclusionSpec {
  components?: ComponentSelector[]; // Exclude specific components
  capabilities?: string[]; // Exclude capabilities
}

type ComponentSelector =
  | ComponentType // By type: 'instruction', 'knowledge', 'data'
  | number // By index: 0, 1, 2
  | string; // By ID (if component has metadata.id)
```

### Selection Modes

#### Mode 1: Component-Type Selection

Select components by type:

```typescript
modules: [
  {
    id: "error-handling",
    include: {
      components: ["instruction", "data"], // Include instruction and data only
    },
  },
];
```

**Result**: Persona gets instruction and data components, excludes knowledge component.

#### Mode 2: Capability-Driven Filtering

Include only components that provide specific capabilities:

```typescript
modules: [
  {
    id: "error-handling",
    include: {
      capabilities: ["error-handling", "logging"], // Only these capabilities
    },
  },
];
```

**Result**: Build system includes only components tagged with matching capabilities.

**Note**: This requires components to declare their own capabilities via `ComponentMetadata`.

#### Mode 3: Index-Based Selection

Select components by array index:

```typescript
modules: [
  {
    id: "error-handling",
    include: {
      components: [0, 2], // First and third components
    },
  },
];
```

**Result**: Include components at indexes 0 and 2 from the module's components array.

#### Mode 4: Exclusion Syntax (Alternative)

Exclude specific parts instead of including:

```typescript
modules: [
  {
    id: "error-handling",
    exclude: {
      components: ["knowledge"], // Exclude knowledge component
    },
  },
];
```

**Result**: Include everything except knowledge component.

### Component Metadata Extension

To support capability-driven filtering, extend `ComponentMetadata`:

```typescript
interface ComponentMetadata {
  id?: string; // Component identifier (NEW)
  purpose?: string;
  context?: string[];
  capabilities?: string[]; // Component-level capabilities (NEW)
}
```

**Example:**

```typescript
components: [
  {
    type: ComponentType.Instruction,
    metadata: {
      id: 'basic-error-handling',
      capabilities: ['error-handling'],
    },
    instruction: { ... }
  },
  {
    type: ComponentType.Knowledge,
    metadata: {
      id: 'error-patterns',
      capabilities: ['error-handling', 'logging'],
    },
    knowledge: { ... }
  },
  {
    type: ComponentType.Data,
    metadata: {
      id: 'http-status-codes',
      capabilities: ['monitoring', 'alerting'],
    },
    data: { ... }
  }
]
```

---

## Examples

### Example 1: Lightweight Reference Guide

```typescript
// Persona for quick reference - instruction only
export default {
  name: "Quick Reference Assistant",
  modules: [
    {
      id: "error-handling",
      include: { components: ["instruction"] },
    },
    {
      id: "api-design",
      include: { components: ["instruction", "data"] },
    },
  ],
} satisfies Persona;
```

### Example 2: Domain-Specific Filtering

```typescript
// Persona needs only logging-related capabilities
export default {
  name: "Logging Specialist",
  modules: [
    {
      id: "error-handling",
      include: { capabilities: ["logging"] },
    },
  ],
} satisfies Persona;
```

### Example 3: Mixed Composition

```typescript
// Mix atomic and selective inclusion
export default {
  name: "Hybrid Persona",
  modules: [
    "foundation/ethics/do-no-harm", // Atomic inclusion
    {
      id: "error-handling",
      include: { components: ["instruction"] }, // Selective inclusion
    },
    {
      group: "Testing",
      ids: ["test-driven-development"], // Atomic group
    },
  ],
} satisfies Persona;
```

### Example 4: Exclude Verbose Components

```typescript
// Exclude knowledge to reduce token usage
export default {
  name: "Concise Assistant",
  modules: [
    {
      id: "error-handling",
      exclude: { components: ["knowledge"] },
    },
  ],
} satisfies Persona;
```

---

## Implementation Details

### Build System Changes

The `BuildOrchestrator` must:

1. **Detect Selective Entries**: Check if `ModuleEntry` is a `SelectiveModuleEntry`
2. **Load Full Module**: Load the complete module from registry
3. **Filter Components**: Apply inclusion/exclusion rules
4. **Validate Coherence**: Ensure partial module is valid
5. **Render Partial Module**: Render only selected components
6. **Report Accurately**: Build report reflects partial inclusion

### Validation Rules

**Pre-Build Validation:**

1. **Component Existence**: Verify selected components exist
2. **Capability Match**: If filtering by capability, at least one component must match
3. **Non-Empty Result**: Selective inclusion must leave at least one component
4. **Index Bounds**: Index-based selection must be within bounds

**Post-Build Validation:**

1. **Coherence Check**: Partial module should make semantic sense
2. **Dependency Check**: Warn if excluded components are referenced by included ones
3. **Capability Accuracy**: Build report lists only included capabilities

### Build Report Format

```typescript
interface ResolvedModule {
  id: string;
  version: string;
  source: string;
  digest: string;
  partial?: PartialInclusionInfo; // NEW: Indicates partial inclusion
}

interface PartialInclusionInfo {
  mode: "include" | "exclude";
  components?: ComponentInfo[];
  capabilities?: string[];
  originalComponentCount: number;
  includedComponentCount: number;
}

interface ComponentInfo {
  type: ComponentType;
  index: number;
  id?: string;
}
```

**Example Build Report:**

```json
{
  "id": "error-handling",
  "version": "1.0.0",
  "source": "standard",
  "digest": "sha256:abc123...",
  "partial": {
    "mode": "include",
    "components": [
      { "type": "instruction", "index": 0 },
      { "type": "data", "index": 2 }
    ],
    "originalComponentCount": 3,
    "includedComponentCount": 2
  }
}
```

---

## Alternatives Considered

### Alternative 1: Module Splitting (Status Quo)

**Approach**: Enforce atomicity by requiring authors to split large modules.

**Example:**

```typescript
// Instead of one module with selective inclusion:
"error-handling-core"; // Just instruction
"error-handling-theory"; // Knowledge
"error-handling-reference"; // Data
```

**Pros:**

- Simple, no spec changes needed
- Clear module boundaries
- Easy to validate

**Cons:**

- Module proliferation
- Increased maintenance burden
- Harder to find related content
- Duplication across similar modules

**Verdict**: Does not scale well for comprehensive modules.

### Alternative 2: Module Variants

**Approach**: Pre-define module variants for common use cases.

**Example:**

```typescript
"error-handling"; // Full module
"error-handling-lite"; // Instruction only
"error-handling-extended"; // Everything + examples
```

**Pros:**

- No selective inclusion complexity
- Curated combinations

**Cons:**

- Exponential growth (N modules → N×M variants)
- Hard to maintain consistency
- Still requires duplication

**Verdict**: Unscalable.

### Alternative 3: Component-Level Modules

**Approach**: Make components themselves the atomic units.

**Example:**

```typescript
modules: [
  "error-handling/instruction",
  "error-handling/knowledge",
  "error-handling/data",
];
```

**Pros:**

- Maximum granularity
- Simple composition

**Cons:**

- Breaks module cohesion model
- Increases registry size
- Component dependencies become module dependencies

**Verdict**: Too radical a departure from UMS principles.

### Alternative 4: Dynamic Composition (Future)

**Approach**: Use a query language or binding system.

**Example:**

```typescript
modules: [
  {
    query: "FROM error-handling WHERE capability IN [logging, monitoring]",
  },
];
```

**Pros:**

- Powerful and expressive
- Future-proof

**Cons:**

- Very high complexity
- Hard to validate statically
- Overkill for most use cases

**Verdict**: Consider for v3.0.

---

## Migration Path

### Phase 1: Spec Extension (v2.1)

1. Update UMS v2.0 spec to define `SelectiveModuleEntry`
2. Add validation rules for selective inclusion
3. Update persona type definitions

**Backward Compatibility**: Existing personas work unchanged.

### Phase 2: Build System Implementation

1. Update `BuildOrchestrator` to handle selective entries
2. Implement component filtering logic
3. Extend build report format
4. Add validation for partial modules

### Phase 3: Tooling and Validation

1. Update CLI to support selective inclusion
2. Add warnings for potentially incoherent partials
3. Update documentation and examples

### Phase 4: Community Feedback

1. Release as experimental feature
2. Gather usage data
3. Refine validation rules
4. Stabilize in v2.2

---

## Drawbacks and Risks

### Complexity

**Risk**: Selective inclusion adds cognitive overhead for module authors and persona composers.

**Mitigation**:

- Keep default behavior atomic
- Provide clear documentation and examples
- Add tooling to suggest optimal selections

### Validation Challenges

**Risk**: Hard to validate that partial modules are semantically coherent.

**Mitigation**:

- Implement heuristic checks (e.g., warn if instruction excluded but knowledge included)
- Encourage authors to design components for independence
- Provide linting tools

### Component Dependencies

**Risk**: Excluded components might be referenced by included ones.

**Example**: Instruction component says "see Knowledge section below" but knowledge is excluded.

**Mitigation**:

- Document best practices for component independence
- Add static analysis to detect cross-component references
- Warn during build if dependencies detected

### Over-Engineering

**Risk**: Feature may be overkill for most use cases.

**Mitigation**:

- Start conservative (component-type selection only)
- Gather usage data
- Expand only if demand exists

---

## Design Decisions

Based on architectural review and real-world usage considerations, the following decisions have been made:

### 1. Capability Filtering: Component-Level ✅

**Decision**: Implement capability filtering at the **component level**.

**Rationale**:

- Module-level filtering is too coarse-grained and defeats the purpose of selective inclusion
- Component-level capabilities enable precise, fine-grained composition
- The `ComponentMetadata.capabilities` extension is a natural fit for the component architecture
- This approach scales better as modules grow in complexity

**Implementation**: Extend `ComponentMetadata` with optional `capabilities` field.

### 2. Component Dependencies: Allow but Warn ⚠️

**Decision**: Allow selective inclusion even when component dependencies might exist, but **warn** during build.

**Rationale**:

- Blocking builds due to potential dependencies is too restrictive
- Many component "dependencies" are soft (nice-to-have context, not hard requirements)
- Build-time warnings give persona authors control and awareness
- A formal `dependsOn: ['component-id']` field in component metadata can be a future enhancement

**Implementation**: Build system should emit warnings like:

```
Warning: The 'instruction' component was included from 'error-handling',
but the 'knowledge' component was excluded. This may result in incomplete context.
```

### 3. Include AND Exclude: Mutually Exclusive 🚫

**Decision**: `include` and `exclude` are **mutually exclusive**. Personas must choose one.

**Rationale**:

- Resolving both simultaneously introduces ambiguity (order of operations, conflicts)
- The marginal expressive gain doesn't justify the complexity
- Clear, unambiguous syntax is better than maximum flexibility

**Implementation**: Validation should error if both `include` and `exclude` are present.

### 4. Module Versioning: Version Applies to Full Module ✅

**Decision**: Partial inclusion does **not** affect the module's semantic version number.

**Rationale**:

- The version number applies to the complete, canonical module content
- Build report's `digest` and `partial` block track the exact composition
- Partial inclusion is a composition concern, not a versioning concern

**Implementation**: Build report includes both `version` (module version) and `partial` (selection metadata).

### 5. Standard Library: Retrofit Key Modules ♻️

**Decision**: Retrofit large, frequently-used standard library modules to support selective inclusion. All new complex modules should be designed for divisibility from the start.

**Rationale**:

- High-value modules like `error-handling`, `api-design`, `testing` benefit most from selective inclusion
- Retrofitting validates the feature's real-world utility
- New modules should adopt best practices (component IDs, capabilities) from day one

**Implementation Priority**:

1. **Phase 1**: Add component IDs and capabilities to 5-10 core modules
2. **Phase 2**: Update module authoring guide with divisibility best practices
3. **Phase 3**: Audit and retrofit additional modules based on usage data

### 6. CLI Ergonomics: Implement After Core 🔧

**Decision**: CLI flag for selective inclusion (e.g., `--partial error-handling:instruction,data`) should be implemented **after** the core build system logic is stable.

**Rationale**:

- Powerful feature for testing and overrides
- Adds another layer of configuration complexity
- Should be built on top of proven build system implementation

**Implementation**: Target for v2.2 after v2.1 stabilizes core functionality.

### 7. Index-Based Selection: Discouraged ⚠️

**Decision**: Support index-based selection for completeness, but **strongly discourage** its use in documentation.

**Rationale**:

- Index-based selection (`components: [0, 2]`) is brittle
- Breaks if module author reorders or inserts components
- Component IDs (`metadata.id`) should always be preferred

**Documentation Guidance**:

```typescript
// ❌ Fragile - breaks if module changes
{ id: 'error-handling', include: { components: [0, 2] } }

// ✅ Robust - stable across module updates
{ id: 'error-handling', include: { components: ['basic-error-handling', 'http-status-codes'] } }
```

---

## Success Metrics

1. **Adoption**: X% of personas use selective inclusion within 6 months
2. **Module Reuse**: Average module reuse count increases by Y%
3. **Persona Size**: Average persona token count decreases by Z%
4. **Module Count**: Growth rate of module count slows
5. **Community Feedback**: Positive reception in surveys and discussions

---

## References

- [UMS v2.0 Specification](./unified_module_system_v2_spec.md)
- [Component Architecture (Spec Section 2.2)](./unified_module_system_v2_spec.md#22-component-architecture)
- [Module Composition (Spec Section 4.2)](./unified_module_system_v2_spec.md#42-composition-block-modules)

---

## Appendix: Full Type Definitions

```typescript
// Extended ModuleEntry
export type ModuleEntry = string | ModuleGroup | SelectiveModuleEntry;

export interface SelectiveModuleEntry {
  /** Module ID */
  id: string;

  /** Inclusion specification (mutually exclusive with exclude) */
  include?: InclusionSpec;

  /** Exclusion specification (mutually exclusive with include) */
  exclude?: ExclusionSpec;
}

export interface InclusionSpec {
  /** Select specific components by type, index, or ID */
  components?: ComponentSelector[];

  /** Filter by capabilities (requires component-level capability metadata) */
  capabilities?: string[];
}

export interface ExclusionSpec {
  /** Exclude specific components by type, index, or ID */
  components?: ComponentSelector[];

  /** Exclude by capabilities */
  capabilities?: string[];
}

export type ComponentSelector =
  | ComponentType // 'instruction' | 'knowledge' | 'data'
  | number // Array index
  | string; // Component ID (if defined in metadata)

// Extended ComponentMetadata
export interface ComponentMetadata {
  /** Component identifier (optional, enables string-based selection) */
  id?: string;

  /** Purpose of this component */
  purpose?: string;

  /** Context where this component is most useful */
  context?: string[];

  /** Component-level capabilities (optional, enables capability filtering) */
  capabilities?: string[];
}

// Extended BuildReportModule
export interface BuildReportModule {
  id: string;
  name: string;
  version: string;
  source: string;
  digest: string;
  deprecated: boolean;
  replacedBy?: string;

  /** Partial inclusion info (if selective inclusion was used) */
  partial?: PartialInclusionInfo;
}

export interface PartialInclusionInfo {
  /** Inclusion or exclusion mode */
  mode: "include" | "exclude";

  /** Components included/excluded */
  components?: ComponentInfo[];

  /** Capabilities used for filtering */
  capabilities?: string[];

  /** Original component count in module */
  originalComponentCount: number;

  /** Components included in build */
  includedComponentCount: number;
}

export interface ComponentInfo {
  /** Component type */
  type: ComponentType;

  /** Component index in original module */
  index: number;

  /** Component ID (if defined) */
  id?: string;

  /** Component capabilities (if defined) */
  capabilities?: string[];
}
```

---

## Implementation Roadmap

### Phase 1: v2.1 Core Features (Q1 2026)

**Scope**: Basic selective inclusion with type and ID-based selection

**Deliverables**:

1. **Spec Updates**
   - Extend UMS v2.0 spec with `SelectiveModuleEntry` type definition
   - Document validation rules for selective inclusion
   - Update persona composition section

2. **Type System**
   - Add `SelectiveModuleEntry`, `InclusionSpec`, `ExclusionSpec` to `ums-lib`
   - Extend `ComponentMetadata` with optional `id` field
   - Update `BuildReport` types with `PartialInclusionInfo`

3. **Build System**
   - Implement selective entry detection in `BuildOrchestrator`
   - Add component filtering logic (type and ID-based)
   - Implement basic coherence validation (warnings)
   - Update markdown renderer to handle partial modules

4. **Standard Library**
   - Retrofit 5 core modules with component IDs:
     - `error-handling`
     - `api-design`
     - `test-driven-development`
     - `clean-architecture`
     - `security-by-design`

5. **Documentation**
   - Update module authoring guide with divisibility best practices
   - Add selective inclusion examples to persona guide
   - Document component ID naming conventions

6. **Testing**
   - Unit tests for selective inclusion logic
   - Integration tests with partial modules
   - Build report validation tests

**Success Criteria**:

- All tests pass
- At least 5 standard library modules support selective inclusion
- Documentation complete
- No regression in existing persona builds

### Phase 2: v2.2 Advanced Features (Q2 2026)

**Scope**: Capability-driven filtering and enhanced tooling

**Deliverables**:

1. **Component Capabilities**
   - Extend `ComponentMetadata` with `capabilities` field
   - Update standard library modules with component-level capabilities
   - Implement capability-based filtering logic

2. **Enhanced Validation**
   - Dependency detection heuristics
   - Improved coherence warnings
   - Static analysis for cross-component references

3. **CLI Enhancements**
   - `--partial` flag for command-line overrides
   - Interactive mode for selecting components
   - Build report viewer with partial inclusion details

4. **Tooling**
   - Linting rules for divisible modules
   - VS Code extension support for selective inclusion
   - Build report analyzer

**Success Criteria**:

- Capability filtering works reliably
- Validation catches common mistakes
- Positive community feedback (>80% satisfaction)
- Adoption rate >25% for new personas

### Phase 3: v2.3 Refinement (Q3 2026)

**Scope**: Based on community feedback and real-world usage

**Potential Features**:

- Formal component dependency declarations (`dependsOn`)
- Advanced composition patterns
- Performance optimizations
- Additional validation rules

---

## Conclusion

Selective module inclusion enhances UMS v2.0's flexibility without sacrificing its core principle of atomic, cohesive modules. By making selective inclusion opt-in and explicit, we preserve backward compatibility while enabling new composition patterns that increase module reusability and reduce token overhead.

This proposal has undergone technical review and is **approved for implementation**. The phased rollout strategy balances the need for this feature with the complexity it introduces, ensuring a stable and well-tested evolution of the Unified Module System.

This proposal positions UMS v2.x for wider adoption by addressing a key limitation identified through real-world usage while maintaining the system's architectural integrity.

**Status**: Ready for implementation. Begin with Phase 1 (v2.1) following the roadmap outlined above.
