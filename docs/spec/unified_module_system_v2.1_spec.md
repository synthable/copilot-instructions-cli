# Specification: The Unified Module System (UMS) v2.1

## Changes from v2.0

### Removed Features

- **ModuleRelationships**: Removed. Will be replaced by Cognitive Hierarchy system and External Graph tool for dependency management.
- **QualityMetadata component**: Removed. Will be replaced by external registry (design in progress).
- **ProblemSolution component**: Removed.
- **ProcessStep fields**: Removed `detail`, `validate`, `when`, `do` fields.
- **Constraint fields**: Removed `severity`, `when`, `examples`, `rationale` fields.
- **Criterion fields**: Removed `severity` field.

### Simplified Structures

- **ProcessStep**: Now `string | {step: string, notes?: string[]}` (removed complex validation/conditional fields).
- **Constraint**: Now `string | {rule: string, notes?: string[]}` (use RFC 2119 keywords in rule text for severity).
- **Criterion**: Now `string | {item: string, category?: string, notes?: string[]}` (use RFC 2119 keywords in item text for priority).

See Architecture Decision Records (ADRs) in `docs/architecture/adr/` for detailed rationale and migration guidance.

---

## Migration from v2.0

**Breaking Changes:**

1. **`ProcessStep` simplified** - Removed `validate`, `when`, and `do` fields
   - Use `notes` array for step elaboration instead of `detail`
   - Express conditionals and validation naturally in step text
   - Validation belongs in `criteria` array, not embedded in process steps

2. **`Constraint` simplified** - Removed `severity`, `when`, `examples`, and `rationale` fields
   - Use RFC 2119 keywords (MUST/SHOULD/MAY) for severity in rule text
   - Use `notes` array for examples, rationale, and clarifications
   - Format examples with `Good:` and `Bad:` prefixes (no emojis)

3. **`Criterion` simplified** - Removed `severity` field, kept `category`, added `notes`
   - Use RFC 2119 keywords (MUST/SHOULD/MAY) for priority in criterion text
   - Use `category` for grouping (now rendered as subheadings)
   - Use `notes` array for test instructions, expected results, and verification steps

**Migration Path:**

```typescript
// ProcessStep: v2.0 (deprecated)
{
  step: 'Start service',
  detail: 'Detailed explanation',
  when: 'Service not running',
  do: 'Execute systemctl start',
  validate: { check: 'Status active', severity: 'error' }
}

// ProcessStep: v2.1 (recommended)
{
  step: 'Start service if not running',
  notes: [
    'Execute: `systemctl start myapp`',
    'Verify: Service status shows active'
  ]
}

// Constraint: v2.0 (deprecated)
{
  rule: 'Use HTTPS',
  severity: 'error',
  when: 'In production',
  rationale: 'Security requirement',
  examples: {
    valid: ['https://api.example.com'],
    invalid: ['http://api.example.com']
  }
}

// Constraint: v2.1 (recommended)
{
  rule: 'MUST use HTTPS in production environments',
  notes: [
    'Security requirement for all production traffic',
    'Good: https://api.example.com',
    'Bad: http://api.example.com'
  ]
}

// Criterion: v2.0 (deprecated)
{
  item: 'All endpoints return proper status codes',
  category: 'API Quality',
  severity: 'critical'
}

// Criterion: v2.1 (recommended)
{
  item: 'All endpoints MUST return proper status codes',
  category: 'API Quality',  // Category now renders as subheading
  notes: [
    'Test: Send GET/POST requests to all endpoints',
    'Expected: 2xx for success, 4xx for client errors, 5xx for server errors',
    'Verify: Check response status codes match expected values'
  ]
}
```

**See:**

- [ADR 0005](../architecture/adr/0005-simplify-processstep-structure.md) - ProcessStep rationale
- [ADR 0006](../architecture/adr/0006-simplify-constraint-structure.md) - Constraint rationale
- [ADR 0007](../architecture/adr/0007-simplify-criterion-structure.md) - Criterion rationale

---

## 1. Overview & Core Principles

The Unified Module System (UMS) v2.1 is a specification for a data-centric, modular, and composable ecosystem for AI instructions. It treats AI instructions as machine-readable source code, moving beyond the limitations of document-centric prompt files.

### 1.1. Key Features

- **Component-Based Architecture**: Modules are composed of reusable component blocks (Instruction, Knowledge, Data)
- **TypeScript-First**: Native TypeScript support with full IDE integration, type safety, and refactoring capabilities
- **Flexible Structure**: Components define structure naturally without rigid contracts
- **Explicit Capabilities**: Module capabilities are declared as top-level metadata
- **Development-Optimized**: On-the-fly TypeScript loading with `tsx` for fast iteration

### 1.2. Core Principles

1. **Data-Centric**: Modules are structured TypeScript files (`.module.ts`), not prose documents
2. **Atomicity**: Each module represents a single, cohesive instructional concept
3. **Composability**: Modules are composed of reusable component blocks
4. **Static Composition**: Sophisticated AI behaviors are created by explicitly sequencing modules in a persona file

### 1.3. Standard Output Artifact

- The canonical source format is TypeScript (`.module.ts`)
- The v2.1 build process produces a single Markdown (`.md`) prompt as the final output
- Markdown is a rendering of the typed components; it is not authoring source

## 2. The Module Definition File

All modules MUST be defined as TypeScript files with the `.module.ts` extension. Each module file MUST export a valid module object that conforms to the `Module` interface.

### 2.1. Top-Level Keys

A valid module for v2.1 MUST contain the following top-level keys:

| Key              | Type                 | Required? | Description                                       |
| :--------------- | :------------------- | :-------- | :------------------------------------------------ |
| `id`             | String               | Yes       | Unique module identifier                          |
| `version`        | String               | Yes       | Semantic version (SemVer 2.0.0)                   |
| `schemaVersion`  | String               | Yes       | Must be `"2.1"`                                   |
| `capabilities`   | Array[String]        | Yes       | What functional capabilities this module provides |
| `cognitiveLevel` | Integer              | Yes       | Cognitive abstraction level (0-6)                 |
| `metadata`       | Object               | Yes       | Human-readable and AI-discoverable metadata       |
| `domain`         | String/Array         | No        | Technology or field this module applies to        |
| `components`     | Array[Component]     | No\*      | Component blocks (see 2.2)                        |
| `instruction`    | InstructionComponent | No\*      | Shorthand for single instruction component        |
| `knowledge`      | KnowledgeComponent   | No\*      | Shorthand for single knowledge component          |
| `data`           | DataComponent        | No\*      | Shorthand for single data component               |

\* At least one of `components`, `instruction`, `knowledge`, or `data` MUST be present.

#### `id`

- **Type**: `String`
- **Required**: Yes
- **Purpose**: Unique, machine-readable identifier for the module
- **Format**: MUST follow pattern: `^[a-z0-9][a-z0-9-]*(/[a-z0-9][a-z0-9-]*)*$`
- **Examples**:
  - `"test-driven-development"`
  - `"foundation/reasoning/systems-thinking"`
  - `"principle/architecture/separation-of-concerns"`

**Recommended Structure**: Module IDs can be flat (e.g., `be-concise`) or hierarchical (e.g., `ethics/do-no-harm`). Use the classification fields (`capabilities`, `domain`, `cognitiveLevel`, and `metadata.tags`) for categorization and discovery rather than encoding classification in the ID structure.

#### `version`

