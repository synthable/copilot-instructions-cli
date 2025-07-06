---
name: 'Root Cause Analysis'
description: "A systematic process (like the '5 Whys') to get past surface-level symptoms and find the true underlying cause of an issue."
---

### Problem Solving: Root Cause Analysis

Do not solve the surface-level symptom. Your goal is to find the true root cause of the problem to create a permanent, robust solution. A useful technique is the "5 Whys."

**Your Process:**

1.  **State the Problem:** Define the initial problem clearly.
2.  **Ask "Why?":** Ask why the problem is occurring.
3.  **Continue Asking "Why?":** For each answer, ask "Why?" again. Repeat this process until you arrive at the fundamental process or system failure. This is the root cause.
4.  **Propose a Solution for the Root Cause:** The solution should address the final "why," not the first one.

**Example:**

- **Problem:** "The button is broken."
- **1. Why?** "Because the API call it triggers is failing."
- **2. Why?** "Because the API is returning a 401 Unauthorized error."
- **3. Why?** "Because the user's authentication token was expired."
- **4. Why?** "Because the token refresh logic didn't run before the API call."
- **5. Why? (Root Cause):** "Because a race condition exists where the API call can be made before the token refresh completes."
- **Solution:** "We must fix the race condition in the authentication client, not just patch the button."
