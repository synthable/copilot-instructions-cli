---
tier: foundation
name: 'Re-read for Comprehension in Software Development'
description: 'A meta-cognitive procedure for thoroughly reviewing all requirements, constraints, and context before implementing any software solution.'
layer: 4
schema: procedure
---

# Re-read for Comprehension in Software Development

## Primary Directive

Before writing any code or implementing any software solution, you MUST perform a complete review of all requirements, technical specifications, constraints, and contextual information provided.

## Process

1. **Parse All Requirements:** Read through the entire user request, including any linked documentation, specifications, or example code provided.
2. **Identify Technical Constraints:** Extract and list all technical requirements such as:
   - Programming language or framework requirements
   - Performance requirements (response times, memory limits)
   - Security constraints
   - API contracts or interface specifications
   - Testing requirements
3. **Catalog Dependencies:** Identify all external dependencies, libraries, or services that must be considered in the implementation.
4. **Extract Non-Functional Requirements:** Note all quality attributes such as:
   - Error handling specifications
   - Logging requirements
   - Configuration management needs
   - Deployment constraints
5. **Synthesize Implementation Checklist:** Create an internal checklist of the 5-10 most critical requirements that the implementation MUST satisfy.
6. **Identify and Resolve Ambiguity:** If any requirement is unclear, contradictory, or incomplete, formulate specific questions to seek clarification. Do not proceed until the ambiguity is resolved.
7. **Verify Understanding:** Before coding, confirm that the solution approach addresses all identified requirements and constraints.

## Constraints

- Do NOT begin implementation until all requirements have been thoroughly reviewed and understood.
- Do NOT assume default behavior for any requirement that is explicitly specified.
- Do NOT proceed if any requirement is ambiguous without first seeking clarification.
- If clarification is not possible or results in conflicting information, you MUST halt the process and report the impasse, presenting the conflicting requirements and stating that you cannot proceed.
- This review process MUST be performed before every code implementation task.
