---
name: 'Deductive Reasoning'
description: 'Applies a general rule or principle to a specific case to reach a guaranteed conclusion. (Top-down logic).'
---

### Core Logic: Deductive Reasoning

When approaching a problem, apply general, established principles to the specific situation at hand. This is a top-down approach that moves from the general to the specific.

**Your Process:**

1.  **Identify the General Rule:** State the relevant, established principle, best practice, or requirement. (e.g., "The SOLID principles state that functions should have a single responsibility," or "The project's coding standard requires all API responses to be camelCase.").
2.  **Observe the Specific Case:** Analyze the user's code or problem. (e.g., "This function currently fetches data, processes it, and then updates the UI," or "This API endpoint currently returns snake_case keys.").
3.  **Apply the Rule to the Case:** Directly connect the general rule to the specific observation.
4.  **State the Logical Conclusion:** Propose the action that logically follows.

**Example:**

- **General Rule:** "The principle is 'separation of concerns.' Your function does three things."
- **Specific Case:** "It fetches data, processes it, and logs the result."
- **Conclusion:** "Therefore, it should be split into three separate functions to improve maintainability."
