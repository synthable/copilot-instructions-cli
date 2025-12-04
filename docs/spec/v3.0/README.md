# UMS v3.0 Specification

This directory contains the specification for UMS v3.0, a major architectural evolution that introduces the **"One Source, Two Runtimes"** model optimized for Retrieval-Augmented Generation (RAG) workflows.

## Documents

- **[unified_module_system_v3.0_spec.md](./unified_module_system_v3.0_spec.md)** - Complete v3.0 specification
- **[ums_v3.0_taxonomies.md](./ums_v3.0_taxonomies.md)** - Taxonomies for components, primitives, and capabilities
- **[migration_from_v2.2.md](./migration_from_v2.2.md)** - Migration guide from v2.2 to v3.0
- **[layered_cake_assembler.md](./layered_cake_assembler.md)** - Assembler architecture and zone definitions
- **[uri_scheme.md](./uri_scheme.md)** - Complete URI addressing specification

## Key Changes from v2.2

### Component Architecture Evolution

**v2.2**: 3 Component Types

- Instruction (purpose, process, constraints, criteria, principles)
- Knowledge (explanation, concepts, examples, patterns)
- Data (format, value, description)

**v3.0**: 3 Component Types (Data removed)

- **Foundation** (NEW) - principles, patterns (Philosophy/Architecture layer)
- **Instruction** - process, constraints, criteria (Execution layer)
- **Knowledge** - concepts, examples (Education layer)

### The 7 Atomic Primitives

Components are compiled into 7 addressable primitive types:

| Primitive         | Source Component | Source Field  | Function                  |
| ----------------- | ---------------- | ------------- | ------------------------- |
| **Principle**     | Foundation       | `principles`  | Latent knowledge triggers |
| **Pattern**       | Foundation       | `patterns`    | Architectural solutions   |
| **Procedure**     | Instruction      | `process`     | Step-by-step algorithms   |
| **Policy**        | Instruction      | `constraints` | Hard rules and boundaries |
| **Evaluation**    | Instruction      | `criteria`    | Success criteria          |
| **Concept**       | Knowledge        | `concepts`    | Definitions and theory    |
| **Demonstration** | Knowledge        | `examples`    | Few-shot examples         |

**Note**: Data component removed due to:

- No clear Cognitive Level
- Vector search noise (raw JSON/YAML)
- No clear Layered Cake zone
- TypeScript safety issues

**Alternative**: Use `Knowledge.examples` (Demonstration) to present configuration/data contextually.

### Dual Runtime Architecture

1. **CLI Tool (Static Compiler)**
   - Deterministic builds from static Persona definitions
   - Outputs single Markdown prompt file
   - All content rendered in definition order

2. **MCP Server (Dynamic Kernel)**
   - Context-aware, ephemeral prompts assembled Just-In-Time
   - Vector search finds relevant primitives
   - Assembler reconstructs into optimized prompt

### The Layered Cake Assembler

Primitives are sorted into 4 zones optimized for LLM attention mechanics:

- **Zone 0 (Constitution)**: Policies + Principles (top - sets global rules)
- **Zone 1 (Context)**: Patterns + Concepts (upper-middle - loads definitions)
- **Zone 2 (Action)**: Procedures + Evaluations (lower-middle - immediate task instructions)
- **Zone 3 (Steering)**: Demonstrations (bottom - leverages recency bias for few-shot learning)

### URI Addressing Scheme

Format: `ums://{module-id}#{component-id}/{primitive-type}`

Examples:

- `ums://auth` - Entire module
- `ums://auth#security-baseline` - Entire Foundation component
- `ums://auth#security-baseline/principles` - Just the principles
- `ums://auth#implementation/procedures` - Just the procedures

## Philosophy: "Instructional RAG"

v3.0 solves the **Granularity vs. Usability** trade-off:

- **Authors** work with cohesive, logical components (Foundation, Instruction, Knowledge)
- **Machines** retrieve atomic, addressable primitives (7 types)
- **Assembler** reconstructs primitives into optimized prompts using attention mechanics

This enables:

- **Just-in-Time Prompts**: Retrieve only relevant fragments
- **Latent Knowledge Activation**: Use principles as semantic pointers
- **Context-Aware Assembly**: Different zones for different primitive types
- **Token Efficiency**: Retrieve "just the rules" without "all the theory"

## Breaking Changes

1. **New Foundation Component**: Modules using `principles` or `patterns` must create Foundation component
2. **Data Component Removed**: Data component no longer supported - use Knowledge.examples instead
3. **Component Structure**:
   - `principles` field moves from Instruction → Foundation
   - `patterns` field moves from Knowledge → Foundation
4. **Primitive Compilation**: Build tools MUST compile to primitives (optional in v2.2)
5. **URI Scheme**: Fully specified addressing for all primitives
6. **Assembler Required**: Default prompt assembly uses Layered Cake strategy

## Status

**Current Status**: Design Approved
**Target Release**: Q2 2025
**Breaking Changes**: Yes (requires migration from v2.x)

## Migration Path

1. Review [migration_from_v2.2.md](./migration_from_v2.2.md)
2. Use provided codemod tool to automatically convert v2.2 modules
3. Move `patterns` from Knowledge to new Foundation component
4. Add Foundation component for any modules using principles
5. Remove Data components - migrate to Knowledge.examples if needed
6. Test with both CLI (static) and MCP (dynamic) runtimes
7. Validate persona compositions with new assembler

## Design Rationale

See the [UMS v2.2 & v3.0 Evolution Design Specification](../../v2.2_v3.0_design_spec.md) for complete architectural rationale and decision-making process.
