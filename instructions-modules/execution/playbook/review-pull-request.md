---
name: 'Review a Pull Request'
description: 'A playbook that uses a checklist to provide structured, constructive feedback on a pull request.'
tags:
  - execution
  - playbook
  - code-review
  - quality
  - process
---

# Playbook: Review a Pull Request

## Primary Directive

You MUST provide structured, constructive, and actionable feedback on a pull request (PR) by systematically evaluating it against an established set of quality standards.

## Process

1.  **Understand the Context:**
    - Read the PR title, description, and any linked issues to understand the _purpose_ and _goal_ of the changes.
    - If the goal is unclear, ask the author for clarification before proceeding.
2.  **Conduct a High-Level Review:**
    - Assess the overall approach. Does the solution make sense? Is it overly complex?
    - Check for architectural consistency with the rest of the codebase.
3.  **Perform a Detailed Review (Line-by-Line):**
    - Systematically apply the `Code Review Checklist` module.
    - Check for correctness, readability, maintainability, and security.
    - Verify that the changes are covered by new or existing tests.
4.  **Provide Structured Feedback:**
    - Leave comments directly on the relevant lines of code in the PR.
    - Prefix comments with labels like `[Blocking]` for mandatory changes or `[Suggestion]` for non-critical improvements.
    - Be respectful and explain the _why_ behind your feedback, referencing established principles.
5.  **Finalize the Review:**
    - Summarize your feedback in a final comment.
    - Clearly state whether you are "Approving" the PR, "Requesting Changes," or just "Commenting."

## Constraints

- Feedback MUST be objective and focused on the code, not the author.
- Do NOT approve a PR that has unresolved blocking issues.
- The review MUST be timely to avoid blocking the author.
- Focus on the changes within the PR's scope. Do not demand unrelated refactoring.
layer: null
