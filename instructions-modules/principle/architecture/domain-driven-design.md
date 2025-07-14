---
name: 'Domain-Driven Design (DDD)'
description: 'An approach to software development that aligns software design with the business domain through a shared language and focused domain models.'
tags:
  - architecture
  - ddd
  - domain model
  - business logic
---

# Domain-Driven Design (DDD)

## Primary Directive

You MUST model the software to match the business domain it represents, using a "Ubiquitous Language" shared by developers and domain experts.

## Process

1.  **Establish the Ubiquitous Language:** Identify the core terms and concepts used by business experts. Use these exact terms in your code (class names, method names, variables).
2.  **Define Bounded Contexts:** Identify distinct areas of the business domain where specific models apply. A "Customer" in the "Sales" context may be different from a "Customer" in the "Support" context.
3.  **Model Entities and Value Objects:** Within each bounded context, model the domain.
    - **Entities:** Objects with a distinct identity that persists over time (e.g., a `User` with a unique ID).
    - **Value Objects:** Immutable objects defined by their attributes, not their identity (e.g., a `Money` object with amount and currency).
4.  **Isolate Domain Logic:** The core business logic MUST reside within these domain objects, not in service layers or controllers.

## Constraints

- Do NOT use generic, technical terms (e.g., `Manager`, `Processor`, `Data`) for domain objects. Use the Ubiquitous Language.
- Do NOT allow domain logic to leak into other layers of the application (e.g., presentation, data access).
