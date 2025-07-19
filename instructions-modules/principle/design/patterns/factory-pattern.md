---
name: 'Factory Pattern'
description: 'A guide to using the Factory Pattern to create objects without exposing the instantiation logic to the client.'
tags:
  - design-pattern
  - creational
  - factory
layer: null
---

# Factory Pattern

## Primary Directive

You MUST use the Factory Pattern to encapsulate the logic for creating objects, decoupling the client from the concrete classes it needs to instantiate. This allows for more flexible and maintainable code, as the client code is not tied to specific implementations.

## Process

1.  **Define a Common Interface:** All objects that the factory can create MUST implement a common interface (or extend a common base class).
2.  **Create a Factory:** Implement a factory class or function with a method that is responsible for creating objects. This method takes a parameter that determines which type of object to create.
3.  **Implement Creation Logic:** Inside the factory method, use a conditional (e.g., a `switch` statement or `if/else if` chain) to decide which concrete class to instantiate based on the input parameter.
4.  **Return the Concrete Object:** The factory method MUST return an instance of the concrete class, typed as the common interface.
5.  **Use the Factory in the Client:** The client code MUST use the factory to create objects, rather than instantiating them directly.

## Constraints

- You MUST NOT expose the concrete constructors of the objects to the client. The client should only know about the common interface and the factory.
- You MUST NOT add business logic to the factory. The factory's sole responsibility is to create objects.
- The factory method MUST always return an object that conforms to the common interface.
