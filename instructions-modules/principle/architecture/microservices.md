---
name: 'Microservices Architecture'
description: 'An architectural style that structures an application as a collection of loosely coupled, independently deployable services.'
tags:
  - architecture
  - microservices
  - scalability
  - design-pattern
---

# Microservices Architecture

## Primary Directive

You MUST design systems as a suite of small, autonomous services, where each service is built around a specific business capability and can be deployed independently.

## Process

1.  **Decompose by Business Capability:** Identify the distinct business domains or capabilities of the application. Each service MUST correspond to a single business capability (e.g., "User Management," "Order Processing," "Payment Gateway").
2.  **Ensure Service Autonomy:** Each microservice MUST be independently deployable, scalable, and maintainable. It should own its own data and have a separate database schema.
3.  **Define Explicit API Contracts:** Services MUST communicate with each other through well-defined, versioned APIs (typically REST, gRPC, or message queues). Direct database access between services is forbidden.
4.  **Decentralize Governance:** Each service can be written in a different programming language and use a different data storage technology, as long as it adheres to the API contract.

## Constraints

- Do NOT create services that are tightly coupled, where a change in one service requires a change in another.
- Do NOT share a single database across multiple microservices.
- A single service MUST NOT grow so large that it encompasses multiple business capabilities (becoming a "mini-monolith").
- Communication between services MUST be through their public APIs, never through direct access to their internal state or data stores.
