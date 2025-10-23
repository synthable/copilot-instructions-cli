# Specification: The Unified Module System (UMS) v2.0

## 1. Overview & Core Principles

The Unified Module System (UMS) v2.0 is a specification for a data-centric, modular, and composable ecosystem for AI instructions. It treats AI instructions as machine-readable source code, moving beyond the limitations of document-centric prompt files.

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
- The v2.0 build process produces a single Markdown (`.md`) prompt as the final output
- Markdown is a rendering of the typed components; it is not authoring source

## 2. The Module Definition File

All modules MUST be defined as TypeScript files with the `.module.ts` extension. Each module file MUST export a valid module object that conforms to the `Module` interface.

### 2.1. Top-Level Keys

A valid module for v2.0 MUST contain the following top-level keys:

| Key | Type | Required? | Description |
|:----|:-----|:----------|:------------|
| `id` | String | Yes | Unique module identifier |
| `version` | String | Yes | Semantic version (SemVer 2.0.0) |
| `schemaVersion` | String | Yes | Must be `"2.0"` |
| `capabilities` | Array[String] | Yes | What this module provides |
| `metadata` | Object | Yes | Human-readable and AI-discoverable metadata |
| `cognitiveLevel` | Integer | No | Cognitive hierarchy (0-4) for foundation modules |
| `domain` | String/Array | No | Domain applicability |
| `components` | Array[Component] | No* | Component blocks (see 2.2) |
| `instruction` | InstructionComponent | No* | Shorthand for single instruction component |
| `knowledge` | KnowledgeComponent | No* | Shorthand for single knowledge component |
| `data` | DataComponent | No* | Shorthand for single data component |

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

**Recommended Structure**: Module IDs can be flat (e.g., `be-concise`) or hierarchical (e.g., `ethics/do-no-harm`). Use tags in metadata for categorization and discovery rather than relying on ID structure.

#### `version`

- **Type**: `String`
- **Required**: Yes
- **Format**: MUST be a valid Semantic Versioning 2.0.0 string (e.g., `"1.0.0"`, `"2.1.3-beta"`)
- **Purpose**: Enable lifecycle management and deterministic builds
- **v2.0 Behavior**: Reserved for future version resolution (v2.0 implementations MAY ignore this field)

#### `schemaVersion`

- **Type**: `String`
- **Required**: Yes
- **Format**: MUST be `"2.0"` for v2.0 modules
- **Purpose**: Declare which UMS specification version this module conforms to
- **Validation**: Build tools MUST validate this field and reject incompatible versions

#### `capabilities`

- **Type**: `Array<string>`
- **Required**: Yes
- **Purpose**: Declare what functional capabilities this module provides
- **Constraints**:
  - MUST be a non-empty array
  - Each capability SHOULD be lowercase kebab-case
  - Capabilities SHOULD be concrete and searchable (e.g., `"error-handling"`, `"api-design"`)
  - Capabilities enable semantic search and module discovery
- **Examples**:
  - `["testing", "quality"]`
  - `["api-design", "rest", "http"]`
  - `["error-handling", "best-practices"]`

#### `metadata`

- **Type**: `Object`
- **Required**: Yes
- **Purpose**: Provide human-readable and AI-discoverable metadata
- **See**: Section 2.3 for detailed structure

#### `cognitiveLevel`

- **Type**: `Integer` (0-4)
- **Required**: No (but RECOMMENDED for foundation modules)
- **Purpose**: Position in cognitive hierarchy
- **Allowed Values**: `0`, `1`, `2`, `3`, `4`
- **Semantics**:
  - **0**: Bedrock / Axioms - Core principles and ethical guardrails
  - **1**: Core Processes - Fundamental reasoning frameworks
  - **2**: Evaluation & Synthesis - Analysis, judgment, creativity
  - **3**: Action / Decision - Making decisions and formulating plans
  - **4**: Meta-Cognition - Self-awareness and reflection

#### `domain`

- **Type**: `String` or `Array<string>`
- **Required**: No
- **Purpose**: Declare target domain(s) for the module
- **Examples**:
  - `"python"`
  - `"language-agnostic"`
  - `["backend", "api"]`
  - `["frontend", "react", "typescript"]`

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

