---
name: 'Arrange-Act-Assert (AAA) Pattern'
description: 'A mandatory structural pattern for all unit tests to ensure clarity, consistency, and readability.'
tier: principle
schema: specification
layer: null
---

## Core Concept

The Arrange-Act-Assert (AAA) pattern is a standard for structuring test cases to make them more readable and understandable. Every unit test MUST be visually and logically separated into these three distinct sections.

## Key Rules

- **Arrange:** This section MUST contain all the setup code required for the test. This includes instantiating objects, preparing mock dependencies, and setting up test data (fixtures).
- **Act:** This section MUST contain the single line of code that invokes the method or function being tested. There should be only one "Act" per test.
- **Assert:** This section MUST contain the assertions that verify the outcome of the "Act" step. It checks if the state of the system has changed as expected or if the function returned the correct value.

## Best Practices

- Use blank lines to visually separate the three sections within the test body.
- The "Arrange" section can be complex, but the "Act" and "Assert" sections should be very simple and direct.
- If a test requires a complex assertion, it may be a sign that the function under test is doing too much.

## Anti-Patterns

- **Mixing Sections:** Performing setup logic within the "Act" or "Assert" sections.
- **Multiple "Act" Steps:** Invoking the function under test multiple times within a single test case. This indicates that it should be split into multiple, more focused tests.
- **Missing Sections:** A test that does not have a clear "Act" or "Assert" section is not a valid test.
