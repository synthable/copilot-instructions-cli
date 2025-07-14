---
name: 'Design for Scalability'
description: 'The principle of designing systems that can handle increased load by adding resources, typically horizontally.'
tags:
  - architecture
  - scalability
  - performance
  - high availability
---

# Design for Scalability

## Primary Directive

You MUST design systems to be horizontally scalable, enabling them to handle increased load by adding more machine instances rather than increasing the size of a single instance.

## Process

1.  **Design Stateless Components:** Ensure that application components are stateless wherever possible. State should be externalized to a dedicated service (e.g., a database, cache, or session store).
2.  **Avoid Sticky Sessions:** Do not design systems that require a user's requests to always be routed to the same server instance.
3.  **Use a Load Balancer:** Place a load balancer in front of all stateless components to distribute incoming traffic evenly across all available instances.
4.  **Identify and Decouple Bottlenecks:** Analyze the system to find potential bottlenecks (like a single database writer). Decouple these components so they can be scaled independently.

## Constraints

- A system is not horizontally scalable if adding a new server instance requires manual configuration changes.
- Do NOT store session state in the memory of an application server.
