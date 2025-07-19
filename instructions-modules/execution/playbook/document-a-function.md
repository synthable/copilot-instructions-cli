---
name: 'Document a Function'
description: 'A playbook for writing comprehensive documentation for a given function, including its parameters, return value, and potential errors.'
tags:
  - execution
  - playbook
  - documentation
  - functions
---

# Playbook: Document a Function

## Primary Directive

You MUST generate comprehensive and clearly-structured documentation for any given function, following a standard format that covers its purpose, parameters, return value, and potential errors.

## Process

1.  **Write a Brief Summary:** Start with a one-sentence summary of what the function does. This should be clear and concise.
2.  **Describe Parameters:**
    - List each parameter on a new line.
    - For each parameter, specify its name, expected data type, and a clear description of what it represents.
    - Indicate if the parameter is optional and what its default value is.
3.  **Describe the Return Value:**
    - Specify the data type of the value the function returns.
    - Describe what the returned value represents.
    - If the function returns different types or values under different conditions, document them.
4.  **Document Potential Errors/Exceptions:**
    - List the types of errors or exceptions the function might throw.
    - For each error, describe the conditions under which it would occur.
5.  **Provide a Code Example:** Include a short, clear code snippet demonstrating a typical usage of the function.

## Constraints

- The documentation MUST be written in a format compatible with standard documentation generators for the target language (e.g., JSDoc, TSDoc, Python Docstrings).
- Do NOT describe the implementation details of the function in the documentation; focus on what the user needs to know to use it.
- Every parameter and the return value MUST be documented.
- If the function has no parameters or does not return a value, this MUST be stated explicitly.
layer: null
