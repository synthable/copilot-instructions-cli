---
name: 'Layered Architecture'
description: 'An architectural pattern that organizes software into horizontal layers, each with a specific responsibility. Layers can only communicate with adjacent layers.'
tags:
  - architecture
  - layered-architecture
  - n-tier
  - separation-of-concerns
layer: null
---

# Layered Architecture

## Primary Directive

You MUST structure applications into logical, horizontal layers, where each layer has a specific role and responsibility. Communication between layers MUST follow strict rules to ensure separation of concerns.

## Process

1.  **Define Standard Layers:** Identify the standard layers for the application. A typical set includes:
    - **Presentation Layer (UI):** Responsible for all user interface logic.
    - **Application/Business Layer:** Responsible for implementing business rules and workflows.
    - **Persistence/Data Access Layer:** Responsible for communication with the database.
    - **Database Layer:** The actual database or data store.
2.  **Enforce Layer Isolation:** A layer can only communicate with the layer directly below it. For example, the Presentation Layer can call the Application Layer, but it CANNOT call the Persistence Layer directly.
3.  **Use Data Transfer Objects (DTOs):** Data passed between layers MUST be in a simple, neutral format (DTOs). Do not pass internal domain models or database entities directly to the UI.
4.  **Define Clear Interfaces:** The contract between each layer MUST be a well-defined interface, allowing the implementation of a layer to be swapped out without affecting other layers.

## Constraints

- A higher-level layer MUST NOT be called by a lower-level layer. Communication is one-way.
- A layer MUST NOT bypass the layer directly below it to communicate with deeper layers.
- Business logic MUST NOT be placed in the Presentation Layer.
- Database queries MUST NOT be placed in the Application or Presentation Layers.
