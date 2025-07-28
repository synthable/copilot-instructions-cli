---
tier: principle
name: 'Infrastructure as Code (IaC)'
description: 'The practice of defining and managing infrastructure using declarative configuration files, enabling version control and reproducibility.'
tier: principle
schema: pattern
layer: null
---

## Summary

Infrastructure as Code (IaC) is the methodology of managing and provisioning computer data centers through machine-readable definition files, rather than physical hardware configuration or interactive configuration tools. All infrastructure definitions are stored as code in a version control system.

## Core Principles

- **Declarative Definitions:** Infrastructure is defined using a declarative language that specifies the desired end state, not the steps to reach it.
- **Version Control:** All infrastructure configuration files MUST be stored and managed in a version control system (e.g., Git), providing a full history of changes.
- **Automation:** Infrastructure changes (creation, modification, deletion) MUST be applied through automated pipelines, not manual adjustments in a console.
- **Idempotency:** Applying the same configuration multiple times MUST result in the same system state. The IaC tool handles the logic to determine if changes are needed.

## Advantages / Use Cases

- **Reproducibility:** Environments can be recreated reliably and consistently on demand, eliminating configuration drift.
- **Speed and Efficiency:** Automation drastically reduces the time and effort required to provision and scale infrastructure.
- **Traceability and Auditing:** Version control provides a clear audit trail for every change made to the infrastructure.
- **Disaster Recovery:** In the event of a failure, the entire infrastructure can be redeployed quickly from code.

## Disadvantages / Trade-offs

- **Learning Curve:** Requires developers and operations teams to learn specific IaC tools and languages (e.g., Terraform, CloudFormation).
- **Initial Setup Time:** Defining existing infrastructure in code can be a significant upfront investment.
- **Complexity:** Managing state, secrets, and complex dependencies in IaC can be challenging.
- **Tooling Limitations:** The chosen IaC tool may not support all features of a cloud provider's API immediately upon release.
