---
name: 'Builder Pattern'
description: 'A creational design pattern that constructs complex objects step by step, separating the construction process from the representation to enable flexible object creation with optional parameters.'
tier: principle
layer: null
schema: pattern
---

## Summary

The Builder Pattern is a creational design pattern that provides a flexible solution for constructing complex objects with multiple optional parameters or configuration steps. It separates the construction process from the final representation, allowing the same construction process to create different representations of an object.

## Core Principles

- **Step-by-Step Construction:** Complex objects MUST be built incrementally through a series of clearly defined steps, each responsible for setting specific properties or configurations.
- **Method Chaining:** Builder methods MUST return the builder instance to enable fluent interface patterns that improve code readability and expressiveness.
- **Immutable Product:** The final object produced by the builder SHOULD be immutable once constructed, preventing modification after creation to ensure object integrity.
- **Validation on Build:** All required parameters and business rules MUST be validated when the `build()` method is called, not during individual setter calls.
- **Director Independence:** The builder MUST be usable directly by client code without requiring a separate Director class, though directors MAY be used for complex construction scenarios.

## Advantages / Use Cases

- **Complex Object Creation:** Ideal for creating objects with numerous optional parameters, eliminating the need for multiple constructor overloads or telescoping constructor anti-patterns.
- **Immutable Object Construction:** Enables creation of immutable objects that require complex initialization logic while maintaining thread safety and preventing partial construction states.
- **Readable API:** Provides self-documenting code through method names that clearly indicate what each step accomplishes, improving code maintainability and developer experience.
- **Flexible Configuration:** Allows different configurations of the same object type without creating multiple specialized constructors or factory methods.
- **Step Validation:** Enables validation of construction steps and business rules at the appropriate time during the building process.

## Disadvantages / Trade-offs

- **Increased Code Complexity:** Requires additional builder classes and methods, increasing the overall codebase size and maintenance overhead for simple objects.
- **Memory Overhead:** Creates additional objects during construction process, potentially impacting memory usage compared to direct constructor calls.
- **Learning Curve:** Developers must understand the builder pattern conventions and proper usage patterns, which may slow initial development velocity.
- **Potential Overuse:** Can be applied inappropriately to simple objects where constructors or factory methods would be more suitable and efficient.
- **Validation Timing:** Delayed validation until build() is called may allow invalid intermediate states to exist during construction.
