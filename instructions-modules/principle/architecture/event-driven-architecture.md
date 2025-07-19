---
name: 'Event-Driven Architecture'
description: 'An architectural style where components communicate through asynchronous events, enabling loose coupling and high scalability.'
tags:
  - architecture
  - events
  - asynchronous
  - pub-sub
---

# Event-Driven Architecture

## Primary Directive

When designing systems with asynchronous or complex workflows, you MUST use an event-driven model where components communicate via immutable events.

## Process

1.  **Define Events:** Identify significant state changes in the system and define them as clear, immutable events (e.g., `OrderPlaced`, `PaymentProcessed`).
2.  **Use a Message Broker:** Implement a central message broker (e.g., RabbitMQ, Kafka, AWS SQS/SNS) to handle the routing of events.
3.  **Publish Events:** When a service performs an action, it MUST publish an event to the message broker describing what happened. It does not know or care who is listening.
4.  **Subscribe to Events:** Services that need to react to an event MUST subscribe to it from the message broker and execute their logic upon receipt.

## Constraints

- Producers of events MUST NOT have any knowledge of the consumers.
- Events MUST represent a fact that has already occurred; they are immutable.
- The system MUST be designed to handle eventual consistency, as there is no immediate response in an asynchronous flow.
layer: null
