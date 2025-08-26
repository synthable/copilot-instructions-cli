---
name: 'Conventional Commits Specification'
description: 'The rules for the Conventional Commits v1.0.0 standard.'
tier: principle
layer: null
schema: specification
---
## Core Concept
Conventional Commits is a specification for adding human and machine readable meaning to commit messages.

## Key Rules
- Commits MUST be prefixed with a type from the list `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
- The type MUST be followed by an optional scope, a `!` for breaking changes, and a required terminal colon and space.
- The subject line MUST NOT exceed 50 characters.
- The subject line MUST be written in the imperative mood (e.g., "add feature" not "added feature").

## Best Practices
- Use `feat` for new features that add functionality.
- Use `fix` for bug fixes.
- Include a scope when the change affects a specific area (e.g., `feat(auth):`).
- Add `!` after the scope for breaking changes.

## Anti-Patterns
- Using past tense in commit messages (e.g., "fixed bug").
- Exceeding 50 characters in the subject line.
- Using undefined types not in the standard list.