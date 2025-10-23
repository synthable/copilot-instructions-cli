# ADR 0004: Machine-First Module Architecture

**Status:** Proposed
**Date:** 2025-10-14
**Context:** Resolving the design tension between human-readability and machine-executability in UMS modules.

## Context

UMS modules have three audiences: the executing AI agent, human authors/maintainers, and humans learning the system.

The previous de-facto design philosophy conflated these use cases, optimizing for human readability by embedding rich, narrative, and pedagogical content directly within the executable `.module.ts` files. The `analogical-reasoning` module, with its verbose, textbook-like `Knowledge` component, is a prime example of this pattern.

This approach has several critical flaws:
- **High Token Overhead:** Loading narrative prose into an AI's context window is inefficient and costly.
- **Inefficient Parsing:** The AI must parse natural language to extract data structures that should have been explicit.
- **Violation of Separation of Concerns:** The executable artifact is burdened with also being its own tutorial.

This creates a system that becomes less performant as it becomes more knowledgeable.

## Decision

Adopt a **Machine-First** architecture for all UMS modules. This principle is defined by the following rules:

1.  **Primary Use Case:** The primary purpose of a `.module.ts` file is to be an efficient, machine-executable artifact. Human comprehension is a critical but secondary concern.

2.  **Data-Driven Structure:** Module content, especially within the `Knowledge` and `Data` components, must be highly structured, terse, and data-driven. Narrative prose should be eliminated in favor of explicit data structures (e.g., JSON-style objects).

3.  **Separation of Documentation:** All pedagogical content—including rich explanations, narrative examples, and design rationale—must be located in a separate documentation layer (e.g., a corresponding `README.md` file), not in the module itself.

4.  **Explicit Linking:** The module file should contain a non-executable metadata field (e.g., `documentationUrl`) that links to its human-readable documentation.

## Decision Rationale

### 1. Primary Use Case Optimization
A system must be optimized for its primary consumer. The primary consumer of UMS modules is the AI agent. This decision aligns the architecture with its primary use case: execution.

### 2. Scalability and Performance
A machine-first approach dramatically reduces the token overhead of each module. This is critical for the scalability and performance of the AI, allowing it to load and reason over a larger number of modules without performance degradation.

### 3. Separation of Concerns
This decision enforces a foundational software engineering principle: separating executable code from its documentation. The module becomes the `tool`, and the documentation becomes the `manual`. This allows each to excel at its purpose without compromising the other.

### 4. Maintainability and Consistency
A strict, data-driven schema is easier to validate, test, and maintain than free-form prose. It enforces a beneficial discipline on module authors, leading to greater consistency and clarity across the entire module library.

## Consequences

### Positive
- ✅ Drastically reduced token overhead for AI context loading.
- ✅ Faster, more reliable, and less ambiguous parsing of modules.
- ✅ Clear separation between executable artifacts and human-readable documentation.
- ✅ Enforces a consistent, data-oriented structure across all modules.
- ✅ Enables a richer documentation layer (e.g., with diagrams) unconstrained by module syntax.

### Negative
- ⚠️ Requires a significant, one-time refactoring effort for all existing modules.
- ⚠️ Module files are no longer self-contained, human-readable tutorials.
- ⚠️ Increases authoring discipline, requiring management of both the module file and its separate documentation.

## Alternatives Considered

### Alternative 1: Maintain Hybrid Architecture
This approach, the prior status quo, involves keeping rich, narrative content co-located with the executable structure. It optimizes for modules that are self-documenting and easy for humans to read linearly.

**Rejected because:** It fundamentally prioritizes a secondary use case (human reading) over the primary use case (machine execution). This leads to poor scalability, high performance costs, and inefficient parsing, making it an untenable foundation for a serious AI reasoning system.

## Notes

- This ADR affirms that the structured `Data` component in the `systematic-debugging` module is a better pattern than the catalog-style `Data` component in the `analogical-reasoning` module.
- A follow-up task should be to define and enforce a strict JSON schema for the structured `Knowledge` components.

## References

- Related: This decision impacts all existing and future UMS modules.
