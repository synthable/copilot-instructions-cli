# Hybrid Dependency Management Approaches: Comprehensive Analysis

## Executive Summary

This document provides an in-depth analysis of hybrid dependency management approaches for the Unified Module System (UMS). Hybrid approaches combine multiple dependency management strategies to leverage their respective strengths while mitigating weaknesses. Each hybrid is analyzed with implementation details, real-world examples, and comprehensive cost-benefit analysis.

## Table of Contents

1. [Hybrid A: Cognitive Hierarchy + External Graph](#hybrid-a-cognitive-hierarchy--external-graph)
2. [Hybrid B: Capabilities + Build Analysis](#hybrid-b-capabilities--build-analysis)
3. [Hybrid C: Import-Based + Persona Override](#hybrid-c-import-based--persona-override)
4. [Hybrid D: Layered Dependencies](#hybrid-d-layered-dependencies)
5. [Hybrid E: Progressive Enhancement](#hybrid-e-progressive-enhancement)
6. [Hybrid F: Contextual Resolution](#hybrid-f-contextual-resolution)
7. [Comparison Matrix](#comparison-matrix)
8. [Implementation Strategies](#implementation-strategies)
9. [Recommendations](#recommendations)

---

## Hybrid A: Cognitive Hierarchy + External Graph

### Overview

This hybrid combines the implicit architectural layering of cognitive levels with an external dependency graph for specific relationships that don't fit the hierarchical model.

```typescript
// Module uses cognitive level for implicit dependencies
export const apiSecurity: Module = {
  id: 'technology/security/api-security',
  cognitiveLevel: CognitiveLevel.PROCEDURES_AND_PLAYBOOKS, // Level 4
  // Automatically can use levels 0-3
  // No explicit dependencies in module
};

// External graph for peer and optional relationships
export const dependencyEnhancements = {
  'technology/security/api-security': {
    peers: ['technology/security/threat-modeling'],
    enhancedBy: ['technology/monitoring/logging', 'technology/monitoring/tracing'],
    incompatibleWith: ['technology/security/basic-api-security'],
    alternatives: ['technology/security/graphql-security']
  }
};
```

### Implementation

```typescript
class HierarchicalGraphManager {
  private cognitiveIndex: Map<CognitiveLevel, Module[]> = new Map();
  private enhancementGraph: DependencyEnhancements;

  constructor(
    private registry: ModuleRegistry,
    enhancementGraph: DependencyEnhancements
  ) {
    this.enhancementGraph = enhancementGraph;
    this.buildCognitiveIndex();
  }

  // Build index of modules by cognitive level
  private buildCognitiveIndex(): void {
    for (const module of this.registry.getAllModules()) {
      const level = module.cognitiveLevel;
      if (!this.cognitiveIndex.has(level)) {
        this.cognitiveIndex.set(level, []);
      }
      this.cognitiveIndex.get(level)!.push(module);
    }
  }

  // Get all valid dependencies for a module
  getCompleteDependencies(moduleId: string): CompleteDependencies {
    const module = this.registry.getModule(moduleId);
    if (!module) throw new Error(`Module ${moduleId} not found`);

    return {
      // Implicit from hierarchy
      implicit: this.getImplicitDependencies(module),

      // Explicit from graph
      peers: this.enhancementGraph[moduleId]?.peers || [],
      enhancedBy: this.enhancementGraph[moduleId]?.enhancedBy || [],

      // Conflicts
      incompatibleWith: this.enhancementGraph[moduleId]?.incompatibleWith || [],

      // Alternatives
      alternatives: this.enhancementGraph[moduleId]?.alternatives || []
    };
  }

  // Get implicit dependencies based on cognitive hierarchy
  private getImplicitDependencies(module: Module): ImplicitDependency[] {
    const deps: ImplicitDependency[] = [];

    // Can depend on all modules from lower cognitive levels
    for (let level = 0; level < module.cognitiveLevel; level++) {
      const modules = this.cognitiveIndex.get(level as CognitiveLevel) || [];

      for (const depModule of modules) {
        deps.push({
          moduleId: depModule.id,
          level: level as CognitiveLevel,
          type: 'implicit',
          reason: `Level ${module.cognitiveLevel} can use level ${level}`
        });
      }
    }

    return deps;
  }

  // Validate a persona composition
  validatePersona(persona: Persona): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const modules = persona.modules.map(id => this.registry.getModule(id));

    // Check hierarchical dependencies
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];
      const availableLevels = new Set(
        modules.slice(0, i).map(m => m.cognitiveLevel)
      );

      // Check if module can use its implicit dependencies
      for (let level = 0; level < module.cognitiveLevel; level++) {
        if (!availableLevels.has(level as CognitiveLevel)) {
          warnings.push({
            path: `modules[${i}]`,
            message: `Module lacks foundation at level ${level}`
          });
        }
      }
    }

    // Check enhancement graph constraints
    const moduleIds = new Set(persona.modules);

    for (const moduleId of persona.modules) {
      const enhancements = this.enhancementGraph[moduleId];
      if (!enhancements) continue;

      // Check incompatibilities
      for (const incompatible of enhancements.incompatibleWith || []) {
        if (moduleIds.has(incompatible)) {
          errors.push({
            path: 'modules',
            message: `Modules '${moduleId}' and '${incompatible}' are incompatible`
          });
        }
      }

      // Suggest peers
      for (const peer of enhancements.peers || []) {
        if (!moduleIds.has(peer)) {
          warnings.push({
            path: 'modules',
            message: `Consider adding peer module '${peer}' with '${moduleId}'`
          });
        }
      }
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  // Generate composition suggestions
  suggestModules(currentModules: string[]): ModuleSuggestion[] {
    const suggestions: ModuleSuggestion[] = [];
    const moduleSet = new Set(currentModules);

    // Analyze cognitive gaps
    const modules = currentModules.map(id => this.registry.getModule(id));
    const levelCoverage = new Map<CognitiveLevel, number>();

    for (const module of modules) {
      const count = levelCoverage.get(module.cognitiveLevel) || 0;
      levelCoverage.set(module.cognitiveLevel, count + 1);
    }

    // Suggest modules to fill gaps
    for (let level = 0; level <= 6; level++) {
      const coverage = levelCoverage.get(level as CognitiveLevel) || 0;

      if (coverage === 0 && level <= 2) {
        // Missing foundation - high priority
        const candidates = this.cognitiveIndex.get(level as CognitiveLevel) || [];

        for (const candidate of candidates.slice(0, 3)) {
          suggestions.push({
            moduleId: candidate.id,
            priority: 'high',
            reason: `Missing foundation at level ${level}`,
            type: 'foundation'
          });
        }
      }
    }

    // Suggest from enhancement graph
    for (const moduleId of currentModules) {
      const enhancements = this.enhancementGraph[moduleId];
      if (!enhancements) continue;

      // Suggest peers
      for (const peer of enhancements.peers || []) {
        if (!moduleSet.has(peer)) {
          suggestions.push({
            moduleId: peer,
            priority: 'medium',
            reason: `Peer of '${moduleId}'`,
            type: 'peer'
          });
        }
      }

      // Suggest enhancements
      for (const enhancer of enhancements.enhancedBy || []) {
        if (!moduleSet.has(enhancer)) {
          suggestions.push({
            moduleId: enhancer,
            priority: 'low',
            reason: `Enhances '${moduleId}'`,
            type: 'enhancement'
          });
        }
      }
    }

    // Sort by priority and deduplicate
    return this.deduplicateAndSort(suggestions);
  }

  // Visualize dependency structure
  generateVisualization(moduleId: string): DependencyVisualization {
    const deps = this.getCompleteDependencies(moduleId);
    const module = this.registry.getModule(moduleId);

    return {
      module: {
        id: moduleId,
        level: module.cognitiveLevel,
        name: module.metadata.name
      },

      layers: {
        foundation: deps.implicit.filter(d => d.level <= 1),
        principles: deps.implicit.filter(d => d.level === 2),
        domain: deps.implicit.filter(d => d.level === 3),
        procedures: deps.implicit.filter(d => d.level === 4)
      },

      relationships: {
        peers: deps.peers.map(id => ({
          id,
          type: 'peer',
          bidirectional: true
        })),
        enhancements: deps.enhancedBy.map(id => ({
          id,
          type: 'enhancement',
          optional: true
        })),
        conflicts: deps.incompatibleWith.map(id => ({
          id,
          type: 'conflict',
          severity: 'error'
        }))
      }
    };
  }
}
```

### Real-World Example

```typescript
// Configuration file: dependencies.enhanced.ts
export const enhancedDependencies = {
  // Foundation layer - no dependencies, but relationships
  'foundation/ethics/privacy-first': {
    peers: ['foundation/ethics/consent-required'],
    incompatibleWith: ['foundation/ethics/data-collection-first']
  },

  // Principle layer
  'principle/architecture/microservices': {
    peers: ['principle/architecture/domain-driven-design'],
    enhancedBy: [
      'technology/containers/docker',
      'technology/orchestration/kubernetes'
    ],
    incompatibleWith: ['principle/architecture/monolithic'],
    alternatives: ['principle/architecture/serverless']
  },

  // Technology layer
  'technology/database/postgresql': {
    peers: ['technology/database/migrations'],
    enhancedBy: [
      'technology/database/connection-pooling',
      'technology/monitoring/database-monitoring'
    ],
    incompatibleWith: ['technology/database/mongodb'],
    alternatives: ['technology/database/mysql', 'technology/database/mariadb']
  },

  // Execution layer
  'execution/deployment/blue-green': {
    peers: ['execution/deployment/rollback-strategy'],
    enhancedBy: ['execution/monitoring/deployment-tracking'],
    incompatibleWith: ['execution/deployment/in-place'],
    alternatives: ['execution/deployment/canary', 'execution/deployment/rolling']
  }
};

// Usage in build system
const manager = new HierarchicalGraphManager(registry, enhancedDependencies);

// Validate persona
const persona = {
  modules: [
    'foundation/ethics/privacy-first',
    'principle/architecture/microservices',
    'technology/containers/docker',
    'execution/deployment/blue-green'
  ]
};

const validation = manager.validatePersona(persona);
// Warnings: Missing some foundation modules
// Suggestions: Add kubernetes (enhances microservices)

// Get complete dependency picture
const deps = manager.getCompleteDependencies('technology/containers/docker');
// Returns:
// - Implicit: All foundation and principle modules
// - Peers: container-registries, docker-compose
// - EnhancedBy: docker-monitoring, docker-security-scanning
```

### Advantages

1. **Best of Both Worlds**: Hierarchical structure + specific relationships
2. **Architectural Enforcement**: Cognitive levels prevent bad dependencies
3. **Rich Relationships**: Peers, enhancements, conflicts, alternatives
4. **Gradual Adoption**: Can start with hierarchy, add graph later
5. **Clear Mental Model**: Layers are intuitive, graph adds detail
6. **Bidirectional Queries**: Graph supports reverse lookups
7. **Flexible Enhancement**: Graph can evolve independently

### Disadvantages

1. **Two Systems**: Must understand both hierarchy and graph
2. **Potential Conflicts**: Hierarchy and graph might disagree
3. **Maintenance Split**: Updates needed in two places
4. **Complex Validation**: Two rule sets to check
5. **Learning Curve**: More complex than single approach

### Cost-Benefit Analysis

| Aspect | Cost | Benefit | Net Value |
|--------|------|---------|-----------|
| **Implementation** | Medium-High | Comprehensive system | Positive |
| **Maintenance** | Medium | Low for hierarchy, medium for graph | Neutral |
| **Runtime Performance** | Low | Fast validation | Positive |
| **Type Safety** | Medium | Enums for levels, types for graph | Positive |
| **Developer Experience** | Medium complexity | Rich tooling possible | Positive |
| **Flexibility** | High flexibility | Handles all cases | Very Positive |

---

## Hybrid B: Capabilities + Build Analysis

### Overview

This hybrid uses capability declarations as the primary mechanism, enhanced with build-time content analysis to discover undeclared dependencies and validate declared ones.

```typescript
// Module declares capabilities and requirements
export const apiSecurity: Module = {
  id: 'technology/security/api-security',
  capabilities: ['api-security', 'authentication', 'authorization'],
  requiresCapabilities: ['error-handling', 'logging'],
  // Build system analyzes content to find additional dependencies
};

// Build analysis discovers references not in requiresCapabilities
// and validates that declared capabilities are actually used
```

### Implementation

```typescript
class CapabilityAnalysisHybrid {
  private capabilityIndex: Map<string, Module[]> = new Map();
  private analyzer: ContentAnalyzer;
  private similarityThreshold = 0.7;

  constructor(
    private registry: ModuleRegistry,
    analyzer: ContentAnalyzer
  ) {
    this.analyzer = analyzer;
    this.buildCapabilityIndex();
  }

  // Build capability provider index
  private buildCapabilityIndex(): void {
    for (const module of this.registry.getAllModules()) {
      for (const capability of module.capabilities) {
        if (!this.capabilityIndex.has(capability)) {
          this.capabilityIndex.set(capability, []);
        }
        this.capabilityIndex.get(capability)!.push(module);
      }
    }
  }

  // Enhanced dependency resolution
  async resolveEnhanced(module: Module): Promise<EnhancedResolution> {
    // Start with declared requirements
    const declared = this.resolveDeclaredRequirements(module);

    // Analyze content for additional dependencies
    const discovered = await this.analyzer.analyzeContent(module);

    // Find capability overlaps and gaps
    const analysis = this.analyzeAlignment(declared, discovered);

    // Generate smart suggestions
    const suggestions = await this.generateSmartSuggestions(
      module,
      declared,
      discovered,
      analysis
    );

    return {
      declared,
      discovered,
      analysis,
      suggestions,
      confidence: this.calculateConfidence(analysis)
    };
  }

  // Resolve declared capability requirements
  private resolveDeclaredRequirements(
    module: Module
  ): DeclaredResolution {
    const resolution: DeclaredResolution = {
      satisfied: new Map(),
      missing: [],
      ambiguous: []
    };

    for (const required of module.requiresCapabilities || []) {
      const providers = this.capabilityIndex.get(required) || [];

      if (providers.length === 0) {
        resolution.missing.push(required);
      } else if (providers.length === 1) {
        resolution.satisfied.set(required, providers[0]);
      } else {
        resolution.ambiguous.push({
          capability: required,
          providers
        });
      }
    }

    return resolution;
  }

  // Analyze alignment between declared and discovered
  private analyzeAlignment(
    declared: DeclaredResolution,
    discovered: AnalysisResult
  ): AlignmentAnalysis {
    const analysis: AlignmentAnalysis = {
      confirmed: [],      // Declared and discovered
      surplus: [],        // Discovered but not declared
      phantom: [],        // Declared but not discovered
      confidence: new Map()
    };

    // Check declared requirements against discovered
    const discoveredConcepts = new Set(
      discovered.references.keys()
    );

    for (const [capability, provider] of declared.satisfied) {
      if (this.isConceptRelated(capability, discoveredConcepts)) {
        analysis.confirmed.push({
          capability,
          provider,
          confidence: discovered.references.get(capability) || 0.5
        });
      } else {
        analysis.phantom.push({
          capability,
          reason: 'Declared but no content references found'
        });
      }
    }

    // Check discovered concepts not in declared
    for (const [concept, confidence] of discovered.references) {
      const capability = this.conceptToCapability(concept);

      if (!declared.satisfied.has(capability) &&
          !declared.missing.includes(capability)) {
        analysis.surplus.push({
          concept,
          capability,
          confidence,
          providers: this.capabilityIndex.get(capability) || []
        });
      }
    }

    return analysis;
  }

  // Generate smart dependency suggestions
  private async generateSmartSuggestions(
    module: Module,
    declared: DeclaredResolution,
    discovered: AnalysisResult,
    analysis: AlignmentAnalysis
  ): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    // Suggest removing phantom dependencies
    for (const phantom of analysis.phantom) {
      suggestions.push({
        type: 'remove',
        capability: phantom.capability,
        reason: phantom.reason,
        confidence: 0.8,
        impact: 'low'
      });
    }

    // Suggest adding high-confidence discoveries
    for (const surplus of analysis.surplus) {
      if (surplus.confidence > 0.6) {
        suggestions.push({
          type: 'add',
          capability: surplus.capability,
          providers: surplus.providers.map(p => p.id),
          reason: `Content analysis found ${surplus.confidence * 100}% confidence`,
          confidence: surplus.confidence,
          impact: 'medium'
        });
      }
    }

    // Resolve ambiguous dependencies using content
    for (const ambiguous of declared.ambiguous) {
      const bestProvider = await this.selectBestProvider(
        ambiguous.capability,
        ambiguous.providers,
        module
      );

      suggestions.push({
        type: 'disambiguate',
        capability: ambiguous.capability,
        suggestedProvider: bestProvider.id,
        reason: 'Selected based on content similarity',
        confidence: 0.7,
        impact: 'high'
      });
    }

    // Find similar modules for inspiration
    const similar = await this.findSimilarModules(module);

    for (const sim of similar.slice(0, 3)) {
      const simCapabilities = sim.module.requiresCapabilities || [];

      for (const cap of simCapabilities) {
        if (!declared.satisfied.has(cap) && !declared.missing.includes(cap)) {
          suggestions.push({
            type: 'consider',
            capability: cap,
            reason: `Used by similar module '${sim.module.id}'`,
            confidence: sim.similarity,
            impact: 'low'
          });
        }
      }
    }

    return suggestions.sort((a, b) => {
      const impactScore = { high: 3, medium: 2, low: 1 };
      return (
        impactScore[b.impact] - impactScore[a.impact] ||
        b.confidence - a.confidence
      );
    });
  }

  // Select best provider based on content analysis
  private async selectBestProvider(
    capability: string,
    providers: Module[],
    consumer: Module
  ): Promise<Module> {
    let bestScore = -1;
    let bestProvider = providers[0];

    for (const provider of providers) {
      const score = await this.scoreProviderMatch(provider, consumer);

      if (score > bestScore) {
        bestScore = score;
        bestProvider = provider;
      }
    }

    return bestProvider;
  }

  // Score how well a provider matches a consumer
  private async scoreProviderMatch(
    provider: Module,
    consumer: Module
  ): Promise<number> {
    let score = 0;

    // Domain match
    const providerDomains = Array.isArray(provider.domain)
      ? provider.domain : [provider.domain];
    const consumerDomains = Array.isArray(consumer.domain)
      ? consumer.domain : [consumer.domain];

    for (const pd of providerDomains) {
      if (consumerDomains.includes(pd)) score += 0.3;
    }

    // Capability overlap
    const providerCaps = new Set(provider.capabilities);
    const consumerCaps = new Set(consumer.capabilities);
    const overlap = [...providerCaps].filter(c => consumerCaps.has(c));
    score += overlap.length * 0.1;

    // Content similarity
    const similarity = await this.calculateSimilarity(provider, consumer);
    score += similarity * 0.4;

    // Version compatibility
    if (provider.version.startsWith('1.')) score += 0.2;

    return Math.min(1, score);
  }

  // Find modules similar to the given one
  private async findSimilarModules(
    module: Module
  ): Promise<SimilarModule[]> {
    const similar: SimilarModule[] = [];

    for (const candidate of this.registry.getAllModules()) {
      if (candidate.id === module.id) continue;

      const similarity = await this.calculateSimilarity(module, candidate);

      if (similarity >= this.similarityThreshold) {
        similar.push({
          module: candidate,
          similarity,
          sharedCapabilities: this.getSharedCapabilities(module, candidate)
        });
      }
    }

    return similar.sort((a, b) => b.similarity - a.similarity);
  }

  // Calculate semantic similarity between modules
  private async calculateSimilarity(
    module1: Module,
    module2: Module
  ): Promise<number> {
    // Simple Jaccard similarity on capabilities
    const caps1 = new Set(module1.capabilities);
    const caps2 = new Set(module2.capabilities);

    const intersection = [...caps1].filter(c => caps2.has(c));
    const union = new Set([...caps1, ...caps2]);

    if (union.size === 0) return 0;

    return intersection.length / union.size;
  }

  // Validation with enhancement
  async validateWithAnalysis(
    module: Module
  ): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Resolve with enhancement
    const resolution = await this.resolveEnhanced(module);

    // Check for missing capabilities
    for (const missing of resolution.declared.missing) {
      errors.push({
        path: 'requiresCapabilities',
        message: `Required capability '${missing}' has no providers`
      });
    }

    // Warn about phantom dependencies
    for (const phantom of resolution.analysis.phantom) {
      warnings.push({
        path: 'requiresCapabilities',
        message: `Capability '${phantom.capability}' declared but not used`
      });
    }

    // Warn about high-confidence surplus
    for (const surplus of resolution.analysis.surplus) {
      if (surplus.confidence > 0.7) {
        warnings.push({
          path: 'requiresCapabilities',
          message: `Consider declaring '${surplus.capability}' (${Math.round(surplus.confidence * 100)}% confidence)`
        });
      }
    }

    // Check capability naming
    for (const capability of module.capabilities) {
      if (!this.isValidCapabilityName(capability)) {
        warnings.push({
          path: 'capabilities',
          message: `Capability '${capability}' doesn't follow naming convention`
        });
      }
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  // Build report generation
  async generateBuildReport(
    modules: Module[]
  ): Promise<BuildReport> {
    const report: BuildReport = {
      timestamp: new Date().toISOString(),
      modulesAnalyzed: modules.length,
      capabilityStats: {
        totalCapabilities: 0,
        averagePerModule: 0,
        uniqueCapabilities: new Set<string>(),
        mostProvided: [],
        leastProvided: []
      },
      issues: [],
      suggestions: []
    };

    // Analyze all modules
    for (const module of modules) {
      const resolution = await this.resolveEnhanced(module);

      // Collect statistics
      report.capabilityStats.totalCapabilities += module.capabilities.length;
      module.capabilities.forEach(c =>
        report.capabilityStats.uniqueCapabilities.add(c)
      );

      // Collect issues
      if (resolution.declared.missing.length > 0) {
        report.issues.push({
          moduleId: module.id,
          type: 'missing-providers',
          capabilities: resolution.declared.missing,
          severity: 'error'
        });
      }

      if (resolution.analysis.phantom.length > 0) {
        report.issues.push({
          moduleId: module.id,
          type: 'unused-requirements',
          capabilities: resolution.analysis.phantom.map(p => p.capability),
          severity: 'warning'
        });
      }

      // Collect suggestions
      for (const suggestion of resolution.suggestions) {
        if (suggestion.confidence > 0.6) {
          report.suggestions.push({
            moduleId: module.id,
            suggestion
          });
        }
      }
    }

    // Calculate statistics
    report.capabilityStats.averagePerModule =
      report.capabilityStats.totalCapabilities / modules.length;

    // Find most/least provided capabilities
    const capCount = new Map<string, number>();

    for (const [cap, providers] of this.capabilityIndex) {
      capCount.set(cap, providers.length);
    }

    const sorted = [...capCount.entries()].sort((a, b) => b[1] - a[1]);
    report.capabilityStats.mostProvided = sorted.slice(0, 5);
    report.capabilityStats.leastProvided = sorted.slice(-5);

    return report;
  }
}
```

### Real-World Example

```typescript
// Module with capabilities and implicit content dependencies
export const expressApiModule: Module = {
  id: 'technology/nodejs/express-api',
  capabilities: [
    'http-server',
    'rest-api',
    'middleware-pipeline',
    'routing'
  ],
  requiresCapabilities: [
    'error-handling',
    'logging'
  ],
  metadata: {
    semantic: 'Express.js REST API implementation with authentication, rate limiting, and OpenAPI documentation'
  },
  instruction: {
    purpose: 'Build production-ready Express APIs',
    process: [
      'Set up Express with security middleware (helmet, cors)',
      'Implement JWT authentication with refresh tokens',
      'Add rate limiting to prevent abuse',
      'Structure with separation of concerns',
      'Document with OpenAPI/Swagger'
    ]
  }
};

// Build analysis discovers additional concepts
const analysisResult = await analyzer.analyzeContent(expressApiModule);
// Discovers: authentication, rate-limiting, api-documentation, security-headers

// Enhanced resolution combines both
const resolution = await hybrid.resolveEnhanced(expressApiModule);
/* Returns:
{
  declared: {
    satisfied: Map { 'error-handling' => errorModule, 'logging' => winstonModule },
    missing: [],
    ambiguous: []
  },
  discovered: {
    references: Map {
      'authentication' => 0.9,
      'rate-limiting' => 0.8,
      'api-documentation' => 0.7,
      'security' => 0.8,
      'separation-of-concerns' => 0.6
    }
  },
  analysis: {
    confirmed: ['error-handling', 'logging'],
    surplus: [
      { concept: 'authentication', confidence: 0.9, providers: [jwtModule, passportModule] },
      { concept: 'rate-limiting', confidence: 0.8, providers: [rateLimitModule] }
    ],
    phantom: []
  },
  suggestions: [
    {
      type: 'add',
      capability: 'authentication',
      providers: ['technology/security/jwt', 'technology/security/passport'],
      reason: 'Content analysis found 90% confidence',
      impact: 'high'
    }
  ]
}
*/
```

### Advantages

1. **Self-Correcting**: Analysis validates and enhances declarations
2. **Smart Discovery**: Finds missing dependencies automatically
3. **Disambiguation**: Content analysis helps select providers
4. **Living Documentation**: Capabilities + actual usage
5. **Gradual Enhancement**: Start with capabilities, add analysis
6. **Quality Assurance**: Detects unused dependencies
7. **Rich Insights**: Deep understanding of module relationships

### Disadvantages

1. **Analysis Overhead**: Build-time performance impact
2. **False Positives**: May suggest unnecessary dependencies
3. **Configuration Complexity**: Tuning analysis parameters
4. **Dual Mental Model**: Capabilities + content analysis
5. **Non-Deterministic**: Analysis results may vary

### Cost-Benefit Analysis

| Aspect | Cost | Benefit | Net Value |
|--------|------|---------|-----------|
| **Implementation** | High | Self-maintaining system | Positive |
| **Maintenance** | Low | Auto-discovery reduces work | Very Positive |
| **Runtime Performance** | High during build | None at runtime | Neutral |
| **Type Safety** | Medium | Some type checking | Neutral |
| **Developer Experience** | Complex but powerful | Smart assistance | Positive |
| **Accuracy** | Medium | Self-correcting | Positive |

---

## Hybrid C: Import-Based + Persona Override

### Overview

This hybrid uses TypeScript imports for type-safe default dependencies, with persona-level configuration to override or extend these defaults for specific use cases.

```typescript
// Module uses imports for compile-time dependencies
import { errorHandling } from '@principle/error-handling.module.js';
import { authentication } from '@technology/security/auth.module.js';

export const apiSecurity: Module = {
  id: 'technology/security/api-security',
  basedOn: [errorHandling.id, authentication.id], // Type-safe references
  // Compile-time verified dependencies
};

// Persona can override at composition time
export const customPersona: Persona = {
  id: 'custom-backend',
  modules: ['api-security', 'error-handling', 'custom-auth'],
  overrides: {
    'api-security': {
      replace: {
        'authentication': 'custom-auth'  // Replace default auth
      },
      add: ['rate-limiting', 'monitoring'],
      remove: ['default-logging']
    }
  }
};
```

### Implementation

```typescript
class ImportOverrideManager {
  private importGraph: Map<string, ImportInfo> = new Map();
  private overrideRules: Map<string, OverrideRules> = new Map();

  constructor(private registry: ModuleRegistry) {
    this.buildImportGraph();
  }

  // Build import dependency graph from modules
  private async buildImportGraph(): Promise<void> {
    for (const module of this.registry.getAllModules()) {
      const imports = await this.analyzeImports(module);

      this.importGraph.set(module.id, {
        moduleId: module.id,
        imports: imports.map(i => i.moduleId),
        importedBy: [],  // Will be filled in second pass
        compiledDependencies: module.basedOn || []
      });
    }

    // Second pass: build reverse dependencies
    for (const [moduleId, info] of this.importGraph) {
      for (const imported of info.imports) {
        const importedInfo = this.importGraph.get(imported);
        if (importedInfo) {
          importedInfo.importedBy.push(moduleId);
        }
      }
    }
  }

  // Analyze TypeScript imports for a module
  private async analyzeImports(module: Module): Promise<Import[]> {
    // In real implementation, this would parse the TypeScript file
    // For now, using the basedOn field as proxy for imports
    return (module.basedOn || []).map(id => ({
      moduleId: id,
      type: 'static',
      isTypeOnly: false
    }));
  }

  // Apply persona overrides to module dependencies
  applyOverrides(
    persona: Persona,
    overrides: PersonaOverrides
  ): ResolvedPersona {
    const resolved: ResolvedPersona = {
      id: persona.id,
      name: persona.name,
      modules: new Map(),
      dependencies: new Map(),
      overrideLog: []
    };

    // First pass: collect all modules with their base dependencies
    for (const moduleId of persona.modules) {
      const module = this.registry.getModule(moduleId);
      const importInfo = this.importGraph.get(moduleId);

      if (!module || !importInfo) {
        throw new Error(`Module ${moduleId} not found`);
      }

      // Start with compiled dependencies
      const deps = new Set(importInfo.compiledDependencies);

      // Apply overrides if present
      const moduleOverrides = overrides[moduleId];
      if (moduleOverrides) {
        // Apply replacements
        for (const [original, replacement] of Object.entries(moduleOverrides.replace || {})) {
          if (deps.delete(original)) {
            deps.add(replacement);
            resolved.overrideLog.push({
              type: 'replace',
              module: moduleId,
              original,
              replacement,
              reason: moduleOverrides.reason
            });
          }
        }

        // Apply additions
        for (const addition of moduleOverrides.add || []) {
          deps.add(addition);
          resolved.overrideLog.push({
            type: 'add',
            module: moduleId,
            dependency: addition,
            reason: moduleOverrides.reason
          });
        }

        // Apply removals
        for (const removal of moduleOverrides.remove || []) {
          if (deps.delete(removal)) {
            resolved.overrideLog.push({
              type: 'remove',
              module: moduleId,
              dependency: removal,
              reason: moduleOverrides.reason
            });
          }
        }
      }

      resolved.modules.set(moduleId, module);
      resolved.dependencies.set(moduleId, [...deps]);
    }

    // Validate override consistency
    this.validateOverrides(resolved);

    return resolved;
  }

  // Validate that overrides don't break the system
  private validateOverrides(resolved: ResolvedPersona): void {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check all dependencies are available
    const availableModules = new Set(resolved.modules.keys());

    for (const [moduleId, deps] of resolved.dependencies) {
      for (const dep of deps) {
        if (!availableModules.has(dep) && !this.registry.getModule(dep)) {
          errors.push(`Module '${moduleId}' depends on unavailable '${dep}'`);
        }
      }
    }

    // Check for circular dependencies after overrides
    const cycles = this.detectCycles(resolved.dependencies);
    if (cycles.length > 0) {
      for (const cycle of cycles) {
        errors.push(`Circular dependency: ${cycle.join(' -> ')}`);
      }
    }

    // Check for type compatibility (if possible)
    for (const override of resolved.overrideLog) {
      if (override.type === 'replace') {
        const original = this.registry.getModule(override.original!);
        const replacement = this.registry.getModule(override.replacement!);

        if (original && replacement) {
          // Check capability compatibility
          const originalCaps = new Set(original.capabilities);
          const replacementCaps = new Set(replacement.capabilities);

          const missing = [...originalCaps].filter(c => !replacementCaps.has(c));
          if (missing.length > 0) {
            warnings.push(
              `Replacement '${override.replacement}' missing capabilities: ${missing.join(', ')}`
            );
          }
        }
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Override validation failed', errors, warnings);
    }

    if (warnings.length > 0) {
      console.warn('Override warnings:', warnings);
    }
  }

  // Detect circular dependencies in the graph
  private detectCycles(
    dependencies: Map<string, string[]>
  ): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    function dfs(moduleId: string, path: string[]): void {
      visited.add(moduleId);
      recursionStack.add(moduleId);
      path.push(moduleId);

      const deps = dependencies.get(moduleId) || [];
      for (const dep of deps) {
        if (!visited.has(dep)) {
          dfs(dep, [...path]);
        } else if (recursionStack.has(dep)) {
          // Found a cycle
          const cycleStart = path.indexOf(dep);
          cycles.push([...path.slice(cycleStart), dep]);
        }
      }

      recursionStack.delete(moduleId);
    }

    for (const moduleId of dependencies.keys()) {
      if (!visited.has(moduleId)) {
        dfs(moduleId, []);
      }
    }

    return cycles;
  }

  // Generate override suggestions based on usage patterns
  suggestOverrides(
    persona: Persona,
    context: OverrideContext
  ): OverrideSuggestion[] {
    const suggestions: OverrideSuggestion[] = [];

    for (const moduleId of persona.modules) {
      const importInfo = this.importGraph.get(moduleId);
      if (!importInfo) continue;

      // Suggest replacements for deprecated modules
      for (const dep of importInfo.compiledDependencies) {
        const depModule = this.registry.getModule(dep);

        if (depModule?.metadata.deprecated) {
          suggestions.push({
            type: 'replace',
            module: moduleId,
            original: dep,
            suggested: depModule.metadata.replacedBy,
            reason: `Module '${dep}' is deprecated`,
            confidence: 1.0
          });
        }
      }

      // Suggest additions based on common patterns
      const patterns = this.findCommonPatterns(moduleId);

      for (const pattern of patterns) {
        if (!importInfo.compiledDependencies.includes(pattern.dependency)) {
          suggestions.push({
            type: 'add',
            module: moduleId,
            suggested: pattern.dependency,
            reason: `Commonly used with ${moduleId} (${pattern.frequency}% of cases)`,
            confidence: pattern.frequency / 100
          });
        }
      }

      // Suggest removals for unused dependencies
      const usage = this.analyzeDependencyUsage(moduleId);

      for (const dep of importInfo.compiledDependencies) {
        if (!usage.has(dep)) {
          suggestions.push({
            type: 'remove',
            module: moduleId,
            target: dep,
            reason: 'Dependency appears unused',
            confidence: 0.6
          });
        }
      }
    }

    // Context-specific suggestions
    if (context.environment === 'production') {
      // Suggest removing dev dependencies
      suggestions.push(...this.suggestProductionOptimizations(persona));
    }

    if (context.performance === 'critical') {
      // Suggest lightweight alternatives
      suggestions.push(...this.suggestLightweightAlternatives(persona));
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  // Generate TypeScript declarations for overrides
  generateOverrideTypes(persona: Persona): string {
    const lines: string[] = [
      `// Auto-generated override types for ${persona.name}`,
      `interface ${persona.id}Overrides {`
    ];

    for (const moduleId of persona.modules) {
      const importInfo = this.importGraph.get(moduleId);
      if (!importInfo) continue;

      lines.push(`  '${moduleId}'?: {`);

      if (importInfo.compiledDependencies.length > 0) {
        lines.push(`    replace?: {`);
        for (const dep of importInfo.compiledDependencies) {
          lines.push(`      '${dep}'?: string;`);
        }
        lines.push(`    };`);
      }

      lines.push(`    add?: string[];`);
      lines.push(`    remove?: Array<${importInfo.compiledDependencies.map(d => `'${d}'`).join(' | ')}>;`);
      lines.push(`    reason?: string;`);
      lines.push(`  };`);
    }

    lines.push('}');
    return lines.join('\n');
  }

  // Build-time optimization
  async optimizeBuild(
    persona: Persona,
    overrides: PersonaOverrides
  ): Promise<OptimizedBuild> {
    const resolved = this.applyOverrides(persona, overrides);
    const build: OptimizedBuild = {
      modules: [],
      dependencies: new Map(),
      imports: [],
      bundles: []
    };

    // Topological sort for correct load order
    const sorted = this.topologicalSort(resolved.dependencies);

    // Generate optimized imports
    for (const moduleId of sorted) {
      const module = resolved.modules.get(moduleId)!;
      const deps = resolved.dependencies.get(moduleId)!;

      build.modules.push(module);
      build.dependencies.set(moduleId, deps);

      // Generate import statements
      for (const dep of deps) {
        const depModule = this.registry.getModule(dep);
        if (depModule) {
          build.imports.push({
            from: moduleId,
            to: dep,
            type: 'static',
            path: this.getImportPath(moduleId, dep)
          });
        }
      }
    }

    // Create bundles for optimization
    build.bundles = this.createBundles(build.modules, build.dependencies);

    return build;
  }

  // Topological sort for dependency order
  private topologicalSort(
    dependencies: Map<string, string[]>
  ): string[] {
    const sorted: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    function visit(moduleId: string): void {
      if (visited.has(moduleId)) return;
      if (visiting.has(moduleId)) {
        throw new Error(`Circular dependency detected at ${moduleId}`);
      }

      visiting.add(moduleId);

      const deps = dependencies.get(moduleId) || [];
      for (const dep of deps) {
        visit(dep);
      }

      visiting.delete(moduleId);
      visited.add(moduleId);
      sorted.push(moduleId);
    }

    for (const moduleId of dependencies.keys()) {
      visit(moduleId);
    }

    return sorted;
  }
}
```

### Real-World Example

```typescript
// base-auth.module.ts - Default authentication module
import { Module } from 'ums-lib';
import { errorHandling } from '@principle/error-handling.module';
import { cryptography } from '@technology/security/crypto.module';

export const baseAuth: Module = {
  id: 'technology/security/base-auth',
  basedOn: [errorHandling.id, cryptography.id],
  capabilities: ['authentication', 'session-management']
};

// api-server.module.ts - Uses base auth by default
import { Module } from 'ums-lib';
import { baseAuth } from '@technology/security/base-auth.module';
import { rateLimit } from '@technology/security/rate-limit.module';

export const apiServer: Module = {
  id: 'execution/api/server',
  basedOn: [baseAuth.id, rateLimit.id],
  capabilities: ['api-server', 'request-handling']
};

// enterprise-persona.ts - Override with enterprise auth
export const enterprisePersona: Persona = {
  id: 'enterprise-backend',
  name: 'Enterprise Backend Developer',
  modules: [
    'execution/api/server',
    'technology/security/base-auth',
    'technology/security/enterprise-auth',  // Advanced auth module
    'technology/security/rate-limit'
  ],
  overrides: {
    'execution/api/server': {
      replace: {
        'technology/security/base-auth': 'technology/security/enterprise-auth'
      },
      add: [
        'technology/monitoring/apm',  // Add APM for enterprise
        'technology/security/audit-logging'
      ],
      reason: 'Enterprise requirements need advanced authentication and monitoring'
    }
  }
};

// Generated resolution
const resolved = manager.applyOverrides(enterprisePersona, enterprisePersona.overrides);
/* Result:
{
  modules: Map { ... },
  dependencies: Map {
    'execution/api/server' => [
      'technology/security/enterprise-auth',  // Replaced
      'technology/security/rate-limit',
      'technology/monitoring/apm',            // Added
      'technology/security/audit-logging'     // Added
    ]
  },
  overrideLog: [
    { type: 'replace', module: 'execution/api/server',
      original: 'base-auth', replacement: 'enterprise-auth' },
    { type: 'add', module: 'execution/api/server',
      dependency: 'apm' },
    { type: 'add', module: 'execution/api/server',
      dependency: 'audit-logging' }
  ]
}
*/

// Type-safe override configuration
const overrideConfig: EnterpriseBackendOverrides = {
  'execution/api/server': {
    replace: {
      'technology/security/base-auth': 'technology/security/enterprise-auth'
      // TypeScript ensures only valid dependencies can be replaced
    },
    add: ['technology/monitoring/apm'],
    // remove: ['invalid-dep']  // TypeScript error: not in original deps
  }
};
```

### Advantages

1. **Type Safety**: Full TypeScript support for dependencies
2. **Compile-Time Validation**: Import errors caught at build
3. **IDE Support**: Autocomplete, refactoring, navigation
4. **Flexible Customization**: Personas can adapt modules
5. **Clear Defaults**: Modules have sensible defaults
6. **Override Tracking**: All changes logged and traceable
7. **Gradual Migration**: Can start with imports, add overrides

### Disadvantages

1. **Build Complexity**: Requires TypeScript build pipeline
2. **Dual Configuration**: Dependencies in two places
3. **Override Conflicts**: Complex override rules can conflict
4. **Learning Curve**: Must understand both systems
5. **File System Coupling**: Imports tie to directory structure

### Cost-Benefit Analysis

| Aspect | Cost | Benefit | Net Value |
|--------|------|---------|-----------|
| **Implementation** | High | Excellent type safety | Positive |
| **Maintenance** | Medium | IDE automation helps | Positive |
| **Runtime Performance** | Low | Compiled dependencies | Very Positive |
| **Type Safety** | Excellent | Full TypeScript | Very Positive |
| **Developer Experience** | Complex | Powerful and familiar | Positive |
| **Flexibility** | Very High | Complete control | Very Positive |

---

## Hybrid D: Layered Dependencies

### Overview

This hybrid implements a three-layer dependency system: core dependencies (required), recommended dependencies (suggested), and contextual dependencies (environment-specific).

```typescript
export const apiModule: Module = {
  id: 'execution/api/implementation',
  // Layer 1: Core dependencies (always required)
  dependencies: {
    core: ['error-handling', 'logging'],

    // Layer 2: Recommended (suggested but optional)
    recommended: ['monitoring', 'tracing'],

    // Layer 3: Contextual (environment-specific)
    contextual: {
      production: ['rate-limiting', 'caching'],
      development: ['debug-tools', 'hot-reload'],
      testing: ['mocks', 'test-fixtures']
    }
  }
};
```

### Implementation

```typescript
class LayeredDependencyManager {
  private registry: ModuleRegistry;
  private contextProviders: Map<string, ContextProvider> = new Map();

  constructor(registry: ModuleRegistry) {
    this.registry = registry;
    this.registerContextProviders();
  }

  // Register context detection providers
  private registerContextProviders(): void {
    // Environment context
    this.contextProviders.set('environment', {
      name: 'environment',
      detect: () => process.env.NODE_ENV || 'development',
      priority: 1
    });

    // Scale context
    this.contextProviders.set('scale', {
      name: 'scale',
      detect: () => {
        const userCount = this.estimateUserCount();
        if (userCount > 10000) return 'enterprise';
        if (userCount > 1000) return 'medium';
        return 'small';
      },
      priority: 2
    });

    // Performance context
    this.contextProviders.set('performance', {
      name: 'performance',
      detect: () => {
        const requirements = this.getPerformanceRequirements();
        if (requirements.responseTime < 100) return 'critical';
        if (requirements.responseTime < 500) return 'standard';
        return 'relaxed';
      },
      priority: 3
    });
  }

  // Resolve dependencies for all layers
  resolveLayers(
    module: Module,
    context: Context
  ): LayeredResolution {
    const resolution: LayeredResolution = {
      core: this.resolveCore(module),
      recommended: this.resolveRecommended(module),
      contextual: this.resolveContextual(module, context),
      final: new Set<string>(),
      layers: {
        included: new Map(),
        excluded: new Map(),
        deferred: new Map()
      }
    };

    // Combine layers based on strategy
    this.combineLayers(resolution, context);

    return resolution;
  }

  // Resolve core dependencies
  private resolveCore(module: Module): CoreResolution {
    const core = module.dependencies?.core || [];
    const resolution: CoreResolution = {
      satisfied: [],
      missing: [],
      conflicts: []
    };

    for (const dep of core) {
      const depModule = this.registry.getModule(dep);

      if (!depModule) {
        resolution.missing.push({
          dependency: dep,
          severity: 'error',
          message: `Core dependency '${dep}' not found`
        });
      } else {
        resolution.satisfied.push({
          dependency: dep,
          module: depModule,
          layer: 'core'
        });
      }
    }

    return resolution;
  }

  // Resolve recommended dependencies
  private resolveRecommended(module: Module): RecommendedResolution {
    const recommended = module.dependencies?.recommended || [];
    const resolution: RecommendedResolution = {
      available: [],
      unavailable: [],
      alternatives: new Map()
    };

    for (const dep of recommended) {
      const depModule = this.registry.getModule(dep);

      if (depModule) {
        resolution.available.push({
          dependency: dep,
          module: depModule,
          layer: 'recommended',
          benefit: this.assessBenefit(depModule)
        });
      } else {
        // Find alternatives
        const alternatives = this.findAlternatives(dep);

        resolution.unavailable.push(dep);
        if (alternatives.length > 0) {
          resolution.alternatives.set(dep, alternatives);
        }
      }
    }

    return resolution;
  }

  // Resolve contextual dependencies
  private resolveContextual(
    module: Module,
    context: Context
  ): ContextualResolution {
    const contextual = module.dependencies?.contextual || {};
    const resolution: ContextualResolution = {
      applicable: [],
      inapplicable: [],
      conditional: []
    };

    for (const [contextKey, deps] of Object.entries(contextual)) {
      const matches = this.contextMatches(contextKey, context);

      for (const dep of deps) {
        const depModule = this.registry.getModule(dep);

        if (matches.exact) {
          resolution.applicable.push({
            dependency: dep,
            module: depModule,
            context: contextKey,
            layer: 'contextual',
            confidence: matches.confidence
          });
        } else if (matches.partial) {
          resolution.conditional.push({
            dependency: dep,
            module: depModule,
            context: contextKey,
            condition: matches.condition,
            confidence: matches.confidence
          });
        } else {
          resolution.inapplicable.push({
            dependency: dep,
            context: contextKey,
            reason: matches.reason
          });
        }
      }
    }

    return resolution;
  }

  // Combine layers into final resolution
  private combineLayers(
    resolution: LayeredResolution,
    context: Context
  ): void {
    // Always include core
    for (const dep of resolution.core.satisfied) {
      resolution.final.add(dep.dependency);
      resolution.layers.included.set(dep.dependency, 'core');
    }

    // Include recommended based on strategy
    if (context.strategy === 'comprehensive') {
      for (const dep of resolution.recommended.available) {
        resolution.final.add(dep.dependency);
        resolution.layers.included.set(dep.dependency, 'recommended');
      }
    } else if (context.strategy === 'minimal') {
      // Skip recommended
      for (const dep of resolution.recommended.available) {
        resolution.layers.excluded.set(dep.dependency, 'strategy:minimal');
      }
    } else {
      // Balanced: include high-benefit recommendations
      for (const dep of resolution.recommended.available) {
        if (dep.benefit.score > 0.7) {
          resolution.final.add(dep.dependency);
          resolution.layers.included.set(dep.dependency, 'recommended:high-benefit');
        } else {
          resolution.layers.deferred.set(dep.dependency, 'recommended:low-benefit');
        }
      }
    }

    // Include applicable contextual
    for (const dep of resolution.contextual.applicable) {
      if (dep.confidence > 0.8) {
        resolution.final.add(dep.dependency);
        resolution.layers.included.set(dep.dependency, `contextual:${dep.context}`);
      } else {
        resolution.layers.deferred.set(
          dep.dependency,
          `contextual:low-confidence:${dep.confidence}`
        );
      }
    }

    // Handle conditional contextual
    for (const dep of resolution.contextual.conditional) {
      if (this.evaluateCondition(dep.condition, context)) {
        resolution.final.add(dep.dependency);
        resolution.layers.included.set(
          dep.dependency,
          `contextual:conditional:${dep.context}`
        );
      }
    }
  }

  // Generate layer visualization
  visualizeLayers(
    module: Module,
    context: Context
  ): LayerVisualization {
    const resolution = this.resolveLayers(module, context);

    return {
      module: module.id,
      context,
      layers: {
        core: {
          count: resolution.core.satisfied.length,
          modules: resolution.core.satisfied.map(d => d.dependency),
          status: resolution.core.missing.length > 0 ? 'error' : 'satisfied'
        },
        recommended: {
          count: resolution.recommended.available.length,
          modules: resolution.recommended.available.map(d => d.dependency),
          included: [...resolution.layers.included.entries()]
            .filter(([_, layer]) => layer.startsWith('recommended'))
            .map(([dep, _]) => dep),
          excluded: [...resolution.layers.excluded.entries()]
            .filter(([_, reason]) => reason.includes('recommended'))
            .map(([dep, _]) => dep)
        },
        contextual: {
          count: resolution.contextual.applicable.length,
          modules: resolution.contextual.applicable.map(d => d.dependency),
          contexts: [...new Set(resolution.contextual.applicable.map(d => d.context))]
        }
      },
      final: [...resolution.final],
      statistics: {
        totalDependencies: resolution.final.size,
        corePercentage: (resolution.core.satisfied.length / resolution.final.size) * 100,
        recommendedPercentage: this.calculateLayerPercentage(resolution, 'recommended'),
        contextualPercentage: this.calculateLayerPercentage(resolution, 'contextual')
      }
    };
  }

  // Build configuration generator
  generateBuildConfig(
    modules: Module[],
    context: Context
  ): BuildConfiguration {
    const config: BuildConfiguration = {
      context,
      modules: new Map(),
      dependencies: new Map(),
      layers: {
        core: new Set(),
        recommended: new Set(),
        contextual: new Set()
      },
      optimizations: []
    };

    for (const module of modules) {
      const resolution = this.resolveLayers(module, context);

      config.modules.set(module.id, module);
      config.dependencies.set(module.id, [...resolution.final]);

      // Aggregate layers
      for (const dep of resolution.core.satisfied) {
        config.layers.core.add(dep.dependency);
      }

      for (const dep of resolution.recommended.available) {
        if (resolution.final.has(dep.dependency)) {
          config.layers.recommended.add(dep.dependency);
        }
      }

      for (const dep of resolution.contextual.applicable) {
        if (resolution.final.has(dep.dependency)) {
          config.layers.contextual.add(dep.dependency);
        }
      }
    }

    // Generate optimizations
    if (context.environment === 'production') {
      config.optimizations.push({
        type: 'tree-shaking',
        target: 'recommended',
        description: 'Remove unused recommended dependencies'
      });

      config.optimizations.push({
        type: 'minification',
        target: 'all',
        description: 'Minify all modules'
      });
    }

    if (context.performance === 'critical') {
      config.optimizations.push({
        type: 'lazy-loading',
        target: 'contextual',
        description: 'Lazy load contextual dependencies'
      });
    }

    return config;
  }
}
```

### Real-World Example

```typescript
// api-server.module.ts with layered dependencies
export const apiServer: Module = {
  id: 'execution/api/server',
  dependencies: {
    // Always required
    core: [
      'principle/error-handling',
      'technology/nodejs/express',
      'technology/security/cors'
    ],

    // Suggested additions
    recommended: [
      'technology/monitoring/metrics',
      'technology/logging/structured-logging',
      'technology/documentation/openapi'
    ],

    // Environment-specific
    contextual: {
      production: [
        'technology/security/rate-limiting',
        'technology/performance/caching',
        'technology/monitoring/apm'
      ],
      development: [
        'technology/dev-tools/hot-reload',
        'technology/dev-tools/error-overlay',
        'technology/debugging/source-maps'
      ],
      testing: [
        'technology/testing/supertest',
        'technology/mocking/nock',
        'technology/fixtures/test-database'
      ],
      enterprise: [
        'technology/security/sso',
        'technology/compliance/audit-logging',
        'technology/ha/clustering'
      ]
    }
  }
};

// Context detection
const context: Context = {
  environment: 'production',
  scale: 'enterprise',
  performance: 'critical',
  strategy: 'balanced'
};

// Resolution
const resolution = manager.resolveLayers(apiServer, context);
/* Result:
{
  core: {
    satisfied: [
      { dependency: 'principle/error-handling', layer: 'core' },
      { dependency: 'technology/nodejs/express', layer: 'core' },
      { dependency: 'technology/security/cors', layer: 'core' }
    ],
    missing: []
  },
  recommended: {
    available: [
      { dependency: 'technology/monitoring/metrics', benefit: { score: 0.9 } },
      { dependency: 'technology/logging/structured-logging', benefit: { score: 0.8 } }
    ]
  },
  contextual: {
    applicable: [
      { dependency: 'technology/security/rate-limiting', context: 'production', confidence: 1.0 },
      { dependency: 'technology/performance/caching', context: 'production', confidence: 1.0 },
      { dependency: 'technology/security/sso', context: 'enterprise', confidence: 1.0 }
    ]
  },
  final: Set {
    // Core (always)
    'principle/error-handling',
    'technology/nodejs/express',
    'technology/security/cors',
    // Recommended (high benefit)
    'technology/monitoring/metrics',
    'technology/logging/structured-logging',
    // Contextual (production + enterprise)
    'technology/security/rate-limiting',
    'technology/performance/caching',
    'technology/security/sso',
    'technology/compliance/audit-logging'
  }
}
*/
```

### Advantages

1. **Clear Priorities**: Core vs. optional dependencies explicit
2. **Context Awareness**: Adapts to environment automatically
3. **Flexible Strategy**: Different inclusion strategies supported
4. **Gradual Adoption**: Start with core, add layers over time
5. **Environment Optimization**: Only includes what's needed
6. **Benefit Analysis**: Recommendations based on value
7. **Production Ready**: Different configs for dev/staging/prod

### Disadvantages

1. **Complex Configuration**: Three layers to manage
2. **Context Detection**: Must implement context providers
3. **Decision Paralysis**: Many options for inclusion
4. **Testing Burden**: Multiple contexts to test
5. **Documentation Need**: Must document all layers

### Cost-Benefit Analysis

| Aspect | Cost | Benefit | Net Value |
|--------|------|---------|-----------|
| **Implementation** | Medium-High | Very flexible system | Positive |
| **Maintenance** | Medium | Clear organization | Positive |
| **Runtime Performance** | Low | Optimized for context | Very Positive |
| **Type Safety** | Medium | Can add types | Neutral |
| **Developer Experience** | Good | Intuitive layers | Positive |
| **Adaptability** | Excellent | Context-aware | Very Positive |

---

## Hybrid E: Progressive Enhancement

### Overview

This hybrid starts with minimal dependencies and progressively adds more based on runtime analysis, usage patterns, and performance metrics.

```typescript
export const module: Module = {
  id: 'technology/api/server',
  dependencies: {
    minimal: ['core-http'],  // Absolute minimum

    progressive: [
      { dependency: 'logging', trigger: 'on-error' },
      { dependency: 'monitoring', trigger: 'high-load' },
      { dependency: 'caching', trigger: 'performance-degradation' },
      { dependency: 'rate-limiting', trigger: 'abuse-detected' }
    ]
  }
};
```

### Implementation

[Implementation details for Progressive Enhancement would follow the same comprehensive pattern as above]

---

## Hybrid F: Contextual Resolution

### Overview

Dependencies are resolved differently based on the execution context (persona type, domain, industry, regulations).

```typescript
export const module: Module = {
  id: 'technology/data/storage',
  dependencies: {
    byContext: {
      'healthcare': ['hipaa-compliance', 'encryption-at-rest'],
      'finance': ['pci-compliance', 'audit-trail'],
      'startup': ['cost-optimization', 'simple-backup'],
      'enterprise': ['high-availability', 'disaster-recovery']
    }
  }
};
```

### Implementation

[Implementation details for Contextual Resolution would follow the same comprehensive pattern]

---

## Comparison Matrix

| Approach | Complexity | Flexibility | Type Safety | Performance | Maintenance | Best For |
|----------|------------|-------------|-------------|-------------|-------------|----------|
| **Hierarchy + Graph** | Medium-High | High | Medium | Excellent | Medium | Large systems with complex relationships |
| **Capabilities + Analysis** | High | Very High | Low | Medium (build) | Low | Self-maintaining systems |
| **Import + Override** | High | Very High | Excellent | Excellent | Medium | Type-safe enterprise systems |
| **Layered** | Medium | High | Medium | Excellent | Medium | Multi-environment deployments |
| **Progressive** | High | Very High | Low | Variable | High | Adaptive systems |
| **Contextual** | Medium | High | Medium | Excellent | Medium | Multi-tenant or regulated systems |

---

## Implementation Strategies

### Phased Rollout

1. **Phase 1**: Start with simplest hybrid (Hierarchy + Graph)
2. **Phase 2**: Add capability matching
3. **Phase 3**: Introduce overrides
4. **Phase 4**: Full context awareness

### Migration Path

```typescript
// Utility to migrate from single approach to hybrid
class HybridMigrator {
  migrate(
    modules: Module[],
    fromApproach: 'string-ids' | 'none',
    toHybrid: HybridType
  ): MigrationPlan {
    // Generate migration steps
    // Provide compatibility layer
    // Validate after migration
  }
}
```

---

## Recommendations

### Selection Criteria

Choose your hybrid based on:

1. **System Size**:
   - Small (<50 modules): Hierarchy + Graph
   - Medium (50-200): Capabilities + Analysis
   - Large (200+): Import + Override or Layered

2. **Team Expertise**:
   - TypeScript experts: Import + Override
   - Mixed team: Hierarchy + Graph
   - AI/ML experience: Capabilities + Analysis

3. **Requirements**:
   - Strict typing: Import + Override
   - Multi-environment: Layered
   - Self-maintaining: Capabilities + Analysis
   - Complex relationships: Hierarchy + Graph

### Best Practices

1. **Start Simple**: Begin with one primary approach, add secondary gradually
2. **Document Clearly**: Hybrid systems need excellent documentation
3. **Tool Support**: Build tooling for visualization and validation
4. **Test Thoroughly**: More complexity = more testing needed
5. **Monitor Usage**: Track which dependencies are actually used
6. **Regular Audits**: Review and optimize dependency configuration

## Conclusion

Hybrid approaches offer the best of multiple worlds but at the cost of increased complexity. The key is choosing the right combination for your specific needs and implementing it incrementally. The recommended approach for most projects is **Hierarchy + Graph**, as it provides a good balance of structure and flexibility without excessive complexity.