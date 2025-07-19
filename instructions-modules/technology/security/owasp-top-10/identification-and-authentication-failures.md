---
name: 'Identification and Authentication Failures'
description: 'A set of rules to prevent authentication failures by implementing strong identity and session management controls.'
tags:
  - security
  - owasp
  - authentication
  - session-management
layer: null
---

# Identification and Authentication Failures

## Primary Directive

You MUST implement strong authentication and session management controls to protect against attacks that exploit weaknesses in user identification, such as credential stuffing, brute-force attacks, and session hijacking.

## Process

1.  **Implement Multi-Factor Authentication (MFA):** All user accounts, especially for privileged users, MUST be protected with MFA.
2.  **Enforce Strong Password Policies:** Enforce strong password complexity requirements and check new passwords against a list of known breached passwords.
3.  **Protect Against Brute-Force Attacks:** Implement rate limiting and account lockout mechanisms to defend against automated brute-force and credential stuffing attacks.
4.  **Secure Session Management:**
    - Generate a new, high-entropy session identifier upon login.
    - Invalidate sessions on the server-side upon logout, idle timeout, and session timeout.
    - Do not expose session identifiers in URLs.
5.  **Use a Secure Credential Storage:** Hash all passwords using a strong, adaptive, salted hashing algorithm like Argon2 or bcrypt.

## Constraints

- You MUST NOT allow weak or common passwords.
- You MUST NOT allow authentication to be bypassed.
- You MUST NOT send session identifiers over unencrypted channels.
- You MUST NOT use default credentials in any environment.
