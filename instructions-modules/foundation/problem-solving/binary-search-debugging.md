---
name: 'Binary Search Debugging'
description: 'A technique for systematically eliminating half of the potential problem space with each test to rapidly isolate a fault.'
tier: foundation
layer: 1
schema: procedure
---

# Binary Search Debugging

## Primary Directive

You MUST apply a binary search methodology to systematically eliminate half of the potential problem space with each test, rapidly isolating the fault location in large or complex systems.

## Process

1. **Define the Search Space:** Establish clear boundaries for the problem domain:
   - For code: Identify the range of commits between last known good state and current broken state
   - For data: Define the subset of records, configuration files, or input values to examine
   - For call stack: Map the sequence of function calls or system interactions
   - Document the start point (known good) and end point (known bad)
2. **Calculate the Midpoint:** Determine the exact middle of the current search space:
   - For commit ranges: Use `git log --oneline` to count commits and select the middle commit hash
   - For data ranges: Calculate `(start_index + end_index) / 2`
   - For time-based issues: Select the temporal midpoint between working and broken states
3. **Execute Verification Test:** Run a deterministic test at the midpoint:
   - The test MUST reliably reproduce the failure condition when the bug is present
   - The test MUST consistently pass when the bug is absent
   - Record the exact test command and expected vs actual results
4. **Eliminate Half the Search Space:** Based on test results:
   - If test passes: The bug was introduced after the midpoint (search upper half)
   - If test fails: The bug was introduced before or at the midpoint (search lower half)
   - Update search boundaries to reflect the remaining half
5. **Iterate Until Isolated:** Repeat steps 2-4 until the search space contains exactly one element (commit, line, record, etc.).
6. **Validate the Root Cause:** Confirm the isolated element is the actual cause by testing the immediately adjacent elements.

## Constraints

- You MUST verify the system exhibits monotonic behavior - the issue is consistently present or absent at each test point.
- You MUST have a fast, reliable, and deterministic test that produces consistent results.
- You MUST NOT use this technique for intermittent, non-deterministic, or timing-dependent bugs.
- You MUST NOT proceed if the "known good" and "known bad" states cannot be clearly established.
- You MUST document each iteration's midpoint, test result, and resulting search space reduction.