UMS v2.0 uses a **component-based architecture** where modules are composed of three types of components:

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
    purpose: string;                       // Primary objective
    process?: Array<string | ProcessStep>; // Sequential steps
    constraints?: Constraint[];            // Non-negotiable rules
    principles?: string[];                 // High-level guidelines
    criteria?: Criterion[];                // Success criteria
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
    explanation: string;     // High-level overview
    concepts?: Concept[];    // Core concepts
    examples?: Example[];    // Illustrative examples
    patterns?: Pattern[];    // Design patterns
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
    format: string;          // Media type (json, yaml, xml, etc.)
    description?: string;    // What this data represents
    value: unknown;          // The actual data
  };
}
```

**Fields**:
- `format` (required): Data format/media type (e.g., `"json"`, `"yaml"`, `"xml"`)
- `description` (optional): Human-readable description
- `value` (required): The actual data content

### 2.3. The `metadata` Block

| Key | Type | Required? | Description |
|:----|:-----|:----------|:------------|
| `name` | String | Yes | Human-readable, Title Case name |
| `description` | String | Yes | Concise, single-sentence summary |
| `semantic` | String | Yes | Dense, keyword-rich paragraph for AI search |
| `tags` | Array[String] | No | Lowercase keywords for filtering |
| `solves` | Array[Object] | No | Problem-solution mapping for discovery |
| `relationships` | Object | No | Module dependencies and relationships |
| `quality` | Object | No | Quality indicators (maturity, confidence) |
| `license` | String | No | SPDX license identifier |
| `authors` | Array[String] | No | Primary authors or maintainers |
| `homepage` | String | No | URL to source repository or docs |
| `deprecated` | Boolean | No | Deprecation flag |
| `replacedBy` | String | No | ID of successor module |

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
- **Purpose**: Explicit keywords for faceted search and filtering
- **Constraints**: All tags MUST be lowercase, SHOULD be kebab-case
- **Example**: `["testing", "tdd", "quality", "best-practices"]`

#### `solves`

- **Type**: `Array<{ problem: string; keywords: string[] }>`
- **Required**: No
- **Purpose**: Map user problems to solutions for discovery

```typescript
interface ProblemSolution {
  problem: string;    // User-facing problem statement
  keywords: string[]; // Search keywords
}
```

#### `relationships`

- **Type**: `Object`
- **Required**: No
- **Purpose**: Declare module dependencies and relationships

```typescript
interface ModuleRelationships {
  requires?: string[];       // Required dependencies
  recommends?: string[];     // Recommended companions
  conflictsWith?: string[];  // Conflicting modules
  extends?: string;          // Module this extends
}
```

#### `quality`

- **Type**: `Object`
- **Required**: No
- **Purpose**: Indicate module quality and maturity

```typescript
interface QualityMetadata {
  maturity: "alpha" | "beta" | "stable" | "deprecated";
  confidence: number;        // 0-1 score
  lastVerified?: string;     // ISO 8601 date
  experimental?: boolean;
}
```

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
  purpose?: string;      // Purpose of this component
  context?: string[];    // Where this component is most useful
}
```

**Example**:
```typescript
components: [
  {
    type: ComponentType.Instruction,
    metadata: {
      purpose: "Core TDD workflow",
      context: ["unit-testing", "development"]
    },
    instruction: {
      purpose: "Apply TDD rigorously",
      // ...
    }
  }
]
```

## 3. Directive Types

### 3.1. ProcessStep

```typescript
interface ProcessStep {
  step: string;          // The step description
  detail?: string;       // Detailed explanation
  validate?: {
    check: string;
    severity?: "error" | "warning";
  };
  when?: string;         // Conditional execution
  do?: string;           // Action to perform
}
```

**Example**:
```typescript
process: [
  {
    step: "Identify resources (nouns, not verbs)",
    detail: "Resources should be things, not actions. Use plural nouns.",
    validate: {
      check: "Endpoint URLs contain nouns only",
      severity: "error"
    }
  },
  "Map HTTP methods to CRUD operations"
]
```

### 3.2. Constraint

