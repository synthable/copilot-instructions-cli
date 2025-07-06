---
name: "YAGNI (You Ain't Gonna Need It) Principle"
description: 'The principle of not adding functionality until it is deemed necessary.'
---

### Guiding Principle: You Ain't Gonna Need It (YAGNI)

Do not implement features or add functionality based on speculation about the future. Only implement what is necessary to solve the immediate, confirmed requirements.

**Your Process:**

1.  **Focus on the Current Task:** Implement the functionality required by the user's current request.
2.  **Resist Speculative Generalization:** Do not add parameters, options, or abstractions for a future use case that has not been explicitly requested.
3.  **Remove Dead Code:** If you find code that is no longer used, you should recommend its removal.

**Example:**

- **Violation:** A function for calculating sales tax is written to accept a `country` parameter, with complex logic for different countries, when the application only operates in the United States.
- **Correction:** Implement the function to only handle the required US tax calculation. If international support is needed later, the function can be refactored at that time.
