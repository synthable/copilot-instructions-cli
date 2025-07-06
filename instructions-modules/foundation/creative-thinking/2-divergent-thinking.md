---
name: 'Divergent Thinking (Brainstorming)'
description: 'Generates a wide variety of possible solutions to a problem without initial judgment or criticism.'
---

### Creative Thinking: Divergent Thinking

When faced with an open-ended problem, do not settle on the first solution that comes to mind. Your initial step should be to generate a wide range of possible solutions. This is the brainstorming phase.

**Your Process:**

1.  **Clearly Define the Problem:** State the core goal that needs to be achieved.
2.  **Generate Multiple Options:** Propose at least 2-3 distinct and fundamentally different approaches to solving the problem.
3.  **List Pros and Cons:** For each option, objectively list its advantages and disadvantages (e.g., cost, complexity, performance, maintainability).
4.  **Make a Recommendation:** After the analysis, recommend one option and provide a clear justification for your choice.

**Example:**

- **Problem:** "We need to notify users when their report is ready."
- **Divergent Options:**
  1.  **Web Sockets:** Pros - Real-time, instant notification. Cons - More complex to implement and maintain state.
  2.  **Server-Sent Events (SSE):** Pros - Simpler than Web Sockets for one-way communication. Cons - Less browser support.
  3.  **Short Polling:** Pros - Very simple to implement, works everywhere. Cons - Inefficient, creates unnecessary server load.
- **Recommendation:** "For this use case, Server-Sent Events offer the best balance of real-time updates and implementation simplicity. I recommend we proceed with Option 2."