```typescript
interface Constraint {
  rule: string;          // The rule description
  severity?: "error" | "warning" | "info";
  when?: string;         // Conditional application
  examples?: {
    valid?: string[];
    invalid?: string[];
  };
}
```

**Example**:
```typescript
constraints: [
  {
    rule: "URLs MUST use plural nouns for collections",
    severity: "error",
    examples: {
      valid: ["/users", "/users/123"],
      invalid: ["/user", "/getUser"]
    }
  }
]
```

### 3.3. Criterion

```typescript
interface Criterion {
  item: string;          // The verification item
  category?: string;     // Category grouping
  severity?: "critical" | "important" | "nice-to-have";
}
```

**Example**:
```typescript
criteria: [
  {
    item: "Are all endpoints resource-based (nouns)?",
    severity: "critical"
  },
  {
    item: "Is the API versioned?",
    severity: "important"
  }
]
```

### 3.4. Concept

```typescript
interface Concept {
  name: string;          // Concept name
  description: string;   // Detailed explanation
  rationale?: string;    // Why this matters
  examples?: string[];   // Examples
  tradeoffs?: string[];  // Pros and cons
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
      " GET /users/123 (resource: user)",
      " GET /getUser?id=123 (action: get)"
    ]
  }
]
```

### 3.5. Example

```typescript
interface Example {
  title: string;         // Example title
  rationale: string;     // What this demonstrates
  language?: string;     // Programming language
  code?: string;         // Code snippet
}
```

**Example**:
```typescript
examples: [
  {
    title: "Basic Error Handling",
    rationale: "Shows try-catch with proper logging",
    language: "typescript",
    code: `
      try {
        await riskyOperation();
      } catch (error) {
        logger.error('Operation failed', { error, context });
        throw new CustomError('Failed to complete operation', error);
      }
    `
  }
]
```

### 3.6. Pattern

```typescript
interface Pattern {
  name: string;          // Pattern name
  useCase: string;       // When to use this
  description: string;   // How it works
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
    advantages: [
      "Testable in isolation",
      "Centralized data access logic"
    ],
    disadvantages: [
      "Additional abstraction layer"
    ]
  }
]
```

## 4. The Persona Definition File

Personas are TypeScript files (`.persona.ts`) that define AI agent configurations by composing modules.

### 4.1. Required Persona Metadata

```typescript
interface Persona {
  name: string;            // Human-readable persona name
  version: string;         // Semantic version
  schemaVersion: string;   // Must be "2.0"
  description: string;     // Concise summary
  semantic: string;        // Dense, keyword-rich description
  identity?: string;       // Persona prologue (voice, traits, capabilities)
  tags?: string[];         // Keywords for filtering
  domains?: string[];      // Broader categories
  attribution?: boolean;   // Include module attribution in output
  modules: ModuleEntry[];  // Composition block
}
```

### 4.2. Composition Block (`modules`)

```typescript
type ModuleEntry = string | ModuleGroup;

interface ModuleGroup {
  group: string;        // Group name (Title Case, descriptive)
  ids: string[];        // Module IDs in this group
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
      "principle/architecture/separation-of-concerns"
    ]
  },
  "error-handling"
]
```

## 5. Module Resolution

Implementations construct an in-memory Module Registry for resolving module references.

### 5.1. The Module Registry

Implementations construct the Module Registry by:

1. **Loading Standard Library**: Built-in modules are loaded first
2. **Loading Local Modules**: Modules from `modules.config.yml` paths are loaded
3. **Applying Conflict Resolution**: Using strategies defined in config

### 5.1.1. Standard Library

The **Standard Library** is a curated collection of foundation modules that provide core AI instruction patterns, reasoning frameworks, and best practices.

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
    onConflict: "error"      # Fail on collision
  - path: "./project-overrides"
    onConflict: "replace"    # Override existing
  - path: "./experimental"
    onConflict: "warn"       # Warn and keep original
```

### 5.3. Conflict Resolution Strategies

- **`error`** (default): Build fails on ID collision
- **`replace`**: New module replaces existing
- **`warn`**: Keep existing, emit warning

### 5.4. Resolution Order

1. Initialize with Standard Library
2. Process `localModulePaths` in order
3. Resolve persona modules from final registry

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

```markdown
## Knowledge

{explanation}

### Key Concepts

