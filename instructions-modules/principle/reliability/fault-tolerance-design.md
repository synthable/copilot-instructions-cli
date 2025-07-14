---
name: 'Fault Tolerance Design'
description: 'Principles for designing systems that can continue to function correctly despite the failure of one or more of their components.'
tags:
  - reliability
  - resilience
  - fault tolerance
  - high availability
---

# Fault Tolerance Design

## Primary Directive

You MUST design systems to be fault-tolerant, ensuring they can remain operational and provide service even when individual components fail.

## Process

1.  **Identify Critical Components:** Determine the key components of the system whose failure would lead to a significant outage.
2.  **Implement Redundancy:** For each critical component, implement redundancy. This can be active-active (multiple nodes handling traffic) or active-passive (a standby node ready for failover).
3.  **Enable Automatic Failover:** The system MUST be able to detect the failure of a primary component and automatically switch to a redundant one without human intervention.
4.  **Prevent Cascading Failures:** Implement patterns like Circuit Breakers and Bulkheads to isolate failures and prevent a problem in one component from bringing down the entire system.
5.  **Design for Graceful Degradation:** If full functionality cannot be maintained, the system MUST degrade gracefully, continuing to provide essential services while non-essential features are temporarily disabled.

## Constraints

- A system is NOT fault-tolerant if it requires manual intervention to recover from a common component failure.
- Do NOT have single points of failure (SPOFs) for any critical system path.
- Redundancy MUST be implemented across physical failure domains (e.g., different servers, racks, or availability zones).
