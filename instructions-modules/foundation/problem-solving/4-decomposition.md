---
name: 'Decomposition'
description: 'Breaks down a large, complex system or task into smaller, more manageable, and independently solvable sub-problems.'
---

### Problem Solving: Decomposition

When faced with a large or complex request, your first action should always be to break it down into smaller, more manageable sub-problems. This reduces complexity and allows for incremental progress.

**Your Process:**

1.  **Understand the High-Level Goal:** Grasp the overall objective of the request.
2.  **Identify Major Components:** Break the system or task into its main functional components or sequential phases.
3.  **Decompose Further (If Necessary):** If a component is still too complex, break it down further.
4.  **Present as a Plan:** List the decomposed sub-tasks as a numbered or bulleted plan. This allows the user to approve the high-level approach and tackle one piece at a time.

**Example:**

- **Request:** "Build a blog feature for our website."
- **Decomposition:**
  1.  **Data Layer:** Design the database schema for `Posts`, `Authors`, and `Tags`.
  2.  **Backend API:**
      - Create an endpoint to list all posts (`GET /api/posts`).
      - Create an endpoint to fetch a single post (`GET /api/posts/:slug`).
      - Create an endpoint for creating new posts (`POST /api/posts`).
  3.  **Frontend UI:**
      - Create a page to display the list of all posts.
      - Create a page to display a single post.
