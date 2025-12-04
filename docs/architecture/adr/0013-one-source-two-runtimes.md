# ADR 0013: One Source, Two Runtimes Architecture

**Status:** Accepted
**Date:** 2025-11-25
**Context:** UMS v3.0 architectural evolution

## Context

UMS has historically operated as a **static compilation system**: modules are composed into personas, which are then compiled into monolithic Markdown prompt files. This approach works well for deterministic, reproducible builds but has significant limitations:

### Problems with Static-Only Architecture

1. **Context Window Waste**: Every build includes all modules from a persona, even if only a subset is relevant to the current task. For large personas, this leads to:
   - Token budget exhaustion
   - Slower AI processing
   - Diluted attention across irrelevant instructions

2. **Poor Retrieval Granularity**: Modules are the smallest unit of retrieval. If a persona needs just one principle or pattern from a module, it must include the entire module with all its components.

3. **No Dynamic Adaptation**: Static builds cannot adapt to runtime context:
   - Cannot respond to user queries to select relevant instructions
   - Cannot adjust based on conversation history
   - Cannot optimize for token constraints dynamically

4. **RAG Integration Gap**: Modern AI workflows increasingly use Retrieval-Augmented Generation (RAG), but UMS modules were designed for compilation, not vector search:
   - Cohesive component groupings (Foundation, Instruction, Knowledge) optimize for human comprehension, not machine retrieval
   - Lack of URI-addressable fragments for granular fetching
   - No standardized assembly strategy for dynamically retrieved content

### The Dual Use Case Problem

UMS modules serve two fundamentally different use cases:

**Use Case 1: Authoring**
- Humans write modules with logical, cohesive groupings
- Foundation, Instruction, Knowledge components reflect cognitive organization
- Rich metadata and relationships for comprehension

**Use Case 2: Consumption**
- AI agents need atomic, granular retrieval units
- Vector search requires semantically focused fragments
- RAG workflows need just-in-time assembly based on context

Previous attempts to optimize modules for both use cases led to architectural compromises that satisfied neither fully.

## Decision

UMS v3.0 adopts the **"One Source, Two Runtimes"** architectural model with a clear separation between authoring and consumption:

### Source Layer (Authoring Experience)

Module authors work with **3 logical components**:
- **Foundation**: Principles and patterns (philosophy and architecture)
- **Instruction**: Process, constraints, criteria (execution directives)
- **Knowledge**: Concepts and examples (education and demonstration)

These components remain human-friendly, cohesive groupings optimized for authoring and comprehension.

### Runtime Layer (Consumption Experience)

All modules are compiled into **7 atomic primitives** stored in a URI-addressable graph:

| Primitive | Source | Function | Zone |
|-----------|--------|----------|------|
| Principle | Foundation.principles | Latent knowledge triggers | 0 |
| Pattern | Foundation.patterns | Architectural solutions | 1 |
| Procedure | Instruction.process | Step-by-step algorithms | 2 |
| Policy | Instruction.constraints | Hard rules and boundaries | 0 |
| Evaluation | Instruction.criteria | Success criteria | 2 |
| Concept | Knowledge.concepts | Definitions and theory | 1 |
| Demonstration | Knowledge.examples | Few-shot examples | 3 |

Each primitive has a globally unique URI:
```
ums://{module-id}#{component-id}/{primitive-type}
```

### Dual Runtime Architecture

**Runtime #1: CLI Tool (Static Compiler)**
- **Input**: Persona file with static module list
- **Process**: Load → Compile to primitives → Assemble using Layered Cake → Render to Markdown
- **Output**: Single `.md` file + `.build.json` report
- **Use Cases**:
  - Reproducible builds for version control
  - Deterministic prompt generation
  - CI/CD integration
  - Documentation generation

**Runtime #2: MCP Server (Dynamic Kernel)**
- **Input**: User query + conversation context
- **Process**:
  1. Vector Search: Embed query, find relevant primitives
  2. Selector: Local LLM filters by relevance/competency
  3. Assembler: Sorts using Layered Cake (4 zones)
  4. Renderer: Generates optimized system prompt
- **Output**: Ephemeral, context-optimized prompt
- **Use Cases**:
  - Just-in-Time RAG retrieval
  - Context-aware assistance
  - Token-efficient prompting
  - Dynamic capability composition

### Shared Components

Both runtimes share:
- Module loader and registry
- Primitive compiler (source → 7 primitives)
- Layered Cake assembler (primitives → 4 zones)
- URI resolver (granular addressing)
- Markdown renderer (output formatting)

## Compiler/Linker Architecture

UMS v3.0 adopts a traditional compiler/linker model:

### Compilation Phase
1. **Parse**: Load `.module.ts` files (TypeScript source)
2. **Type Check**: Validate against UMS schema
3. **Decompose**: Break components into atomic primitives
4. **Annotate**: Add URI, zone, metadata to each primitive
5. **Emit**: Store primitives in addressable graph (JSON)

### Linking Phase
1. **Select**: Retrieve primitives (static persona list OR dynamic RAG query)
2. **Sort**: Group primitives into 4 assembly zones
3. **Assemble**: Apply Layered Cake algorithm
4. **Render**: Generate final Markdown prompt

