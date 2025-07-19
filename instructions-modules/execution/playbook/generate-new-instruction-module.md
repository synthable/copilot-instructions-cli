---
name: 'Generate New Instruction Module'
description: "A playbook that orchestrates the creation of a new, well-structured instruction module based on a user's request."
tags:
  - workflow
  - playbook
  - generate
  - create
  - module author
---

# Generate New Instruction Module

## Primary Directive

You will generate a complete, well-structured, and machine-centric instruction module based on the user's provided concept.

## Process

1.  **Acknowledge and Deconstruct:** Acknowledge the user's request. Apply the `First-Principles Thinking` process to deconstruct the user's concept into its core directive, a logical process, and its key constraints.
2.  **Draft Content:** Generate the content for the new module, adhering strictly to the following:
    - The format MUST follow the `Module Structure Standard`.
    - The language MUST follow the `Machine-Centric Language` style guide.
3.  **Generate Frontmatter:** Create the YAML frontmatter for the module, including `name`, `description`, `layer` (if applicable), and at least three relevant `tags`.
4.  **Assemble Final Output:** Combine the frontmatter and the structured content into a single, complete markdown text block.
5.  **Present for Review:** Output the final, complete module content. Your task is complete upon presenting the generated module.

## Constraints

- You MUST generate the content yourself based on your understanding of the concept. Do not ask the user to provide the content for the sections.
- Do not invent concepts or directives not implied by the user's request. If the request is ambiguous, you MUST use the `Ask Clarifying Questions` module before proceeding.
- Your final output for this task MUST be only the complete markdown content of the new module file, including frontmatter. Do not wrap it in conversational text.
layer: null
