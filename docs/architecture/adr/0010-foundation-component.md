# ADR-0010: Foundation Component for Philosophical and Architectural Layer

**Status**: Accepted
**Date**: 2025-11-25
**Version**: UMS v3.0

## Context

UMS v2.2 organized module content into three components:

1. **Instruction**: Execution directives (purpose, principles, process, constraints, criteria)
2. **Knowledge**: Educational content (explanation, patterns, concepts, examples)
3. **Data**: Reference information (structured data)

This architecture had a fundamental design flaw: **principles** and **patterns** were misplaced within components designed for different purposes.

### Problems with v2.2 Component Assignment

**Principles in Instruction Component:**
- Principles are high-level philosophical guidelines ("Use SOLID principles", "Follow Twelve-Factor App")
- Instruction component is focused on concrete execution (process steps, constraints, success criteria)
- Mixing philosophy with procedures created semantic confusion
- Principles function as **semantic pointers** to activate LLM latent knowledge, not execution directives
- Example misalignment: "Adhere to SOLID principles" is philosophically different from "Run tests before commit"

**Patterns in Knowledge Component:**
- Patterns are architectural solutions and design approaches
- Knowledge component is focused on education (concepts, examples)
- Patterns represent **how to structure systems**, not just information to learn
- Example misalignment: "Repository Pattern" describes architecture, not just a concept to understand

### The Missing Layer

Both principles and patterns represent a distinct category of content that sits **above** execution and education:

- **Foundation**: The philosophical and architectural baseline
- **Instruction**: How to execute tasks
- **Knowledge**: What to understand

The v2.2 architecture lacked explicit representation of the foundational layer where system philosophy and architecture are defined.

## Decision

Add **Foundation** as a fourth component type in UMS v3.0, then migrate principles and patterns from their previous locations.

### New Component Architecture

```typescript
interface FoundationComponent {
  type?: "foundation";
  id?: string;                    // Component ID for URI addressing
  tags?: string[];                // Component-level tags
  principles?: string[];          // High-level philosophical guidelines
  patterns?: Pattern[];           // Architectural solutions and patterns
}
```

### Migration from v2.2

1. **Extract principles** from `Instruction.principles` → `Foundation.principles`
2. **Extract patterns** from `Knowledge.patterns` → `Foundation.patterns`
3. **Refocus components**:
   - Instruction: Pure execution (process, constraints, criteria)
   - Knowledge: Pure education (concepts, examples)
   - Foundation: Pure philosophy and architecture (principles, patterns)

### Example Migration

**v2.2 Module (Before):**
```typescript
export const authModule: Module = {
  id: 'auth',
  schemaVersion: '2.2',

  instruction: {
    purpose: 'Implement secure authentication',
    principles: [                              // ← Misplaced
      'Use HTTPS for all authentication',
      'Follow defense in depth',
      'Apply principle of least privilege'
    ],
    process: [...],
    constraints: [...]
  },

  knowledge: {
    explanation: 'Authentication concepts...',
    patterns: [                                // ← Misplaced
      {
        name: 'Token-based Authentication',
        useCase: 'Stateless API authentication',
        description: 'Use JWT tokens...'
      }
    ],
    concepts: [...],
    examples: [...]
  }
};
```

**v3.0 Module (After):**
```typescript
export const authModule: Module = {
  id: 'auth',
  schemaVersion: '3.0',

  foundation: {                                // ← NEW
    id: 'security-baseline',
    principles: [                              // ← Moved from instruction
      'Use HTTPS for all authentication',
      'Follow defense in depth',
      'Apply principle of least privilege'
    ],
    patterns: [                                // ← Moved from knowledge
      {
        name: 'Token-based Authentication',
        useCase: 'Stateless API authentication',
        description: 'Use JWT tokens...'
      }
    ]
  },

  instruction: {
    id: 'implementation',
    purpose: 'Implement secure authentication',
    // principles removed - now pure execution
    process: [...],
    constraints: [...]
  },

  knowledge: {
    id: 'education',
    explanation: 'Authentication concepts...',
    // patterns removed - now pure education
    concepts: [...],
    examples: [...]
  }
};
```

## Rationale

### 1. Separation of Concerns

The Foundation component enforces clear boundaries:

| Component    | Purpose                          | Content Type                  |
|--------------|----------------------------------|-------------------------------|
| Foundation   | Philosophy & Architecture        | Principles, Patterns          |
| Instruction  | Execution & Verification         | Process, Constraints, Criteria|
| Knowledge    | Education & Demonstration        | Concepts, Examples            |

Each component now has a single, well-defined responsibility.

### 2. Alignment with Layered Cake Assembler

The Foundation component maps directly to Layered Cake zones:

**Zone 0: Constitution**
- Foundation.principles → Principle primitives
- Placed at top of prompt to establish philosophical baseline

**Zone 1: Context**
- Foundation.patterns → Pattern primitives
- Loaded early to provide architectural context

This natural mapping improves prompt assembly coherence.

### 3. Semantic Correctness

**Principles as Latent Knowledge Activators:**
```typescript
// This is a semantic pointer, not an instruction
principles: ['Use SOLID principles']

// Activates pre-trained knowledge in LLM without explicit explanation
// More token-efficient than embedding full SOLID principle explanations
```

