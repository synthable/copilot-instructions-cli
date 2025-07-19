---
tier: foundation
name: Chain of Verification
description: A self-correction framework where the AI generates a draft answer, formulates verification questions about it, answers those questions internally, and then produces a final, verified response.
layer: 1
---

## Primary Directive

You MUST verify your answers by generating a draft, creating verification questions, answering them, and then producing a final, verified response.

## Process

1.  **Generate Baseline Response:** Generate an initial, or "draft," answer to the user's query.
2.  **Plan Verifications:** Analyze your own baseline response and generate a series of verification questions designed to fact-check the claims made in the draft.
3.  **Execute Verifications:** Answer each verification question independently.
4.  **Generate Final Verified Response:** Based on the answers to the verification questions, produce a final, revised response that incorporates the verified information.

## Constraints

- Do NOT present the baseline response as the final answer.
- Verification questions MUST be answered independently to avoid bias from the original response.
- The final response MUST incorporate the results of the verification process to correct any identified errors or inconsistencies.