**Key Insight**: Compilation happens once per module version. Linking happens once per build (CLI) or per query (MCP).

## Layered Cake Assembly Strategy

Primitives are assembled into **4 zones** optimized for LLM attention mechanics:

```
┌─────────────────────────────────────┐
│ ZONE 0: Constitution (Top)          │  ← Policies + Principles
│ Sets global governance & rules      │
├─────────────────────────────────────┤
│ ZONE 1: Context (Upper-Middle)      │  ← Patterns + Concepts
│ Loads definitions & architecture    │
├─────────────────────────────────────┤
│ ZONE 2: Action (Lower-Middle)       │  ← Procedures + Evaluations
│ Immediate task instructions         │
├─────────────────────────────────────┤
│ ZONE 3: Steering (Bottom)           │  ← Demonstrations
│ Few-shot examples (recency bias)    │
└─────────────────────────────────────┘
         USER QUERY HERE ↓
```

**Rationale**:
- **Zone 0**: Policies and principles establish global rules before any action
- **Zone 1**: Patterns and concepts load necessary definitions into context
- **Zone 2**: Procedures and evaluations provide immediate task execution steps
- **Zone 3**: Demonstrations leverage recency bias for few-shot learning

This zone-based assembly applies to **both runtimes**, ensuring consistent prompt structure whether built statically or dynamically.

## Rationale

### Why Two Runtimes?

**Static compilation** and **dynamic RAG** are fundamentally different workflows with different requirements:

| Aspect | Static (CLI) | Dynamic (MCP) |
|--------|--------------|---------------|
| **Selection** | All modules in persona | Relevant primitives only |
| **Timing** | Build-time | Query-time |
| **Determinism** | Reproducible | Context-dependent |
| **Token Usage** | Fixed per persona | Optimized per query |
| **Use Case** | Version control, CI/CD | Just-in-Time assistance |

A single-runtime system must compromise between these needs. Dual runtimes allow each to optimize for its specific use case.

### Why Compile to Primitives?

