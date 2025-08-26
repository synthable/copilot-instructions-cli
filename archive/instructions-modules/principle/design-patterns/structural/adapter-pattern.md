---
name: 'Adapter Pattern'
description: 'A structural design pattern that allows incompatible interfaces to work together by creating a wrapper that translates one interface to another, enabling integration of existing classes without modifying their source code.'
tier: principle
layer: null
schema: pattern
---

## Summary

The Adapter Pattern is a structural design pattern that acts as a bridge between two incompatible interfaces. It allows classes with incompatible interfaces to collaborate by wrapping one of the objects in an adapter that implements the expected interface, enabling integration without modifying existing code.

## Core Principles

- **Interface Translation:** The adapter MUST implement the target interface expected by the client while internally delegating calls to the adaptee object with a different interface.
- **Single Responsibility:** Each adapter MUST handle the conversion between exactly one pair of incompatible interfaces, maintaining clear boundaries and avoiding feature creep.
- **Delegation Over Inheritance:** Adapters SHOULD use composition and delegation rather than inheritance when possible to maintain loose coupling and avoid diamond problem scenarios.
- **Transparent Operation:** The client MUST interact with the adapter through the target interface without knowledge of the underlying adaptee implementation details.
- **Bidirectional Support:** Adapters MAY support bidirectional communication when both interfaces need to interact with each other in complex integration scenarios.

## Advantages / Use Cases

- **Legacy System Integration:** Enables integration of legacy systems and third-party libraries with modern applications without requiring modifications to existing code.
- **Interface Standardization:** Allows multiple implementations with different interfaces to be used through a common interface, simplifying client code and improving maintainability.
- **Third-Party Library Adaptation:** Facilitates the use of external libraries that don't conform to application-specific interface conventions without vendor lock-in.
- **Gradual Migration:** Supports phased migration strategies where old and new systems need to coexist during transition periods.
- **API Compatibility:** Maintains backward compatibility when evolving APIs by providing adapters for deprecated interface versions.

## Disadvantages / Trade-offs

- **Additional Abstraction Layer:** Introduces extra indirection that may impact performance and increase debugging complexity, especially in performance-critical applications.
- **Code Proliferation:** Can lead to numerous small adapter classes in systems with many incompatible interfaces, increasing maintenance overhead and codebase complexity.
- **Interface Limitations:** Adapter functionality is constrained by the least common denominator of both interfaces, potentially limiting feature accessibility.
- **Error Handling Complexity:** Exception handling and error propagation becomes more complex when crossing interface boundaries through adapters.
- **Testing Overhead:** Requires additional unit tests for adapter logic and integration tests for the complete adapted interface behavior.
