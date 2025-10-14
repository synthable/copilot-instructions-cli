---
title: ADR 0002 - Dynamic TypeScript Loading (tsx) and Fallbacks
date: 2025-10-12
status: proposed
---

Context
-------

The CLI implementation needs to load `.module.ts` and `.persona.ts` files. Options include on-the-fly execution using `tsx`, pre-compilation to `.js`, or requiring users to provide compiled artifacts.

Decision
--------

1. Primary strategy: provide a CLI loader that uses `tsx` for development and convenience. It will be the default in developer environments and when `tsx` is available.
2. Fallback strategy: when `tsx` is not available or when running in constrained environments (CI, locked runtimes), the CLI will prefer precompiled `.js` artifacts. The CLI will search for compiled output adjacent to the `.ts` file (same basename + `.js`) before attempting `tsx`.
3. The library (`ums-lib`) must not depend on `tsx` or any runtime loader; it only accepts module objects and strings.

Consequences
------------

- Pros: developer convenience without forcing `tsx` as a build-time-only dependency; deterministic fallback for CI.
- Cons: increased complexity in loader and a requirement to test both loader paths.

Implementation notes
--------------------

- The CLI must provide clear error messages when an expected export is missing and document `moduleIdToExportName` conventions.
- Add loader tests in `packages/copilot-instructions-cli` for both `tsx` and precompiled `.js` flows.
