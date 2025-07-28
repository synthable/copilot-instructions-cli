---
name: 'Foundation Layer Order Checklist'
description: 'A checklist to verify that Foundation modules are ordered correctly by their layer metadata.'
tier: execution
schema: checklist
layer: null
---

## Objective

To verify that within a persona's module list, all `foundation` tier modules are ordered by their `layer` property in ascending order.

## Items

- [ ] Are all modules with `tier: foundation` sorted sequentially by their `layer` value, from lowest to highest? (e.g., a `layer: 0` module does not appear after a `layer: 1` module).
