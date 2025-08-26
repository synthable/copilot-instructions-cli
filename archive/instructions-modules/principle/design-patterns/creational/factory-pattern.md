---
name: 'Factory Pattern'
description: 'A creational design pattern that provides an interface for creating objects without specifying their exact classes, enabling loose coupling between client code and object creation logic.'
tier: principle
layer: null
schema: pattern
---

## Summary

The Factory Pattern is a creational design pattern that provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created. It encapsulates object creation logic and promotes loose coupling by eliminating the need for client code to know about specific concrete classes.

## Core Principles

- **Interface-Based Creation:** All objects created by the factory MUST implement a common interface or extend a common base class, ensuring polymorphic usage by client code.
- **Encapsulated Creation Logic:** Object instantiation logic MUST be encapsulated within factory methods, hiding concrete class selection and instantiation details from client code.
- **Parameter-Driven Selection:** Factory methods MUST use input parameters to determine which concrete class to instantiate, enabling runtime object type selection.
- **Single Responsibility:** Factory classes MUST focus solely on object creation and MUST NOT contain business logic unrelated to instantiation.
- **Type Safety:** Factory methods MUST return objects typed as the common interface, ensuring compile-time type safety while hiding implementation details.

## Advantages / Use Cases

- **Loose Coupling:** Eliminates direct dependencies between client code and concrete classes, making the system more flexible and easier to modify.
- **Centralized Creation Logic:** Consolidates object creation logic in one location, simplifying maintenance and enabling consistent object initialization.
- **Runtime Type Selection:** Enables dynamic object creation based on runtime conditions, configuration, or user input without modifying client code.
- **Easier Testing:** Facilitates unit testing by allowing injection of mock or test implementations through the factory interface.
- **Framework Development:** Provides extensibility points in frameworks where different implementations can be plugged in without changing core framework code.
- **Configuration-Driven Instantiation:** Supports object creation based on configuration files or environment settings, enabling deployment-time customization.

## Disadvantages / Trade-offs

- **Increased Complexity:** Introduces additional abstraction layers and classes, potentially over-complicating simple object creation scenarios.
- **Indirect Object Creation:** Adds indirection that may make code flow less obvious and debugging more complex compared to direct instantiation.
- **Factory Maintenance:** Requires updating factory logic whenever new concrete classes are added, creating a potential maintenance bottleneck.
- **Parameter Coupling:** Factory methods may become tightly coupled to parameter formats or conventions, requiring coordination across different parts of the system.
- **Performance Overhead:** Additional method calls and conditional logic may introduce minor performance overhead compared to direct object instantiation.
