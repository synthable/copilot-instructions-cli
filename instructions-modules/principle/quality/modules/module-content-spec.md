---
name: 'Module Content Specification'
description: 'A comprehensive specification defining both the required Markdown structure (H2 headings) and content formats for each of the six official module schemas.'
tier: principle
layer: null
schema: specification
---

## Core Concept

This specification defines the mandatory Markdown content structure and format requirements for every module. The structure and format of a module's body **MUST** be determined by the `schema` value declared in its frontmatter. This ensures that all modules are predictable, machine-readable, and consistently formatted according to their authorial intent.

## Key Rules

The Markdown content **MUST** begin immediately with the first required H2 heading. No other introductory text is permitted between the frontmatter and the first heading.

The required H2 headings and their content formats for each schema are as follows, and they **MUST** appear in the specified order:

#### `procedure` Schema

- `## Primary Directive`: **MUST** be a single paragraph of imperative text.
- `## Process`: **MUST** be an ordered list (`1.`, `2.`, `3.`).
- `## Constraints`: **MUST** be an unordered list (`-`).

#### `specification` Schema

- `## Core Concept`: **MUST** be a single paragraph of descriptive text.
- `## Key Rules`: **MUST** be an unordered list (`-`).
- `## Best Practices`: **MUST** be an unordered list (`-`).
- `## Anti-Patterns`: **MUST** be an unordered list (`-`).

#### `pattern` Schema

- `## Summary`: **MUST** be a single paragraph of descriptive text.
- `## Core Principles`: **MUST** be an unordered list (`-`).
- `## Advantages / Use Cases`: **MUST** be an unordered list (`-`).
- `## Disadvantages / Trade-offs`: **MUST** be an unordered list (`-`).

#### `checklist` Schema

- `## Objective`: **MUST** be a single paragraph of descriptive text.
- `## Items`: **MUST** be an unordered list (`-`). Using Markdown task list syntax (`- [ ]`) is highly recommended.

#### `rule` Schema

- `## Mandate`: **MUST** be a single, concise paragraph of imperative text. An unordered list is permissible only if every item directly supports the single, atomic mandate.

#### `data` Schema

- `## Description`: **MUST** be a single paragraph of descriptive text, immediately followed by a single, fenced code block.

#### Additional Structural Rules

- There **MUST NOT** be content before the first required H2 heading.
- There **MUST NOT** be extra H2 headings beyond those required for the schema.

## Best Practices

- Use H3 (`###`) and H4 (`####`) headings to structure content _within_ a required H2 section, but do not introduce any additional H2 headings.
- Ensure the content under each heading fulfills its semantic purpose (e.g., the content under `## Process` should be an ordered list).
- An optional `## Examples` section is permitted at the end of any module except for those with the `data` schema.
- Use sub-lists (indented lists) to provide further detail for a specific list item, but maintain the primary list type required by the rule.
- Use bolding (`**text**`) within paragraphs or list items to emphasize key terms, as defined in the `Machine-Centric Writing Specification`.

## Anti-Patterns

- **Schema-Content Mismatch:** The most critical error. Declaring one schema in the frontmatter (e.g., `schema: pattern`) but using the H2 headings from another (e.g., `## Process`).
- **Format Mismatch:** Providing content in a format other than what is required for a section. For example, writing a paragraph under `## Process` instead of an ordered list.
- **Forbidden H1 Title:** Using a top-level H1 heading (`#`) in the module body. The module's `name` in the frontmatter is the single source of truth for its title.
- **Missing Required Sections:** Omitting a mandatory H2 heading for a given schema. For example, a `procedure` module that is missing the `## Constraints` section is invalid.
- **Incorrect Section Order:** Presenting the required H2 headings in a different sequence than specified in the Key Rules.
- **Unstructured Lists:** Using a single paragraph with sentences that should have been formatted as a list. For example, writing "First do X, then do Y, then do Z." under `## Process` instead of a proper ordered list.
