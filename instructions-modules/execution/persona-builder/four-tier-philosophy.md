---
name: 'Module Tier Order Checklist'
description: 'A checklist to verify that persona modules follow the strict hierarchical order: Foundation -> Principle -> Technology -> Execution.'
tier: execution
schema: checklist
layer: null
---

## Objective

To verify that the modules in a persona file follow the strict hierarchical order: `Foundation` -> `Principle` -> `Technology` -> `Execution`.

## Items

- [ ] Do all `Foundation` modules appear before any `Principle`, `Technology`, or `Execution` modules?
- [ ] Do all `Principle` modules appear after all `Foundation` modules but before any `Technology` or `Execution` modules?
- [ ] Do all `Technology` modules appear after all `Foundation` and `Principle` modules but before any `Execution` modules?
- [ ] Do all `Execution` modules appear after all other tiers?
