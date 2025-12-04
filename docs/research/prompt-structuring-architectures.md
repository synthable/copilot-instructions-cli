# UMS Prompt Structuring Architectures: Comprehensive Analysis Report

**Date:** January 15, 2025
**Context:** Unified Module System (UMS) v2.1 / v2.2
**Subject:** Compilation Strategies for System Prompts

---

## 1. Executive Summary

This report analyzes ten distinct strategies for compiling UMS modules into a single Large Language Model (LLM) system prompt. The central challenge is converting a set of discrete, structured modules into a linear token stream that maximizes the model's **Recall** (finding information), **Integration** (synthesizing information), and **Adherence** (following rules).

Our analysis indicates that simple linear concatenation (Author Order) is insufficient for complex tasks. The optimal strategy requires manipulating the prompt structure to exploit specific LLM behaviors, such as **Primacy Bias** (paying attention to the start), **Recency Bias** (paying attention to the end), and **Data Locality** (keeping related concepts adjacent).

---

## 2. Taxonomy of Strategies

We categorize the ten strategies into four architectural families:

1.  **Static Structural:** Sorting based on metadata (Level, Module, or Dependency).
2.  **Functional/Hybrid:** Sorting based on the utility of the component (Rule vs. Action).
3.  **Psychological/Attention:** Structures designed to exploit LLM attention mechanisms.
4.  **Dynamic:** Structures that change based on the specific user query.

---

## 3. Detailed Analysis

### Family A: Static Structural Strategies

#### 1. Cognitive Hierarchy (Hypothesis A)
*   **Concept:** Deconstructs all modules and reorganizes components globally by their `CognitiveLevel`.
*   **Structure:**
    1.  **Level 2 Section:** All Principles from all modules.
    2.  **Level 3 Section:** All Concepts from all modules.
    3.  **Level 4 Section:** All Procedures from all modules.
    4.  **Level 5 Section:** All Specifications from all modules.
*   **Mechanism:** Explicitly models the "Hierarchy of Thought," forcing the model to ingest high-level rules before low-level details.
*   **Pros:** Strong Global Governance; easy to scan for humans.
*   **Cons:** **High Semantic Distance.** A procedure in Section 3 is separated from its specifications in Section 5 by potentially thousands of tokens, leading to integration failures (hallucinations).

#### 2. Module Cohesion (Hypothesis B)
*   **Concept:** Treats the Module as the atomic unit of rendering.
*   **Structure:**
    1.  **Module A Block:** (Principles $\to$ Concepts $\to$ Procedures $\to$ Specs).
    2.  **Module B Block:** (Principles $\to$ Concepts $\to$ Procedures $\to$ Specs).
*   **Mechanism:** Maximizes **Data Locality**. All information required to execute a specific domain task is contiguous in the context window.
*   **Pros:** Excellent for Synthesis and Integration tasks; reduces "variable lookup" errors.
*   **Cons:** **Weak Global Governance.** Critical safety constraints buried in "Module B" may be overpowered by instructions in "Module A" or lost due to attention drift.

#### 3. Author Order (Hypothesis C)
*   **Concept:** Renders modules and components exactly as listed in the source files.
*   **Structure:** Linear FIFO (First-In, First-Out).
*   **Mechanism:** Relies on the human author's intuition for narrative flow.
*   **Pros:** Lowest implementation complexity; preserves author intent.
*   **Cons:** **Unpredictable.** Performance varies wildly based on the author's skill. No systematic optimization for LLM attention heads.

#### 4. Topological Sort (Dependency-Based)
*   **Concept:** Orders modules based on a directed acyclic graph (DAG) of dependencies.
*   **Structure:**
    1.  **Base Layer:** Modules with no dependencies (e.g., `foundation`).
    2.  **Dependent Layer:** Modules that import the Base (e.g., `auth`).
    3.  **Leaf Layer:** Modules that import the Dependent (e.g., `login-feature`).
*   **Mechanism:** Mimics software compilation. Ensures a concept is defined before it is referenced.
*   **Pros:** Prevents "Forward Reference" hallucinations; logical consistency.
*   **Cons:** Requires an external dependency graph tool (planned for UMS v2.1 via ADR-0008); does not solve the Governance vs. Locality trade-off.

---

### Family B: Functional & Hybrid Strategies

#### 5. The Hybrid / Constitutional (Hypothesis D)
*   **Concept:** A "Layered Cake" approach combining Global Governance with Local Execution.
*   **Structure:**
    1.  **Zone 0 (Constitution):** All Level 0-2 (Ethics/Principles) from *all* modules.
    2.  **Zone 1 (Execution):** Remaining components (Levels 3-5) grouped by Module.
*   **Mechanism:** Leverages **Primacy Bias** for rules (System 2 thinking) and **Data Locality** for actions (System 1 thinking).
*   **Pros:** The theoretical optimum for general-purpose agents. Balances safety with capability.
*   **Cons:** Slightly higher build complexity (requires splitting modules during render).

#### 6. Atomic / Interleaved (UMS v3.0)
*   **Concept:** Sorts components by **Function** rather than Module or Level. Requires breaking `Instruction` and `Knowledge` into atomic types (`Policy`, `Procedure`, `Concept`, `Demonstration`).
*   **Structure:**
    1.  **Policy Zone:** All Constraints.
    2.  **Context Zone:** All Definitions.
    3.  **Action Zone:** All Procedures.
    4.  **Steering Zone:** All Examples.
