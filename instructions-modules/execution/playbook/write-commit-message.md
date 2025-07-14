---
name: 'Write a Commit Message'
description: 'A playbook for writing a well-formed Git commit message following the Conventional Commits standard.'
tags:
  - execution
  - playbook
  - git
  - version-control
  - conventional-commits
---

# Playbook: Write a Commit Message

## Primary Directive

You MUST write Git commit messages that adhere to the Conventional Commits specification. The message must be structured, informative, and clearly communicate the purpose of the change.

## Process

1.  **Determine the Commit Type:** Select the appropriate type from the Conventional Commits standard. The most common types are:
    - `feat`: A new feature.
    - `fix`: A bug fix.
    - `docs`: Documentation only changes.
    - `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc).
    - `refactor`: A code change that neither fixes a bug nor adds a feature.
    - `perf`: A code change that improves performance.
    - `test`: Adding missing tests or correcting existing tests.
    - `chore`: Changes to the build process or auxiliary tools.
2.  **Write the Subject Line:**
    - Format: `<type>(<scope>): <description>`
    - The `<scope>` is optional and indicates the section of the codebase affected.
    - The `<description>` is a short summary of the code changes, written in the imperative mood (e.g., "add," "fix," "change," not "added," "fixed," "changed").
3.  **Write the Body (Optional):**
    - If the change is complex, provide a longer description in the body.
    - Explain the "why" behind the change, not the "how." Describe the problem that was solved.
4.  **Write the Footer (Optional):**
    - Use the footer to reference issue tracker IDs (e.g., `Fixes #123`).
    - Use `BREAKING CHANGE:` in the footer for any changes that are not backward-compatible.

## Constraints

- The subject line MUST NOT exceed 50 characters.
- The subject line MUST be written in the imperative mood.
- There MUST be a blank line between the subject and the body.
- The message MUST conform to the `type(scope): description` format.
