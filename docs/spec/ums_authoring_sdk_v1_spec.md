# Specification: UMS Authoring SDK v1.0

**Status**: Draft
**Version**: 1.0.0
**Last Updated**: 2025-10-16

---

## 1. Overview

The **UMS Authoring SDK** extends the UMS SDK v1.0 with tools for authoring, validating, and managing UMS v2.0 modules and personas. It provides guardrails, workflow support, and collaboration features to help developers create high-quality, maintainable modules.

### 1.1 Goals

1. **Guardrails**: Type-safe module and persona definitions with validation
2. **Workflow Support**: Common to advanced authoring workflows
3. **Collaboration**: Tools for managing module dependencies and persona composition
4. **Encapsulation**: Clear module boundaries for independent evolution
5. **Quality**: Built-in best practices and validation

### 1.2 Non-Goals

- Replace the core UMS SDK (this extends it)
- Provide a visual editor (CLI/programmatic only)
- Support UMS v1.0 (v2.0 only)

---

## 2. Architecture

### 2.1 Relationship to Existing SDK

```
┌─────────────────────────────────────────┐
│        UMS Authoring SDK (NEW)          │
│  • Module/Persona factories             │
│  • Validation guardrails                │
│  • Authoring workflows                  │
│  • Dependency management                │
│  • Collaboration tools                  │
└────────────────┬────────────────────────┘
                 │
                 │ extends
                 ▼
┌─────────────────────────────────────────┐
│           UMS SDK v1.0                  │
│  • File I/O operations                  │
│  • Module loading                       │
│  • Build orchestration                  │
└────────────────┬────────────────────────┘
                 │
                 │ uses
                 ▼
┌─────────────────────────────────────────┐
│           UMS Library                   │
│  • Domain logic                         │
│  • Validation                           │
│  • Rendering                            │
└─────────────────────────────────────────┘
```

### 2.2 Package Structure

```
packages/ums-authoring-sdk/
├── src/
│   ├── factories/           # Module/Persona factories
│   ├── validators/          # Authoring-time validation
│   ├── workflows/           # Common workflows
│   ├── collaboration/       # Dependency & composition tools
│   ├── boundaries/          # Module encapsulation
│   ├── templates/           # Module templates
│   └── index.ts
```

---

## 3. Core Features

### 3.1 Guardrails - Type-Safe Factories

Provide type-safe factories for creating modules and personas with compile-time validation.

#### Module Factories

```typescript
import { createModule } from "ums-authoring-sdk";

// Factory with intelligent defaults and validation
export const errorHandling = createModule({
  id: "error-handling",
  capabilities: ["error-handling", "debugging"],

  metadata: {
    name: "Error Handling",
    description: "Best practices for error handling",
    // semantic auto-generated from name + description + capabilities
  },

  instruction: {
    purpose: "Guide error handling implementation",
    process: [
      "Identify error boundaries",
      "Implement error handlers",
      "Log errors appropriately",
    ],
  },
});

// Result: Fully valid Module with:
// - Auto-generated schemaVersion: '2.0'
// - Auto-generated version: '1.0.0' (or from config)
// - Optimized semantic metadata
// - Export name validation
```

#### Component-Specific Factories

```typescript
import {
  createInstructionModule,
  createKnowledgeModule,
  createDataModule
} from 'ums-authoring-sdk';

// Type-safe: only instruction fields allowed
export const bestPractices = createInstructionModule({
  id: 'best-practices',
  capabilities: ['best-practices'],
  name: 'Best Practices',

  // TypeScript enforces instruction component structure
  purpose: 'Guide best practices',
  process: [...],
  constraints: [...],
  principles: [...],
});

// Type-safe: only knowledge fields allowed
export const concepts = createKnowledgeModule({
  id: 'concepts',
  capabilities: ['concepts'],
  name: 'Core Concepts',

  // TypeScript enforces knowledge component structure
  explanation: 'Overview of concepts',
  concepts: [...],
  examples: [...],
});

// Type-safe: only data fields allowed
export const examples = createDataModule({
  id: 'examples',
  capabilities: ['examples'],
  name: 'Code Examples',

  // TypeScript enforces data component structure
  format: 'code-examples',
  value: [...],
});
```

