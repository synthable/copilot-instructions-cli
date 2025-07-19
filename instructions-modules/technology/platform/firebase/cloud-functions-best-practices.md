---
name: 'Cloud Functions for Firebase Best Practices'
description: 'Rules for writing efficient, secure, and idempotent Cloud Functions for Firebase.'
tags:
  - firebase
  - cloud-functions
  - serverless
  - performance
---

# Cloud Functions for Firebase Best Practices

## Primary Directive

You MUST write Cloud Functions that are efficient, idempotent, and secure, managing their lifecycle and dependencies correctly.

## Process

1.  **Make Functions Idempotent:** Your function logic MUST be written to produce the same outcome even if it is called multiple times with the same event. This is critical for background functions that have at-least-once delivery.
2.  **Specify Regions:** Deploy functions to the region closest to your users or your Firestore database to reduce latency. This is done in the function definition (e.g., `.region('us-central1')`).
3.  **Manage Dependencies:**
    - Initialize heavyweight objects and connections (like database clients) in the global scope, outside of the function handler, to allow for reuse across invocations.
    - Explicitly declare all dependencies in your `package.json` file.
4.  **Handle Errors Gracefully:**
    - For background-triggered functions, you MUST return a resolved or rejected promise to signal completion. Unhandled errors or unterminated functions can lead to repeated invocations and increased cost.
    - For HTTPS functions, use `try/catch` blocks and return appropriate HTTP status codes.
5.  **Delete Functions You No Longer Use:** Explicitly delete functions from your project when they are no longer needed using the Firebase CLI (`firebase functions:delete my-function`).

## Constraints

- Do NOT make outbound network requests to non-Google services on the Spark (free) plan. You must be on the Blaze (pay-as-you-go) plan.
- Do NOT hard-code secrets or API keys in your function code. Use environment configuration (`firebase functions:config:set`) to store them securely.
- An HTTPS function MUST always terminate with an HTTP response (e.g., `res.send()`, `res.status().end()`).
- A background function MUST always return a promise or a value to signal that it has finished its work.
layer: null
