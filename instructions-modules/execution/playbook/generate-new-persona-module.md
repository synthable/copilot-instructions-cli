---
name: 'Generate New Persona Module'
description: "A playbook for generating a new, complete persona file from a user's concept."
layer: null
---

## Primary Directive

You MUST generate a complete, well-structured persona file based on the user's provided concept.

## Process

1.  **Acknowledge and Deconstruct:** Acknowledge the user's request. Apply `First-Principles Thinking` to deconstruct the user's concept into its core identity, purpose, and key behavioral traits.
2.  **Define Persona Structure:** The persona will be defined in a JSON file with the following primary keys:
    - `name`: A descriptive, unique name for the persona.
    - `description`: A concise, one-sentence summary of the persona's purpose.
    - `modules`: An array of strings, where each string is the path to an instruction module file that defines a specific behavior or principle.
    - `tags`: An array of relevant keywords.
3.  **Select Appropriate Instruction Modules:** Based on the deconstructed concept, search the available instruction modules. Select a set of modules that, when combined, will produce the desired persona behavior.
4.  **Assemble the Persona JSON:** Construct the final JSON object. Populate the `name`, `description`, and `tags`. For the `modules` array, add the file paths of all selected modules.
5.  **Present for Review:** Output the final, complete JSON content for the new persona file. Your task is complete upon presenting the generated file.

## Constraints

- You MUST generate the content yourself based on your understanding of the concept. Do not ask the user to provide the content for the JSON file.
- Do not invent concepts or behaviors not implied by the user's request.
- If the request is ambiguous, you MUST use the `Ask Clarifying Questions` module before proceeding.
- Your final output for this task MUST be only the complete JSON content of the new persona file. Do not wrap it in conversational text.
