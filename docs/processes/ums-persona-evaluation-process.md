# Process for UMS Persona Evaluation

**Version:** 1.1

**Audience:** Human Module Authors, AI Assistants

## 1. Purpose

This document defines the formal process for using the `ums-persona-evaluator` agent to validate the quality, coherence, and compliance of a UMS v1.0 persona. This process focuses on the **composition** of modules, ensuring they form an effective and logical whole.

## 2. Prerequisites

1.  A complete `persona.yml` file must exist.
2.  The full content of **every module** referenced in the persona must be accessible.
3.  The evaluating agent MUST have access to the `Task` tool with the `ums-persona-evaluator` subagent type (this may be hypothetical).

## 3. Evaluation Process

The process consists of four distinct steps: Gather, Formulate, Invoke, and Act.

### Step 1: Gather All Required Content

This step is more complex than module evaluation. The evaluator needs both the persona file and the full content of all its constituent modules.

**Action:**

1.  Use a file reading tool to load the content of the target `persona.yml` file.
2.  Use a file reading tool (e.g., `read_many_files`) to load the full, verbatim content of **every module ID** listed in the persona's `moduleGroups`.

### Step 2: Formulate the Evaluation Prompt

A structured prompt is essential. The prompt MUST be addressed to the `ums-persona-evaluator` agent and contain the structure detailed in Appendix A of this document. This includes:

1.  **Objective & Context:** A statement of the goal and the UMS v1.0 specification context (Tiers, Shapes).
2.  **Evaluation Criteria:** The full list of seven criteria (see Appendix A).
3.  **Input Data:** The prompt MUST be populated with the content gathered in Step 1.

### Step 3: Invoke the Evaluator Agent

Invoke the agent using the `Task` tool.

**Action:**

*   Set the `subagent_type` parameter to `'ums-persona-evaluator'`.
*   Provide a concise `description` (e.g., "Evaluate Senior Python Developer persona.").
*   Use the complete, populated prompt from Step 2 as the value for the `prompt` parameter.

### Step 4: Analyze and Act on Feedback

The evaluator will return a structured report (see Appendix B for an example). The author MUST analyze this feedback and take appropriate action.

**Action:**

1.  **Review for Critical Issues:** Check for findings like architectural violations, logical contradictions, or major incompleteness. These MUST be addressed.

2.  **Consider Suggestions:** Evaluate suggestions for improving balance, cohesion, or metadata quality.

3.  **Make a Final Decision:**
    *   If approved, the persona is ready for use.
    *   If issues are found, modify the persona (e.g., by adding, removing, or swapping modules in the `persona.yml` file) and **restart this process from Step 1** to have the new composition re-evaluated.

---

## 4. Error Handling

*   **Agent Failure:** If the `ums-persona-evaluator` agent fails to return a usable response, the invocation (Step 3) should be retried up to two times. If failure persists, halt the process.
*   **Missing Modules:** If the content for a referenced module cannot be gathered in Step 1, the process cannot proceed. The module dependency must be resolved first.

---

## Appendix A: Prompt Template

Use the following template to formulate the prompt for the `ums-persona-evaluator` agent.

```text
**Objective:** Evaluate the following UMS v1.0 persona for quality, coherence, and compliance...

**Evaluation Criteria:**

1.  **UMS v1.0 Compliance**: Does the persona file strictly follow the UMS v1.0 specification... ?
2.  **Module Shape Validity**: Do all referenced modules use valid UMS v1.0 shapes... ?
3.  **Four-Tier Architecture**: Does the module composition respect the Foundation -> Principle -> Technology -> Execution hierarchy?
4.  **Foundation Layer Progression**: For `foundation` modules, are lower layers (0-4) included before higher-layer ones where logical?
5.  **Semantic Cohesion**: Do the persona's `semantic` and `identity` fields accurately represent the composed capabilities of the included modules?
6.  **Logical Coherence**: Do the modules work together without functional contradictions or logical conflicts?
7.  **Completeness & Balance**: Does the persona have an appropriate diversity of module shapes and sufficient coverage for its described role?

**Required Output Format:** ...

**Input Data:** ...
```

## Appendix B: Example Evaluation Output

```markdown
### Executive Summary

The persona is well-structured and compliant but suffers from a critical cohesion conflict between two modules and lacks sufficient modules for its stated purpose.

### Detailed Evaluation

1.  **UMS v1.0 Compliance:** Excellent
2.  **Module Shape Validity:** Excellent
3.  **Four-Tier Architecture:** Good
4.  **Foundation Layer Progression:** Excellent
5.  **Semantic Cohesion:** Needs Improvement
    *   *Justification:* The persona's `semantic` field mentions testing, but no testing modules are included.
6.  **Logical Coherence:** Critical Issue
    *   *Justification:* The persona includes both `principle/testing/test-driven-development` and a hypothetical `execution/testing/write-tests-after-code`, which are contradictory.
7.  **Completeness & Balance:** Needs Improvement
    *   *Justification:* A "Senior Developer" persona should include modules on security and logging, which are missing.

### Specific Recommendations

1.  **[Critical]** Remove one of the contradictory testing modules.
2.  **[High]** Add a security-related module from the `principle` tier.
3.  **[Medium]** Update the `semantic` field to more accurately reflect the final module set.
```

## Appendix C: Example Input

**1. Persona File Content (`[persona_file_name.persona.yml]`):**

```yaml
# Example Structure
name: "Example Persona"
version: "1.0.0"
schemaVersion: "1.0"
description: "A brief description of the persona's role."
semantic: "A dense, keyword-rich paragraph for AI semantic search."
identity: "A description of the persona's identity, voice, and traits."
attribution: true
moduleGroups:
  - groupName: "Core Functionality"
    modules:
      - "foundation/ethics/do-no-harm"
      - "principle/security/secure-coding-principles"
```

**2. Referenced Module Content:**

*(For each module ID listed in the persona, provide the full, verbatim content of the `.module.yml` file, clearly delineated).*

```yaml
# Module: foundation/ethics/do-no-harm
id: "foundation/ethics/do-no-harm"
version: "1.0.0"
schemaVersion: "1.0"
shape: "specification"
meta:
  name: "Do No Harm"
  description: "The fundamental safety and ethical principle."
  semantic: "A core ethical directive to prevent harm..."
  layer: 0
  tags: ["ethics", "safety"]
body:
  goal: "Your primary and non-negotiable goal is to avoid causing harm..."
  constraints:
    - "Do not provide instructions that are illegal, dangerous, or unethical."
---
# Module: principle/security/secure-coding-principles
id: "principle/security/secure-coding-principles"
version: "1.0.0"
# ... and so on for all other modules
```