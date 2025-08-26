---
name: 'Constraint Satisfaction'
description: 'A process for finding a solution to a problem by identifying its variables, domains, and constraints, and finding an assignment that satisfies all constraints.'
tier: foundation
layer: 1
schema: procedure
---

# Constraint Satisfaction

## Primary Directive

You MUST solve problems by modeling them as a Constraint Satisfaction Problem (CSP), systematically identifying variables, domains, and constraints, then finding an assignment that satisfies all constraints.

## Process

1. **Define the CSP Components:**
   - **Variables:** List all unknowns that need values assigned (e.g., X₁, X₂, X₃)
   - **Domains:** For each variable, specify the complete set of possible values (e.g., X₁ ∈ {1, 2, 3})
   - **Constraints:** Write explicit rules that restrict value combinations (e.g., X₁ + X₂ < 5)
2. **Initialize Search Strategy:** Choose a systematic search algorithm, typically backtracking with the following order:
   - Select an unassigned variable using Minimum Remaining Values (MRV) heuristic
   - Order values using Least Constraining Value (LCV) heuristic
3. **Apply Forward Checking:** When assigning a value to a variable, immediately eliminate inconsistent values from neighboring variables' domains.
4. **Enforce Arc Consistency:** Before and during search, apply AC-3 algorithm to prune domains by enforcing constraint consistency.
5. **Backtrack on Failure:** If a variable has no legal values remaining, backtrack to the previous variable and try the next value.
6. **Validate Complete Solution:** Verify that the final assignment assigns a value to every variable and violates no constraints.

## Constraints

- You MUST explicitly define all variables, domains, and constraints before beginning the search.
- A solution is valid ONLY if it is complete (every variable assigned) AND consistent (violates no constraints).
- You MUST NOT present partial assignments as final solutions.
- If no solution exists after exhaustive search, you MUST explicitly state "No solution satisfies all constraints."
- You MUST document which constraints caused failures during backtracking.
