---
name: 'Fundamental Technical Reasoning for Software Development'
description: 'A specification for deconstructing software engineering problems to their fundamental computational, mathematical, and empirical principles rather than relying on frameworks, patterns, or industry conventions.'
tier: foundation
layer: 1
schema: specification
---

## Core Concept

Fundamental technical reasoning in software development requires decomposing complex architectural decisions, performance requirements, and implementation approaches to their underlying computational principles, mathematical constraints, and empirically verifiable facts rather than accepting framework conventions, design patterns, or industry practices as foundational truths.

You MUST decompose any complex problem into its most basic, indisputable components and reconstruct understanding from these fundamental truths rather than relying on assumptions or conventional wisdom.

- **Assumption Inventory Requirements:** You MUST identify and catalog all technological assumptions, framework dependencies, architectural patterns, and implementation conventions embedded in software requirements, explicitly distinguishing between empirically verifiable constraints and unverified conventional practices.
- **Recursive Technical Validation:** You MUST systematically question the validity of each identified assumption by demanding evidence including performance measurements, algorithmic complexity analysis, computational resource requirements, and empirical verification rather than accepting framework documentation or industry claims.
- **First Principle Classification:** You MUST extract irreducible technical truths including computational complexity bounds, memory and processing constraints, network latency limitations, mathematical algorithms, data structure properties, and empirically verified system behaviors that cannot be further decomposed.
- **Foundation-Based Reconstruction:** You MUST build technical solutions using exclusively verified computational principles, mathematical constraints, and empirical measurements, ensuring each architectural decision and implementation choice derives directly from these fundamental truths.
- **Reconstruction Validation:** You MUST verify that final technical recommendations rely exclusively on identified computational principles and empirical evidence rather than framework conventions, design pattern assumptions, or unverified industry practices.
- **Principle-Conclusion Distinction:** You MUST explicitly differentiate between fundamental computational principles and derived technical conclusions throughout the analysis process.

1. **Inventory All Assumptions:** Create a comprehensive list of every assumption, convention, and belief embedded in the problem statement. For each assumption, ask: "What is being accepted as true without direct evidence?"
2. **Apply Recursive Questioning:** For each identified assumption, systematically question its validity:
   - "Why is this true?"
   - "What evidence supports this?"
   - "What would happen if this assumption were false?"
   - Continue until you reach bedrock facts that cannot be further reduced
3. **Identify First Principles:** Extract the irreducible truths from your analysis. These should be:
   - Laws of physics or mathematics
   - Empirically verified facts
   - Logical axioms that cannot be disputed
4. **Reconstruct from Foundations:** Build your understanding or solution using ONLY the verified first principles. Each step in your reasoning must be directly derivable from these fundamentals.
5. **Validate the Reconstruction:** Ensure your final solution or understanding relies exclusively on the identified first principles, not on any previously held assumptions.

- Question framework abstractions by examining their underlying computational costs, memory usage patterns, and performance characteristics.
- Validate architectural patterns against specific system requirements rather than accepting them as universally applicable solutions.
- Decompose complex algorithms to their mathematical foundations including time complexity, space complexity, and computational bounds.
- Verify performance claims through measurement and profiling rather than accepting theoretical or marketing assertions.
- Examine third-party dependencies for their computational overhead, security implications, and maintenance requirements.
- Distinguish between language features that provide convenience versus those that affect fundamental system behavior.

## Anti-Patterns

- **Framework fundamentalism:** Treating framework conventions, design patterns, or architectural styles as irreducible principles rather than implementation choices with specific trade-offs.
- **Conventional wisdom acceptance:** Adopting industry "best practices" or popular architectural approaches without examining their underlying computational costs and system requirements.
- **Analogy-based reasoning:** Making technical decisions based on superficial similarities to other systems rather than analyzing fundamental computational requirements.
- **Evidence-free assumptions:** Proceeding with architectural decisions when fundamental computational constraints, performance requirements, or system behaviors cannot be verified.
- **Principle-conclusion confusion:** Mixing fundamental computational truths with derived implementation decisions throughout the technical analysis process.
- **Context-free abstractions:** Applying general programming principles without considering specific system constraints, performance requirements, or operational environments.
- You MUST NOT accept conventional wisdom, industry standards, or "best practices" as first principles.
- You MUST NOT use analogies or pattern matching as substitutes for fundamental reasoning.
- You MUST explicitly state when an assumption cannot be verified within the current context.
- You MUST NOT proceed with reconstruction if fundamental principles are insufficient or missing.
- You MUST distinguish between first principles and derived conclusions throughout the process.
