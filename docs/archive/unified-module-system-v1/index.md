# AI Persona Builder: Documentation

Welcome to the documentation for the AI Persona Builder's Unified Module System (UMS). This guide explains the core concepts you will need to understand to author modules and build powerful, specialized AI personas.

## Core Concepts

This section covers the foundational philosophy and the primary components of the system.

- **[1. Core Philosophy: Instructions as Code](../01-core-philosophy.md)**
  - An introduction to the UMS, explaining the shift from traditional prose-based prompts to a data-centric system where AI instructions are treated as structured, version-controlled code.

- **[2. The Module Definition File (`.module.yml`)](../02-module-definition-file.md)**
  - A detailed look at the atomic unit of the system: the `.module.yml` file. This document explains its purpose as the source of truth for a module's identity, metadata, and instructional content.

- **[3. The Module Identifier (ID)](../03-module-identifier.md)**
  - An explanation of the module `id`, the standard, machine-readable identifier for every module. This document details the mandatory `tier/subject/module-name` structure and its role in providing a unique identity and a hierarchical namespace.

- **[4. Authoring the Module Body: The 7 Directives](./04-authoring-the-body.md)**
  - A guide to the instructional core of a module: the `body` block. This document introduces the seven standard "Directive Blocks" (`goal`, `process`, `constraints`, etc.) that authors use to compose the module's content.

- **[5. Writing Module Content: Machine-Centric Language](../05-machine-centric-language.md)**
  - The foundational style guide for all instructional content. This document explains the principles of writing deterministic, precise, and unambiguous language that is optimized for machine interpretation, including the formal use of RFC 2119 keywords (`MUST`, `SHOULD`).

- **[6. The Persona Definition File (`persona.yml`)](../06-persona-definition-file.md)**
  - An introduction to the `persona.yml` file, the "recipe" used to compose modules into a final, executable AI persona. This document explains the `moduleGroups` structure for organizing and sequencing modules.

## Customization and Advanced Topics

This section covers how to extend the standard library and combine modules to create sophisticated behaviors.

- **[7. Module Composition: Synergistic Pairs & Bundled Modules](./07-module-composition.md)**
  - A deep dive into the two primary patterns for combining instructional concepts. This document explains **Synergistic Pairs** (sequencing separate, atomic modules in a persona for cooperative behavior) and **Bundled Modules** (creating a single module with multiple, tightly-coupled directives).

- **[8. Using Local Modules (`modules.config.yml`)](../08-using-local-modules.md)**
  - A practical guide explaining how to use your own custom modules in a project. This document introduces the `modules.config.yml` file and details the powerful `onConflict` strategies (`replace` and `merge`) for controlling how your local modules interact with the standard library.

- **[9. Module Resolution and Scopes](../09-module-resolution.md)**
  - A more technical explanation of how the build tool finds and loads modules. This document details the two scopes—the **Standard Library Scope** and the **Local Scope**—and explains the order of precedence that allows local modules to override or extend standard ones.

- **[10. System Modes: Static vs. Dynamic Composition](../10-system-modes.md)**
  - An overview of the two primary ways the module library can be used. This document explains the difference between **Static Compilation** (using the CLI to build a predictable, production-ready persona) and **Dynamic Synthesis** (an AI-driven system composing modules on-the-fly for interactive applications).
