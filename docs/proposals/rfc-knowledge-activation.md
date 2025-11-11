# RFC: Knowledge Activation Component for UMS v2.0

- Status: Proposed
- Date: 2025-11-08
- Authors: UMS Team
- Target version: UMS v2.1 (feature-flagged in v2.0)
- Related docs: reusable-components-spec-addendum.md

## Summary

Introduce a new component type, Knowledge Activation, that allows a module (and optionally a persona) to declaratively activate a model's pre-trained knowledge of a specific concept without re-teaching it via tokens. This reduces prompt size, improves semantic consistency, and provides auditable, scoped control over concept activation.

## Motivation

Current components:
- Instruction: directs behavior and process
- Knowledge: (re)teaches concepts explicitly in tokens
- Data: provides structured reference

Gaps:
- Efficiently leverage latent model knowledge without full restatement
- Scope and gate concept activation by task phase/domains
- Provide confidence checks and safe fallbacks
- Measure token savings and activation effectiveness

## Goals (and Non-goals)

Goals:
- Declarative, compact activation of pre-trained concepts
- Scoped, idempotent, auditable activations with minimal token footprint
- Confidence probing and optional fallbacks
- Safe merging, deduplication, and conflict resolution across modules

Non-goals:
- Guarantee correctness without fallbacks (activation is an optimization)
- Implement complex runtime ontologies in this RFC (future work)

## Design Overview

Add a new component type: `KnowledgeActivationComponent` with fields to identify a concept, provide a minimal cue, specify scope, define a confidence strategy, and a fallback if activation appears insufficient.

Concept identifiers are stable slugs (e.g., `http.methods.idempotency`). Activations are evaluated early in the conversation or lazily before dependent instructions. Successful activation avoids injecting long explanations; fallback injects a minimal summary.

## Schema Changes

Extend `ComponentType` and union type.

```ts
export enum ComponentType {
  Instruction = 'instruction',
  Knowledge = 'knowledge',
  Data = 'data',
  KnowledgeActivation = 'knowledge-activation',
}

export interface KnowledgeActivationComponent {
  type: ComponentType.KnowledgeActivation;
  metadata?: ComponentMetadata;
  activation: {
    conceptId: string;
    aliases?: string[];
    purpose: string;
    minimalCue?: string;
    scope?: {
      phases?: Array<'analysis'|'planning'|'generation'|'validation'|'reflection'>;
      domains?: string[];
      tags?: string[];
      whenExpression?: string;
    };
    expectedCapabilities?: string[];
    confidenceStrategy?: {
      method: 'self-check' | 'probe-question' | 'embedding-cue-match' | 'none';
      probePrompt?: string;
      minScore?: number;
    };
    fallback?: {
      mode: 'inject-minimal-summary' | 'inject-detailed-summary' | 'abort' | 'warn';
      summary?: string;
      detailed?: string;
    };
    constraints?: Array<{ rule: string; notes?: string[] }>;
    metrics?: { track?: Array<'hit'|'miss'|'fallback'|'latency'|'token-saved'>; sampling?: number };
    priority?: number;
    experimental?: boolean;
  };
}

export type Component =
  | InstructionComponent
  | KnowledgeComponent
  | DataComponent
  | KnowledgeActivationComponent;
```

Validation notes:
- `conceptId` pattern: `/^[a-z0-9]+(\.[a-z0-9-]+)+$/`
- `minimalCue` optional; if missing and `confidenceStrategy.method === 'none'`, warn
- If `confidenceStrategy.method !== 'none'` and no `fallback`, warn
- Default `priority = 100`

## Rendering & Orchestration

Rendering should emit compact activation directives and avoid full knowledge restatement on activation hit. Suggested renderer options:
- `--render-activations=compact|verbose|hidden`
- Grouped section `### Knowledge Activation` or inline `[ACTIVATE conceptId]` directives

