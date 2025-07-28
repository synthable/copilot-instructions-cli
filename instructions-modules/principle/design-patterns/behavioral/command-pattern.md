---
name: 'Command Pattern'
description: 'A behavioral design pattern that encapsulates requests as objects, enabling parameterization of clients with different requests, queuing operations, logging requests, and supporting undo functionality.'
tier: principle
layer: null
schema: pattern
---

## Summary

The Command Pattern encapsulates a request as an object, allowing you to parameterize objects with different requests, queue or log requests, and support undoable operations. This pattern decouples the object that invokes the operation from the object that performs it, providing flexibility in request handling and execution.

## Core Principles

- **Request Encapsulation:** Each command MUST encapsulate a complete request including the receiver object, method name, and all necessary parameters required for execution.
- **Common Interface:** All commands MUST implement a common interface (typically with `execute()` and optionally `undo()` methods) to enable polymorphic treatment.
- **Receiver Delegation:** Commands MUST delegate the actual work to receiver objects rather than implementing business logic directly within the command itself.
- **Stateless Execution:** Commands SHOULD be stateless regarding their execution context, storing only the data necessary to perform their specific operation.
- **Reversible Operations:** Commands that modify system state SHOULD implement undo functionality to support reversible operations and transaction-like behavior.

## Advantages / Use Cases

- **Undo/Redo Functionality:** Enables implementation of undo and redo operations by storing executed commands and their inverse operations in a command history.
- **Request Queuing:** Allows queuing, scheduling, and batching of operations for later execution, supporting asynchronous processing and load balancing.
- **Macro Operations:** Facilitates creation of complex macro operations by combining multiple simple commands into composite commands.
- **Logging and Auditing:** Provides natural logging capabilities by storing command objects that can be serialized for audit trails and system recovery.
- **Decoupled Architecture:** Separates the invoker of requests from the objects that handle them, improving system modularity and testability.
- **Transaction Support:** Enables implementation of transaction-like behavior with commit and rollback capabilities through command sequences.

## Disadvantages / Trade-offs

- **Increased Complexity:** Introduces additional classes and indirection for simple operations that could be handled with direct method calls.
- **Memory Overhead:** Storing command objects and their state can consume significant memory, especially in systems with many commands or long command histories.
- **Performance Impact:** Additional object creation and method calls may impact performance in high-throughput scenarios compared to direct invocation.
- **Command Proliferation:** Can result in many small command classes, potentially leading to class explosion and increased maintenance overhead.
- **Undo Complexity:** Implementing proper undo functionality can be complex for commands that interact with external systems or have side effects.