- **Type**: `String`
- **Required**: Yes
- **Format**: MUST be a valid Semantic Versioning 2.0.0 string (e.g., `"1.0.0"`, `"2.1.3-beta"`)
- **Purpose**: Enable lifecycle management and deterministic builds
- **v2.0 Behavior**: Reserved for future version resolution (v2.0 implementations MAY ignore this field)

#### `schemaVersion`

- **Type**: `String`
- **Required**: Yes
- **Format**: MUST be `"2.1"` for v2.1 modules
- **Purpose**: Declare which UMS specification version this module conforms to
- **Validation**: Build tools MUST validate this field and reject incompatible versions

#### `capabilities`

- **Type**: `Array<string>`
- **Required**: Yes
- **Purpose**: Declare what functional capabilities this module provides (what it helps you do)
- **Constraints**:
  - MUST be a non-empty array
  - Each capability SHOULD be lowercase kebab-case
  - Capabilities SHOULD be concrete, functional, and searchable
  - Focus on **what** the module helps accomplish (not the domain or pattern)
- **Examples**:
  - `["testing", "quality-assurance", "unit-testing", "integration-testing", "test-automation"]` - helps with testing and quality assurance through comprehensive testing strategies, including unit tests, integration tests, and automated test suites to ensure code reliability and prevent regressions
  - `["api-design", "rest-api", "http-methods", "resource-modeling", "api-versioning"]` - helps design REST APIs by defining resource-based endpoints, mapping HTTP methods to CRUD operations, modeling resources effectively, and implementing versioning for backward compatibility
  - `["error-handling", "logging", "debugging", "fault-tolerance", "exception-management"]` - helps handle errors and debug issues by implementing robust error handling patterns, structured logging for observability, debugging techniques, fault tolerance mechanisms, and proper exception propagation
  - `["performance-optimization", "caching", "query-optimization", "resource-management", "scalability"]` - helps optimize performance through caching strategies, database query optimization, efficient resource management, and scalability patterns to handle increased load
  - `["type-safety", "compile-time-checking", "static-analysis", "type-inference", "generic-programming"]` - helps achieve type safety by leveraging compile-time checking, static analysis tools, type inference systems, and generic programming to catch errors early and improve code maintainability (vs. `domain: "typescript"`)
  - `["component-composition", "state-management", "reactive-programming", "component-lifecycle", "data-flow"]` - helps compose UI components by managing state effectively, implementing reactive programming patterns, handling component lifecycles, and ensuring proper data flow in user interfaces (vs. `domain: "react"`)
  - `["architecture", "maintainability", "modular-design", "dependency-injection", "design-patterns"]` - helps design maintainable systems through architectural principles, modular design approaches, dependency injection, and application of proven design patterns for long-term code health (vs. `tags: ["solid", "ddd"]`)
  - `["data-modeling", "schema-design", "normalization", "relationships", "data-validation"]` - helps design data structures by creating effective schemas, applying normalization techniques, defining relationships between entities, and implementing data validation rules (vs. `domain: "database"`)
  - `["security", "authentication", "authorization", "encryption", "access-control"]` - helps implement security measures including authentication mechanisms, authorization policies, data encryption, and access control systems to protect against threats
  - `["documentation", "api-specification", "code-comments", "readme-writing", "api-documentation"]` - helps create clear documentation through API specifications, comprehensive code comments, well-structured README files, and detailed API documentation for better developer experience
  - `["deployment", "ci-cd", "automation", "infrastructure-as-code", "release-management"]` - helps automate deployment processes with CI/CD pipelines, infrastructure as code practices, automated testing in pipelines, and effective release management strategies
  - `["monitoring", "observability", "metrics", "logging", "alerting"]` - helps track system health through monitoring dashboards, observability practices, key metrics collection, centralized logging, and proactive alerting for issues
- **Distinction**: Use `capabilities` for **what the module helps accomplish**, `domain` for **where it applies**, and `metadata.tags` for **patterns/keywords**

#### `metadata`

- **Type**: `Object`
- **Required**: Yes
- **Purpose**: Provide human-readable and AI-discoverable metadata
- **See**: Section 2.3 for detailed structure

#### `cognitiveLevel`

- **Type**: `CognitiveLevel` enum (0-6)
- **Required**: Yes
- **Purpose**: Classify the module's position in the cognitive abstraction hierarchy
- **Import**: `import { CognitiveLevel } from 'ums-lib';`
- **Enum Values**:
  - **0 / `CognitiveLevel.AXIOMS_AND_ETHICS`**: Universal truths, ethical bedrock, non-negotiable principles
  - **1 / `CognitiveLevel.REASONING_FRAMEWORKS`**: How to think, analyze, and form judgments
  - **2 / `CognitiveLevel.UNIVERSAL_PATTERNS`**: Cross-domain patterns and principles that apply broadly
  - **3 / `CognitiveLevel.DOMAIN_SPECIFIC_GUIDANCE`**: Field-specific but technology-agnostic best practices
  - **4 / `CognitiveLevel.PROCEDURES_AND_PLAYBOOKS`**: Step-by-step instructions and actionable guides
  - **5 / `CognitiveLevel.SPECIFICATIONS_AND_STANDARDS`**: Precise requirements, validation criteria, compliance rules
  - **6 / `CognitiveLevel.META_COGNITION`**: Self-reflection, process improvement, learning from experience
- **Classification Guidance**:
  - More abstract/universal → lower numbers (0-2)
  - More concrete/specific → higher numbers (4-5)
  - Domain principles → middle range (3)
  - Self-reflective processes → highest level (6)
- **Usage Examples**:
  - `cognitiveLevel: CognitiveLevel.AXIOMS_AND_ETHICS` - "Do No Harm", "Respect Privacy"
  - `cognitiveLevel: CognitiveLevel.REASONING_FRAMEWORKS` - "Systems Thinking", "Critical Analysis"
  - `cognitiveLevel: CognitiveLevel.UNIVERSAL_PATTERNS` - "Separation of Concerns", "SOLID Principles"
  - `cognitiveLevel: CognitiveLevel.DOMAIN_SPECIFIC_GUIDANCE` - "REST API Design", "Database Normalization"
  - `cognitiveLevel: CognitiveLevel.PROCEDURES_AND_PLAYBOOKS` - "Git Workflow Guide", "Code Review Process"
  - `cognitiveLevel: CognitiveLevel.SPECIFICATIONS_AND_STANDARDS` - "OpenAPI Schema Validation", "Security Compliance Checklist"
  - `cognitiveLevel: CognitiveLevel.META_COGNITION` - "Retrospective Practice", "Continuous Improvement"

#### `domain`

