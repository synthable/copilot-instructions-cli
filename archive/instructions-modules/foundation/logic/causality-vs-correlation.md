---
name: 'Causality vs. Correlation'
description: 'A critical rule to not assume that one event causes another just because they are correlated.'
tier: foundation
layer: 0
schema: specification
---

# Causality vs. Correlation

## Core Concept

Correlation indicates a statistical relationship between two variables, but it does NOT establish that one variable causes another. Causation requires evidence of a direct mechanism by which one variable influences another.

## Key Rules

- **Correlation Definition:** A statistical relationship where two variables tend to change together (positive correlation) or in opposite directions (negative correlation).
- **Causation Definition:** A relationship where changes in variable A directly produce changes in variable B through a identifiable mechanism.
- You MUST NOT use causal language ("causes," "leads to," "results in") when describing correlational relationships.
- You MUST explicitly test for confounding variables before inferring causation.
- You MUST propose a plausible causal mechanism to support any causal claim.

## Best Practices

- Use precise language: "A is associated with B" or "A correlates with B" instead of "A causes B."
- Apply Bradford Hill criteria for establishing causation: strength, consistency, temporality, biological gradient, plausibility.
- Consider experimental design: randomized controlled trials provide stronger causal evidence than observational studies.
- Examine temporal ordering: causes must precede effects in time.

## Anti-Patterns

- **Post Hoc Fallacy:** Assuming that because B follows A, A caused B.
- **Ignoring Confounding Variables:** Failing to consider that a third variable C might cause both A and B.
- **Reverse Causation:** Assuming A causes B when B actually causes A.
- **Spurious Correlation:** Mistaking coincidental relationships for meaningful ones (e.g., ice cream sales correlate with drowning deaths).
