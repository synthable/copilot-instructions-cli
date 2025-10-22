# Agent Feedback Protocol v1.2

## 1. Overview

This document specifies the Agent Feedback Protocol, a machine-to-machine communication protocol for an AI agent (the "Requester" or Agent A) to obtain qualitative, holistic feedback on an artifact from a peer agent (the "Provider" or Agent B).

The protocol is designed for iterative refinement of artifacts such as plans, ideas, specifications, or code. It is not a pass/fail validation mechanism but a tool for generating structured, actionable insights.

Keywords `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` in this document are to be interpreted as described in RFC 2119.

## 2. Session and Transport

### 2.1. Session Management

Session management is the responsibility of the transport layer tool (e.g., `opencode`), not the agent protocol. Agent-level JSON payloads defined in this specification `MUST NOT` include tool-managed session fields. Session state is maintained externally by the tool.

- A unique `sessionID` (string, camelCase) identifies a conversation. This `sessionID` `MUST` be managed by the tool layer.
- On a first request, the tool initiates a session and `MUST` include the `sessionID` in its wrapper response to the Requester.
- For all subsequent requests in a session, the Requester `MUST` supply this `sessionID` to the tool via the appropriate mechanism (e.g., `opencode run --session <sessionID>`).
- Agents `MUST` use the `iteration` field for sequencing and rely on the tool to provide session history and context.

**Note on naming convention**: The canonical field name for the session identifier is `sessionID` (camelCase). Tools `SHOULD` use this exact naming in wrapper responses. Agent implementations `MUST NOT` create or include any session-related fields (such as `sessionID`, `session_id`, or similar variants) in the agent-level Request or Response Object payloads.

### 2.2. Transport Binding: Standard I/O Stream

This is the primary binding for CLI-based agent interaction.

- The Requester `SHALL` invoke the Provider via a CLI command (e.g., `opencode run --agent <provider> --format json`).
- The Requester `SHALL` write the complete Request Object JSON to the standard input (`stdin`) of the Provider's process.
- The Provider `SHALL` write the complete Response Object JSON to its standard output (`stdout`).
- The tool layer `SHALL` wrap the Provider's response in a multi-part JSON stream sent to the Requester's `stdout`. The Requester `MUST` parse this stream to find the `type: "text"` message and extract the agent's response from the `part.text` field.

#### 2.2.1. Stream Framing

Tool implementations `SHOULD` use newline-delimited JSON (NDJSON): each complete JSON object on a single line terminated by `\n`, emitted and processed sequentially.

**Wrapper Message Structure:**

| Field       | Type   | Presence   | Description                                                      |
| :---------- | :----- | :--------- | :--------------------------------------------------------------- |
| `type`      | string | `REQUIRED` | Message type: `step_start`, `text`, or `step_finish`             |
| `timestamp` | number | `REQUIRED` | Unix milliseconds                                                |
| `sessionID` | string | `REQUIRED` | Session identifier                                               |
| `part`      | object | `REQUIRED` | Type-specific payload                                            |

**Typical Message Sequence:**

1. **`step_start`**: Processing begins (metadata in `part`)
2. **`text`**: Agent Response Object JSON-encoded in `part.text` (per RFC 8259 §7)
3. **`step_finish`**: Processing complete (includes `cost`, `tokens` in `part`)

**Agent Response Extraction:** Parse NDJSON stream, find message where `type === "text"`, extract and JSON-parse `part.text` field.

**Stream Termination:** When `step_finish` received, process exits, or stream closes. Unknown message types `SHOULD` be ignored.

## 3. Request Object (Agent Payload)

The Requester `SHALL` send a single JSON object with the following structure:

| Field              | Type   | Presence   | Description                                                                                                         |
| :----------------- | :----- | :--------- | :------------------------------------------------------------------------------------------------------------------ |
| `protocol_version` | string | `REQUIRED` | The version of the protocol. `MUST` be `"1.2"`.                                                                     |
| `iteration`        | number | `REQUIRED` | The turn number of the request, starting at `1` and incremented by the Requester for each new request in a session. |
| `artifact`         | object | `REQUIRED` | The object containing the content to be reviewed.                                                                   |
| `applied_feedback` | object | `OPTIONAL` | An object detailing which feedback from the previous turn was applied. `SHOULD` be present if `iteration > 1`.      |

### 3.1. The `artifact` Object

| Field          | Type   | Presence   | Description                                                                                            |
| :------------- | :----- | :--------- | :----------------------------------------------------------------------------------------------------- |
| `media_type`   | string | `REQUIRED` | The nature of the content, specified as an IANA MIME type (e.g., `text/markdown`, `application/json`). |
| `content`      | any    | `REQUIRED` | The document, idea, or code snippet to be reviewed.                                                    |
| `artifact_ref` | string | `OPTIONAL` | A unique identifier for the artifact's version (e.g., a Git commit hash or a file checksum).           |

### 3.2. The `applied_feedback` Object

This object communicates Agent A's decisions regarding the feedback from the previous turn.

| Field   | Type  | Presence   | Description                                                           |
| :------ | :---- | :--------- | :-------------------------------------------------------------------- |
| `items` | array | `REQUIRED` | An array of objects, each representing a decision on a feedback item. |

