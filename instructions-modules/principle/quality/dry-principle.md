---
name: "DRY (Don't Repeat Yourself) Principle"
description: 'A fundamental principle requiring that every piece of knowledge, logic, or data must have a single, unambiguous, authoritative representation within a system.'
tier: principle
layer: null
schema: pattern
---

## Summary

The DRY (Don't Repeat Yourself) principle is a fundamental software development philosophy that mandates every piece of knowledge must have a single, unambiguous, authoritative representation within a system. This applies not only to code logic but also to data schemas, configuration, and documentation (where it is often called Single Source of Truth or SSoT).

## Core Principles

- **Knowledge Singularity:** Every distinct piece of knowledge in a system—be it business logic, a data definition, or a configuration value—MUST exist in exactly one authoritative location.
- **Code Abstraction:** Repetitive code logic MUST be extracted into reusable abstractions such as functions, classes, or modules.
- **Data Normalization (SSoT):** Data entities MUST be stored in exactly one location. Other parts of the system MUST reference this data, not duplicate it.
- **Configuration Centralization:** Constants, configuration values, and "magic strings" MUST be defined in a single place and imported or referenced from all points of use.

## Advantages / Use Cases

- **Improved Maintainability:** Changes only need to be made in one place, significantly reducing the effort and risk of updates.
- **Enhanced Consistency & Reliability:** Eliminates discrepancies and bugs that arise when multiple, duplicated copies of logic or data drift out of sync.
- **Increased Development Velocity:** Developers spend less time hunting down and updating all instances of a repeated piece of information.

## Disadvantages / Trade-offs

- **Premature Abstraction:** Applying DRY too early can lead to incorrect abstractions that are more costly to fix than the original duplicated code.
- **Increased Coupling:** A poor abstraction can create unnecessary dependencies between previously independent modules.
- **Performance vs. Readability:** In some performance-critical scenarios, denormalizing data (violating SSoT) or inlining code (violating DRY) may be a necessary and deliberate trade-off.
