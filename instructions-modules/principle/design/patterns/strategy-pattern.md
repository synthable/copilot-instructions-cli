---
name: 'Strategy Pattern'
description: 'A behavioral design pattern that enables selecting an algorithm at runtime. It defines a family of algorithms, encapsulates each one, and makes them interchangeable.'
tags:
  - design-pattern
  - behavioral
  - strategy
  - policy
layer: null
---

# Strategy Pattern

## Primary Directive

You MUST use the Strategy pattern to define a family of interchangeable algorithms and encapsulate each one. This allows the algorithm to vary independently from the clients that use it.

## Process

1.  **Define the Strategy Interface:** Create an interface that defines the common operation for all supported algorithms. This is the "Strategy" interface.
2.  **Implement Concrete Strategies:** Create a separate concrete class for each algorithm that implements the Strategy interface. Each class provides a specific implementation of the operation.
3.  **Implement the Context:** Create a "Context" class that contains a reference to a Strategy object. The Context does not know the concrete type of the strategy. It works with all strategies through the common Strategy interface.
4.  **Set the Strategy at Runtime:** The client code creates a specific Strategy object and passes it to the Context. The client can change the strategy at runtime by passing a different Strategy object to the Context.

## Constraints

- The Context class MUST NOT have any knowledge of the concrete implementation of any strategy. It only knows about the Strategy interface.
- The algorithms MUST be interchangeable from the Context's perspective.
- Do NOT implement the algorithms directly in the Context class. Encapsulate them in separate Strategy classes.
