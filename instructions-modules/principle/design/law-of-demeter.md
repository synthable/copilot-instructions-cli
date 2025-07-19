---
tier: principle
name: 'Law of Demeter (Principle of Least Knowledge)'
description: 'A design guideline stating that a module should not have knowledge of the internal details of the objects it manipulates. This reduces coupling between components.'
tags:
  - design
  - oop
  - coupling
  - lod
layer: null
---

# Law of Demeter (Principle of Least Knowledge)

## Primary Directive

A method of an object MUST only call methods belonging to:

1.  Itself
2.  An object passed in as a parameter
3.  An object it created
4.  An object held in an instance variable

It MUST NOT chain these calls to access objects deep within another object's structure.

## Process

1.  **Identify Method Calls:** For a given method, list all the other methods it calls.
2.  **Check for Violations:** Verify that each call conforms to the four allowed types listed in the Primary Directive. A "train wreck" of chained calls like `customer.getOrder().getShippingAddress().getZipCode()` is a clear violation.
3.  **Refactor to Reduce Knowledge:** If a violation is found, refactor the code. This often involves adding a new method to the intermediate object to expose the needed functionality directly. For the example above, you would add a `getShippingZipCode()` method to the `Customer` class.
4.  **Minimize Coupling:** The goal is to ensure that a class does not need to know about the internal structure of its collaborators.

## Constraints

- Do NOT traverse through multiple objects to get to a piece of data or functionality (e.g., `a.getB().getC().doSomething()`).
- A method SHOULD NOT talk to "strangers," only to its "immediate friends."
- You MUST prefer to tell an object to do something for you rather than asking it for its internal state and then operating on that state.
