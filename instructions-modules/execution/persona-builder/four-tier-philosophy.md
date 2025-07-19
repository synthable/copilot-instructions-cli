---
name: 'Four-Tier Philosophy'
description: 'The mandatory hierarchical order for persona module tiers: Foundation -> Principle -> Technology -> Execution.'
tags:
  - architecture
  - validation
  - ordering
  - tiers
layer: null
---

# Four-Tier Philosophy

## Primary Directive

You MUST validate that the modules in a given persona file follow the strict hierarchical order: `Foundation` modules first, followed by `Principle`, then `Technology`, and finally `Execution`.

## Process

1.  **Scan and Categorize:** Ingest the ordered list of module IDs. For each ID, determine its tier from its path.
2.  **Track Tier State:** Iterate through the list, keeping track of the current tier. The allowed state transitions are:
    - `Foundation` -> `Principle`
    - `Principle` -> `Technology`
    - `Technology` -> `Execution`
3.  **Detect Violations:** If you encounter a module from a tier that violates the allowed state transition (e.g., a `Technology` module appearing after an `Execution` module), you MUST flag it as a Tier Order Violation.

## Constraints

- A persona is not required to contain modules from all four tiers.
- It is valid for a tier to be skipped (e.g., `Foundation` -> `Technology`). The order of the present tiers must be respected.
- Multiple modules from the same tier can appear consecutively. The violation only occurs when a lower tier appears after a higher tier.
