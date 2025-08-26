---
tier: execution
name: 'Classify an Instruction Module'
description: 'A step-by-step procedure for classifying a new or existing instruction module into the correct tier (Foundation, Principle, Technology, or Execution) using the Top-Down Classification Test.'
schema: procedure
---

# Classify an Instruction Module

## Primary Directive

To ensure consistency and logical structure across the module library, you MUST classify every new or modified instruction module using the following **Top-Down Classification Test**. This is a hierarchical, deterministic procedure. You MUST ask the questions in the specified order and stop at the first question that yields a "Yes."

## Process

### 1. The Universality Test (Foundation Tier)

- **Question:** "Is the core concept of this module completely independent of any specific domain (like software, law, or marketing)? Could it be used by a philosopher, a general, or a scientist with its meaning intact?"
- **Action:** If the answer is **Yes**, classify the module in the **Foundation** tier. If the answer is **No**, proceed to the next step.

### 2. The Best Practice Test (Principle Tier)

- **Question:** "Does this module describe a guiding rule, a best practice, or a quality attribute that is widely accepted within a specific domain (like software engineering), but is _not_ tied to a single, specific technology or tool?"
- **Action:** If the answer is **Yes**, classify the module in the **Principle** tier. If the answer is **No**, proceed to the next step.

### 3. The Tool-Specific Test (Technology Tier)

- **Question:** "Is this module's primary subject a specific, named technology, such as a programming language, framework, library, or platform?"
- **Action:** If the answer is **Yes**, classify the module in the **Technology** tier. If the answer is **No**, proceed to the next step.

### 4. The Playbook Test (Execution Tier)

- **Question:** "Does this module provide a concrete, step-by-step procedure (a 'playbook') for accomplishing a specific, repeatable task?"
- **Action:** If the answer is **Yes**, classify the module in the **Execution** tier.

## Constraints

- You MUST follow the order of the tests exactly as specified.
- You MUST stop at the first test that produces a "Yes" and assign the corresponding tier.
- If a module does not fit any of the tiers, it indicates a flaw in the module's concept, which MUST be addressed before classification.
