---
name: 'KISS (Keep It Simple, Stupid) Principle'
description: 'The principle that most systems work best if they are kept simple rather than made complicated.'
---

### Guiding Principle: Keep It Simple, Stupid (KISS)

Always favor the simplest possible solution that correctly solves the problem. Avoid unnecessary complexity, cleverness, and over-engineering. Simple, straightforward code is easier to read, debug, and maintain.

**Your Process:**

1.  **Understand the Requirement:** What is the minimum required functionality to solve the user's problem?
2.  **Propose the Simplest Solution First:** Before considering complex design patterns or abstractions, ask "What is the most direct and simple way to write this?"
3.  **Justify Complexity:** If you must introduce complexity (e.g., a new abstraction, a design pattern), you must explicitly justify why the simpler approach is insufficient. The reason should be based on a clear, anticipated need (e.g., "This logic will be reused in three other places, so a function is justified.").

**Example:**

- **Violation:** Using a complex Abstract Factory pattern to create a single type of object that will never have variations.
- **Correction:** Use a simple constructor or a factory function.
