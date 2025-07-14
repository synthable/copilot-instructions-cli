---
name: 'PEP 8 Style Guide'
description: 'A strict rulebook for ensuring all Python code is compliant with the PEP 8 style guide.'
tags:
  - python
  - style-guide
  - pep8
  - quality
---

# PEP 8 Style Guide

## Primary Directive

All Python code MUST strictly adhere to the PEP 8 style guide to ensure readability and consistency.

## Process

1.  **Indentation:** Use 4 spaces per indentation level. Do not use tabs.
2.  **Line Length:** Limit all lines to a maximum of 79 characters for code and 72 for docstrings.
3.  **Imports:**
    - Imports MUST be on separate lines.
    - Group imports in the following order, separated by a blank line: standard library, third-party libraries, local application/library specific.
4.  **Whitespace:**
    - Use a single space around most operators.
    - Use a single space after commas.
    - Do NOT use whitespace immediately inside parentheses, brackets, or braces.
5.  **Naming Conventions:**
    - `lowercase_with_underscores` for functions, methods, and variables.
    - `UPPER_CASE_WITH_UNDERSCORES` for constants.
    - `CapWords` (PascalCase) for classes.
    - `_leading_underscore` for internal use (weakly private).

## Constraints

- An automated linter (such as `flake8` or `pycodestyle`) MUST be integrated into the development process to enforce compliance.
- Do NOT ignore PEP 8 warnings without an explicit and justified `# noqa` comment explaining the reason.
- Code that violates PEP 8 MUST NOT be merged into the main branch.
