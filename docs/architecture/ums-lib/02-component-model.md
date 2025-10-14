# UMS Library: Component Model

**Author:** Gemini
**Date:** 2025-10-10

## 1. Introduction

The `ums-lib` package is designed with a clear, domain-driven structure. Its functionality is divided into five core components, each with a single, well-defined responsibility. This component-based architecture enhances modularity, cohesion, and maintainability.

## 2. Core Components

The library is organized into the following five core functional domains:

1.  **Parsing**: Responsible for converting raw TypeScript module content into typed JavaScript objects.
2.  **Validation**: Ensures that the parsed objects comply with the UMS v2.0 specification.
3.  **Resolution**: Handles module dependency resolution.
4.  **Rendering**: Generates the final Markdown output from personas and modules.
5.  **Registry**: Provides a conflict-aware mechanism for storing and retrieving modules.

### 2.1 Parsing Component

*   **Location:** `packages/ums-lib/src/core/parsing/`
*   **Responsibility:** To parse and validate the basic structure of TypeScript content into UMS module and persona objects.
*   **Key Functions:**
    *   `parseModule(content: string): Module`: Parses TypeScript content into a `Module` object, throwing an error if the content is not valid.
    *   `parsePersona(content: string): Persona`: Parses TypeScript content into a `Persona` object.

### 2.2 Validation Component

*   **Location:** `packages/ums-lib/src/core/validation/`
*   **Responsibility:** To perform deep validation of module and persona objects against the UMS v2.0 specification.
*   **Key Functions:**
    *   `validateModule(data: unknown): ValidationResult`: Validates a raw JavaScript object against the UMS module schema.
    *   `validatePersona(data: unknown): ValidationResult`: Validates a raw JavaScript object against the UMS persona schema.

### 2.3 Resolution Component

*   **Location:** `packages/ums-lib/src/core/resolution/`
*   **Responsibility:** To resolve module references within a persona and manage dependencies.
*   **Key Functions:**
    *   `resolvePersonaModules(persona: Persona, modules: Module[]): ModuleResolutionResult`: Resolves all modules referenced in a persona.
    *   `validateModuleReferences(persona: Persona, registry: Map<string, Module>): ValidationResult`: Validates that all module references in a persona exist in a given registry.

### 2.4 Rendering Component

*   **Location:** `packages/ums-lib/src/core/rendering/`
*   **Responsibility:** To render the final, compiled instruction set into a Markdown document.
*   **Key Functions:**
    *   `renderMarkdown(persona: Persona, modules: Module[]): string`: Renders a complete persona with its modules into a single Markdown string.
    *   `generateBuildReport(...)`: Generates a JSON build report with metadata about the build process.

### 2.5 Registry Component

*   **Location:** `packages/ums-lib/src/core/registry/`
*   **Responsibility:** To provide a conflict-aware storage and retrieval mechanism for UMS modules.
*   **Key Class:**
    *   `ModuleRegistry`: A class that can store multiple modules with the same ID and resolve conflicts based on a configured strategy (`error`, `warn`, or `replace`).
