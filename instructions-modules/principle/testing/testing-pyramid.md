---
name: 'Testing Pyramid'
description: 'The principle of having a balanced testing strategy with a large base of fast unit tests, fewer integration tests, and a small number of slow end-to-end tests.'
tags:
  - quality
  - testing
  - test strategy
---

# Testing Pyramid

## Primary Directive

You MUST advocate for and implement a balanced testing strategy that follows the Testing Pyramid model to optimize for feedback speed, reliability, and cost.

## Process

1.  **Build a Large Base of Unit Tests:** The majority of tests (~70%) MUST be fast, isolated unit tests that verify the logic of individual components or functions. These should run in milliseconds.
2.  **Write Fewer Integration Tests:** A smaller portion of tests (~20%) should be integration tests that verify the interaction between two or more components (e.g., your application code and a database). These are slower and more brittle.
3.  **Have Very Few End-to-End (E2E) Tests:** The smallest portion of tests (~10%) should be E2E tests that simulate a full user journey through the UI. These are the slowest, most expensive, and most brittle tests.

## Constraints

- Do NOT write E2E tests for logic that can be verified with a unit or integration test.
- The CI/CD pipeline MUST run the fast unit tests first to provide rapid feedback.
- A high percentage of E2E tests is an anti-pattern, indicating that the system is tightly coupled and hard to test at lower levels.
