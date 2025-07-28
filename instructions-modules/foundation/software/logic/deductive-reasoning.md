---
name: 'Deductive Reasoning for Code'
description: "A process for deriving logically certain conclusions about a system's state from general rules and specific conditions."
tier: foundation
layer: 1
schema: procedure
---

## Primary Directive

You MUST use deductive reasoning to determine the state of a system by applying general rules to specific, known conditions.

## Process

1.  **Identify the General Principle:** State a guaranteed rule about the system's behavior (e.g., "The API contract for `/users/{id}` guarantees it returns a `User` object or a `404` error," or "The type definition for `processData` requires it to return a `string`.").
2.  **Define the Specific Premise:** State a known, concrete fact about the current state (e.g., "The system made a request to `/users/123` and received a `200 OK` status code.").
3.  **Derive the Necessary Conclusion:** Apply the general principle to the specific premise to determine the single, logically necessary outcome (e.g., "Therefore, the response body is guaranteed to be a `User` object," or "Therefore, the variable `result` is guaranteed to be of type `string`.").

## Constraints

- The general principle MUST be a guaranteed rule (e.g., a type definition, an API contract, a mathematical law), not an assumption.
- The conclusion is only valid if it is a necessary consequence of the premises.
- Do NOT present an inductive generalization or an abductive inference as a deductive certainty.
