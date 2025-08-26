---
name: 'Hexagonal Architecture (Ports and Adapters)'
description: 'An architectural pattern that isolates the application core from external services.'
tier: principle
layer: null
schema: pattern
---

## Summary

Hexagonal Architecture, also known as Ports and Adapters, is an architectural pattern that isolates the application core from external services. This is achieved by defining well-defined interfaces (ports) and implementing them with adapters.

## Core Principles

- **Ports**: Interfaces that define the contract for interacting with the application core.
- **Adapters**: Implementations of the ports that connect the application core to external services.
- **Application Core**: The business logic of the application, which is independent of any external technology or framework.

## Advantages / Use Cases

- **Testability**: The application core can be tested in isolation from external services.
- **Flexibility**: It is easy to swap out external services by simply creating a new adapter.
- **Maintainability**: The separation of concerns makes the code easier to understand and maintain.

## Disadvantages / Trade-offs

- **Increased Complexity**: The use of ports and adapters can add complexity to the codebase.
- **Boilerplate Code**: It can require writing more boilerplate code to set up the ports and adapters.
