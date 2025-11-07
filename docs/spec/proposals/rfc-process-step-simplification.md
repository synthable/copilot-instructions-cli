# RFC: Simplify the ProcessStep Interface

**Status:** Draft
**Author:** Gemini
**Date:** 2025-11-05
**Version:** 2.0

## Abstract

This RFC proposes simplifying the `ProcessStep` interface within the Unified Module System v2.0 specification. The current interface, while powerful, introduces significant authoring friction and complexity for the most common use cases. We propose a simplified, string-first interface that relies on natural language and markdown for expressiveness, while providing an optional, structured extension for advanced, machine-readable use cases.

## The Problem: Over-specification and Authoring Friction

(Content unchanged from previous version)

## Proposal: A Simplified, Hybrid Approach

We propose simplifying the `ProcessStep` type to be primarily a string, with an optional object form for adding notes.

```typescript
type ProcessStep = string | {
  step: string;
  notes?: string[];
};
```

### Handling Advanced Use Cases

For the rare but important cases requiring machine-readability (e.g., safety-critical flows, automated verification), we propose an optional, separate field: `process_structured`.

```typescript
interface Module {
  // ... existing fields
  process?: ProcessStep[];
  process_structured?: StructuredProcessStep[];
}
```

#### Formal Schema Definition

The `StructuredProcessStep` is defined by the following TypeScript interface and JSON Schema:

**TypeScript Interface:**
```typescript
interface StructuredProcessStep {
  step: string;
  when?: Condition;
  do: Action;
  validate?: ValidationCheck;
}

type Condition = { type: 'file_exists'; path: string; } | { type: 'command_exit_code'; command: string; expected: number; };
type Action = { type: 'command'; command: string; } | { type: 'http_request'; url: string; method: 'GET' | 'POST'; };
type ValidationCheck = { type: 'port_listening'; port: number; } | { type: 'file_contains'; path: string; content: string; };
```

**JSON Schema:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "StructuredProcessStep",
  "type": "object",
  "properties": {
    "step": { "type": "string" },
    "when": { "$ref": "#/definitions/Condition" },
    "do": { "$ref": "#/definitions/Action" },
    "validate": { "$ref": "#/definitions/ValidationCheck" }
  },
  "required": ["step", "do"],
  "definitions": {
    "Condition": { "type": "object", "oneOf": [...] },
    "Action": { "type": "object", "oneOf": [...] },
    "ValidationCheck": { "type": "object", "oneOf": [...] }
  }
}
```
*(Note: `oneOf` arrays are abbreviated for clarity.)*

## Validation Strategy

To clarify responsibilities:

*   **`criteria` (Top-level):** Should be used for module-level or cross-step validation. These are the final success criteria for the entire module.
*   **`process_structured.validate` (Step-local):** Should be used for immediate, step-specific checks that confirm a single action was successful before proceeding.

If a check in `process_structured.validate` is also a final success criterion, it should be defined in `criteria` and referenced by ID.

## Authoring Guidance & Linter Rules

To ensure consistency, we recommend the following conventions, which should be enforced by the linter:

1.  **Rule:** Prefer `string` for single-line steps without notes.
    *   *Fail*: `{ step: "Run tests" }`
    *   *Pass*: `"Run tests: `npm test`"`
2.  **Rule:** Use the `{ step, notes }` object form only when `notes` has one or more entries.
3.  **Rule:** Do not use `when` or `if` clauses in the text of a `process_structured` step; use the `when` field instead.

## Migration & Backward Compatibility

#### Transformation Rules

A reference migration script will be provided to convert legacy `ProcessStep` objects. The script will follow these rules:

*   `step`, `when`, and `do` fields will be combined into a human-readable sentence: `"[step]: If [when], run [do]."`
*   The `validate.check` will be appended: `"Verify that [check]."`
*   A `TODO` comment will be added if the script cannot perform a clean conversion, flagging it for manual review.

#### Deprecation Timeline

1.  **v2.1 (Transition):** Legacy fields are marked `@deprecated`. Tooling emits warnings but remains compatible.
2.  **v2.2 (Warning Period End):** Tooling will fail builds that use legacy fields, requiring migration.
3.  **v3.0 (Removal):** Legacy fields are removed from the specification and types.

## Testing & CI Integration

To support automated verification, the following resources will be provided:

*   **Test Fixtures:** A collection of valid and invalid `StructuredProcessStep` examples.
*   **Validation CLI:** A command-line tool (`ums validate --schema`) to check modules against the formal JSON schema.
*   **CI Example:** A sample GitHub Actions workflow that uses the validation CLI to check all modules in a pull request.

## Request for Feedback

(Content unchanged from previous version)