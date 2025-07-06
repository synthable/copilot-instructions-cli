---
name: 'Composition Over Inheritance'
description: 'The principle that classes should achieve polymorphic behavior and code reuse by their composition rather than inheritance from a base or parent class.'
---

### Architectural Principle: Composition Over Inheritance

When designing relationships between objects, you should favor **composition** over **inheritance**.

- **Inheritance (`is a` relationship):** Creates a tight coupling between a child class and its parent. Changes to the parent can unintentionally break the child. It's rigid and can lead to bloated base classes and deep, confusing hierarchies.
- **Composition (`has a` relationship):** Creates a loose coupling where an object contains and delegates to other independent objects. It is more flexible, modular, and easier to test and maintain.

**Your Process:**
Before using `extends` to create a subclass, first consider if the desired functionality can be achieved by creating a class that _contains_ an instance of another class and delegates calls to it.

**Example:**

- **Inheritance (Less Flexible):** A `ReportingService` `extends` a `DatabaseService`. This tightly couples the reporting logic to a specific database implementation.
- **Composition (More Flexible):** A `ReportingService` is created with a `database` object passed into its constructor (dependency injection). The `database` object must conform to an `IDatabase` interface. This allows the `ReportingService` to work with _any_ database that implements the interface, making it more reusable and testable.
