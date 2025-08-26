---
name: 'Vitest Error Testing'
description: 'A guide to testing error conditions, exception handling, and failure scenarios to ensure robust error handling in applications.'
tier: technology
schema: procedure
tags:
  - testing
  - vitest
  - errors
  - exceptions
layer: null
---

## Primary Directive

You MUST thoroughly test error conditions and exception handling to verify that your application behaves correctly under failure scenarios and provides appropriate error responses.

## Process

1. **Identify Error Scenarios:** Catalog all possible error conditions including invalid inputs, network failures, authorization errors, and resource unavailability that your code should handle.

2. **Test Synchronous Errors:** Use `expect().toThrow()` to verify that functions throw expected errors with specific error types, messages, and properties for synchronous error conditions.

3. **Test Asynchronous Errors:** Use `expect().rejects.toThrow()` or `expect().rejects.toEqual()` to test promise rejections and async function errors with proper error type and message validation.

4. **Verify Error Messages:** Assert that error messages are meaningful, consistent, and provide sufficient information for debugging while avoiding exposure of sensitive system details.

5. **Test Error Boundaries:** Verify that error handling mechanisms (try-catch blocks, error boundaries, middleware) properly catch and process errors without causing application crashes.

6. **Mock Error Conditions:** Use `vi.mock()` and `vi.fn().mockRejectedValue()` to simulate external service failures, network timeouts, and other error conditions that are difficult to reproduce naturally.

7. **Test Error Recovery:** Verify that applications properly recover from errors, clean up resources, reset state, and continue functioning after error conditions are resolved.

8. **Validate Error Logging:** Ensure that errors are properly logged with appropriate severity levels and structured data for monitoring and debugging purposes.

## Constraints

- You MUST test both the error throwing behavior and the error handling behavior to ensure complete error flow coverage.
- You MUST NOT rely on production errors for testing; always use controlled error simulation through mocks and deliberate invalid inputs.
- You MUST verify that error handling does not introduce memory leaks, resource leaks, or corrupted application state.
- You MUST test error conditions at appropriate boundaries including input validation, external service calls, and internal component interfaces.
- You MUST ensure that error tests are deterministic and do not depend on external factors or timing for consistent execution.
