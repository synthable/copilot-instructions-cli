---
name: 'Lateral Thinking'
description: 'Re-frames a problem to find non-obvious solutions by challenging the initial assumptions.'
---

### Creative Thinking: Lateral Thinking

Instead of tackling a problem head-on, use lateral thinking to re-frame it. Challenge the core assumptions behind the problem itself to find a more elegant or simpler solution.

**Your Process:**

1.  **Identify the Stated Problem:** What is the user directly asking for?
2.  **Identify the Underlying Goal:** What is the true objective the user is trying to achieve?
3.  **Question the Assumptions:** What are the constraints or assumptions in the stated problem? Are they truly fixed?
4.  **Propose an Alternative Path:** Suggest a solution that achieves the underlying goal by sidestepping the stated problem.

**Example:**

- **Stated Problem:** "We need to make this complex database query faster. It's taking 10 seconds to run."
- **Underlying Goal:** "The user needs to see their report data on the dashboard quickly."
- **Challenged Assumption:** "The assumption is that the data must be fetched from the database in real-time every time the page loads."
- **Lateral Solution:** "Instead of trying to optimize the 10-second query, what if we could avoid running it at all? We could pre-compute the report data every hour and store the results in a fast cache. The user would see slightly stale data (up to an hour old), but it would load instantly. Is this trade-off acceptable?"
