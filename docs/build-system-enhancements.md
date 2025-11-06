# UMS v2.1 Build System Enhancements

## Executive Summary

This document identifies UMS v2.1 specification features that should be implemented in the **build system and tooling** rather than just rendered to markdown. These features affect module resolution, validation, discovery, and composition during the build process.

**Key Insight:** Many spec properties are currently treated as "documentation metadata" but should actively influence build behavior, module selection, and validation.

---

## Table of Contents

- [1. Module Relationship Resolution](#1-module-relationship-resolution)
- [2. Quality-Based Build Validation](#2-quality-based-build-validation)
- [3. Problem-Solution Discovery System](#3-problem-solution-discovery-system)
- [4. Module Version Resolution](#4-module-version-resolution)
- [5. Build Composition Tracking](#5-build-composition-tracking)
- [6. Federation & Remote Registries](#6-federation--remote-registries)
- [7. Advanced Composition System](#7-advanced-composition-system)
- [Implementation Roadmap](#implementation-roadmap)
- [CLI Integration](#cli-integration)

---

## 1. Module Relationship Resolution

**Spec Reference:** Section 2.3 (lines 377-391)

**Current State:** Relationships defined but ignored during build

**Build System Integration:**

### Automatic Dependency Inclusion

When building a persona, automatically include required dependencies:

```typescript
// Enhanced build options
interface BuildOptions {
  includeRequiredDeps?: boolean;      // Auto-include `requires`
  includeRecommendedDeps?: boolean;   // Auto-include `recommends`
  checkConflicts?: boolean;           // Detect `conflictsWith`
  resolveExtends?: boolean;           // Follow `extends` chain
}

// Build orchestrator
export class BuildOrchestrator {
  async buildPersona(
    persona: Persona,
    options: BuildOptions = {}
  ): Promise<BuildResult> {
    // 1. Extract base module IDs from persona
    const baseModuleIds = extractModuleIds(persona.modules);

    // 2. Resolve with dependency expansion
    const resolution = await this.resolveWithDependencies(
      baseModuleIds,
      options
    );

    // 3. Check for conflicts
    if (options.checkConflicts && resolution.conflicts.length > 0) {
      throw new BuildError(
        `Module conflicts detected:\n${resolution.conflicts.join('\n')}`
      );
    }

    // 4. Build with expanded module set
    const modules = resolution.modules; // Includes auto-added deps
    const markdown = await this.renderMarkdown(persona, modules);

    return {
      markdown,
      modules,
      dependencies: resolution.addedDependencies,
      conflicts: resolution.conflicts,
      warnings: resolution.warnings
    };
  }

  private async resolveWithDependencies(
    moduleIds: string[],
    options: BuildOptions
  ): Promise<ResolutionResult> {
    const resolved = new Map<string, Module>();
    const queue = [...moduleIds];
    const conflicts: ConflictInfo[] = [];
    const addedDependencies: string[] = [];

    while (queue.length > 0) {
      const moduleId = queue.shift()!;
      const module = await this.registry.get(moduleId);

      if (!module) {
        throw new BuildError(`Module not found: ${moduleId}`);
      }

      // Check for conflicts before adding
      if (options.checkConflicts && module.metadata.relationships?.conflictsWith) {
        for (const conflictId of module.metadata.relationships.conflictsWith) {
          if (resolved.has(conflictId)) {
            conflicts.push({
              moduleA: moduleId,
              moduleB: conflictId,
              reason: 'Explicit conflict declaration'
            });
          }
        }
      }

      // Add to resolved set
      resolved.set(moduleId, module);

      // Auto-include required dependencies
      if (options.includeRequiredDeps && module.metadata.relationships?.requires) {
        for (const requiredId of module.metadata.relationships.requires) {
          if (!resolved.has(requiredId) && !queue.includes(requiredId)) {
            queue.push(requiredId);
            addedDependencies.push(requiredId);
          }
        }
      }

      // Auto-include recommended modules (optional)
      if (options.includeRecommendedDeps && module.metadata.relationships?.recommends) {
        for (const recommendedId of module.metadata.relationships.recommends) {
          if (!resolved.has(recommendedId) && !queue.includes(recommendedId)) {
            queue.push(recommendedId);
            addedDependencies.push(recommendedId);
          }
        }
      }

      // Follow extends chain
      if (options.resolveExtends && module.metadata.relationships?.extends) {
        const extendsId = module.metadata.relationships.extends;
        if (!resolved.has(extendsId) && !queue.includes(extendsId)) {
          queue.push(extendsId);
          addedDependencies.push(extendsId);
        }
      }
    }

    return {
      modules: Array.from(resolved.values()),
      addedDependencies,
      conflicts,
      warnings: []
    };
  }
}
```

### CLI Integration

```bash
# Build with automatic dependency inclusion
copilot-instructions build --persona dev.persona.ts \
  --include-deps \
  --check-conflicts

# Build output shows what was auto-included
✓ Loaded 8 base modules
✓ Added 3 required dependencies:
  - foundation/ethics/do-no-harm (required by principle/testing/tdd)
  - principle/solid/single-responsibility (required by technology/typescript/classes)
  - foundation/logic/deductive-reasoning (required by principle/testing/tdd)
✓ Build completed successfully

# Validate relationships
copilot-instructions validate --check-relationships \
  --check-conflicts
```

### Configuration

```yaml
# modules.config.yml
build:
  relationships:
    autoIncludeRequired: true     # Always include required deps
    autoIncludeRecommended: false # Don't auto-include recommended
    failOnConflicts: true         # Fail build if conflicts detected
    resolveExtends: true          # Follow extends chain
```

**Complexity:** Medium-High
**Priority:** High (significantly improves module ecosystem)
**Dependencies:** None (pure TypeScript)

---

## 2. Quality-Based Build Validation

**Spec Reference:** Section 2.3 (lines 392-405)

**Current State:** Quality metadata defined but not used during build

**Build System Integration:**

### Quality Filters During Build

```typescript
interface BuildQualityOptions {
  minMaturity?: 'alpha' | 'beta' | 'stable';
  minConfidence?: number;           // 0.0-1.0
  excludeExperimental?: boolean;
  excludeDeprecated?: boolean;
  failOnLowQuality?: boolean;       // Fail vs warn
  maxStaleDays?: number;            // Max days since lastVerified
}

export class BuildOrchestrator {
  async buildPersona(
    persona: Persona,
    buildOptions: BuildOptions,
    qualityOptions: BuildQualityOptions = {}
  ): Promise<BuildResult> {
    // Resolve modules
    const modules = await this.resolveModules(persona);

    // Filter by quality
    const qualityCheck = this.checkQuality(modules, qualityOptions);

    if (qualityCheck.failed.length > 0 && qualityOptions.failOnLowQuality) {
      throw new BuildError(
        `Quality requirements not met:\n${qualityCheck.failed.join('\n')}`
      );
    }

    // Filter out excluded modules
    const filteredModules = modules.filter(m =>
      !qualityCheck.excluded.includes(m.id)
    );

    return {
      markdown: await this.renderMarkdown(persona, filteredModules),
      modules: filteredModules,
      qualityWarnings: qualityCheck.warnings,
      excludedModules: qualityCheck.excluded
    };
  }

  private checkQuality(
    modules: Module[],
    options: BuildQualityOptions
  ): QualityCheckResult {
    const warnings: string[] = [];
    const failed: string[] = [];
    const excluded: string[] = [];

    for (const module of modules) {
      const quality = module.metadata.quality;

      // No quality metadata = assume stable
      if (!quality) continue;

      // Check maturity level
      if (options.minMaturity) {
        const maturityOrder: QualityMaturity[] = ['alpha', 'beta', 'stable', 'deprecated'];
        const moduleIndex = maturityOrder.indexOf(quality.maturity);
        const minIndex = maturityOrder.indexOf(options.minMaturity);

        if (moduleIndex < minIndex) {
          const msg = `${module.id}: maturity '${quality.maturity}' below required '${options.minMaturity}'`;
          if (options.failOnLowQuality) {
            failed.push(msg);
          } else {
            warnings.push(msg);
          }
        }
      }

      // Check confidence score
      if (options.minConfidence && quality.confidence < options.minConfidence) {
        const msg = `${module.id}: confidence ${quality.confidence} below required ${options.minConfidence}`;
        if (options.failOnLowQuality) {
          failed.push(msg);
        } else {
          warnings.push(msg);
        }
      }

      // Exclude experimental
      if (options.excludeExperimental && quality.experimental) {
        excluded.push(module.id);
        warnings.push(`${module.id}: excluded (experimental)`);
      }

      // Exclude deprecated
      if (options.excludeDeprecated && quality.maturity === 'deprecated') {
        excluded.push(module.id);
        warnings.push(`${module.id}: excluded (deprecated)`);
      }

      // Check staleness
      if (options.maxStaleDays && quality.lastVerified) {
        const verifiedDate = new Date(quality.lastVerified);
        const daysSince = (Date.now() - verifiedDate.getTime()) / (1000 * 60 * 60 * 24);

        if (daysSince > options.maxStaleDays) {
          warnings.push(
            `${module.id}: not verified in ${Math.floor(daysSince)} days`
          );
        }
      }
    }

    return { warnings, failed, excluded };
  }
}
```

### CLI Integration

```bash
# Build with quality requirements
copilot-instructions build --persona dev.persona.ts \
  --min-maturity stable \
  --min-confidence 0.8 \
  --exclude-experimental

# List modules filtered by quality
copilot-instructions list \
  --min-maturity beta \
  --min-confidence 0.7

# Search with quality filter
copilot-instructions search "error handling" \
  --min-maturity stable \
  --exclude-deprecated
```

### Configuration

```yaml
# modules.config.yml
build:
  quality:
    minMaturity: stable           # Require stable by default
    minConfidence: 0.7            # Minimum 70% confidence
    excludeExperimental: true     # Don't include experimental
    excludeDeprecated: true       # Don't include deprecated
    failOnLowQuality: false       # Warn instead of fail
    maxStaleDays: 365             # Warn if not verified in 1 year
```

**Complexity:** Low-Medium
**Priority:** High (critical for production reliability)
**Dependencies:** None

---

## 3. Problem-Solution Discovery System

**Spec Reference:** Section 2.3 (lines 364-375)

**Current State:** `solves` field defined but not indexed or searchable

**Build System Integration:**

### Problem Index Builder

```typescript
export class ProblemIndexBuilder {
  buildIndex(modules: Module[]): ProblemIndex {
    const index: ProblemIndex = {
      byKeyword: new Map(),
      byProblem: new Map(),
      byModule: new Map()
    };

    for (const module of modules) {
      if (!module.metadata.solves) continue;

      for (const solution of module.metadata.solves) {
        // Index by keywords
        for (const keyword of solution.keywords) {
          const normalized = keyword.toLowerCase().trim();

          if (!index.byKeyword.has(normalized)) {
            index.byKeyword.set(normalized, []);
          }

          index.byKeyword.get(normalized)!.push({
            moduleId: module.id,
            moduleName: module.metadata.name,
            problem: solution.problem,
            tier: this.getTier(module.id),
            capabilities: module.capabilities
          });
        }

        // Index by problem text
        const problemKey = solution.problem.toLowerCase();
        if (!index.byProblem.has(problemKey)) {
          index.byProblem.set(problemKey, []);
        }
        index.byProblem.get(problemKey)!.push(module.id);

        // Index by module
        if (!index.byModule.has(module.id)) {
          index.byModule.set(module.id, []);
        }
        index.byModule.get(module.id)!.push(solution);
      }
    }

    return index;
  }

  private getTier(moduleId: string): string {
    const parts = moduleId.split('/');
    return parts[0]; // foundation, principle, technology, execution
  }
}

export class ProblemSearchEngine {
  constructor(private index: ProblemIndex) {}

  search(query: string, options: SearchOptions = {}): SearchResult[] {
    const tokens = query.toLowerCase().split(/\s+/);
    const resultMap = new Map<string, SearchResult>();

    for (const token of tokens) {
      const matches = this.index.byKeyword.get(token) || [];

      for (const match of matches) {
        const existing = resultMap.get(match.moduleId);

        if (existing) {
          existing.matchedKeywords.push(token);
          existing.relevance += 1;
        } else {
          resultMap.set(match.moduleId, {
            moduleId: match.moduleId,
            moduleName: match.moduleName,
            problem: match.problem,
            tier: match.tier,
            capabilities: match.capabilities,
            matchedKeywords: [token],
            relevance: 1
          });
        }
      }
    }

    let results = Array.from(resultMap.values());

    // Apply filters
    if (options.tier) {
      results = results.filter(r => r.tier === options.tier);
    }

    if (options.minRelevance) {
      results = results.filter(r => r.relevance >= options.minRelevance);
    }

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    return results;
  }

  suggestModules(problems: string[]): ModuleSuggestion[] {
    const suggestions: ModuleSuggestion[] = [];

    for (const problem of problems) {
      const results = this.search(problem);

      if (results.length > 0) {
        suggestions.push({
          problem,
          suggestedModules: results.slice(0, 3), // Top 3
          confidence: results[0].relevance / problem.split(/\s+/).length
        });
      }
    }

    return suggestions;
  }
}
```

### CLI Integration

```bash
# Search modules by problem
copilot-instructions search-problem "race conditions in async code"

Found 4 modules that solve related problems:

📦 Python Async Best Practices (technology/python/async-programming)
   Problem: Race conditions in concurrent Python code
   Matched: race, conditions, async
   Relevance: ★★★★☆

📦 JavaScript Concurrency Patterns (technology/javascript/concurrency)
   Problem: Managing concurrent operations and race conditions
   Matched: race, conditions, concurrent
   Relevance: ★★★☆☆

# Build persona with problem-based suggestions
copilot-instructions build --persona dev.persona.ts \
  --suggest-for-problems \
  --interactive

Building persona...
✓ Loaded 10 modules

Suggestions based on common problems:
  ? Add 'technology/typescript/error-handling' to solve "error propagation"? (Y/n)
  ? Add 'principle/testing/test-doubles' to solve "mocking dependencies"? (Y/n)

# Discover modules that solve specific problem
copilot-instructions discover --solves "error handling" --tier technology
```

### SDK API

```typescript
import { searchByProblem, suggestModules } from 'ums-sdk';

// Search by problem
const results = await searchByProblem('handling API errors', {
  tier: 'technology',
  minRelevance: 2
});

// Get suggestions for persona building
const suggestions = await suggestModules([
  'error handling',
  'async patterns',
  'testing strategies'
]);
```

**Complexity:** Medium
**Priority:** High (dramatically improves module discoverability)
**Dependencies:** None

---

## 4. Module Version Resolution

**Spec Reference:** Section 2.1 (lines 66-71), Section 8 (line 933)

**Current State:** Version field exists but is ignored; spec explicitly allows deferring

**Build System Integration:**

### Versioned Persona References

```typescript
// Enhanced persona format
export default {
  id: 'backend-engineer',
  name: 'Backend Engineer',
  version: '2.0.0',
  schemaVersion: '2.1',

  modules: [
    // Simple reference (latest version)
    'foundation/ethics/do-no-harm',

    // Versioned reference
    { id: 'principle/testing/tdd', version: '^2.0.0' },
    { id: 'technology/typescript/error-handling', version: '~1.5.0' },

    // Exact version pin
    { id: 'technology/rest/design', version: '1.2.3' }
  ]
} satisfies Persona;
```

### Version Resolution Engine

```typescript
import semver from 'semver';

export class VersionedModuleRegistry {
  private modules: Map<string, Map<string, Module>> = new Map();

  register(module: Module, source: ModuleSource): void {
    if (!this.modules.has(module.id)) {
      this.modules.set(module.id, new Map());
    }

    this.modules.get(module.id)!.set(module.version, module);
  }

  resolve(
    moduleId: string,
    versionConstraint?: string
  ): Module | undefined {
    const versions = this.modules.get(moduleId);
    if (!versions) return undefined;

    const availableVersions = Array.from(versions.keys());

    if (!versionConstraint) {
      // Return latest
      const latest = semver.maxSatisfying(availableVersions, '*');
      return latest ? versions.get(latest) : undefined;
    }

    // Find best match
    const bestMatch = semver.maxSatisfying(availableVersions, versionConstraint);
    return bestMatch ? versions.get(bestMatch) : undefined;
  }

  getVersions(moduleId: string): string[] {
    const versions = this.modules.get(moduleId);
    if (!versions) return [];

    return Array.from(versions.keys()).sort(semver.rcompare);
  }
}

export class BuildOrchestrator {
  async buildPersona(persona: Persona): Promise<BuildResult> {
    const resolvedModules: Module[] = [];
    const versionInfo: VersionResolution[] = [];

    for (const entry of persona.modules) {
      let moduleId: string;
      let versionConstraint: string | undefined;

      if (typeof entry === 'string') {
        moduleId = entry;
      } else if ('id' in entry) {
        moduleId = entry.id;
        versionConstraint = entry.version;
      } else {
        // Group entry
        continue;
      }

      const module = this.registry.resolve(moduleId, versionConstraint);

      if (!module) {
        throw new BuildError(
          versionConstraint
            ? `Module ${moduleId}@${versionConstraint} not found`
            : `Module ${moduleId} not found`
        );
      }

      resolvedModules.push(module);
      versionInfo.push({
        moduleId,
        requestedVersion: versionConstraint || 'latest',
        resolvedVersion: module.version,
        availableVersions: this.registry.getVersions(moduleId)
      });
    }

    return {
      markdown: await this.renderMarkdown(persona, resolvedModules),
      modules: resolvedModules,
      versionResolutions: versionInfo
    };
  }
}
```

### CLI Integration

```bash
# Build with version constraints
copilot-instructions build --persona dev.persona.ts

✓ Resolved versions:
  - foundation/ethics/do-no-harm: latest → 1.0.0
  - principle/testing/tdd: ^2.0.0 → 2.1.5
  - technology/typescript/error-handling: ~1.5.0 → 1.5.3
  - technology/rest/design: 1.2.3 → 1.2.3 (pinned)

# List available versions
copilot-instructions versions principle/testing/tdd

Available versions:
  2.1.5 (latest)
  2.1.4
  2.1.3
  2.0.0
  1.5.0

# Upgrade modules in persona
copilot-instructions upgrade --persona dev.persona.ts \
  --to-latest \
  --check-breaking
```

**Complexity:** High
**Priority:** Medium (spec allows deferring; implement when needed)
**Dependencies:** `semver` package

---

## 5. Build Composition Tracking

**Spec Reference:** Section 7.3 (lines 580-594)

**Current State:** `composedFrom` field defined but never populated

**Build System Integration:**

### Composition Event Tracking

```typescript
export interface CompositionTracker {
  trackReplacement(
    baseModule: Module,
    replacementModule: Module,
    reason: string
  ): void;

  trackOverride(
    moduleId: string,
    originalSource: string,
    overrideSource: string
  ): void;

  getHistory(moduleId: string): CompositionEvent[];
}

export class BuildOrchestrator {
  private compositionTracker = new CompositionTrackerImpl();

  async buildPersona(persona: Persona): Promise<BuildResult> {
    // During module resolution, track composition
    const modules = await this.resolveModules(persona);

    // Generate build report with composition history
    const buildReport = this.generateBuildReport(persona, modules);

    return {
      markdown: await this.renderMarkdown(persona, modules),
      modules,
      buildReport, // Includes composedFrom for each module
      compositionEvents: this.compositionTracker.getAllEvents()
    };
  }

  private generateBuildReport(
    persona: Persona,
    modules: Module[]
  ): BuildReport {
    const moduleReports: BuildReportModule[] = modules.map(module => {
      const history = this.compositionTracker.getHistory(module.id);

      return {
        id: module.id,
        name: module.metadata.name,
        version: module.version,
        source: module.source.path,
        digest: this.computeDigest(module),
        deprecated: module.metadata.deprecated ?? false,
        composedFrom: history.length > 0 ? history : undefined
      };
    });

    return {
      personaName: persona.name,
      schemaVersion: '2.1',
      toolVersion: this.getToolVersion(),
      personaDigest: this.computePersonaDigest(persona),
      buildTimestamp: new Date().toISOString(),
      moduleGroups: [{ groupName: 'All Modules', modules: moduleReports }]
    };
  }
}
```

### CLI Integration

```bash
# Build with detailed report
copilot-instructions build --persona dev.persona.ts \
  --report build-report.json

# View composition history
copilot-instructions build-info build-report.json

Build Report: Backend Engineer
Built: 2024-01-15T10:30:00Z
Modules: 24

Composition Events:
  📦 technology/typescript/error-handling
    1.0.0 from instruct-modules-v2/modules/technology/typescript/error-handling.module.ts (base)
    1.1.0 from company-overrides/typescript/error-handling.module.ts (replace)

  📦 principle/testing/tdd
    2.0.0 from instruct-modules-v2/modules/principle/testing/tdd.module.ts (base)

# Compare builds
copilot-instructions build-diff report-v1.json report-v2.json
```

**Complexity:** Medium
**Priority:** Low (useful for debugging and auditing)
**Dependencies:** SHA-256 hashing

---

## 6. Federation & Remote Registries

**Spec Reference:** Section 8 (line 934)

**Current State:** Not implemented; only local file system supported

**Build System Integration:**

### Multi-Source Module Resolution

```typescript
export interface ModuleSource {
  type: 'local' | 'remote';
  name: string;
  priority: number;
}

export interface RemoteRegistry extends ModuleSource {
  type: 'remote';
  url: string;
  client: RegistryClient;
  cache?: CacheConfig;
  auth?: AuthConfig;
}

export class FederatedBuildOrchestrator {
  private sources: ModuleSource[] = [];
  private cache: Map<string, Module> = new Map();

  async buildPersona(persona: Persona): Promise<BuildResult> {
    const modules: Module[] = [];

    for (const moduleRef of persona.modules) {
      const moduleId = this.extractModuleId(moduleRef);
      const module = await this.resolveFromFederation(moduleId);

      if (!module) {
        throw new BuildError(`Module not found in any registry: ${moduleId}`);
      }

      modules.push(module);
    }

    return {
      markdown: await this.renderMarkdown(persona, modules),
      modules,
      sources: this.getUsedSources(modules)
    };
  }

  private async resolveFromFederation(
    moduleId: string
  ): Promise<Module | undefined> {
    // 1. Check cache
    if (this.cache.has(moduleId)) {
      return this.cache.get(moduleId);
    }

    // 2. Try sources by priority
    const sortedSources = this.sources.sort((a, b) => b.priority - a.priority);

    for (const source of sortedSources) {
      try {
        let module: Module | undefined;

        if (source.type === 'local') {
          module = await this.loadFromLocal(moduleId, source);
        } else {
          module = await this.loadFromRemote(moduleId, source as RemoteRegistry);
        }

        if (module) {
          // Validate module
          const validation = await validateModule(module);
          if (!validation.valid) {
            console.warn(`Invalid module from ${source.name}:`, validation.errors);
            continue;
          }

          // Cache and return
          this.cache.set(moduleId, module);
          return module;
        }
      } catch (error) {
        console.warn(`Failed to load from ${source.name}:`, error);
        // Continue to next source
      }
    }

    return undefined;
  }

  private async loadFromRemote(
    moduleId: string,
    registry: RemoteRegistry
  ): Promise<Module | undefined> {
    return await registry.client.fetchModule(moduleId);
  }
}
```

### Configuration

```yaml
# modules.config.yml
sources:
  # Local sources (checked first)
  - type: local
    name: company-standards
    path: ./company-modules
    priority: 100
    onConflict: replace

  - type: local
    name: ums-v2
    path: ./instruct-modules-v2
    priority: 50
    onConflict: error

  # Remote registries
  - type: remote
    name: ums-community
    url: https://registry.ums.dev
    priority: 10
    cache:
      enabled: true
      ttl: 3600
      path: ./.cache/ums-community

  - type: remote
    name: company-internal
    url: https://modules.company.com
    priority: 75
    auth:
      type: bearer
      tokenEnv: COMPANY_REGISTRY_TOKEN
```

### CLI Integration

```bash
# Build with federation
copilot-instructions build --persona dev.persona.ts

✓ Resolved from sources:
  - company-standards: 5 modules
  - ums-v2: 18 modules
  - ums-community: 1 module (cached)

# List remote modules
copilot-instructions list --source ums-community

# Search across all registries
copilot-instructions search "error handling" --all-sources

# Fetch and cache remote module
copilot-instructions fetch technology/rust/ownership \
  --source ums-community \
  --cache

# Clear remote cache
copilot-instructions cache clear --source ums-community
```

**Complexity:** Very High
**Priority:** Low (defer to v2.1+; requires infrastructure)
**Dependencies:** HTTP client, caching, authentication

---

## 7. Advanced Composition System

**Spec Reference:** Section 8 (lines 936-937)

**Current State:** Not implemented; composition is purely declarative

**Build System Integration:**

### Template Evaluation Engine

```typescript
export interface PersonaTemplate {
  id: string;
  name: string;
  schemaVersion: '2.1';

  // Bindings define variables
  bindings?: {
    [key: string]: Binding;
  };

  // Imports for selective component inclusion
  imports?: Import[];

  // Modules can reference bindings
  modules: (string | ModuleReference | ModuleGroup)[];
}

export interface Binding {
  type: 'select' | 'multi-select' | 'text';
  description?: string;
  options?: string[];
  default?: string | string[];
  modules?: { [option: string]: string[] };
}

export interface Import {
  from: string;               // Module ID
  as?: string;                // Alias
  components?: ComponentType[]; // Selective import
}

export class TemplateEvaluator {
  evaluate(
    template: PersonaTemplate,
    bindings: Record<string, any>
  ): Persona {
    // 1. Resolve binding values
    const resolvedBindings = this.resolveBindings(template.bindings, bindings);

    // 2. Evaluate module references
    const modules = this.evaluateModules(template.modules, resolvedBindings);

    // 3. Process imports
    const imports = this.processImports(template.imports || []);

    // 4. Return evaluated persona
    return {
      id: template.id,
      name: template.name,
      version: '1.0.0',
      schemaVersion: '2.1',
      modules: [...modules, ...imports]
    };
  }

  private evaluateModules(
    modules: (string | ModuleReference)[],
    bindings: Record<string, any>
  ): string[] {
    const result: string[] = [];

    for (const entry of modules) {
      if (typeof entry === 'string') {
        // Check for template variables: ${bindings.language}
        const evaluated = this.evaluateTemplate(entry, bindings);
        result.push(evaluated);
      } else {
        // Handle complex references
        result.push(entry.id);
      }
    }

    return result;
  }

  private evaluateTemplate(
    template: string,
    bindings: Record<string, any>
  ): string {
    return template.replace(/\$\{bindings\.(\w+)\}/g, (_, key) => {
      return bindings[key] || '';
    });
  }
}
```

### Example: Language-Agnostic Persona

```typescript
// dev-template.persona.ts
export default {
  id: 'language-agnostic-developer',
  name: 'Language Agnostic Developer',
  schemaVersion: '2.1',

  bindings: {
    language: {
      type: 'select',
      description: 'Primary programming language',
      options: ['typescript', 'python', 'rust', 'go'],
      modules: {
        typescript: [
          'technology/typescript/best-practices',
          'technology/typescript/error-handling',
          'technology/typescript/async-patterns'
        ],
        python: [
          'technology/python/best-practices',
          'technology/python/error-handling',
          'technology/python/async-programming'
        ],
        rust: [
          'technology/rust/ownership',
          'technology/rust/error-handling'
        ],
        go: [
          'technology/go/concurrency',
          'technology/go/error-handling'
        ]
      }
    },
    framework: {
      type: 'multi-select',
      description: 'Frameworks and libraries',
      options: ['express', 'fastapi', 'actix', 'gin'],
      modules: {
        express: ['technology/nodejs/express'],
        fastapi: ['technology/python/fastapi'],
        actix: ['technology/rust/actix'],
        gin: ['technology/go/gin']
      }
    }
  },

  imports: [
    { from: 'foundation/ethics/do-no-harm' },
    { from: 'principle/testing/tdd', components: ['instruction'] }
  ],

  modules: [
    // Language-agnostic modules
    'principle/solid/single-responsibility',
    'principle/testing/test-doubles',

    // Dynamic modules based on bindings
    '${bindings.language}',
    '${bindings.framework}'
  ]
} satisfies PersonaTemplate;
```

### CLI Integration

```bash
# Build with bindings
copilot-instructions build --template dev-template.persona.ts \
  --binding language=typescript \
  --binding framework=express

# Interactive binding selection
copilot-instructions build --template dev-template.persona.ts --interactive

? Select primary programming language:
  > typescript
    python
    rust
    go

? Select frameworks and libraries: (space to select)
  [x] express
  [ ] fastapi
  [ ] actix
  [ ] gin

✓ Building persona with:
  - language: typescript
  - framework: express

# List available bindings
copilot-instructions bindings dev-template.persona.ts

Available bindings:
  language (select):
    Description: Primary programming language
    Options: typescript, python, rust, go

  framework (multi-select):
    Description: Frameworks and libraries
    Options: express, fastapi, actix, gin
```

**Complexity:** Very High
**Priority:** Very Low (defer to v2.2+; significant design complexity)
**Dependencies:** Template engine, binding resolution

---

## Implementation Roadmap

### Phase 1: Core Build Features (4-6 weeks)
**Priority: High**

1. **Module Relationship Resolution** (2 weeks)
   - Auto-include required dependencies
   - Conflict detection
   - Extends chain resolution

2. **Quality-Based Validation** (1 week)
   - Quality filters
   - Build-time quality checks
   - Configuration support

3. **Problem-Solution Discovery** (2 weeks)
   - Build problem index
   - Search engine
   - CLI integration

**Deliverable:** Build system that actively uses relationships, quality metadata, and problem-solution mapping

### Phase 2: Version Management (3-4 weeks)
**Priority: Medium**

4. **Module Version Resolution** (3-4 weeks)
   - Versioned registry
   - Semver resolution
   - Persona version constraints

**Deliverable:** Multi-version support in build system

### Phase 3: Advanced Build Features (2-3 weeks)
**Priority: Medium**

5. **Build Composition Tracking** (2-3 weeks)
   - Composition event tracking
   - Build reports with history
   - CLI reporting tools

**Deliverable:** Full build provenance and auditing

### Phase 4: Federation (8-10 weeks)
**Priority: Low (future version)**

6. **Federation & Remote Registries** (8-10 weeks)
   - Registry protocol
   - HTTP client
   - Multi-source resolution
   - Caching layer
   - Registry server

**Deliverable:** Federated module ecosystem

### Phase 5: Advanced Composition (6-8 weeks)
**Priority: Very Low (future version)**

7. **Advanced Composition System** (6-8 weeks)
   - Template evaluation engine
   - Binding resolution
   - Selective imports
   - Dynamic module selection

**Deliverable:** Template-based persona composition

---

## CLI Integration

### New Commands

```bash
# Build commands
copilot-instructions build --persona dev.persona.ts \
  --include-deps \                    # Auto-include required deps
  --check-conflicts \                 # Detect conflicts
  --min-maturity stable \             # Quality filter
  --min-confidence 0.8 \              # Quality filter
  --exclude-experimental \            # Quality filter
  --report build-report.json          # Generate detailed report

# Discovery commands
copilot-instructions search-problem "race conditions"
copilot-instructions discover --solves "error handling" --tier technology
copilot-instructions suggest --for-persona dev.persona.ts

# Version commands
copilot-instructions versions principle/testing/tdd
copilot-instructions upgrade --persona dev.persona.ts --to-latest

# Federation commands (future)
copilot-instructions list --source ums-community
copilot-instructions fetch technology/rust/ownership --source ums-community
copilot-instructions cache clear

# Template commands (future)
copilot-instructions build --template dev-template.persona.ts --interactive
copilot-instructions bindings dev-template.persona.ts
```

### Configuration File

```yaml
# modules.config.yml
build:
  # Relationship handling
  relationships:
    autoIncludeRequired: true
    autoIncludeRecommended: false
    failOnConflicts: true
    resolveExtends: true

  # Quality requirements
  quality:
    minMaturity: stable
    minConfidence: 0.7
    excludeExperimental: true
    excludeDeprecated: true
    failOnLowQuality: false
    maxStaleDays: 365

  # Build output
  output:
    includeCompositionHistory: true
    generateBuildReport: true
    reportFormat: json

# Module sources
sources:
  - type: local
    name: company-standards
    path: ./company-modules
    priority: 100

  - type: local
    name: ums-v2
    path: ./instruct-modules-v2
    priority: 50

# Future: Remote registries
# remoteRegistries:
#   - name: ums-community
#     url: https://registry.ums.dev
#     priority: 10
```

---

## Testing Strategy

For each feature:

1. **Unit Tests**
   - Individual resolution functions
   - Quality filter logic
   - Version matching
   - Problem search algorithms

2. **Integration Tests**
   - Full build with relationships
   - Quality-filtered builds
   - Problem-based discovery
   - Version resolution

3. **CLI Tests**
   - Command-line interface
   - Configuration loading
   - Error handling

4. **Performance Tests**
   - Large persona builds
   - Index search performance
   - Cache effectiveness

---

## Migration Path

### Existing Personas

All existing personas continue to work without changes:
- Module IDs without versions resolve to latest
- No relationships = no auto-inclusion
- No quality metadata = treated as stable
- Backward compatible

### Opt-In Features

Users can gradually adopt new features:

```typescript
// Start simple
modules: ['foundation/ethics/do-no-harm']

// Add version constraints when needed
modules: [
  { id: 'foundation/ethics/do-no-harm', version: '^1.0.0' }
]

// Configure build-time behavior
// via modules.config.yml
```

---

## Conclusion

This document identifies 7 major build system enhancements that should be implemented to fully leverage UMS v2.1 spec properties:

**Immediate Value (Phase 1):**
- Module relationship resolution
- Quality-based validation
- Problem-solution discovery

**Medium-Term (Phases 2-3):**
- Version resolution
- Composition tracking

**Future (Phases 4-5):**
- Federation
- Advanced composition

**Key Insight:** These features transform UMS v2.1 from a "documentation generator" into a true **module composition and build system** with intelligent resolution, validation, and discovery capabilities.
