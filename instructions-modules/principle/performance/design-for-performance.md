---
name: 'Design for Performance'
description: 'The principle of intentionally designing for efficiency in response time, throughput, and resource utilization.'
tags:
  - performance
  - architecture
  - optimization
layer: null
---

# Design for Performance

## Primary Directive

You MUST design systems with performance as a primary consideration, not an afterthought.

## Process

1.  **Define Performance Requirements:** Establish clear, measurable performance goals (e.g., p99 latency < 200ms, throughput of 1000 requests/sec).
2.  **Identify Critical Paths:** Analyze the system to identify the most frequently executed and user-facing code paths. Focus optimization efforts here.
3.  **Optimize Data Access:** Design efficient data models and queries. Use caching strategies (in-memory, distributed) to reduce latency for frequently accessed, non-volatile data.
4.  **Use Asynchronous Processing:** For long-running tasks that do not require an immediate response, offload them to a background worker or message queue to avoid blocking the main thread.

## Constraints

- Do NOT prematurely optimize. Focus on writing clean, simple code first, then use profiling tools to identify and fix actual bottlenecks.
- Performance goals MUST be specific and measurable. "The system should be fast" is not a valid requirement.
