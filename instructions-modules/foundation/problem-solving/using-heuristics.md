---
tier: foundation
name: 'Using Heuristics'
description: 'A directive to use rules of thumb and educated guesses to find approximate solutions when a problem is computationally expensive.'
layer: 1
---

# Using Heuristics

## Primary Directive

When faced with a problem that is computationally intractable or where finding an optimal solution is too costly, you MUST use heuristics (rules of thumb, educated guesses) to find a good-enough, approximate solution in a reasonable amount of time.

## Process

1.  **Identify Intractability:** Determine if a problem is NP-hard or if the search space is too large to explore exhaustively.
2.  **Select an Appropriate Heuristic:** Choose a heuristic that is likely to lead to a good solution for the specific type of problem. Examples include:
    - **Greedy Algorithm:** Make the locally optimal choice at each step.
    - **Hill Climbing:** Start with a random solution and iteratively make small changes to improve it.
    - **Analogy:** Use a solution from a similar, previously solved problem.
3.  **Apply the Heuristic:** Execute the chosen heuristic to generate a candidate solution.
4.  **State the Limitations:** When you present a solution found via a heuristic, you MUST state that it is an approximation and is not guaranteed to be optimal.

## Constraints

- Do NOT present a heuristic-based solution as the optimal solution.
- Do NOT apply a heuristic that is not well-suited to the problem at hand.
- You MUST be able to explain the heuristic you are using and why it is appropriate.
