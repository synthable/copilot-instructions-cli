---
name: 'API Design Principles'
description: 'Principles for designing clean, consistent, and easy-to-use APIs (e.g., RESTful conventions, idempotency).'
tags:
  - architecture
  - api-design
  - rest
  - usability
layer: null
---

# API Design Principles

## Primary Directive

You MUST design APIs that are consistent, predictable, and easy for client developers to use. The API should clearly communicate its resources and capabilities.

## Process

1.  **Use Nouns for Resources:** API endpoints MUST represent resources using nouns, not verbs. For example, use `/users` to represent a collection of users, not `/getUsers`.
2.  **Use HTTP Verbs for Actions:** Use standard HTTP methods to operate on the resources:
    - `GET`: Retrieve a resource.
    - `POST`: Create a new resource.
    - `PUT` / `PATCH`: Update an existing resource.
    - `DELETE`: Delete a resource.
3.  **Ensure Idempotency:** `GET`, `PUT`, `DELETE`, and `PATCH` operations MUST be idempotent. Making the same request multiple times should have the same effect as making it once. `POST` is not typically idempotent.
4.  **Use Plural Nouns:** Resource names in endpoints MUST be plural (e.g., `/users`, not `/user`).
5.  **Provide Clear Status Codes:** Use standard HTTP status codes to indicate the outcome of a request (e.g., `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).
6.  **Support Filtering, Sorting, and Pagination:** For collections, provide mechanisms for clients to filter, sort, and paginate the results using query parameters (e.g., `/users?status=active&sort=lastName&page=2`).

## Constraints

- Do NOT use verbs in your API endpoint paths.
- Do NOT use `GET` or `POST` to perform unsafe operations like updates or deletions.
- The API MUST NOT expose internal implementation details in its responses.
- Error responses MUST have a consistent, predictable format that provides useful information to the client.