**{concept name}**: {description}
*Why*: {rationale}

### Examples

#### {example title}
{rationale}

```{language}
{code}
```
```

#### Data Component

```markdown
## Data

{description}

```{format}
{value}
```
```

#### Attribution

If `attribution: true` is set in persona, append after each module:

```markdown
[Attribution: {module-id}]
```

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
  personaName: string;          // Persona name
  schemaVersion: string;        // Report schema version (e.g., "2.0")
  toolVersion: string;          // Implementation version
  personaDigest: string;        // SHA-256 of persona file
  buildTimestamp: string;       // ISO 8601 UTC timestamp
  moduleGroups: ModuleGroup[];  // Ordered module groups
}

interface ModuleGroupReport {
  groupName: string;            // Group name
  modules: ResolvedModule[];    // Ordered modules in group
}

interface ResolvedModule {
  id: string;                   // Module ID
  version: string;              // Module version
  source: string;               // Source label (e.g., "Standard Library")
  digest: string;               // SHA-256 of module file
  composedFrom?: CompositionEvent[];  // If replaced/merged
}

interface CompositionEvent {
  id: string;                   // Module ID
  version: string;              // Version
  source: string;               // Source label
  digest: string;               // Content digest
  strategy: "base" | "replace"; // Composition strategy
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
import { Module, ComponentType } from './types/index.js';

export const errorHandling: Module = {
  id: "error-handling",
  version: "1.0.0",
  schemaVersion: "2.0",
  capabilities: ["error-handling", "best-practices"],

  metadata: {
    name: "Error Handling Best Practices",
    description: "Handle errors gracefully with proper patterns",
    semantic: "Error handling, exception management, fault tolerance, resilience, try-catch, error propagation, logging"
  },

  instruction: {
    type: ComponentType.Instruction,
    instruction: {
      purpose: "Implement robust error handling",
      constraints: [
        {
          rule: "Never swallow errors silently",
          severity: "error"
        },
        {
          rule: "Log errors with context",
          severity: "error"
        },
        {
          rule: "Use typed error classes",
          severity: "warning"
        }
      ]
    }
  }
};
```

### A.2: Multi-Component Module

```typescript
// test-driven-development.module.ts
import { Module, ComponentType } from './types/index.js';

export const tddModule: Module = {
  id: "test-driven-development",
  version: "2.0.0",
  schemaVersion: "2.0",
  capabilities: ["testing", "quality", "tdd"],
  domain: "language-agnostic",

  metadata: {
    name: "Test-Driven Development",
    description: "Apply TDD methodology for higher quality code",
    semantic: "TDD, test-driven development, red-green-refactor, unit testing, test-first development, quality assurance, regression prevention",
    tags: ["testing", "tdd", "quality"],
    quality: {
      maturity: "stable",
      confidence: 0.9
    }
  },

  components: [
    {
      type: ComponentType.Instruction,
      instruction: {
        purpose: "Apply TDD methodology rigorously",
        process: [
          "Write a failing test that defines desired behavior",
          "Write minimal code to make the test pass",
          "Refactor code while keeping tests green"
        ],
        principles: [
          "Test first, code second",
          "Write only enough code to pass the test",
          "Refactor mercilessly"
        ]
      }
    },
    {
      type: ComponentType.Knowledge,
      knowledge: {
        explanation: "TDD is a development process where tests drive the design and implementation of code through short, iterative cycles.",
        concepts: [
          {
            name: "Red-Green-Refactor",
            description: "The core TDD cycle",
            rationale: "Ensures tests fail first (red), pass with minimal code (green), then improve design (refactor)",
            examples: [
              "Red: Write test, see it fail",
              "Green: Write minimal code to pass",
              "Refactor: Improve design without changing behavior"
            ]
          }
        ]
      }
    }
  ]
};
```

### A.3: Complete REST API Module

