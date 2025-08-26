---
name: 'Observer Pattern'
description: 'A behavioral design pattern where a subject object maintains a list of its dependent observers and notifies them automatically of any state changes.'
tier: principle
layer: null
schema: pattern
---

## Summary

The Observer Pattern defines a one-to-many dependency between objects, where a central object (the Subject) automatically notifies a set of dependent objects (the Observers) when its state changes. This promotes loose coupling, as the subject does not need to know the concrete classes of its observers.

## Core Principles

- **Subject-Observer Separation:** The Subject and Observers MUST be independent. The Subject's only responsibility is to maintain a list of observers and notify them.
- **Common Observer Interface:** All observers MUST implement a common interface (e.g., with an `update()` method) that the Subject uses to send notifications.
- **Dynamic Registration:** Observers MUST be able to subscribe (`register`) and unsubscribe (`unregister`) from the Subject at runtime.
- **Push or Pull Model:** The Subject can either "push" all relevant state to the observers in the `update` call, or observers can "pull" the required data from the subject after receiving a notification.

## Advantages / Use Cases

- **Loose Coupling:** The Subject knows nothing about its observers other than that they implement the Observer interface. This allows you to add new observers without modifying the Subject.
- **Broadcast Communication:** It is ideal for implementing event-handling systems where a change in one object needs to be broadcast to many others.
- **Separation of Concerns:** It allows you to vary subjects and observers independently, leading to a more modular and maintainable system.
- **GUI Event Systems:** Widely used in graphical user interface toolkits to decouple event sources from event handlers.

## Disadvantages / Trade-offs

- **Unexpected Update Cascade:** In complex systems, a single change can trigger a long and unpredictable chain of updates across many observers, which can be difficult to debug.
- **Performance Issues:** If there are many observers or the update logic is complex, the notification process can become a performance bottleneck.
- **Memory Leaks:** If observers are not properly unregistered (e.g., when they are destroyed), it can lead to memory leaks, as the Subject will hold dangling references.
- **No Knowledge of Changes:** The basic pattern doesn't tell the observer _what_ changed in the subject, forcing the observer to query the subject for its state, which may be inefficient.
