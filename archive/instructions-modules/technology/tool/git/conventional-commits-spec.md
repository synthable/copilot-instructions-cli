---
name: 'Conventional Commits Specification'
description: 'A formal specification defining the rules of the Conventional Commits v1.0.0 standard for creating an explicit and machine-readable commit history.'
tier: principle
layer: null
schema: specification
---

## Core Concept

The Conventional Commits specification is a lightweight convention on top of commit messages. It provides an easy set of rules for creating an explicit commit history, which makes it easier to write automated tools on top of. This convention dovetails with SemVer by describing the features, fixes, and breaking changes made in commit messages.

## Key Rules

## The commit message **MUST** be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

- **`type`**: **MUST** be a noun, lowercase, and one of the following:
  - `feat`: A new feature for the user.
  - `fix`: A bug fix for the user.
  - `chore`: Routine tasks, maintenance, or dependency updates.
  - `docs`: Documentation only changes.
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc).
  - `refactor`: A code change that neither fixes a bug nor adds a feature.
  - `perf`: A code change that improves performance.
  - `test`: Adding missing tests or correcting existing tests.
  - `build`: Changes that affect the build system or external dependencies.
  - `ci`: Changes to our CI configuration files and scripts.

- **`scope`** (optional): **MUST** be a noun contained within parentheses that specifies the section of the codebase the commit changes.

- **`description`**:
  - **MUST** be a concise, lowercase summary of the code changes.
  - **MUST** be written in the imperative mood (e.g., "add", "fix", "refactor").
  - **MUST NOT** end with a period.

- **`body`** (optional): **MUST** be a longer, more detailed explanation of the "what" and "why" of the code changes, not the "how".

- **`footer(s)`** (optional):
  - **MUST** be used to convey information about Breaking Changes.
  - **SHOULD** be used to reference issue tracker IDs (e.g., `Fixes #123`, `Closes #456`).

- **Breaking Changes**: A commit that introduces a breaking change:
  - **MUST** indicate this by appending a `!` after the `type`/`scope`.
  - **MUST** include a `BREAKING CHANGE:` footer explaining the change.

## Best Practices

- **Subject Line Length:** The entire subject line (`<type>[scope]: <description>`) **SHOULD** be kept under 72 characters to ensure readability in various Git tools.
- **Scope Usage:** Use the `scope` to provide additional, valuable context for developers (e.g., `feat(api): ...`).
- **Body Content:** Use the body to explain the motivation for the change and contrast it with previous behavior.
- **`fix` Type:** The `fix` type **SHOULD** be used when patching a bug that affects the user in a production environment.

## Anti-Patterns

- **Capitalization:** Using a capitalized `type` or starting the `description` with a capital letter.
- **Past Tense:** Writing the `description` in the past tense (e.g., "fixed," "added").
- **Missing Colon:** Omitting the required colon and space after the `type` or `scope`.
- **Generic Messages:** Using vague types like `update` or `change`. Choose the most specific type from the approved list.
- **Exceeding Line Limits:** Writing a subject line that is excessively long, making it difficult to read in Git logs.

## Examples

### Example: Commit with a `feat` and `scope`

#### Rationale

This is a valid commit message for a new feature affecting the authentication system.

#### Snippet

```
feat(auth): implement social login via Google OAuth
```

### Example: Commit with a `fix` and a `BREAKING CHANGE`

#### Rationale

This is a valid commit for a bug fix that also introduces a breaking change. Note the `!` and the required footer.

#### Snippet

```
fix(api)!: correct user data serialization format

BREAKING CHANGE: The `user.name` field is no longer available.
Clients must now use the `user.fullName` field instead.
```

### Example: Commit with a `chore` and Issue Reference

#### Rationale

This is a valid commit for a routine task that also closes a tracked issue.

#### Snippet

```
chore: update dependencies to latest versions

Closes #217
```