```typescript
// rest-api-design.module.ts
import { Module, ComponentType } from './types/index.js';

export const apiDesign: Module = {
  id: "rest-api-design",
  version: "1.0.0",
  schemaVersion: "2.0",
  capabilities: ["api-design", "rest", "http"],
  cognitiveLevel: 2,
  domain: "language-agnostic",

  metadata: {
    name: "REST API Design Best Practices",
    description: "Design clean, intuitive REST APIs following industry standards",
    semantic: `
      REST API design, RESTful architecture, HTTP methods, resource naming,
      API versioning, status codes, error handling, HATEOAS, Richardson
      Maturity Model, API documentation, OpenAPI, Swagger
    `,
    tags: ["api", "rest", "http", "web-services"],

    solves: [
      {
        problem: "How should I structure my API endpoints?",
        keywords: ["endpoint", "url", "resource", "naming"]
      },
      {
        problem: "What HTTP methods should I use?",
        keywords: ["GET", "POST", "PUT", "DELETE", "PATCH"]
      }
    ],

    relationships: {
      recommends: ["error-handling", "api-documentation"]
    },

    quality: {
      maturity: "stable",
      confidence: 0.95,
      lastVerified: "2025-01-15"
    },

    license: "MIT"
  },

  components: [
    {
      type: ComponentType.Instruction,
      instruction: {
        purpose: "Design RESTful APIs that are intuitive, consistent, and follow industry standards",

        process: [
          {
            step: "Identify resources (nouns, not verbs)",
            detail: "Resources should be things, not actions. Use plural nouns.",
            validate: {
              check: "Endpoint URLs contain nouns only (e.g., /users, not /getUsers)",
              severity: "error"
            }
          },
          "Map HTTP methods to CRUD operations",
          "Design URL hierarchy reflecting relationships",
          "Choose appropriate status codes",
          "Version your API from day one"
        ],

        constraints: [
          {
            rule: "URLs MUST use plural nouns for collections",
            severity: "error",
            examples: {
              valid: ["/users", "/users/123", "/users/123/orders"],
              invalid: ["/user", "/getUser", "/createUser"]
            }
          },
          {
            rule: "URLs MUST NOT contain verbs",
            severity: "error"
          }
        ],

        criteria: [
          { item: "Are all endpoints resource-based (nouns)?", severity: "critical" },
          { item: "Do responses use correct HTTP status codes?", severity: "critical" },
          { item: "Is the API versioned?", severity: "important" }
        ]
      }
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
            name: "Resource-Based URLs",
            description: "URLs represent resources (things), not actions",
            rationale: "Resources are stable; operations change. Resource-based design is more maintainable.",
            examples: [
              " GET /users/123 (resource: user)",
              " GET /getUser?id=123 (action: get)",
              " POST /orders (create order)",
              " POST /createOrder (redundant verb)"
            ]
          }
        ],

        examples: [
          {
            title: "Complete User API",
            language: "typescript",
            rationale: "Shows a well-designed REST API with proper status codes",
            code: `
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
            `
          }
        ]
      }
    },

    {
      type: ComponentType.Data,
      data: {
        format: "json",
        description: "HTTP Status Code Quick Reference",
        value: {
          success: {
            200: "OK - Request succeeded",
            201: "Created - Resource created",
            204: "No Content - Success, no body"
          },
          client_errors: {
            400: "Bad Request - Validation error",
            401: "Unauthorized - Authentication required",
            403: "Forbidden - Not authorized",
            404: "Not Found - Resource doesn't exist"
          },
          server_errors: {
            500: "Internal Server Error - Server error",
            502: "Bad Gateway - Upstream error",
            503: "Service Unavailable - Temporary unavailability"
          }
        }
      }
    }
  ]
};
```

## Appendix B: TypeScript Type Definitions Reference

Complete TypeScript type definitions are maintained in the implementation repository at `src/types/` and serve as normative references for v2.0 structure.

**Key Types**:
- `Module`: Root module interface
- `InstructionComponent`, `KnowledgeComponent`, `DataComponent`: Component types
- `ProcessStep`, `Constraint`, `Criterion`: Instruction directive types
- `Concept`, `Example`, `Pattern`: Knowledge directive types
- `ModuleMetadata`, `QualityMetadata`, `ModuleRelationships`: Metadata types
- `Persona`, `ModuleGroup`: Persona types

See `docs/typescript-minimal-implementation-roadmap.md` for implementation details.

---

**Specification Version**: 2.0.0
**Status**: Draft
**Last Updated**: 2025-10-11
