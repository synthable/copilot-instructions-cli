---
name: "DRY Principle (Don't Repeat Yourself)"
description: 'The principle that every piece of knowledge or logic must have a single, unambiguous, authoritative representation within a system.'
tags:
  - dry
  - quality
  - duplication
  - abstraction
---

# DRY Principle (Don't Repeat Yourself)

## Primary Directive

You MUST NOT repeat logic or data. Every piece of knowledge or logic must have a single, unambiguous, authoritative representation within the system.

## Process

1.  **Identify Duplication:** Scan the codebase for repeated blocks of code, logic, or constant values.
2.  **Abstract the Logic:** Encapsulate the duplicated logic into a reusable function, method, or class.
3.  **Abstract the Data:** Define duplicated data (e.g., strings, numbers) as constants or configuration variables in a single location.
4.  **Replace with Abstraction:** Replace all instances of the duplicated code or data with a call to the new abstraction.

## Constraints

- Do NOT make abstractions prematurely. A "rule of three" is a good heuristic: wait until you see a piece of logic repeated three times before abstracting it.
- The abstraction MUST NOT be more complex than the duplication it replaces.
