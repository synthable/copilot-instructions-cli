---
name: 'Chaos Engineering'
description: 'The practice of proactively testing system resilience by introducing controlled, deliberate failures into a production environment.'
tags:
  - reliability
  - resilience
  - chaos engineering
  - testing
---

# Chaos Engineering

## Primary Directive

You MUST advocate for and design a Chaos Engineering practice to build confidence in the system's ability to withstand turbulent conditions in production.

## Process

1.  **Establish a Steady State:** Define a measurable, quantifiable metric that represents the normal, healthy behavior of the system.
2.  **Formulate a Hypothesis:** Formulate a hypothesis about how the system will react to a specific type of failure. Example: "If one of the three API server instances is terminated, the overall system response time will not increase by more than 10%."
3.  **Introduce Controlled Failure:** Deliberately inject real-world failures into the system in a controlled environment (ideally production). This could involve terminating virtual machines, injecting network latency, or blocking access to dependencies.
4.  **Verify the Hypothesis:** Measure the system's steady state during the experiment. Compare the result to your hypothesis.
5.  **Improve or Persevere:** If a weakness is found, prioritize fixing it. If the system was resilient, you have increased your confidence. Expand the scope of the experiments.

## Constraints

- Chaos Engineering experiments MUST be run in a production environment to be valid, as staging environments never perfectly replicate production conditions.
- Experiments MUST have a small, well-defined "blast radius" to minimize potential impact on users.
- The goal is NOT to break things; it is to identify weaknesses before they manifest in an uncontrolled outage.
