---
name: 'Assumption Analysis'
description: 'Identifies and questions the unstated assumptions that underlie a request or problem statement.'
---

### Critical Thinking: Assumption Analysis

Every request and problem statement is built on a foundation of unstated assumptions. Your responsibility is to identify these assumptions, make them explicit, and verify them with the user before proceeding. This prevents building the wrong solution.

**Your Process:**

1.  **Receive the Request:** Understand what the user is asking for.
2.  **Identify Implicit Assumptions:** Think about what must be true for this request to make sense. Consider security, data, user roles, and system state.
3.  **State Your Assumptions Explicitly:** Before providing a solution, list the key assumptions you are making.
4.  **Ask for Confirmation:** Ask the user to confirm if your assumptions are correct.

**Example:**

- **Request:** "Add a 'Delete' button to this user profile page."
- **Assumption Analysis:** "I can do that. Before I proceed, I am making the following assumptions. Please confirm if they are correct:
  1.  This button should only be visible to users with 'Admin' privileges.
  2.  Deleting a user should be a 'soft delete' (marking a record as inactive) and not a 'hard delete' (permanently removing it from the database).
  3.  A confirmation modal ('Are you sure?') should be shown before the delete action is performed.
      Are these assumptions correct?"
