---
tier: principle
name: "YAGNI (You Ain't Gonna Need It)"
description: 'The principle of not adding functionality until it is demonstrably necessary to avoid over-engineering.'
tier: principle
schema: pattern
layer: null
authors: []
---

## Summary

YAGNI (You Ain't Gonna Need It) is a core principle of Extreme Programming (XP) that states a developer should not add functionality until it is demonstrably necessary. It is a strategy for avoiding waste and over-engineering by focusing exclusively on the immediate, concrete requirements.

## Core Principles

- **Solve the Immediate Problem:** Only write code that is required to solve the current, well-defined problem.
- **Delay Abstraction:** Do not build abstract frameworks or complex designs to accommodate future problems that are only speculative.
- **Trust in Refactoring:** Rely on the ability to refactor the code later when a new, concrete requirement emerges. Simple code is easier to change than complex, speculative code.

## Advantages / Use Cases

- **Increased Development Speed:** Avoids time spent on developing, testing, and documenting features that are never used.
- **Reduced Code Complexity:** Results in a simpler, smaller, and more maintainable codebase.
- **Focus on Value:** Ensures that all development effort is directed towards delivering immediate, tangible value.

## Disadvantages / Trade-offs

- **Potential for Rework:** May require significant refactoring if a new requirement is architecturally incompatible with the simple solution.
- **Risk of Local Optima:** A series of simple solutions might not lead to the best global design in the long run without careful refactoring.
- **Misinterpretation:** Can be incorrectly used to justify avoiding necessary design foresight or writing low-quality, hard-to-change code.
