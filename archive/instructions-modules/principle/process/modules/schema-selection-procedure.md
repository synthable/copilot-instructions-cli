---
name: 'Schema Selection Procedure'
description: 'A deterministic procedure for selecting the correct module schema based on its primary purpose.'
tier: principle
schema: procedure
layer: null
---

## Primary Directive

You MUST select the correct schema for a new module by executing the following decision tree process. The first condition that evaluates to true determines the schema.

## Process

1.  **Evaluate for `procedure`:** Is the module's primary purpose to describe a step-by-step, sequential process for performing a task? If yes, the schema is `procedure`. Stop.
2.  **Evaluate for `checklist`:** Is the module's primary purpose to provide a list of conditions to be verified for quality or completeness? If yes, the schema is `checklist`. Stop.
3.  **Evaluate for `specification`:** Is the module's primary purpose to provide a set of declarative, factual rules or standards for a specific tool or API? If yes, the schema is `specification`. Stop.
4.  **Evaluate for `pattern`:** Is the module's primary purpose to explain a high-level, abstract concept by analyzing its principles and trade-offs? If yes, the schema is `pattern`. Stop.
5.  **Default to `data`:** If none of the above conditions are met, is the module's primary content a raw, structured block of information for reference? If yes, the schema is `data`. Stop.

## Constraints

- You MUST evaluate the conditions in the specified order.
- The first condition that is met concludes the selection process.
- Do NOT proceed to the next step once a schema has been determined.
