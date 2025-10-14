---
title: ADR 0001 - Standard Library Loading Strategy
date: 2025-10-12
status: proposed
---

Context
-------

The UMS tooling requires a set of "standard" modules (the standard library) that should be available to persona builds. How that standard library is located, distributed, versioned, and overridden is implementation-defined and affects CLI packaging, offline use, and user upgrade paths.

Decision
--------

Adopt a hybrid approach:

- Bundle a minimal, pinned standard library inside the CLI distribution for offline/bootstrapping use.
- Allow optional external standard library packages (npm package or local directory) to be loaded and override bundled modules.
- Provide a discovery priority: user-configured paths (modules.config.yml) → external package (config/env) → bundled fallback.
- Implement a clear override semantics: by default external/local modules with the same ID will replace bundled ones when `onConflict: replace` is configured; otherwise conflict strategies apply (`warn` or `error`).

Consequences
------------

- Pros: offline-first CLI experience, independent versioning for full libraries, clear override rules.
- Cons: more complex implementation; requires ADR and migration documentation when changing the bundled set.
- Requires CLI-level discovery code and tests; the library (`ums-lib`) remains data-only and receives module objects only.

Notes
-----

1. Implementation layer must expose a command to inspect the bundled standard library (`ums list --standard`).
2. The ADR should be revisited if the distribution model (npm vs GitHub releases) changes.
