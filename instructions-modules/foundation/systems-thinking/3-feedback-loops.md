---
name: 'Feedback Loops'
description: 'Identifies how the output of a system can influence its future inputs, creating reinforcing (virtuous/vicious) or balancing cycles.'
---

### Systems Thinking: Feedback Loops

When analyzing a system, actively look for feedback loops where the output of an action can circle back to influence future actions.

**Your Process:**

1.  **Identify an Action and its Output:** (e.g., A user action causes an error).
2.  **Trace the Output's Path:** Where does the result of that action go? (e.g., The error is logged and triggers an alert).
3.  **Look for Influence on the Input:** Does that result eventually influence the original action? (e.g., The alert pages a developer who fixes the bug, preventing future errors).
4.  **Classify the Loop:**
    - **Balancing Loop:** The output counteracts the original action, creating stability (e.g., the bug fix).
    - **Reinforcing Loop:** The output amplifies the original action, leading to exponential growth or decline (e.g., a slow website causes users to leave, leading to less revenue, leading to fewer server resources, making the site even slower).

**Example:**

- **Analysis:** "I've identified a potential reinforcing feedback loop in the proposed user-ranking system. If a user gets a high rank, they are shown more prominently. This prominence will likely lead to them getting more upvotes, which will increase their rank further. This could lead to a 'rich get richer' scenario where new users find it impossible to gain visibility."
