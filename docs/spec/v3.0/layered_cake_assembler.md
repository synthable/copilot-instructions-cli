# The Layered Cake Assembler

**Version**: 3.0
**Status**: Normative Specification
**Part of**: UMS v3.0

---

## 1. Overview

The Layered Cake Assembler is the core algorithm that sorts and arranges atomic primitives into an optimized prompt structure based on LLM attention mechanics, primacy/recency biases, and instruction hierarchy.

### 1.1. Design Goals

1. **Attention-Optimized**: Place critical rules at positions where LLM attention is highest
2. **Primacy for Constitution**: Global governance (policies/principles) at the very top
3. **Recency for Steering**: Few-shot examples at the very bottom (just before user query)
4. **Logical Flow**: Context → Action sequence maintains task coherence
5. **Deterministic**: Same input primitives always produce same output order

### 1.2. The 4-Zone Architecture

````
╔═════════════════════════════════════════════════════════╗
║ ZONE 0: CONSTITUTION                                    ║
║ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║
║ [Policy Primitives]                                     ║
║ - MUST use HTTPS for all API endpoints                  ║
║ - MUST NOT expose secrets in logs                       ║
║                                                          ║
║ [Principle Primitives]                                  ║
║ - Adhere to SOLID principles                            ║
║ - Follow Test-Driven Development                        ║
╠═════════════════════════════════════════════════════════╣
║ ZONE 1: CONTEXT                                         ║
║ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║
║ [Pattern Primitives]                                    ║
║ - Repository Pattern: Abstract data access layer        ║
║                                                          ║
║ [Concept Primitives]                                    ║
║ - OAuth 2.0: Authorization framework for delegated...   ║
╠═════════════════════════════════════════════════════════╣
║ ZONE 2: ACTION                                          ║
║ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║
║ [Procedure Primitives]                                  ║
║ 1. Run database migrations                              ║
║ 2. Build TypeScript project                             ║
║ 3. Deploy to staging environment                        ║
║                                                          ║
║ [Evaluation Primitives]                                 ║
║ - [ ] All tests pass                                    ║
║ - [ ] Code coverage > 80%                               ║
╠═════════════════════════════════════════════════════════╣
║ ZONE 3: STEERING                                        ║
║ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║
║ [Demonstration Primitives]                              ║
║ Example: Error Handling                                 ║
║ ```typescript                                           ║
║ try {                                                    ║
║   await operation();                                    ║
║ } catch (error) {                                       ║
║   logger.error('Failed', { error });                    ║
║ }                                                        ║
║ ```                                                      ║
╚═════════════════════════════════════════════════════════╝
                         ↓
               [USER QUERY APPEARS HERE]
````

---

## 2. Zone Specifications

### Zone 0: Constitution

**Purpose**: Establish global governance and non-negotiable constraints.

**Primitives**:

- **Policy** (from Instruction.constraints)
- **Principle** (from Foundation.principles)

**Rationale**:

- Primacy effect: Information at the top is remembered best
- Constitutional rules must be visible before any action instructions
- Prevents instruction drift and rule violations

**Rendering Order**:

1. All Policy primitives (policies first for hard constraints)
2. All Principle primitives (principles second for philosophical guidance)

**Example Output**:

```markdown
## System Constraints

- MUST use HTTPS for all production endpoints
- MUST NOT log sensitive user data
- MUST validate all user inputs

## Guiding Principles

- Adhere to SOLID design principles
- Follow the principle of least privilege
- Optimize for maintainability over cleverness
```

---

### Zone 1: Context

**Purpose**: Load definitions, patterns, and reference data into context window.

**Primitives**:

- **Pattern** (from Foundation.patterns)
- **Concept** (from Knowledge.concepts)

**Rationale**:

- Provides necessary background knowledge
- Establishes shared vocabulary
- Loads architectural patterns and definitions

**Rendering Order**:

1. All Pattern primitives (architectural solutions)
2. All Concept primitives (definitions and theory)

**Example Output**:

```markdown
## Architectural Patterns

### Repository Pattern

**Use Case**: Abstract data access layer
Encapsulate all data access logic in repository classes...

## Key Concepts

#### OAuth 2.0

An authorization framework that enables applications to obtain limited access...
```

---

### Zone 2: Action

**Purpose**: Provide immediate, actionable task instructions.

**Primitives**:

- **Procedure** (from Instruction.process)
- **Evaluation** (from Instruction.criteria)

**Rationale**:

- Task-focused instructions kept together for coherence
- Data locality: related procedures grouped for better comprehension
- Evaluations follow procedures for natural workflow

**Rendering Order**:

1. All Procedure primitives (step-by-step instructions)
2. All Evaluation primitives (success criteria)

**Example Output**:

