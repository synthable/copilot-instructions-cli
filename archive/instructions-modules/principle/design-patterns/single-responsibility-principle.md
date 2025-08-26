---
name: 'Single Responsibility Principle'
description: 'A class should have only one reason to change, meaning it should have only one job or responsibility.'
tier: principle
layer: null
schema: pattern
---

## Summary

The Single Responsibility Principle (SRP) states that a class should have only one reason to change, which means it should have only one job or responsibility. This principle helps to keep classes focused and maintainable.

## Core Principles

- **One Responsibility**: Each class should be responsible for a single piece of functionality.
- **Cohesion**: The methods and properties of a class should be highly related to its single responsibility.

## Advantages / Use Cases

- **Improved Readability**: Classes with a single responsibility are easier to understand.
- **Enhanced Reusability**: Smaller, focused classes are easier to reuse in different parts of an application.
- **Easier Maintenance**: Changes to one responsibility are less likely to affect other parts of the system.

## Disadvantages / Trade-offs

- **Increased Number of Classes**: Applying SRP can lead to a larger number of smaller classes, which might increase complexity in managing them.
- **Potential for Over-Engineering**: In some cases, applying SRP too strictly can lead to unnecessary complexity, especially in smaller projects.
