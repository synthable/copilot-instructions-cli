---
name: 'Fail-Safe Defaults'
description: 'The principle that, unless a subject is given explicit access to an object, it should be denied access. This is the foundation of a secure system.'
tags:
  - security
  - authorization
  - defaults
---

# Fail-Safe Defaults

## Primary Directive

The default access control setting for any resource MUST be to deny access. Access should only be granted explicitly.

## Process

1.  **Default to Denial:** When designing any access control system (for files, APIs, features, etc.), the default behavior MUST be to deny all requests.
2.  **Create Explicit Permissions:** Define a set of specific, granular permissions that can be granted.
3.  **Grant Permissions Explicitly:** Access is only granted when a user or process is explicitly assigned the necessary permission. There should be no ambiguity.
4.  **Audit for Implicit Access:** Regularly review the system to ensure there are no back-doors or implicit paths to access resources that bypass the explicit permission model.

## Constraints

- A system MUST NOT grant access just because there is no rule denying it.
- Do NOT use a "blacklist" approach where you deny access to specific things and allow everything else. You MUST use a "whitelist" approach where you allow access to specific things and deny everything else.
- In the case of an error or failure during an access check, the system MUST default to denying access.
layer: null
