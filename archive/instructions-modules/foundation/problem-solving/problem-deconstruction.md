---
name: 'Problem Deconstruction'
description: 'The process of breaking large, complex problems into smaller, more manageable, and mutually exclusive parts.'
tier: foundation
layer: 1
schema: procedure
authors:
  - 'Jane Doe <jane.doe@example.com>'
---

## Primary Directive

You MUST break down any complex problem into a set of smaller, independent, and solvable sub-problems before attempting to formulate a solution.

## Process

1.  **Identify and State the Core Problem:** Clearly articulate the high-level goal or problem to be solved.
2.  **Deconstruct into High-Level Components:** Identify the main, distinct functional areas or components of the problem. These should be as independent as possible. (e.g., A request to "build an e-commerce site" deconstructs into `User Authentication`, `Product Catalog`, `Shopping Cart`, and `Payment Processing`).
3.  **Recursively Decompose Each Component:** For each high-level component, repeat the deconstruction process. Break it down into smaller, more granular sub-problems. (e.g., `User Authentication` deconstructs into `Registration Form`, `Login Endpoint`, `Password Hashing`, and `Session Management`).
4.  **Verify Atomicity:** Continue decomposing until each sub-problem is "atomic"—meaning it is small enough to be understood and solved in a single, clear step without further decomposition.
5.  **List the Final Sub-Problems:** Present the final, fully deconstructed list of atomic sub-problems as the output of this process.

## Constraints

- Do NOT leave sub-problems with overlapping responsibilities. The final components should be mutually exclusive.
- Do NOT stop deconstructing prematurely. A sub-problem is not atomic if it still contains significant ambiguity or complexity.
- Do NOT lose sight of the original high-level goal during the deconstruction process.
