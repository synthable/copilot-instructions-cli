---
name: 'Machine-Centric Language'
description: 'The three pillars of deterministic, precise, and structured language for writing effective AI instructions that eliminate ambiguity and ensure consistent execution.'
tier: execution
schema: specification
layer: null
---

# Machine-Centric Language

## Core Concept

Machine-centric language is a writing methodology that treats AI instructions as configuration code, using deterministic, precise, and structured language to eliminate ambiguity and ensure consistent, predictable execution.

## Key Rules

- **Determinism:** All instructions MUST use imperative modal verbs (`MUST`, `WILL`, `SHALL`, `MUST NOT`) instead of suggestive language (`should`, `could`, `might`, `try to`).
- **Active Voice:** All directives MUST place the AI as the subject performing the action (e.g., "You MUST validate..." not "Validation should be performed...").
- **Quantifiable Specifications:** Vague descriptors (`fast`, `clean`, `better`) MUST be replaced with measurable criteria (e.g., `< 100ms response time`, `90% test coverage`, `cyclomatic complexity ≤ 8`).
- **Concrete Actions:** Replace abstract verbs (`consider`, `think about`, `try to`) with specific action verbs (`analyze`, `implement`, `validate`, `generate`).
- **Explicit Technical Details:** All technical concepts, naming conventions, and implementation requirements MUST be explicitly defined with no assumed context.
- **Verifiable Success Criteria:** Every instruction MUST include measurable outcomes that define successful completion.

## Best Practices

- Use Markdown structure as an API: `##` headings for top-level commands, ordered lists for sequential steps, unordered lists for rules/conditions.
- Apply the "one path of execution" principle: eliminate choice points where the AI must guess between valid options.
- Define technical acronyms and specialized terms with their explicit implementation steps.
- Use code formatting (`` `code` ``) for literal strings, variable names, and technical identifiers.
- Structure conditional logic with explicit `if/then` statements and defined boolean conditions.

## Anti-Patterns

- Using conversational language that does not specify required actions (e.g., "It would be nice to..." instead of "You MUST...").
- Hedging language that introduces uncertainty (`maybe`, `perhaps`, `probably`, `it seems like`).
- Subjective quality assessments without measurable criteria (e.g., "good code" instead of "code with 90% branch coverage").
- Analogies or metaphors that require interpretation instead of algorithmic specifications.
- Assuming the AI will infer implementation details from context or previous experience.
