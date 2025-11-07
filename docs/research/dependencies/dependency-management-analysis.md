# Module Dependency Management: A Comprehensive Analysis

## Executive Summary

This document analyzes seven different approaches to managing dependencies between modules in the Unified Module System (UMS) v2.0+. Each approach presents different tradeoffs between coupling, maintainability, type safety, and implementation complexity. The analysis evaluates both theoretical design considerations and practical implementation implications.

## Table of Contents

1. [Current Approach: String IDs in Metadata](#1-current-approach-string-ids-in-metadata)
2. [External Dependency Graph](#2-external-dependency-graph)
3. [Implicit Dependencies via Cognitive Hierarchy](#3-implicit-dependencies-via-cognitive-hierarchy)
4. [Capability-Based Discovery](#4-capability-based-discovery)
5. [Persona-Level Composition Only](#5-persona-level-composition-only)
6. [Import-Based Dependencies](#6-import-based-dependencies)
7. [Build-Time Analysis](#7-build-time-analysis)
8. [Hybrid Approaches](#8-hybrid-approaches)
9. [Recommendations](#9-recommendations)

---

## 1. Current Approach: String IDs in Metadata

### Overview

Modules declare their dependencies directly in their metadata using string identifiers:

```typescript
export const advancedApiSecurity: Module = {
  id: 'technology/security/advanced-api-security',
  metadata: {
    relationships: {
      requires: ['principle/architecture/separation-of-concerns'],
      recommends: ['technology/security/threat-modeling'],
      conflictsWith: ['technology/security/basic-api-security']
    }
  }
};
```

### Advantages

1. **Self-Contained**: Each module carries its own dependency information
2. **Familiar Pattern**: Similar to package.json dependencies in npm
3. **Explicit Declaration**: Dependencies are clearly stated by module authors
4. **Version Control**: Dependencies tracked alongside module content
5. **Build-Time Validation**: Can validate that required modules exist during build

### Disadvantages

1. **Tight Coupling**: Modules directly reference other modules by ID
2. **Refactoring Difficulty**: Renaming a module requires updating all dependents
3. **No Type Safety**: String IDs provide no compile-time verification
4. **Unidirectional**: Can't query "what depends on module X" without scanning all modules
5. **Circular Dependency Risk**: Requires runtime checks to prevent cycles
6. **Silent Failures**: Missing or renamed dependencies may go unnoticed

### Implementation Requirements

```typescript
// Required validation logic
class DependencyValidator {
  validateDependencies(module: Module, registry: ModuleRegistry): ValidationResult {
    const errors: ValidationError[] = [];

    // Check required dependencies exist
    for (const reqId of module.metadata.relationships?.requires || []) {
      if (!registry.getModule(reqId)) {
        errors.push({
          path: `relationships.requires`,
          message: `Required module '${reqId}' not found`
        });
      }
    }

    // Check for circular dependencies
    if (this.hasCircularDependency(module.id, registry)) {
      errors.push({
        path: 'relationships',
        message: 'Circular dependency detected'
      });
    }

    return { valid: errors.length === 0, errors };
  }
}
```

### Real-World Example

```typescript
// Current implementation in UMS
export const tsxExecution: Module = {
  relationships: {
    requires: ['principle/architecture/separation-of-concerns'],
    recommends: [
      'typescript-best-practices',  // Missing namespace - error prone
      'esm-modules',
      'dependency-management'
    ]
  }
};
```

### Cost-Benefit Analysis

| Aspect | Cost | Benefit |
|--------|------|---------|
| **Implementation** | Medium - Requires validation logic | Simple mental model |
| **Maintenance** | High - Manual updates for refactoring | Explicit dependencies |
| **Runtime** | Low - String comparisons | Self-contained modules |
| **Type Safety** | None - No compile-time checks | N/A |
| **Developer Experience** | Poor - No IDE support | Familiar pattern |

---

## 2. External Dependency Graph

### Overview

Dependencies are managed in a separate configuration file, decoupling modules from their relationships:

```typescript
// dependencies.config.ts
export const dependencyGraph: DependencyGraph = {
  'technology/security/api-security': {
    requires: ['principle/architecture/separation-of-concerns'],
    recommends: ['technology/security/threat-modeling'],
    providedBy: 'standard-library',
    dependedOnBy: ['execution/api/rest-implementation']  // Bidirectional!
  }
};

// Module file contains no dependency information
export const apiSecurity: Module = {
  id: 'technology/security/api-security',
  // No relationships field
};
```

### Advantages

1. **Complete Decoupling**: Modules don't know about each other
2. **Bidirectional Queries**: Can efficiently query both directions
3. **Centralized Management**: All relationships in one place
4. **Easy Refactoring**: Update module IDs in single location
5. **Graph Analysis**: Enables sophisticated dependency analysis
6. **Conflict Detection**: Easier to detect and resolve conflicts
7. **Multiple Perspectives**: Can maintain different dependency views

### Disadvantages

1. **Split Information**: Module definition separated from dependencies
2. **Synchronization Risk**: Graph can drift from actual modules
3. **Additional File**: One more configuration to maintain
4. **Discovery Challenge**: Module authors may not know to update graph
5. **Merge Conflicts**: Centralized file prone to version control conflicts

### Implementation Requirements

```typescript
interface DependencyGraph {
  [moduleId: string]: {
    requires?: string[];
    recommends?: string[];
    conflictsWith?: string[];
    dependedOnBy?: string[];  // Computed or maintained
    providedBy?: string;       // Source information
    metadata?: {
      addedBy: string;
      addedAt: string;
      reason?: string;
    };
  };
}

class DependencyManager {
  private graph: DependencyGraph;

  // Bidirectional query support
  getDependents(moduleId: string): string[] {
    return this.graph[moduleId]?.dependedOnBy || [];
  }

  getDependencies(moduleId: string): string[] {
    return this.graph[moduleId]?.requires || [];
  }

  // Graph analysis
  getTransitiveDependencies(moduleId: string): Set<string> {
    const visited = new Set<string>();
    const queue = [moduleId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);

      const deps = this.graph[current]?.requires || [];
      queue.push(...deps);
    }

    return visited;
  }

  // Validation
  validateGraph(): ValidationResult {
    const errors: ValidationError[] = [];

    // Check all referenced modules exist
    for (const [moduleId, deps] of Object.entries(this.graph)) {
      for (const depId of deps.requires || []) {
        if (!this.graph[depId]) {
          errors.push({
            message: `Module ${moduleId} requires non-existent ${depId}`
          });
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }
}
```

### Real-World Example

```typescript
// dependencies.config.ts
export const dependencyGraph = {
  // Foundation layer - no dependencies
  'foundation/ethics/do-no-harm': {
    dependedOnBy: ['foundation/ethics/privacy-first', 'principle/security/secure-by-default']
  },

  // Principle layer - depends on foundation
  'principle/architecture/separation-of-concerns': {
    requires: ['foundation/reasoning/systems-thinking'],
    dependedOnBy: [
      'technology/security/api-security',
      'technology/typescript/module-design'
    ]
  },

  // Technology layer - depends on principles
  'technology/security/api-security': {
    requires: [
      'principle/architecture/separation-of-concerns',
      'principle/security/defense-in-depth'
    ],
    recommends: [
      'technology/security/threat-modeling',
      'execution/testing/security-testing'
    ],
    conflictsWith: ['technology/security/basic-api-security']
  }
};
```

### Graph Visualization Support

```typescript
// Generate DOT format for Graphviz
function generateDependencyGraph(graph: DependencyGraph): string {
  const lines = ['digraph Dependencies {'];

  for (const [moduleId, deps] of Object.entries(graph)) {
    // Requires (solid line)
    for (const req of deps.requires || []) {
      lines.push(`  "${moduleId}" -> "${req}" [color=red];`);
    }

    // Recommends (dashed line)
    for (const rec of deps.recommends || []) {
      lines.push(`  "${moduleId}" -> "${rec}" [style=dashed, color=blue];`);
    }

    // Conflicts (dotted line)
    for (const conf of deps.conflictsWith || []) {
      lines.push(`  "${moduleId}" -> "${conf}" [style=dotted, color=orange, dir=both];`);
    }
  }

  lines.push('}');
  return lines.join('\n');
}
```

### Cost-Benefit Analysis

| Aspect | Cost | Benefit |
|--------|------|---------|
| **Implementation** | High - Complex graph management | Powerful analysis capabilities |
| **Maintenance** | Medium - Centralized updates | Easy refactoring |
| **Runtime** | Low - Efficient lookups | Bidirectional queries |
| **Type Safety** | Medium - Can add TypeScript types | Better than strings |
| **Developer Experience** | Mixed - Split concerns | Rich tooling possible |

---

## 3. Implicit Dependencies via Cognitive Hierarchy

### Overview

Dependencies are implicitly determined by the cognitive level hierarchy, eliminating explicit declarations:

```typescript
export const apiSecurity: Module = {
  id: 'technology/security/api-security',
  cognitiveLevel: CognitiveLevel.PROCEDURES_AND_PLAYBOOKS, // Level 4
  // Can implicitly use anything from levels 0-3
  // No explicit dependencies needed
};
```

### Advantages

1. **Zero Coupling**: No explicit module references
2. **Architectural Enforcement**: Hierarchy prevents bad dependencies
3. **No Maintenance**: Dependencies implicit in cognitive levels
4. **Circular Prevention**: Impossible by design (DAG structure)
5. **Self-Documenting**: Level indicates module's abstraction
6. **Automatic Validation**: Level comparison is trivial
7. **Clean Modules**: No dependency clutter

### Disadvantages

1. **Coarse Granularity**: Can't express specific module needs
2. **Over-Permission**: Module can use ALL lower-level modules
3. **Lateral Blindness**: Can't express peer dependencies
4. **No Recommendations**: Can't suggest companion modules
5. **Limited Expressiveness**: Some relationships don't fit hierarchy
6. **Rigid Structure**: Forced into hierarchical thinking

### Implementation Requirements

```typescript
enum CognitiveLevel {
  AXIOMS_AND_ETHICS = 0,           // Foundation
  REASONING_FRAMEWORKS = 1,         // How to think
  UNIVERSAL_PATTERNS = 2,           // Cross-domain patterns
  DOMAIN_SPECIFIC_GUIDANCE = 3,     // Field-specific
  PROCEDURES_AND_PLAYBOOKS = 4,     // Step-by-step
  SPECIFICATIONS_AND_STANDARDS = 5, // Requirements
  META_COGNITION = 6                // Self-reflection
}

class HierarchicalDependencyManager {
  // Validate dependencies based on cognitive levels
  validateHierarchy(module: Module, dependency: Module): boolean {
    // Can only depend on lower levels
    return module.cognitiveLevel > dependency.cognitiveLevel;
  }

  // Get all valid dependencies for a module
  getValidDependencies(
    module: Module,
    registry: ModuleRegistry
  ): Module[] {
    return registry.getAllModules().filter(m =>
      m.cognitiveLevel < module.cognitiveLevel
    );
  }

  // Suggest modules based on cognitive distance
  suggestCompanions(
    module: Module,
    registry: ModuleRegistry
  ): Module[] {
    // Suggest modules at same level (peers)
    return registry.getAllModules().filter(m =>
      m.cognitiveLevel === module.cognitiveLevel &&
      m.id !== module.id &&
      this.areRelatedDomains(module, m)
    );
  }

  private areRelatedDomains(m1: Module, m2: Module): boolean {
    // Check if modules share capabilities or domains
    const caps1 = new Set(m1.capabilities);
    const caps2 = new Set(m2.capabilities);
    return [...caps1].some(c => caps2.has(c));
  }
}
```

### Real-World Example

```typescript
// Automatic dependency resolution
const modules = {
  // Level 0 - Foundation (no dependencies allowed)
  'foundation/ethics/do-no-harm': {
    cognitiveLevel: CognitiveLevel.AXIOMS_AND_ETHICS,
    // Cannot depend on anything
  },

  // Level 2 - Can use levels 0-1
  'principle/architecture/solid': {
    cognitiveLevel: CognitiveLevel.UNIVERSAL_PATTERNS,
    // Can use: do-no-harm, reasoning-frameworks
    // Cannot use: api-security (level 4)
  },

  // Level 4 - Can use levels 0-3
  'execution/api/implementation': {
    cognitiveLevel: CognitiveLevel.PROCEDURES_AND_PLAYBOOKS,
    // Can use all foundation, reasoning, patterns, domain guidance
    // Cannot use: other procedures, specifications, meta-cognition
  }
};

// Build-time composition
function composePersona(moduleIds: string[]): CompositionResult {
  // Sort by cognitive level (foundation first)
  const sorted = moduleIds.sort((a, b) => {
    const modA = registry.getModule(a);
    const modB = registry.getModule(b);
    return modA.cognitiveLevel - modB.cognitiveLevel;
  });

  // Validate hierarchy
  for (let i = 0; i < sorted.length; i++) {
    const module = registry.getModule(sorted[i]);
    const validDeps = sorted.slice(0, i); // All previous modules

    // Check module content for references
    const references = extractReferences(module);
    for (const ref of references) {
      if (!validDeps.includes(ref)) {
        warnings.push(`${module.id} references ${ref} but it's not available at this level`);
      }
    }
  }

  return { modules: sorted, warnings };
}
```

### Cognitive Level Guidelines

```typescript
// Level assignment helper
function suggestCognitiveLevel(module: Module): CognitiveLevel {
  const content = JSON.stringify(module).toLowerCase();

  // Keywords indicating each level
  const levelIndicators = {
    [CognitiveLevel.AXIOMS_AND_ETHICS]:
      ['ethic', 'moral', 'harm', 'privacy', 'consent'],

    [CognitiveLevel.REASONING_FRAMEWORKS]:
      ['reasoning', 'logic', 'analysis', 'thinking', 'judgment'],

    [CognitiveLevel.UNIVERSAL_PATTERNS]:
      ['pattern', 'principle', 'solid', 'dry', 'kiss'],

    [CognitiveLevel.DOMAIN_SPECIFIC_GUIDANCE]:
      ['best practice', 'convention', 'guideline', 'approach'],

    [CognitiveLevel.PROCEDURES_AND_PLAYBOOKS]:
      ['step', 'process', 'workflow', 'implement', 'execute'],

    [CognitiveLevel.SPECIFICATIONS_AND_STANDARDS]:
      ['specification', 'standard', 'requirement', 'compliance'],

    [CognitiveLevel.META_COGNITION]:
      ['retrospective', 'improvement', 'learning', 'reflection']
  };

  // Score each level
  const scores = Object.entries(levelIndicators).map(([level, keywords]) => ({
    level: parseInt(level),
    score: keywords.filter(kw => content.includes(kw)).length
  }));

  // Return highest scoring level
  return scores.reduce((a, b) => a.score > b.score ? a : b).level;
}
```

### Cost-Benefit Analysis

| Aspect | Cost | Benefit |
|--------|------|---------|
| **Implementation** | Low - Simple level comparison | Automatic dependency resolution |
| **Maintenance** | None - No explicit dependencies | Self-maintaining |
| **Runtime** | Very Low - Integer comparison | Fast validation |
| **Type Safety** | High - Enum-based | Compile-time safety |
| **Developer Experience** | Excellent - No dependency management | May feel restrictive |

---

## 4. Capability-Based Discovery

### Overview

Modules declare what capabilities they need and provide, with the system matching providers to consumers:

```typescript
export const apiSecurity: Module = {
  id: 'technology/security/api-security',
  capabilities: ['api-security', 'owasp-top-10'],  // What I provide
  requiresCapabilities: ['architecture-principles', 'error-handling'], // What I need
  // System finds modules that provide required capabilities
};
```

### Advantages

1. **Loose Coupling**: Depend on capabilities, not specific modules
2. **Flexibility**: Multiple modules can satisfy requirements
3. **Substitutability**: Can swap implementations
4. **Discovery**: System can suggest providers
5. **Semantic Matching**: More meaningful than IDs
6. **Evolution Friendly**: New modules automatically matched
7. **Duck Typing**: Interface-based rather than identity-based

### Disadvantages

1. **Ambiguity**: Multiple modules might provide same capability
2. **Over-Matching**: May include unwanted providers
3. **Naming Challenges**: Capability naming consistency crucial
4. **Resolution Complexity**: Runtime matching algorithm needed
5. **Version Blindness**: No capability versioning
6. **Implicit Dependencies**: Less explicit than direct references

### Implementation Requirements

```typescript
interface CapabilityModule extends Module {
  capabilities: string[];           // What this module provides
  requiresCapabilities?: string[];  // What this module needs
  optionalCapabilities?: string[];  // Nice to have
}

class CapabilityResolver {
  private capabilityIndex: Map<string, Module[]> = new Map();

  // Build capability index
  indexModules(modules: Module[]): void {
    for (const module of modules) {
      for (const capability of module.capabilities) {
        if (!this.capabilityIndex.has(capability)) {
          this.capabilityIndex.set(capability, []);
        }
        this.capabilityIndex.get(capability)!.push(module);
      }
    }
  }

  // Find modules that provide a capability
  findProviders(capability: string): Module[] {
    return this.capabilityIndex.get(capability) || [];
  }

  // Resolve all requirements for a module
  resolveRequirements(module: CapabilityModule): ResolutionResult {
    const resolved: Map<string, Module[]> = new Map();
    const missing: string[] = [];

    for (const required of module.requiresCapabilities || []) {
      const providers = this.findProviders(required);

      if (providers.length === 0) {
        missing.push(required);
      } else {
        resolved.set(required, providers);
      }
    }

    return {
      resolved,
      missing,
      ambiguous: [...resolved.entries()]
        .filter(([_, providers]) => providers.length > 1)
        .map(([cap, _]) => cap)
    };
  }

  // Suggest best provider for a capability
  selectBestProvider(
    capability: string,
    context: Module[]
  ): Module | undefined {
    const providers = this.findProviders(capability);

    if (providers.length === 0) return undefined;
    if (providers.length === 1) return providers[0];

    // Score providers based on context
    return providers.reduce((best, current) => {
      const bestScore = this.scoreProvider(best, context);
      const currentScore = this.scoreProvider(current, context);
      return currentScore > bestScore ? current : best;
    });
  }

  private scoreProvider(provider: Module, context: Module[]): number {
    let score = 0;

    // Prefer providers already in context
    if (context.includes(provider)) score += 10;

    // Prefer providers with more capabilities (more comprehensive)
    score += provider.capabilities.length;

    // Prefer stable/mature providers
    if (provider.version.startsWith('1.')) score += 5;

    return score;
  }
}
```

### Real-World Example

```typescript
// Capability-based modules
const modules = {
  // Provider modules
  'principle/error-handling': {
    capabilities: ['error-handling', 'exception-management', 'fault-tolerance'],
    requiresCapabilities: ['logging']  // Needs logging capability
  },

  'technology/logging/winston': {
    capabilities: ['logging', 'structured-logging', 'log-aggregation']
    // No requirements - standalone
  },

  'technology/logging/pino': {
    capabilities: ['logging', 'structured-logging', 'high-performance']
    // Alternative logging provider
  },

  // Consumer module
  'execution/api/error-middleware': {
    capabilities: ['express-middleware', 'error-middleware'],
    requiresCapabilities: [
      'error-handling',      // Satisfied by principle/error-handling
      'logging',            // Satisfied by either winston OR pino
      'http-status-codes'   // Might have multiple providers
    ]
  }
};

// Resolution example
function resolvePersona(selectedModules: string[]): Resolution {
  const modules = selectedModules.map(id => registry.getModule(id));
  const allCapabilities = new Set<string>();
  const requiredCapabilities = new Set<string>();

  // Collect all provided and required capabilities
  for (const module of modules) {
    module.capabilities.forEach(c => allCapabilities.add(c));
    module.requiresCapabilities?.forEach(c => requiredCapabilities.add(c));
  }

  // Find unsatisfied requirements
  const missing = [...requiredCapabilities].filter(c => !allCapabilities.has(c));

  // Suggest modules to add
  const suggestions = missing.map(capability => ({
    capability,
    providers: resolver.findProviders(capability)
  }));

  return { modules, missing, suggestions };
}
```

### Capability Naming Convention

```typescript
// Capability taxonomy helper
class CapabilityTaxonomy {
  private readonly taxonomy = {
    // Domain capabilities
    'architecture': ['separation-of-concerns', 'layered-architecture', 'microservices'],
    'security': ['authentication', 'authorization', 'encryption', 'api-security'],
    'testing': ['unit-testing', 'integration-testing', 'e2e-testing'],

    // Technical capabilities
    'language': ['typescript', 'python', 'rust', 'go'],
    'framework': ['express', 'react', 'vue', 'angular'],
    'database': ['sql', 'nosql', 'orm', 'migrations'],

    // Functional capabilities
    'error-handling': ['exception-management', 'fault-tolerance', 'recovery'],
    'logging': ['structured-logging', 'log-aggregation', 'audit-logging'],
    'monitoring': ['metrics', 'tracing', 'alerting']
  };

  // Suggest capability names based on module content
  suggestCapabilities(module: Module): string[] {
    const suggestions: string[] = [];
    const content = JSON.stringify(module).toLowerCase();

    for (const [category, capabilities] of Object.entries(this.taxonomy)) {
      for (const capability of capabilities) {
        if (content.includes(capability.replace('-', ' '))) {
          suggestions.push(capability);
        }
      }
    }

    return suggestions;
  }

  // Validate capability names
  validateCapability(capability: string): ValidationResult {
    const warnings: string[] = [];

    // Check naming convention (kebab-case)
    if (!/^[a-z]+(-[a-z]+)*$/.test(capability)) {
      warnings.push(`Capability '${capability}' should be kebab-case`);
    }

    // Check if it's a known capability
    const known = Object.values(this.taxonomy).flat().includes(capability);
    if (!known) {
      warnings.push(`Capability '${capability}' is not in standard taxonomy`);
    }

    return { valid: warnings.length === 0, warnings };
  }
}
```

### Cost-Benefit Analysis

| Aspect | Cost | Benefit |
|--------|------|---------|
| **Implementation** | High - Complex resolution | Flexible composition |
| **Maintenance** | Medium - Capability naming | Loose coupling |
| **Runtime** | Medium - Resolution algorithm | Dynamic matching |
| **Type Safety** | Low - String capabilities | Some IDE support possible |
| **Developer Experience** | Good - Intuitive model | May need disambiguation |

---

## 5. Persona-Level Composition Only

### Overview

Modules are completely independent; all composition and dependency management happens at the persona level:

```typescript
// Modules have no dependency information
export const apiSecurity: Module = {
  id: 'technology/security/api-security',
  // No relationships, requirements, or dependencies
};

// Persona handles all composition
export const backendDeveloper: Persona = {
  modules: [
    // Persona author orders these correctly
    'foundation/ethics/do-no-harm',
    'principle/architecture/separation-of-concerns',
    'technology/security/api-security'  // Implicitly depends on above
  ]
};
```

### Advantages

1. **Maximum Simplicity**: Modules have no dependency complexity
2. **Zero Coupling**: Modules completely independent
3. **Full Flexibility**: Persona authors have complete control
4. **No Conflicts**: No dependency conflicts possible
5. **Easy Testing**: Modules testable in isolation
6. **Clear Responsibility**: Persona author owns composition
7. **No Maintenance**: No dependencies to maintain

### Disadvantages

1. **No Guidance**: System can't help with composition
2. **Error Prone**: Easy to miss required foundations
3. **Duplication**: Each persona must specify full stack
4. **No Validation**: Can't validate missing dependencies
5. **Knowledge Burden**: Persona authors must understand all modules
6. **No Reuse**: Can't share dependency knowledge

### Implementation Requirements

```typescript
class PersonaComposer {
  // Suggest modules based on selected ones
  suggestModules(
    selected: Module[],
    registry: ModuleRegistry
  ): Module[] {
    const suggestions: Module[] = [];

    // Analyze selected modules
    const capabilities = new Set(selected.flatMap(m => m.capabilities));
    const domains = new Set(selected.flatMap(m =>
      Array.isArray(m.domain) ? m.domain : [m.domain]
    ));

    // Find related modules
    for (const module of registry.getAllModules()) {
      if (selected.includes(module)) continue;

      // Score relevance
      let score = 0;

      // Check capability overlap
      for (const cap of module.capabilities) {
        if (capabilities.has(cap)) score += 2;
      }

      // Check domain overlap
      const modDomains = Array.isArray(module.domain)
        ? module.domain
        : [module.domain];
      for (const domain of modDomains) {
        if (domains.has(domain)) score += 1;
      }

      if (score > 0) {
        suggestions.push(module);
      }
    }

    // Sort by relevance and cognitive level
    return suggestions.sort((a, b) => {
      // First by cognitive level (foundation first)
      const levelDiff = a.cognitiveLevel - b.cognitiveLevel;
      if (levelDiff !== 0) return levelDiff;

      // Then by relevance score
      return this.scoreModule(b, selected) - this.scoreModule(a, selected);
    });
  }

  // Validate persona composition
  validateComposition(persona: Persona): ValidationResult {
    const warnings: string[] = [];
    const modules = persona.modules.map(id => registry.getModule(id));

    // Check for foundational coverage
    const hasEthics = modules.some(m =>
      m.cognitiveLevel === CognitiveLevel.AXIOMS_AND_ETHICS
    );
    if (!hasEthics) {
      warnings.push('No ethical foundation modules included');
    }

    // Check for cognitive level progression
    const levels = modules.map(m => m.cognitiveLevel).sort();
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i-1] > 2) {
        warnings.push(`Large cognitive gap between levels ${levels[i-1]} and ${levels[i]}`);
      }
    }

    // Check for domain consistency
    const domains = new Set(modules.flatMap(m =>
      Array.isArray(m.domain) ? m.domain : [m.domain]
    ));
    if (domains.size > 5) {
      warnings.push('Persona covers many domains - consider splitting');
    }

    return { valid: true, warnings };
  }
}
```

### Real-World Example

```typescript
// backend-developer.persona.ts
export default {
  id: 'backend-developer',
  name: 'Backend Developer',
  modules: [
    // Foundation (manually ordered)
    'foundation/ethics/do-no-harm',
    'foundation/ethics/privacy-first',
    'foundation/reasoning/systems-thinking',

    // Principles (building on foundation)
    'principle/architecture/separation-of-concerns',
    'principle/architecture/solid',
    'principle/testing/test-first',

    // Technology (using principles)
    'technology/nodejs/best-practices',
    'technology/security/api-security',
    'technology/database/sql-design',

    // Execution (applying everything above)
    'execution/api/rest-implementation',
    'execution/testing/integration-testing',
    'execution/deployment/docker'
  ]
} satisfies Persona;

// Composition helper tool
class PersonaBuilder {
  private selected: string[] = [];

  // Interactive builder
  addModule(moduleId: string): BuilderResult {
    const module = registry.getModule(moduleId);
    const result: BuilderResult = {
      added: moduleId,
      suggestions: [],
      warnings: []
    };

    // Check cognitive level appropriateness
    const currentLevels = this.selected
      .map(id => registry.getModule(id))
      .map(m => m.cognitiveLevel);

    if (currentLevels.length > 0) {
      const maxLevel = Math.max(...currentLevels);
      if (module.cognitiveLevel < maxLevel - 1) {
        result.warnings.push('Adding lower-level module after higher ones');
      }
    }

    this.selected.push(moduleId);

    // Suggest related modules
    result.suggestions = this.suggestNext();

    return result;
  }

  private suggestNext(): string[] {
    // Analyze current selection
    const modules = this.selected.map(id => registry.getModule(id));
    const capabilities = new Set(modules.flatMap(m => m.capabilities));

    // Find modules that complement current selection
    return registry.getAllModules()
      .filter(m => !this.selected.includes(m.id))
      .filter(m => {
        // Must share at least one capability
        return m.capabilities.some(c => capabilities.has(c));
      })
      .map(m => m.id)
      .slice(0, 5); // Top 5 suggestions
  }
}
```

### Persona Templates

```typescript
// Predefined persona templates to help users
const personaTemplates = {
  'minimal': {
    description: 'Bare minimum ethical foundation',
    modules: [
      'foundation/ethics/do-no-harm',
      'foundation/reasoning/critical-thinking'
    ]
  },

  'backend-base': {
    description: 'Foundation for backend development',
    modules: [
      'foundation/ethics/do-no-harm',
      'foundation/ethics/privacy-first',
      'principle/architecture/separation-of-concerns',
      'principle/architecture/solid',
      'principle/testing/test-first'
    ]
  },

  'frontend-base': {
    description: 'Foundation for frontend development',
    modules: [
      'foundation/ethics/do-no-harm',
      'foundation/ethics/accessibility-first',
      'principle/architecture/component-based',
      'principle/ux/user-centered-design'
    ]
  }
};

// Template application
function createPersonaFromTemplate(
  template: string,
  additions: string[]
): Persona {
  const base = personaTemplates[template];
  if (!base) throw new Error(`Unknown template: ${template}`);

  return {
    id: `custom-${Date.now()}`,
    name: 'Custom Persona',
    description: `Based on ${template} template`,
    modules: [...base.modules, ...additions]
  };
}
```

### Cost-Benefit Analysis

| Aspect | Cost | Benefit |
|--------|------|---------|
| **Implementation** | Very Low - No dependency system | Maximum simplicity |
| **Maintenance** | None for modules | All in personas |
| **Runtime** | Very Low - No resolution | Fast composition |
| **Type Safety** | High - Can type-check IDs | Simple validation |
| **Developer Experience** | Mixed - No guidance | Complete control |

---

## 6. Import-Based Dependencies

### Overview

Modules use TypeScript imports to declare dependencies, leveraging the language's module system:

```typescript
// advanced-api-security.module.ts
import { separationOfConcerns } from '../principle/architecture/separation-of-concerns.module.js';
import { errorHandling } from '../principle/error-handling.module.js';

export const advancedApiSecurity: Module = {
  id: 'technology/security/advanced-api-security',
  // Dependencies are explicit via imports
  basedOn: [separationOfConcerns.id, errorHandling.id], // Type-safe!
};
```

### Advantages

1. **Type Safety**: Full TypeScript type checking
2. **IDE Support**: Autocomplete, refactoring, navigation
3. **Compile-Time Validation**: Missing imports = build errors
4. **Familiar Pattern**: Standard JavaScript/TypeScript modules
5. **Automatic Updates**: IDE refactoring updates imports
6. **Explicit Dependencies**: Clear in code what's needed
7. **Tree Shaking**: Unused dependencies can be eliminated

### Disadvantages

1. **File System Coupling**: Ties to directory structure
2. **Circular Import Risk**: JavaScript circular dependency issues
3. **Dynamic Loading Challenge**: Harder to load modules dynamically
4. **Build Complexity**: Requires module bundler configuration
5. **Runtime vs Build Time**: Mix of concerns
6. **Path Management**: Relative paths can be fragile

### Implementation Requirements

```typescript
// Module type with import tracking
interface ImportedModule extends Module {
  dependencies?: Module[];  // Actual imported modules
  basedOn?: string[];      // IDs of imported modules
}

// Build-time analysis
class ImportAnalyzer {
  async analyzeImports(filePath: string): Promise<ImportAnalysis> {
    const content = await fs.readFile(filePath, 'utf-8');
    const imports: ImportInfo[] = [];

    // Parse import statements
    const importRegex = /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const [, names, path] = match;

      // Resolve absolute path
      const absolutePath = this.resolvePath(filePath, path);

      // Parse imported names
      const importedNames = names.split(',').map(n => n.trim());

      imports.push({
        path: absolutePath,
        names: importedNames,
        isModuleImport: path.endsWith('.module.js')
      });
    }

    return {
      file: filePath,
      imports,
      moduleImports: imports.filter(i => i.isModuleImport)
    };
  }

  // Generate dependency graph from imports
  async buildDependencyGraph(
    rootDir: string
  ): Promise<DependencyGraph> {
    const graph: DependencyGraph = {};
    const moduleFiles = await this.findModuleFiles(rootDir);

    for (const file of moduleFiles) {
      const analysis = await this.analyzeImports(file);
      const moduleId = this.extractModuleId(file);

      graph[moduleId] = {
        file,
        imports: analysis.moduleImports.map(i =>
          this.extractModuleId(i.path)
        ),
        importedBy: [] // Will be populated in second pass
      };
    }

    // Second pass: populate importedBy
    for (const [moduleId, info] of Object.entries(graph)) {
      for (const imported of info.imports) {
        if (graph[imported]) {
          graph[imported].importedBy.push(moduleId);
        }
      }
    }

    return graph;
  }

  // Detect circular imports
  detectCircularImports(graph: DependencyGraph): CircularImport[] {
    const cycles: CircularImport[] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    function dfs(moduleId: string, path: string[] = []): void {
      visited.add(moduleId);
      recursionStack.add(moduleId);
      path.push(moduleId);

      for (const imported of graph[moduleId]?.imports || []) {
        if (!visited.has(imported)) {
          dfs(imported, [...path]);
        } else if (recursionStack.has(imported)) {
          // Found cycle
          const cycleStart = path.indexOf(imported);
          cycles.push({
            cycle: path.slice(cycleStart),
            entry: imported
          });
        }
      }

      recursionStack.delete(moduleId);
    }

    for (const moduleId of Object.keys(graph)) {
      if (!visited.has(moduleId)) {
        dfs(moduleId);
      }
    }

    return cycles;
  }
}
```

### Real-World Example

```typescript
// separation-of-concerns.module.ts
import { Module } from 'ums-lib';

export const separationOfConcerns: Module = {
  id: 'principle/architecture/separation-of-concerns',
  version: '1.0.0',
  // No dependencies - foundational principle
};

// error-handling.module.ts
import { Module } from 'ums-lib';
import { separationOfConcerns } from './architecture/separation-of-concerns.module.js';

export const errorHandling: Module = {
  id: 'principle/error-handling',
  version: '1.0.0',
  // Reference imported module
  basedOn: [separationOfConcerns.id],
  metadata: {
    name: 'Error Handling',
    description: `Builds on ${separationOfConcerns.metadata.name}`
  }
};

// api-security.module.ts
import { Module } from 'ums-lib';
import { separationOfConcerns } from '../principle/architecture/separation-of-concerns.module.js';
import { errorHandling } from '../principle/error-handling.module.js';
import { authentication } from './authentication.module.js';

export const apiSecurity: Module = {
  id: 'technology/security/api-security',
  version: '1.0.0',
  basedOn: [
    separationOfConcerns.id,
    errorHandling.id,
    authentication.id
  ],
  // Can also reference imported module properties
  instruction: {
    purpose: 'Apply security principles',
    process: [
      `Follow ${separationOfConcerns.metadata.name} principles`,
      `Implement ${errorHandling.metadata.name} for security errors`,
      `Use ${authentication.metadata.name} for user verification`
    ]
  }
};
```

### Build Configuration

```typescript
// webpack.config.js for module bundling
module.exports = {
  entry: './src/modules/index.ts',
  module: {
    rules: [
      {
        test: /\.module\.ts$/,
        use: [
          'ts-loader',
          {
            loader: 'module-metadata-loader',
            options: {
              validateImports: true,
              checkCircular: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@foundation': path.resolve(__dirname, 'src/modules/foundation'),
      '@principle': path.resolve(__dirname, 'src/modules/principle'),
      '@technology': path.resolve(__dirname, 'src/modules/technology'),
      '@execution': path.resolve(__dirname, 'src/modules/execution')
    }
  }
};

// tsconfig.json paths for cleaner imports
{
  "compilerOptions": {
    "paths": {
      "@foundation/*": ["./src/modules/foundation/*"],
      "@principle/*": ["./src/modules/principle/*"],
      "@technology/*": ["./src/modules/technology/*"],
      "@execution/*": ["./src/modules/execution/*"]
    }
  }
}

// Usage with path aliases
import { separationOfConcerns } from '@principle/architecture/separation-of-concerns.module';
import { errorHandling } from '@principle/error-handling.module';
```

### Dynamic Loading Support

```typescript
// Hybrid approach for dynamic loading
class ModuleLoader {
  private cache = new Map<string, Module>();

  async loadModule(moduleId: string): Promise<Module> {
    if (this.cache.has(moduleId)) {
      return this.cache.get(moduleId)!;
    }

    // Convert ID to path
    const path = this.idToPath(moduleId);

    // Dynamic import
    const moduleExports = await import(path);

    // Extract the module (might be named export)
    const exportName = this.idToExportName(moduleId);
    const module = moduleExports[exportName];

    if (!module) {
      throw new Error(`No export '${exportName}' in ${path}`);
    }

    // Load dependencies recursively
    if (module.basedOn) {
      for (const depId of module.basedOn) {
        await this.loadModule(depId);
      }
    }

    this.cache.set(moduleId, module);
    return module;
  }

  private idToPath(moduleId: string): string {
    // Convert 'technology/security/api-security'
    // to './modules/technology/security/api-security.module.js'
    return `./modules/${moduleId}.module.js`;
  }

  private idToExportName(moduleId: string): string {
    // Extract last segment and convert to camelCase
    const segments = moduleId.split('/');
    const lastSegment = segments[segments.length - 1];
    return lastSegment.replace(/-([a-z])/g, (_, letter) =>
      letter.toUpperCase()
    );
  }
}
```

### Cost-Benefit Analysis

| Aspect | Cost | Benefit |
|--------|------|---------|
| **Implementation** | Medium - Build setup required | Excellent type safety |
| **Maintenance** | Low - IDE handles refactoring | Self-updating imports |
| **Runtime** | Medium - Bundle size considerations | Fast after bundling |
| **Type Safety** | Excellent - Full TypeScript | Compile-time checking |
| **Developer Experience** | Excellent - Full IDE support | Familiar pattern |

---

## 7. Build-Time Analysis

### Overview

Dependencies are automatically inferred by analyzing module content during the build process:

```typescript
export const apiSecurity: Module = {
  id: 'technology/security/api-security',
  instruction: {
    purpose: 'Apply separation of concerns to API security design',
    // System detects reference to "separation of concerns"
    process: [
      'Use error handling patterns for security failures'
      // System detects reference to "error handling"
    ]
  }
  // No explicit dependencies - discovered through analysis
};
```

### Advantages

1. **Zero Maintenance**: Dependencies automatically discovered
2. **Always Accurate**: Can't drift from actual usage
3. **No Explicit Declaration**: Reduced boilerplate
4. **Smart Suggestions**: Based on actual content
5. **Refactoring Safe**: Updates automatically
6. **Content-Driven**: Dependencies match actual references
7. **No Coupling**: Modules don't know about analysis

### Disadvantages

1. **False Positives**: May detect unintended references
2. **False Negatives**: May miss implied dependencies
3. **Performance Cost**: Analysis takes time
4. **Ambiguity**: Natural language is imprecise
5. **Configuration Complexity**: Tuning detection rules
6. **Unpredictability**: Developers can't control detection

### Implementation Requirements

```typescript
class ContentAnalyzer {
  private patterns: Map<string, RegExp[]> = new Map();

  constructor() {
    // Initialize detection patterns
    this.patterns.set('separation-of-concerns', [
      /separation\s+of\s+concerns/gi,
      /\bSoC\b/g,
      /separate\s+concerns/gi,
      /concern\s+separation/gi
    ]);

    this.patterns.set('error-handling', [
      /error\s+handling/gi,
      /exception\s+management/gi,
      /fault\s+tolerance/gi,
      /error\s+recovery/gi
    ]);
  }

  // Analyze module content for references
  analyzeContent(module: Module): AnalysisResult {
    const content = this.extractTextContent(module);
    const detectedReferences: Map<string, number> = new Map();

    // Check each pattern
    for (const [conceptId, patterns] of this.patterns) {
      let confidence = 0;

      for (const pattern of patterns) {
        const matches = content.match(pattern);
        if (matches) {
          confidence += matches.length;
        }
      }

      if (confidence > 0) {
        detectedReferences.set(conceptId, confidence);
      }
    }

    return {
      moduleId: module.id,
      references: detectedReferences,
      suggestedDependencies: this.confidenceToModules(detectedReferences)
    };
  }

  // Extract all text content from module
  private extractTextContent(module: Module): string {
    const texts: string[] = [];

    // Metadata
    texts.push(module.metadata.name);
    texts.push(module.metadata.description);
    texts.push(module.metadata.semantic);

    // Instruction component
    if (module.instruction) {
      texts.push(module.instruction.purpose);
      texts.push(...(module.instruction.process || []).map(p =>
        typeof p === 'string' ? p : p.step
      ));
      texts.push(...(module.instruction.principles || []));
    }

    // Knowledge component
    if (module.knowledge) {
      texts.push(module.knowledge.explanation);
      module.knowledge.concepts?.forEach(c => {
        texts.push(c.name, c.description);
      });
    }

    return texts.join(' ');
  }

  // Convert detected concepts to module suggestions
  private confidenceToModules(
    references: Map<string, number>
  ): ModuleSuggestion[] {
    const suggestions: ModuleSuggestion[] = [];

    for (const [conceptId, confidence] of references) {
      // Find modules that provide this concept
      const providers = this.findConceptProviders(conceptId);

      for (const provider of providers) {
        suggestions.push({
          moduleId: provider.id,
          reason: `References "${conceptId}" (confidence: ${confidence})`,
          confidence: confidence / 10, // Normalize to 0-1
          required: confidence > 5  // High confidence = required
        });
      }
    }

    // Sort by confidence
    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  // Build comprehensive reference index
  async buildReferenceIndex(
    modules: Module[]
  ): Promise<ReferenceIndex> {
    const index: ReferenceIndex = {
      concepts: new Map(),
      modules: new Map(),
      references: new Map()
    };

    for (const module of modules) {
      const analysis = this.analyzeContent(module);

      // Store module analysis
      index.modules.set(module.id, analysis);

      // Build reverse index
      for (const [concept, confidence] of analysis.references) {
        if (!index.concepts.has(concept)) {
          index.concepts.set(concept, []);
        }
        index.concepts.get(concept)!.push({
          moduleId: module.id,
          confidence
        });
      }
    }

    // Build reference graph
    for (const module of modules) {
      const deps = index.modules.get(module.id)!.suggestedDependencies;
      index.references.set(module.id, deps.map(d => d.moduleId));
    }

    return index;
  }
}
```

### Real-World Example

```typescript
// Module with implicit dependencies
export const apiImplementation: Module = {
  id: 'execution/api/rest-implementation',
  metadata: {
    name: 'REST API Implementation',
    description: 'Implement RESTful APIs with best practices',
    semantic: 'REST API implementation following separation of concerns principle, proper error handling, authentication, and OpenAPI specification'
  },
  instruction: {
    purpose: 'Build REST APIs that are secure, maintainable, and well-documented',
    process: [
      'Apply separation of concerns to route handlers',
      'Implement comprehensive error handling middleware',
      'Use JWT for stateless authentication',
      'Document with OpenAPI/Swagger specification',
      'Follow REST maturity model level 2'
    ]
  }
};

// Analysis result
const analysisResult = {
  moduleId: 'execution/api/rest-implementation',
  references: new Map([
    ['separation-of-concerns', 8],  // High confidence
    ['error-handling', 6],           // Medium-high confidence
    ['authentication', 4],           // Medium confidence
    ['api-documentation', 3],        // Low-medium confidence
    ['rest-principles', 5]           // Medium confidence
  ]),
  suggestedDependencies: [
    {
      moduleId: 'principle/architecture/separation-of-concerns',
      confidence: 0.8,
      required: true,
      reason: 'Multiple references to separation of concerns'
    },
    {
      moduleId: 'principle/error-handling',
      confidence: 0.6,
      required: true,
      reason: 'Explicit error handling requirements'
    },
    {
      moduleId: 'technology/security/jwt-authentication',
      confidence: 0.4,
      required: false,
      reason: 'Mentions JWT authentication'
    }
  ]
};
```

### Advanced Analysis Techniques

```typescript
// Natural Language Processing enhanced analyzer
class NLPAnalyzer extends ContentAnalyzer {
  private tokenizer: Tokenizer;
  private classifier: ConceptClassifier;

  // Use NLP for better concept detection
  async analyzeWithNLP(module: Module): Promise<NLPAnalysis> {
    const content = this.extractTextContent(module);

    // Tokenize and tag parts of speech
    const tokens = await this.tokenizer.tokenize(content);
    const tagged = await this.tagger.tag(tokens);

    // Extract noun phrases (likely to be concepts)
    const nounPhrases = this.extractNounPhrases(tagged);

    // Classify concepts
    const concepts = await this.classifier.classify(nounPhrases);

    // Match to known modules
    const dependencies = await this.matchConceptsToModules(concepts);

    return {
      moduleId: module.id,
      concepts,
      dependencies,
      confidence: this.calculateConfidence(concepts)
    };
  }

  // Semantic similarity matching
  async findSimilarModules(
    module: Module,
    threshold: number = 0.7
  ): Promise<SimilarModule[]> {
    const embedding = await this.getEmbedding(module);
    const similar: SimilarModule[] = [];

    for (const candidate of this.registry.getAllModules()) {
      if (candidate.id === module.id) continue;

      const candidateEmbedding = await this.getEmbedding(candidate);
      const similarity = this.cosineSimilarity(embedding, candidateEmbedding);

      if (similarity >= threshold) {
        similar.push({
          module: candidate,
          similarity,
          sharedConcepts: this.findSharedConcepts(module, candidate)
        });
      }
    }

    return similar.sort((a, b) => b.similarity - a.similarity);
  }

  // Generate embedding for semantic matching
  private async getEmbedding(module: Module): Promise<number[]> {
    const text = [
      module.metadata.name,
      module.metadata.description,
      module.metadata.semantic
    ].join(' ');

    // Use pre-trained embeddings (e.g., Word2Vec, BERT)
    // This is simplified - real implementation would use proper NLP library
    return this.embeddingModel.encode(text);
  }
}

// Build-time integration
class BuildAnalyzer {
  private analyzer: ContentAnalyzer;
  private cache: Map<string, AnalysisResult> = new Map();

  // Analyze all modules during build
  async analyzeBuild(modules: Module[]): Promise<BuildAnalysis> {
    const startTime = Date.now();
    const analyses: AnalysisResult[] = [];

    // Parallel analysis
    const promises = modules.map(async module => {
      // Check cache
      const cacheKey = this.getCacheKey(module);
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey)!;
      }

      // Analyze
      const result = await this.analyzer.analyzeContent(module);
      this.cache.set(cacheKey, result);
      return result;
    });

    const results = await Promise.all(promises);

    // Generate dependency graph
    const graph = this.buildDependencyGraph(results);

    // Find issues
    const issues = this.findDependencyIssues(graph);

    return {
      duration: Date.now() - startTime,
      modulesAnalyzed: modules.length,
      dependenciesFound: graph.edges.length,
      issues,
      suggestions: this.generateSuggestions(results)
    };
  }

  private getCacheKey(module: Module): string {
    // Generate cache key based on module content hash
    const content = JSON.stringify(module);
    return crypto.createHash('sha256').update(content).digest('hex');
  }
}
```

### Configuration Options

```typescript
// analysis.config.ts
export const analysisConfig = {
  // Confidence thresholds
  thresholds: {
    required: 0.8,      // Above this = required dependency
    suggested: 0.4,     // Above this = suggested dependency
    ignored: 0.2        // Below this = ignored
  },

  // Pattern matching rules
  patterns: {
    // Concept patterns
    concepts: {
      'separation-of-concerns': {
        patterns: [/separation.*concerns/gi, /\bSoC\b/g],
        weight: 1.0
      },
      'error-handling': {
        patterns: [/error\s+handling/gi, /exception/gi],
        weight: 0.9
      }
    },

    // Module reference patterns
    moduleReferences: {
      direct: /uses?\s+(\w+(?:\/\w+)*)/gi,  // "uses principle/testing"
      imports: /import.*from\s+['"]([^'"]+)/g,
      requires: /requires?\s+(\w+)/gi
    }
  },

  // Analysis features
  features: {
    nlp: false,              // Use NLP analysis
    semantic: false,         // Use semantic similarity
    transitive: true,        // Include transitive dependencies
    caching: true,           // Cache analysis results
    parallel: true           // Parallel analysis
  },

  // Performance tuning
  performance: {
    maxParallel: 10,        // Max parallel analyses
    cacheSize: 1000,        // Max cache entries
    timeout: 5000           // Analysis timeout (ms)
  }
};

// Apply configuration
class ConfigurableAnalyzer extends ContentAnalyzer {
  constructor(private config: AnalysisConfig) {
    super();
    this.applyConfig();
  }

  private applyConfig(): void {
    // Apply pattern configuration
    for (const [concept, config] of Object.entries(this.config.patterns.concepts)) {
      this.patterns.set(concept, config.patterns);
    }

    // Configure features
    if (this.config.features.nlp) {
      this.enableNLP();
    }

    if (this.config.features.semantic) {
      this.enableSemanticMatching();
    }
  }

  // Override analysis with configuration
  async analyzeContent(module: Module): Promise<AnalysisResult> {
    // Apply timeout
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Analysis timeout')),
        this.config.performance.timeout)
    );

    const analysis = super.analyzeContent(module);

    // Race against timeout
    const result = await Promise.race([analysis, timeout]);

    // Apply thresholds
    return this.applyThresholds(result as AnalysisResult);
  }

  private applyThresholds(result: AnalysisResult): AnalysisResult {
    // Filter suggestions by confidence thresholds
    result.suggestedDependencies = result.suggestedDependencies.filter(dep =>
      dep.confidence >= this.config.thresholds.ignored
    );

    // Mark as required based on threshold
    result.suggestedDependencies.forEach(dep => {
      dep.required = dep.confidence >= this.config.thresholds.required;
    });

    return result;
  }
}
```

### Cost-Benefit Analysis

| Aspect | Cost | Benefit |
|--------|------|---------|
| **Implementation** | Very High - Complex analysis | Automatic discovery |
| **Maintenance** | Low - Self-maintaining | Always accurate |
| **Runtime** | High - Analysis overhead | Smart suggestions |
| **Type Safety** | None - Runtime analysis | N/A |
| **Developer Experience** | Mixed - Magical but opaque | Zero configuration |

---

## 8. Hybrid Approaches

### Overview

Combining multiple approaches can leverage the strengths of each while mitigating weaknesses:

### Hybrid A: Cognitive Hierarchy + External Graph

```typescript
// Modules use cognitive levels for implicit layering
export const apiSecurity: Module = {
  id: 'technology/security/api-security',
  cognitiveLevel: CognitiveLevel.PROCEDURES_AND_PLAYBOOKS,
  // Can use any module from levels 0-3
};

// External graph for specific relationships
export const recommendations = {
  'technology/security/api-security': {
    worksWellWith: ['threat-modeling', 'security-testing'],
    incompatibleWith: ['basic-api-security'],
    commonlyUsedWith: ['error-handling', 'logging']
  }
};
```

**Benefits:**
- Architectural layering enforced
- Specific relationships possible
- No tight coupling
- Bidirectional queries supported

### Hybrid B: Capabilities + Build Analysis

```typescript
// Modules declare capabilities
export const apiSecurity: Module = {
  capabilities: ['api-security', 'authentication'],
  // Build system discovers actual dependencies from content
};

// Build analysis enhances capability matching
class HybridResolver {
  async resolve(module: Module): Promise<Resolution> {
    // Start with capability matching
    const capabilityMatches = this.findByCapabilities(module);

    // Enhance with content analysis
    const contentMatches = await this.analyzeContent(module);

    // Combine and score
    return this.combineResults(capabilityMatches, contentMatches);
  }
}
```

**Benefits:**
- Semantic matching with validation
- Self-correcting system
- Rich dependency information

### Hybrid C: Import-Based + Persona Override

```typescript
// Modules use imports for default dependencies
import { errorHandling } from '../error-handling.module.js';

export const apiSecurity: Module = {
  basedOn: [errorHandling.id],
  // Default dependencies from imports
};

// Personas can override or extend
export const customPersona: Persona = {
  modules: ['api-security', 'error-handling'],
  overrides: {
    'api-security': {
      additionalDependencies: ['custom-logger'],
      removeDependencies: ['default-error-handling']
    }
  }
};
```

**Benefits:**
- Type-safe defaults
- Flexible customization
- Clear override mechanism

### Comprehensive Hybrid Analysis Available

For detailed implementation guides, code examples, and comprehensive analysis of all hybrid approaches, see:

📄 **[Hybrid Dependency Management Analysis](./hybrid-dependency-management-analysis.md)**

This companion document includes:
- Complete implementation code for each hybrid approach (2,000+ lines each)
- Real-world usage examples with working TypeScript code
- Detailed cost-benefit analysis tables for each hybrid
- Migration strategies and phased rollout plans
- Selection criteria based on system size, team expertise, and requirements
- Six fully analyzed hybrid approaches:
  1. **Cognitive Hierarchy + External Graph** - Best balance of structure and flexibility
  2. **Capabilities + Build Analysis** - Self-maintaining with smart discovery
  3. **Import-Based + Persona Override** - Type-safe with runtime customization
  4. **Layered Dependencies** - Core/Recommended/Contextual layers
  5. **Progressive Enhancement** - Runtime adaptive dependencies
  6. **Contextual Resolution** - Domain and regulation aware

Each hybrid is analyzed with the same depth as the individual approaches in this document, including implementation requirements, real-world examples, advantages, disadvantages, and detailed cost-benefit analysis.

---

## 9. Recommendations

### Decision Framework

Choose your approach based on these factors:

| Factor | Best Approach |
|--------|--------------|
| **Simplicity is paramount** | Persona-Level Only |
| **Type safety critical** | Import-Based |
| **Architectural enforcement needed** | Cognitive Hierarchy |
| **Flexibility required** | Capability-Based |
| **Zero maintenance desired** | Build-Time Analysis |
| **Complex relationships** | External Graph |
| **Existing in v2.0** | Current (String IDs) |

### Recommended Approach for UMS v2.1

Based on the analysis, I recommend:

**Primary: Cognitive Hierarchy (Implicit Dependencies)**
- Enforces good architecture
- Zero maintenance overhead
- Prevents dependency problems
- Simple to understand and implement

**Secondary: External Recommendations (Optional)**
- Non-binding suggestions
- Maintained separately
- Used by tooling for hints
- Not part of core spec

### Implementation Roadmap

1. **Phase 1: Remove Current System**
   - Remove `relationships` from module metadata
   - Document in migration guide
   - Keep in v2.0 for compatibility

2. **Phase 2: Implement Cognitive Hierarchy**
   - Validate cognitive levels in build
   - Enforce hierarchy rules
   - Generate warnings for violations

3. **Phase 3: Add Recommendations (Optional)**
   - Create external recommendations file
   - Build tooling for suggestions
   - Keep separate from core modules

4. **Phase 4: Enhanced Tooling**
   - Visualization of dependencies
   - Composition assistance
   - Validation and linting

### Migration Strategy

```typescript
// Migration tool
class DependencyMigrator {
  // Convert v2.0 relationships to v2.1 format
  migrate(module: V20Module): V21Module {
    const migrated = { ...module };

    // Remove relationships
    delete migrated.metadata.relationships;

    // Log migration info
    if (module.metadata.relationships) {
      console.log(`Module ${module.id} had dependencies:`,
        module.metadata.relationships);
      console.log('These should be validated against cognitive hierarchy');
    }

    return migrated;
  }

  // Generate recommendations from old relationships
  extractRecommendations(modules: V20Module[]): ExternalGraph {
    const recommendations: ExternalGraph = {};

    for (const module of modules) {
      if (module.metadata.relationships) {
        recommendations[module.id] = {
          recommends: module.metadata.relationships.recommends || [],
          notes: 'Migrated from v2.0 relationships'
        };
      }
    }

    return recommendations;
  }
}
```

## Conclusion

The analysis reveals that the current string-based dependency system has significant drawbacks with limited benefits. The Cognitive Hierarchy approach offers the best balance of simplicity, maintainability, and architectural benefits for UMS v2.1, while maintaining the option to layer additional recommendation systems on top for enhanced tooling support.

Key insights:
1. **Explicit dependencies create coupling** that makes refactoring difficult
2. **Implicit hierarchical dependencies** enforce good architecture automatically
3. **External systems** can provide rich features without module coupling
4. **Build-time analysis** offers automation but at high complexity cost
5. **Hybrid approaches** may be optimal for specific use cases

The recommended approach (Cognitive Hierarchy + Optional External Recommendations) provides a clean, maintainable solution that guides users toward good architectural patterns while keeping modules independent and reusable.