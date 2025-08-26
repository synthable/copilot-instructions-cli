---
name: 'Instruction Module Validation Rules'
description: 'A specification of the strict, declarative rules for ensuring an instruction module conforms to official authoring standards.'
tier: execution
schema: specification
layer: null
authors:
  - 'AI Persona Builder Team'
---

## Core Concept

An instruction module's validity is determined by its strict adherence to a set of declarative rules governing its frontmatter, schema-specific structure, and machine-centric content.

## Key Rules

- **Frontmatter Validity:**
  - The module MUST contain valid YAML frontmatter enclosed by `---` at the file beginning.
  - The frontmatter MUST contain exactly these required fields: `name`, `description`, `tier`, `schema`, and `layer`.
  - The frontmatter MUST NOT contain unknown or deprecated fields.
  - `name`: MUST be a non-empty string in Title Case format (e.g., "First-Principles Thinking").
  - `description`: MUST be a single, concise sentence under 200 characters describing the module's purpose.
  - `tier`: MUST be exactly one of: `foundation`, `principle`, `technology`, or `execution`.
  - `schema`: MUST be exactly one of: `procedure`, `specification`, `pattern`, `checklist`, `data`, or `rule`.
  - `layer`: MUST be an integer from 0-4 for `foundation` tier modules, and `null` for all other tiers.
  - Optional fields (`authors`, `implement`) MUST conform to their respective format requirements when present.

- **Schema-Specific Structure:**
  - The module's Markdown body MUST contain exactly the required H2 headings for its declared schema in the specified order:
    - `procedure`: MUST have `## Primary Directive`, `## Process`, `## Constraints`.
    - `specification`: MUST have `## Core Concept`, `## Key Rules`, `## Best Practices`, `## Anti-Patterns`.
    - `pattern`: MUST have `## Summary`, `## Core Principles`, `## Advantages / Use Cases`, `## Disadvantages / Trade-offs`.
    - `checklist`: MUST have `## Objective`, `## Items`.
    - `data`: MUST have `## Description` followed by at least one fenced code block.
    - `rule`: MUST have exactly one `## Mandate` section.
  - There MUST be no content before the first required H2 heading.
  - There MUST be no extra H2 headings beyond those required for the schema.

- **Content Quality:**
  - All content MUST be written in imperative, machine-centric language using modal verbs of obligation (`MUST`, `WILL`, `SHALL`, `MUST NOT`).
  - The module MUST represent a single, atomic concept with clear boundaries.
  - The module MUST NOT contain placeholder text, incomplete sections, or "TODO" markers.
  - Lists in `Process` sections MUST use ordered formatting (`1.`, `2.`, `3.`).
  - Lists in `Constraints`, `Best Practices`, and `Anti-Patterns` sections MUST use unordered formatting (`-`).

- **File System Compliance:**
  - The module file MUST have a `.md` extension.
  - The module file path MUST correspond to its tier (e.g., `instructions-modules/foundation/...`).
  - The module filename MUST use kebab-case formatting (e.g., `validation-rules.md`).

- **Enforcement:**
  - A module that fails any validation rule MUST NOT be integrated into any persona configuration.
  - Validation failures MUST be reported with specific error details including the failed rule and location.

## Best Practices

- **Systematic Validation:** Use automated validation tools integrated into development workflows and CI/CD pipelines to catch errors early.
- **Atomic Design:** Design each module to represent exactly one indivisible concept, ensuring maximum reusability and clear boundaries.
- **Machine-First Writing:** Write content assuming the reader is a literal-minded AI system that requires explicit, unambiguous instructions.
- **Schema Alignment:** Verify that the chosen schema accurately reflects the module's actual intent and content structure before authoring.
- **Frontmatter Precision:** Double-check all frontmatter values against the official requirements, especially `tier` and `layer` assignments.
- **Content Hierarchy:** Use Markdown formatting consistently as an API, with H2 headings defining major sections and list formatting indicating instruction types.
- **Validation Testing:** Test modules in isolation with minimal personas to verify the AI interprets instructions correctly.
- **Iterative Refinement:** Continuously improve module clarity based on observed AI behavior and validation feedback.
- **Documentation Reference:** Keep the Module Authoring Guide accessible during authoring to ensure compliance with current standards.

## Anti-Patterns

- **Schema Misalignment:** Declaring a `schema` in frontmatter but using incorrect H2 headings or content structure for that schema type.
- **Suggestive Language:** Using weak, conversational language (`should`, `could`, `might`, `consider`) instead of imperative commands (`MUST`, `WILL`, `SHALL`).
- **Multi-Concept Modules:** Creating modules that attempt to cover multiple unrelated concepts, violating the atomicity principle (e.g., combining authentication AND authorization in one module).
- **Placeholder Content:** Including incomplete sections with text like "[Add details here]", "TODO", or "TBD" in production modules.
- **Inconsistent Formatting:** Using wrong list types (ordered lists for constraints, unordered lists for processes) or inconsistent Markdown formatting.
- **Validation Bypassing:** Submitting modules without proper validation or attempting to use unvalidated modules in persona configurations.
- **Tier Misclassification:** Placing technology-specific modules in the `principle` tier or execution procedures in the `foundation` tier.
- **Layer Confusion:** Assigning layer values to non-foundation modules or using incorrect layer numbers for foundation modules.
- **Frontmatter Pollution:** Including non-standard fields, deprecated attributes, or incorrectly formatted optional fields.
- **Human-Centric Writing:** Writing instructions as if communicating with a human colleague rather than configuring an AI system.
- **Vague Constraints:** Using subjective or unmeasurable constraints that cannot be programmatically verified.
