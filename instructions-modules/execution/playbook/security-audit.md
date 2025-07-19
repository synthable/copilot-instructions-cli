---
name: 'Perform Security Audit'
description: 'A playbook for conducting a comprehensive security audit of a codebase to identify and mitigate vulnerabilities.'
tags:
  - security
  - audit
  - playbook
  - vulnerability-assessment
layer: null
---

# Perform Security Audit

## Primary Directive

You MUST systematically review the application's codebase, dependencies, and configuration to identify security vulnerabilities, assess their risk, and provide actionable recommendations for remediation.

## Process

1.  **Scope the Audit:** Clearly define the boundaries of the audit. Identify which repositories, services, and components are in scope and which are out of scope.
2.  **Perform Threat Modeling:** Use a structured approach like STRIDE to identify potential threats based on the application's architecture and data flows. This helps to focus the audit on the most critical areas.
3.  **Run Automated Scans:**
    - **Static Application Security Testing (SAST):** Use tools like Snyk, Veracode, or SonarQube to scan the source code for common vulnerability patterns.
    - **Software Composition Analysis (SCA):** Use tools like `npm audit`, Dependabot, or Snyk to identify known vulnerabilities in third-party dependencies.
4.  **Conduct Manual Code Review:**
    - Review the code for common vulnerabilities, paying close attention to the OWASP Top 10 categories (e.g., Injection, Broken Access Control, Cryptographic Failures).
    - Focus on high-risk areas identified during threat modeling.
    - Look for logic flaws that automated tools might miss.
5.  **Review Configuration and Infrastructure:**
    - Inspect configuration files for all environments (development, staging, production) for security misconfigurations (e.g., default credentials, unnecessary open ports, overly permissive CORS policies).
    - Review CI/CD pipeline configurations for security weaknesses.
6.  **Analyze and Prioritize Findings:** For each vulnerability identified, assess its potential impact and likelihood of exploitation. Assign a risk level (e.g., Critical, High, Medium, Low).
7.  **Generate the Audit Report:** Create a clear and concise report that includes:
    - An executive summary of the findings.
    - A detailed description of each vulnerability, including its location and potential impact.
    - Actionable recommendations for how to remediate each vulnerability.

## Constraints

- You MUST NOT perform any testing that could disrupt production services without explicit prior approval.
- You MUST NOT rely solely on automated tools. Manual review is essential for identifying complex vulnerabilities and business logic flaws.
- The audit report MUST be objective and based on verifiable evidence. Avoid speculation.
- The report MUST NOT include sensitive data (e.g., passwords, API keys) discovered during the audit.
