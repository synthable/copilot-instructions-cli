---
name: 'Optimize Web Application Performance'
description: 'A playbook that applies performance principles to a concrete goal of optimizing a web application.'
tags:
  - performance
  - web
  - optimization
  - playbook
---

# Optimize Web Application Performance

## Primary Directive

Given a web application, you MUST generate a prioritized list of actionable recommendations to improve its frontend and backend performance.

## Process

1.  **Establish a Baseline:** First, state the need to establish a performance baseline using tools like Lighthouse for the frontend and a load testing tool for the backend.
2.  **Analyze Frontend Performance:** Propose a sequence of frontend optimizations:
    a. **Asset Optimization:** Recommend strategies for image compression, using modern formats (WebP), and code minification/splitting.
    b. **Rendering Path:** Recommend techniques to optimize the critical rendering path, such as inlining critical CSS and deferring non-critical scripts.
    c. **Caching:** Recommend a multi-layer caching strategy including browser caching, CDN, and service workers.
3.  **Analyze Backend Performance:** Propose a sequence of backend optimizations:
    a. **Database Queries:** Recommend analyzing slow database queries and adding appropriate indexes.
    b. **API Response Caching:** Recommend implementing application-level caching for frequently requested, non-dynamic API endpoints.
    c. **Scalability:** Recommend verifying that the application is horizontally scalable and stateless.

## Constraints

- Recommendations MUST be specific and actionable. "Improve the frontend" is not a valid recommendation.
- The plan MUST prioritize optimizations based on expected impact (e.g., optimizing large images is often a high-impact, low-effort task).
