---
name: 'Vulnerable and Outdated Components'
description: 'A set of rules for managing third-party components to prevent the use of software with known vulnerabilities.'
tags:
  - security
  - owasp
  - dependency-management
  - supply-chain
---

# Vulnerable and Outdated Components

## Primary Directive

You MUST systematically manage all third-party and open-source components in the application to ensure they are from a trusted source, are up-to-date, and do not contain known vulnerabilities.

## Process

1.  **Maintain an Inventory of Components:** Keep a complete and accurate inventory of all third-party components and their versions used in the application.
2.  **Scan for Vulnerabilities:** Use automated tools (e.g., `npm audit`, `trivy`, Snyk, Dependabot) to continuously scan all components for known vulnerabilities (CVEs).
3.  **Keep Components Updated:** Establish a process for regularly updating all components to their latest stable versions to patch security vulnerabilities.
4.  **Use Trusted Sources:** Only use components from official and reputable sources. Verify the integrity of the components if possible (e.g., by checking digital signatures).
5.  **Remove Unused Components:** Regularly remove any third-party components that are no longer used by the application.

## Constraints

- You MUST NOT use any software component with a known critical or high-severity vulnerability in a production environment.
- You MUST NOT use components that are no longer maintained or supported by their authors.
- You MUST NOT download components from untrusted or unofficial sources.
layer: null
