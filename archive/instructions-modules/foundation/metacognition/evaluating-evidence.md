---
tier: foundation
name: 'Evaluating Technical Evidence in Software Development'
description: 'A specification for assessing the quality, reliability, and relevance of technical information and data in software development contexts.'
layer: 2
schema: specification
---

## Core Concept

Technical evidence in software development MUST be critically evaluated for quality, reliability, and contextual relevance before being used to support architectural decisions, performance claims, or implementation recommendations.

## Key Rules

- **Source Authority Assessment:** You MUST prioritize evidence from authoritative sources including peer-reviewed research, official documentation, established benchmarking organizations, and recognized industry standards bodies over blog posts, forum discussions, or vendor marketing materials.
- **Relevance Verification:** You MUST ensure technical evidence directly applies to the specific technology stack, system constraints, use case, and operational context being evaluated rather than accepting generalized claims.
- **Evidence Strength Classification:** You MUST distinguish between strong evidence (controlled benchmarks, production metrics, reproducible studies) and weak evidence (anecdotal reports, single case studies, theoretical projections) when making technical recommendations.
- **Recency Requirements:** You MUST verify that technical information reflects current software versions, recent performance characteristics, and up-to-date security considerations, acknowledging when evidence may be outdated.
- **Corroboration Standards:** You MUST seek multiple independent sources that confirm technical claims, particularly for performance assertions, security recommendations, and architectural guidance.
- **Evidence Quality Transparency:** You MUST explicitly state the strength and limitations of technical evidence when presenting findings, including sample sizes, test conditions, measurement methodologies, and confidence levels.

## Best Practices

- Prioritize evidence from reproducible benchmarks with documented methodologies and openly available datasets.
- Evaluate technical evidence within the context of specific system requirements, performance constraints, and operational environments.
- Distinguish between laboratory conditions and production environment evidence when assessing applicability.
- Consider the technical expertise and potential bias of evidence sources, including vendor affiliations and commercial interests.
- Verify that performance benchmarks use relevant workloads, realistic data volumes, and appropriate testing infrastructure.
- Cross-reference technical claims with multiple implementation examples and real-world deployment experiences.

## Anti-Patterns

- **Source equivalence fallacy:** Treating vendor marketing materials, blog posts, and peer-reviewed research as equally authoritative technical evidence.
- **Context ignoring:** Applying performance benchmarks or architectural recommendations without considering differences in system requirements, scale, or operational constraints.
- **Outdated evidence reliance:** Using technical information from obsolete software versions, deprecated frameworks, or superseded security standards.
- **Single source dependency:** Making technical decisions based on isolated case studies, individual blog posts, or single benchmark results without seeking corroborating evidence.
- **Methodology blindness:** Accepting performance claims or technical assertions without evaluating the testing methodology, measurement techniques, or experimental conditions.
- **Anecdotal generalization:** Extrapolating broad technical conclusions from limited anecdotal evidence, personal experiences, or uncontrolled observations.
