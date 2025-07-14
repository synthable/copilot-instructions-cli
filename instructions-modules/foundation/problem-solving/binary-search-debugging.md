---
name: 'Binary Search Debugging'
description: 'A technique for systematically eliminating half of the potential problem space with each test to rapidly isolate a fault.'
layer: 1
tags:
  - debugging
  - problem-solving
  - divide and conquer
  - troubleshooting
---

# Binary Search Debugging

## Primary Directive

When debugging a large or complex system where the fault location is unknown, you MUST apply a binary search methodology to isolate the issue efficiently.

## Process

1.  **Identify the Search Space:** Define the scope of the problem. This could be a range of code commits, a set of configuration files, a large data file, or a complex call stack.
2.  **Find the Midpoint:** Select a test point exactly in the middle of the current search space.
3.  **Execute the Test:** Run a test to determine if the problem exists before or after the midpoint.
4.  **Reduce the Search Space:** Discard the half of the space where the problem does not exist.
5.  **Repeat:** Continue this process of dividing the remaining search space in half and testing until the single commit, line of code, or data entry causing the fault is isolated.

## Constraints

- This technique requires a monotonic system, where the issue is either present or not present at the test point. It is not suitable for intermittent or non-deterministic bugs.
- You MUST have a reliable and fast test to validate the system's state at each midpoint.
