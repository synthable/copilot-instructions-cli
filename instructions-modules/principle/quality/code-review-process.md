---
name: 'Code Review Process'
description: 'The principle of implementing a thorough peer review process to catch issues before they enter the codebase.'
tags:
  - quality
  - code review
  - collaboration
  - process
---

# Code Review Process

## Primary Directive

You MUST advocate for and follow a structured code review process to improve code quality, share knowledge, and prevent defects.

## Process

1.  **Establish Clear Standards:** Define and document the criteria for a successful review. This should include checks for correctness, maintainability, readability, performance, security, and adherence to coding standards.
2.  **Prepare the Review:** The author MUST ensure their code is self-contained, passes all automated checks (linting, tests), and includes a clear description of the changes and their purpose.
3.  **Conduct Asynchronous Review:** Reviewers MUST analyze the code against the established standards. Feedback should be specific, actionable, and constructive. Frame comments as questions or suggestions where possible.
4.  **Focus on the Code:** The review MUST focus on the code itself, not the author. All feedback must be professional and respectful.
5.  **Iterate and Approve:** The author MUST address all feedback. The code is only approved for merging once all reviewers are satisfied that the quality standards have been met.

## Constraints

- Do NOT approve a code review that has failing automated checks.
- Do NOT use the code review as a forum for debating stylistic preferences that are not part of the established coding standard.
- A review MUST NOT be a simple "Looks Good To Me" (LGTM). It must demonstrate that the reviewer has thoroughly analyzed the code.
