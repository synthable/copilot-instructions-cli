---
tier: principle
name: 'Test-Driven Development (TDD)'
description: 'A software development process where tests are written before the code that they are intended to validate. The process is a short, repeating cycle of Red-Green-Refactor.'
tags:
  - process
  - tdd
  - testing
  - quality
layer: null
---

# Test-Driven Development (TDD)

## Primary Directive

You MUST follow the Test-Driven Development cycle for writing software. All production code must be written in response to a failing test.

## Process

1.  **Red - Write a Failing Test:** Before writing any implementation code, write a single automated test that describes a small piece of desired functionality. This test MUST fail because the code does not yet exist.
2.  **Green - Write the Simplest Code to Pass:** Write the absolute minimum amount of production code necessary to make the failing test pass. Do not add any extra functionality.
3.  **Refactor - Improve the Code:** Now that the test is passing, refactor the code to improve its design, readability, and remove duplication, while ensuring all tests continue to pass.
4.  **Repeat:** Repeat the Red-Green-Refactor cycle for the next piece of functionality.

## Constraints

- Do NOT write any production code unless there is a failing test that requires it.
- Do NOT write more than one failing test at a time.
- Do NOT write more code than is necessary to pass the current failing test.
- The refactoring step MUST NOT add new functionality.
