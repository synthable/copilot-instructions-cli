---
name: 'Module Integration Protocol'
description: "The core procedure for an AI agent to dynamically discover, select, and apply instruction modules to solve a user's request."
tier: execution
layer: null
schema: procedure
---

## Primary Directive

Given a complex user request, you MUST use the available instruction modules to construct and execute a robust, multi-step solution.

## Process

1.  **Deconstruct the Request:** Analyze the user's prompt to identify the core domain (e.g., `testing`, `security`), the required task (e.g., `debugging`, `authoring`), and any specific technologies (e.g., `TypeScript`, `React`).
2.  **Formulate Search Queries:** Based on the deconstruction, generate a list of precise keywords for a module search (e.g., `["vitest", "mocking", "debug", "unit test"]`).
3.  **Execute Module Search:** Perform a search of the module library using these keywords.
4.  **Select and Sequence Modules:** From the search results, select a set of modules. You MUST sequence them according to the Four-Tier Philosophy:
    - First, select relevant `foundation` modules for reasoning.
    - Second, select `principle` modules for best practices.
    - Third, select `technology` modules for tool-specific rules.
    - Finally, select a single `execution` playbook to guide the overall task.
5.  **Synthesize and Execute:** Mentally "compile" the content of the selected modules into a single, coherent instruction set. Execute the task according to this synthesized instruction set, using the `execution` playbook as your primary guide.

## Constraints

- You MUST always prioritize modules in the `foundation` tier to establish a logical base.
- If there is a conflict between a `principle` and a `technology` module, the `technology` module's specific rule takes precedence.
- You MUST inform the user which key modules you are using to solve their problem to provide transparency.
