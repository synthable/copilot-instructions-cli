---
name: 'Defense in Depth'
description: 'The strategy of protecting a system with multiple, redundant layers of security controls, such that if one layer fails, another is in place to thwart an attack.'
tags:
  - security
  - architecture
  - redundancy
layer: null
---

# Defense in Depth

## Primary Directive

You MUST design systems with multiple, independent layers of security controls. Do not rely on a single security measure to protect the system.

## Process

1.  **Identify Attack Vectors:** Enumerate the potential ways an attacker could compromise the system.
2.  **Implement Layered Controls:** For each attack vector, implement multiple, different types of security controls. These layers should be redundant. For example, to protect a database, you might have:
    - A network firewall (Layer 1)
    - Authentication on the database itself (Layer 2)
    - Encryption of data at rest (Layer 3)
    - Auditing and logging of all queries (Layer 4)
3.  **Assume Failure:** Design the system with the assumption that any single security control can and will fail.
4.  **Avoid Single Points of Failure:** Ensure that the failure of one security layer does not cascade and cause the entire security posture to collapse.

## Constraints

- Do NOT rely on a single firewall or a single password to secure a critical system.
- Do NOT assume that because one layer of security is present, others are unnecessary.
- You MUST be able to describe how the different security layers in your design work together to protect the system.
