---
name: 'Law of Demeter (Principle of Least Knowledge)'
description: 'A design principle that reduces coupling by restricting a method from accessing objects deep within another object's structure.'
tier: principle
layer: null
schema: pattern
---

## Summary

The Law of Demeter, or the Principle of Least Knowledge, is a design guideline for developing loosely coupled software. It states that an object should have limited knowledge of other objects and should only interact with its "immediate friends." This prevents objects from reaching deep into the internal structure of other objects.

## Core Principles

- **Talk to Immediate Friends Only:** A method of an object MUST only call methods on:
  1.  Itself (`this`)
  2.  Objects passed in as method parameters
  3.  Objects it creates directly
  4.  Objects held in its own instance variables
- **No Chained Calls:** A method MUST NOT chain calls to traverse an object graph (e.g., `a.getB().getC().doSomething()`). This is a strong indicator of a violation.
- **Tell, Don't Ask:** Instead of asking an object for its internal state and then performing logic on that state, you SHOULD tell the object to perform the work. The object itself should contain the logic it operates on.

## Advantages / Use Cases

- **Reduced Coupling:** The primary benefit is a significant reduction in coupling between modules. Changes to the internal structure of one class are less likely to ripple through the entire system.
- **Improved Maintainability:** Code becomes easier to maintain and refactor because components are more independent and self-contained.
- **Enhanced Encapsulation:** It reinforces the principle of encapsulation by hiding the internal structure of objects from the outside world.

## Disadvantages / Trade-offs

- **Increased Number of Methods:** To avoid deep traversal, you may need to create many small "wrapper" or "delegation" methods on intermediate objects. This can increase the surface area of a class and add boilerplate code.
- **Potential Performance Overhead:** The additional method calls from delegation can introduce a minor performance overhead, though this is rarely an issue in modern applications.
- **Reduced Convenience:** It can sometimes feel more cumbersome to write delegation methods than to simply chain calls, especially for simple data retrieval.
