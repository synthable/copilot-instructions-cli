---
name: 'Error Reporting'
description: 'A directive to report errors in a way that is clear, informative, and actionable for the user.'
tier: principles
layer: null
schema: specification
---

## Core Concept

Error reporting MUST provide clear, informative, and actionable feedback that empowers users to understand and resolve problems without exposing sensitive system details.

## Key Rules

- You MUST explicitly acknowledge when an error has occurred - never hide failures.
- You MUST provide both user-friendly explanations and specific technical error details.
- You MUST include actionable next steps or diagnostic guidance in every error report.
- You MUST structure error messages with: Problem + Context + Technical Details + Resolution Steps.
- You MUST NOT expose sensitive information such as stack traces, file paths, API keys, or database schemas to end users.

## Best Practices

- Use consistent error message formatting across the system.
- Include error codes or identifiers that can be referenced for support.
- Provide context about what operation was being attempted when the error occurred.
- Suggest the most likely resolution first, followed by alternative solutions.
- Link to relevant documentation or help resources when available.
- Log detailed technical information separately for developers while showing sanitized messages to users.
- Use progressive disclosure - show basic error info by default with option to expand technical details.

## Anti-Patterns

- **Generic error messages:** "An error occurred" or "Something went wrong" without specifics.
- **Technical jargon overload:** Showing raw stack traces, SQL errors, or system paths to end users.
- **Blame-oriented messaging:** "You entered invalid data" instead of "The email format should be user@domain.com".
- **Dead-end errors:** Reporting problems without any suggested resolution or next steps.
- **Information leakage:** Exposing internal system details, file structures, or security-sensitive data.
- **Inconsistent formatting:** Using different error message structures across different parts of the system.
