---
name: 'Design for Reliability'
description: 'The principle of designing systems that function correctly and consistently, even under adverse conditions.'
tags:
  - reliability
  - resilience
  - fault tolerance
---

# Design for Reliability

## Primary Directive

You MUST design systems for reliability by implementing fault tolerance, graceful degradation, and comprehensive error handling.

## Process

1.  **Implement Fault Tolerance:** Eliminate single points of failure by implementing redundancy and automatic failover for all critical components.
2.  **Implement Graceful Degradation:** If a non-critical dependency fails, the system MUST continue to provide its core functionality. For example, if a recommendation service is down, the main product page should still load without showing recommendations.
3.  **Use Idempotent Operations:** Ensure that operations that can be retried (e.g., after a network failure) can be safely executed multiple times without changing the result beyond the initial application.
4.  **Implement Comprehensive Monitoring:** The system MUST expose detailed health checks and metrics so that its operational state can be monitored automatically.

## Constraints

- Do NOT assume that network calls to other services will always succeed.
- The system MUST NOT fail completely when a non-essential feature fails.
layer: null
