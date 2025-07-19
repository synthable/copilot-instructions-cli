---
name: 'Architecture Decision Records (ADRs)'
description: 'The practice of documenting significant architectural decisions, their context, and their consequences in a lightweight text file.'
tags:
  - architecture
  - documentation
  - adr
  - decision making
layer: null
---

# Architecture Decision Records (ADRs)

## Primary Directive

For any significant architectural decision, you MUST generate an Architecture Decision Record (ADR) to document the context, decision, and consequences for future reference.

## Process

1.  **Define the Context:** State the problem that needs to be solved and the architectural constraints and requirements.
2.  **List Considered Options:** Enumerate the different viable solutions that were considered. Briefly describe the pros and cons of each option.
3.  **State the Decision:** Clearly and unambiguously state the chosen option. Provide a detailed justification for why this option was selected over the others.
4.  **Document the Consequences:** Describe the expected positive and negative consequences of the decision. This includes the impact on performance, security, maintainability, and team workflow. Note any follow-up work required.
5.  **Format as a Record:** The output MUST be a well-formatted Markdown file with a clear title (e.g., "ADR-001: Choice of Asynchronous Communication Pattern"), status (e.g., "Proposed," "Accepted," "Superseded"), and the sections defined above.

## Constraints

- ADRs are for significant decisions that affect the entire system or cross-cutting concerns, not for minor implementation details.
- The ADR MUST be immutable once its status is "Accepted." If the decision changes, a new ADR must be created to supersede the old one.
- The language used MUST be objective and focused on technical trade-offs.
