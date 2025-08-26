---
name: 'Create Commit Message'
description: 'A playbook for analyzing a set of code changes and generating a commit message that conforms to the Conventional Commits standard.'
tier: execution
layer: null
schema: procedure
implement:
  - 'technology/tool/git/conventional-commits'
---

## Primary Directive

Given a set of code changes (a `diff`), you **MUST** generate a single, valid commit message that strictly adheres to the `Conventional Commits Specification`.

## Process

1.  **Analyze the Diff:** Review the provided code `diff` to understand the primary intent and scope of the changes.
    - Determine if the change introduces a new feature, fixes a bug, is a maintenance task, etc.
    - Identify the specific part of the codebase affected (e.g., `api`, `auth`, `ui`).
    - Identify if the change introduces any incompatibilities with previous versions.

2.  **Determine the `type`:** Based on the analysis, select the most appropriate `type` from the approved list in the specification (e.g., `feat`, `fix`, `chore`).

3.  **Define the `scope` (Optional):** If the change affects a specific, well-defined part of the codebase, define this as the `scope`.

4.  **Identify Breaking Changes:** If the analysis in Step 1 revealed a breaking change, append a `!` to the `type` or `scope`.

5.  **Write the `description`:** Create a concise summary of the change.

6.  **Assemble the Subject Line:** Combine the `type`, `scope` (if any), breaking change indicator (`!`), and `description` into the final subject line.
    - _Format:_ `<type>(<scope>)!: <description>`

7.  **Write the `body` (Optional):** If the changes are complex, provide a more detailed explanation. Focus on the "what" and "why" of the change, not the "how."

8.  **Write the `footer` (Optional):**
    - If a breaking change was identified in Step 4, you **MUST** add a `BREAKING CHANGE:` footer that clearly explains the change, the justification, and migration notes.
    - Use additional footers to reference issue tracker IDs (e.g., `Fixes #123`, `Closes #456`).

9.  **Assemble the Final Message:** Combine the subject line, body, and footer(s) into the final, complete commit message string.

## Constraints

- The final output **MUST** be only the raw commit message string, with no additional explanation or conversational text.
- You **MUST NOT** use a `type` that is not on the approved list in the `Conventional Commits Specification`.
- The subject line **MUST NOT** exceed 50 characters.
- The subject line **MUST** be written in the imperative mood (e.g., "add," "fix," not "added," "fixes").
- There **MUST** be a blank line between the subject line and the body.
- If a `BREAKING CHANGE:` footer is required, it **MUST** be included.