#### Persona Factories

```typescript
import { createPersona, withModules } from "ums-authoring-sdk";

// Simple persona
export const developer = createPersona({
  name: "Software Developer",
  description: "Full-stack development persona",
  modules: [
    "foundation/reasoning/systems-thinking",
    "principle/architecture/separation-of-concerns",
    "technology/typescript/best-practices",
  ],
});

// Grouped persona with validation
export const architect = createPersona({
  name: "Systems Architect",
  description: "Enterprise architecture persona",
  modules: withModules([
    {
      group: "Foundation",
      ids: [
        "foundation/reasoning/systems-thinking",
        "foundation/reasoning/first-principles",
      ],
    },
    {
      group: "Architecture",
      ids: [
        "principle/architecture/separation-of-concerns",
        "principle/architecture/modularity",
      ],
    },
  ]),
});
```

---

### 3.2 Workflows - Ranked by Usability

#### Tier 1: Essential Workflows (Most Common)

**1. Create a New Module**

```typescript
import { workflows } from "ums-authoring-sdk";

// Interactive CLI workflow
await workflows.createModule({
  interactive: true, // Ask questions
  tier: "technology", // Or prompt user
  outputPath: "./modules",
});

// Programmatic workflow
const module = await workflows.createModule({
  id: "error-handling",
  tier: "technology",
  type: "instruction",
  metadata: {
    name: "Error Handling",
    description: "Best practices...",
  },
  outputPath: "./modules/technology/error-handling.module.ts",
});
```

**2. Create a New Persona**

```typescript
import { workflows } from "ums-authoring-sdk";

// Interactive persona creation
await workflows.createPersona({
  interactive: true,
  suggestModules: true, // AI-powered suggestions based on description
});

// Programmatic persona creation
const persona = await workflows.createPersona({
  name: "Backend Developer",
  description: "API and database development",
  modules: [
    "foundation/reasoning/systems-thinking",
    "technology/typescript/best-practices",
    "technology/databases/sql",
  ],
  outputPath: "./personas/backend-developer.persona.ts",
});
```

**3. Validate Modules/Personas**

```typescript
import { workflows } from "ums-authoring-sdk";

// Validate with detailed feedback
const result = await workflows.validate({
  paths: ["./modules", "./personas"],
  fix: true, // Auto-fix common issues
  report: "detailed",
});

if (!result.valid) {
  console.error("Validation errors:", result.errors);
  console.log("Suggestions:", result.suggestions);
}
```

#### Tier 2: Common Workflows

**4. Add Module to Persona**

```typescript
import { workflows } from "ums-authoring-sdk";

// Add modules to existing persona
await workflows.addModulesToPersona({
  personaPath: "./personas/developer.persona.ts",
  modules: ["technology/testing/unit-testing"],
  group: "Testing", // Optional grouping
  validate: true, // Ensure no conflicts
});
```

**5. Clone and Customize Module**

```typescript
import { workflows } from "ums-authoring-sdk";

// Clone existing module as starting point
await workflows.cloneModule({
  sourceId: "error-handling",
  newId: "advanced-error-handling",
  customize: {
    metadata: { name: "Advanced Error Handling" },
    instruction: {
      /* modifications */
    },
  },
  outputPath: "./modules/advanced-error-handling.module.ts",
});
```

**6. Preview Persona Build**

```typescript
import { workflows } from "ums-authoring-sdk";

// Preview what persona will look like
const preview = await workflows.previewPersona({
  personaPath: "./personas/developer.persona.ts",
  format: "markdown", // or 'json', 'summary'
});

console.log(preview.markdown);
console.log(`Total modules: ${preview.moduleCount}`);
console.log(`Missing modules: ${preview.missingModules}`);
```

