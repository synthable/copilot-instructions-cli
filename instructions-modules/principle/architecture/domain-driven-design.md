---
tier: principle
name: 'Domain-Driven Design (DDD)'
description: 'An architectural approach that aligns software design with business domain complexity through shared language, strategic modeling, and tactical design patterns.'
layer: null
schema: pattern
---

# Domain-Driven Design (DDD)

## Summary

Domain-Driven Design (DDD) is an architectural approach that tackles complex software projects by focusing the development effort on the core business domain, establishing a shared language between technical and domain experts, and using strategic and tactical design patterns to manage complexity.

## Core Principles

- **Ubiquitous Language:** A shared vocabulary between developers and domain experts that is reflected directly in the code structure and naming.
- **Bounded Contexts:** Explicit boundaries around domain models where specific terms and concepts have precise meaning and application.
- **Domain Model Centrality:** Business logic resides within rich domain objects rather than being scattered across service layers or external components.
- **Strategic Design:** High-level modeling focuses on identifying core domains, supporting subdomains, and context relationships.
- **Tactical Patterns:** Implementation patterns like Entities, Value Objects, Aggregates, and Domain Services organize domain logic effectively.

## Advantages / Use Cases

- **Complex Business Logic:** Ideal for applications with intricate business rules and workflows that require deep domain understanding.
- **Cross-functional Collaboration:** Facilitates communication between technical teams and business stakeholders through shared vocabulary.
- **Model Integrity:** Maintains consistency and correctness of business rules by centralizing domain logic within domain objects.
- **Large System Organization:** Bounded contexts provide natural boundaries for team ownership and system decomposition.
- **Long-term Maintainability:** Rich domain models remain comprehensible and modifiable as business requirements evolve.
- **Legacy System Modernization:** Provides structured approach for extracting and refactoring complex business logic from legacy systems.

## Disadvantages / Trade-offs

- **Learning Curve:** Requires significant investment in DDD concepts, patterns, and modeling techniques for the entire development team.
- **Modeling Overhead:** Extensive upfront domain analysis and modeling can slow initial development velocity compared to CRUD-based approaches.
- **Over-engineering Risk:** Simple applications may become unnecessarily complex when DDD patterns are applied inappropriately.
- **Domain Expert Availability:** Success depends heavily on access to knowledgeable domain experts who can invest time in collaborative modeling.
- **Context Boundary Complexity:** Incorrectly defined bounded contexts can lead to integration challenges and duplicated concepts across boundaries.
- **Infrastructure Complexity:** Advanced patterns like Event Sourcing and CQRS often associated with DDD introduce significant infrastructure overhead.
