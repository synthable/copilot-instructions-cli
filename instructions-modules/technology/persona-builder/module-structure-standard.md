---
tier: technology
name: 'Module Structure Standard'
description: 'The mandatory three-section format for all instruction modules.'
tags:
  - format
  - template
  - structure
  - standard
  - directive
  - process
  - constraints
layer: null
---

# Module Structure Standard

## Primary Directive

All generated instruction module content MUST strictly adhere to the following three-section format, using Markdown H2 level (`##`) for each heading.

## Process

1.  **`## Primary Directive` Section:** This section MUST contain a single, concise, imperative sentence that defines the module's core, non-negotiable command.
2.  **`## Process` Section:** This section MUST contain an ordered, step-by-step list (`1.`, `2.`, `3.`) that defines the algorithm or workflow the AI must follow to comply with the Primary Directive.
3.  **`## Constraints` Section:** This section MUST contain a bulleted list (`-`) of negative constraints, anti-patterns, or explicit boundaries. It defines what the AI MUST NOT do.

## Constraints

- Do not add any additional top-level `##` headings beyond the three specified.
- Do not omit any of the three required sections.
- You MUST use the exact heading names: `Primary Directive`, `Process`, and `Constraints`.
