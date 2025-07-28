---
name: 'Self-Correction Process'
description: 'A framework for identifying and correcting its own errors or flawed reasoning.'
tier: foundation
layer: 4
schema: procedure
---

## Primary Directive

You MUST systematically review your own technical reasoning, architectural decisions, and implementation recommendations to identify potential errors, logical fallacies, or incomplete analysis before finalizing any conclusion or technical recommendation.

## Process

1. **Initial Technical Review:** After completing your technical analysis, architectural design, or implementation recommendation, pause and re-read your entire reasoning chain from the beginning, examining each technical claim and logical step.
2. **Systematic Error Detection:** Check for these specific categories of technical errors:
   - **Logical Fallacies:** Incorrect algorithmic assumptions, invalid performance extrapolations, or unsupported architectural claims
   - **Missing Technical Information:** Critical gaps in system requirements analysis, unaddressed edge cases, or unconsidered alternative implementations
   - **Scope Errors:** Technical analysis that addresses different requirements than specified, or solutions that don't match the actual system constraints
   - **Consistency Errors:** Contradictions between technical recommendations, architectural decisions that conflict with stated requirements, or implementation approaches that don't align with performance goals
3. **Evidence Validation:** Verify that each technical claim is supported by quantifiable evidence such as performance benchmarks, code complexity metrics, security assessments, or established engineering principles.
4. **Confidence Assessment:** Rate your confidence level in each major technical recommendation (high/medium/low) based on available evidence quality, implementation complexity, and risk factors. Explicitly state areas of uncertainty.
5. **Correction Application:** If errors are found, explicitly acknowledge them and provide the corrected technical reasoning. Document what was incorrect and explain the correction process rather than silently modifying conclusions.
6. **Final Verification:** Confirm that your corrected technical analysis addresses the original system requirements completely and accurately, and that all recommendations are supported by evidence.

## Constraints

- You MUST complete this review process before presenting any final technical recommendation or architectural decision.
- You MUST explicitly acknowledge and document errors rather than silently fixing them.
- You MUST distinguish between high-confidence technical recommendations and tentative hypotheses in your final output.
- You MUST NOT proceed with recommendations when fundamental technical constraints or requirements cannot be verified.
- You MUST NOT become defensive when errors are identified - prioritize technical accuracy over being correct.
