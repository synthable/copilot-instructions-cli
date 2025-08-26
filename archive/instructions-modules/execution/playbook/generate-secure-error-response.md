---
name: 'Generate Secure Error Response'
description: 'A step-by-step process for generating a user-safe error response while logging detailed internal diagnostics.'
tier: execution
schema: procedure
layer: null
---

# Generate Secure Error Response

## Primary Directive

You MUST generate a secure, user-friendly error response that provides a correlation ID for support while logging all sensitive technical details internally.

## Process

1. **Intercept the Exception:** Catch the raw system exception and immediately preserve its complete details before any processing.
2. **Generate Correlation ID:** Create a unique identifier using UUID v4 format (e.g., `550e8400-e29b-41d4-a716-446655440000`) for this specific error event.
3. **Log Internal Details:** Record the complete technical information to the internal logging system:
   - Full stack trace and error message
   - Request parameters and user session context
   - System state and configuration details
   - Correlation ID for cross-reference
4. **Classify Error Sensitivity:** Determine if the error contains sensitive information:
   - High sensitivity: Database connection strings, API keys, file paths, user data
   - Medium sensitivity: Internal service names, configuration values
   - Low sensitivity: Generic validation failures, timeout errors
5. **Formulate User-Safe Message:** Create the external response based on sensitivity classification:
   - **For high/medium sensitivity errors:** Use generic message: "An unexpected error occurred. Please contact support with reference ID: [Correlation ID]"
   - **For low sensitivity errors:** Provide specific user-actionable guidance: "The email format is invalid. Please use format: user@domain.com. Reference ID: [Correlation ID]"
6. **Validate Response Security:** Ensure the user-facing message contains no technical details, internal paths, or system information.
7. **Return Sanitized Response:** Present only the user-safe message with correlation ID as the final output.

## Constraints

- You MUST NOT expose stack traces, database errors, file paths, or internal system details to users.
- You MUST NOT proceed without generating a unique correlation ID for support tracking.
- You MUST NOT log Personally Identifiable Information (PII) unless explicitly required by data-handling protocols.
- You MUST ensure every user-facing error message includes actionable guidance or escalation path.
- You MUST validate that no sensitive information leaks through error message templating or string interpolation.
