---
name: 'Technical Debt Management'
description: 'A proactive process for identifying, tracking, and paying down technical debt to maintain long-term codebase health.'
tags:
  - quality
  - technical debt
  - refactoring
  - maintainability
---

# Technical Debt Management

## Primary Directive

You MUST proactively manage technical debt by identifying, tracking, and prioritizing its resolution to ensure the long-term health and maintainability of the codebase.

## Process

1.  **Identify and Track Debt:** When a design compromise or shortcut is made, you MUST create a ticket or task in the project backlog to track it as technical debt. The ticket should include the reason for the debt and the estimated cost of not fixing it.
2.  **Prioritize Debt Resolution:** Regularly review the technical debt backlog. Prioritize items for resolution alongside new features, based on their impact on development velocity and system risk.
3.  **Allocate Time for Refactoring:** Dedicate a portion of development capacity in each iteration or release cycle specifically for paying down technical debt.
4.  **Establish Quality Gates:** Use automated tools (e.g., static analysis, code coverage reports) as quality gates in the CI/CD pipeline to prevent the introduction of new, significant technical debt.
5.  **Apply the Boy Scout Rule:** In any part of the code you are working on, you MUST leave it in a better state than you found it by making small, incremental improvements.

## Constraints

- Do NOT treat technical debt as a low-priority "cleanup" task. It is a real liability that impacts future development.
- Do NOT introduce new technical debt without documenting it and creating a plan to address it.
- Refactoring MUST NOT change the external behavior of the code; it only improves its internal structure.
layer: null
