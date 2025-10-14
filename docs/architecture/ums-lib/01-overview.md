# Architectural Overview of ums-lib

**Author:** Gemini
**Date:** 2025-10-10

## 1. Introduction

The `ums-lib` package is a reusable, platform-agnostic library that provides a pure functional implementation of the Unified Module System (UMS) v2.0 specification. It serves as the core engine for parsing, validating, resolving, and rendering modular AI instructions.

## 2. Core Philosophy

The library's design is centered on a core philosophy of being a **pure data transformation engine**. It is completely decoupled from the file system and has no Node.js-specific dependencies. This allows it to be used in any JavaScript environment, including Node.js, Deno, and modern web browsers.

The calling application is responsible for all I/O operations, such as reading files. The `ums-lib` operates exclusively on string content and JavaScript objects, ensuring predictable and deterministic behavior.

## 3. Architectural Goals

The primary architectural goals for `ums-lib` are:

*   **Platform Independence:** The library must operate in any JavaScript environment without platform-specific code.
*   **Pure Functional Design:** Core operations are implemented as pure functions with no side effects, enhancing testability and predictability.
*   **UMS v2.0 Compliance:** The library must fully implement the UMS v2.0 specification for modules, personas, and rendering.
*   **Developer Experience:** Provide clear, well-documented APIs with comprehensive TypeScript types and error messages.

## 4. High-Level Design

The architecture follows the **"Functional Core, Imperative Shell"** pattern. The `ums-lib` itself is the functional core, providing pure functions for all its operations. The consuming application (in this case, `copilot-instructions-cli`) acts as the imperative shell, handling side effects like file I/O and console output.

This separation of concerns is a key architectural strength, ensuring the library remains reusable and easy to test in isolation.
