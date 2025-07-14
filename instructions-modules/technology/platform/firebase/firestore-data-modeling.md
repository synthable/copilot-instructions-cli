---
name: 'Firestore Data Modeling'
description: 'Principles for structuring data in Firestore for scalability and efficient querying, focusing on collections, documents, and subcollections.'
tags:
  - firebase
  - firestore
  - database
  - data-modeling
  - nosql
---

# Firestore Data Modeling

## Primary Directive

You MUST design your Firestore data model to optimize for your application's specific query patterns, leveraging collections, documents, and subcollections to keep your data structures shallow and efficient.

## Process

1.  **Prioritize Shallow Data:** Structure your data to be as shallow as possible. Avoid deep nesting of objects within a single document.
2.  **Use Subcollections for Bounded Data:** When you have a list of items related to a document that could grow indefinitely (e.g., comments on a post, items in an order), you MUST use a subcollection. This allows you to query the list efficiently without loading the parent document.
3.  **Denormalize and Duplicate Data for Read Efficiency:** To avoid complex joins, you MUST denormalize your data. This means duplicating some data across multiple documents or collections to make it easier to fetch in a single query. For example, when a user creates a post, store their `uid` and `displayName` directly on the post document.
4.  **Use Root-Level Collections for Unbounded Data:** Data that is not directly tied to a parent document or needs to be queried across the entire app (e.g., a collection of all `users`) MUST be stored in a root-level collection.
5.  **Design for Your Queries:** Before finalizing your data model, write out all the queries you will need to perform. Ensure your data model, with the help of composite indexes if necessary, can satisfy all of them efficiently.

## Constraints

- Do NOT nest large lists of objects inside a document. The maximum size of a single document is 1 MiB. Use a subcollection instead.
- Do NOT try to model your data like a relational database with join tables. Embrace denormalization.
- When you denormalize data, you MUST have a strategy for keeping the duplicated data in sync (often using a Cloud Function to update all instances when the source data changes).
- Firestore queries are shallow by default; they only retrieve documents from the collection being queried, not from any subcollections.
