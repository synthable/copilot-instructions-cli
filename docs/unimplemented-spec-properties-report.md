# UMS v2.0/v2.1 Unimplemented Properties: Comprehensive Implementation Report

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Executive Summary](#executive-summary)
- [1. Module Version Resolution 🔴](#1-module-version-resolution-)
  - [Current Status](#current-status)
  - [Implementation Strategy](#implementation-strategy)
- [2. Module Relationships Enforcement 🟡](#2-module-relationships-enforcement-)
  - [Current Status](#current-status-1)
  - [Implementation Strategy](#implementation-strategy-1)
- [3. Problem-Solution Mapping (solves) 🔴](#3-problem-solution-mapping-solves-)
  - [Current Status](#current-status-2)
  - [Implementation Strategy](#implementation-strategy-2)
- [4. Quality Metadata Utilization 🟡](#4-quality-metadata-utilization-)
  - [Current Status](#current-status-3)
  - [Implementation Strategy](#implementation-strategy-3)
- [5. ProcessStep Enhanced Rendering ✅](#5-processstep-enhanced-rendering-)
  - [Implementation Details](#implementation-details)
- [6. Constraint Enhanced Rendering ✅](#6-constraint-enhanced-rendering-)
  - [Implementation Details](#implementation-details-1)
- [7. Criterion Enhanced Rendering ✅](#7-criterion-enhanced-rendering-)
  - [Implementation Details](#implementation-details-2)
- [8. Component Metadata Rendering 🔴](#8-component-metadata-rendering-)
  - [Current Status](#current-status-7)
  - [Implementation Strategy](#implementation-strategy-7)
- [9. Concept Tradeoffs Rendering 🟡](#9-concept-tradeoffs-rendering-)
  - [Current Status](#current-status-8)
  - [Implementation Strategy](#implementation-strategy-8)
- [10. Build Report Composition Events 🟡](#10-build-report-composition-events-)
  - [Current Status](#current-status-9)
  - [Implementation Strategy](#implementation-strategy-9)
- [11. Federation \& Remote Registries 🔴](#11-federation--remote-registries-)
  - [Current Status](#current-status-10)
  - [Implementation Strategy](#implementation-strategy-10)
- [12. Advanced Composition (import \& bindings) 🔴](#12-advanced-composition-import--bindings-)
  - [Current Status](#current-status-11)
  - [Proposed Design](#proposed-design)
- [Summary \& Prioritization](#summary--prioritization)
  - [High Priority (Quick Wins)](#high-priority-quick-wins)
  - [Medium Priority (Significant Value)](#medium-priority-significant-value)
  - [Low Priority (Nice-to-Have)](#low-priority-nice-to-have)
  - [Very Low Priority (Future Versions)](#very-low-priority-future-versions)
- [Implementation Roadmap](#implementation-roadmap)
  - [Phase 1: Quick Wins ✅ COMPLETED](#phase-1-quick-wins--completed)
  - [Phase 2: Discoverability (2-3 weeks)](#phase-2-discoverability-2-3-weeks)
  - [Phase 3: Ecosystem (3-4 weeks)](#phase-3-ecosystem-3-4-weeks)
  - [Phase 4: Advanced Features (4-6 weeks)](#phase-4-advanced-features-4-6-weeks)
  - [Phase 5: Federation (Future)](#phase-5-federation-future)
  - [Phase 6: Advanced Composition (Future)](#phase-6-advanced-composition-future)
- [Testing Strategy](#testing-strategy)
- [Documentation Requirements](#documentation-requirements)
- [Backward Compatibility](#backward-compatibility)
- [Conclusion](#conclusion)

## Executive Summary

This report identifies properties and features defined in the UMS v2.0/v2.1 specification that are not yet fully implemented in the codebase. For each property, we provide:

- Current status
- Implementation complexity
- Recommended implementation approach
- Dependencies and prerequisites
- Example implementation code where applicable

**Status Legend:**
- 🔴 **Not Implemented**: No implementation exists
- 🟡 **Partially Implemented**: Type definitions exist but functionality is incomplete
- ✅ **Implemented**: Fully functional (v2.1)

**UMS v2.1 Simplifications (Completed):**
- ✅ **ProcessStep** - Simplified to `step` + `notes` (ADR 0005)
- ✅ **Constraint** - Simplified to `rule` + `notes` (ADR 0006)
- ✅ **Criterion** - Simplified to `item` + `category` + `notes` (ADR 0007)

All three follow the same pattern: removed unused fields, added `notes` for elaboration, use RFC 2119 keywords for priority/severity. See `docs/spec/unified_module_system_v2.1_spec.md` Section 6.3 for complete rendering specifications.



---

## 1. Module Version Resolution 🔴

**Spec Reference:** Section 2.1 (line 66-71), Section 8 (line 933)

### Current Status

The `version` field is defined as a required field on modules, and semantic version validation exists in `module-validator.ts`. However:

- Version field is explicitly ignored: *"v2.0 implementations MAY ignore this field"* (spec line 71)
- Personas cannot specify version constraints for modules
- No version resolution logic exists
- All module references are version-agnostic

### Implementation Strategy

**Phase 1: Persona Version Constraints**

Allow personas to reference specific module versions:

```typescript
// Enhanced ModuleEntry type
export type ModuleEntry = string | VersionedModuleEntry | ModuleGroup;

export interface VersionedModuleEntry {
  id: string;
  version?: string; // Semver constraint: "^1.0.0", "~2.1.0", ">=1.5.0"
  source?: string;  // Optional source override
}

// Persona example
modules: [
  'foundation/ethics/do-no-harm', // Latest version
  { id: 'principle/testing/tdd', version: '^2.0.0' }, // Version constraint
  { id: 'technology/typescript/error-handling', version: '~1.5.0' }
]
```

**Phase 2: Version Resolution Algorithm**

Implement semver resolution in `module-resolver.ts`:

```typescript
import semver from 'semver';

export interface VersionedRegistry {
  [moduleId: string]: {
    [version: string]: RegistryEntry;
  };
}

export function resolveModuleVersion(
  moduleId: string,
  versionConstraint: string | undefined,
  registry: VersionedRegistry
): RegistryEntry | null {
  const versions = registry[moduleId];
  if (!versions) return null;

  if (!versionConstraint) {
    // Return latest version
    const sortedVersions = Object.keys(versions).sort(semver.rcompare);
    return versions[sortedVersions[0]];
  }

  // Find best matching version
  const availableVersions = Object.keys(versions);
  const matchingVersion = semver.maxSatisfying(availableVersions, versionConstraint);

  return matchingVersion ? versions[matchingVersion] : null;
}
```

**Phase 3: Multi-Version Registry**

Update `ModuleRegistry` to support multiple versions:

```typescript
export class ModuleRegistry {
  private versionedModules: VersionedRegistry = {};

  register(entry: RegistryEntry, strategy: ConflictStrategy = 'error'): void {
    const { module } = entry;

    if (!this.versionedModules[module.id]) {
      this.versionedModules[module.id] = {};
    }

    const existingVersion = this.versionedModules[module.id][module.version];

    if (existingVersion) {
      // Apply conflict strategy
      if (strategy === 'error') {
        throw new Error(`Module ${module.id}@${module.version} already registered`);
      } else if (strategy === 'replace') {
        this.versionedModules[module.id][module.version] = entry;
      }
      // 'warn' strategy: keep existing
    } else {
      this.versionedModules[module.id][module.version] = entry;
    }
  }

  resolve(moduleId: string, versionConstraint?: string): Module | undefined {
    const entry = resolveModuleVersion(moduleId, versionConstraint, this.versionedModules);
    return entry?.module;
  }
}
```

**Dependencies:**
- `semver` package for version resolution
- Registry refactoring to support versioned storage
- Persona parser updates to support versioned entries

**Complexity:** High (affects core resolution logic)

**Recommended Priority:** Medium (spec explicitly allows deferring this)

---

## 2. Module Relationships Enforcement 🟡

**Spec Reference:** Section 2.3 (lines 377-391)

### Current Status

The `ModuleRelationships` interface is defined with four relationship types:
- `requires` - Required dependencies
- `recommends` - Recommended companions
- `conflictsWith` - Conflicting modules
- `extends` - Module inheritance

However:
- No validation of relationship consistency
- No automatic dependency resolution
- Relationships not rendered in output
- No conflict detection

### Implementation Strategy

**Phase 1: Relationship Validation**

Add validation in `module-validator.ts`:

```typescript
export function validateModuleRelationships(
  module: Module,
  registry: Map<string, Module>
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!module.metadata.relationships) {
    return { valid: true, errors, warnings };
  }

  const { requires, recommends, conflictsWith, extends: extendsId } = module.metadata.relationships;

  // Validate required dependencies exist
  if (requires) {
    for (const requiredId of requires) {
      if (!registry.has(requiredId)) {
        errors.push({
          path: 'metadata.relationships.requires',
          message: `Required module not found: ${requiredId}`,
          section: 'Section 2.3'
        });
      }
    }
  }

  // Validate extends reference
  if (extendsId && !registry.has(extendsId)) {
    errors.push({
      path: 'metadata.relationships.extends',
      message: `Extended module not found: ${extendsId}`,
      section: 'Section 2.3'
    });
  }

  // Warn about recommended modules
  if (recommends) {
    for (const recommendedId of recommends) {
      if (!registry.has(recommendedId)) {
        warnings.push({
          path: 'metadata.relationships.recommends',
          message: `Recommended module not found: ${recommendedId}`
        });
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}
```

**Phase 2: Automatic Dependency Resolution**

Enhance `resolveModules` to include dependencies:

```typescript
export interface ResolutionOptions {
  includeRequires?: boolean;      // Auto-include required dependencies
  includeRecommends?: boolean;    // Auto-include recommended modules
  checkConflicts?: boolean;       // Detect conflicting modules
}

export function resolveModulesWithDependencies(
  persona: Persona,
  registry: Map<string, Module>,
  options: ResolutionOptions = {}
): ResolutionResult {
  const resolved = new Map<string, Module>();
  const queue = extractModuleIds(persona.modules);
  const conflicts: string[] = [];

  while (queue.length > 0) {
    const moduleId = queue.shift()!;
    const module = registry.get(moduleId);

    if (!module) {
      // Error handling
      continue;
    }

    // Check for conflicts
    if (options.checkConflicts && module.metadata.relationships?.conflictsWith) {
      for (const conflictId of module.metadata.relationships.conflictsWith) {
        if (resolved.has(conflictId)) {
          conflicts.push(`${moduleId} conflicts with ${conflictId}`);
        }
      }
    }

    resolved.set(moduleId, module);

    // Add required dependencies
    if (options.includeRequires && module.metadata.relationships?.requires) {
      for (const requiredId of module.metadata.relationships.requires) {
        if (!resolved.has(requiredId) && !queue.includes(requiredId)) {
          queue.push(requiredId);
        }
      }
    }

    // Add recommended modules
    if (options.includeRecommends && module.metadata.relationships?.recommends) {
      for (const recommendedId of module.metadata.relationships.recommends) {
        if (!resolved.has(recommendedId) && !queue.includes(recommendedId)) {
          queue.push(recommendedId);
        }
      }
    }
  }

  return {
    modules: Array.from(resolved.values()),
    conflicts,
    warnings: []
  };
}
```

**Phase 3: Conflict Detection in Build**

Add conflict checking to the build process:

```typescript
// In BuildOrchestrator or build command
export function buildPersonaWithRelationships(
  persona: Persona,
  registry: ModuleRegistry
): BuildResult {
  const options: ResolutionOptions = {
    includeRequires: true,
    includeRecommends: false, // Make configurable
    checkConflicts: true
  };

  const resolution = resolveModulesWithDependencies(persona, registry.getAll(), options);

  if (resolution.conflicts.length > 0) {
    throw new Error(`Module conflicts detected:\n${resolution.conflicts.join('\n')}`);
  }

  // Continue with build...
}
```

**Phase 4: Relationship Rendering**

Add relationship information to markdown output:

```typescript
export function renderModuleWithRelationships(module: Module): string {
  const sections: string[] = [renderModule(module)];

  if (module.metadata.relationships) {
    const { requires, recommends, conflictsWith, extends: extendsId } = module.metadata.relationships;

    sections.push('\n## Module Relationships\n');

    if (requires && requires.length > 0) {
      sections.push('**Required Modules:**');
      sections.push(requires.map(id => `- ${id}`).join('\n'));
    }

    if (recommends && recommends.length > 0) {
      sections.push('\n**Recommended Modules:**');
      sections.push(recommends.map(id => `- ${id}`).join('\n'));
    }

    if (extendsId) {
      sections.push(`\n**Extends:** ${extendsId}`);
    }
  }

  return sections.join('\n');
}
```

**Dependencies:**
- None (pure TypeScript)

**Complexity:** Medium-High

**Recommended Priority:** High (significantly improves module ecosystem)

---

## 3. Problem-Solution Mapping (solves) 🔴

**Spec Reference:** Section 2.3 (lines 364-375)

### Current Status

The `ProblemSolution` interface is defined:
```typescript
interface ProblemSolution {
  problem: string;
  keywords: string[];
}
```

However:
- Not indexed for search
- Not used in module discovery
- Not rendered in output
- No API for problem-based queries

### Implementation Strategy

**Phase 1: Problem Index**

Create a problem-based search index:

```typescript
export interface ProblemIndex {
  [keyword: string]: {
    moduleId: string;
    problem: string;
    relevance: number;
  }[];
}

export function buildProblemIndex(modules: Module[]): ProblemIndex {
  const index: ProblemIndex = {};

  for (const module of modules) {
    const solves = module.metadata.solves;
    if (!solves) continue;

    for (const solution of solves) {
      for (const keyword of solution.keywords) {
        const normalizedKeyword = keyword.toLowerCase();

        if (!index[normalizedKeyword]) {
          index[normalizedKeyword] = [];
        }

        index[normalizedKeyword].push({
          moduleId: module.id,
          problem: solution.problem,
          relevance: 1.0 // Can be enhanced with scoring
        });
      }
    }
  }

  return index;
}
```

**Phase 2: Problem-Based Search**

Implement search by problem:

```typescript
export interface ProblemSearchResult {
  moduleId: string;
  moduleName: string;
  problem: string;
  matchedKeywords: string[];
  relevance: number;
}

export function searchByProblem(
  query: string,
  modules: Module[],
  index: ProblemIndex
): ProblemSearchResult[] {
  const queryTokens = query.toLowerCase().split(/\s+/);
  const resultMap = new Map<string, ProblemSearchResult>();

  for (const token of queryTokens) {
    const matches = index[token] || [];

    for (const match of matches) {
      const existing = resultMap.get(match.moduleId);

      if (existing) {
        existing.matchedKeywords.push(token);
        existing.relevance += match.relevance;
      } else {
        const module = modules.find(m => m.id === match.moduleId);
        if (module) {
          resultMap.set(match.moduleId, {
            moduleId: match.moduleId,
            moduleName: module.metadata.name,
            problem: match.problem,
            matchedKeywords: [token],
            relevance: match.relevance
          });
        }
      }
    }
  }

  return Array.from(resultMap.values())
    .sort((a, b) => b.relevance - a.relevance);
}
```

**Phase 3: CLI Integration**

Add problem search command:

```typescript
// In packages/ums-cli/src/commands/search.ts
program
  .command('search-problem')
  .description('Search modules by problem description')
  .argument('<query>', 'Problem description or keywords')
  .option('--limit <n>', 'Maximum results', '10')
  .action(async (query: string, options) => {
    const sdk = await initSDK();
    const modules = await sdk.discovery.getAllModules();
    const index = buildProblemIndex(modules);
    const results = searchByProblem(query, modules, index);

    console.log(`\nFound ${results.length} modules that solve related problems:\n`);

    for (const result of results.slice(0, parseInt(options.limit))) {
      console.log(`📦 ${result.moduleName} (${result.moduleId})`);
      console.log(`   Problem: ${result.problem}`);
      console.log(`   Matched: ${result.matchedKeywords.join(', ')}`);
      console.log();
    }
  });
```

**Phase 4: Render in Documentation**

Add to markdown renderer:

```typescript
export function renderModuleMetadata(module: Module): string {
  const sections: string[] = [];

  if (module.metadata.solves && module.metadata.solves.length > 0) {
    sections.push('\n## Solves\n');
    sections.push('This module addresses the following problems:\n');

    for (const solution of module.metadata.solves) {
      sections.push(`\n**Problem:** ${solution.problem}`);
      sections.push(`**Keywords:** ${solution.keywords.join(', ')}\n`);
    }
  }

  return sections.join('\n');
}
```

**Dependencies:**
- None

**Complexity:** Medium

**Recommended Priority:** High (improves discoverability significantly)

---

## 4. Quality Metadata Utilization 🟡

**Spec Reference:** Section 2.3 (lines 392-405)

### Current Status

`QualityMetadata` interface is defined:
```typescript
interface QualityMetadata {
  maturity: 'alpha' | 'beta' | 'stable' | 'deprecated';
  confidence: number; // 0.0-1.0
  lastVerified?: string; // ISO 8601
  experimental?: boolean;
}
```

Type exists but:
- No validation of quality metadata
- Not used for filtering or warnings
- Not rendered in build output
- No quality assessment tools

### Implementation Strategy

**Phase 1: Quality Validation**

Add validation in `module-validator.ts`:

```typescript
export function validateQualityMetadata(
  quality: QualityMetadata | undefined
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!quality) {
    return { valid: true, errors, warnings };
  }

  // Validate confidence score
  if (quality.confidence < 0 || quality.confidence > 1) {
    errors.push({
      path: 'metadata.quality.confidence',
      message: `Confidence must be between 0.0 and 1.0, got ${quality.confidence}`,
      section: 'Section 2.3'
    });
  }

  // Validate lastVerified date
  if (quality.lastVerified) {
    const date = new Date(quality.lastVerified);
    if (isNaN(date.getTime())) {
      errors.push({
        path: 'metadata.quality.lastVerified',
        message: `Invalid ISO 8601 date: ${quality.lastVerified}`,
        section: 'Section 2.3'
      });
    }
  }

  // Warn about alpha/beta/experimental modules
  if (quality.maturity === 'alpha' || quality.experimental) {
    warnings.push({
      path: 'metadata.quality',
      message: 'This module is experimental and may change'
    });
  } else if (quality.maturity === 'beta') {
    warnings.push({
      path: 'metadata.quality',
      message: 'This module is in beta and may have breaking changes'
    });
  } else if (quality.maturity === 'deprecated') {
    warnings.push({
      path: 'metadata.quality',
      message: 'This module is deprecated'
    });
  }

  // Warn about low confidence
  if (quality.confidence < 0.5) {
    warnings.push({
      path: 'metadata.quality.confidence',
      message: `Low confidence score: ${quality.confidence}`
    });
  }

  // Warn about stale modules
  if (quality.lastVerified) {
    const verifiedDate = new Date(quality.lastVerified);
    const daysSinceVerification =
      (Date.now() - verifiedDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceVerification > 365) {
      warnings.push({
        path: 'metadata.quality.lastVerified',
        message: `Module hasn't been verified in ${Math.floor(daysSinceVerification)} days`
      });
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}
```

**Phase 2: Quality-Based Filtering**

Add quality filters to module discovery:

```typescript
export interface QualityFilter {
  minMaturity?: 'alpha' | 'beta' | 'stable';
  minConfidence?: number;
  excludeExperimental?: boolean;
  excludeDeprecated?: boolean;
  verifiedWithinDays?: number;
}

export function filterByQuality(
  modules: Module[],
  filter: QualityFilter
): Module[] {
  return modules.filter(module => {
    const quality = module.metadata.quality;
    if (!quality) return true; // No quality metadata = assume stable

    // Check maturity
    if (filter.minMaturity) {
      const maturityOrder = ['alpha', 'beta', 'stable', 'deprecated'];
      const moduleMaturityIndex = maturityOrder.indexOf(quality.maturity);
      const minMaturityIndex = maturityOrder.indexOf(filter.minMaturity);

      if (moduleMaturityIndex < minMaturityIndex) return false;
    }

    // Check confidence
    if (filter.minConfidence && quality.confidence < filter.minConfidence) {
      return false;
    }

    // Check experimental
    if (filter.excludeExperimental && quality.experimental) {
      return false;
    }

    // Check deprecated
    if (filter.excludeDeprecated && quality.maturity === 'deprecated') {
      return false;
    }

    // Check verification date
    if (filter.verifiedWithinDays && quality.lastVerified) {
      const verifiedDate = new Date(quality.lastVerified);
      const daysSince = (Date.now() - verifiedDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSince > filter.verifiedWithinDays) return false;
    }

    return true;
  });
}
```

**Phase 3: Quality Badges in Output**

Add quality indicators to rendered output:

```typescript
export function renderQualityBadge(module: Module): string {
  const quality = module.metadata.quality;
  if (!quality) return '';

  const badges: string[] = [];

  // Maturity badge
  const maturityEmojis = {
    alpha: '🔬',
    beta: '⚠️',
    stable: '✅',
    deprecated: '❌'
  };
  badges.push(`${maturityEmojis[quality.maturity]} ${quality.maturity.toUpperCase()}`);

  // Confidence
  const confidencePercent = Math.round(quality.confidence * 100);
  badges.push(`${confidencePercent}% confidence`);

  // Experimental
  if (quality.experimental) {
    badges.push('🧪 EXPERIMENTAL');
  }

  // Last verified
  if (quality.lastVerified) {
    const verifiedDate = new Date(quality.lastVerified);
    const daysSince = Math.floor((Date.now() - verifiedDate.getTime()) / (1000 * 60 * 60 * 24));
    badges.push(`Verified ${daysSince}d ago`);
  }

  return `\n> ${badges.join(' • ')}\n`;
}
```

**Phase 4: Build-Time Quality Warnings**

Add warnings during build:

```typescript
export function buildWithQualityChecks(
  persona: Persona,
  modules: Module[]
): { markdown: string; warnings: string[] } {
  const warnings: string[] = [];

  for (const module of modules) {
    const quality = module.metadata.quality;
    if (!quality) continue;

    if (quality.experimental) {
      warnings.push(
        `⚠️  ${module.id} is experimental and may change without notice`
      );
    }

    if (quality.confidence < 0.7) {
      warnings.push(
        `⚠️  ${module.id} has low confidence (${quality.confidence})`
      );
    }

    if (quality.maturity === 'alpha') {
      warnings.push(
        `⚠️  ${module.id} is in alpha and may be unstable`
      );
    }
  }

  const markdown = renderMarkdown(persona, modules);
  return { markdown, warnings };
}
```

**Dependencies:**
- None

**Complexity:** Low-Medium

**Recommended Priority:** Medium (improves module reliability)

---

## 5. ProcessStep Enhanced Rendering 🟡

**Spec Reference:** Section 3.1 (lines 453-481)

### Current Status

`ProcessStep` interface is fully defined with validation, conditions, and actions:
```typescript
interface ProcessStep {
  step: string;
  detail?: string;
  validate?: { check: string; severity?: 'error' | 'warning' };
  when?: string;
  do?: string;
}
```

However, only `step` and `detail` are rendered. Fields `validate`, `when`, and `do` are ignored.

### Implementation Strategy

**Enhanced Rendering:**

```typescript
export function renderProcessStep(step: ProcessStep | string, index: number): string {
  if (typeof step === 'string') {
    return `${index + 1}. ${step}`;
  }

  const sections: string[] = [];

  // Main step
  sections.push(`${index + 1}. **${step.step}**`);

  // Detail
  if (step.detail) {
    sections.push(`   ${step.detail}`);
  }

  // Conditional execution
  if (step.when) {
    sections.push(`   *When:* ${step.when}`);
  }

  // Action
  if (step.do) {
    sections.push(`   *Do:* ${step.do}`);
  }

  // Validation check
  if (step.validate) {
    const severityEmoji = step.validate.severity === 'error' ? '❌' : '⚠️';
    sections.push(`   ${severityEmoji} *Validate:* ${step.validate.check}`);
  }

  return sections.join('\n');
}

// Update renderInstructionComponent
export function renderInstructionComponent(component: InstructionComponent): string {
  const sections: string[] = [];
  const { instruction } = component;

  // ... purpose rendering ...

  // Enhanced process rendering
  if (instruction.process && instruction.process.length > 0) {
    sections.push('## Process\n');
    const steps = instruction.process.map((step, index) =>
      renderProcessStep(step, index)
    );
    sections.push(steps.join('\n\n') + '\n');
  }

  // ... rest of rendering ...
}
```

**Example Output:**

```markdown
## Process

1. **Identify resources (nouns, not verbs)**
   Resources should be things, not actions. Use plural nouns.
   ❌ *Validate:* Endpoint URLs contain nouns only

2. **Map HTTP methods to CRUD operations**
   *When:* Designing RESTful endpoints
   *Do:* Use GET for read, POST for create, PUT for update, DELETE for delete
```

**Dependencies:**
- None

**Complexity:** Low

**Recommended Priority:** High (quick win, improves clarity)

---

## 6. Constraint Enhanced Rendering 🟡

**Spec Reference:** Section 3.2 (lines 483-510)

### Current Status

`Constraint` interface includes severity, conditions, examples, and rationale:
```typescript
interface Constraint {
  rule: string;
  severity?: 'error' | 'warning' | 'info';
  when?: string;
  examples?: { valid?: string[]; invalid?: string[] };
  rationale?: string;
}
```

Only `rule` is currently rendered.

### Implementation Strategy

**Enhanced Rendering:**

```typescript
export function renderConstraint(constraint: Constraint | string): string {
  if (typeof constraint === 'string') {
    return `- ${constraint}`;
  }

  const sections: string[] = [];

  // Severity indicator
  const severityEmojis = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  const emoji = constraint.severity ? severityEmojis[constraint.severity] : '•';

  // Main rule
  sections.push(`${emoji} **${constraint.rule}**`);

  // Conditional application
  if (constraint.when) {
    sections.push(`  *Applies when:* ${constraint.when}`);
  }

  // Rationale
  if (constraint.rationale) {
    sections.push(`  *Why:* ${constraint.rationale}`);
  }

  // Examples
  if (constraint.examples) {
    if (constraint.examples.valid && constraint.examples.valid.length > 0) {
      sections.push(`  *Valid:*`);
      constraint.examples.valid.forEach(ex => {
        sections.push(`    ✓ \`${ex}\``);
      });
    }

    if (constraint.examples.invalid && constraint.examples.invalid.length > 0) {
      sections.push(`  *Invalid:*`);
      constraint.examples.invalid.forEach(ex => {
        sections.push(`    ✗ \`${ex}\``);
      });
    }
  }

  return sections.join('\n');
}

// Update renderInstructionComponent
export function renderInstructionComponent(component: InstructionComponent): string {
  // ... previous code ...

  // Enhanced constraints rendering
  if (instruction.constraints && instruction.constraints.length > 0) {
    sections.push('## Constraints\n');
    const constraints = instruction.constraints.map(c => renderConstraint(c));
    sections.push(constraints.join('\n\n') + '\n');
  }

  // ... rest of rendering ...
}
```

**Example Output:**

```markdown
## Constraints

❌ **URLs MUST use plural nouns for collections**
  *Why:* Consistency and REST conventions
  *Valid:*
    ✓ `/users`
    ✓ `/users/123`
  *Invalid:*
    ✗ `/user`
    ✗ `/getUser`

⚠️ **Use versioning for public APIs**
  *Applies when:* API is exposed to external clients
  *Valid:*
    ✓ `/v1/users`
    ✓ `/api/v2/orders`
```

**Dependencies:**
- None

**Complexity:** Low

**Recommended Priority:** High (quick win, significantly improves documentation quality)

---

## 7. Criterion Enhanced Rendering ✅

**Spec Reference:** UMS v2.1 Section 3.3, Section 6.3.3

**Status:** IMPLEMENTED (v2.1)

### Implementation Details

**What was implemented:**

Following the same simplification pattern as ProcessStep (ADR 0005) and Constraint (ADR 0006), Criterion was simplified in UMS v2.1:

```typescript
// UMS v2.1 - Simplified structure
type Criterion = string | {
  item: string;
  category?: string;  // Rendered as subheadings
  notes?: string[];   // Test instructions, expected results, verification
};
```

**Key changes:**
- ❌ Removed `severity` field (use RFC 2119 keywords: MUST/SHOULD/MAY in criterion text)
- ✅ Kept `category` field and implemented rendering as `### Category` subheadings
- ✅ Added `notes` array for test elaboration
- ✅ Implemented category grouping (uncategorized first, then categories)
- ✅ Bold criteria with notes, render notes as bulleted sub-items with 2-space indent

**Implementation:**

```typescript
export function renderCriteria(criteria: Criterion[]): string {
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
    sections.push(uncategorized.map(renderCriterionItem).join('\n\n'));
  }

  // 3. Render categorized groups with subheadings
  for (const [category, items] of categorized.entries()) {
    sections.push(`### ${category}\n`);
    sections.push(items.map(renderCriterionItem).join('\n\n'));
  }

  return sections.join('\n\n');
}

export function renderCriterionItem(criterion: Criterion): string {
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

**Example Output:**

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

**Specification:**
- Complete rendering specification added to UMS v2.1 spec Section 6.3.3
- Includes algorithm, format rules, edge cases, validation recommendations
- See ADR 0007 for full rationale

**Commit:** b774ef9 (implementation), c1b6021 (RFC accepted), 5f401bb (spec updates)

**Related:**
- ADR 0005: ProcessStep Simplification
- ADR 0006: Constraint Simplification
- ADR 0007: Criterion Simplification
- RFC: `docs/spec/proposals/rfc-criterion-simplification.md` (ACCEPTED)

---

## 8. Component Metadata Rendering 🔴

**Spec Reference:** Section 2.4 (lines 423-448)

### Current Status

`ComponentMetadata` is defined but never rendered:
```typescript
interface ComponentMetadata {
  purpose?: string;
  context?: string[];
}
```

### Implementation Strategy

**Add Metadata Rendering:**

```typescript
export function renderComponentMetadata(metadata?: ComponentMetadata): string {
  if (!metadata) return '';

  const sections: string[] = [];

  if (metadata.purpose) {
    sections.push(`> **Purpose:** ${metadata.purpose}\n`);
  }

  if (metadata.context && metadata.context.length > 0) {
    sections.push(`> **Context:** ${metadata.context.join(', ')}\n`);
  }

  return sections.join('\n');
}

// Update component renderers
export function renderInstructionComponent(component: InstructionComponent): string {
  const sections: string[] = [];

  // Add metadata at the top
  sections.push(renderComponentMetadata(component.metadata));

  // ... rest of rendering ...
}
```

**Example Output:**

```markdown
## Instructions

> **Purpose:** Core TDD workflow
> **Context:** unit-testing, development

**Purpose**: Apply TDD methodology rigorously
...
```

**Dependencies:**
- None

**Complexity:** Low

**Recommended Priority:** Low (nice-to-have enhancement)

---

## 9. Concept Tradeoffs Rendering 🟡

**Spec Reference:** Section 3.4 (lines 537-563)

### Current Status

`Concept` interface includes `tradeoffs` field but it's not rendered:
```typescript
interface Concept {
  name: string;
  description: string;
  rationale?: string;
  examples?: string[];
  tradeoffs?: string[]; // Not rendered
}
```

### Implementation Strategy

**Enhanced Concept Rendering:**

```typescript
export function renderConcept(concept: Concept): string {
  const sections: string[] = [];

  sections.push(`### ${concept.name}\n`);
  sections.push(`${concept.description}\n`);

  if (concept.rationale) {
    sections.push(`**Rationale:** ${concept.rationale}\n`);
  }

  // Add tradeoffs section
  if (concept.tradeoffs && concept.tradeoffs.length > 0) {
    sections.push('**Trade-offs:**\n');
    for (const tradeoff of concept.tradeoffs) {
      sections.push(`- ${tradeoff}`);
    }
    sections.push('');
  }

  if (concept.examples && concept.examples.length > 0) {
    sections.push('**Examples:**\n');
    for (const example of concept.examples) {
      sections.push(`- ${example}`);
    }
    sections.push('');
  }

  return sections.join('\n');
}
```

**Example Output:**

```markdown
### Resource-Based URLs

URLs represent resources (things), not actions

**Rationale:** Resources are stable; operations change

**Trade-offs:**
- Requires careful design of resource hierarchy
- May need nested routes for related resources
- Can become complex with many relationships

**Examples:**
- ✓ GET /users/123 (resource: user)
- ✗ GET /getUser?id=123 (action: get)
```

**Dependencies:**
- None

**Complexity:** Low

**Recommended Priority:** Medium (improves conceptual understanding)

---

## 10. Build Report Composition Events 🟡

**Spec Reference:** Section 7.3 (lines 580-594)

### Current Status

`CompositionEvent` type is defined for tracking module replacements:
```typescript
interface CompositionEvent {
  id: string;
  version: string;
  source: string;
  digest: string;
  strategy: 'base' | 'replace';
}
```

The `BuildReportModule` includes optional `composedFrom` field, but it's never populated.

### Implementation Strategy

**Phase 1: Track Composition During Resolution**

Enhance module resolution to track composition events:

```typescript
export interface ModuleResolutionContext {
  module: Module;
  source: ModuleSource;
  compositionHistory: CompositionEvent[];
}

export function resolveWithComposition(
  moduleId: string,
  registry: ModuleRegistry
): ModuleResolutionContext {
  const resolutionStack: CompositionEvent[] = [];

  // Check for replacements
  const allEntries = registry.getAllVersions(moduleId);

  if (allEntries.length > 1) {
    // Module was replaced
    for (let i = 0; i < allEntries.length; i++) {
      const entry = allEntries[i];
      resolutionStack.push({
        id: entry.module.id,
        version: entry.module.version,
        source: entry.source.path,
        digest: computeDigest(entry.module),
        strategy: i === 0 ? 'base' : 'replace'
      });
    }
  }

  const finalEntry = allEntries[allEntries.length - 1];

  return {
    module: finalEntry.module,
    source: finalEntry.source,
    compositionHistory: resolutionStack
  };
}
```

**Phase 2: Include in Build Report**

Update report generator:

```typescript
export function generateBuildReport(
  persona: Persona,
  resolutionContexts: ModuleResolutionContext[]
): BuildReport {
  const moduleGroups: BuildReportGroup[] = [];

  // Group modules according to persona structure
  let contextIndex = 0;
  for (const entry of persona.modules) {
    // ... grouping logic ...

    const modules: BuildReportModule[] = [];
    // Process each module in group
    for (const moduleId of moduleIds) {
      const context = resolutionContexts[contextIndex++];

      const reportModule: BuildReportModule = {
        id: context.module.id,
        name: context.module.metadata.name,
        version: context.module.version,
        source: context.source.path,
        digest: computeDigest(context.module),
        deprecated: context.module.metadata.deprecated ?? false,
      };

      // Include composition history if present
      if (context.compositionHistory.length > 0) {
        reportModule.composedFrom = context.compositionHistory;
      }

      if (context.module.metadata.replacedBy) {
        reportModule.replacedBy = context.module.metadata.replacedBy;
      }

      modules.push(reportModule);
    }

    moduleGroups.push({ groupName, modules });
  }

  return {
    personaName: persona.name,
    schemaVersion: '2.0',
    toolVersion: getToolVersion(),
    personaDigest: computePersonaDigest(persona),
    buildTimestamp: new Date().toISOString(),
    moduleGroups
  };
}
```

**Phase 3: Render Composition History**

Add composition visualization:

```typescript
export function renderCompositionHistory(
  reportModule: BuildReportModule
): string {
  if (!reportModule.composedFrom || reportModule.composedFrom.length === 0) {
    return '';
  }

  const sections: string[] = ['\n**Composition History:**\n'];

  for (const event of reportModule.composedFrom) {
    const strategyLabel = event.strategy === 'base' ? '📦' : '🔄';
    sections.push(`${strategyLabel} ${event.id}@${event.version} from ${event.source}`);
  }

  return sections.join('\n') + '\n';
}
```

**Dependencies:**
- Digest computation (SHA-256)
- Enhanced registry to track versions

**Complexity:** Medium

**Recommended Priority:** Low (useful for debugging and audit trails)

---

## 11. Federation & Remote Registries 🔴

**Spec Reference:** Section 8 (line 934)

### Current Status

Completely unimplemented. Current implementation only supports local modules loaded from file system.

### Implementation Strategy

**Phase 1: Registry Protocol**

Define registry API specification:

```typescript
export interface RemoteRegistry {
  name: string;
  url: string;
  apiVersion: string;
}

export interface RegistryClient {
  fetchModule(id: string, version?: string): Promise<Module>;
  listModules(filter?: ModuleFilter): Promise<ModuleMetadata[]>;
  searchModules(query: string): Promise<SearchResult[]>;
  getModuleVersions(id: string): Promise<string[]>;
}

export interface ModuleFilter {
  capabilities?: string[];
  domain?: string[];
  cognitiveLevel?: CognitiveLevel[];
  maturity?: QualityMetadata['maturity'][];
}
```

**Phase 2: HTTP Registry Client**

Implement HTTP client:

```typescript
export class HTTPRegistryClient implements RegistryClient {
  constructor(private baseUrl: string) {}

  async fetchModule(id: string, version?: string): Promise<Module> {
    const url = version
      ? `${this.baseUrl}/modules/${id}@${version}`
      : `${this.baseUrl}/modules/${id}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch module ${id}: ${response.statusText}`);
    }

    return await response.json();
  }

  async listModules(filter?: ModuleFilter): Promise<ModuleMetadata[]> {
    const params = new URLSearchParams();
    if (filter?.capabilities) {
      params.set('capabilities', filter.capabilities.join(','));
    }
    // ... other filters ...

    const response = await fetch(`${this.baseUrl}/modules?${params}`);
    return await response.json();
  }

  async searchModules(query: string): Promise<SearchResult[]> {
    const response = await fetch(
      `${this.baseUrl}/search?q=${encodeURIComponent(query)}`
    );
    return await response.json();
  }

  async getModuleVersions(id: string): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/modules/${id}/versions`);
    return await response.json();
  }
}
```

**Phase 3: Multi-Registry Support**

Enhance configuration:

```yaml
# modules.config.yml
localModulePaths:
  - path: './company-standards'
    onConflict: 'error'

remoteRegistries:
  - name: 'ums-community'
    url: 'https://registry.ums.dev'
    priority: 1
    cache:
      enabled: true
      ttl: 3600

  - name: 'company-internal'
    url: 'https://modules.company.com'
    priority: 10 # Higher priority
    auth:
      type: 'bearer'
      token: '${COMPANY_REGISTRY_TOKEN}'
```

**Phase 4: Federated Resolution**

Implement multi-source resolution:

```typescript
export class FederatedModuleRegistry {
  private local: ModuleRegistry;
  private remotes: Map<string, RegistryClient>;
  private cache: Map<string, Module>;

  async resolve(
    moduleId: string,
    version?: string
  ): Promise<Module | undefined> {
    // 1. Check local first
    const localModule = this.local.get(moduleId);
    if (localModule) return localModule;

    // 2. Check cache
    const cacheKey = version ? `${moduleId}@${version}` : moduleId;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // 3. Query remote registries by priority
    const sortedRemotes = Array.from(this.remotes.entries())
      .sort((a, b) => b[1].priority - a[1].priority);

    for (const [name, client] of sortedRemotes) {
      try {
        const module = await client.fetchModule(moduleId, version);

        // Validate fetched module
        const validation = validateModule(module);
        if (!validation.valid) {
          console.warn(`Invalid module from ${name}: ${validation.errors}`);
          continue;
        }

        // Cache and return
        this.cache.set(cacheKey, module);
        return module;
      } catch (error) {
        console.warn(`Failed to fetch from ${name}: ${error}`);
        // Try next registry
      }
    }

    return undefined;
  }
}
```

**Phase 5: Registry Server Implementation**

Simple registry server for organizations:

```typescript
// packages/ums-registry-server/src/index.ts
import express from 'express';
import { ModuleRegistry } from 'ums-lib';

export class RegistryServer {
  private app = express();
  private registry: ModuleRegistry;

  constructor(registry: ModuleRegistry) {
    this.registry = registry;
    this.setupRoutes();
  }

  private setupRoutes() {
    // List modules
    this.app.get('/modules', (req, res) => {
      const modules = this.registry.getAll();
      res.json(modules.map(m => m.metadata));
    });

    // Get module by ID
    this.app.get('/modules/:id', (req, res) => {
      const module = this.registry.get(req.params.id);
      if (!module) {
        return res.status(404).json({ error: 'Module not found' });
      }
      res.json(module);
    });

    // Get module versions
    this.app.get('/modules/:id/versions', (req, res) => {
      const versions = this.registry.getVersions(req.params.id);
      res.json(versions);
    });

    // Search
    this.app.get('/search', (req, res) => {
      const query = req.query.q as string;
      const results = this.registry.search(query);
      res.json(results);
    });
  }

  listen(port: number) {
    this.app.listen(port, () => {
      console.log(`Registry server listening on port ${port}`);
    });
  }
}
```

**Dependencies:**
- HTTP client (node-fetch or built-in fetch)
- Authentication support
- Caching layer
- Network error handling

**Complexity:** Very High

**Recommended Priority:** Low (significant infrastructure requirement, defer to v2.1+)

---

## 12. Advanced Composition (import & bindings) 🔴

**Spec Reference:** Section 8 (lines 936-937)

### Current Status

Not implemented. Current composition is purely declarative via module ID lists.

### Proposed Design

**`import` Directive:**

Allow direct module content inclusion:

```typescript
// persona.persona.ts
export default {
  id: 'backend-engineer',
  name: 'Backend Engineer',
  // ...

  imports: [
    { from: 'foundation/ethics/do-no-harm' },
    { from: 'principle/testing/tdd', as: 'testingPrinciples' },
    { from: 'technology/typescript/error-handling', components: ['instruction'] }
  ],

  modules: [
    // Regular module references
  ]
} satisfies Persona;
```

**`bindings` Block:**

Allow dynamic module selection:

```typescript
export default {
  id: 'language-agnostic-dev',
  name: 'Language Agnostic Developer',
  // ...

  bindings: {
    language: {
      type: 'select',
      options: ['typescript', 'python', 'rust', 'go'],
      modules: {
        typescript: ['technology/typescript/best-practices'],
        python: ['technology/python/best-practices'],
        rust: ['technology/rust/best-practices'],
        go: ['technology/go/best-practices']
      }
    }
  },

  modules: [
    'foundation/ethics/do-no-harm',
    '${bindings.language}' // Dynamic reference
  ]
} satisfies Persona;
```

**Implementation would require:**
- Template evaluation engine
- Binding resolution logic
- Build-time vs runtime evaluation strategy
- Type safety for dynamic references

**Complexity:** Very High

**Recommended Priority:** Very Low (significant design and complexity, defer to v2.2+)

---

## Summary & Prioritization

### High Priority (Quick Wins)
1. ✅ **ProcessStep Enhanced Rendering** (Section 5) - Low complexity, high value
2. ✅ **Constraint Enhanced Rendering** (Section 6) - Low complexity, high value
3. ✅ **Module Relationships Enforcement** (Section 2) - Medium complexity, high ecosystem value

### Medium Priority (Significant Value)
4. ✅ **Problem-Solution Mapping** (Section 3) - Medium complexity, improves discoverability
5. ✅ **Quality Metadata Utilization** (Section 4) - Medium complexity, improves reliability
6. ✅ **Criterion Enhanced Rendering** (Section 7) - Low complexity, improves clarity
7. ✅ **Concept Tradeoffs Rendering** (Section 9) - Low complexity, improves understanding

### Low Priority (Nice-to-Have)
8. ✅ **Component Metadata Rendering** (Section 8) - Low complexity, minor value
9. ✅ **Build Report Composition Events** (Section 10) - Medium complexity, debugging value
10. ✅ **Module Version Resolution** (Section 1) - High complexity, spec allows deferring

### Very Low Priority (Future Versions)
11. 🔮 **Federation & Remote Registries** (Section 11) - Very high complexity, defer to v2.1+
12. 🔮 **Advanced Composition** (Section 12) - Very high complexity, defer to v2.2+

---

## Implementation Roadmap

### Phase 1: Quick Wins ✅ COMPLETED
- ✅ Enhanced rendering for ProcessStep (ADR 0005, v2.1)
- ✅ Enhanced rendering for Constraint (ADR 0006, v2.1)
- ✅ Enhanced rendering for Criterion (ADR 0007, v2.1)
- ⏸️ Enhanced rendering for Concept (pending)
- ⏸️ Component metadata rendering (pending)
- ✅ Immediate documentation quality improvement achieved

### Phase 2: Discoverability (2-3 weeks)
- Problem-solution mapping and search
- Quality metadata validation and filtering
- Improved module discovery

### Phase 3: Ecosystem (3-4 weeks)
- Module relationships enforcement
- Dependency resolution
- Conflict detection
- Relationship-based validation

### Phase 4: Advanced Features (4-6 weeks)
- Module version resolution
- Multi-version registry support
- Build report composition events

### Phase 5: Federation (Future)
- Remote registry protocol
- HTTP registry client
- Registry server implementation
- Caching and authentication

### Phase 6: Advanced Composition (Future)
- Template evaluation
- Dynamic bindings
- Runtime composition

---

## Testing Strategy

For each implementation:

1. **Unit Tests**: Test individual functions in isolation
2. **Integration Tests**: Test end-to-end workflows
3. **Validation Tests**: Ensure spec compliance
4. **Regression Tests**: Verify existing functionality unchanged
5. **Example Modules**: Create modules using new features

---

## Documentation Requirements

For each implementation:

1. Update specification (if behavior differs)
2. Update type documentation
3. Add usage examples
4. Update CLI documentation
5. Add migration guide (if breaking)

---

## Backward Compatibility

All implementations should maintain backward compatibility:

- New fields are optional
- Existing modules continue to work
- Personas without new features render identically
- Validation only warns on missing optional fields

---

## Conclusion

This report identifies 12 major areas of unimplemented or partially implemented functionality from the UMS v2.0 specification. The recommended approach is to:

1. **Start with quick wins** (Phases 1-2) to improve immediate documentation quality and discoverability
2. **Build ecosystem features** (Phase 3) to enable better module composition
3. **Add advanced features** (Phase 4) when version management becomes critical
4. **Defer complex features** (Phases 5-6) to future major versions

The phased approach allows incremental value delivery while maintaining stability and backward compatibility.
