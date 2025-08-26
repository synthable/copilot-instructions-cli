---
name: 'Prompt Improvement Procedure'
description: 'A playbook for analyzing a user-provided prompt and rewriting it to be more effective using modern prompt engineering techniques.'
tier: execution
layer: null
schema: procedure
---

## Primary Directive

Given a user-provided prompt, you MUST analyze it against established prompt engineering principles and generate a revised, improved version. The final output **MUST** include the rewritten prompt and a detailed, point-by-point rationale explaining each specific improvement.

## Process

1.  **Deconstruct the Original Prompt:**
    - Identify the user's core goal or desired outcome.
    - Isolate any explicit constraints, context, or examples provided.
    - Determine the implied audience and tone of the desired response.

2.  **Identify Areas for Improvement:**
    - Analyze the original prompt for common weaknesses, including but not limited to:
      - **Vagueness:** Lack of specific, measurable details.
      - **Ambiguity:** Language that could be interpreted in multiple ways.
      - **Missing Persona:** The prompt does not assign a clear role or expertise to the AI.
      - **Missing Context:** Lack of necessary background information or examples (few-shot prompting).
      - **Undefined Format:** The desired output structure (e.g., JSON, Markdown, list) is not specified.
      - **Implicit Assumptions:** The prompt relies on the AI to guess unstated requirements.

3.  **Rewrite the Prompt Using Modern Techniques:**
    - **Assign a Persona:** Begin the prompt by assigning a clear, expert role to the AI (e.g., "You are an expert security analyst," "You are a senior TypeScript developer").
    - **Provide Full Context:** Add a `<context>` section using XML tags or another clear delimiter. Include any necessary background information, user stories, or code snippets.
    - **Give Explicit Instructions:** Clearly state the task using imperative commands. Use a step-by-step format if the task is complex.
    - **Define the Output Structure:** Add a section that precisely defines the required output format. Specify the structure (e.g., JSON schema, Markdown table columns, heading levels) and any formatting constraints.
    - **Provide Examples (Few-Shot Prompting):** If applicable, include a section with 1-2 high-quality examples of the desired input/output format.
    - **Add Constraints:** Explicitly state what the AI **MUST NOT** do. Define boundaries, topics to avoid, and negative constraints.
    - **Use Delimiters:** Structure the entire prompt with clear delimiters (e.g., `<prompt>`, `</prompt>`, `<context>`, `</context>`, `<output_format>`, `</output_format>`) to separate distinct sections.

4.  **Generate the Rationale:**
    - Create a "Rationale for Improvements" section.
    - For each change made, provide a clear, point-by-point explanation.
    - Reference the weakness identified in Step 2 and explain how the new technique from Step 3 addresses it (e.g., "Added a persona to reduce ambiguity and focus the AI's knowledge," "Specified a JSON output format to ensure machine-readable results.").

## Constraints

- You **MUST NOT** alter the fundamental goal of the user's original prompt. The objective is to improve the _request_, not change the _request's intent_.
- The final output **MUST** be structured with the rewritten prompt first (inside a fenced code block), followed by the "Rationale for Improvements" section.
- The rationale **MUST** be constructive and educational, explaining the "why" behind each change.

/t:889
