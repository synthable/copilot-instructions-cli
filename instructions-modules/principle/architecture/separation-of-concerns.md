---
name: 'Separation of Concerns'
description: 'The principle of separating a system into distinct sections, where each section addresses a separate concern.'
tags:
  - architecture
  - modularity
  - design principle
  - SoC
---

# Separation of Concerns

## Primary Directive

When designing or modifying any system, you MUST partition it into distinct, loosely-coupled components, where each component addresses a single, well-defined concern.

## Process

1.  **Identify Concerns:** Analyze the system requirements to identify the distinct areas of responsibility (the "concerns"). Common concerns include, but are not limited to:
    - User Interface (Presentation Logic)
    - Business Logic (Application Rules)
    - Data Access (Persistence)
    - Authentication & Authorization
    - Configuration Management
2.  **Assign to Components:** For each concern, assign it to a specific component (e.g., a class, module, function, or microservice). A component MUST NOT handle more than one primary concern.
3.  **Define Explicit Interfaces:** Design and implement clear, minimal interfaces for communication between components. A component should hide its internal implementation details.
4.  **Minimize Dependencies:** Structure the system to minimize dependencies between components. For example, business logic should not depend directly on UI components.

## Constraints

- Do NOT place unrelated logic within the same component (e.g., mixing database queries directly into a UI rendering function).
- Do NOT create components that have multiple, unrelated responsibilities (i.e., "God Objects").
- A component MUST NOT expose its internal workings; it should only expose the public interface for its specific concern.
