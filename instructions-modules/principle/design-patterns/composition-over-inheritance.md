---
name: 'Composition Over Inheritance Principle'
description: 'A design principle stating that systems should achieve polymorphic behavior and code reuse by containing instances of other classes rather than inheriting from a base class.'
tier: principle
layer: null
schema: pattern
---

## Summary

Composition Over Inheritance is a fundamental design principle that advocates for building complex functionality by combining simple, independent objects (composition) instead of creating rigid class hierarchies (inheritance). This approach leads to more flexible, maintainable, and testable software systems.

## Core Principles

- **HAS-A over IS-A:** Relationships between objects SHOULD model a "has-a" or "uses-a" relationship (composition) rather than a strict "is-a" relationship (inheritance). An object should own instances of other objects that provide desired functionality.
- **Behavior Delegation:** A class SHOULD achieve code reuse by delegating tasks to the objects it contains rather than inheriting an implementation from a parent class.
- **Interface-Based Polymorphism:** Polymorphism MUST be achieved by implementing shared interfaces rather than extending a common base class. This decouples the client from specific implementations.
- **Encapsulated Behavior:** Functionality is encapsulated within small, single-responsibility components that can be composed together, rather than being spread across a complex inheritance chain.

## Advantages / Use Cases

- **Increased Flexibility:** Composition is more flexible than inheritance because relationships can be modified at runtime by changing the composed objects.
- **Reduced Coupling:** It avoids the tight coupling between parent and child classes that is inherent in inheritance, making the system less brittle.
- **Enhanced Testability:** Classes that use composition are easier to unit test because dependencies can be easily replaced with mocks or stubs.
- **Avoids Hierarchy Problems:** It sidesteps the issues of deep and complex inheritance chains, such as the "diamond problem" in languages that support multiple inheritance.

## Disadvantages / Trade-offs

- **Increased Indirection:** Can lead to a larger number of smaller objects and more delegation, which can sometimes make the code harder to trace during debugging.
- **Boilerplate Code:** Manually implementing delegation for every method in the composed object's interface can be verbose, although this can be mitigated by language features or IDEs.
- **Less Intuitive for True Hierarchies:** For genuine "is-a" relationships where a subtype truly is a specialized version of a base type, inheritance can be a more natural and simpler model.
