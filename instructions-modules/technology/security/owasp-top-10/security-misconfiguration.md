---
name: 'Security Misconfiguration'
description: 'A set of rules to prevent security misconfigurations by establishing a hardened, repeatable configuration process and regularly auditing the system for deviations.'
tags:
  - security
  - owasp
  - configuration
  - hardening
---

# Security Misconfiguration

## Primary Directive

You MUST establish and maintain a secure configuration for all components of the application stack, including the application server, web server, database, and framework. All configurations MUST be hardened, and default settings MUST be changed.

## Process

1.  **Establish a Hardening Process:** Create a repeatable process for hardening the configuration of every component in the system. This should be automated as much as possible.
2.  **Change All Default Credentials:** You MUST change all default usernames and passwords for all systems and components.
3.  **Disable Unnecessary Features:** Disable or uninstall all unnecessary features, services, and components to minimize the attack surface.
4.  **Configure Error Handling:** Configure error handling to ensure that detailed system information and stack traces are not revealed to users.
5.  **Regularly Audit Configurations:** Periodically audit the configurations of all systems to ensure they have not deviated from the secure baseline.

## Constraints

- You MUST NOT deploy any system with its default configuration.
- You MUST NOT leave unnecessary ports open on the firewall.
- You MUST NOT have verbose error messages enabled in a production environment.
- Cloud storage permissions MUST be configured to be private by default.