```markdown
## Execution Steps

1. Install dependencies using `npm install`
2. Run database migrations
3. Start development server
4. Run integration tests

## Success Criteria

- [ ] All unit tests pass
- [ ] Code coverage exceeds 80%
- [ ] No ESLint errors or warnings
- [ ] Application starts without errors
```

---

### Zone 3: Steering

**Purpose**: Provide few-shot examples to steer generation behavior.

**Primitives**:

- **Demonstration** (from Knowledge.examples)

**Rationale**:

- Recency bias: Information just before generation has strongest influence
- Few-shot learning most effective when examples are immediately available
- Concrete demonstrations override abstract instructions

**Rendering Order**:

1. All Demonstration primitives (code examples, input/output pairs)

**Example Output**:

````markdown
## Examples

### Example: Basic Error Handling

**Demonstrates**: Proper try-catch with logging

```typescript
try {
  await riskyOperation();
} catch (error) {
  logger.error("Operation failed", { error, context });
  throw new CustomError("Failed to complete operation", error);
}
```

### Example: Repository Implementation

**Demonstrates**: Clean data access layer

```typescript
class UserRepository {
  async findById(id: string): Promise<User | null> {
    return this.db.query("SELECT * FROM users WHERE id = ?", [id]);
  }
}
```
````

---

## 3. Implementation Algorithm

### 3.1. Core Assembly Function

```typescript
interface AssembledPrompt {
  zones: {
    zone0: string; // Constitution
    zone1: string; // Context
    zone2: string; // Action
    zone3: string; // Steering
  };
  markdown: string; // Final assembled prompt
}

function assemblePrompt(primitives: Primitive[]): AssembledPrompt {
  // Step 1: Group primitives by zone
  const grouped = groupByZone(primitives);

  // Step 2: Sort within each zone
  const sorted = {
    zone0: sortZone0(grouped.zone0), // Policy → Principle
    zone1: sortZone1(grouped.zone1), // Pattern → Concept
    zone2: sortZone2(grouped.zone2), // Procedure → Evaluation
    zone3: sortZone3(grouped.zone3), // Demonstration
  };

  // Step 3: Render each zone to Markdown
  const rendered = {
    zone0: renderZone0(sorted.zone0),
    zone1: renderZone1(sorted.zone1),
    zone2: renderZone2(sorted.zone2),
    zone3: renderZone3(sorted.zone3),
  };

  // Step 4: Concatenate zones with separators
  const markdown = [
    rendered.zone0,
    "---",
    rendered.zone1,
    "---",
    rendered.zone2,
    "---",
    rendered.zone3,
  ]
    .filter(Boolean)
    .join("\n\n");

  return { zones: rendered, markdown };
}
```

### 3.2. Zone Grouping

```typescript
function groupByZone(primitives: Primitive[]): Record<number, Primitive[]> {
  return primitives.reduce(
    (acc, primitive) => {
      const zone = primitive.zone;
      if (!acc[zone]) acc[zone] = [];
      acc[zone].push(primitive);
      return acc;
    },
    {} as Record<number, Primitive[]>
  );
}
```

### 3.3. Zone Sorting

**Zone 0 (Constitution)**:

```typescript
function sortZone0(primitives: Primitive[]): Primitive[] {
  const policies = primitives.filter(p => p.type === "policy");
  const principles = primitives.filter(p => p.type === "principle");
  return [...policies, ...principles];
}
```

**Zone 1 (Context)**:

```typescript
function sortZone1(primitives: Primitive[]): Primitive[] {
  const patterns = primitives.filter(p => p.type === "pattern");
  const concepts = primitives.filter(p => p.type === "concept");
  return [...patterns, ...concepts];
}
```

**Zone 2 (Action)**:

```typescript
function sortZone2(primitives: Primitive[]): Primitive[] {
  const procedures = primitives.filter(p => p.type === "procedure");
  const evaluations = primitives.filter(p => p.type === "evaluation");
  return [...procedures, ...evaluations];
}
```

**Zone 3 (Steering)**:

```typescript
function sortZone3(primitives: Primitive[]): Primitive[] {
  return primitives.filter(p => p.type === "demonstration");
}
```

### 3.4. Rendering Functions

Each zone has a dedicated renderer that converts primitives to Markdown:

```typescript
function renderZone0(primitives: Primitive[]): string {
  const policies = primitives.filter(p => p.type === "policy");
  const principles = primitives.filter(p => p.type === "principle");

  const sections: string[] = [];

  if (policies.length > 0) {
    sections.push("## System Constraints\n");
    sections.push(policies.map(p => `- ${p.content}`).join("\n"));
  }

  if (principles.length > 0) {
    sections.push("\n## Guiding Principles\n");
    sections.push(principles.map(p => `- ${p.content}`).join("\n"));
  }

  return sections.join("\n");
}

// Similar renderers for zone1, zone2, zone3...
```

