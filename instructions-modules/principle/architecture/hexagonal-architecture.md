---
name: 'Hexagonal Architecture (Ports and Adapters)'
description: 'An architectural pattern that isolates the application core from external services through well-defined interfaces (ports) and implementations (adapters).'
tags:
  - architecture
  - ports and adapters
  - hexagonal
  - decoupling
layer: null
---

# Hexagonal Architecture (Ports and Adapters)

## Primary Directive

You MUST design the application to isolate the core business logic from external concerns (like UI, databases, or third-party APIs) using a system of ports and adapters.

## Process

1.  **Define the Application Core:** Isolate the pure business logic and domain models. This core MUST NOT have any dependencies on external technologies.
2.  **Define Ports:** For every interaction the core needs with the outside world, define an interface (a "port"). Examples: `OrderRepositoryPort`, `NotificationServicePort`. The core depends only on these ports.
3.  **Implement Adapters:** For each port, create one or more concrete implementations ("adapters").
    - _Driving Adapters:_ These drive the application (e.g., a `RESTControllerAdapter` that implements a `UserInputPort`).
    - _Driven Adapters:_ These are driven by the application (e.g., a `PostgreSQLAdapter` that implements the `OrderRepositoryPort`).
4.  **Connect via Dependency Injection:** The adapters are "plugged into" the ports from the outside using dependency injection, keeping the core pure and isolated.

## Constraints

- The application core MUST NOT contain any code related to a specific framework, database, or external service.
- Communication between the core and the outside world MUST only happen through a defined port.
