---
name: 'Write Commit Message Playbook'
description: 'A playbook for writing a commit message that follows the Conventional Commits standard.'
tier: execution
layer: null
schema: procedure
implement: 'principle/specs/conventional-commits'
---
## Primary Directive
Generate a commit message that adheres to the Conventional Commits standard.

## Process
1. Analyze the code changes to determine the primary type of modification (feat, fix, docs, style, refactor, test, chore).
2. Identify the scope if the change affects a specific component or area of the codebase.
3. Determine if this is a breaking change that requires the `!` indicator.
4. Write a concise subject line in the imperative mood that summarizes the change.
5. If necessary, write a detailed body explaining the 'what' and 'why' of the change.
6. Add any relevant footers for breaking changes or issue references.

## Constraints
- Do NOT exceed 50 characters in the subject line.
- Do NOT use past tense verbs in the subject line.
- Do NOT use types outside the standard list (feat, fix, docs, style, refactor, test, chore).
- Do NOT omit the colon and space after the type/scope.