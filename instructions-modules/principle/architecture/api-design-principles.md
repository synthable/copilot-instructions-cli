---
tier: principle
name: 'API Design Principles'
description: 'A specification for designing clean, consistent, and easy-to-use RESTful APIs.'
tier: principle
schema: specification
layer: null
authors: []
---

## Core Concept

An API's design MUST prioritize consistency, predictability, and ease of use for the client developer, clearly communicating its resources and capabilities through standard conventions.

## Key Rules

- **Use Nouns for Resources:** API endpoints MUST use nouns to represent resources (e.g., `/users`), not verbs (e.g., `/getUsers`).
- **Use Plural Nouns:** Resource names in endpoints MUST be plural (e.g., `/users`, not `/user`).
- **Use HTTP Verbs for Actions:** Standard HTTP methods MUST be used to operate on resources:
  - `GET`: Retrieve a resource.
  - `POST`: Create a new resource.
  - `PUT` / `PATCH`: Update an existing resource.
  - `DELETE`: Delete a resource.
- **Ensure Idempotency for Safe Methods:** `GET`, `PUT`, `DELETE`, and `PATCH` operations MUST be idempotent. The same request can be made multiple times without changing the result beyond the initial application.
- **Provide Standard Status Codes:** Use standard HTTP status codes to indicate the outcome of a request (e.g., `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).

## Best Practices

- **Support Filtering, Sorting, and Pagination:** For collection endpoints, provide query parameters to allow clients to filter, sort, and paginate results (e.g., `/users?status=active&sort=lastName&page=2`).
- **Use a Consistent Naming Convention:** All resource names and keys in JSON payloads SHOULD use a single convention (e.g., `camelCase` or `snake_case`).
- **Provide a Consistent Error Format:** Error responses SHOULD have a predictable JSON structure that provides a clear error message (e.g., `{"error": "Invalid input for field 'email'."}`).

## Anti-Patterns

- **Using Verbs in Endpoint Paths:** Do NOT use verbs in API endpoint paths (e.g., `/updateUser`).
- **Using GET for State-Changing Operations:** A `GET` request MUST NOT modify any state on the server.
- **Exposing Internal Implementation Details:** API responses MUST NOT leak internal system details, such as database IDs or internal stack traces.
