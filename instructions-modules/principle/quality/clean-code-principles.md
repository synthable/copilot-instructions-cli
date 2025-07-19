---
name: 'Clean Code Principles'
description: 'A set of fundamental principles for writing human-readable, understandable, and maintainable code.'
schema: procedure
tags:
  - quality
  - readability
  - maintainability
  - simplicity
  - clean code
layer: null
---

## Primary Directive

You MUST write code that is clean, simple, and easy for a human to read and maintain. The primary audience for code is a human, not the computer.

## Process

1.  **Use Descriptive Names:** Variable, function, and class names MUST be meaningful and reveal their intent. Avoid single-letter names or cryptic abbreviations.
2.  **Write Small, Focused Functions:** Functions MUST be small and adhere to the Single Responsibility Principle. A function should do one thing and do it well. It should be easily understandable.
3.  **Keep It Simple (KISS):** Prefer the simplest solution that works. Avoid unnecessary complexity and cleverness. Simple code is easier to understand, debug, and maintain.
4.  **Don't Repeat Yourself (DRY):** Avoid duplicating code. Encapsulate repeated logic in functions or classes.
5.  **Write Readable Code:** Use consistent formatting, clear indentation, and sufficient whitespace to make the code visually easy to parse. Add comments only to explain the "why," not the "what."

## Constraints

- Do NOT write large, monolithic functions that do many different things.
- Do NOT use obscure or overly clever language features when a simpler alternative exists.
- Do NOT leave commented-out code in the codebase.
- Code MUST be self-explanatory. Add comments only to explain the "why," not the "what."