#### Tier 3: Advanced Workflows

**7. Analyze Module Dependencies**

```typescript
import { workflows } from "ums-authoring-sdk";

// Analyze module relationships
const analysis = await workflows.analyzeDependencies({
  moduleId: "advanced-error-handling",
  depth: "full", // or 'direct', 'transitive'
});

console.log("Dependencies:", analysis.dependencies);
console.log("Dependents:", analysis.dependents);
console.log("Conflicts:", analysis.conflicts);
console.log("Suggestions:", analysis.suggestions);
```

**8. Refactor Module Boundaries**

```typescript
import { workflows } from "ums-authoring-sdk";

// Split module into multiple modules
await workflows.splitModule({
  sourceId: "large-module",
  split: [
    { newId: "module-part-1", components: ["instruction"] },
    { newId: "module-part-2", components: ["knowledge"] },
  ],
  updateDependents: true, // Update personas that use this
});

// Merge modules
await workflows.mergeModules({
  sourceIds: ["module-a", "module-b"],
  targetId: "combined-module",
  strategy: "combine", // or 'replace', 'extend'
  updateDependents: true,
});
```

**9. Version Module**

```typescript
import { workflows } from "ums-authoring-sdk";

// Create new version of module
await workflows.versionModule({
  moduleId: "error-handling",
  newVersion: "2.0.0",
  changes: "Breaking changes to instruction format",
  updateDependents: "prompt", // or 'auto', 'manual'
});
```

**10. Generate Module from Template**

```typescript
import { workflows, templates } from "ums-authoring-sdk";

// Use pre-built templates
const module = await workflows.fromTemplate({
  template: templates.instruction.bestPractices,
  config: {
    id: "api-design-best-practices",
    domain: "api-design",
    practices: [{ title: "...", rationale: "...", example: "..." }],
  },
  outputPath: "./modules/api-design-best-practices.module.ts",
});
```

---

### 3.3 Module Boundaries & Encapsulation

Ensure modules can evolve independently without breaking dependents.

#### Boundary Definition

```typescript
import { boundaries } from "ums-authoring-sdk";

// Define what a module exposes vs. what's internal
const moduleBoundary = boundaries.define({
  moduleId: "error-handling",

  // Public interface (what other modules/personas can depend on)
  public: {
    capabilities: ["error-handling", "debugging"],
    exports: ["instruction"], // Which components are public
    stability: "stable", // 'stable', 'experimental', 'deprecated'
  },

  // Private implementation (can change without breaking)
  private: {
    implementation: ["knowledge"], // Internal-only components
    dependencies: ["foundation/reasoning/logic"],
  },

  // Version compatibility
  compatibility: {
    breaking: ["2.0.0"], // Versions with breaking changes
    deprecated: ["1.0.0"], // Deprecated versions
  },
});
```

#### Dependency Validation

```typescript
import { boundaries } from "ums-authoring-sdk";

// Validate that dependencies respect boundaries
const validation = await boundaries.validateDependencies({
  moduleId: "advanced-error-handling",
  dependencies: ["error-handling"],
});

if (!validation.valid) {
  console.error("Boundary violations:", validation.violations);
  // Example: "Depends on private component 'knowledge' of 'error-handling'"
}
```

#### Change Impact Analysis

```typescript
import { boundaries } from "ums-authoring-sdk";

// Analyze impact of changing a module
const impact = await boundaries.analyzeImpact({
  moduleId: "error-handling",
  changes: {
    type: "breaking", // or 'compatible', 'internal'
    description: "Changed instruction structure",
  },
});

console.log("Affected personas:", impact.affectedPersonas);
console.log("Affected modules:", impact.affectedModules);
console.log("Required updates:", impact.requiredUpdates);
console.log("Recommended actions:", impact.recommendations);
```

