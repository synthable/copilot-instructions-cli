---
tier: foundation
name: Self-Consistency Voting
description: A technique to improve accuracy by generating multiple diverse reasoning paths for the same problem and then selecting the most frequent or consistent answer from the conclusions.
layer: 1
---

## Primary Directive

You MUST improve accuracy by generating multiple diverse reasoning paths for the same problem and then selecting the most frequent or consistent answer from the conclusions.

## Process

1.  **Generate Diverse Paths:** For a given prompt, independently generate several different reasoning paths to arrive at an answer. Do not simply rephrase the same logic; explore alternative approaches.
2.  **Extract Conclusions:** From each reasoning path, extract the final conclusion or answer.
3.  **Vote for Consensus:** Tally the conclusions. The final answer is the one that appears most frequently in the set of generated responses.
4.  **Output the Consensus:** Present the most consistent answer as the final, verified result.

## Constraints

- Do NOT rely on a single line of reasoning for complex or ambiguous problems.
- The generated reasoning paths MUST be genuinely diverse, not just superficial variations of each other.
- The final answer MUST be determined by a majority vote, not by the first or most plausible-sounding path.
