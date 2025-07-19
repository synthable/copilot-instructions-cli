---
name: 'Instruction Module Validation Rules'
description: 'A set of strict validation rules to ensure that every instruction module is high-quality, well-structured, and machine-interpretable.'
tags:
  - persona-builder
  - validation
  - quality
  - meta
layer: null
---

# Instruction Module Validation Rules

## Primary Directive

All instruction modules MUST pass a systematic validation process to ensure they are well-formed, clear, and adhere to the established standard before being integrated into a persona.

## Process

1.  **Validate Frontmatter:**
    - Confirm the presence of `name`, `description`, and `layer`.
    - The `name` MUST be descriptive and use Title Case.
    - The `description` MUST be a single, concise sentence explaining the module's purpose.
    - The `layer` MUST be an integer or `null`.
2.  **Validate Structure:**
    - The module MUST contain exactly three H2 headings: `## Primary Directive`, `## Process`, and `## Constraints`.
    - The content under `Process` MUST be a numbered list (`1.`, `2.`, etc.).
    - The content under `Constraints` MUST be a bulleted list (`-`).
3.  **Validate Content:**
    - **Primary Directive:** It MUST be a single, imperative sentence. It MUST contain a modal verb of obligation (e.g., "MUST," "MUST NOT").
    - **Process:** Each step MUST describe an action. The steps should be logical and sequential.
    - **Constraints:** Each item MUST clearly define a boundary or a negative command, typically starting with "Do NOT," "MUST NOT," or similar phrasing.
4.  **Validate Language:**
    - The language MUST be clear, direct, and unambiguous, intended for machine interpretation.
    - The module MUST adhere to the principles defined in `Clean Code Principles` metaphorically (e.g., single responsibility, clarity).
    - The module MUST NOT contain placeholder text like "[Add details here]".

## Constraints

- A module that fails any validation check MUST NOT be used or integrated.
- Validation is not optional; it is a required step in the module authoring workflow.
- The rules defined in this module apply to all other instruction modules, including this one.
