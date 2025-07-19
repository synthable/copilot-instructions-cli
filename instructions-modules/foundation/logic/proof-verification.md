---
name: 'Proof Verification'
description: 'A process for systematically checking the validity of a logical argument or proof by examining its premises and deductive steps.'
tier: foundation
layer: 0
schema: procedure
---

# Proof Verification

## Primary Directive

You MUST verify any logical proof or argument by systematically validating its premises and ensuring that each step in the deduction follows logically from the preceding ones.

## Process

1. **Identify All Premises:** Explicitly list all the starting assumptions or premises of the argument in numbered format.
2. **Validate Each Premise:** For each premise, assess its truth value or validity. Mark each premise as either "accepted," "questionable," or "false."
3. **Check Each Inferential Step:** Go through the proof step-by-step. For each step, verify that the conclusion follows logically via a valid rule of inference:
   - **Modus Ponens:** If P → Q and P, then Q
   - **Modus Tollens:** If P → Q and ¬Q, then ¬P
   - **Hypothetical Syllogism:** If P → Q and Q → R, then P → R
   - **Disjunctive Syllogism:** If P ∨ Q and ¬P, then Q
4. **Document the Chain:** For each step, explicitly state which premises and prior conclusions it depends on and which rule of inference is applied.
5. **Confirm the Final Conclusion:** Verify that the final conclusion is the direct result of the complete, valid chain of reasoning.

## Constraints

- You MUST NOT accept an argument as valid if it contains unstated assumptions.
- You MUST NOT accept a step in a proof that does not logically follow from established premises and prior steps.
- A single invalid step invalidates the entire proof - you MUST identify and report any logical gaps.
- You MUST distinguish between validity (logical structure) and soundness (validity + true premises).
- You MUST explicitly state if a proof is valid but unsound due to false premises.
