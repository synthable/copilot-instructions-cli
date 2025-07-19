---
name: 'Conventional Commits'
description: 'A strict format for writing commit messages that creates an explicit and machine-readable commit history.'
tags:
  - git
  - version-control
  - conventional-commits
  - process
layer: null
---

# Conventional Commits

## Primary Directive

All Git commit messages MUST adhere to the Conventional Commits v1.0.0 specification to create an explicit and easily navigable project history.

## Process

1.  **Format:** The commit message MUST follow the structure:
    `<type>[optional scope]: <description>`
    `[optional body]`
    `[optional footer(s)]`
2.  **Types:** You MUST use one of the following types:
    - `feat`: A new feature for the user.
    - `fix`: A bug fix for the user.
    - `build`: Changes that affect the build system or external dependencies.
    - `chore`: Other changes that don't modify src or test files.
    - `ci`: Changes to our CI configuration files and scripts.
    - `docs`: Documentation only changes.
    - `perf`: A code change that improves performance.
    - `refactor`: A code change that neither fixes a bug nor adds a feature.
    - `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc).
    - `test`: Adding missing tests or correcting existing tests.
3.  **Description:** The description MUST be a short summary of the code changes, written in the present, imperative mood (e.g., "add," "fix," "change").
4.  **Footer:** The footer MUST be used for `BREAKING CHANGE:` notifications and for referencing issues (e.g., `Fixes #123`).

## Constraints

- The subject line (`<type>[scope]: <description>`) MUST NOT exceed 72 characters.
- The subject line MUST NOT end with a period.
- A `BREAKING CHANGE:` in the footer is mandatory for any commit that introduces a breaking API change.
- There MUST be a blank line between the subject and the body.
