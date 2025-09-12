# Process for UMS Module Evaluation

**Version:** 1.1

**Audience:** Human Module Authors, AI Assistants

## 1. Purpose

This document defines the formal process for using the `ums-module-evaluator` agent to validate and receive feedback on new or modified UMS v1.0 instruction modules. Adhering to this process ensures that all modules in the library are compliant, high-quality, and conceptually sound before being integrated.

### 1.1. Key Terms

*   **UMS (Unified Module System):** A specification for creating data-centric, modular, and composable AI instructions.
*   **Module (`.module.yml`):** The atomic unit of the system. A YAML file containing structured, machine-readable instructions.
*   **Conceptual Atomicity:** The principle that a single module should represent a single, indivisible instructional concept.

## 2. Prerequisites

1.  The module(s) to be evaluated must be complete and saved as `.module.yml` files, conforming to the UMS v1.0 specification.
2.  The evaluating agent MUST have access to the `Task` tool with the `ums-module-evaluator` subagent type.

## 3. Evaluation Process

The process consists of four distinct steps: Gather, Formulate, Invoke, and Act. If a step fails, or if the feedback requires significant changes, the process is designed to be iterative.

### Step 1: Gather Module Content

The `ums-module-evaluator` agent operates on text, not file paths. The full, verbatim content of each `.module.yml` file to be evaluated MUST be read into the active context.

**Action:** Use a file reading tool (e.g., `read_many_files`) to load the content of the target module(s).

### Step 2: Formulate the Evaluation Prompt

A structured and specific prompt is critical for receiving high-quality feedback. The prompt MUST be addressed to the `ums-module-evaluator` agent and contain the following sections:

1.  **Statement of Intent:** A clear declaration of the goal (e.g., "Please evaluate the following proposed UMS v1.0 module(s) for compliance and quality.").

2.  **Evaluation Criteria:** A list of the specific aspects the agent should check for. This list MUST include:
    *   UMS v1.0 Schema Compliance
    *   Conceptual Atomicity
    *   Clarity and Correctness of Content
    *   Appropriateness of `id`, `shape`, and `meta.layer`
    *   Integration Potential & Redundancy Check
    *   Suggestions for Improvement

3.  **Module Content:** The full, verbatim content of the module(s) gathered in Step 1. Each module's content should be clearly delineated (e.g., using Markdown code fences with the filename).

### Step 3: Invoke the Evaluator Agent

Invoke the agent using the `Task` tool.

**Action:**

*   Set the `subagent_type` parameter to `'ums-module-evaluator'`.
*   Provide a concise `description` (e.g., "Evaluate proposed UMS module for secure coding.").
*   Use the complete, structured prompt from Step 2 as the value for the `prompt` parameter.

### Step 4: Analyze and Act on Feedback

The evaluator will return a structured report. The author (human or AI) MUST analyze this feedback and take appropriate action.

**Action:**

1.  **Review for Critical Issues:** Check for any findings related to schema non-compliance or major redundancy. These issues MUST be addressed before proceeding.

2.  **Consider Suggestions:** Evaluate all suggestions for improvement, such as ID refinement, shape changes, or content clarification. Implement suggestions that improve the module's quality.

3.  **Make a Final Decision:**
    *   If the module is approved with or without minor changes, the process is complete. Proceed with integration.
    *   If the module has significant issues or is rejected, return to the design phase, implement the required changes, and **restart this process from Step 1** to get the revised version re-evaluated.

---

## 4. Error Handling and Iteration

*   **Agent Failure:** If the `ums-module-evaluator` agent fails to return a response or returns a malformed/unusable response, the invocation (Step 3) should be retried up to two times. If it continues to fail, the process should be halted and the issue reported.
*   **Iterative Evaluation:** This process is inherently iterative. A module may require several cycles of feedback and revision. Do not consider a module finalized until it receives a clear approval from the evaluator.

## 5. Example Evaluation Prompt

Below is a template for a high-quality evaluation prompt.

```text
Please evaluate and validate the following proposed UMS v1.0 module. For the proposal, provide feedback on:
1. UMS v1.0 Schema Compliance
2. Conceptual Atomicity
3. Clarity and Correctness of Content
4. Appropriateness of `id`, `shape`, and `meta.layer`
5. Integration Potential & Redundancy Check
6. Suggestions for Improvement

---

### Proposal: Secure Coding Principles

*   **Proposed ID:** `principle/security/secure-coding-principles`
*   **Proposed Shape:** `specification`
*   **Description:** This module would specify a set of technology-agnostic secure coding standards.

---

### Module Content

```yaml
id: "principle/security/secure-coding-principles"
version: "1.0.0"
schemaVersion: "1.0"
shape: specification
meta:
  name: "Secure Coding Principles"
  description: "A specification outlining fundamental, technology-agnostic security best practices for software development."
  semantic: |
    This module provides a specification of core secure coding principles...
  tags:
    - security
body:
  goal: |
    To ensure that all generated or modified code adheres to fundamental security principles to minimize vulnerabilities.
  constraints:
    - "**Validate All Inputs:** All external data... MUST be validated..."
    - "**Encode All Outputs:** Data sent to interpreters... MUST be properly encoded..."
```

```
