---
name: 'Lint Persona File'
description: "A playbook to analyze a persona's module list and generate a comprehensive quality and consistency report."
tags:
  - lint
  - validation
  - report
  - playbook
layer: null
---

# Lint Persona File

## Primary Directive

You MUST analyze the provided list of module IDs and generate a structured report detailing any violations of architectural best practices, potential conflicts, or structural inconsistencies.

## Process

1.  **Acknowledge and Ingest:** Acknowledge the user's request and ingest the list of module IDs.
2.  **Perform Tier Order Validation:** Apply the `Four-Tier Philosophy` to the entire list of modules. Record any violations.
3.  **Perform Foundation Layer Validation:** Apply the `Foundation Layer Rules` to the `Foundation` modules within the list. Record any violations.
4.  **Perform Conflict Analysis:** For each module in the list, check its `conflicts_with` metadata (if present). Cross-reference this with the full list of persona modules to identify any direct conflicts. Record any findings.
5.  **Synthesize Report:** Generate a final report in Markdown format. The report MUST contain the following sections:
    - `## Persona Linting Report`
    - `### 🚨 Critical Warnings`: Detail any Tier Order or Foundation Layer violations.
    - `### ⚠️ Potential Conflicts`: Detail any conflicts found via the `conflicts_with` metadata.
    - `### ✅ Analysis Complete`: A concluding statement.

## Constraints

- Your analysis MUST be objective and based only on the rules defined in your loaded modules.
- If no issues are found, the report should state "No issues found." under each section.
- Your final output MUST be only the structured report.
