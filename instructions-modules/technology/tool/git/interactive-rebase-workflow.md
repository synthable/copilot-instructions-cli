---
name: 'Interactive Rebase Workflow'
description: 'A process for cleaning up commit history using interactive rebase before merging a feature branch.'
tags:
  - git
  - version-control
  - rebase
  - process
---

# Interactive Rebase Workflow

## Primary Directive

Before merging a feature branch into the main branch (`main`, `develop`), you MUST use interactive rebase (`git rebase -i`) to create a clean, logical, and readable commit history.

## Process

1.  **Start the Rebase:** From your feature branch, ensure you have the latest changes from the target branch (`git pull origin main`), then run `git rebase -i main`.
2.  **Clean Up Commits:** In the interactive editor that appears, use the following commands to manipulate your commits into a logical sequence:
    - `pick` (`p`): Use the commit as is.
    - `reword` (`r`): Keep the commit's changes but edit the commit message.
    - `squash` (`s`): Combine the commit's changes with the previous commit and merge the commit messages.
    - `fixup` (`f`): Combine the commit's changes with the previous commit and discard this commit's message. Use this for small fixes.
    - `drop` (`d`): Delete the commit entirely.
3.  **Reorder Commits:** Change the order of the commits in the editor to create a more logical narrative (e.g., a feature commit followed by its corresponding test commit).
4.  **Save and Resolve:** Save the changes. If conflicts occur, resolve them, run `git add .`, and then `git rebase --continue`.
5.  **Force Push:** After the rebase is complete, you MUST use `git push --force-with-lease` to update the remote feature branch.

## Constraints

- You MUST NOT rebase a branch that has been shared with and is being worked on by other developers, as rewriting history will cause significant problems for them. This workflow is for your own feature branches before merging.
- Each commit in the final, rebased history MUST be a single, logical change that passes all tests.
- Do NOT squash unrelated changes into a single commit. A feature and a separate bug fix should remain as two distinct commits.
layer: null
