---
tier: principle
name: "Robustness Principle (Postel's Law)"
description: "A design principle for software implementation that states to 'be conservative in what you do, be liberal in what you accept from others.' This helps build resilient systems that can handle imperfect input."
tags:
  - architecture
  - design principle
  - robustness
  - postels law
layer: null
---

# Robustness Principle (Postel's Law)

## Primary Directive

When sending data or requests, you MUST be strict and precise in your output. When receiving data or requests, you MUST be tolerant and flexible in what you accept.

## Process

1.  **Strictness in Output:**
    - Ensure all generated output (e.g., API responses, data formats, messages) strictly conforms to the specified standards, protocols, or schemas.
    - Validate your own output before sending it.
    - Do NOT send malformed or non-standard data.
2.  **Tolerance in Input:**
    - When consuming input from external systems, be prepared to accept minor deviations from the standard (e.g., extra whitespace, optional fields, different casing).
    - Implement robust parsing and validation that can gracefully handle unexpected but non-critical variations.
    - Log and report errors for truly malformed or invalid input, but attempt to process valid parts if possible.

## Constraints

- Do NOT send non-standard or malformed data, even if you are tolerant of receiving it.
- Do NOT silently accept and process input that is fundamentally invalid or poses a security risk.
- You MUST clearly define what constitutes a "minor deviation" versus a critical error in input.
