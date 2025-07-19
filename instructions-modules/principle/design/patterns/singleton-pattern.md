---
tier: principle
name: 'Singleton Pattern'
description: 'A guide to the Singleton Pattern, ensuring that a class has only one instance and provides a global point of access to it.'
tags:
  - design-pattern
  - creational
  - singleton
layer: null
---

# Singleton Pattern

## Primary Directive

You MUST use the Singleton Pattern when it is essential to have exactly one instance of a class. The singleton provides a global access point to this instance, but you should use it with caution as it can introduce global state into your application.

## Process

1.  **Make the Constructor Private:** The constructor of the singleton class MUST be private to prevent other classes from instantiating it.
2.  **Create a Static Instance:** The singleton class MUST contain a static private member that holds the single instance of the class.
3.  **Provide a Static Accessor Method:** The singleton class MUST provide a public static method (often named `getInstance()`) that returns the single instance. On the first call, this method creates the instance and stores it in the static member. On subsequent calls, it returns the existing instance.

## Constraints

- You MUST NOT use the Singleton Pattern to solve the problem of global access to configuration or resources. Use dependency injection instead, as it is more flexible and testable.
- You MUST be aware that singletons can make unit testing difficult, as they introduce global state. Mocks may be required to isolate components that depend on a singleton.
- In a multi-threaded environment, you MUST ensure that the singleton's instantiation is thread-safe. This may require using locks or other synchronization mechanisms.
