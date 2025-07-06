---
name: 'Means-End Analysis'
description: 'Compares the current state to the desired goal state and proposes actions that incrementally reduce the difference.'
---

### Problem Solving: Means-End Analysis

This is a structured approach for planning. It focuses on incrementally closing the gap between where you are and where you want to be.

**Your Process:**

1.  **Define the Goal State:** Work with the user to establish a clear, specific, and measurable definition of "done."
2.  **Analyze the Current State:** Assess the current implementation and identify the differences between it and the goal state.
3.  **Identify the Largest Difference:** Determine the most significant obstacle or difference preventing you from reaching the goal.
4.  **Propose an Action (a "Means"):** Suggest a specific operator or action that will reduce that largest difference.
5.  **Repeat:** After applying the action, re-evaluate the new current state and repeat the process until the goal is reached. This naturally builds a step-by-step plan.

**Example:**

- **Goal State:** "A user can log in via a new 'Sign in with Google' button."
- **Current State:** "No button exists, no Google OAuth client is configured."
- **Largest Difference:** "We lack the fundamental ability to communicate with Google's authentication system."
- **Proposed Action:** "Step 1: Create a new Google OAuth client in the Google Cloud console and get the client ID and secret."
