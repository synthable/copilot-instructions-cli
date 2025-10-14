# UMS Library: Public API Specification

**Author:** Gemini
**Date:** 2025-10-10

## 1. Introduction

This document provides a specification for the public API of the `ums-lib`. The library is designed to be tree-shakable, allowing consumers to import only the specific functionality they need.

## 2. Core API by Domain

### 2.1 Parsing API

*   **Path:** `ums-lib/core/parsing`

*   **`parseModule(content: string): Module`**: Parses TypeScript module content (as a string) into a validated `Module` object.
*   **`parsePersona(content: string): Persona`**: Parses TypeScript persona module content (as a string) into a validated `Persona` object.

### 2.2 Validation API

*   **Path:** `ums-lib/core/validation`

*   **`validateModule(data: unknown): ValidationResult`**: Validates a raw JavaScript object against the UMS module schema.
*   **`validatePersona(data: unknown): ValidationResult`**: Validates a raw JavaScript object against the UMS persona schema.

### 2.3 Resolution API

*   **Path:** `ums-lib/core/resolution`

*   **`resolvePersonaModules(persona: Persona, modules: Module[]): ModuleResolutionResult`**: Resolves all modules for a persona.
*   **`validateModuleReferences(persona: Persona, registry: Map<string, Module>): ValidationResult`**: Validates that all module references in a persona exist in a given registry.

### 2.4 Rendering API

*   **Path:** `ums-lib/core/rendering`

*   **`renderMarkdown(persona: Persona, modules: Module[]): string`**: Renders a complete persona and its modules to a single Markdown string.
*   **`generateBuildReport(...)`: `BuildReport`**: Generates a JSON build report.

### 2.5 Registry API

*   **Path:** `ums-lib/core/registry`

*   **`ModuleRegistry`**: A class for conflict-aware storage and retrieval of modules.
    *   `add(module: Module, source: ModuleSource): void`
    *   `resolve(id: string, strategy?: ConflictStrategy): Module | null`
    *   `getConflicts(id: string): ModuleEntry[] | null`
    *   `getConflictingIds(): string[]`

## 3. Core Types

*   **Path:** `ums-lib/types`

*   **`Module`**: The core interface for a UMS module.
*   **`Persona`**: The core interface for a UMS persona.
*   **`Component`**: The union type for all possible module components (InstructionComponent | KnowledgeComponent | DataComponent).
*   **`ModuleGroup`**: The interface for a group of modules within a persona.
*   **`ValidationResult`**: The return type for validation functions, containing `valid`, `errors`, and `warnings`.

## 4. Error Handling API

*   **Path:** `ums-lib/utils`

*   **`UMSError`**: The base error class for all library errors.
*   **`UMSValidationError`**: A subclass of `UMSError` for validation-specific failures.
*   **`ConflictError`**: A subclass of `UMSError` for module ID conflicts in the registry.
*   **`isUMSError(error: unknown): boolean`**: A type guard to check if an error is an instance of `UMSError`.
