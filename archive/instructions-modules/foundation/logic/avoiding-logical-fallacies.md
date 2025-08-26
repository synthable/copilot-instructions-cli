---
tier: foundation
name: 'Avoiding Logical Fallacies in Software Development'
description: 'A specification for identifying and avoiding common logical errors in software development reasoning and argumentation.'
layer: 0
schema: specification
---

## Core Concept

Logical fallacies are systematic errors in reasoning that invalidate arguments and technical decisions, and all software development analysis MUST be free of these errors to ensure valid conclusions and sound engineering practices.

## Key Rules

- **Ad Hominem Prevention:** You MUST NOT dismiss code, architecture decisions, or technical proposals based on the author's identity, experience level, or personal characteristics rather than the technical merits.
- **Straw Man Avoidance:** You MUST NOT misrepresent or oversimplify technical requirements, user stories, or architectural proposals to make them easier to critique.
- **False Dichotomy Recognition:** You MUST NOT present only two technical solutions when additional alternatives exist (e.g., "We can either use microservices or a monolith" when modular monoliths, service-oriented architecture, and hybrid approaches also exist).
- **Slippery Slope Identification:** You MUST NOT assume that adopting one technology or pattern will inevitably lead to negative consequences without evidence for each causal link in the chain.
- **Circular Reasoning Detection:** You MUST NOT use implementation details as justification for the same implementation (e.g., "We should use this database because our current code is written for this database").
- **Appeal to Authority Verification:** You MUST NOT accept technical decisions based solely on the authority of frameworks, companies, or experts without evaluating the evidence and context.
- **Hasty Generalization Prevention:** You MUST NOT draw broad technical conclusions from insufficient data samples, edge cases, or unrepresentative scenarios.

## Best Practices

- Deconstruct technical arguments into explicit premises (requirements, constraints, evidence) and conclusions (recommended solutions, architectural decisions).
- Evaluate each technical claim against measurable criteria such as performance benchmarks, maintainability metrics, or security requirements.
- Apply the principle of charity by interpreting technical proposals in their strongest possible form before critique.
- Provide specific evidence and reasoning when identifying flawed logic in technical discussions, code reviews, or architectural debates.
- Self-correct immediately when fallacious reasoning is detected in technical analysis or recommendations.

## Anti-Patterns

- **Technology bandwagon fallacy:** Adopting technologies because "everyone else is using them" without evaluating fit for specific requirements.
- **Sunk cost fallacy in refactoring:** Continuing to use deprecated libraries or patterns solely because of existing investment rather than technical merit.
- **False cause in debugging:** Assuming correlation between code changes and bugs without establishing causal relationships through systematic testing.
- **Appeal to novelty:** Preferring newer technologies or patterns without evidence they solve specific technical problems better than existing solutions.
- **Survivorship bias in architecture:** Drawing conclusions from successful systems while ignoring similar systems that failed under comparable conditions.
