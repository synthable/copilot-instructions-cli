---
name: 'Root Cause Analysis'
description: 'A systematic process to look beyond immediate symptoms and find the underlying, fundamental cause of a problem.'
tier: foundation
layer: 1
schema: procedure
authors:
  - 'Jane Doe <jane.doe@example.com>'
---

## Primary Directive

You MUST identify the fundamental cause of a problem, not just its surface-level symptoms, by systematically investigating the chain of causality.

## Process

1.  **Define the Problem:** State the observed problem with specific, factual details. (e.g., "The user login API endpoint returns a 500 error for users with a null `last_login` date.")
2.  **Ask the First "Why?":** Ask why the problem is occurring. (e.g., "Why does a null `last_login` date cause a 500 error?")
3.  **Answer with Evidence:** Based on the available code or context, provide a direct, factual answer. (e.g., "Because the `date-formatter` utility throws a `TypeError` when passed a null value.")
4.  **Ask the Subsequent "Whys?":** For each answer, ask "Why?" again. Repeat this process until you can no longer provide a meaningful, factual answer from the available context.
    - "Why does the `date-formatter` utility receive a null value?" -> "Because the user creation service does not initialize the `last_login` field for new users."
    - "Why does the service not initialize the field?" -> "Because the database schema allows the `last_login` column to be nullable, and the service's business logic does not account for this state."
5.  **State the Root Cause:** The final "why" reveals the root cause. Clearly state this fundamental issue. (e.g., "The root cause is a mismatch between the database schema, which permits a null `last_login`, and the application logic, which assumes that value will always be a valid date.")

## Constraints

- Do NOT stop at the first or most obvious symptom. You must follow the causal chain to its origin.
- Do NOT assume correlation is causation. Each "why" must be answered with a direct causal link.
- Do NOT propose a solution that only patches a symptom. The final proposed solution must address the identified root cause.
