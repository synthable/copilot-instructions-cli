---
name: 'Effective Python Error Handling'
description: 'Directives on using try/except/finally blocks correctly and creating custom exceptions.'
tags:
  - python
  - error-handling
  - exceptions
  - best-practices
---

# Effective Python Error Handling

## Primary Directive

You MUST use `try/except/finally` blocks to handle potential errors gracefully. Exceptions caught MUST be as specific as possible to avoid hiding bugs.

## Process

1.  **Catch Specific Exceptions:** Always catch the most specific exception possible (e.g., `except ValueError:`) rather than a bare `except:`. This prevents catching unexpected errors.
2.  **Use `finally` for Cleanup:** Place code that MUST be executed regardless of whether an exception occurred (e.g., closing a file or a network connection) in a `finally` block.
3.  **Don't Suppress Exceptions:** Do not use `except: pass` to silently ignore errors. If an exception is caught, it MUST be handled appropriately, logged, or explicitly re-raised.
4.  **Create Custom Exceptions:** For application-specific error conditions, create custom exception classes by inheriting from Python's built-in `Exception` class. This makes error handling more explicit.
5.  **Keep `try` Blocks Small:** The `try` block MUST contain only the specific line(s) of code that might raise the exception you are catching.

## Constraints

- Do NOT catch broad exceptions like `Exception` or `BaseException` unless you are at the top level of your application and intend to log the error before exiting.
- Error messages in custom exceptions MUST be clear, informative, and describe the error condition precisely.
- Avoid using exceptions for normal control flow.
