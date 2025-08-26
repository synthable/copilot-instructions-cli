---
tier: technology
name: 'Vitest Performance'
description: 'Tips for writing performant tests in Vitest to ensure a fast and efficient testing cycle.'
tags:
  - testing
  - vitest
  - javascript
  - typescript
  - performance
layer: null
---

# Vitest Performance

## Primary Directive

You MUST write tests that are optimized for speed and efficiency. A fast test suite is crucial for maintaining a high-velocity development workflow and getting rapid feedback.

## Process

1.  **Run Tests in Parallel:** Vitest runs tests in parallel by default. Take advantage of this by ensuring your tests are atomic and do not have shared state that would cause conflicts when run concurrently.
2.  **Use `vi.mock` Efficiently:** Use `vi.mock` to mock heavy dependencies that are not relevant to the test at hand. This can significantly reduce the time it takes to run your tests.
3.  **Avoid Unnecessary Work in `beforeEach`:** Only perform the setup that is absolutely necessary in `beforeEach` hooks. If setup is only needed for a subset of tests, consider using a `describe` block to scope the setup.
4.  **Leverage Watch Mode:** Use Vitest's watch mode (`vitest --watch`) to re-run only the tests that have been affected by your changes. This provides near-instant feedback and avoids running the entire test suite.
5.  **Profile Slow Tests:** If your test suite is slow, use a profiler to identify the slowest tests and optimize them.

## Constraints

- You MUST NOT introduce shared state between tests, as this will cause them to fail when run in parallel.
- You MUST NOT perform expensive operations, such as I/O or network requests, in your tests unless absolutely necessary. Mock these dependencies instead.
- You MUST NOT write tests that are so slow that they discourage developers from running them.