Orchestration flow (high level):
1. Evaluate scope (phases/domains/tags/whenExpression)
2. If confidence strategy defined, run probe (self-check, question, or embedding)
3. On success: record HIT, emit minimal cue (or none) and skip fallback
4. On failure: inject fallback summary once before first dependent instruction
5. Deduplicate repeated activations by `conceptId`; merge constraints/metadata

## Conflict Resolution

- Canonical activator: lowest `priority` wins; others merge expectedCapabilities and constraints
- Conflicting constraints (e.g., MUST vs MUST NOT) → validation error referencing `conceptId`
- Divergent fallbacks: keep canonical’s fallback; warn on others

## Metrics & Reporting

Optional logging (sampled): hits, misses, fallbacks, latency, estimated tokens saved.
Build report extension (non-breaking): include activation table per conceptId with counts and estimated savings.

## Authoring Examples

Minimal component inside a module:

```ts
import { ComponentType, type KnowledgeActivationComponent } from 'ums-lib';

export const idempotencyActivation: KnowledgeActivationComponent = {
  type: ComponentType.KnowledgeActivation,
  activation: {
    conceptId: 'http.methods.idempotency',
    purpose: 'Prime idempotency semantics prior to API design steps.',
    minimalCue: 'Recall canonical idempotent vs non-idempotent methods.',
    confidenceStrategy: { method: 'probe-question', probePrompt: 'Which HTTP methods are idempotent?', minScore: 0.7 },
    fallback: {
      mode: 'inject-minimal-summary',
      summary: 'Idempotent: GET, HEAD, PUT, DELETE, OPTIONS, TRACE. POST is non-idempotent; PATCH commonly non-idempotent unless constrained.',
    },
  },
};
```

Module using activation + instruction:

```ts
import { ComponentType, type Module } from 'ums-lib';
import { idempotencyActivation } from './components/idempotency.activation.js';

export const httpIdempotencyActivationModule: Module = {
  id: 'technology/http/idempotency-activation',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['api-quality', 'http-correctness'],
  cognitiveLevel: 3,
  metadata: { name: 'HTTP Idempotency Activation', description: 'Activate and enforce idempotency semantics', semantic: 'http idempotency rest verbs semantics' },
  components: [idempotencyActivation, {
    type: ComponentType.Instruction,
    instruction: {
      purpose: 'Design endpoints respecting idempotency',
      process: [
        'Identify all mutation endpoints',
        'Prefer PUT for full replacement; POST for creation where not idempotent',
        'Ensure DELETE is safe to repeat',
      ],
    },
  }],
};
```

## Alternatives Considered

1) Extend Knowledge component with `mode: 'define'|'activate'`  
- Pro: fewer enum additions  
- Con: mixed semantics, risk of misuse; weaker validation boundaries

2) Persona-level activation list  
- Pro: cross-module consolidation  
- Con: loses locality with dependent instructions; better as a later aggregation layer

## Risks & Mitigations

- Hallucination from vague cues → enforce discriminative minimalCue and add probe checks
- Prompt bloat from too many activations → hard cap + priority ordering + dedup
- Identifier collisions → optional concept registry and validation
- False positives on probes → allow multi-question or embedding-based checks with thresholds

## Rollout Plan

- Phase 0: Feature-flag parsing/validation/rendering; add tests
- Phase 1: CLI `analyze-knowledge` suggests activation candidates from large Knowledge blocks
- Phase 2: Build reports include activation metrics; promote to default
- Phase 3: Optional concept registry; docs and examples

## Open Questions

- Standardized concept registry format and distribution?
- Default probe strategies per model family?
- Where to host ontology (broaderThan/narrowerThan relations)?

## Appendix: Concept ID Pattern

`<domain>.<topic>[.<subtopic>...]` using lowercase, digits, and hyphens per segment. Examples:  
- `http.methods.idempotency`  
- `ml.evaluation.precision-recall`  
- `security.oauth2.pkce`
