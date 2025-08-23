---
name: 'Machine-Centric Language Specification'
description: 'A comprehensive specification for authoring machine-centric instructions, defining the style, structure, and formal meaning of requirement keywords to ensure deterministic AI behavior.'
tier: principle
layer: null
schema: specification
---

## Core Concept

This specification defines the standard for writing all instructional content. The goal is to produce imperative, unambiguous, and machine-interpretable language by treating instructions as configuration code, not as a tutorial. This ensures predictable and consistent execution. A core component of this standard is the adoption of formal requirement keywords as defined by IETF RFC 2119.

## Key Rules

All module content **MUST** be written according to the following rules:

- **Formal Keyword Interpretation:** Capitalized requirement keywords **MUST** be used and interpreted according to their formal RFC 2119 definitions to convey the precise level of constraint.
  - **`MUST` / `SHALL`**: An absolute requirement.
  - **`MUST NOT` / `SHALL NOT`**: An absolute prohibition.
  - **`SHOULD` / `RECOMMENDED`**: A strong recommendation that can only be ignored if the full implications are understood and justified.
  - **`SHOULD NOT` / `NOT RECOMMENDED`**: A strong discouragement against a course of action.
  - **`MAY` / `OPTIONAL`**: Truly optional.

- **Use Active Voice:** The AI is the subject performing the action. Instructions **MUST** be phrased in the active voice to assign clear responsibility.
  - _Correct:_ "You WILL analyze the data."
  - _Incorrect:_ "The data will be analyzed."

- **Use Quantifiable and Specific Language:** Vague, subjective descriptors (e.g., `fast`, `clean`, `better`) **MUST NOT** be used. Instructions **MUST** be replaced with precise, measurable, and verifiable criteria.
  - _Correct:_ "If cyclomatic complexity is greater than 10, you MUST refactor."
  - _Incorrect:_ "If the code is too complex, you should refactor."

- **Define All Specialized Terms and Actions:** Do not assume the AI will infer the correct meaning of a specialized term or the steps of an abstract action. Concepts **MUST** be defined algorithmically or with explicit criteria.
  - _Correct:_ "Apply the '5 Whys' technique, where you recursively ask 'Why?' to trace a symptom to its root cause."
  - _Incorrect:_ "Do a root cause analysis."

## Best Practices

- **Assume Zero Context:** Write each instruction as if the AI has no prior knowledge of your specific project's unstated conventions.
- **Use Markdown as a Semantic API:** Use headings, lists, bolding, and code formatting to create a logical, machine-parsable structure, not just for visual presentation.
- **Favor Imperative Commands:** Structure sentences as direct commands to the AI (e.g., `analyze`, `implement`, `validate`, `generate`).

## Anti-Patterns

- **Conversational Filler:** Using rhetorical questions, apologies, or explanatory prose not directly related to the instruction.
- **Hedging Language:** Using words like "maybe," "perhaps," "it seems like," or "try to." This introduces ambiguity and **MUST** be avoided.
- **Ambiguous Keywords:** Using lowercase "should" or "may" when a formal requirement level is intended. If you mean `SHOULD`, you **MUST** write `SHOULD`.
- **Metaphorical Explanations:** Using analogies or metaphors to explain a concept. Instead, define the process or concept with explicit, operational steps and criteria.
- **Assuming Implementation Details:** Relying on the AI to infer implementation details from context or previous experience. All necessary details **MUST** be provided.

## Examples

### Example: Transforming a Human-Centric Request to Machine-Centric

#### Rationale

This example demonstrates the transformation from a vague, suggestive instruction to a precise, deterministic, and structured one that correctly uses formal keywords and includes verifiable success criteria.

#### Snippet: Human-Centric (Incorrect)

"You should probably handle errors. It's a good idea to make sure the user gets a helpful message if something goes wrong."

#### Snippet: Machine-Centric (Correct)

"Upon a database connection failure, you MUST:

- Return an HTTP status code of 503 Service Unavailable.
- The response body MUST be a JSON object with the exact structure: {\"error\": \"Database offline\", \"retryable\": true}.
- The response body MUST NOT include a stack trace or any other internal system details."
