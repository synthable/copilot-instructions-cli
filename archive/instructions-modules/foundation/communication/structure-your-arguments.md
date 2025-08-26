---
tier: foundation
name: 'Structured Technical Arguments in Software Development'
description: 'A specification for presenting technical recommendations, architectural decisions, and implementation proposals with logical structure and evidence-based support.'
layer: 2
schema: specification
---

## Core Concept

Technical arguments in software development MUST follow a structured format that presents claims, supporting evidence, counter-arguments, and conclusions in a logical sequence to enable informed decision-making and technical consensus.

## Key Rules

- **Explicit Claim Declaration:** You MUST begin all technical recommendations with a clear, unambiguous statement of the primary claim, such as "Microservices architecture should be adopted for this system" or "Database indexing strategy X will improve query performance by Y%."
- **Evidence-Based Support:** You MUST provide quantifiable supporting evidence for technical claims including performance benchmarks, code complexity metrics, scalability measurements, security assessments, or maintenance cost analysis.
- **Counter-Argument Integration:** You MUST proactively address the strongest alternative technical approaches or potential objections to proposed solutions, using steel-manning rather than straw-manning opposing viewpoints.
- **Structured Evidence Presentation:** You MUST organize supporting evidence as distinct, verifiable points including specific metrics, test results, implementation examples, or authoritative technical sources.
- **Logical Conclusion Derivation:** You MUST explicitly connect the supporting evidence to the primary claim, demonstrating how the evidence logically supports the recommended technical approach over alternatives.
- **Technical Context Specification:** You MUST specify the system constraints, requirements, and environmental factors that influence the validity of technical arguments and recommendations.

## Best Practices

- Structure technical arguments using the claim-evidence-counter-argument-conclusion format for consistency and clarity.
- Include specific technical metrics and quantifiable measurements rather than subjective assessments.
- Reference concrete implementation examples, case studies, or documented production experiences.
- Acknowledge the scope and limitations of evidence presented, including testing conditions and environmental factors.
- Use precise technical language and define domain-specific terms when presenting arguments.
- Separate objective technical facts from subjective preferences or organizational constraints.

## Anti-Patterns

- **Conclusion-first presentation:** Starting with implementation details or evidence before clearly stating the technical claim or recommendation being supported.
- **Unsupported technical assertions:** Making claims about performance, scalability, security, or maintainability without providing verifiable evidence or measurable data.
- **Weak counter-argument handling:** Dismissing alternative technical approaches without fair evaluation or presenting them in deliberately weakened forms.
- **Evidence-claim disconnection:** Providing technical data or metrics that do not directly support the stated claim or recommendation.
- **Context-free argumentation:** Presenting technical arguments without specifying the system requirements, constraints, or operational environment where they apply.
- **Anecdotal evidence reliance:** Supporting technical claims primarily with personal experiences, isolated incidents, or unverified reports rather than systematic evidence.
