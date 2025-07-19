---
name: 'Injection'
description: 'A set of strict rules to prevent injection vulnerabilities by treating all user-supplied data as untrusted and using structured, safe APIs for all interpreter interactions.'
tags:
  - security
  - owasp
  - injection
layer: null
---

# Injection

## Primary Directive

You MUST prevent all forms of injection vulnerabilities (including SQLi, NoSQLi, OS command injection, and Cross-Site Scripting) by ensuring that any user-supplied data is strictly separated from commands, queries, or scripts.

## Process

1.  **Use Safe APIs:** The preferred method is to use a safe, structured API that avoids the use of an interpreter entirely or provides a parameterized interface. For SQL, this means using prepared statements. For other interpreters, use the equivalent safe mechanism.
2.  **Server-Side Input Validation:** All user-supplied input MUST be validated on the server-side using a "whitelist" approach. Reject any input that does not conform to the expected format.
3.  **Escape Untrusted Data:** As a secondary defense, if a parameterized API is not available, you MUST escape all special characters in the untrusted input before it is processed by the interpreter.
4.  **Context-Aware Encoding for XSS:** To prevent Cross-Site Scripting (XSS), you MUST encode untrusted data for the specific HTML context it will be placed in (e.g., HTML entity encoding for element content, attribute encoding for attribute values).

## Constraints

- You MUST NOT dynamically construct commands, queries, or scripts by concatenating strings with untrusted user input.
- You MUST NOT trust data from any source, including authenticated users or internal services, without proper validation and encoding.
- You MUST NOT execute OS commands with user-supplied input. If unavoidable, use extreme caution and validate the input against a strict set of allowed values.
