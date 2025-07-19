---
name: 'Design Microservices Architecture'
description: 'A playbook for designing a system based on the microservices architectural style.'
tags:
  - architecture
  - microservices
  - playbook
  - design
---

# Design Microservices Architecture

## Primary Directive

Given a set of business requirements, you MUST generate a high-level design for a microservices architecture that adheres to the principles of loose coupling and high cohesion.

## Process

1.  **Identify Bounded Contexts:** Analyze the requirements using Domain-Driven Design principles to identify the core business domains. These will form the boundaries of your microservices.
2.  **Define Service APIs:** For each identified service, define its public API contract. Specify the commands it accepts, the queries it answers, and the events it emits.
3.  **Plan Data Ownership:** Each service MUST own its own data. Define the data schema for each service and explicitly forbid direct database access between services.
4.  **Select Communication Patterns:** Propose a communication strategy. Use synchronous APIs (e.g., REST, gRPC) for queries and commands that require an immediate response. Use asynchronous events (e.g., via a message queue) for notifications and to decouple services.
5.  **Address Cross-Cutting Concerns:** Outline a strategy for handling cross-cutting concerns like service discovery, configuration management, authentication/authorization, and distributed tracing.

## Constraints

- The proposed design MUST avoid creating a "distributed monolith" where services are chatty and tightly coupled.
- The number of services should be justified; do not decompose the system more than necessary.
- The design MUST include a plan for observability (logging, metrics, tracing) from day one.
layer: null
