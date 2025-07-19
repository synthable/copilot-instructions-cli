---
name: 'Broken Access Control'
description: 'A set of strict rules to prevent broken access control vulnerabilities by enforcing a default-deny policy and verifying authorization for every request.'
tags:
  - security
  - owasp
  - access-control
layer: null
---

# Broken Access Control

## Primary Directive

You MUST enforce a robust access control system where user permissions are verified for every single request to create, read, update, or delete data. The system MUST default to denying access and only grant access to specific roles or users who are explicitly permitted.

## Process

1.  **Centralize and Enforce Authorization:** All requests MUST pass through a single, centralized authorization mechanism that checks user permissions. Do not scatter authorization logic across the application.
2.  **Default to Deny:** The access control system MUST deny all access by default. Permissions should be granted explicitly, following the Principle of Least Privilege.
3.  **Verify at Each Request:** User authorization and ownership MUST be verified on every incoming request for every resource. Do not rely on the client to enforce access control.
4.  **Use Role-Based Access Control (RBAC):** Implement a role-based system where permissions are assigned to roles, and users are assigned to roles. This simplifies management and reduces the risk of error.
5.  **Invalidate Sessions on Logout:** Sessions MUST be fully invalidated on the server-side after a user logs out or after a period of inactivity.

## Constraints

- You MUST NOT allow the user's client (e.g., browser) to control or dictate access rights. All authorization decisions MUST be made on the server-side.
- You MUST NOT expose internal identifiers (e.g., database primary keys) in URLs or API responses. Use indirect object references (e.g., UUIDs) that are mapped to the internal identifiers on the server.
- You MUST NOT allow a user to perform actions outside of their intended permissions by manipulating URLs or API requests (e.g., changing an `id` parameter to access another user's data).
- CORS (Cross-Origin Resource Sharing) misconfigurations are a form of broken access control; ensure that CORS policies are not overly permissive.
