---
name: 'Insecure Design'
description: 'A set of principles for secure software design, emphasizing threat modeling and the integration of security into every phase of the development lifecycle.'
tags:
  - security
  - owasp
  - secure-design
  - threat-modeling
---

# Insecure Design

## Primary Directive

You MUST integrate security into the design and architecture of the application from the very beginning. Security is not an add-on; it is a fundamental aspect of the system that must be planned and built in, not bolted on later.

## Process

1.  **Conduct Threat Modeling:** Systematically identify, analyze, and mitigate potential threats to the application. Use a structured approach like STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege).
2.  **Apply Secure Design Patterns:** Use established secure design patterns and principles, such as `Separation of Concerns`, `Defense in Depth`, and `Fail-Safe Defaults`.
3.  **Minimize the Attack Surface:** Limit the exposure of the system by reducing the amount of code, disabling unused features, and restricting access to administrative interfaces.
4.  **Plan for Failure:** Design the system to be resilient and to fail securely. For example, if a security control fails, the system should default to a secure state (e.g., deny access).

## Constraints

- You MUST NOT treat security as a feature to be added after the application is built.
- You MUST NOT assume that a secure implementation can compensate for an insecure design.
- You MUST NOT rely on a single security control. Employ a layered defense (`Defense in Depth`).
layer: null
