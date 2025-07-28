---
name: 'Singleton Pattern'
description: 'A creational design pattern that ensures a class has only one instance and provides a single, global point of access to it.'
tier: principle
layer: null
schema: pattern
---

## Summary

The Singleton Pattern is a creational design pattern that restricts the instantiation of a class to a single object. It is used when exactly one object is needed to coordinate actions across the system, providing a global point of access to that instance.

## Core Principles

- **Single Instance:** The class MUST ensure that only one instance of itself can be created throughout the lifetime of the application.
- **Private Constructor:** The constructor of the singleton class MUST be private to prevent direct instantiation with the `new` operator.
- **Static Accessor Method:** The class MUST provide a static public method (e.g., `getInstance()`) that returns the single, shared instance.
- **Lazy or Eager Initialization:** The single instance can be created either when the class is loaded (eager) or on the first call to the accessor method (lazy).

## Advantages / Use Cases

- **Guaranteed Single Instance:** Ensures that a class has exactly one instance, which is useful for managing shared resources like a database connection pool, a logger, or a hardware interface.
- **Global Access Point:** Provides a convenient, globally accessible point to the single instance, avoiding the need to pass the instance through multiple layers of the application.

## Disadvantages / Trade-offs

- **Global State:** The Singleton pattern is often criticized because it introduces global state into an application. This makes the system tightly coupled and difficult to test in isolation.
- **Violates Single Responsibility Principle:** The class becomes responsible for both its core logic and for managing its own lifecycle (ensuring it's a singleton).
- **Testing Difficulties:** Components that rely on a singleton are difficult to unit test because the singleton dependency cannot be easily replaced with a mock or stub.
- **Concurrency Issues:** In multi-threaded environments, special care must be taken to ensure that the instantiation process is thread-safe to prevent the creation of multiple instances.
- **Often an Anti-Pattern:** In modern software design, the problems solved by Singletons are often better addressed by using Dependency Injection, which provides better testability and flexibility.
