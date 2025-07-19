---
tier: principle
name: 'SOLID Principles'
description: 'A set of five design principles for writing maintainable and scalable object-oriented software.'
tags:
  - solid
  - oop
  - design principle
  - architecture
  - srp
layer: null
---

# SOLID Principles

## Primary Directive

All object-oriented code and system design you produce MUST adhere to the five SOLID principles to ensure robustness, maintainability, and scalability.

## Process

1.  **Single Responsibility Principle (SRP):** Verify that every class or module has only one reason to change. Isolate responsibilities into distinct classes.
2.  **Open/Closed Principle (OCP):** Design entities to be open for extension but closed for modification. Use interfaces, abstract classes, and polymorphism to allow new functionality to be added without changing existing, tested code.
3.  **Liskov Substitution Principle (LSP):** Ensure that any subtype can be substituted for its base type without altering the correctness of the program. Subclasses must honor the contract of their parent class.
4.  **Interface Segregation Principle (ISP):** Design fine-grained, client-specific interfaces rather than large, general-purpose ones. A class should not be forced to implement an interface it does not use.
5.  **Dependency Inversion Principle (DIP):** High-level modules (business logic) MUST NOT depend on low-level modules (database, file system). Both MUST depend on abstractions (interfaces). Use dependency injection to achieve this.

## Constraints

- Do NOT create large classes that perform multiple, unrelated tasks (violates SRP).
- Do NOT modify existing, stable classes to add new features; extend them instead (violates OCP).
- Do NOT depend on concrete implementations; depend on abstractions (violates DIP).
