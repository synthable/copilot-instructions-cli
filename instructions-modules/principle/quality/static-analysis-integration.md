---
name: 'Static Analysis Integration'
description: 'The principle of using automated tools to identify potential issues in code before it is executed.'
layer: null
tags:
  - quality
  - static analysis
  - linting
  - automation
  - ci
---

# Static Analysis Integration

## Primary Directive

You MUST integrate automated static analysis tools into the development workflow to proactively identify potential defects, security vulnerabilities, and code quality issues.

## Process

1.  **Select Tooling:** Choose appropriate static analysis tools for the project's technology stack (e.g., ESLint for TypeScript, SonarQube for Java/C#, Bandit for Python).
2.  **Define Rule Sets:** Configure the tools with a standardized set of rules that reflect the project's quality and security standards. This ruleset MUST be version-controlled.
3.  **Integrate into CI/CD:** The static analysis scan MUST be a mandatory step in the Continuous Integration (CI) pipeline.
4.  **Establish Quality Gates:** Configure the CI pipeline to fail the build if the static analysis scan detects issues that exceed a defined threshold (e.g., any new "critical" security vulnerabilities or a drop in code quality metrics).
5.  **Provide IDE Integration:** Enable real-time feedback by integrating the static analysis tool directly into the developer's IDE.

## Constraints

- Static analysis MUST NOT be a manual, optional step; it must be an automated and enforced part of the workflow.
- Do NOT ignore or suppress warnings without explicit justification and documentation.
- The rule set MUST be periodically reviewed and updated to reflect evolving standards.
