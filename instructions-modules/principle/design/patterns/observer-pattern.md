---
name: 'Observer Pattern'
description: 'A behavioral design pattern where an object, named the subject, maintains a list of its dependents, called observers, and notifies them automatically of any state changes.'
tags:
  - design-pattern
  - behavioral
  - observer
  - pub-sub
---

# Observer Pattern

## Primary Directive

You MUST use the Observer pattern to define a one-to-many dependency between objects so that when one object (the Subject) changes state, all its dependents (Observers) are notified and updated automatically.

## Process

1.  **Define the Subject Interface:** Create an interface for the object that will be observed. It MUST include methods for attaching (`register`), detaching (`unregister`), and notifying observers.
2.  **Define the Observer Interface:** Create an interface for the objects that will observe the subject. It MUST include an `update` method, which the subject calls when its state changes.
3.  **Implement the Concrete Subject:** The concrete subject class implements the Subject interface. It maintains a list of observers and contains the core business logic. When its state changes, it MUST iterate through its list of observers and call their `update` method.
4.  **Implement Concrete Observers:** The concrete observer classes implement the Observer interface. Each observer registers with a subject to receive updates. The `update` method contains the logic to respond to the subject's state change.

## Constraints

- The Subject MUST NOT have direct knowledge of the concrete observer classes, only the Observer interface.
- The communication between the Subject and its Observers MUST be one-way (Subject to Observers).
- The Subject and Observers MUST be loosely coupled.
