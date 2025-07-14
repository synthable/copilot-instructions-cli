---
name: 'Software and Data Integrity Failures'
description: 'A set of rules to protect against software and data integrity failures by verifying the integrity of all code, data, and critical updates.'
tags:
  - security
  - owasp
  - integrity
  - supply-chain
---

# Software and Data Integrity Failures

## Primary Directive

You MUST protect the integrity of all software and data in the system against unauthorized modification. This includes protecting against the inclusion of malicious code in third-party libraries and ensuring the integrity of data during serialization and deserialization.

## Process

1.  **Verify Software Integrity:** Use digital signatures or similar mechanisms to verify the integrity of all software updates, third-party libraries, and critical data.
2.  **Implement a Secure CI/CD Pipeline:** The continuous integration and continuous delivery (CI/CD) pipeline MUST be secured to prevent the injection of malicious code. This includes access controls, code reviews, and integrity checks.
3.  **Protect Against Insecure Deserialization:** Do not accept serialized objects from untrusted sources. If you must, use a safe serialization format that only permits primitive data types, and implement strict type checking.
4.  **Ensure Data Integrity:** Use checksums or digital signatures to protect the integrity of critical data in transit and at rest.

## Constraints

- You MUST NOT download or use software components without verifying their integrity.
- You MUST NOT deserialize untrusted data without proper safeguards.
- You MUST NOT allow critical data to be modified without authorization.
