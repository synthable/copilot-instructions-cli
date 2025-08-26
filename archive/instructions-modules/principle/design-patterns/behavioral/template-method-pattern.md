---
name: 'Template Method Pattern'
description: 'A behavioral design pattern that defines the skeleton of an algorithm in a base class, allowing subclasses to override specific steps without changing the overall algorithm structure.'
tier: principle
layer: null
schema: pattern
---

## Summary

The Template Method Pattern defines the skeleton of an algorithm in a base class and lets subclasses override specific steps of the algorithm without changing its structure. This pattern promotes code reuse by capturing common algorithmic patterns while allowing customization of specific behaviors through inheritance.

## Core Principles

- **Algorithm Structure Definition:** The template method MUST define the complete algorithm skeleton with fixed step ordering that cannot be modified by subclasses.
- **Step-by-Step Decomposition:** Complex algorithms MUST be broken down into discrete, overridable methods that represent logical steps in the process.
- **Hook Methods:** The base class SHOULD provide optional hook methods with default empty implementations that subclasses can override for additional customization points.
- **Inversion of Control:** The base class MUST control the algorithm flow and call subclass implementations at appropriate points, maintaining the Hollywood Principle ("Don't call us, we'll call you").
- **Protected Access:** Algorithm step methods MUST be declared as protected to prevent external classes from calling them directly while allowing subclass overrides.

## Advantages / Use Cases

- **Code Reuse:** Eliminates duplication by factoring common algorithmic patterns into a shared base class that multiple implementations can extend.
- **Framework Development:** Provides a foundation for creating extensible frameworks where users can customize specific behaviors without understanding the entire algorithm.
- **Consistent Algorithm Structure:** Ensures all implementations follow the same algorithmic pattern, maintaining consistency across different variations.
- **Controlled Extension Points:** Offers precise control over which parts of an algorithm can be customized while protecting the core algorithmic integrity.
- **Batch Processing Patterns:** Ideal for implementing batch processing workflows where the overall structure remains constant but individual processing steps vary.

## Disadvantages / Trade-offs

- **Inheritance Coupling:** Creates tight coupling between base and derived classes, making the system more fragile to changes in the base class algorithm.
- **Limited Flexibility:** Subclasses cannot modify the algorithm structure itself, only the implementation of predefined steps, which may be restrictive for some use cases.
- **Debugging Complexity:** Understanding program flow becomes more difficult as execution jumps between base class and subclass methods throughout the algorithm.
- **Liskov Substitution Challenges:** Subclass implementations must maintain the behavioral contracts expected by the template method, which can be difficult to verify and enforce.
- **Class Hierarchy Dependencies:** Changes to the template method algorithm may require updates to all subclasses, creating maintenance burden across the inheritance hierarchy.
