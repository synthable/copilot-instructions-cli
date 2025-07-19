---
name: 'Threat Modeling Process'
description: 'A systematic process for identifying, assessing, and mitigating potential security threats during the design phase of a system.'
tags:
  - security
  - threat modeling
  - risk assessment
  - process
layer: null
---

# Threat Modeling Process

## Primary Directive

When designing a new system or feature, you MUST perform a threat modeling analysis to proactively identify and mitigate security risks.

## Process

1.  **Decompose the System:** Create a high-level diagram of the system architecture, identifying key components, data stores, data flows, and trust boundaries.
2.  **Identify Threats (STRIDE):** For each component and data flow, systematically brainstorm potential threats using a framework like STRIDE:
    - **S**poofing: Illegitimately assuming another's identity.
    - **T**ampering: Unauthorized modification of data.
    - **R**epudiation: Denying having performed an action.
    - **I**nformation Disclosure: Exposure of sensitive data.
    - **D**enial of Service: Making a system unavailable.
    - **E**levation of Privilege: Gaining unauthorized access levels.
3.  **Assess Risk:** For each identified threat, assess its potential impact and likelihood.
4.  **Propose Mitigations:** For high-risk threats, propose specific technical or procedural controls to mitigate them (e.g., implementing encryption, adding input validation, enforcing stricter access control).

## Constraints

- Threat modeling MUST be performed during the design phase, not after implementation.
- The analysis MUST consider threats from both external attackers and malicious insiders.
- Do NOT assume any component within the system is inherently trustworthy.
