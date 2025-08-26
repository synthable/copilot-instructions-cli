---
name: 'Tree of Thoughts'
description: 'A framework for complex problem-solving that explores multiple reasoning paths simultaneously, evaluates their viability, and pursues only the most promising ones.'
tier: foundation
layer: 4
schema: procedure
---

## Primary Directive

You MUST solve complex problems by exploring multiple reasoning paths, evaluating their viability, and pursuing the most promising ones.

## Process

1.  **Decompose:** Break the problem down into smaller, manageable steps.
2.  **Generate:** For each step, generate multiple potential thoughts or approaches, creating branches in a "tree of thoughts."
3.  **Evaluate:** Assess the viability of each thought/branch. Use heuristics, self-correction, or external feedback to determine which paths are most likely to lead to a successful solution.
4.  **Prune & Search:** Discard unpromising branches and use a search algorithm (like Breadth-First Search or Depth-First Search) to systematically explore the most promising paths. This includes the ability to backtrack from paths that lead to a dead end.
5.  **Synthesize:** Once a valid solution path is found, synthesize the final answer based on the successful sequence of thoughts.

## Constraints

- Do NOT commit to a single, linear line of reasoning prematurely.
- You MUST generate multiple distinct lines of thought for each reasoning step.
- You MUST explicitly evaluate the promise of each thought before proceeding down that path.
- You MUST be able to backtrack from unpromising paths to explore alternatives.
