---
tier: principle
name: 'Layered Architecture'
description: 'An architectural pattern that organizes software systems into horizontal layers with specific responsibilities, where each layer depends only on the layer immediately below it to enforce separation of concerns and maintainability.'
tier: principle
layer: null
schema: pattern
---

## Summary

Layered Architecture is a software architectural pattern that organizes application components into horizontal layers or tiers, where each layer represents a specific level of abstraction and has well-defined responsibilities. Communication flows unidirectionally from higher layers to lower layers, typically through defined interfaces, to enforce separation of concerns and maintain clear architectural boundaries.

## Core Principles

- **Hierarchical Organization:** Software components MUST be organized into distinct horizontal layers, typically including Presentation, Business/Application, Data Access, and Infrastructure layers, with each layer representing a specific level of abstraction.
- **Unidirectional Dependencies:** Higher-level layers MAY depend on lower-level layers, but lower-level layers MUST NOT depend on higher-level layers, ensuring acyclic dependencies and maintaining architectural integrity.
- **Adjacent Layer Communication:** Each layer MUST communicate only with the layer immediately below it, preventing direct access to non-adjacent layers and maintaining proper abstraction boundaries.
- **Interface-Based Contracts:** Communication between layers MUST occur through well-defined interfaces or contracts that abstract implementation details and enable layer substitutability.
- **Layer-Specific Responsibilities:** Each layer MUST have clearly defined responsibilities that do not overlap with other layers, such as UI concerns in the presentation layer and data access logic in the persistence layer.
- **Data Transformation Boundaries:** Data passed between layers MUST be transformed into appropriate representations (DTOs, view models, domain objects) that respect layer boundaries and encapsulate layer-specific concerns.

## Advantages / Use Cases

- **Clear Separation of Concerns:** Enforces clean boundaries between different aspects of the system such as user interface, business logic, and data access, making the codebase more organized and maintainable.
- **Independent Development and Testing:** Teams can work on different layers simultaneously without interfering with each other, and layers can be unit tested in isolation using mocks or stubs.
- **Technology Flexibility:** Individual layers can be replaced or upgraded independently, such as changing the database technology without affecting business logic or switching UI frameworks without modifying core application logic.
- **Reusability and Modularity:** Business logic and data access layers can be reused across different presentation interfaces (web, mobile, API) without duplication.
- **Scalability and Performance Optimization:** Different layers can be deployed and scaled independently, allowing for optimized resource allocation based on specific layer requirements.
- **Security and Access Control:** Security concerns can be centralized at appropriate layers, with authentication/authorization logic separated from business logic and data access controls.

## Disadvantages / Trade-offs

- **Performance Overhead:** Multiple layer boundaries introduce additional method calls, data transformations, and potential serialization costs that can impact application performance.
- **Increased Complexity:** Simple operations may require changes across multiple layers, adding development overhead and increasing the cognitive load for developers.
- **Over-Engineering Risk:** Unnecessary layering for simple applications can create excessive abstraction and complexity without providing meaningful benefits.
- **Tight Coupling Between Adjacent Layers:** While layers are decoupled vertically, adjacent layers often become tightly coupled through shared interfaces and data contracts.
- **Limited Cross-Layer Optimization:** Strict layer boundaries can prevent efficient cross-cutting optimizations such as database query optimization that spans multiple layers.
- **Deployment and Distribution Challenges:** Physical separation of layers across different servers or services introduces network latency, distributed system complexity, and potential points of failure.
