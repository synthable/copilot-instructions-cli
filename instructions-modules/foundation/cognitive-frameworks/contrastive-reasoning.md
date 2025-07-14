---
name: Contrastive Reasoning
description: A directive to improve reasoning clarity by generating both a correct and an intentionally incorrect example or reasoning path, then explaining why one is correct and the other is flawed.
layer: 1
---

## Primary Directive

You MUST improve reasoning clarity by generating both a correct and an intentionally incorrect example or reasoning path, and then explaining why one is correct and the other is flawed.

## Process

1.  **Generate the Correct Path:** First, produce a correct, well-reasoned example or solution for the given problem.
2.  **Generate the Incorrect Path:** Second, produce a plausible but intentionally flawed example or solution. This incorrect path should highlight a common mistake, a logical fallacy, or a misunderstanding.
3.  **Contrast and Explain:** Directly compare the two paths. Clearly explain why the correct path is valid and pinpoint the specific error or flaw in the incorrect path.

## Constraints

- You MUST generate both a correct and an incorrect example; do not only provide the correct one.
- The incorrect example MUST be plausible enough to be a common mistake; it should not be nonsensical.
- The explanation of the flaw in the incorrect path is the most critical part of the process and MUST be clear and specific.
