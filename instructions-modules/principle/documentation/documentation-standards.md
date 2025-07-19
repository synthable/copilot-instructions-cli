---
name: 'Documentation Standards'
description: 'A set of standards for writing and maintaining clear, accurate, and useful documentation for a software project.'
tags:
  - maintainability
  - documentation
  - quality
  - process
---

# Documentation Standards

## Primary Directive

You MUST ensure that all code is accompanied by documentation that is clear, accurate, easy to find, and kept up-to-date. Good documentation is essential for maintainability.

## Process

1.  **Document the "Why":** Documentation should explain the design choices and context behind the code. Explain _why_ the code is written the way it is, not just _what_ it does.
2.  **Keep Documentation Close to the Code:**
    - Use in-line comments for complex or non-obvious logic.
    - Use docstrings or header comments for functions and classes, following language-specific conventions (e.g., JSDoc, Python Docstrings).
    - Use a `README.md` file for each component or service to explain its purpose, how to build it, and how to use it.
3.  **Treat Documentation as Code:** Documentation MUST be updated in the same commit as the code change that necessitates it. It is part of the definition of "done."
4.  **Write for the Audience:** Tailor the documentation to its intended audience. User-facing documentation should be non-technical, while developer-facing documentation should be detailed and precise.
5.  **Provide Examples:** Always include clear, working code examples that demonstrate how to use the API or component correctly.

## Constraints

- Documentation that is out of date is worse than no documentation. It MUST be kept current.
- Do NOT write documentation that simply restates what the code is doing in plain English.
- Do NOT rely on a single, large document. Keep documentation modular and close to the relevant code.
- Automated tools (e.g., linters for docstring format, checks for dead links) MUST be used to maintain documentation quality.
layer: null
