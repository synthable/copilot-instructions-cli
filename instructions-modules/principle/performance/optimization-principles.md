---
name: 'Optimization Principles'
description: 'A set of guiding principles for improving system performance, emphasizing measurement and focusing on bottlenecks.'
tags:
  - performance
  - optimization
  - quality
  - measurement
layer: null
---

# Optimization Principles

## Primary Directive

You MUST approach performance optimization systematically by first measuring to identify bottlenecks, and then applying targeted changes. Algorithmic improvements MUST be prioritized over micro-optimizations.

## Process

1.  **Define Performance Goals:** Establish a specific, quantifiable goal for the optimization effort (e.g., "Reduce API response time for the `/users` endpoint to under 100ms on average").
2.  **Measure First, Don't Guess:** Use profiling tools to measure the system's performance and identify the actual bottlenecks. The majority of time is often spent in a small fraction of the code.
3.  **Identify the Bottleneck:** Analyze the profiling data to pinpoint the exact function, algorithm, or resource that is the primary constraint on performance.
4.  **Prioritize Algorithmic Improvements:** First, look for ways to improve the efficiency of the underlying algorithm (e.g., moving from an O(n^2) to an O(n log n) solution). This often yields the largest gains.
5.  **Implement and Measure Again:** Apply a single, targeted optimization. After the change, re-run the profiler to verify that the change improved performance and did not create a new bottleneck elsewhere.

## Constraints

- Do NOT engage in premature optimization. Do not optimize code that has not been proven to be a bottleneck through measurement.
- Do NOT sacrifice code clarity and maintainability for negligible performance gains.
- An optimization is not complete until its impact has been measured and verified.
- Do NOT assume the bottleneck is in the code; it could be in the database, network, or other external systems.
