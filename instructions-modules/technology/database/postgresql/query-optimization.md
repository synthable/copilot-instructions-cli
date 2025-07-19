---
name: 'PostgreSQL Query Optimization'
description: 'Directives for writing efficient and performant queries in PostgreSQL, focusing on indexing, joins, and query analysis.'
tags:
  - postgresql
  - database
  - performance
  - sql
layer: null
---

# PostgreSQL Query Optimization

## Primary Directive

You MUST write efficient PostgreSQL queries that leverage indexes and appropriate join strategies. All complex queries must be analyzed to ensure they are performant.

## Process

1.  **Use `EXPLAIN ANALYZE`:** Before putting any complex query into production, you MUST run it with `EXPLAIN ANALYZE` to understand its execution plan. Look for full table scans (`Seq Scan`) on large tables, which often indicate a missing index.
2.  **Create Appropriate Indexes:**
    - Create B-tree indexes on columns that are frequently used in `WHERE` clauses, `JOIN` conditions, and `ORDER BY` clauses.
    - Use composite indexes for queries that filter on multiple columns.
    - Consider specialized index types like GIN or GiST for full-text search or geometric data.
3.  **Write Efficient Joins:**
    - Ensure that the columns used in `JOIN` conditions are indexed on both tables.
    - Prefer `INNER JOIN` over `LEFT JOIN` or `RIGHT JOIN` when possible, as it is typically more performant.
4.  **Avoid `SELECT *`:** Only select the specific columns you need. This reduces the amount of data transferred from the database and can sometimes allow for index-only scans.

## Constraints

- Do NOT run queries in a loop (N+1 problem). Use a `JOIN` or a subquery with `IN` to fetch related data in a single query.
- Do NOT use functions on indexed columns in a `WHERE` clause (e.g., `WHERE lower(email) = '...'`), as this prevents the database from using the index. Instead, use a function-based index or modify the query.
- A query is not considered "done" until its execution plan has been reviewed and deemed efficient.