*   **Mechanism:** Aligns the prompt structure with the specific attention heads of the LLM (loading context into KV Cache before generating action).
*   **Pros:** The cleanest semantic structure; enables precise vector retrieval.
*   **Cons:** Requires a breaking schema change to UMS.

---

### Family C: Psychological & Attention Strategies

#### 7. The Sandwich (Reinforcement)
*   **Concept:** Repeats critical constraints at the end of the prompt to combat "Lost in the Middle."
*   **Structure:**
    1.  **Top:** Full Definitions of Principles.
    2.  **Middle:** Procedures and Specs.
    3.  **Bottom:** Condensed Checklist of Principles.
*   **Mechanism:** Exploits **Recency Bias**. The repetition acts as a "Gatekeeper" immediately before generation.
*   **Pros:** Significantly increases adherence to negative constraints.
*   **Cons:** Increases token usage (duplication).

#### 8. Negative-First (Guardrails)
*   **Concept:** Prioritizes "Safety" over "Helpfulness" by presenting prohibitions first.
*   **Structure:**
    1.  **Forbidden Zone:** All constraints containing "MUST NOT" / "NEVER".
    2.  **Required Zone:** All constraints containing "MUST".
    3.  **Guidance Zone:** Procedures and Concepts.
*   **Mechanism:** Prunes the "Search Space" of possible outputs before the model begins exploring solutions.
*   **Pros:** Ideal for safety-critical or security-focused agents.
*   **Cons:** Requires natural language parsing of constraint text to detect sentiment.

#### 9. Meta-Cognitive (Instructional Wrapper)
*   **Concept:** Wraps the UMS content in a "Reasoning Protocol."
*   **Structure:**
    1.  **Wrapper:** "You are an expert. Before acting, analyze the following..."
    2.  **Content:** (Any UMS structure).
    3.  **Trigger:** "Step 1: List relevant constraints. Step 2: Execute."
*   **Mechanism:** Forces **Chain-of-Thought (CoT)** processing. By forcing the model to "think" about the UMS modules before acting, adherence improves.
*   **Pros:** High performance on complex logic tasks.
*   **Cons:** Changes the output format (adds "chatter" to the response).

---

### Family D: Dynamic Strategies

#### 10. Intent-Driven Slice
*   **Concept:** Dynamically alters the prompt structure based on the User Query (requires an MCP/Runtime).
*   **Structure:**
    *   *Query: "Fix bug"* $\to$ Render Principles + Procedures + Specs. (Hide Concepts).
    *   *Query: "Explain"* $\to$ Render Principles + Concepts + Examples. (Hide Procedures).
*   **Mechanism:** Optimizes the Context Window Signal-to-Noise ratio.
*   **Pros:** Highest efficiency; lowest distraction risk.
*   **Cons:** High runtime complexity; risk of filtering necessary context if the intent classifier fails.

---

## 4. Comparative Analysis Matrix

| Strategy                    | Implementation Cost | Token Cost | Governance Strength | Integration Strength | Best Use Case         |
| :-------------------------- | :------------------ | :--------- | :------------------ | :------------------- | :-------------------- |
| **Cognitive Hierarchy (A)** | Medium              | Standard   | High                | **Low**              | Teaching / Explaining |
| **Module Cohesion (B)**     | Low                 | Standard   | Low                 | **High**             | Coding / Execution    |
| **Author Order (C)**        | Lowest              | Standard   | Variable            | Variable             | Simple Personas       |
| **Topological (6)**         | High (Graph)        | Standard   | Medium              | Medium               | Large Systems         |
| **Hybrid (D)**              | Medium              | Standard   | **High**            | **High**             | **General Purpose**   |
| **Atomic (5)**              | High (Schema)       | Standard   | High                | High                 | Future v3.0           |
| **Sandwich (7)**            | Medium              | **High**   | **Very High**       | Medium               | Compliance Bots       |
| **Negative-First (10)**     | High (Parsing)      | Standard   | High                | Medium               | Security Bots         |
| **Meta-Cognitive (8)**      | Low                 | Standard   | High                | High                 | Complex Logic         |
| **Intent-Driven (9)**       | **Very High**       | **Low**    | Medium              | High                 | Low-Latency Agents    |

---

## 5. Recommendations for Testing Framework

Based on this analysis, the Testing Framework should be updated to include the following:

### Phase 1: The Baseline (Current Plan)
*   Test **Hypothesis A** (Hierarchy) vs. **Hypothesis B** (Cohesion).
*   *Goal:* Prove that Data Locality (B) beats Hierarchy (A) for Integration tasks.

### Phase 2: The Optimization
*   Test **Hypothesis D** (Hybrid).
*   *Goal:* Prove that extracting Global Principles (Zone 0) fixes the Governance weakness of Hypothesis B without breaking Integration.

### Phase 3: The Stress Test
*   Test **Strategy 7** (Sandwich) and **Strategy 8** (Meta-Cognitive).
*   *Goal:* Determine if structural changes (Sandwich) or instructional changes (Meta-Cognitive) are more effective at fixing "Lost in the Middle" errors at high token counts (16k+).

## 6. Final Conclusion

There is no single "correct" linear order for all tasks, but **Hypothesis D (The Hybrid/Constitutional Strategy)** represents the most robust default for a general-purpose system. It respects the two fundamental laws of LLM prompting:
1.  **Primacy Bias:** Rules must come first to set the latent state.
2.  **Data Locality:** Instructions and Data must be adjacent to enable synthesis.

Future iterations of UMS (v3.0) should move toward the **Atomic/Interleaved** model to formalize this structure at the schema level.