#### Semantic Versioning Support

```typescript
import { boundaries } from "ums-authoring-sdk";

// Determine version bump based on changes
const versionBump = boundaries.determineVersionBump({
  moduleId: "error-handling",
  currentVersion: "1.2.3",
  changes: [
    { type: "breaking", description: "Changed field names" },
    { type: "feature", description: "Added new constraint" },
    { type: "fix", description: "Fixed typo" },
  ],
});

console.log(`Recommended version: ${versionBump.suggestedVersion}`); // 2.0.0
console.log(`Reason: ${versionBump.reason}`);
```

---

### 3.4 Collaboration Features

Facilitate collaboration between modules and personas.

#### Module Composition Analysis

```typescript
import { collaboration } from "ums-authoring-sdk";

// Analyze how modules work together in a persona
const composition = await collaboration.analyzeComposition({
  personaPath: "./personas/developer.persona.ts",
});

console.log("Module coverage:", composition.coverage);
console.log("Redundancies:", composition.redundancies);
console.log("Gaps:", composition.gaps);
console.log("Conflicts:", composition.conflicts);
console.log("Suggestions:", composition.suggestions);

// Example output:
// {
//   coverage: {
//     foundation: 80%,
//     principle: 60%,
//     technology: 90%,
//     execution: 40%,
//   },
//   redundancies: [
//     'error-handling and advanced-error-handling overlap 70%'
//   ],
//   gaps: [
//     'Missing testing modules for complete coverage'
//   ],
//   suggestions: [
//     'Add technology/testing/unit-testing',
//     'Consider removing error-handling if using advanced-error-handling'
//   ]
// }
```

#### Dependency Graph

```typescript
import { collaboration } from "ums-authoring-sdk";

// Generate visual dependency graph
const graph = await collaboration.generateDependencyGraph({
  scope: "all", // or specific tier, persona
  format: "mermaid", // or 'dot', 'json'
  includePersonas: true,
});

console.log(graph.diagram);
// Output: Mermaid diagram showing module relationships

await graph.saveTo("./docs/module-dependencies.md");
```

#### Module Recommendations

```typescript
import { collaboration } from "ums-authoring-sdk";

// Get module recommendations for a persona
const recommendations = await collaboration.recommendModules({
  personaPath: "./personas/developer.persona.ts",
  criteria: {
    fillGaps: true, // Recommend modules for missing areas
    removeRedundancy: true, // Suggest removing overlapping modules
    upgradePath: true, // Suggest newer versions
  },
});

console.log("Recommended additions:", recommendations.additions);
console.log("Recommended removals:", recommendations.removals);
console.log("Recommended upgrades:", recommendations.upgrades);
```

#### Conflict Resolution

```typescript
import { collaboration } from "ums-authoring-sdk";

// Detect and resolve conflicts between modules
const conflicts = await collaboration.detectConflicts({
  modules: ["module-a", "module-b", "module-c"],
  personaContext: "./personas/developer.persona.ts",
});

if (conflicts.found) {
  console.log("Conflicts:", conflicts.details);

  // Get resolution suggestions
  const resolution = await collaboration.suggestResolution({
    conflicts: conflicts.details,
    strategy: "prioritize-latest", // or 'prioritize-stable', 'manual'
  });

  console.log("Suggested resolution:", resolution);
}
```

#### Persona Composition Helpers

```typescript
import { collaboration } from "ums-authoring-sdk";

// Build persona incrementally with validation
const composer = collaboration.createComposer({
  name: "Full-Stack Developer",
  description: "Complete full-stack development",
});

// Add modules with automatic validation
await composer.addModule("foundation/reasoning/systems-thinking");
await composer.addModule("technology/typescript/best-practices");

// Get composition insights at any point
const insights = composer.getInsights();
console.log("Current coverage:", insights.coverage);
console.log("Recommended next modules:", insights.recommendations);

// Finalize and save
const persona = await composer.finalize({
  outputPath: "./personas/fullstack-developer.persona.ts",
});
```

