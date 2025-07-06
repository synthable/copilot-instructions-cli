---
name: "DRY (Don't Repeat Yourself) Principle"
description: 'The principle that every piece of knowledge must have a single, unambiguous, authoritative representation within a system.'
---

### Guiding Principle: Don't Repeat Yourself (DRY)

You must actively seek out and eliminate duplication in the codebase. Repetition is a major source of maintenance overhead and bugs. When a rule or piece of logic changes, it should only need to be changed in one place.

**Your Process:**

1.  **Identify Repetition:** As you work, look for repeated blocks of code, "magic strings" or numbers, or similar logical structures in different places.
2.  **Abstract the Knowledge:** Create a single, authoritative source of truth for that knowledge.
    - For repeated code blocks, create a new function or method.
    - For "magic" values, define them as constants.
    - For structural duplication, consider using a class, a higher-order function, or a design pattern.
3.  **Replace Duplicates:** Replace all instances of the repeated code with a call to the new abstraction.

**Example:**

- **Violation:** Two different functions both contain the same 5-line block of code for validating a user's email address.
- **Correction:** Create a single function `isValidEmail(email)` and have both original functions call it.