---

## 4. Advanced Features

### 4.1. Cognitive Level Sorting (Optional)

Within each primitive type, optionally sort by cognitive level:

```typescript
function sortByCognitiveLevel(primitives: Primitive[]): Primitive[] {
  return primitives.sort((a, b) => {
    return a.metadata.cognitiveLevel - b.metadata.cognitiveLevel;
  });
}
```

**Rationale**: Present foundational concepts before domain-specific details.

### 4.2. Module Grouping (Optional)

Keep primitives from the same module together for coherence:

```typescript
function groupByModule(primitives: Primitive[]): Primitive[] {
  const grouped = primitives.reduce(
    (acc, p) => {
      if (!acc[p.moduleId]) acc[p.moduleId] = [];
      acc[p.moduleId].push(p);
      return acc;
    },
    {} as Record<string, Primitive[]>
  );

  return Object.values(grouped).flat();
}
```

### 4.3. Tag-Based Filtering

Filter primitives by tags before assembly:

```typescript
function filterByTags(
  primitives: Primitive[],
  requiredTags: string[]
): Primitive[] {
  return primitives.filter(p => {
    const tags = [...p.metadata.moduleTags, ...p.metadata.componentTags];
    return requiredTags.every(tag => tags.includes(tag));
  });
}
```

---

## 5. Testing and Validation

### 5.1. Assembly Invariants

The assembler MUST maintain these invariants:

1. **Determinism**: Same input → same output order
2. **Zone Ordering**: Zone 0 → Zone 1 → Zone 2 → Zone 3
3. **Type Ordering**: Within each zone, primitive types follow specification order
4. **No Loss**: All input primitives appear exactly once in output
5. **No Duplication**: Each primitive appears exactly once

### 5.2. Test Cases

```typescript
describe("LayeredCakeAssembler", () => {
  it("places policies before principles in Zone 0", () => {
    const primitives = [
      { type: "principle", zone: 0, content: "Use SOLID" },
      { type: "policy", zone: 0, content: "MUST use HTTPS" },
    ];
    const result = assemblePrompt(primitives);
    expect(result.zones.zone0).toMatch(/MUST use HTTPS.*Use SOLID/s);
  });

  it("places demonstrations at the very end", () => {
    const primitives = [
      { type: "procedure", zone: 2, content: "Step 1" },
      { type: "demonstration", zone: 3, content: "Example code" },
      { type: "policy", zone: 0, content: "MUST..." },
    ];
    const result = assemblePrompt(primitives);
    const lines = result.markdown.split("\n");
    const lastContent = lines[lines.length - 1];
    expect(lastContent).toContain("Example code");
  });

  it("is deterministic", () => {
    const primitives = generateRandomPrimitives(100);
    const result1 = assemblePrompt(primitives);
    const result2 = assemblePrompt(primitives);
    expect(result1.markdown).toBe(result2.markdown);
  });
});
```

---

## 6. Usage Examples

### 6.1. CLI Build

```typescript
import { buildPersona } from "ums-sdk";

const result = await buildPersona({
  personaPath: "./personas/backend-engineer.persona.ts",
  outputPath: "./dist/backend-engineer.md",
  assembler: "layered-cake", // Use Layered Cake (default)
});

console.log(result.compilationReport.primitivesByZone);
// { "0": 12, "1": 8, "2": 20, "3": 5 }
```

### 6.2. MCP Dynamic Assembly

```typescript
import { selectPrimitives, assemblePrompt } from "ums-mcp";

// 1. Vector search finds relevant primitives
const candidates = await vectorSearch(userQuery);

// 2. Selector filters by relevance
const selected = await selectPrimitives(candidates, context);

// 3. Layered Cake assembly
const prompt = assemblePrompt(selected);

// 4. Return assembled prompt
return prompt.markdown;
```

---

## 7. Alternatives Considered

### 7.1. Flat Concatenation

**Approach**: Simply concatenate primitives in module order.

**Rejected**: No optimization for attention mechanics or cognitive flow.

### 7.2. Reverse Order (Recency-First)

**Approach**: Place most important items at bottom.

**Rejected**: Policies at bottom allows instruction drift. Poor mental model.

### 7.3. Three-Zone Model

**Approach**: Constitution → Content → Examples (3 zones).

**Rejected**: Doesn't separate Pattern/Concept (context) from Procedure/Evaluation (action).

---

## 8. References

- [LLM Attention Bias Research](https://arxiv.org/abs/2307.03172)
- [Primacy and Recency Effects in Prompting](https://arxiv.org/abs/2310.08370)
- UMS v3.0 Specification
- Constitutional AI Papers (Anthropic)

---

**Specification Version**: 3.0.0
**Last Updated**: 2025-01-24
**Status**: Normative
