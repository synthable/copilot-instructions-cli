# Specification: The Unified Module System (UMS) v3.0

## Changes from v2.2

### Breaking Changes

1. **New Foundation Component**
   - Added `Foundation` as a new component type alongside Instruction, Knowledge
   - Contains `principles` and `patterns` fields
   - Represents the philosophical and architectural layer

2. **Data Component Removed**
   - `Data` component removed from v3.0
   - **Rationale**: Data component was the "odd one out"
     - No clear Cognitive Level (doesn't fit 0-6 hierarchy)
     - Creates massive noise in Vector Search (raw JSON/YAML produces poor embeddings)
     - No clear Zone in Layered Cake assembler
     - `unknown` type creates TypeScript safety hole
   - **Alternative**: Use `Knowledge.examples` (Demonstration) or `Knowledge.concepts` (Definition) to present data contextually
   - **Future**: Dedicated "Reference RAG" strategy (Key-Value lookup sidecar) may be added post-v3.0

3. **Component Field Migration**
   - `principles` moved from Instruction → Foundation
   - `patterns` moved from Knowledge → Foundation
   - Instruction now focused purely on execution (process, constraints, criteria)
   - Knowledge now focused purely on education (concepts, examples)

4. **7 Atomic Primitives (Mandatory)**
   - All modules MUST be compiled into 7 primitive types for runtime consumption
   - Foundation → Principle, Pattern
   - Instruction → Procedure (process), Policy (constraints), Evaluation (criteria)
   - Knowledge → Concept, Demonstration (examples)

5. **URI Addressing Scheme (Mandatory)**
   - Format: `ums://{module-id}#{component-id}/{primitive-type}`
   - All primitives MUST be addressable via URIs
   - Enables granular retrieval for RAG workflows

6. **Layered Cake Assembler (Default)**
   - Primitives assembled into 4 zones based on LLM attention mechanics
   - Zone 0 (Constitution): Policies + Principles
   - Zone 1 (Context): Patterns + Concepts + References
   - Zone 2 (Action): Procedures + Evaluations
   - Zone 3 (Steering): Demonstrations

### Architectural Philosophy

v3.0 implements the **"One Source, Two Runtimes"** model:

- **Authoring Experience**: Logical, human-friendly component structure (Foundation, Instruction, Knowledge)
- **Consumption Experience**: Atomic, machine-optimized primitives (7 types)
- **Dual Runtimes**: CLI for static builds, MCP for dynamic RAG assembly

---

## Migration from v2.2

**Breaking Changes:**

1. **Create Foundation Component** - Extract principles and patterns from existing components
2. **Update schemaVersion** - Change from `"2.2"` to `"3.0"`
3. **Add Component IDs** - Required for URI generation (optional in v2.2)

**Migration Example:**

```typescript
// v2.2 module
export const myModule: Module = {
  id: 'my-module',
  version: '1.0.0',
  schemaVersion: '2.2',

  instruction: {
    purpose: '...',
    principles: ['Use SOLID principles', 'Follow DRY'],  // ← Will move
    process: [...],
    constraints: [...]
  },

  knowledge: {
    explanation: '...',
    patterns: [...]  // ← Will move
    concepts: [...],
    examples: [...]
  }
};

// v3.0 module (migrated)
export const myModule: Module = {
  id: 'my-module',
  version: '2.0.0',  // Major version bump
  schemaVersion: '3.0',

  // NEW: Foundation component
  foundation: {
    id: 'architectural-baseline',
    principles: ['Use SOLID principles', 'Follow DRY'],  // Moved from instruction
    patterns: [...]  // Moved from knowledge
  },

  instruction: {
    id: 'implementation',
    purpose: '...',
    // principles removed
    process: [...],
    constraints: [...]
  },

  knowledge: {
    id: 'education',
    explanation: '...',
    // patterns removed
    concepts: [...],
    examples: [...]
  }
};
```

**Migration Tool:**

Use the provided codemod to automatically migrate v2.2 modules:

```bash
ums migrate --from 2.2 --to 3.0 ./modules/**/*.module.ts
```

---

## 1. Overview & Core Principles

The Unified Module System (UMS) v3.0 is a specification for a data-centric, modular, and composable ecosystem for AI instructions optimized for both deterministic compilation and dynamic Retrieval-Augmented Generation (RAG).

### 1.1. Key Features

- **3-Component Architecture**: Foundation, Instruction, Knowledge
- **7 Atomic Primitives**: Principle, Pattern, Procedure, Policy, Evaluation, Concept, Demonstration
- **TypeScript-First**: Native TypeScript support with full IDE integration
- **Dual Runtime Model**: CLI (static) and MCP Server (dynamic RAG)
- **URI Addressability**: Every primitive has a stable, unique address
- **Layered Cake Assembly**: Optimized prompt construction based on LLM attention mechanics

### 1.2. Core Principles

1. **Data-Centric**: Modules are structured TypeScript files (`.module.ts`), not prose documents
2. **Logical Authoring**: Authors compose cohesive components (Foundation, Instruction, Knowledge)
3. **Atomic Runtime**: Machines consume granular primitives (7 types) for optimal retrieval
4. **Compiler/Linker Architecture**: Source modules compiled into addressable primitive graph
5. **Attention-Optimized Assembly**: Primitives sorted into zones matching LLM processing patterns

### 1.3. The "One Source, Two Runtimes" Model

**Source Layer (Authoring):**

- TypeScript modules with 3 component types
- Cohesive, logical groupings for human comprehension
- Rich metadata and relationships

**Runtime Layer (Consumption):**

- JSON primitive graph with 7 atomic types
- URI-addressable fragments for granular retrieval
- Optimized for vector search and RAG assembly

**Runtime #1: CLI Tool (Static Compiler)**

- Input: Persona definition (static module list)
- Output: Single Markdown prompt file
- Use Case: Reproducible, deterministic builds

**Runtime #2: MCP Server (Dynamic Kernel)**

- Input: User query + context
- Process: Vector search → Primitive selection → Layered assembly
- Output: Ephemeral, context-optimized prompt
- Use Case: Just-in-Time RAG retrieval

---

## 2. The Module Definition File

All modules MUST be defined as TypeScript files with the `.module.ts` extension.

### 2.1. Top-Level Keys

| Key              | Type                 | Required? | Description                                       |
| :--------------- | :------------------- | :-------- | :------------------------------------------------ |
| `id`             | String               | Yes       | Unique module identifier                          |
| `version`        | String               | Yes       | Semantic version (SemVer 2.0.0)                   |
| `schemaVersion`  | String               | Yes       | Must be `"3.0"`                                   |
| `capabilities`   | Array[String]        | Yes       | What functional capabilities this module provides |
| `cognitiveLevel` | Integer              | Yes       | Cognitive abstraction level (0-6)                 |
| `metadata`       | Object               | Yes       | Human-readable and AI-discoverable metadata       |
| `domain`         | String/Array         | No        | Technology or field this module applies to        |
| `components`     | Array[Component]     | No\*      | Component blocks (see 2.2)                        |
| `foundation`     | FoundationComponent  | No\*      | Shorthand for foundation component                |
| `instruction`    | InstructionComponent | No\*      | Shorthand for instruction component               |
| `knowledge`      | KnowledgeComponent   | No\*      | Shorthand for knowledge component                 |

\* At least one of `components`, `foundation`, `instruction`, or `knowledge` MUST be present.

### 2.2. Component Architecture

UMS v3.0 uses a **3-component architecture** optimized for the Layered Cake assembler:

#### Component Type: Foundation (New in v3.0)

Defines the **philosophy and architecture**.

```typescript
interface FoundationComponent {
  type?: "foundation"; // Required in components array, omitted in shorthand
  id?: string; // Component ID for URI addressing (recommended)
  tags?: string[]; // Component-level tags
  principles?: string[]; // High-level guidelines that trigger latent knowledge
  patterns?: Pattern[]; // Architectural patterns and solutions
}
```

**Fields**:

- `type` (conditional): Required in `components` array, omitted in shorthand
- `id` (recommended): Component identifier for stable URI generation
- `tags` (optional): Component-level categorization
- `principles` (optional): Semantic pointers to activate LLM latent knowledge
  - Examples: "Adhere to SOLID principles", "Use Test-Driven Development", "Follow Twelve-Factor App"
  - Functions as efficient knowledge activation vs. explicit explanation
- `patterns` (optional): Architectural solutions and design patterns

**Primitive Mapping**:

- `principles` → **Principle** primitives
- `patterns` → **Pattern** primitives

**Example**:

```typescript
foundation: {
  id: 'architectural-baseline',
  principles: [
    'Adhere to SOLID principles',
    'Follow separation of concerns',
    'Use dependency injection'
  ],
  patterns: [
    {
      name: 'Repository Pattern',
      useCase: 'Abstract data access layer',
      description: 'Encapsulate data access logic in repository classes'
    }
  ]
}
```

#### Component Type: Instruction

Tells the AI **what to do and how**.

```typescript
interface InstructionComponent {
  type?: "instruction";
  id?: string; // Component ID (recommended)
  tags?: string[];
  purpose: string; // Primary objective
  process?: Array<string | ProcessStep>; // Sequential procedures
  constraints?: Constraint[]; // Non-negotiable policies
  criteria?: Criterion[]; // Success evaluations
}
```

**Note**: `principles` field removed in v3.0 (moved to Foundation).

**Primitive Mapping**:

- `process` → **Procedure** primitives
- `constraints` → **Policy** primitives
- `criteria` → **Evaluation** primitives

#### Component Type: Knowledge

Teaches **concepts and provides examples**.

```typescript
interface KnowledgeComponent {
  type?: "knowledge";
  id?: string; // Component ID (recommended)
  tags?: string[];
  explanation: string; // Conceptual overview
  concepts?: Concept[]; // Definitions and theory
  examples?: Example[]; // Few-shot demonstrations
}
```

**Note**: `patterns` field removed in v3.0 (moved to Foundation).

**Primitive Mapping**:

- `concepts` → **Concept** primitives
- `examples` → **Demonstration** primitives

**Note on Reference Data**: If you need to include configuration, schemas, or reference data, use `Knowledge.examples` to present it as a Demonstration (with context and explanation) rather than raw data.

---

## 3. The 7 Atomic Primitives

In v3.0, all modules are compiled into 7 primitive types stored in a URI-addressable graph.

### 3.1. The Primitive Taxonomy

| #   | Primitive         | Source      | Source Field  | Function                  | Zone |
| --- | ----------------- | ----------- | ------------- | ------------------------- | ---- |
| 1   | **Principle**     | Foundation  | `principles`  | Latent knowledge triggers | 0    |
| 2   | **Pattern**       | Foundation  | `patterns`    | Architectural solutions   | 1    |
| 3   | **Procedure**     | Instruction | `process`     | Step-by-step algorithms   | 2    |
| 4   | **Policy**        | Instruction | `constraints` | Hard rules and boundaries | 0    |
| 5   | **Evaluation**    | Instruction | `criteria`    | Success criteria          | 2    |
| 6   | **Concept**       | Knowledge   | `concepts`    | Definitions and theory    | 1    |
| 7   | **Demonstration** | Knowledge   | `examples`    | Few-shot examples         | 3    |

### 3.2. Primitive Properties

Each primitive in the compiled graph has:

```typescript
interface Primitive {
  uri: string; // ums://module-id#component-id/primitive-type
  type: PrimitiveType; // One of 7 types
  moduleId: string; // Source module
  componentId: string; // Source component
  zone: number; // Assembler zone (0-3)
  content: unknown; // The actual primitive data
  metadata: {
    moduleVersion: string;
    moduleTags: string[];
    componentTags: string[];
    cognitiveLevel: number;
  };
}
```

---

## 4. URI Addressing Scheme

Every primitive has a globally unique URI for granular retrieval.

### 4.1. URI Format

```
ums://{module-id}#{component-id}/{primitive-type}
```

**Segments**:

1. **Protocol**: `ums://`
2. **Authority**: `{module-id}` - The module's unique identifier
3. **Fragment**: `#{component-id}/{primitive-type}`
   - `{component-id}`: The component's `id` field
   - `{primitive-type}`: One of 7 types (singular, lowercase)

### 4.2. URI Examples

```
# Entire module
ums://auth

# Entire component
ums://auth#security-baseline

# Specific primitive type within component
ums://auth#security-baseline/principle
ums://auth#security-baseline/pattern
ums://auth#implementation/procedure

# Individual primitive (with index)
ums://auth#security-baseline/principle/0
ums://auth#implementation/procedure/2
ums://auth#examples/demonstration/0
```

### 4.3. URI Resolution

MCP servers and build tools resolve URIs:

```typescript
// Resolve entire module
const module = await resolver.resolve("ums://auth");

// Resolve all principles in a component
const principles = await resolver.resolve(
  "ums://auth#security-baseline/principle"
);

// Resolve specific principle
const firstPrinciple = await resolver.resolve(
  "ums://auth#security-baseline/principle/0"
);
```

**See**: [URI Scheme Specification](./uri_scheme.md) for complete details.

---

## 5. The Layered Cake Assembler

The assembler sorts primitives into 4 zones optimized for LLM attention mechanics.

### 5.1. Assembly Zones

```
┌─────────────────────────────────────┐
│ ZONE 0: Constitution (Top)          │  ← Policies + Principles
│ Sets global governance & rules      │
├─────────────────────────────────────┤
│ ZONE 1: Context (Upper-Middle)      │  ← Patterns + Concepts + References
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

### 5.2. Zone Definitions

**Zone 0: Constitution**

- **Primitives**: Policy, Principle
- **Placement**: Very Top
- **Rationale**: Establishes non-negotiable rules before any action. Prevents instruction drift.
- **Example**: "MUST use HTTPS", "Adhere to SOLID principles"

**Zone 1: Context**

- **Primitives**: Pattern, Concept
- **Placement**: Upper-Middle
- **Rationale**: Loads necessary definitions and architectural patterns into context window.
- **Example**: Repository Pattern explanation, OAuth definition

**Zone 2: Action**

- **Primitives**: Procedure, Evaluation
- **Placement**: Lower-Middle
- **Rationale**: Immediate task execution steps kept contiguous for data locality.
- **Example**: "1. Run tests", "2. Build project", "Verify: Coverage > 80%"

**Zone 3: Steering**

- **Primitives**: Demonstration
- **Placement**: Very Bottom (just before user query)
- **Rationale**: Leverages recency bias. Few-shot examples most effective immediately before generation.
- **Example**: Code snippets showing input → output transformations

### 5.3. Assembly Algorithm

```typescript
function assemblePrompt(primitives: Primitive[]): string {
  // 1. Group by zone
  const zone0 = primitives.filter(p => p.zone === 0); // Policy, Principle
  const zone1 = primitives.filter(p => p.zone === 1); // Pattern, Concept
  const zone2 = primitives.filter(p => p.zone === 2); // Procedure, Evaluation
  const zone3 = primitives.filter(p => p.zone === 3); // Demonstration

  // 2. Render each zone
  const sections = [
    renderZone0(zone0), // Constitution
    renderZone1(zone1), // Context
    renderZone2(zone2), // Action
    renderZone3(zone3), // Steering
  ];

  // 3. Concatenate with proper spacing
  return sections.filter(Boolean).join("\n\n---\n\n");
}
```

**See**: [Layered Cake Assembler Specification](./layered_cake_assembler.md) for implementation details.

---

## 6. Dual Runtime Architecture

### 6.1. CLI Tool (Static Compiler)

**Input**: Persona file with static module list

**Process**:

1. Load persona definition
2. Resolve all module IDs from registry
3. Compile modules to primitives
4. Assemble using Layered Cake
5. Render to Markdown
6. Emit `.build.json` report

**Output**: Single `.md` file + build report

**Use Cases**:

- Reproducible builds for version control
- Deterministic prompt generation
- CI/CD integration
- Documentation generation

### 6.2. MCP Server (Dynamic Kernel)

**Input**: User query + conversation context

**Process**:

1. **Vector Search**: Embed query, find relevant primitives
2. **Selector**: Local LLM filters by relevance/competency
3. **Assembler**: Sorts selected primitives using Layered Cake
4. **Renderer**: Generates optimized system prompt

**Output**: Ephemeral, context-aware prompt

**Use Cases**:

- Just-in-Time RAG retrieval
- Context-aware assistance
- Token-efficient prompting
- Dynamic capability composition

### 6.3. Shared Components

Both runtimes share:

- Module loader and registry
- Primitive compiler
- Layered Cake assembler
- URI resolver
- Markdown renderer

---

## 7. Build Report

Build reports in v3.0 include primitive compilation details.

```typescript
interface BuildReportV3 extends BuildReportV2 {
  schemaVersion: "3.0";
  compilationReport: {
    totalPrimitives: number;
    primitivesByType: Record<PrimitiveType, number>;
    primitivesByZone: Record<number, number>;
  };
}
```

**Example**:

```json
{
  "schemaVersion": "3.0",
  "personaName": "Backend Engineer",
  "compilationReport": {
    "totalPrimitives": 41,
    "primitivesByType": {
      "principle": 5,
      "pattern": 3,
      "procedure": 12,
      "policy": 8,
      "evaluation": 6,
      "concept": 4,
      "demonstration": 3
    },
    "primitivesByZone": {
      "0": 13, // Constitution (Policy + Principle)
      "1": 7, // Context (Pattern + Concept)
      "2": 18, // Action (Procedure + Evaluation)
      "3": 3 // Steering (Demonstration)
    }
  }
}
```

---

## 8. Planned Future Enhancements

- **Primitive-Level Versioning**: Version individual primitives, not just modules
- **Semantic Routing**: AI-driven primitive selection based on query analysis
- **Feedback Loops**: Learn from prompt effectiveness to improve retrieval
- **Cross-Module Inference**: Discover implicit relationships between primitives

---

**Specification Version**: 3.0.0
**Status**: Design Approved
**Target Release**: Q2 2025
**Breaking Changes**: Yes (see Migration from v2.2)
