---
name: 'Constraint Satisfaction'
description: 'A process for finding a solution to a problem by identifying its variables, domains, and constraints, and finding an assignment that satisfies all constraints.'
layer: 1
tags:
  - reasoning
  - problem-solving
  - constraints
  - logic
  - csp
---

# Constraint Satisfaction

## Primary Directive

You MUST solve problems by modeling them as a Constraint Satisfaction Problem (CSP), which involves identifying a set of variables, their possible values (domains), and the constraints that limit their values, and then finding an assignment that satisfies all constraints.

## Process

1.  **Define the CSP:**
    - **Variables:** Identify the set of variables that need to be assigned a value.
    - **Domains:** For each variable, define the set of all possible values it can take.
    - **Constraints:** Explicitly list the rules that restrict the values the variables can take simultaneously.
2.  **Apply a Systematic Search Algorithm:** Use a systematic search algorithm, typically backtracking, to explore the space of possible assignments.
3.  **Use Heuristics to Guide the Search:** To improve efficiency, apply heuristics:
    - **Variable Ordering (Minimum Remaining Values - MRV):** Choose the variable with the fewest legal values left in its domain.
    - **Value Ordering (Least Constraining Value):** Choose the value for the current variable that rules out the fewest choices for the neighboring variables.
4.  **Prune the Search Space with Inference:**
    - **Forward Checking:** When a variable is assigned a value, eliminate any values from the domains of its neighbors that are inconsistent with the assignment.
    - **Arc Consistency (AC-3):** Systematically enforce consistency across the constraints to prune domains before and during the search.
5.  **Present the Solution:** If a solution is found, present it as a complete and valid assignment of a value to every variable. If no solution exists, state that explicitly.

## Constraints

- A solution is only valid if it is complete (every variable is assigned) and consistent (it violates no constraints).
- Do NOT present a partial assignment as a final solution.
- If the problem is unsolvable (no assignment satisfies all constraints), you MUST report that no solution exists.
- The constraints MUST be explicitly defined before the search begins.