- **Type**: `String` or `Array<string>`
- **Required**: No
- **Purpose**: Declare the technology, language, or field this module applies to (where it's used)
- **Constraints**:
  - Use for technology/language specificity (e.g., `"typescript"`, `"python"`)
  - Use for technical domains (e.g., `"backend"`, `"frontend"`, `"database"`)
  - Use `"language-agnostic"` for universal applicability
  - Can be a single string or array of strings
- **Examples**:
  - `"python"` - Python-specific module
  - `"language-agnostic"` - Applies to all languages
  - `["backend", "api"]` - Backend API development
  - `["frontend", "react", "typescript"]` - React + TypeScript frontend
  - `["database", "postgresql"]` - PostgreSQL database specific
- **Distinction**: Use `domain` for **where the module applies** (technology/field), `capabilities` for **what it helps accomplish**, and `metadata.tags` for **additional keywords/patterns**

### 2.1.1. TypeScript Module Export Requirements

All module files MUST export a module object using a **named export** that matches a camelCase transformation of the module ID's final segment.

**Export Naming Convention**:

- Take the final segment of the module ID (after the last `/`)
- Transform kebab-case to camelCase
- Use as the export name

**Examples**:

```typescript
// error-handling.module.ts
// Module ID: "error-handling"
export const errorHandling: Module = { ... };

// test-driven-development.module.ts
// Module ID: "principle/testing/test-driven-development"
export const testDrivenDevelopment: Module = { ... };

// systems-thinking.module.ts
// Module ID: "foundation/reasoning/systems-thinking"
export const systemsThinking: Module = { ... };
```

**Rationale**: Named exports enable:

- IDE auto-completion and refactoring
- Type-safe module references
- Tree-shaking in build tools
- Clear origin tracking in composed personas

**Validation**: Build tools MUST verify that:

1. The module file exports exactly one named export
2. The export conforms to the `Module` interface
3. The exported object's `id` field matches the expected module ID

### 2.2. Component Architecture

UMS v2.1 uses a **component-based architecture** where modules are composed of three types of components:

1. **Instruction Component**: Tells the AI what to do
2. **Knowledge Component**: Teaches the AI concepts and patterns
3. **Data Component**: Provides reference information

Modules can include components in two ways:

**Option A: Multiple Components (Array)**

```typescript
components: [
  {
    type: ComponentType.Instruction,
    instruction: { purpose: "...", process: [...] }
  },
  {
    type: ComponentType.Knowledge,
    knowledge: { explanation: "...", concepts: [...] }
  }
]
```

**Option B: Single Component (Shorthand)**

```typescript
instruction: {
  type: ComponentType.Instruction,
  instruction: { purpose: "...", constraints: [...] }
}
```

#### Component Type: Instruction

Tells the AI **what to do**.

```typescript
interface InstructionComponent {
  type: "instruction";
  metadata?: ComponentMetadata;
  instruction: {
    purpose: string; // Primary objective
    process?: Array<string | ProcessStep>; // Sequential steps
    constraints?: Constraint[]; // Non-negotiable rules
    principles?: string[]; // High-level guidelines
    criteria?: Criterion[]; // Success criteria
  };
}
```

**Fields**:

- `purpose` (required): The primary objective or goal of this instruction set
- `process` (optional): Step-by-step procedural instructions
- `constraints` (optional): Non-negotiable rules that MUST be followed
- `principles` (optional): High-level guiding principles
- `criteria` (optional): Verification criteria for success

#### Component Type: Knowledge

Teaches the AI **concepts and patterns**.

```typescript
interface KnowledgeComponent {
  type: "knowledge";
  metadata?: ComponentMetadata;
  knowledge: {
    explanation: string; // High-level overview
    concepts?: Concept[]; // Core concepts
    examples?: Example[]; // Illustrative examples
    patterns?: Pattern[]; // Design patterns
  };
}
```

**Fields**:

- `explanation` (required): High-level conceptual overview
- `concepts` (optional): Core concepts to understand
- `examples` (optional): Concrete code/text examples
- `patterns` (optional): Design patterns and best practices

#### Component Type: Data

Provides **reference information**.

```typescript
interface DataComponent {
  type: "data";
  metadata?: ComponentMetadata;
  data: {
    format: string; // Media type (json, yaml, xml, etc.)
    description?: string; // What this data represents
    value: unknown; // The actual data
  };
}
```

**Fields**:

- `format` (required): Data format/media type (e.g., `"json"`, `"yaml"`, `"xml"`)
- `description` (optional): Human-readable description
- `value` (required): The actual data content

### 2.3. The `metadata` Block

| Key           | Type          | Required? | Description                                 |
| :------------ | :------------ | :-------- | :------------------------------------------ |
| `name`        | String        | Yes       | Human-readable, Title Case name             |
| `description` | String        | Yes       | Concise, single-sentence summary            |
| `semantic`    | String        | Yes       | Dense, keyword-rich paragraph for AI search |
| `tags`        | Array[String] | No        | Lowercase keywords for filtering            |
| `license`     | String        | No        | SPDX license identifier                     |
| `authors`     | Array[String] | No        | Primary authors or maintainers              |
| `homepage`    | String        | No        | URL to source repository or docs            |
| `deprecated`  | Boolean       | No        | Deprecation flag                            |
| `replacedBy`  | String        | No        | ID of successor module                      |

#### `name`

- **Type**: `String`
- **Required**: Yes
- **Purpose**: Concise, human-readable title for the module
- **Constraints**: SHOULD be in Title Case
- **Example**: `"Test-Driven Development"`, `"REST API Design Best Practices"`

#### `description`

- **Type**: `String`
- **Required**: Yes
- **Purpose**: Clear, single-sentence summary of the module's function
- **Constraints**: SHOULD be a single, well-formed sentence
- **Example**: `"Apply TDD methodology for higher quality code"`

#### `semantic`

- **Type**: `String`
- **Required**: Yes
- **Purpose**: Detailed, semantically rich paragraph for vector embedding and semantic search
- **Constraints**:
  - MUST be a complete paragraph
  - SHOULD include relevant keywords, synonyms, technical details
  - Optimized for `all-mpnet-base-v2` embedding model
- **Example**: `"TDD, test-driven development, red-green-refactor, unit testing, test-first development, quality assurance, regression prevention"`

#### `tags`

- **Type**: `Array<string>`
- **Required**: No
- **Purpose**: Additional keywords, patterns, and descriptive labels for search and filtering
- **Constraints**:
  - All tags MUST be lowercase, SHOULD be kebab-case
  - Use for patterns, methodologies, and keywords not captured by `capabilities` or `domain`
- **Common Tag Types**:
  - **Patterns**: `"solid"`, `"ddd"`, `"tdd"`, `"mvc"`, `"factory-pattern"`
  - **Methodologies**: `"agile"`, `"devops"`, `"ci-cd"`
  - **Characteristics**: `"async"`, `"reactive"`, `"functional"`, `"imperative"`
  - **Keywords**: `"best-practices"`, `"anti-patterns"`, `"refactoring"`
- **Examples**:
  - `["tdd", "red-green-refactor"]` - TDD pattern keywords
  - `["solid", "single-responsibility"]` - SOLID principle tags
  - `["async", "promises", "event-loop"]` - Async programming keywords
  - `["best-practices", "clean-code"]` - General quality tags
- **Distinction**:
  - Use `capabilities` for **what** the module helps accomplish (functional capabilities)
  - Use `domain` for **where** it applies (technology/field)
  - Use `cognitiveLevel` for **abstraction level** (0-6 hierarchy)
  - Use `tags` for **patterns, keywords, and additional descriptors**

#### `license`, `authors`, `homepage`

Standard metadata fields for attribution and legal clarity.

- `license`: SPDX license identifier (e.g., `"MIT"`, `"Apache-2.0"`)
- `authors`: Array of `"Name <email>"` strings
- `homepage`: Valid URL to source repository or documentation

#### `deprecated`, `replacedBy`

Lifecycle management fields.

- `deprecated`: Boolean flag indicating deprecation
- `replacedBy`: MUST be a valid module ID
- `replacedBy` MUST NOT be present unless `deprecated: true`

### 2.4. Component Metadata

```typescript
interface ComponentMetadata {
  purpose?: string; // Purpose of this component
  context?: string[]; // Where this component is most useful
}
```

**Example**:

```typescript
components: [
  {
    type: ComponentType.Instruction,
    metadata: {
      purpose: "Core TDD workflow",
      context: ["unit-testing", "development"],
    },
    instruction: {
      purpose: "Apply TDD rigorously",
      // ...
    },
  },
];
```

## 3. Directive Types

### 3.1. ProcessStep

```typescript
type ProcessStep =
  | string
  | {
      step: string; // The step description
      notes?: string[]; // Optional sub-bullets for clarification
    };
```

**Rationale**: Process steps are kept simple to reduce authoring friction. Most steps are self-explanatory strings. When elaboration is needed, the `notes` array provides sub-bullets without over-engineering. Conditionals and validation are expressed naturally in the step text or kept separate in the `criteria` array.

**Example**:

```typescript
process: [
  "Identify resources (nouns, not verbs)",
  {
    step: "Run database migrations",
    notes: [
      "Use `npm run migrate` for development",
      "Production migrations require admin approval",
      "Verify migration status with `npm run migrate:status`",
    ],
  },
  "Map HTTP methods to CRUD operations",
];
```

**Natural Language for Complex Logic**:

```typescript
process: [
  "Run tests. If tests fail, fix issues before proceeding.",
  "Deploy to staging environment",
  "Run smoke tests and verify all endpoints return 200 OK",
];
```

### 3.2. Constraint

A constraint can be a simple string or an object with optional notes for elaboration.

```typescript
type Constraint =
  | string
  | {
      rule: string; // The constraint rule. Use RFC 2119 keywords (MUST, SHOULD, MAY) for severity.
      notes?: string[]; // Optional notes for examples, rationale, or clarification.
    };
```

**Simple Example (90% of cases):**

```typescript
constraints: [
  "URLs MUST use plural nouns for collections",
  "All endpoints MUST return proper HTTP status codes",
  "Never expose sensitive data in URLs",
];
```

**Example with Notes (10% of cases):**

```typescript
constraints: [
  {
    rule: "URLs MUST use plural nouns for collections",
    notes: [
      "Good: /users, /users/123, /orders",
      "Bad: /user, /getUser, /createOrder",
      "Rationale: REST conventions require resource-based URLs",
    ],
  },
  {
    rule: "All API responses MUST include proper HTTP status codes",
    notes: [
      "2xx for success (200 OK, 201 Created, 204 No Content)",
      "4xx for client errors (400 Bad Request, 404 Not Found)",
      "5xx for server errors (500 Internal Server Error)",
      "See RFC 7231 for complete status code definitions",
    ],
  },
];
```

**Authoring Guidelines:**

Use [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt) keywords to indicate requirement levels:

- **MUST** / **REQUIRED** / **SHALL** = Error severity (absolute requirement)
- **MUST NOT** / **SHALL NOT** = Error severity (absolute prohibition)
- **SHOULD** / **RECOMMENDED** = Warning severity (recommended but not required)
- **SHOULD NOT** / **NOT RECOMMENDED** = Warning severity (recommended against)
- **MAY** / **OPTIONAL** = Info severity (truly optional)

For notes:

- Use `Good:` and `Bad:` prefixes for examples (no emojis)
- Use `Rationale:` prefix for explanations
- Use template literals for multi-line content in a single entry
- Include external references (RFCs, standards, guidelines)

**See:** [ADR 0006](../architecture/adr/0006-simplify-constraint-structure.md) for detailed rationale.

### 3.3. Criterion

A criterion can be a simple string or an object with optional category and notes for elaboration.

```typescript
type Criterion =
  | string
  | {
      item: string; // The verification criterion
      category?: string; // Optional grouping (renders as subheadings)
      notes?: string[]; // Optional test instructions, expected results, verification steps
    };
```

**Simple Example (90% of cases):**

```typescript
criteria: [
  "All endpoints return proper status codes",
  "API responses match documented schemas",
  "Error handling covers common edge cases",
];
```

**Example with Categories:**

```typescript
criteria: [
  // Uncategorized
  "All tests pass before deployment",
  "Documentation is complete",

  // Security category
  {
    item: "All endpoints use HTTPS",
    category: "Security",
  },
  {
    item: "Authentication required for protected resources",
    category: "Security",
  },

  // Performance category
  {
    item: "Response times under 100ms",
    category: "Performance",
  },
];
```

**Example with Test Details:**

```typescript
criteria: [
  {
    item: "Rate limiting prevents abuse",
    category: "Security",
    notes: [
      "Test: Send 100 requests in 1 minute using same API key",
      "Expected: Receive 429 Too Many Requests after limit",
      "Verify: Rate limit headers present (X-RateLimit-Limit, X-RateLimit-Remaining)",
      "See RFC 6585 section 4 for 429 status code specification",
    ],
  },
  {
    item: "Database queries optimized",
    category: "Performance",
    notes: [
      "Test: Run EXPLAIN on all queries",
      "Verify: All queries use indexes",
      "Verify: No N+1 query patterns",
    ],
  },
];
```

**Authoring Guidelines:**

Use [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt) keywords to indicate priority:

- **MUST** / **REQUIRED** / **SHALL** = Critical (absolute requirement)
- **SHOULD** / **RECOMMENDED** = Important (recommended)
- **MAY** / **OPTIONAL** = Nice-to-have (truly optional)

For notes:

- Use `Test:` prefix for test instructions
- Use `Expected:` prefix for expected results
- Use `Verify:` prefix for verification steps
- Include external references (RFCs, standards, guidelines)
- Use template literals for multi-line test scenarios

**Rendering:** Categories render as `### Category` subheadings. Criteria with notes are bolded, with notes as bulleted sub-items.

**See:** [ADR 0007](../architecture/adr/0007-simplify-criterion-structure.md) for detailed rationale.

### 3.4. Concept

```typescript
interface Concept {
  name: string; // Concept name
  description: string; // Detailed explanation
  rationale?: string; // Why this matters
  examples?: string[]; // Examples
  tradeoffs?: string[]; // Pros and cons
}
```

**Example**:

```typescript
concepts: [
  {
    name: "Resource-Based URLs",
    description: "URLs represent resources (things), not actions",
    rationale: "Resources are stable; operations change",
    examples: [
      "GET /users/123 (resource: user)",
      "GET /getUser?id=123 (action: get)",
    ],
  },
];
```

### 3.5. Example

```typescript
interface Example {
  title: string; // Example title
  rationale: string; // What this demonstrates
  snippet: string; // Code snippet
  language?: string; // Programming language
}
```

**Example**:

```typescript
examples: [
  {
    title: "Basic Error Handling",
    rationale: "Shows try-catch with proper logging",
    language: "typescript",
    snippet: `
      try {
        await riskyOperation();
      } catch (error) {
        logger.error('Operation failed', { error, context });
        throw new CustomError('Failed to complete operation', error);
      }
    `,
  },
];
```

### 3.6. Pattern

```typescript
interface Pattern {
  name: string; // Pattern name
  useCase: string; // When to use this
  description: string; // How it works
  advantages?: string[];
  disadvantages?: string[];
  example?: Example;
}
```

**Example**:

```typescript
patterns: [
  {
    name: "Repository Pattern",
    useCase: "Abstract data access layer",
    description: "Encapsulate data access logic in repository classes",
    advantages: ["Testable in isolation", "Centralized data access logic"],
    disadvantages: ["Additional abstraction layer"],
  },
];
```

## 4. The Persona Definition File

Personas are TypeScript files (`.persona.ts`) that define AI agent configurations by composing modules.

### 4.1. Required Persona Metadata

```typescript
interface Persona {
  id: string; // Unique persona identifier
  name: string; // Human-readable persona name
  version: string; // Semantic version
  schemaVersion: string; // Must be "2.1"
  description: string; // Concise summary
  semantic: string; // Dense, keyword-rich description
  identity?: string; // Persona prologue (voice, traits, capabilities)
  tags?: string[]; // Keywords for filtering
  domains?: string[]; // Broader categories
  modules: ModuleEntry[]; // Composition block
}
```

### 4.2. Composition Block (`modules`)

```typescript
type ModuleEntry = string | ModuleGroup;

interface ModuleGroup {
  group: string; // Group name (Title Case, descriptive)
  ids: string[]; // Module IDs in this group
}
```

**Constraints**:

- Module IDs MUST be valid and version-agnostic
- No duplicate module IDs across the entire persona
- Group names SHOULD be concise and descriptive
- Top-level order defines effective composition order

**Example**:

```typescript
modules: [
  "foundation/ethics/do-no-harm",
  {
    group: "Professional Standards",
    ids: [
      "principle/testing/test-driven-development",
      "principle/architecture/separation-of-concerns",
    ],
  },
  "error-handling",
];
```

## 5. Module Resolution

Implementations construct an in-memory Module Registry for resolving module references.

### 5.1. The Module Registry

Implementations construct the Module Registry by:

1. **Loading Standard Library**: Built-in modules are loaded first
2. **Loading Local Modules**: Modules from `modules.config.yml` paths are loaded
3. **Applying Conflict Resolution**: Using strategies defined in config

### 5.1.1. Standard Library

The **Standard Library** is a curated collection of reusable modules that provide core AI instruction patterns, reasoning frameworks, and best practices across all cognitive levels.

**Discovery and Location**:

- Standard Library location and structure is **implementation-defined**
- Implementations MAY bundle standard modules directly
- Implementations MAY load standard modules from an external package or registry
- Implementations SHOULD document their standard library discovery mechanism

**Loading Behavior**:

- Standard Library modules MUST be loaded into the registry before local modules
- Standard Library modules use source identifier `"standard"` in build reports
- Conflict resolution strategies apply when local modules conflict with standard modules

**Rationale**: Allowing implementation flexibility enables:

- Embedded standard libraries for offline-first tools
- Dynamic standard libraries for cloud-based implementations
- Custom standard libraries for enterprise deployments
- Simplified testing with fixture-based standard libraries

**Recommendation**: Implementations SHOULD provide a mechanism to:

1. List available standard library modules
2. Inspect standard module definitions
3. Override or disable specific standard modules

### 5.2. Configuration File (`modules.config.yml`)

```yaml
localModulePaths:
  - path: "./company-standards"
    onConflict: "error" # Fail on collision
  - path: "./project-overrides"
    onConflict: "replace" # Override existing
  - path: "./experimental"
    onConflict: "warn" # Warn and keep original
```

### 5.3. Conflict Resolution Strategies

- **`error`** (default): Build fails on ID collision
- **`replace`**: New module replaces existing
- **`warn`**: Keep existing, emit warning

### 5.4. Resolution Order

1. Initialize with Standard Library
2. Process `localModulePaths` in order
3. Resolve persona modules from final registry

### 5.5. External Dependency Management (Future)

Module relationships and dependencies (such as `requires`, `conflictsWith`, `enhances`) are managed by an external graphing tool and registry, as defined in [ADR-0008: External Graph Tool for Module Dependency Management](../../architecture/adr/0008-external-graph-tool.md).

**Purpose**: This external system is responsible for:

- Validating the integrity and compatibility of a persona's module composition
- Detecting conflicts, missing dependencies, and circular references
- Providing rich querying and visualization of module relationships
- Leveraging the Cognitive Hierarchy for implicit dependency inference

**Integration**: The external graph tool will integrate with the UMS SDK build orchestration to validate persona compositions before the build process begins.

**Status**: Design in progress. See ADR-0008 for architectural details and implementation timeline.

**Note**: In UMS v2.0, dependency information was embedded in module definitions via `ModuleRelationships`. This was removed in v2.1 to enable centralized dependency management with better validation and tooling capabilities.

## 6. Build and Synthesis Processes

### 6.1. Static Compilation

The build process:

1. Loads persona definition
2. Resolves all module IDs from registry
3. Renders components to Markdown in order
4. Produces single `.md` prompt file
5. Emits build report (`.build.json`)

### 6.2. Markdown Rendering Rules

Components are rendered to Markdown as follows:

#### Instruction Component

```markdown
## Instructions

**Purpose**: {purpose}

### Process

1. {step 1}
2. {step 2}

### Constraints

- {constraint 1}
- {constraint 2}

### Principles

- {principle 1}
- {principle 2}

### Criteria

- [ ] {criterion 1}
- [ ] {criterion 2}
```

#### Knowledge Component

````markdown
## Knowledge

{explanation}

### Key Concepts

**{concept name}**: {description}
_Why_: {rationale}

### Examples

#### {example title}

{rationale}

```{language}
{code}
```
````

````

#### Data Component

```markdown
## Data

{description}

```{format}
{value}
````

```````

### 6.3. Detailed Rendering Specifications

This section provides precise rendering specifications for v2.1 simplified structures (ProcessStep, Constraint, Criterion with notes/categories).

#### 6.3.1. ProcessStep Rendering

**Format:**
```
{index}. {step}                    ← Simple string
{index}. **{step}**                ← Object with notes (bolded)
   - {note1}                       ← 3-space indent
   - {note2}
```

**Indentation:** 3 spaces for notes under numbered steps
**Blank lines:** No blank lines between steps
**Bolding:** Bold step text when notes are present

**Example:**
```markdown
1. Clone repository
2. **Install dependencies**
   - Run `npm install`
   - Verify package-lock.json updated
3. Run tests
```

#### 6.3.2. Constraint Rendering

**Format:**
```
- {rule}                           ← Simple string
- **{rule}**                       ← Object with notes (bolded)
  - {note1}                        ← 2-space indent
  - {note2}
```

**Indentation:** 2 spaces for notes under bullet items
**Blank lines:** Single blank line between constraints
**Bolding:** Bold rule text when notes are present

**Example:**
```markdown
- MUST use HTTPS for all API endpoints

- **URLs MUST use plural nouns for collections**
  - Good: /users, /users/123, /orders
  - Bad: /user, /getUser, /createOrder
  - Rationale: REST conventions require resource-based URLs
```

#### 6.3.3. Criterion Rendering

Criteria support optional category grouping and test elaboration through notes.

##### Rendering Algorithm

```typescript
function renderCriteria(criteria: Criterion[]): string {
  // 1. Group criteria by category
  const uncategorized: Criterion[] = [];
  const categorized = new Map<string, Criterion[]>();

  for (const criterion of criteria) {
    if (typeof criterion === 'string' || !criterion.category) {
      uncategorized.push(criterion);
    } else {
      if (!categorized.has(criterion.category)) {
        categorized.set(criterion.category, []);
      }
      categorized.get(criterion.category).push(criterion);
    }
  }

  const sections: string[] = [];

  // 2. Render uncategorized first
  if (uncategorized.length > 0) {
    sections.push(uncategorized.map(renderItem).join('\n\n'));
  }

  // 3. Render categorized groups with subheadings
  for (const [category, items] of categorized.entries()) {
    sections.push(`### ${category}\n`);
    sections.push(items.map(renderItem).join('\n\n'));
  }

  return sections.join('\n\n');
}

function renderItem(criterion: Criterion): string {
  if (typeof criterion === 'string') {
    return `- [ ] ${criterion}`;
  }

  if (criterion.notes && criterion.notes.length > 0) {
    let text = `- [ ] **${criterion.item}**`;
    text += '\n' + criterion.notes.map(note => `  - ${note}`).join('\n');
    return text;
  }

  return `- [ ] ${criterion.item}`;
}
```

##### Format Rules

**Heading levels:**
- Category headings: `###` (level 3, one below `## Criteria`)
- Format: `### ${category}\n`

**Indentation:**
- Checkbox items: No indentation
- Notes: 2 spaces
- Format: `  - ${note}`

**Blank lines:**
- Between uncategorized items: Single blank line (`\n\n`)
- Before each category heading: Single blank line
- Between items in same category: Single blank line

**Bolding:**
- Criteria with notes: Bold the item text
- Format: `- [ ] **${item}**`

##### Rendering Order

**Guarantees:**
1. Uncategorized criteria always appear first
2. Categorized criteria appear in order of first occurrence
3. Within each category, criteria maintain original array order
4. Duplicate category names are grouped under same heading

**Example:**
```typescript
[
  'Uncategorized 1',
  { item: 'Perf 1', category: 'Performance' },
  { item: 'Sec 1', category: 'Security' },
  'Uncategorized 2',
  { item: 'Perf 2', category: 'Performance' }
]
```

**Renders as:**
```markdown
## Criteria

- [ ] Uncategorized 1

- [ ] Uncategorized 2

### Performance

- [ ] Perf 1

- [ ] Perf 2

### Security

- [ ] Sec 1
```

##### Edge Cases

**1. Empty category name:**
```typescript
{ item: 'Test', category: '' }
```
**Behavior:** Treated as uncategorized (empty string is falsy)

**2. Empty notes array:**
```typescript
{ item: 'Test', notes: [] }
```
**Behavior:** Rendered as regular item (no bold, no notes)

**3. Whitespace-only category:**
```typescript
{ item: 'Test', category: '   ' }
```
**Behavior:** Rendered with whitespace heading (implementations SHOULD reject in validation)

**4. Duplicate categories:**
```typescript
[
  { item: 'Item 1', category: 'Security' },
  { item: 'Item 2', category: 'Performance' },
  { item: 'Item 3', category: 'Security' }
]
```
**Behavior:** Items grouped under same category heading, order preserved from first occurrence

**5. Mixed string and object criteria:**
```typescript
[
  'Simple criterion',
  { item: 'Object criterion', category: 'Security' },
  'Another simple'
]
```
**Behavior:** Strings treated as uncategorized

##### Complete Example

**Input:**
```typescript
criteria: [
  'All tests pass',
  'Documentation complete',
  {
    item: 'HTTPS enforced',
    category: 'Security'
  },
  {
    item: 'Rate limiting active',
    category: 'Security',
    notes: [
      'Test: Send 100 req/min',
      'Expected: 429 after limit'
    ]
  },
  {
    item: 'Response time < 100ms',
    category: 'Performance',
    notes: ['Measure with load testing tool']
  }
]
```

**Rendered output:**
```markdown
## Criteria

- [ ] All tests pass

- [ ] Documentation complete

### Security

- [ ] HTTPS enforced

- [ ] **Rate limiting active**
  - Test: Send 100 req/min
  - Expected: 429 after limit

### Performance

- [ ] **Response time < 100ms**
  - Measure with load testing tool
```

##### Validation Recommendations

Implementations SHOULD validate:

1. **Category names:**
   - Not empty or whitespace-only
   - Less than 50 characters
   - No special characters: `#`, `*`, `[`, `]`

2. **Item text:**
   - Not empty
   - No leading/trailing whitespace
   - Less than 200 characters

3. **Notes:**
   - No empty strings
   - Each note less than 150 characters
   - No multi-line strings (breaks indentation)

4. **Array size:**
   - Total criteria less than 50
   - Criteria per category less than 20

##### Markdown Escaping

**Current behavior:** No escaping applied

**Rationale:** Authors write Markdown-safe text. Special characters in item text are preserved as-is, allowing intentional Markdown formatting.

**Example with Markdown:**
```typescript
{
  item: 'API endpoints follow REST conventions',
  notes: [
    'Good: `/users`, `/users/123`, `/orders`',
    'Bad: `/getUser`, `/createOrder`',
    'Use `snake_case` for query parameters'
  ]
}
```

**Rendered:**
```markdown
- [ ] **API endpoints follow REST conventions**
  - Good: `/users`, `/users/123`, `/orders`
  - Bad: `/getUser`, `/createOrder`
  - Use `snake_case` for query parameters
```

#### 6.3.4. Concept Rendering

**Format:**

```markdown
#### Concept: {concept.name}

{concept.description}

**Rationale**: {concept.rationale}

**Examples**:
- {example1}
- {example2}

**Trade-offs**:
- {tradeoff1}
- {tradeoff2}
```

**Heading Level:** Concept names SHOULD be rendered as H4 headings.
**Indentation:** 2 spaces for bulleted lists (`examples`, `tradeoffs`).
**Blank lines:**
*   A single blank line (`\n\n`) between the heading and description.
*   A single blank line (`\n\n`) between the description and "Rationale" (if present).
*   A single blank line (`\n\n`) between "Rationale" and "Examples" (if present).
*   A single blank line (`\n\n`) between "Examples" and "Trade-offs" (if present).
*   No blank lines within bulleted lists.
**Bolding:** Field labels like "Rationale", "Examples", "Trade-offs" are bolded.
**Optional Fields:** If `description`, `rationale`, `examples`, or `tradeoffs` are empty or not present, their corresponding sections (including headings/labels) MUST be omitted entirely.

**Example:**

```markdown
#### Concept: Resource-Based URLs

URLs represent resources (things), not actions.

**Rationale**: Resources are stable; operations change. Resource-based design is more maintainable.

**Examples**:
- `GET /users/123` (resource: user)
- `GET /getUser?id=123` (action: get)

**Trade-offs**:
- Initial design might require more thought
- Provides a clearer, more consistent API surface
```

**Validation Recommendations:**

1. **Required fields:**
   - `name` MUST be non-empty string
   - At least one of `description`, `rationale`, `examples`, or `tradeoffs` MUST be present

2. **Character limits:**
   - `name`: 1-80 characters
   - `description`: 1-500 characters
   - `rationale`: 1-300 characters
   - Individual items in `examples` or `tradeoffs`: 1-200 characters each

3. **Array constraints:**
   - `examples` array: 1-10 items
   - `tradeoffs` array: 1-10 items
   - No empty strings in arrays

4. **Content quality:**
   - `name` should be a clear, concise concept title
   - `description` should be a complete sentence or paragraph
   - Avoid duplicate items in `examples` and `tradeoffs` arrays

#### 6.3.5. Example Rendering

**Format:**

```markdown
#### Example: {example.title}

**Rationale**: {example.rationale}

```{example.language}
{example.snippet}
```
```

**Heading Level:** Example titles SHOULD be rendered as H4 headings.
**Indentation:** None for the main content. Code snippets are naturally indented by the fenced code block.
**Blank lines:**
*   A single blank line (`\n\n`) between the heading and "Rationale" (if present).
*   A single blank line (`\n\n`) between "Rationale" and the code snippet (if present).
*   A single blank line (`\n`) before and after the fenced code block.
**Bolding:** The "Rationale" label is bolded.
**Optional Fields:** If `rationale` is empty or not present, its corresponding section (including label) MUST be omitted. If `snippet` is empty or not present, the code block MUST be omitted. If `language` is not present, the code block MUST use plain fences (``````).
**Code Snippets:**
*   `snippet` content is rendered within a fenced code block.
*   The `language` field, if present, is used as the language identifier for the code block.
*   Snippets containing triple backticks (```) MUST be rendered using a longer fence (e.g., four backticks ````).

**Example:**

```markdown
#### Example: Basic Error Handling

**Rationale**: Shows try-catch with proper logging and custom error throwing.

```typescript
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', { error, context });
  throw new CustomError('Failed to complete operation', error);
}
```
```

**Validation Recommendations:**

1. **Required fields:**
   - `title` MUST be non-empty string
   - At least one of `rationale` or `snippet` MUST be present

2. **Character limits:**
   - `title`: 1-100 characters
   - `rationale`: 1-300 characters
   - `snippet`: 1-2000 characters (code snippets can be longer)

3. **Language field:**
   - If present, `language` should be a valid code language identifier (e.g., `typescript`, `python`, `javascript`)
   - Common values: `typescript`, `javascript`, `python`, `go`, `rust`, `java`, `csharp`, `bash`, `sql`, `json`, `yaml`
   - Empty string treated as missing (use plain fence)

4. **Code snippet quality:**
   - `snippet` should be syntactically valid code for the specified language
   - Avoid snippets longer than 100 lines (split into multiple examples if needed)
   - Prefer complete, runnable examples over fragments
   - Include necessary imports/context for clarity

5. **Special characters:**
   - If snippet contains triple backticks (```), renderer MUST use longer fence (````)
   - No validation errors for special characters in code (preserve as-is)

#### 6.3.6. Pattern Rendering

**Format:**

```markdown
#### Pattern: {pattern.name}

**Use Case**: {pattern.useCase}

{pattern.description}

**Advantages**:
- {advantage1}
- {advantage2}

**Disadvantages**:
- {disadvantage1}
- {disadvantage2}

**Example**:
<!-- Rendered Example (as per 6.3.5) -->
```

**Heading Level:** Pattern names SHOULD be rendered as H4 headings.
**Indentation:** 2 spaces for bulleted lists (`advantages`, `disadvantages`).
**Blank lines:**
*   A single blank line (`\n\n`) between the heading and "Use Case" (if present).
*   A single blank line (`\n\n`) between "Use Case" and `description` (if present).
*   A single blank line (`\n\n`) between `description` and "Advantages" (if present).
*   A single blank line (`\n\n`) between "Advantages" and "Disadvantages" (if present).
*   A single blank line (`\n\n`) between "Disadvantages" and "Example" (if present).
*   No blank lines within bulleted lists.
**Bolding:** Field labels like "Use Case", "Advantages", "Disadvantages", "Example" are bolded.
**Optional Fields:** If `useCase`, `description`, `advantages`, `disadvantages`, or `example` are empty or not present, their corresponding sections (including headings/labels) MUST be omitted. The nested `example` field is rendered according to the `Example Rendering` rules (Section 6.3.5).

**Example:**

```markdown
#### Pattern: Repository Pattern

**Use Case**: Abstract data access layer to decouple business logic from data sources.

Encapsulate data access logic in repository classes, providing a clear interface for data operations.

**Advantages**:
- Testable in isolation
- Centralized data access logic
- Easier to swap data sources

**Disadvantages**:
- Additional abstraction layer
- Can introduce overhead for simple CRUD operations

**Example**:
#### Example: User Repository Interface

**Rationale**: Defines the contract for user data access.

```typescript
interface UserRepository {
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
```
```

**Validation Recommendations:**

1. **Required fields:**
   - `name` MUST be non-empty string
   - At least one of `useCase`, `description`, `advantages`, `disadvantages`, or `example` MUST be present

2. **Character limits:**
   - `name`: 1-100 characters
   - `useCase`: 1-200 characters
   - `description`: 1-500 characters
   - Individual items in `advantages` or `disadvantages`: 1-200 characters each

3. **Array constraints:**
   - `advantages` array: 1-10 items
   - `disadvantages` array: 1-10 items
   - No empty strings in arrays

4. **Content quality:**
   - `name` should be a recognized design pattern name
   - `useCase` should clearly state when/why to use the pattern
   - `description` should explain how the pattern works
   - Balance advantages vs disadvantages (avoid patterns with only advantages)
   - Avoid duplicate items in advantages and disadvantages arrays

5. **Nested Example:**
   - If `example` field is present, it MUST follow Example Rendering rules (Section 6.3.5)
   - Nested example provides concrete illustration of the pattern
   - Example should be complete enough to demonstrate the pattern's key characteristics

---

## 7. The Build Report

For every successful build operation, implementations MUST generate a `.build.json` file alongside the output prompt.

### 7.1. Purpose

The Build Report provides:

- **Reproducibility**: Exact composition can be recreated
- **Auditability**: Clear trail of which modules were included
- **Debugging**: "Bill of materials" for the AI's context

### 7.2. File Format

- **Filename**: Same base name as output, with `.build.json` extension
- **Format**: Well-formed JSON

**Example**: If output is `dist/my-persona.md`, report is `dist/my-persona.build.json`

### 7.3. Structure

```typescript
interface BuildReport {
  personaName: string; // Persona name
  schemaVersion: string; // Report schema version (e.g., "2.0")
  toolVersion: string; // Implementation version
  personaDigest: string; // SHA-256 of persona file
  buildTimestamp: string; // ISO 8601 UTC timestamp
  moduleGroups: ModuleGroup[]; // Ordered module groups
}

interface ModuleGroupReport {
  groupName: string; // Group name
  modules: ResolvedModule[]; // Ordered modules in group
}

interface ResolvedModule {
  id: string; // Module ID
  version: string; // Module version
  source: string; // Source label (e.g., "Standard Library")
  digest: string; // SHA-256 of module file
  composedFrom?: CompositionEvent[]; // If replaced/merged
}

interface CompositionEvent {
  id: string; // Module ID
  version: string; // Version
  source: string; // Source label
  digest: string; // Content digest
  strategy: 'base' | 'replace'; // Composition strategy
}
```

### 7.4. Example Build Report

```json
{
  "personaName": "Backend Engineer",
  "schemaVersion": "2.0",
  "toolVersion": "ums-cli/2.0.0",
  "personaDigest": "sha256:abc123...",
  "buildTimestamp": "2025-01-15T10:00:00Z",
  "moduleGroups": [
    {
      "groupName": "Foundation",
      "modules": [
        {
          "id": "foundation/ethics/do-no-harm",
          "version": "1.0.0",
          "source": "Standard Library",
          "digest": "sha256:def456..."
        }
      ]
    },
    {
      "groupName": "Professional Standards",
      "modules": [
        {
          "id": "principle/testing/test-driven-development",
          "version": "2.0.0",
          "source": "./company-standards",
          "digest": "sha256:ghi789...",
          "composedFrom": [
            {
              "id": "principle/testing/test-driven-development",
              "version": "1.0.0",
              "source": "Standard Library",
              "digest": "sha256:jkl012...",
              "strategy": "base"
            },
            {
              "id": "principle/testing/test-driven-development",
              "version": "2.0.0",
              "source": "./company-standards",
              "digest": "sha256:ghi789...",
              "strategy": "replace"
            }
          ]
        }
      ]
    }
  ]
}
```

## 8. Planned Future Enhancements

- **Module Versioning**: Full support for version resolution in persona files
- **Federation and Remote Registries**: Fetch modules from remote sources
- **Advanced Composition**:
  - `import` directive for direct module composition
  - `bindings` block for dynamic composition
- **Schema Evolution**: Support for v2.1+ with backward compatibility

## Appendix A: Complete Module Examples

### A.1: Simple Instruction Module

```typescript
// error-handling.module.ts
import { Module, ComponentType, CognitiveLevel } from './types/index.js';

export const errorHandling: Module = {
  id: 'error-handling',
  version: '1.0.0',
  schemaVersion: '2.1',
  capabilities: ['error-handling', 'resilience'],
  cognitiveLevel: CognitiveLevel.UNIVERSAL_PATTERNS,
  domain: 'language-agnostic',

  metadata: {
    name: 'Error Handling Best Practices',
    description: 'Handle errors gracefully with proper patterns',
    semantic:
      'Error handling, exception management, fault tolerance, resilience, try-catch, error propagation, logging',
    tags: ['best-practices', 'fault-tolerance'],
  },

  instruction: {
    type: ComponentType.Instruction,
    instruction: {
      purpose: 'Implement robust error handling',
      constraints: [
        'MUST NOT swallow errors silently',
        'MUST log errors with context',
        'SHOULD use typed error classes',
      ],
    },
  },
};
```

### A.2: Multi-Component Module

```typescript
// test-driven-development.module.ts
import { Module, ComponentType, CognitiveLevel } from './types/index.js';

export const tddModule: Module = {
  id: 'test-driven-development',
  version: '2.0.0',
  schemaVersion: '2.1',
  capabilities: ['testing', 'quality-assurance'],
  cognitiveLevel: CognitiveLevel.UNIVERSAL_PATTERNS,
  domain: 'language-agnostic',

  metadata: {
    name: 'Test-Driven Development',
    description: 'Apply TDD methodology for higher quality code',
    semantic:
      'TDD, test-driven-development, red-green-refactor, unit testing, test-first development, quality assurance, regression prevention',
    tags: ['tdd', 'red-green-refactor', 'test-first'],
  },

  components: [
    {
      type: ComponentType.Instruction,
      instruction: {
        purpose: 'Apply TDD methodology rigorously',
        process: [
          'Write a failing test that defines desired behavior',
          'Write minimal code to make the test pass',
          'Refactor code while keeping tests green',
        ],
        principles: [
          'Test first, code second',
          'Write only enough code to pass the test',
          'Refactor mercilessly',
        ],
      },
    },
    {
      type: ComponentType.Knowledge,
      knowledge: {
        explanation: `
          TDD is a development process where tests drive the design and implementation of code through short, iterative cycles.`,
        concepts: [
          {
            name: 'Red-Green-Refactor',
            description: 'The core TDD cycle',
            rationale:
              'Ensures tests fail first (red), pass with minimal code (green), then improve design (refactor)',
            examples: [
              'Red: Write test, see it fail',
              'Green: Write minimal code to pass',
              'Refactor: Improve design without changing behavior',
            ],
          },
        ],
      },
    },
  ],
};
```

### A.3: Complete REST API Module

```typescript
// rest-api-design.module.ts
import { Module, ComponentType, CognitiveLevel } from './types/index.js';

export const apiDesign: Module = {
  id: 'rest-api-design',
  version: '1.0.0',
  schemaVersion: '2.1',
  capabilities: ['api-design', 'rest-api'],
  cognitiveLevel: CognitiveLevel.DOMAIN_SPECIFIC_GUIDANCE,
  domain: 'language-agnostic',

  metadata: {
    name: 'REST API Design Best Practices',
    description:
      'Design clean, intuitive REST APIs following industry standards',
    semantic: `
      REST API design, RESTful architecture, HTTP methods, resource naming,
      API versioning, status codes, error handling, HATEOAS, Richardson
      Maturity Model, API documentation, OpenAPI, Swagger
    `,
    tags: ['rest', 'restful', 'resource-based', 'http-methods'],

    license: 'MIT',
  },

  components: [
    {
      type: ComponentType.Instruction,
      instruction: {
        purpose:
          'Design RESTful APIs that are intuitive, consistent, and follow industry standards',

        process: [
          {
            step: 'Identify resources (nouns, not verbs)',
            notes: [
              'Resources should be things, not actions. Use plural nouns.',
              'Endpoint URLs contain nouns only (e.g., /users, not /getUsers)',
            ],
          },
          'Map HTTP methods to CRUD operations',
          'Design URL hierarchy reflecting relationships',
          'Choose appropriate status codes',
          'Version your API from day one',
        ],

        constraints: [
          {
            rule: 'URLs MUST use plural nouns for collections',
            notes: [
              'Good: /users, /users/123, /users/123/orders',
              'Bad: /user, /getUser, /createUser',
            ],
          },
          'URLs MUST NOT contain verbs',
        ],

        criteria: [
          'Are all endpoints resource-based (nouns)?',
          'Do responses use correct HTTP status codes?',
          'Is the API versioned?',
        ],
      },
    },

    {
      type: ComponentType.Knowledge,
      knowledge: {
        explanation: `
          REST (Representational State Transfer) is an architectural style
          for designing networked applications. RESTful APIs use HTTP methods
          explicitly and leverage standard status codes, making them intuitive
          and easy to understand.
        `,

        concepts: [
          {
            name: 'Resource-Based URLs',
            description: 'URLs represent resources (things), not actions',
            rationale:
              'Resources are stable; operations change. Resource-based design is more maintainable.',
            examples: [
              'GET /users/123 (resource: user)',
              'GET /getUser?id=123 (action: get)',
              'POST /orders (create order)',
              'POST /createOrder (redundant verb)',
            ],
          },
        ],

        examples: [
          {
            title: 'Complete User API',
            language: 'typescript',
            rationale:
              'Shows a well-designed REST API with proper status codes',
            snippet: `
app.get('/v1/users', async (req, res) => {
  const users = await db.users.findAll();
  res.status(200).json({ users });
});

app.post('/v1/users', async (req, res) => {
  try {
    const user = await db.users.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});
            `,
          },
        ],
      },
    },

    {
      type: ComponentType.Data,
      data: {
        format: 'json',
        description: 'HTTP Status Code Quick Reference',
        value: {
          success: {
            200: 'OK - Request succeeded',
            201: 'Created - Resource created',
            204: 'No Content - Success, no body',
          },
          client_errors: {
            400: 'Bad Request - Validation error',
            401: 'Unauthorized - Authentication required',
            403: 'Forbidden - Not authorized',
            404: "Not Found - Resource doesn't exist",
          },
          server_errors: {
            500: 'Internal Server Error - Server error',
            502: 'Bad Gateway - Upstream error',
            503: 'Service Unavailable - Temporary unavailability',
          },
        },
      },
    },
  ],
};
```

## Appendix B: TypeScript Type Definitions Reference

Complete TypeScript type definitions are maintained in the implementation repository at `src/types/` and serve as normative references for v2.1 structure.

**Key Types**:

- `Module`: Root module interface
- `InstructionComponent`, `KnowledgeComponent`, `DataComponent`: Component types
- `ProcessStep`, `Constraint`, `Criterion`: Instruction directive types
- `Concept`, `Example`, `Pattern`: Knowledge directive types
- `ModuleMetadata`: Metadata types
- `Persona`, `ModuleGroup`: Persona types

See `docs/typescript-minimal-implementation-roadmap.md` for implementation details.

---

**Specification Version**: 2.1.0
**Status**: Draft
**Last Updated**: 2025-01-15
**Changes from v2.0**: Simplified ProcessStep interface (see ADR 0005)
```````
