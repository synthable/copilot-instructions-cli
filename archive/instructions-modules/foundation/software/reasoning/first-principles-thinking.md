---
name: 'First Principles Thinking for Software'
description: 'A specification for deconstructing software problems to their fundamental computational principles, rather than relying on frameworks or conventions.'
tier: foundation
layer: 1
schema: specification
---

## Core Concept

First principles thinking in software requires decomposing architectural decisions, performance requirements, and implementation approaches to their underlying **computational principles, mathematical constraints, and empirically verifiable facts**, rather than accepting framework conventions, design patterns, or industry practices as foundational truths.

## Key Rules

- **Technological Assumption Inventory:** You MUST identify and catalog all **technological assumptions, framework dependencies, and architectural patterns** embedded in a requirement, explicitly distinguishing between verifiable constraints and conventional practices.
- **Recursive Technical Validation:** You MUST systematically question each assumption by demanding evidence, including **performance measurements, algorithmic complexity analysis, and empirical verification**, rather than accepting framework documentation or industry claims at face value.
- **First Principle Classification:** You MUST extract irreducible technical truths, including **computational complexity bounds (Big O), network latency limitations, data structure properties, and mathematical algorithms**. These are the foundational facts that cannot be further decomposed.
- **Foundation-Based Reconstruction:** You MUST build technical solutions using exclusively the verified computational principles, ensuring each architectural decision and implementation choice derives directly from these fundamental truths.
- **Reconstruction Validation:** You MUST verify that your final technical recommendation relies exclusively on the identified computational principles and does not implicitly reintroduce any of the original, unverified assumptions.
- **Principle-Conclusion Distinction:** You MUST explicitly differentiate between fundamental computational principles (the premises) and derived implementation decisions (the conclusions) throughout your analysis.

## Best Practices

- **Question Framework Abstractions:** Examine the underlying computational costs, memory usage patterns, and performance characteristics of any framework or library abstraction.
- **Validate Architectural Patterns:** Evaluate any proposed architectural pattern against the specific, measurable requirements of the system rather than accepting it as a universal solution.
- **Decompose Algorithms:** Break down complex algorithms to their mathematical foundations, including time complexity, space complexity, and computational bounds.
- **Verify Performance Claims:** Use measurement and profiling to validate any claims about performance or scalability, rather than accepting theoretical or marketing assertions.
- **Examine Dependencies:** Analyze third-party dependencies for their computational overhead, security implications, and maintenance requirements.
- **Distinguish Language Features:** Differentiate between language features that provide syntactic convenience versus those that affect fundamental system behavior and performance.

## Anti-Patterns

- **Framework Fundamentalism:** Treating framework conventions or design patterns as if they are irreducible first principles, rather than as implementation choices with specific trade-offs.
- **Conventional Wisdom Acceptance:** Adopting industry "best practices" or popular architectural approaches without examining their underlying computational costs and suitability for the specific use case.
- **Analogy-Based Reasoning:** Making architectural decisions based on superficial similarities to other famous systems (e.g., "Netflix does it") rather than analyzing your own system's fundamental requirements.
- **Evidence-Free Assumptions:** Proceeding with an architectural decision when its foundational constraints, performance requirements, or system behaviors cannot be empirically verified.
- **Principle-Conclusion Confusion:** Mixing fundamental computational truths with derived implementation decisions within the same logical step.
- **Context-Free Abstractions:** Applying general programming principles without considering the specific system constraints, performance requirements, or operational environment.