---

## 4. API Reference

### 4.1 Factories

```typescript
// Module factories
export function createModule(config: ModuleConfig): Module;
export function createInstructionModule(config: InstructionConfig): Module;
export function createKnowledgeModule(config: KnowledgeConfig): Module;
export function createDataModule(config: DataConfig): Module;

// Persona factories
export function createPersona(config: PersonaConfig): Persona;
export function withModules(groups: ModuleGroup[]): ModuleEntry[];
```

### 4.2 Workflows

```typescript
// Tier 1: Essential
export const workflows = {
  createModule(options: CreateModuleOptions): Promise<Module>;
  createPersona(options: CreatePersonaOptions): Promise<Persona>;
  validate(options: ValidateOptions): Promise<ValidationResult>;

  // Tier 2: Common
  addModulesToPersona(options: AddModulesOptions): Promise<void>;
  cloneModule(options: CloneModuleOptions): Promise<Module>;
  previewPersona(options: PreviewOptions): Promise<PreviewResult>;

  // Tier 3: Advanced
  analyzeDependencies(options: AnalyzeOptions): Promise<DependencyAnalysis>;
  splitModule(options: SplitOptions): Promise<void>;
  mergeModules(options: MergeOptions): Promise<Module>;
  versionModule(options: VersionOptions): Promise<void>;
  fromTemplate(options: TemplateOptions): Promise<Module>;
};
```

### 4.3 Boundaries

```typescript
export const boundaries = {
  define(config: BoundaryConfig): ModuleBoundary;
  validateDependencies(options: ValidateDepOptions): Promise<ValidationResult>;
  analyzeImpact(options: ImpactOptions): Promise<ImpactAnalysis>;
  determineVersionBump(options: VersionBumpOptions): VersionRecommendation;
};
```

### 4.4 Collaboration

```typescript
export const collaboration = {
  analyzeComposition(options: ComposeOptions): Promise<CompositionAnalysis>;
  generateDependencyGraph(options: GraphOptions): Promise<DependencyGraph>;
  recommendModules(options: RecommendOptions): Promise<ModuleRecommendations>;
  detectConflicts(options: ConflictOptions): Promise<ConflictReport>;
  suggestResolution(options: ResolveOptions): Promise<ResolutionPlan>;
  createComposer(config: ComposerConfig): PersonaComposer;
};
```

### 4.5 Templates

```typescript
export const templates = {
  instruction: {
    bestPractices: Template<BestPracticesConfig>;
    process: Template<ProcessConfig>;
    guidelines: Template<GuidelinesConfig>;
  },
  knowledge: {
    concept: Template<ConceptConfig>;
    reference: Template<ReferenceConfig>;
  },
  data: {
    examples: Template<ExamplesConfig>;
    constants: Template<ConstantsConfig>;
  },
};
```

---

## 5. Usage Examples

### 5.1 Complete Authoring Workflow

```typescript
import {
  workflows,
  createInstructionModule,
  createPersona,
  collaboration,
} from "ums-authoring-sdk";

// 1. Create a new module with guardrails
const errorHandling = createInstructionModule({
  id: "error-handling",
  capabilities: ["error-handling", "debugging"],
  name: "Error Handling",
  description: "Best practices for error handling",
  purpose: "Guide error handling implementation",
  process: ["Identify error boundaries", "Implement error handlers"],
});

// 2. Validate before saving
const validation = await workflows.validate({
  modules: [errorHandling],
  strict: true,
});

if (validation.valid) {
  // 3. Save to file system
  await workflows.saveModule({
    module: errorHandling,
    outputPath: "./modules/error-handling.module.ts",
  });
}

// 4. Create persona using the module
const developer = createPersona({
  name: "Backend Developer",
  description: "API development specialist",
  modules: ["error-handling", "technology/typescript/best-practices"],
});

// 5. Analyze composition
const analysis = await collaboration.analyzeComposition({
  persona: developer,
});

console.log("Coverage:", analysis.coverage);
console.log("Suggestions:", analysis.suggestions);
```

