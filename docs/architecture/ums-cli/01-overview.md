# CLI: Architectural Overview

**Author:** Gemini
**Date:** 2025-10-10

## 1. Introduction

The `ums-cli` is a command-line interface for composing, managing, and building modular AI assistant instructions using the Unified Module System (UMS) v1.0. It serves as the primary user-facing tool for interacting with the UMS ecosystem.

## 2. Architectural Role: The Imperative Shell

This CLI package is the **"Imperative Shell"** that complements the **"Functional Core"** provided by the `ums-lib` package. Its primary architectural responsibility is to handle all side effects, including:

*   **User Interaction:** Parsing command-line arguments and options.
*   **File System Operations:** Reading module and persona files from disk.
*   **Console Output:** Displaying progress indicators, results, and error messages to the user.
*   **Process Management:** Exiting with appropriate status codes.

By isolating these side effects, the `ums-cli` allows the `ums-lib` to remain pure, platform-agnostic, and highly reusable.

## 3. Core Features

The CLI provides the following key features, each corresponding to a command:

*   **Build:** Compiles a `.persona.ts` file and its referenced modules into a single Markdown instruction document.
*   **List:** Lists all discoverable UMS modules, with options for filtering by tier.
*   **Search:** Searches for modules by keyword across their name, description, and tags.
*   **Validate:** Validates the syntax and integrity of module and persona files against the UMS v2.0 specification.
*   **Inspect:** Provides tools for inspecting the module registry, including conflict detection and source analysis.
