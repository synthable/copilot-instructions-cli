# Commit Message Guidelines

Follow these rules for all commit messages to ensure clarity and consistency.

## Commit Message Format

```
<type>[optional scope]: <subject>
<BLANK LINE>
[optional body]
```

- **type**: One of `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `perf`, `build`, `ci`, `chore`, `revert`
- **scope**: (Optional) A noun describing the section affected (e.g., `api`, `ui`, `auth`)
- **subject**: Short, imperative summary (max 50 characters, no period)
- **body**: (Optional) Detailed explanation, reasoning, or context

## Examples

```
feat(api): Add user login endpoint
fix(ui): Correct button alignment
docs(README): update usage section for clarity
style: format codebase using Prettier
refactor(auth): simplify token handling logic and improve error handling

# Explanations:
# - Used lowercase for commit types/scopes for Conventional Commits consistency.
# - Made descriptions more specific and actionable.
# - Added "improve error handling" to encourage robust refactoring.
# - Used imperative mood for clarity and best practices.
test(api): Add tests for login
perf: Optimize query performance
build: Update dependencies
ci: Add GitHub Actions workflow
chore: Remove unused files
revert: Revert "feat(api): Add user login endpoint"
```

## Best Practices
- Use imperative mood in the subject (e.g., "Add", not "Added" or "Adds")
- Start subject with a capital letter
- Do not end subject with a period
- Limit subject to 50 characters for readability
- Leave a blank line between subject and body
- Use the body for:
  - Explaining the motivation and context
  - Listing multiple changes as bullet points
  - Referencing related issues or PRs (e.g., "Closes #123")
- Ensure messages are descriptive and actionable
- For breaking changes, start the body with `BREAKING CHANGE:`
- Only mention files that are directly affected by the change

## Error Handling & Edge Cases

- If reverting a commit, use the `revert:` type and reference the original commit
- For multi-part changes, consider splitting into focused commits
- Avoid ambiguous types or scopes; be specific

## Atomic Commits
- Each commit should represent a single logical change
- Avoid large commits that mix multiple changes
