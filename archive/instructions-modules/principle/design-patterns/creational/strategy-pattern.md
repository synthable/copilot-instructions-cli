---
name: 'Strategy Pattern'
description: 'A behavioral design pattern that defines a family of interchangeable algorithms, encapsulates each one, and allows them to be selected at runtime.'
tier: principle
layer: null
schema: pattern
---

## Summary

The Strategy Pattern is a behavioral design pattern that enables selecting an algorithm at runtime. It defines a family of algorithms, encapsulates each one into a separate class, and makes their objects interchangeable. This allows the algorithm to vary independently from the clients that use it.

## Core Principles

- **Strategy Interface:** There MUST be a common interface that all concrete strategy classes implement. This interface defines the method(s) that the context will use to execute the algorithm.
- **Concrete Strategies:** Each specific algorithm MUST be implemented in its own class that conforms to the Strategy interface.
- **Context:** A "Context" class MUST maintain a reference to a Strategy object. The Context delegates the work to the strategy object instead of implementing the logic itself.
- **Runtime Selection:** The client of the Context MUST be able to select and set the desired strategy at runtime.

## Advantages / Use Cases

- **Runtime Flexibility:** Allows you to change the behavior of an object at runtime by swapping out its strategy. This is a powerful alternative to conditional logic.
- **Open/Closed Principle:** You can introduce new strategies without modifying the Context or other existing strategies, adhering to the Open/Closed Principle.
- **Separation of Concerns:** It separates the algorithmic logic from the business logic of the Context class, leading to cleaner, more maintainable code.
- **Eliminates Conditional Statements:** It provides an elegant way to replace a complex `if/else` or `switch` statement that selects between different behaviors.

## Disadvantages / Trade-offs

- **Increased Number of Objects:** The pattern can lead to a large number of small strategy objects in the application, which can increase overall complexity if not managed well.
- **Client Awareness:** The client code must be aware of the different strategies and understand which one to use for a given situation. This can add complexity to the client.
- **Communication Overhead:** There can be a communication overhead between the Context and the Strategy objects, especially if the strategy needs a lot of data from the context to perform its work.