### 5.2 Module Boundary Management

```typescript
import { boundaries } from "ums-authoring-sdk";

// Define module boundary
const boundary = boundaries.define({
  moduleId: "error-handling",
  public: {
    capabilities: ["error-handling"],
    exports: ["instruction"],
    stability: "stable",
  },
  private: {
    implementation: ["knowledge"],
    dependencies: ["foundation/reasoning/logic"],
  },
});

// Before making changes, analyze impact
const impact = await boundaries.analyzeImpact({
  moduleId: "error-handling",
  changes: {
    type: "breaking",
    description: "Restructured instruction format",
  },
});

console.log("Affected personas:", impact.affectedPersonas);
console.log("Migration required:", impact.requiredUpdates);

// Determine new version
const versionBump = boundaries.determineVersionBump({
  moduleId: "error-handling",
  currentVersion: "1.0.0",
  changes: [{ type: "breaking", description: "Changed structure" }],
});

console.log("New version:", versionBump.suggestedVersion); // 2.0.0
```

### 5.3 Collaborative Persona Development

```typescript
import { collaboration } from "ums-authoring-sdk";

// Start with a composer
const composer = collaboration.createComposer({
  name: "Full-Stack Developer",
  description: "Complete web development",
});

// Add modules iteratively with feedback
await composer.addModule("foundation/reasoning/systems-thinking");

let insights = composer.getInsights();
console.log("Coverage:", insights.coverage);
console.log("Next recommendations:", insights.recommendations);

// Add recommended modules
for (const rec of insights.recommendations.slice(0, 3)) {
  await composer.addModule(rec.moduleId);
}

// Check for conflicts
const conflicts = await collaboration.detectConflicts({
  modules: composer.getModules(),
});

if (conflicts.found) {
  const resolution = await collaboration.suggestResolution({
    conflicts: conflicts.details,
    strategy: "prioritize-latest",
  });

  console.log("Applying resolution:", resolution);
  await composer.applyResolution(resolution);
}

// Finalize
const persona = await composer.finalize({
  outputPath: "./personas/fullstack-developer.persona.ts",
});

// Generate dependency graph for documentation
const graph = await collaboration.generateDependencyGraph({
  persona: persona,
  format: "mermaid",
});

await graph.saveTo("./docs/fullstack-dependencies.md");
```

---

## 6. Implementation Phases

### Phase 1: Guardrails & Essential Workflows (v0.1.0)

- Module/Persona factories with type safety
- Basic validation workflows
- createModule, createPersona, validate workflows

### Phase 2: Common Workflows (v0.2.0)

- addModulesToPersona, cloneModule, previewPersona
- Templates for common module patterns
- Enhanced validation with auto-fix

### Phase 3: Boundaries & Encapsulation (v0.3.0)

- Module boundary definition
- Dependency validation
- Change impact analysis
- Semantic versioning support

### Phase 4: Collaboration (v0.4.0)

- Composition analysis
- Dependency graphs
- Module recommendations
- Conflict detection and resolution

### Phase 5: Advanced Workflows (v1.0.0)

- splitModule, mergeModules, versionModule
- PersonaComposer for interactive development
- Complete template library
- Production-ready tooling

---

## 7. Success Metrics

- **Type Safety**: 100% of common errors caught at compile time
- **Validation**: 90% of module errors caught before build
- **Productivity**: 50% reduction in time to create modules
- **Quality**: 80% of modules pass validation on first try
- **Collaboration**: Dependency conflicts detected in 95% of cases

---

**Next Steps**:

1. Review and approve specification
2. Create `ums-authoring-sdk` package scaffold
3. Implement Phase 1 features
4. User testing and feedback
5. Iterate based on real usage
