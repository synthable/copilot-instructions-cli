---
name: 'Vitest: Controlling Time with Fake Timers'
description: 'A guide on using vi.useFakeTimers() to reliably test time-based logic like setTimeout and setInterval.'
tier: technology
schema: procedure
layer: null
---

## Primary Directive

You MUST use fake timers to control time-based logic in tests to create reliable, fast, and non-flaky results.

## Process

1.  **Enable Fake Timers:** In the test or `describe` block where time is a factor, call `vi.useFakeTimers()`. This replaces global timer functions (`setTimeout`, `setInterval`, `Date`) with mock implementations.
2.  **Act:** Call the code that uses a timer function. The timer will be scheduled but will not execute immediately.
3.  **Advance Time:** Use `vi.advanceTimersByTime(ms)` or `vi.runAllTimers()` to deterministically advance the clock and execute any scheduled timers.
4.  **Assert:** Assert the expected outcome after the timer has been executed.
5.  **Restore Timers:** In an `afterEach` hook, you MUST call `vi.useRealTimers()` to restore the original timer functions and prevent state leakage to other tests.

## Constraints

- Do NOT write tests that rely on `setTimeout` with a real-world delay (e.g., `setTimeout(..., 1000)`). This creates slow and flaky tests.
- You MUST balance every `vi.useFakeTimers()` call with a `vi.useRealTimers()` call to ensure proper test isolation.
