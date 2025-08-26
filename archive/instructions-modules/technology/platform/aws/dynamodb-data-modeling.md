---
tier: technology
name: 'DynamoDB Data Modeling'
description: 'A module on how to model data effectively for DynamoDB, focusing on single-table design, access patterns, and choosing the right keys and indexes.'
tags:
  - aws
  - dynamodb
  - nosql
  - data-modeling
  - database
layer: null
---

# DynamoDB Data Modeling

## Primary Directive

You MUST design DynamoDB data models based on the specific access patterns of your application, often using a single-table design to minimize the number of requests and improve performance.

## Process

1.  **Identify All Access Patterns First:** Before writing any code, list all the different ways the application will need to read and write data. This is the most critical step.
2.  **Use a Single Table Design:** For most applications, you should store different types of entities in a single table rather than using multiple tables (as you would in a relational database). This allows you to fetch multiple, related item types in a single query.
3.  **Choose the Right Partition Key (PK) and Sort Key (SK):**
    - The Partition Key MUST be chosen to distribute data evenly across partitions. A high-cardinality attribute (like `UserID` or `OrderID`) is a good choice.
    - Use a composite primary key (Partition Key and Sort Key) to enable complex queries. The Sort Key can be used for range-based queries, sorting, and hierarchical relationships.
4.  **Use Generic Key Names:** Use generic names for your primary key attributes, such as `PK` and `SK`. This allows you to store different entity types in the same table. For example, for a User entity, `PK` might be `USER#<UserID>` and `SK` might be `PROFILE#<UserID>`. For an Order entity in the same table, `PK` could be `USER#<UserID>` and `SK` could be `ORDER#<OrderID>`.
5.  **Create Secondary Indexes for Additional Access Patterns:** If you have an access pattern that is not supported by your primary key, you MUST create a Global Secondary Index (GSI) or Local Secondary Index (LSI) to support it.

## Constraints

- Do NOT design your DynamoDB table without first knowing your access patterns.
- Do NOT use a relational, multi-table design approach with DynamoDB.
- Your choice of Partition Key MUST avoid "hot partitions" by distributing write and read traffic evenly.
- Scans are expensive and slow. You MUST design your keys and indexes to avoid the need for `Scan` operations in your application's critical path.
