---
name: 'Foundation Layer Rules'
description: "The rule that Foundation modules must be ordered by their 'layer' metadata, from lowest to highest."
tags:
  - foundation
  - layer
  - validation
  - ordering
layer: null
---

# Foundation Layer Rules

## Primary Directive

Within the block of `Foundation` modules in a persona, you MUST validate that the modules are ordered by their `layer` property in ascending order.

## Process

1.  **Isolate Foundation Block:** Identify all consecutive `Foundation` modules in the persona's list.
2.  **Track Maximum Layer:** Initialize a `max_layer_seen` variable to -1.
3.  **Iterate and Compare:** For each `Foundation` module in the block:
    a. Read its `layer` value from its metadata.
    b. If the module's `layer` is LESS THAN `max_layer_seen`, you MUST flag it as a Foundational Layer Violation.
    c. Otherwise, update `max_layer_seen` to the current module's `layer` if it is higher.

## Constraints

- This rule only applies to modules within the `Foundation` tier.
- It is valid for modules to have the same layer number (e.g., two `layer: 1` modules in a row). The violation only occurs when a lower layer appears after a higher one.
