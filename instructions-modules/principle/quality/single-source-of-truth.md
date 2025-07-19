---
tier: principle
name: 'Single Source of Truth (SSoT)'
description: 'The practice of structuring information models and data schemas so that every data element is stored exactly once. This prevents inconsistencies and improves data integrity.'
tags:
  - quality
  - data
  - architecture
  - ssot
layer: null
---

# Single Source of Truth (SSoT)

## Primary Directive

Every piece of data or knowledge in a system MUST have a single, authoritative, and unambiguous source.

## Process

1.  **Identify Data Elements:** Enumerate all the key data elements in the system.
2.  **Define the Authoritative Source:** For each data element, designate one and only one location as its "source of truth." This could be a specific database table, a configuration file, an API, etc.
3.  **Eliminate Duplication:** Actively find and remove any instances where the same piece of data is stored in multiple places.
4.  **Reference, Don't Copy:** When other parts of the system need the data, they MUST reference it from the authoritative source. If a copy is necessary for performance (e.g., a cache), there MUST be a clear process for keeping the copy synchronized with the source.

## Constraints

- Do NOT store the same piece of mutable data in more than one location.
- Do NOT rely on manual processes to keep duplicated data in sync.
- If you create a copy of data (e.g., for caching), it MUST be treated as a read-only, non-authoritative replica.
