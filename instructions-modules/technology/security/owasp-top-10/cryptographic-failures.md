---
name: 'Cryptographic Failures'
description: 'A set of strict rules to prevent cryptographic failures by protecting data in transit and at rest using up-to-date, strong cryptographic algorithms and protocols.'
tags:
  - security
  - owasp
  - cryptography
  - data-protection
---

# Cryptographic Failures

## Primary Directive

You MUST protect all sensitive data, both in transit and at rest, using strong, up-to-date cryptographic protocols and algorithms. Data that is no longer needed MUST be securely disposed of.

## Process

1.  **Use TLS for Data in Transit:** All communication channels (e.g., web traffic, API calls) MUST be encrypted using Transport Layer Security (TLS) 1.2 or higher with strong cipher suites.
2.  **Encrypt Data at Rest:** All sensitive data (e.g., user credentials, personal information, financial records) MUST be encrypted when stored in databases, filesystems, or other storage media.
3.  **Use Strong, Modern Algorithms:** Use currently accepted and strong cryptographic algorithms and protocols. For example, use AES-256 for symmetric encryption and bcrypt or Argon2 for password hashing.
4.  **Manage Keys Securely:** Cryptographic keys MUST be managed securely. Use a dedicated key management system (e.g., AWS KMS, Azure Key Vault, HashiCorp Vault). Do not hardcode keys in source code.
5.  **Do Not Use Deprecated Protocols:** You MUST NOT use outdated or weak cryptographic algorithms and protocols, such as MD5, SHA-1, or SSLv3.

## Constraints

- You MUST NOT transmit sensitive data in cleartext over any network.
- You MUST NOT store sensitive data in cleartext.
- You MUST NOT invent your own cryptographic algorithms or protocols. Rely on well-vetted, industry-standard libraries and implementations.
- Error messages MUST NOT contain sensitive information.
layer: null
