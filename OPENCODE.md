# Agent Feedback Protocol v1.2 (via OpenCode CLI)

This document provides instructions for an AI agent (Agent A) on how to get qualitative feedback on its work from a peer agent (Agent B) and how to report back on the feedback it applies.

## 1. Core Concept

This protocol enables a multi-turn, closed-loop feedback process. You (Agent A) request feedback on an artifact. A provider (Agent B) gives you suggestions, each with a unique `id`. You then decide which suggestions to implement and report your decisions back in your next request. The decision to accept, partially implement, or reject any piece of feedback is entirely at your discretion. This allows the provider to give more focused, context-aware follow-up feedback.

## 2. How to Use This Protocol

### Step 1: Construct the Initial Feedback Request (`iteration: 1`)

Your first request in a conversation must be a JSON object with `protocol_version`, `iteration: 1`, and the `artifact` you want reviewed.

**Request JSON Structure (First Request):**

```json
{
  "protocol_version": "1.2",
  "iteration": 1,
  "artifact": {
    "media_type": "text/markdown",
    "content": "The document, idea, or code snippet to be reviewed.",
    "artifact_ref": "optional-sha256-or-version-string"
  }
}
```

### Step 2: Execute the `opencode` Command

Pass the JSON request object via stdin. For the first request, do not use the `--session` flag. The `opencode` tool will return a response that includes a `sessionID` in its wrapper.

```bash
cat request.json | opencode run --agent qualitative-reviewer --format json
```

### Step 3: Interpret the Feedback Response

The tool's response is an NDJSON stream (newline-delimited JSON) with three messages. You `MUST` capture the `sessionID` from any message for use in follow-up requests.

**Tool Wrapper Stream (NDJSON format - 3 messages on separate lines):**

```json
{"type":"step_start","timestamp":1761021546015,"sessionID":"ses_abc123","part":{"id":"prt_001","sessionID":"ses_abc123","messageID":"msg_001","type":"step-start","snapshot":"abc123"}}
{"type":"text","timestamp":1761021546835,"sessionID":"ses_abc123","part":{"id":"prt_002","sessionID":"ses_abc123","messageID":"msg_001","type":"text","text":"{\"protocol_version\":\"1.2\",\"iteration\":1,\"status\":\"success\",\"feedback\":{...}}","time":{"start":1761021546834,"end":1761021546834}}}
{"type":"step_finish","timestamp":1761021546887,"sessionID":"ses_abc123","part":{"id":"prt_003","sessionID":"ses_abc123","messageID":"msg_001","type":"step-finish","snapshot":"abc123","cost":0,"tokens":{"input":100,"output":200}}}
```

**To extract the agent's response:**

1. Parse each newline-delimited JSON message sequentially
2. Find the message where `type === "text"`
3. Extract the `part.text` field from this message
4. Parse `part.text` as JSON to obtain the agent Response Object

**Agent Response Object (extracted and parsed from `part.text`):**

```json
{
  "protocol_version": "1.2",
  "iteration": 1,
  "status": "success",
  "feedback": {
    "confidence": {
      "level": "medium",
      "justification": "Explanation of confidence level"
    },
    "positive_points": [
      {
        "aspect": "Aspect Name",
        "justification": "Why this is good"
      }
    ],
    "areas_for_improvement": [
      {
        "id": "improve-scope-definition-01",
        "aspect": "Scope Definition",
        "description": "Explanation of the issue",
        "recommendation": "Create a more detailed specification..."
      }
    ],
    "general_summary": "Overall assessment of the artifact"
  }
}
```

- **Analyze Feedback**: Loop through the `areas_for_improvement` array. For each item, use its `id`, `description`, and `recommendation` to decide on a status for it (`accepted`, `rejected`, or `partial`).

### Step 4: Construct and Execute a Follow-up Request (`iteration > 1`)

After you have updated your artifact based on the feedback, construct a new request to get a follow-up review.

- Increment the `iteration` number.
- Include the `protocol_version`.
- Add the `applied_feedback` object to report your decisions.

**Applied Feedback Status Values:**

- `accepted`: The feedback item was fully implemented as recommended.
- `rejected`: The feedback item was not implemented. Provide a `reason_code` and/or `explanation`.
- `partial`: The feedback item was implemented with modifications, or only some aspects were applied. An `explanation` describing what was changed and why is RECOMMENDED.

**Request JSON Structure (Follow-up Request):**

```json
{
  "protocol_version": "1.2",
  "iteration": 2,
  "artifact": {
    "media_type": "text/markdown",
    "content": "Updated artifact content",
    "artifact_ref": "v2-or-updated-sha"
  },
  "applied_feedback": {
    "items": [
      {
        "id": "improve-scope-definition-01",
        "status": "accepted",
        "explanation": "Added detailed component list specifying all UI elements."
      },
      {
        "id": "accessibility-concerns-02",
        "status": "partial",
        "explanation": "Implemented contrast requirements for most components. Deferred icon adjustments pending design review."
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

- Execute the command again, this time using the `--session` flag with the `sessionID` you captured.

```bash
cat request.json | opencode run --agent qualitative-reviewer --format json --session 'ses_abc123'
```

### Step 5: Interpret the Follow-up Response

The follow-up response will acknowledge your reported decisions within the agent's payload.

**Agent Response Object (Follow-up - extracted from NDJSON stream):**

```json
{
  "protocol_version": "1.2",
  "iteration": 2,
  "status": "success",
  "feedback": {
    "confidence": { ... },
    "positive_points": [ ... ],
    "areas_for_improvement": [ ... ],
    "general_summary": "..."
  },
  "applied_feedback_ack": {
    "items": [
      {
        "id": "improve-scope-definition-01",
        "processing_status": "acknowledged"
      },
      {
        "id": "accessibility-concerns-02",
        "processing_status": "acknowledged"
      },
      {
        "id": "performance-impact-03",
        "processing_status": "acknowledged"
      }
    ]
  }
}
```

- Use the new feedback in the `feedback` object to continue refining your work.

## 3. Key Protocol Details

### Session Management

- **sessionID**: Managed by the tool layer, appears in wrapper messages, NOT in agent payloads
- **First request**: Do not include `--session` flag
- **Subsequent requests**: Always include `--session <sessionID>`
- **Iteration tracking**: Agents use the `iteration` field for sequencing

### Stream Format

- **NDJSON**: Each message is a complete JSON object on a single line terminated by `\n`
- **Message sequence**: `step_start` → `text` → `step_finish`
- **Agent response location**: In the `part.text` field of the `type: "text"` message
- **Encoding**: Agent response is JSON-encoded as a string (per RFC 8259 §7)

### Error Handling

If the agent cannot process your request, it will return an error response:

```json
{
  "protocol_version": "1.2",
  "iteration": 1,
  "status": "error",
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Explanation of the error"
  }
}
```

**Baseline Error Codes:**

- `INVALID_REQUEST`: Malformed JSON or missing required fields
- `UNSUPPORTED_MEDIA_TYPE`: The artifact media type is not supported
- `INTERNAL_ERROR`: An unrecoverable error occurred
