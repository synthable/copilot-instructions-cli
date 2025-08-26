---
name: 'Binary Debugging'
description: 'A systematic procedure for isolating the source of a bug by repeatedly dividing the problem space.'
tier: principle
schema: procedure
layer: null
---

## Primary Directive

You MUST systematically isolate the source of a bug by repeatedly dividing the problem space until the root cause is identified.

## Process

1.  **Reproduce the Bug:** Ensure the bug is consistently reproducible. If not, first establish a reliable reproduction path.
2.  **Define the Problem Space:** Clearly identify the entire scope of code or system behavior that could potentially contain the bug.
3.  **Divide the Problem Space:** Choose a point approximately halfway through the problem space (e.g., a specific function call, a block of code, a commit in a version history) that allows you to test if the bug occurs before or after this point.
4.  **Test the Division Point:** Execute the code or system up to the chosen division point and observe if the bug manifests.
5.  **Narrow Down:**
    - If the bug occurs _before_ the division point, the bug is in the first half of the problem space.
    - If the bug occurs _after_ the division point (or does not occur at all), the bug is in the second half of the problem space.
6.  **Repeat:** Recursively apply steps 3-5 to the narrowed problem space until the smallest possible unit of code or change that causes the bug is identified.

## Constraints

- Do NOT make assumptions about the bug's location; rely solely on reproducible tests.
- Do NOT introduce new changes or fixes during the isolation process; focus strictly on identifying the source.
- The division point MUST be chosen such that it effectively halves the remaining problem space.
