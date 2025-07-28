---
name: 'Test Isolation'
description: 'The critical principle that automated tests must be independent and not rely on a shared state or a specific execution order.'
tier: principle
schema: specification
layer: null
---

## Core Concept

Test isolation is a fundamental principle stating that each automated test must be a self-contained unit that can be run in any order and does not affect or rely on the outcome of other tests. This ensures that test failures are deterministic and directly attributable to the code under test.

## Key Rules

- **No Order Dependency:** The success or failure of a test MUST NOT depend on the execution of any other test. Test suites MUST pass when run in a random or parallel order.
- **No Shared State:** Tests MUST NOT share or modify a persistent state (e.g., a shared database record, a file on disk, a global variable) without proper teardown. Each test is responsible for setting up its own state and cleaning up after itself.
- **No External Dependencies:** Unit tests, specifically, MUST NOT rely on external services like databases, network APIs, or the file system. These dependencies MUST be mocked or stubbed.

## Best Practices

- Use `beforeEach` and `afterEach` (or equivalent) hooks in your testing framework to handle setup and teardown logic, ensuring a clean state for every test.
- For integration tests that require a database, use transactions that are rolled back after each test.
- Create all required test data within the test itself or in its `beforeEach` hook.

## Anti-Patterns

- **State Leakage:** A test that creates a database record but does not delete it, causing subsequent tests to fail.
- **Chained Tests:** A test that relies on a record or state created by a previous test.
- **Relying on a "happy path" test** to run first to set up a system state for other tests.
