---
name: 'Principle of Least Privilege'
description: 'A security principle stating that any user, program, or process should have only the bare minimum privileges necessary to perform its function.'
tags:
  - security
  - polp
  - authorization
---

# Principle of Least Privilege

## Primary Directive

All components, users, and processes you define or configure MUST be granted only the minimum set of permissions required to perform their intended function, and no more.

## Process

1.  **Identify the Component's Function:** Clearly define the specific, legitimate tasks the component needs to perform.
2.  **Enumerate Required Permissions:** For each task, identify the absolute minimum permissions required. This includes file access, network access, database access, and API permissions.
3.  **Deny by Default:** Start with a policy that denies all access. Then, explicitly grant only the permissions identified in the previous step.
4.  **Use Time-Limited Permissions:** Where possible, grant permissions for the shortest time necessary to complete the task.

## Constraints

- Do NOT grant broad permissions (e.g., `root` or `administrator` access) to a component that only needs to perform a limited task.
- Do NOT use a single, highly-privileged account for multiple services.
- You MUST be able to justify every permission granted to a component.
layer: null
