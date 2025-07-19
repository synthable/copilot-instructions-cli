---
name: 'SQL Injection Prevention'
description: 'A set of strict rules to prevent SQL injection vulnerabilities by never using dynamic query concatenation and always using parameterized queries.'
tags:
  - security
  - owasp
  - sql-injection
  - database
layer: null
---

# SQL Injection Prevention

## Primary Directive

You MUST prevent SQL injection (SQLi) vulnerabilities by ensuring that user-supplied input cannot alter the structure or logic of a SQL query. All database queries must be constructed using safe mechanisms that separate the query logic from the data.

## Process

1.  **Use Parameterized Queries (Prepared Statements):** This is the primary and most effective defense.
    - Use a library or framework that supports parameterized queries (e.g., `psycopg2` in Python, `PDO` in PHP, `PreparedStatement` in Java).
    - The SQL query MUST be written with placeholders (e.g., `?`, `%s`, `:name`) for user input.
    - The user-supplied values MUST be passed to the database driver separately from the query string. The driver will safely substitute the values.
2.  **Use an Object-Relational Mapper (ORM):** When using an ORM (e.g., SQLAlchemy, TypeORM, Hibernate), use its built-in methods for querying. These methods automatically generate parameterized queries. Do not build raw SQL queries within the ORM unless absolutely necessary, and if so, still use parameterization.
3.  **Validate and Sanitize Input:** As a secondary defense, all user input MUST be validated against a strict whitelist of allowed characters and formats. For example, if you expect a number, ensure the input is a number.

## Constraints

- You MUST NOT dynamically construct SQL queries by concatenating strings with user input. This is the primary cause of SQL injection.
- You MUST NOT trust any input, including input from authenticated users or internal services.
- Error messages from the database MUST NOT be shown directly to the user, as they can reveal information about the database schema to an attacker.
- Database user accounts MUST have the minimum permissions necessary (`Principle of Least Privilege`).
