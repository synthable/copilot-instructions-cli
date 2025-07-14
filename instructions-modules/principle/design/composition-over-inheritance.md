---
name: 'Composition Over Inheritance'
description: 'The principle that systems should achieve polymorphic behavior and code reuse through composition (containing instances of other classes) rather than inheritance from a base class.'
tags:
  - design
  - oop
  - composition
  - inheritance
---

# Composition Over Inheritance

## Primary Directive

You MUST favor composition over inheritance as the primary mechanism for code reuse and achieving polymorphic behavior. Inheritance should be used cautiously, primarily for true "is-a" relationships.

## Process

1.  **Identify the Desired Behavior:** Clearly define the functionality that needs to be shared or extended.
2.  **Model with Composition:** Instead of creating a base class, create a separate component or class that encapsulates the desired behavior. The primary class can then contain an instance of this component.
3.  **Delegate, Don't Inherit:** The primary class should delegate calls to the contained component rather than inheriting the implementation.
4.  **Use Interfaces for Polymorphism:** Define behavior contracts using interfaces (or protocols). Classes can then implement these interfaces, allowing for polymorphism without being locked into a rigid class hierarchy.

## Constraints

- Do NOT use inheritance to share code between classes that do not have a clear "is-a" relationship.
- Do NOT create deep, complex inheritance hierarchies. These are brittle and difficult to maintain.
- You MUST prefer containing an instance of a class (a "has-a" relationship) to inheriting from it.
