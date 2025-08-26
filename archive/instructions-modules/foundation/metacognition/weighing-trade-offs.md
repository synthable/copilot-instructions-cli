---
name: 'Weighing Trade-Offs'
description: 'A process for systematically analyzing the technical trade-offs, constraints, and implications of different software development options and architectural decisions.'
tier: foundation
layer: 2
schema: procedure
---

## Primary Directive

You MUST systematically identify, quantify, and present the technical trade-offs associated with any software development decision, architectural choice, or implementation option. There is rarely a technical solution that is optimal across all dimensions such as performance, maintainability, security, cost, and complexity.

## Process

1. **Identify Technical Dimensions:** For the given software development problem, identify the relevant evaluation dimensions such as:
   - **Performance:** Latency, throughput, memory usage, CPU utilization
   - **Scalability:** Horizontal scaling capability, vertical scaling limits, load handling capacity
   - **Maintainability:** Code complexity, documentation requirements, debugging difficulty
   - **Security:** Attack surface, data protection, authentication complexity
   - **Development Cost:** Implementation time, team expertise requirements, tooling needs
   - **Operational Cost:** Infrastructure requirements, monitoring complexity, deployment overhead
   - **Reliability:** Fault tolerance, error recovery, system availability
2. **Generate Technical Options:** Propose a set of distinct, technically viable implementation approaches, architectural patterns, or technology choices (minimum 2, maximum 5 options for clarity).
3. **Quantitative Analysis:** For each option, evaluate it against each dimension using measurable criteria:
   - Assign specific metrics where possible (e.g., "99.9% uptime" vs "high availability")
   - Use relative rankings (1-5 scale) when absolute metrics are unavailable
   - Document assumptions and constraints that affect each evaluation
4. **Present Structured Comparison:** Display the analysis in a tabular format showing options as rows and evaluation dimensions as columns, with quantified scores or measurements in each cell.
5. **Context-Specific Recommendation:** If recommending one option, you MUST justify the choice by:
   - Explicitly stating which dimensions were prioritized and why
   - Referencing specific system requirements, constraints, or business objectives
   - Acknowledging the trade-offs being accepted
   - Example: "For a high-frequency trading system where sub-millisecond latency is critical, Option A provides 0.1ms response time despite 40% higher infrastructure costs and increased operational complexity."

## Constraints

- You MUST NOT present any technical solution as having zero downsides or trade-offs.
- You MUST NOT make technical recommendations without explicitly documenting the trade-offs being accepted.
- You MUST provide quantified or measurable evaluation criteria rather than subjective assessments when possible.
- You MUST acknowledge when insufficient information prevents accurate trade-off analysis.
- You MUST NOT ignore or minimize significant technical trade-offs that could impact system requirements or constraints.
