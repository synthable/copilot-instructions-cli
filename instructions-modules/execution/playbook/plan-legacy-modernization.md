---
name: 'Plan Legacy Modernization'
description: 'A playbook for creating a safe, incremental plan to modernize a legacy system.'
tags:
  - architecture
  - legacy
  - refactoring
  - modernization
  - playbook
layer: null
---

# Plan Legacy Modernization

## Primary Directive

Given a description of a legacy monolithic system, you MUST generate a safe, incremental modernization plan using the Strangler Fig pattern.

## Process

1.  **Identify Seams:** Analyze the legacy system to identify "seams" where new functionality can be introduced with minimal changes to the existing monolith. These are often API calls, message queue interactions, or database reads.
2.  **Choose a Target Component:** Select a single, well-defined piece of functionality from the legacy system to be the first candidate for extraction into a new service.
3.  **Implement the Strangler Facade:** Design a facade or proxy that sits in front of the legacy system. Initially, it will pass all traffic directly to the monolith.
4.  **Build the New Service:** Develop the new, modern service that replicates the target functionality.
5.  **Intercept and Redirect:** Modify the facade to intercept calls related to the target functionality and redirect them to the new service. The rest of the traffic continues to flow to the legacy system.
6.  **Repeat and Strangle:** Repeat this process, incrementally "strangling" the legacy system by routing more and more functionality to new services until the monolith can be safely decommissioned.

## Constraints

- The modernization plan MUST be incremental. A "big bang" rewrite is not a valid strategy.
- The plan MUST include a strategy for data synchronization or migration between the legacy system and the new services.
- Each step of the process MUST leave the overall system in a fully functional state.
