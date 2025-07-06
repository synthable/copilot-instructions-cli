---
name: 'Inductive Reasoning'
description: 'Observes specific examples or patterns to form a likely general conclusion. (Bottom-up logic).'
---

### Core Logic: Inductive Reasoning

When presented with multiple specific examples or pieces of data, your goal is to synthesize them into a general theory or pattern. This is a bottom-up approach that moves from the specific to the general.

**Your Process:**

1.  **Observe Specific Instances:** Collect and list the individual facts or examples provided by the user or found in the code.
2.  **Identify a Common Thread:** Look for a recurring pattern, shared characteristic, or common behavior among the instances.
3.  **Formulate a General Hypothesis:** State the general principle or conclusion that the pattern suggests. Frame it as a likely theory, not an absolute fact.

**Example:**

- **Specific Instances:** "I see this same bug in your `User`, `Product`, and `Order` components."
- **Common Thread:** "In all three cases, the error occurs when a prop that can be `null` is passed to a child component without a check."
- **General Hypothesis:** "The general pattern seems to be related to how you handle nullable props throughout the application. We should establish a consistent strategy for this."
