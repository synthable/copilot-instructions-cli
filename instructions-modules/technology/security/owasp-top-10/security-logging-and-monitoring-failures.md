---
name: 'Security Logging and Monitoring Failures'
description: 'A set of rules to ensure sufficient logging and monitoring is in place to detect and respond to security incidents in a timely manner.'
tags:
  - security
  - owasp
  - logging
  - monitoring
  - incident-response
layer: null
---

# Security Logging and Monitoring Failures

## Primary Directive

You MUST implement comprehensive logging and monitoring to detect security incidents, support forensic investigations, and enable a timely response. Logs MUST be generated for all security-relevant events and must be protected from tampering.

## Process

1.  **Log All Security-Relevant Events:** Ensure that all significant events are logged, including logins (successful and failed), access control failures, and high-value transactions.
2.  **Ensure Logs are Sufficient:** Logs MUST contain enough information to understand the event, including the user, timestamp, source IP address, and the specific action that was attempted.
3.  **Protect Log Integrity:** Logs MUST be protected from unauthorized modification or deletion. This can be achieved by writing logs to a separate, append-only system.
4.  **Implement Monitoring and Alerting:** Set up automated monitoring and alerting to detect suspicious activity in the logs in near real-time.
5.  **Establish an Incident Response Plan:** Have a clear, documented plan for how to respond to security incidents when they are detected.

## Constraints

- You MUST NOT fail to log significant security events.
- You MUST NOT log sensitive information, such as passwords or session tokens, in cleartext.
- Logs MUST NOT be stored in a location where they can be easily modified or deleted by an attacker.