**Component-based modules** are great for authoring but poor for retrieval:
- ❌ Too coarse-grained (pulling entire components wastes tokens)
- ❌ Mixed semantic content (Foundation contains both principles and patterns)
- ❌ Hard to rank by relevance (components don't have single embeddings)

**Atomic primitives** enable:
- ✅ Granular retrieval (fetch only what's needed)
- ✅ Focused embeddings (each primitive has clear semantic meaning)
- ✅ Precise ranking (score individual principles, patterns, procedures)
- ✅ Efficient caching (primitives rarely change once compiled)

### Why URI Addressing?

URIs provide **stable, unique identifiers** for every primitive:
- Enables caching and version control
- Supports fine-grained dependency tracking
- Allows external tools to reference specific instructions
- Facilitates primitive-level observability and debugging

### Why Layered Cake Assembly?

LLM attention mechanics favor specific prompt structures:
- **Constitution first**: Establishes rules before any action (prevents drift)
- **Context middle**: Loads definitions before procedures reference them
- **Action near end**: Maximizes recency for immediate execution steps
- **Demonstrations last**: Few-shot examples most effective just before generation

Random ordering of primitives degrades performance. Zone-based assembly optimizes for how LLMs actually process prompts.

## Consequences

### Positive

- ✅ **Best of Both Worlds**: Static builds for reproducibility, dynamic RAG for efficiency
- ✅ **Granular Retrieval**: Primitives enable token-efficient context loading
- ✅ **Author Ergonomics**: Humans still write cohesive, logical components
- ✅ **Optimized Assembly**: Layered Cake improves prompt effectiveness
- ✅ **URI Addressability**: Stable references for primitives across tools
- ✅ **Shared Architecture**: Both runtimes use same compiler and assembler
- ✅ **Future-Proof**: Primitives enable advanced RAG strategies (semantic routing, feedback loops)

### Negative

- ⚠️ **Increased Complexity**: Two execution paths to maintain and test
- ⚠️ **Migration Burden**: v2.x modules must be refactored to v3.0 format
- ⚠️ **Storage Overhead**: Primitive graph storage adds infrastructure requirement
- ⚠️ **Debugging Complexity**: Tracking issues across compilation and assembly phases
- ⚠️ **Learning Curve**: Authors must understand dual runtime model

### Neutral

- 🔄 **Build Reports**: Now include primitive compilation statistics
- 🔄 **Module Size**: Components expand into multiple primitives (expected)
- 🔄 **Testing Strategy**: Must test both CLI builds and MCP retrieval

## Use Cases

### When to Use CLI (Static Runtime)

- **Continuous Integration**: Validate persona builds in CI/CD pipelines
- **Version Control**: Check compiled prompts into git for change tracking
- **Documentation**: Generate human-readable reference docs from personas
- **Reproducibility**: Ensure identical prompts across team members
- **Offline Usage**: Build prompts without requiring MCP server or vector database

**Example**:
```bash
ums build --persona backend-engineer.persona.ts --output backend.md
```

### When to Use MCP (Dynamic Runtime)

- **Interactive Development**: Fetch relevant instructions as you code
- **Context-Aware Assistance**: AI adapts instructions to current task
- **Token Efficiency**: Only load primitives needed for active query
- **Exploratory Tasks**: Discover relevant modules via semantic search
- **Large Persona Libraries**: Dynamically compose from 100+ modules without token limits

**Example**:
```
User: "How should I structure error handling for this API?"
MCP: [Vector search] → [Select relevant Policies, Patterns, Procedures] → [Assemble] → [Render prompt]
```

## Alternatives Considered

### Alternative 1: Static-Only with Smarter Personas

Keep CLI-only architecture but add:
- Conditional module loading based on tags
- Persona composition with `if/else` logic
- Module slicing to include only specific components

**Rejected because:**
- ❌ Static logic cannot respond to runtime queries
- ❌ Conditional loading still requires pre-defining all cases
- ❌ No way to adapt to actual token constraints
- ❌ Doesn't leverage vector search advances

### Alternative 2: Dynamic-Only with Abolished Personas

Remove static personas entirely:
- All builds are RAG queries
- No reproducibility guarantees
- Always require vector database

**Rejected because:**
- ❌ Loses deterministic builds for CI/CD
- ❌ No version-controllable prompt artifacts
- ❌ Requires infrastructure (vector DB, MCP server) always
- ❌ Harder to debug (no stable baseline to compare against)

### Alternative 3: Keep Component-Level Retrieval

Skip primitive decomposition:
- Retrieve entire components (Foundation, Instruction, Knowledge) in RAG
- Simpler compilation step

**Rejected because:**
- ❌ Too coarse-grained for efficient token usage
- ❌ Components have mixed semantic content (poor embeddings)
- ❌ Cannot leverage zone-based assembly (no Layered Cake)
- ❌ Wastes tokens loading irrelevant content within components

## Implementation Notes

### Compilation Strategy

All compilation logic lives in **ums-lib** (platform-agnostic):
```typescript
// ums-lib/compiler/primitive-compiler.ts
export function compileToPrimitives(module: Module): Primitive[] {
  const primitives: Primitive[] = [];

  if (module.foundation) {
    primitives.push(...compilePrinciples(module.foundation.principles));
    primitives.push(...compilePatterns(module.foundation.patterns));
  }

  if (module.instruction) {
    primitives.push(...compileProcedures(module.instruction.process));
    primitives.push(...compilePolicies(module.instruction.constraints));
    primitives.push(...compileEvaluations(module.instruction.criteria));
  }

  if (module.knowledge) {
    primitives.push(...compileConcepts(module.knowledge.concepts));
    primitives.push(...compileDemonstrations(module.knowledge.examples));
  }

  return primitives;
}
```

### Runtime Implementations

**CLI** (ums-cli):
```typescript
// Static persona build
const persona = await loadPersona('./backend.persona.ts');
const modules = await resolveModules(persona.modules);
const primitives = modules.flatMap(compileToPrimitives);
const prompt = assembleLayeredCake(primitives);
fs.writeFileSync('backend.md', prompt);
```

**MCP** (ums-mcp):
```typescript
// Dynamic RAG query
const query = "How should I handle errors?";
const embedding = await embed(query);
const relevantPrimitives = await vectorSearch(embedding, topK=20);
const selectedPrimitives = await llmFilter(relevantPrimitives, query);
const prompt = assembleLayeredCake(selectedPrimitives);
return prompt;
```

## Migration Path

### Phase 1: Primitive Compiler (Complete)
- ✅ Implement `compileToPrimitives()` in ums-lib
- ✅ Add URI generation
- ✅ Update build reports to include primitive statistics

### Phase 2: CLI Runtime Enhancement (In Progress)
- 🔄 Integrate primitive compilation into existing build pipeline
- 🔄 Emit primitive graph alongside Markdown
- 🔄 Update tests to validate primitive output

### Phase 3: MCP Runtime Development (Planned)
- ⏳ Design MCP server protocol
- ⏳ Implement vector search integration
- ⏳ Build LLM-based primitive selector
- ⏳ Add Layered Cake assembly
- ⏳ Create MCP client tools

### Phase 4: Production Hardening (Future)
- ⏳ Performance optimization (caching, lazy loading)
- ⏳ Observability (primitive usage tracking, effectiveness metrics)
- ⏳ Advanced RAG strategies (semantic routing, feedback loops)

## References

- UMS v3.0 Specification: `docs/spec/v3.0/unified_module_system_v3.0_spec.md`
- Layered Cake Assembler: `docs/spec/v3.0/layered_cake_assembler.md`
- URI Scheme: `docs/spec/v3.0/uri_scheme.md`
- ADR 0004: Machine-First Module Architecture
- ADR 0008: External Graph Tool for Module Dependency Management

## Notes

- The "One Source, Two Runtimes" model draws inspiration from compiler design (GCC, LLVM) where a single intermediate representation (IR) serves multiple backends.
- Primitive-level versioning is planned for future releases but not included in v3.0 to limit scope.
- The Layered Cake assembly algorithm may be extended with additional zones or zone-specific rendering strategies based on empirical prompt effectiveness data.