#### 3.2.1. `applied_feedback` Item Structure

| Field         | Type   | Presence   | Description                                                                                                 |
| :------------ | :----- | :--------- | :---------------------------------------------------------------------------------------------------------- |
| `id`          | string | `REQUIRED` | The `id` of the feedback item from the previous turn.                                                       |
| `status`      | string | `REQUIRED` | The agent's decision. `MUST` be one of `accepted`, `rejected`, `partial`.                                   |
| `reason_code` | string | `OPTIONAL` | A machine-readable reason for the status. `RECOMMENDED` for `rejected`. E.g., `out_of_scope`, `infeasible`. |
| `explanation` | string | `OPTIONAL` | A brief, human-readable explanation for the decision. `RECOMMENDED` for `rejected` and `partial` statuses.  |

**Status value semantics:**

- `accepted`: The feedback item was fully implemented as recommended. The artifact now reflects the suggested change.
- `rejected`: The feedback item was not implemented. The agent decided not to apply this suggestion (reason should be provided via `reason_code` and/or `explanation`).
- `partial`: The feedback item was implemented with modifications, or only some aspects of the recommendation were applied. This status indicates the agent took action informed by the feedback but did not follow the recommendation exactly. An `explanation` describing what was changed and why is `RECOMMENDED`.

**Example partial status scenarios:**
- A recommendation to "add detailed documentation for all 10 functions" where only 5 functions were documented
- A suggestion to "use async/await syntax" where the agent used Promises instead for compatibility reasons
- A recommendation with multiple sub-points where only some were applicable or implemented

## 4. Response Object (Agent Payload)

The Provider `SHALL` return a single JSON object with the following top-level structure:

| Field                  | Type   | Presence                                                     | Description                                                                   |
| :--------------------- | :----- | :----------------------------------------------------------- | :---------------------------------------------------------------------------- |
| `protocol_version`     | string | `REQUIRED`                                                   | The version of the protocol. `MUST` be `"1.2"`.                               |
| `iteration`            | number | `REQUIRED`                                                   | The echoed `iteration` number from the request.                               |
| `status`               | string | `REQUIRED`                                                   | The status of the feedback generation. `MUST` be either `success` or `error`. |
| `feedback`             | object | `CONDITIONAL` - Present if status is `success`               | The structured feedback payload.                                              |
| `applied_feedback_ack` | object | `CONDITIONAL` - Present if `applied_feedback` was in request | An acknowledgement of the feedback decisions received.                        |
| `error`                | object | `CONDITIONAL` - Present if status is `error`                 | A structured object describing the error.                                     |

### 4.1. The `feedback` Object

This object contains the full, qualitative assessment.

| Field                   | Type   | Presence   | Description                                                               |
| :---------------------- | :----- | :--------- | :------------------------------------------------------------------------ |
| `confidence`            | object | `REQUIRED` | An object containing the provider's confidence in the overall feedback.   |
| `positive_points`       | array  | `REQUIRED` | An array of objects detailing aspects that were done well.                |
| `areas_for_improvement` | array  | `REQUIRED` | An array of objects detailing aspects that could be improved.             |
| `general_summary`       | string | `REQUIRED` | A high-level, qualitative summary of the overall quality of the artifact. |

#### 4.1.1. The `confidence` Object

| Field           | Type   | Presence   | Description                                                             |
| :-------------- | :----- | :--------- | :---------------------------------------------------------------------- |
| `level`         | string | `REQUIRED` | `MUST` be one of `high`, `medium`, or `low`.                            |
| `justification` | string | `REQUIRED` | A brief explanation for the confidence level, especially if not `high`. |

#### 4.1.2. `positive_points` Array Items

| Field           | Type   | Presence   | Description                                                                   |
| :-------------- | :----- | :--------- | :---------------------------------------------------------------------------- |
| `aspect`        | string | `REQUIRED` | A specific part of the artifact that is good (e.g., "Efficiency", "Clarity"). |
| `justification` | string | `REQUIRED` | An explanation of why this aspect is good and `SHOULD` be preserved.          |

#### 4.1.3. `areas_for_improvement` Array Items

| Field            | Type   | Presence   | Description                                                                             |
| :--------------- | :----- | :--------- | :-------------------------------------------------------------------------------------- |
| `id`             | string | `REQUIRED` | A unique, stable identifier for the feedback item. `MUST` match `^[a-z0-9._-]{8,128}$`. |
| `aspect`         | string | `REQUIRED` | A specific part of the artifact that could be improved.                                 |
| `description`    | string | `REQUIRED` | An explanation of why the aspect is problematic or could be better.                     |
| `recommendation` | string | `REQUIRED` | A concrete, actionable suggestion for how to improve it.                                |

### 4.2. The `error` Object

This object provides structured information about a failure.

| Field     | Type   | Presence   | Description                                |
| :-------- | :----- | :--------- | :----------------------------------------- |
| `code`    | string | `REQUIRED` | A machine-readable error code.             |
| `message` | string | `REQUIRED` | A human-readable explanation of the error. |

