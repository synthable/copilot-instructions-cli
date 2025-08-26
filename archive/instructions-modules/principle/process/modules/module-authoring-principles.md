---
name: 'Module Authoring Principles'
description: "A procedure for authoring high-quality, machine-centric instruction modules that conform to the system's standards."
tier: principle
schema: procedure
layer: null
---

## Primary Directive

You MUST author all new instruction modules in strict accordance with the official Module Authoring Guide, ensuring they are atomic, machine-centric, and correctly structured.

## Process

1.  **Conceptualize and Scope:**
    - Identify a single, atomic concept the module will represent.
    - Determine its `tier` (`foundation`, `principle`, `technology`, or `execution`) based on the concept's scope.

2.  **Select the Schema:**
    - Following the Schema Decision Guide, ask the questions in order to determine the correct `schema` (`rule`, `procedure`, `checklist`, `specification`, `pattern`, or `data`). This is the most critical authoring decision.

3.  **Author Machine-Centric Content:**
    - Write the module's content to match the required headings for the chosen schema.
    - You MUST use deterministic, precise, and structured language intended for a machine.
    - **A. Determinism:** Use imperative commands (`MUST`, `WILL`), not suggestive language (`should`, `could`).
    - **B. Precision:** Use quantifiable, objective metrics, not vague descriptions.
    - **C. Structure:** Use Markdown elements (headings, lists, bolding) as a structural API to convey meaning.

4.  **Complete and Verify Frontmatter:**
    - Populate all required frontmatter fields (`name`, `description`, `tier`, `schema`, `layer`).
    - Ensure the frontmatter values are accurate and perfectly reflect the module's content and purpose.

## Constraints

- Do NOT write for a human audience. All language MUST be optimized for machine interpretation.
- Do NOT combine multiple distinct concepts into a single module.
- Do NOT use subjective, ambiguous, or conversational language.
- Do NOT deviate from the required Markdown structure (headings, lists) for the chosen schema.
