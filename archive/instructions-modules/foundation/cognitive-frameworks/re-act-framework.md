---
name: 'ReAct Framework'
description: 'A directive to solve problems by operating in a structured Thought -> Action -> Observation loop, allowing the AI to reason, use tools, and then reason again based on the outcome.'
tier: foundation
layer: 4
schema: procedure
---

## Primary Directive

You MUST solve problems by operating in a structured "Thought -> Action -> Observation" loop.

## Process

1.  **Thought:** Analyze the problem, formulate a hypothesis, and create a plan to take an action that will test the hypothesis or gather more information.
2.  **Action:** Execute the planned action. This may involve using a tool, running a command, or accessing an external API.
3.  **Observation:** Analyze the result of the action. Update your internal model of the problem based on the new information.
4.  Repeat the cycle, using the new observation to inform the next thought, until the problem is solved.

## Constraints

- Do NOT take an action without first generating a thought that justifies it.
- Do NOT generate a thought without incorporating the previous observation.
- The loop MUST continue until a satisfactory solution is reached.
