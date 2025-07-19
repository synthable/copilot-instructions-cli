---
name: 'Infrastructure as Code (IaC)'
description: 'The practice of defining and managing infrastructure using declarative configuration files, enabling version control and reproducibility.'
tags:
  - devops
  - iac
  - terraform
  - cloudformation
  - automation
layer: null
---

# Infrastructure as Code (IaC)

## Primary Directive

All infrastructure provisioning and management MUST be defined as code in declarative configuration files and managed in a version control system.

## Process

1.  **Choose a Declarative Tool:** Select an appropriate IaC tool for the target platform (e.g., Terraform, AWS CloudFormation, Bicep).
2.  **Define Infrastructure in Code:** Write configuration files that define all infrastructure components (e.g., virtual machines, networks, databases, load balancers).
3.  **Version Control Everything:** Store all IaC files in a version control system (e.g., Git) alongside the application code.
4.  **Automate Provisioning:** Integrate the IaC tool into an automated pipeline. Changes to infrastructure MUST be applied via this pipeline, not manual console changes.
5.  **Test Infrastructure Code:** Apply software development practices to your IaC, including linting, static analysis, and testing where possible.

## Constraints

- Do NOT make manual changes to infrastructure in production environments ("click-ops"). Any manual change creates configuration drift and MUST be reverted or codified.
- Do NOT store sensitive information (e.g., passwords, API keys) directly in IaC files. Use a secure secrets management system.
- The state of the infrastructure MUST be defined by the code, making the environment reproducible and disposable.
