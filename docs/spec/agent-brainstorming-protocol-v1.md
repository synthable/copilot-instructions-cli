# Agent Brainstorming Protocol v1.2

This document provides instructions for an AI agent on how to use a peer "brainstormer" agent to generate a structured set of ideas, alternatives, and risks related to a given concept.

## 1. Core Concept

This protocol enables a single-turn brainstorming session. The calling agent provides an `artifact` (an initial idea or concept), and the brainstormer agent returns a structured `brainstorm` object containing a diverse set of related ideas. This version (v1.2) introduces a formal schema, standardized response structures, and clear error-handling semantics.

### 1.1. Conventions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

## 2. Request Protocol

A valid request is a JSON object conforming to the following structure.

### 2.1. Request Structure

| Field              | Type   | Required? | Description                                                 |
| ------------------ | ------ | --------- | ----------------------------------------------------------- |
| `protocol_version` | String | Yes       | MUST be `"brainstorming-v1.2"`.                             |
| `artifact`         | Object | Yes       | The core concept to brainstorm about.                       |
| `context`          | Array  | No        | Optional array of objects providing supporting information. |

- **`artifact` Object:**
  - `media_type` (string, REQUIRED): The IANA MIME type of the content (e.g., `text/plain`).
  - `content` (any, REQUIRED): The core concept, question, or idea to brainstorm.

### 2.2. Context Semantics

The OPTIONAL `context` array provides guidance for the brainstorming session. Each object in the array is a `ContextItem`.

- **`ContextItem` Object:**
  - `type` (string, REQUIRED): The nature of the context. MUST be one of `constraint`, `preference`, or `data`.
  - `description` (string, REQUIRED): A human-readable explanation of the context.
  - `content` (any, REQUIRED): The contextual data itself.

- **`type` Interpretation:**
  - `constraint`: A hard rule the brainstormer MUST adhere to. Ideas that violate a constraint should not be generated. If constraints are contradictory or unsatisfiable, the agent MUST return an error with code `CONSTRAINTS_UNSATISFIABLE`.
  - `preference`: A soft rule the brainstormer SHOULD try to follow. Ideas that align with a preference may be prioritized.
  - `data`: Supporting data or information for the brainstormer to consider.

## 3. Response Protocol

A valid response is a JSON object conforming to one of two structures based on the `status`.

### 3.1. Success Response (`status: "success"`)

| Field              | Type   | Required? | Description                        |
| ------------------ | ------ | --------- | ---------------------------------- |
| `protocol_version` | String | Yes       | MUST be `"brainstorming-v1.2"`.    |
| `status`           | String | Yes       | MUST be `"success"`.               |
| `brainstorm`       | Object | Yes       | The structured brainstorm payload. |

The `brainstorm` object contains five arrays, each composed of items sharing a standardized base structure.

- **Base `BrainstormItem` Structure:**
  - `id` (string, REQUIRED): A unique identifier for the item.
  - `title` (string, REQUIRED): The primary name or summary of the item.
  - `description` (string, REQUIRED): A more detailed explanation.

- **`brainstorm` Object Fields:**
  - `related_ideas` (Array<BrainstormItem>): Concepts or topics adjacent to the initial artifact.
  - `alternative_approaches` (Array<BrainstormItem & {pros: string[], cons: string[]}>): Different ways to solve the problem.
  - `potential_risks` (Array<BrainstormItem>): Potential pitfalls. The `title` is the risk, and the `description` is the suggested mitigation.
  - `out_of_the_box_ideas` (Array<BrainstormItem>): Unconventional or creative suggestions. The `title` is the idea, and the `description` is the rationale.
  - `next_steps` (Array<BrainstormItem with optional description>): Actionable next steps.

### 3.2. ID Specification

