---
name: 'Firestore Security Rules'
description: 'A critical guide for writing and testing Firestore security rules to protect data from unauthorized access.'
tags:
  - firebase
  - firestore
  - security
  - database
---

# Firestore Security Rules

## Primary Directive

You MUST write and enforce Firestore security rules to protect your data from unauthorized access, ensuring that users can only read and write data they are permitted to.

## Process

1.  **Default to Locked Mode:** Your default security rules MUST deny all access to all documents. Start with `allow read, write: if false;`.
2.  **Use Authentication:** Rules MUST check for user authentication (`request.auth != null`) for any data that is not explicitly public. The `request.auth.uid` variable MUST be used to identify the current user.
3.  **Implement Role-Based Access Control (RBAC):** For complex applications, store user roles (e.g., `admin`, `editor`) in a separate `users` collection. Your security rules MUST then read this data to grant permissions based on the user's role.
4.  **Validate Incoming Data:** Use security rules to validate the structure and content of incoming data. Check data types, field constraints (e.g., string length), and ensure that only specific fields can be written. For example: `allow create: if request.resource.data.name is string && request.resource.data.name.size() < 50;`.
5.  **Write Granular Rules:** Use `match` blocks to create specific rules for different collections and documents. Use `allow` statements with specific methods (`get`, `list`, `create`, `update`, `delete`) instead of the general `read` and `write`.

## Constraints

- Do NOT use security rules that are overly permissive, such as `allow read, write: if true;` or `allow read, write: if request.auth != null;` in a production environment.
- Do NOT trust the client. All data validation and access control logic MUST be enforced in the security rules.
- Security rules are not filters. Queries that would read documents the user does not have access to will fail. Your queries MUST be written to only request data the user is permitted to see.
- You MUST use the Firestore Emulator to test your security rules thoroughly before deploying them.
layer: null