**Patterns as Architectural Solutions:**
```typescript
// This is an architectural template, not just information
patterns: [{
  name: 'Repository Pattern',
  useCase: 'Abstract data access layer',
  description: 'Encapsulate data access logic...'
}]

// Provides structural blueprint, not just educational content
```

### 4. Improved Discoverability

Foundation as a first-class component enables:

- Filtering modules by architectural patterns
- Searching for modules by philosophical principles
- Vector search optimization (principles and patterns have distinct semantic profiles)
- Clear identification of system values and design philosophy

## Consequences

### Positive

- ✅ **Clear semantic boundaries** between philosophy, execution, and education
- ✅ **Better Layered Cake alignment** with Foundation mapping to Zones 0-1
- ✅ **Efficient latent knowledge activation** via principle semantic pointers
- ✅ **Improved component cohesion** - each component has single responsibility
- ✅ **Enhanced discoverability** - architectural patterns easily searchable
- ✅ **Explicit system values** - principles define foundational philosophy
- ✅ **Natural primitive mapping** - Foundation → Principle + Pattern primitives

### Negative

- ⚠️ **Breaking change** requiring module migration from v2.2
- ⚠️ **Additional component** increases authoring complexity
- ⚠️ **Migration effort** for existing v2.2 modules with principles/patterns
- ⚠️ **Tooling updates** required for parsers, validators, and renderers

### Migration Path

**Automated Migration:**
```bash
# CLI provides automated migration tool
ums migrate --from 2.2 --to 3.0 ./modules/**/*.module.ts
```

**Manual Migration Steps:**
1. Update `schemaVersion` from `"2.2"` to `"3.0"`
2. Create `foundation` component if module has principles or patterns
3. Move `instruction.principles` to `foundation.principles`
4. Move `knowledge.patterns` to `foundation.patterns`
5. Assign component IDs for URI addressability

## Primitive Mapping

Foundation component maps to two atomic primitives:

| Component Field          | Primitive Type | Zone | Function                          |
|--------------------------|----------------|------|-----------------------------------|
| Foundation.principles    | Principle      | 0    | Latent knowledge triggers         |
| Foundation.patterns      | Pattern        | 1    | Architectural solutions           |

**URI Examples:**
```
# All principles in foundation component
ums://auth#security-baseline/principle

# All patterns in foundation component
ums://auth#security-baseline/pattern

# Specific principle
ums://auth#security-baseline/principle/0
```

## Alternatives Considered

### Alternative 1: Keep Principles in Instruction

**Rationale**: Principles guide execution, so they belong near process steps.

**Rejected because**:
- Principles are philosophically distinct from execution directives
- Creates semantic confusion between "what we believe" and "what we do"
- Poor Layered Cake mapping (principles need Zone 0, processes need Zone 2)
- Mixing abstraction levels within single component violates SRP

### Alternative 2: Keep Patterns in Knowledge

**Rationale**: Patterns are things to learn, so they belong in Knowledge.

**Rejected because**:
- Patterns are architectural templates, not just concepts
- Creates ambiguity between "what to understand" and "how to structure"
- Patterns serve different purpose than concepts/examples
- Poor primitive separation (Pattern primitive needs distinct semantic profile)

### Alternative 3: Merge into Single "Context" Component

**Rationale**: Combine Foundation, parts of Instruction, and parts of Knowledge into one "Context" component.

**Rejected because**:
- Loses semantic clarity of component purposes
- Makes component boundaries arbitrary
- Harder to map to assembler zones
- Reduces discoverability and searchability

### Alternative 4: Add "Philosophy" and "Architecture" as Separate Components

**Rationale**: Split Foundation into two components for maximum separation.

**Rejected because**:
- Principles and patterns are complementary (values + structures)
- Over-segmentation increases authoring complexity
- Both map to similar assembler zones (0-1)
- Creates cognitive overhead with too many component types

## Notes

- Foundation component is optional (modules may have only Instruction or Knowledge)
- Not all modules need Foundation (execution-only modules may skip it)
- Principles should be concise semantic pointers, not full explanations
- Patterns should include useCase to clarify when to apply
- Foundation content should be stable (changes less frequently than execution details)

## Implementation Status

**Status**: Design approved, implementation in progress

**Completion Checklist**:
- [x] Update UMS v3.0 specification with Foundation component
- [ ] Update TypeScript types in ums-lib
- [ ] Update primitive compiler to handle Foundation → Principle/Pattern
- [ ] Update Layered Cake assembler for proper zone assignment
- [ ] Update CLI validators
- [ ] Update Markdown renderer
- [ ] Create automated migration tool (v2.2 → v3.0)
- [ ] Migrate standard library modules
- [ ] Update documentation and examples

## References

- UMS v3.0 Specification, Sections 2.2 and 3.1
- [ADR-0004: Machine-First Module Architecture](./0004-machine-first-module-architecture.md)
- [ADR-0008: External Graph Tool](./0008-external-graph-tool.md)
- Layered Cake Assembler Specification (docs/spec/v3.0/layered_cake_assembler.md)
- URI Scheme Specification (docs/spec/v3.0/uri_scheme.md)
