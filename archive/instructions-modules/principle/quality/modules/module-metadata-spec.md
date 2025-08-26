---
name: 'Module Metadata Specification'
description: 'A formal specification defining the required and optional fields for valid module frontmatter, including their data types and constraints.'
tier: principle
layer: null
schema: specification
---

## Core Concept

This specification defines the mandatory structure and data types for the YAML frontmatter of every module file (`.md`) to ensure system-wide consistency, parsability, and automated validation. Adherence to this specification is non-negotiable.

## Key Rules

The YAML frontmatter of every module **MUST** contain the following fields with the specified types and constraints:

- **`name`** (string, required)
  - A human-readable, Title Case name for the module.
  - _Example:_ `'First-Principles Thinking'`

- **`description`** (string, required)
  - A concise, one-sentence summary of the module's purpose.

- **`tier`** (string, required)
  - The module's architectural tier.
  - **MUST** be one of the following exact values: `foundation`, `principle`, `technology`, `execution`.

- **`schema`** (string, required)
  - The schema that defines the structure of the module's Markdown content.
  - **MUST** be one of the following exact values: `procedure`, `specification`, `pattern`, `checklist`, `data`, `rule`.

- **`order`** (number | null, required)
  - The module's required sequential position in the cognitive hierarchy of the `Foundation` tier.
  - **MUST** be an integer from `0` to `4` if `tier` is `foundation`.
  - **MUST** be `null` if `tier` is `principle`, `technology`, or `execution`.

- **`author`** (array of strings, optional)
  - A list of contributors to the module.
  - Each string **MUST** follow the format: `'FullName <email@example.com>'`.

- **`implement`** (array of strings, optional)
  - A list of unique IDs of other modules that this module formally implements or instantiates.
  - Each value **MUST** correspond to the ID of an existing module in the library.
  - _Example:_ `['principle/specs/conventional-commits']`

## Best Practices

- Run the `copilot-instructions validate` command frequently during authoring to catch metadata errors early.
- Use the optional `implement` field to formally declare one or more Synergistic Pairs, making the relationship between modules explicit and verifiable.
- Keep the `author` list updated as new contributors make significant changes to the module.

## Anti-Patterns

- **Keyword Confusion:** Using the plural, reserved keyword `implements` instead of the correct singular `implement`. The validator will reject this.
- **Order Mismatch:** Assigning a numerical `order` to a non-`foundation` module, or assigning `null` to a `foundation` module.
- **Schema Omission:** Forgetting to include the `schema` field. This is one of the most critical pieces of metadata.
- **Instructional Creep:** Placing instructional content, such as rules or process steps, inside the `description` field. The description is for discovery and summary purposes only.
