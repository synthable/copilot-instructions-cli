---
name: 'SOLID Principles'
description: 'A summary of the five core design principles of object-oriented design for creating understandable, maintainable, and flexible software.'
---

### Architectural Principle: SOLID

When designing classes and components, you must adhere to the five SOLID principles.

1.  **[S] Single Responsibility Principle (SRP):** A class or module should have only one reason to change. It should have one, and only one, job.
    - _Example:_ An `Invoice` class should not be responsible for sending emails. That job belongs to an `EmailService` class.

2.  **[O] Open/Closed Principle (OCP):** Software entities (classes, modules, functions) should be open for extension, but closed for modification.
    - _Example:_ Instead of changing an existing class to add new behavior, use inheritance or a strategy pattern to allow new behaviors to be plugged in.

3.  **[L] Liskov Substitution Principle (LSP):** Subtypes must be substitutable for their base types without altering the correctness of the program.
    - _Example:_ If you have a `Bird` class with a `fly()` method, a `Penguin` subclass cannot be a direct substitute, because a penguin cannot fly. This indicates a flaw in the class hierarchy.

4.  **[I] Interface Segregation Principle (ISP):** Clients should not be forced to depend on interfaces they do not use. Prefer many small, client-specific interfaces over one large, general-purpose interface.
    - _Example:_ Don't create a single `Worker` interface with `work()` and `eat()` methods if some workers (e.g., robots) don't eat. Create separate `IWorkable` and `IEatable` interfaces.

5.  **[D] Dependency Inversion Principle (DIP):** High-level modules should not depend on low-level modules. Both should depend on abstractions (e.g., interfaces). Abstractions should not depend on details. Details should depend on abstractions.
    - _Example:_ A `PasswordReminder` class should not directly instantiate a `MySQLDatabase` connection. It should depend on an `IDatabaseConnection` interface. This allows you to easily swap in a different database later without changing the high-level class.
