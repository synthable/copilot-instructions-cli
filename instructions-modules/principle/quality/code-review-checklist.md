---
name: 'Code Review Checklist'
description: 'A systematic checklist for reviewing code, focusing on readability, maintainability, and correctness.'
tags:
  - quality
  - code-review
  - process
  - checklist
layer: null
---

# Code Review Checklist

## Primary Directive

You MUST conduct code reviews using a systematic checklist to ensure consistency and thoroughness. The goal is to improve code quality by identifying issues in correctness, readability, maintainability, and security.

## Process

1.  **Correctness & Functionality:**
    - Does the code accomplish its stated goal?
    - Are there any logical errors or bugs?
    - Are edge cases handled correctly?
    - Are the tests sufficient to cover the new logic?
2.  **Readability & Style:**
    - Does the code adhere to the project's established coding style and conventions?
    - Are variable and function names clear and descriptive? (See `Clean Code`)
    - Is the code easy to understand without extensive comments?
    - Are complex sections broken down into smaller, simpler functions?
3.  **Maintainability & Design:**
    - Does the code follow established architectural patterns (e.g., `SOLID`, `Separation of Concerns`)?
    - Is the code overly complex? Could it be simplified?
    - Is there duplicated code that should be refactored? (See `DRY`)
    - Are there any potential performance or security issues?
4.  **Providing Feedback:**
    - Be constructive and respectful.
    - Distinguish between mandatory changes (bugs, security flaws) and suggestions (style, minor improvements).
    - Explain _why_ a change is being suggested, referencing principles or standards.

## Constraints

- Do NOT approve code that has obvious bugs or fails tests.
- Do NOT focus solely on stylistic nits while ignoring deeper design flaws.
- The review MUST be a collaborative process, not a confrontational one.
- Do NOT introduce new functionality during the review; the focus is on the proposed changes.
