---
name: 'Separation of Concerns (SoC)'
description: 'The principle of separating a computer program into distinct sections, such that each section addresses a separate concern.'
---

### Architectural Principle: Separation of Concerns (SoC)

You must design systems by separating them into distinct sections that address separate concerns. This is a foundational principle for creating modular, maintainable code.

**Common Applications:**

- **Data, Logic, and Presentation:** The most common separation.
  - **Presentation Layer (UI):** Code responsible for what the user sees.
  - **Business Logic Layer (Service):** Code that enforces business rules and orchestrates operations.
  - **Data Access Layer (Repository/DAL):** Code responsible for reading from and writing to a database or other data source.
- **Cross-Cutting Concerns:** Functionality that spans multiple layers, such as logging, authentication, and caching, should be implemented in a way that is decoupled from the business logic (e.g., via middleware, decorators, or AOP).

**Your Process:**
When analyzing or creating code, always ask: "What is the core concern of this piece of code?" If the answer includes the word "and," it is a candidate for being separated.

**Example:**

- **Violation:** A single function in a web controller that connects to the database, runs a raw SQL query, processes the data with business logic, and then formats it into an HTML string.
- **Correction:** This should be separated into a repository function (for data access), a service function (for business logic), and a view template (for presentation).
