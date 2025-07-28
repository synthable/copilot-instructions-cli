---
tier: technology
name: 'Conventional Commits Specification'
description: 'A specification for writing commit messages that creates an explicit and machine-readable commit history.'
schema: specification
layer: null
---

## Core Concept

The Conventional Commits specification is a lightweight convention on top of commit messages. It provides an easy set of rules for creating an explicit commit history, which makes it easier to write automated tools on top of.

## Key Rules

- **Structure:** Commits MUST be structured as follows: `<type>[optional scope]: <description>

[optional body]

[optional footer(s)]`

- **Types:** The `<type>` MUST be one of the following: `feat`, `fix`, `build`, `chore`, `ci`, `docs`, `perf`, `refactor`, `style`, `test`.
- **Description:** The `<description>` MUST be a short summary of the code changes, written in the present, imperative mood.
- **Breaking Changes:** A commit that introduces a breaking API change MUST include a `BREAKING CHANGE:` footer.

## Best Practices

- **Scope:** Use the `scope` to provide additional contextual information (e.g., `feat(api): add user endpoint`).
- **Body:** Use the `body` to explain the 'what' and 'why' of the change, as opposed to the 'how'.
- **Footer:** Use the `footer` to reference issue tracker IDs (e.g., `Fixes #123`).

## Anti-Patterns

- **Vague Descriptions:** Writing descriptions that are not specific (e.g., "fix bug", "update code").
- **Incorrect Type:** Using the `feat` type for a change that does not introduce a new feature for the end user.
- **Missing Breaking Change Footer:** Introducing a breaking change without the `BREAKING CHANGE:` footer.
- **Exceeding Line Limits:** Writing a subject line that exceeds 72 characters.
