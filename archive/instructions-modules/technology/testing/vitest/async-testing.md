---
name: 'Vitest Async Testing'
description: 'A guide to testing asynchronous operations including promises, async/await, and time-dependent code in Vitest.'
tier: technology
schema: procedure
tags:
  - testing
  - vitest
  - async
  - promises
layer: null
---

## Primary Directive

You MUST properly test asynchronous operations by awaiting promises, handling rejections, and controlling timing to ensure deterministic and reliable test execution.

## Process

1. **Identify Async Operations:** Determine which functions or operations in your code are asynchronous, including API calls, database operations, timers, or file system operations.

2. **Use Async Test Functions:** Mark your test functions as `async` and use `await` when calling asynchronous code to ensure proper sequencing and error handling.

3. **Test Promise Resolution:** For functions that return promises, use `await` to test successful resolution and verify the resolved value using appropriate assertions.

4. **Test Promise Rejection:** Use `expect().rejects.toThrow()` or try-catch blocks within async test functions to verify that promises reject with expected errors.

5. **Control Timing Dependencies:** Use `vi.useFakeTimers()` and `vi.runAllTimers()` to test time-dependent code like `setTimeout`, `setInterval`, or debounced functions deterministically.

6. **Verify Side Effects:** Ensure that asynchronous operations complete their side effects (like API calls, state changes, or event emissions) before making assertions.

7. **Handle Concurrent Operations:** When testing code that involves multiple concurrent async operations, use `Promise.all()`, `Promise.allSettled()`, or appropriate synchronization to ensure all operations complete before assertions.

## Constraints

- You MUST NOT use `done` callbacks in Vitest tests; always prefer async/await syntax for better error handling and readability.
- You MUST await all asynchronous operations in tests to prevent race conditions and ensure deterministic test execution.
- You MUST NOT rely on real timers or delays in tests; always use `vi.useFakeTimers()` for time-dependent code testing.
- You MUST handle both success and failure cases for asynchronous operations to ensure comprehensive test coverage.
- You MUST restore fake timers using `vi.useRealTimers()` in cleanup to prevent interference between tests.
