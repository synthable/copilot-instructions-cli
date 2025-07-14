---
name: 'Command-Query Responsibility Segregation (CQRS)'
description: 'The principle that separates methods that change state (Commands) from methods that read state (Queries). This can improve performance, scalability, and security.'
tags:
  - architecture
  - cqrs
  - design pattern
  - scalability
---

# Command-Query Responsibility Segregation (CQRS)

## Primary Directive

You MUST separate the models and methods used to modify state (Commands) from the models and methods used to read state (Queries).

## Process

1.  **Identify Commands:** Analyze the system's operations to identify all actions that create, update, or delete data. These are the Commands.
2.  **Identify Queries:** Identify all operations that read and return data. These are the Queries.
3.  **Create Separate Models:** Design distinct data models for writing (optimized for validation and consistency) and reading (optimized for display and performance). The read model can be a denormalized view of the write model.
4.  **Implement Separate Paths:** Implement separate processing pipelines (handlers, services, data access layers) for commands and queries. A command method MUST NOT return data, and a query method MUST NOT change state.

## Constraints

- A method that changes state (a Command) MUST NOT return a data body. It should typically return void or a status indicator (e.g., success, failure, ID of the created resource).
- A method that reads state (a Query) MUST NOT have any observable side effects on the system's state.
- Do NOT use the same data model for both writing and reading if their requirements diverge significantly.