**Baseline Error Codes:**

- `INVALID_REQUEST`: The request JSON was malformed or missing required fields.
- `UNSUPPORTED_MEDIA_TYPE`: The `artifact.media_type` is not supported by the provider.
- `INTERNAL_ERROR`: A generic, unrecoverable error occurred on the provider side.

### 4.3. The `applied_feedback_ack` Object

This object confirms that the provider has processed Agent A's decisions.

| Field   | Type  | Presence   | Description                                                                        |
| :------ | :---- | :--------- | :--------------------------------------------------------------------------------- |
| `items` | array | `REQUIRED` | An array of objects, one for each item in the request's `applied_feedback` object. |

#### 4.3.1. `applied_feedback_ack` Item Structure

| Field               | Type   | Presence   | Description                                       |
| :------------------ | :----- | :--------- | :------------------------------------------------ |
| `id`                | string | `REQUIRED` | The `id` of the feedback item being acknowledged. |
| `processing_status` | string | `REQUIRED` | `MUST` be one of `acknowledged` or `unknown_id`.  |

## 5. Example Payloads

### 5.1. Example First Request (`iteration: 1`)

```json
{
  "iteration": 1,
  "artifact": {
    "media_type": "text/plain",
    "content": "Add a 'dark mode' to the user interface."
  }
}
```

### 5.2. Example Tool Response (NDJSON Stream & Agent Response)

**Tool wrapper stream (NDJSON format, three messages):**

```json
{"type":"step_start","timestamp":1761021546015,"sessionID":"ses_abc123","part":{"id":"prt_001","sessionID":"ses_abc123","messageID":"msg_001","type":"step-start","snapshot":"abc123"}}
{"type":"text","timestamp":1761021546835,"sessionID":"ses_abc123","part":{"id":"prt_002","sessionID":"ses_abc123","messageID":"msg_001","type":"text","text":"{\"protocol_version\":\"1.2\",\"iteration\":1,\"status\":\"success\",\"feedback\":{\"confidence\":{\"level\":\"medium\",\"justification\":\"Confidence is medium because the idea is high-level and lacks implementation details.\"},\"positive_points\":[{\"aspect\":\"User Experience\",\"justification\":\"This is a highly requested feature that improves accessibility and user comfort.\"}],\"areas_for_improvement\":[{\"id\":\"scope-definition-lacks-detail-01\",\"aspect\":\"Scope Definition\",\"description\":\"The idea doesn't specify which parts of the UI will support dark mode.\",\"recommendation\":\"Create a more detailed specification or plan that lists the components to be updated.\"}],\"general_summary\":\"This is a valuable feature idea, but it requires more detailed planning before implementation.\"}}","time":{"start":1761021546834,"end":1761021546834}}}
{"type":"step_finish","timestamp":1761021546887,"sessionID":"ses_abc123","part":{"id":"prt_003","sessionID":"ses_abc123","messageID":"msg_001","type":"step-finish","snapshot":"abc123","cost":0,"tokens":{"input":100,"output":200}}}
```

**Agent Response Object (extracted from the `text` message's `part.text` field, formatted for readability):**

```json
{
  "protocol_version": "1.2",
  "iteration": 1,
  "status": "success",
  "feedback": {
    "confidence": {
      "level": "medium",
      "justification": "Confidence is medium because the idea is high-level and lacks implementation details."
    },
    "positive_points": [
      {
        "aspect": "User Experience",
        "justification": "This is a highly requested feature that improves accessibility and user comfort."
      }
    ],
    "areas_for_improvement": [
      {
        "id": "scope-definition-lacks-detail-01",
        "aspect": "Scope Definition",
        "description": "The idea doesn't specify which parts of the UI will support dark mode.",
        "recommendation": "Create a more detailed specification or plan that lists the components to be updated."
      }
    ],
    "general_summary": "This is a valuable feature idea, but it requires more detailed planning before implementation."
  }
}
```

### 5.3. Example Follow-up Request (`iteration: 2`)

```json
{
  "protocol_version": "1.2",
  "iteration": 2,
  "artifact": {
    "media_type": "text/markdown",
    "content": "## Dark Mode Spec\n- The main toolbar will be updated..."
  },
  "applied_feedback": {
    "items": [
      {
        "id": "scope-definition-lacks-detail-01",
        "status": "accepted",
        "explanation": "Added detailed component list specifying all UI elements that will support dark mode."
      },
      {
        "id": "accessibility-concerns-02",
        "status": "partial",
        "explanation": "Implemented contrast ratio requirements for most components. Deferred icon color adjustments pending design review."
      },
      {
        "id": "performance-impact-03",
        "status": "rejected",
        "reason_code": "out_of_scope",
        "explanation": "Performance profiling is outside the scope of this specification document."
      }
    ]
  }
}
```

## 6. Versioning and Extensibility

This specification follows Semantic Versioning. The version is indicated by the `protocol_version` field in the response.

Providers `MAY` add custom, non-standard fields to objects for local use. To avoid collisions, these fields `MUST` be prefixed with `x-` (e.g., `"x-provider-name": "example-provider"`).