- **Format:** IDs MUST match the regex `^[a-z0-9._-]{8,128}$`.
- **Uniqueness:** IDs MUST be unique within the scope of a single response payload.
- **Stability:** An agent SHOULD attempt to generate stable IDs for the same conceptual item if a request is repeated (e.g., by hashing the item's title). This is not guaranteed.

### 3.3. Error Response (`status: "error"`)

If the request cannot be processed, the agent MUST return an error object.

| Field              | Type   | Required? | Description                                   |
| ------------------ | ------ | --------- | --------------------------------------------- |
| `protocol_version` | String | Yes       | MUST be `"brainstorming-v1.2"`.               |
| `status`           | String | Yes       | MUST be `"error"`.                            |
| `error`            | Object | Yes       | An object containing details about the error. |

- **`error` Object:**
  - `code` (string, REQUIRED): A machine-readable error code.
  - `message` (string, REQUIRED): A human-readable explanation of the error.

- **Baseline Error Codes:**
  - `INVALID_REQUEST`: The request JSON was malformed, failed schema validation, or was missing required fields.
  - `UNSUPPORTED_ARTIFACT`: The `artifact.media_type` is not supported.
  - `CONSTRAINTS_UNSATISFIABLE`: The provided `context` constraints are contradictory or cannot be satisfied.
  - `INTERNAL_ERROR`: A generic, unrecoverable error occurred on the agent's side.

## 4. Formal Protocol Schema (JSON Schema)

The following JSON Schema formally defines the request and response structures.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Agent Brainstorming Protocol v1.2",
  "definitions": {
    "request": {
      "type": "object",
      "properties": {
        "protocol_version": { "const": "brainstorming-v1.2" },
        "artifact": {
          "type": "object",
          "properties": {
            "media_type": { "type": "string", "minLength": 1 },
            "content": {}
          },
          "required": ["media_type", "content"]
        },
        "context": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": { "enum": ["constraint", "preference", "data"] },
              "description": { "type": "string", "minLength": 1 },
              "content": {}
            },
            "required": ["type", "description", "content"]
          }
        }
      },
      "required": ["protocol_version", "artifact"]
    },
    "response": {
      "type": "object",
      "oneOf": [
        { "$ref": "#/definitions/successResponse" },
        { "$ref": "#/definitions/errorResponse" }
      ]
    },
    "baseBrainstormItem": {
      "type": "object",
      "properties": {
        "id": { "type": "string", "pattern": "^[a-z0-9._-]{8,128}$" },
        "title": { "type": "string", "minLength": 1 }
      },
      "required": ["id", "title"]
    },
    "brainstormItem": {
      "allOf": [
        { "$ref": "#/definitions/baseBrainstormItem" },
        {
          "type": "object",
          "properties": {
            "description": { "type": "string", "minLength": 1 }
          },
          "required": ["description"]
        }
      ]
    },
    "nextStepItem": {
      "allOf": [
        { "$ref": "#/definitions/baseBrainstormItem" },
        {
          "type": "object",
          "properties": {
            "description": { "type": "string" }
          }
        }
      ]
    },
    "successResponse": {
      "type": "object",
      "properties": {
        "protocol_version": { "const": "brainstorming-v1.2" },
        "status": { "const": "success" },
        "brainstorm": {
          "type": "object",
          "properties": {
            "related_ideas": {
              "type": "array",
              "items": { "$ref": "#/definitions/brainstormItem" }
            },
            "alternative_approaches": {
              "type": "array",
              "items": {
                "allOf": [
                  { "$ref": "#/definitions/brainstormItem" },
                  {
                    "type": "object",
                    "properties": {
                      "pros": {
                        "type": "array",
                        "items": { "type": "string" }
                      },
                      "cons": { "type": "array", "items": { "type": "string" } }
                    },
                    "required": ["pros", "cons"]
                  }
                ]
              }
            },
            "potential_risks": {
              "type": "array",
              "items": { "$ref": "#/definitions/brainstormItem" }
            },
            "out_of_the_box_ideas": {
              "type": "array",
              "items": { "$ref": "#/definitions/brainstormItem" }
            },
            "next_steps": {
              "type": "array",
              "items": { "$ref": "#/definitions/nextStepItem" }
            }
          },
          "required": [
            "related_ideas",
            "alternative_approaches",
            "potential_risks",
            "out_of_the_box_ideas",
            "next_steps"
          ]
        }
      },
      "required": ["protocol_version", "status", "brainstorm"]
    },
    "errorResponse": {
      "type": "object",
      "properties": {
        "protocol_version": { "const": "brainstorming-v1.2" },
        "status": { "const": "error" },
        "error": {
          "type": "object",
          "properties": {
            "code": { "type": "string", "minLength": 1 },
            "message": { "type": "string", "minLength": 1 }
          },
          "required": ["code", "message"]
        }
      },
      "required": ["protocol_version", "status", "error"]
    }
  }
}
```

## 5. Example Usage

### Step 1: Construct Request

**`request.json`**

```json
{
  "protocol_version": "brainstorming-v1.2",
  "artifact": {
    "media_type": "text/plain",
    "content": "Initial idea: A knowledge activation component for UMS."
  },
  "context": [
    {
      "type": "constraint",
      "description": "The solution must not require a new top-level UMS component.",
      "content": "The user prefers extending existing components over adding new ones."
    }
  ]
}
```

### Step 2: Execute Command

```bash
cat request.json | opencode run --agent brainstormer --format json
```

### Step 3: Interpret Response

**Example `success` response:**

```json
{
  "protocol_version": "brainstorming-v1.2",
  "status": "success",
  "brainstorm": {
    "related_ideas": [
      {
        "id": "idea-context-injection-01",
        "title": "Dynamic Context Injection",
        "description": "Instead of activating knowledge, dynamically inject small, relevant context snippets at different stages of a task."
      }
    ],
    "alternative_approaches": [
      {
        "id": "alt-modal-component-01",
        "title": "Modal Knowledge Component",
        "description": "Extend the existing KnowledgeComponent with a 'mode' field ('define' vs. 'activate') to handle both teaching and priming.",
        "pros": [
          "No new component type needed",
          "Keeps related logic together"
        ],
        "cons": [
          "May overload the component's purpose",
          "More complex validation logic"
        ]
      }
    ],
    "potential_risks": [
      {
        "id": "risk-hallucination-01",
        "title": "Model Hallucination on Activation",
        "description": "To mitigate, include strong verification criteria in a subsequent InstructionComponent to validate the model's output against expected outcomes."
      }
    ],
    "out_of_the_box_ideas": [
      {
        "id": "oob-runtime-probe-01",
        "title": "Runtime Knowledge Probing",
        "description": "Create a 'probe' mechanism where the agent can ask the LLM if it knows a concept before deciding whether to send a 'define' or 'activate' prompt. This makes the decision dynamic."
      }
    ],
    "next_steps": [
      {
        "id": "next-prototype-rfc-01",
        "title": "Draft an RFC for the 'Modal Knowledge Component' approach.",
        "description": "This will allow for a direct, formal comparison against other proposals."
      }
    ]
  }
}
```
