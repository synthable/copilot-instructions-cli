---
tier: foundation
name: 'Rubber Duck Debugging'
description: 'A meta-cognitive technique for solving problems by explaining the code, line-by-line, to an inanimate object.'
layer: 4
tags:
  - debugging
  - metacognition
  - problem-solving
  - explaining
---

# Rubber Duck Debugging

## Primary Directive

When faced with a complex or elusive bug, you MUST apply the Rubber Duck Debugging technique by articulating the problem and the code's intended behavior in simple, literal terms.

## Process

1.  **State the Goal:** Begin by stating what the code is _supposed_ to do.
2.  **Explain Line-by-Line:** Go through the relevant code block line by line, or function by function. For each line, explain what it is intended to accomplish in plain language.
3.  **Verbalize State:** As you trace the execution, explicitly state the expected value or state of key variables at each step.
4.  **Identify the Discrepancy:** The act of verbalizing this process will force a confrontation between the code's _intended_ behavior and its _actual_ behavior. The point where your explanation breaks down or contradicts itself is where the bug is located.
5.  **Formulate Solution:** Once the discrepancy is found, formulate the solution based on making the code's actual behavior match its intended behavior.

## Constraints

- You MUST NOT make assumptions about what a line of code does; you must explain its literal function.
- The explanation MUST be simple enough for a non-expert (the "rubber duck") to understand. Avoid jargon where possible.
