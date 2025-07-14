# Module Authoring & Development Guide

- [Module Authoring \& Development Guide](#module-authoring--development-guide)
  - [1. Introduction](#1-introduction)
  - [2. Module Structure](#2-module-structure)
    - [2.1. YAML Frontmatter](#21-yaml-frontmatter)
    - [2.2. Markdown Content](#22-markdown-content)
  - [3. Machine-Centric Language: Good vs. Bad Examples](#3-machine-centric-language-good-vs-bad-examples)
    - [3.1. Primary Directive Examples](#31-primary-directive-examples)
    - [3.2. Process Examples](#32-process-examples)
    - [3.3. Constraints Examples](#33-constraints-examples)
  - [4. The Four-Tier Module System](#4-the-four-tier-module-system)
  - [5. Module Creation Workflow](#5-module-creation-workflow)
    - [Step 1: Deconstruct the Concept](#step-1-deconstruct-the-concept)
    - [Step 2: Draft the Module Content](#step-2-draft-the-module-content)
    - [Step 3: Complete the Frontmatter](#step-3-complete-the-frontmatter)
    - [Step 4: Test and Validate](#step-4-test-and-validate)
  - [6. Example: Technology Module](#6-example-technology-module)

## 1. Introduction

This guide provides the official standards and best practices for authoring and developing instruction modules for the AI Persona Builder ecosystem. Modules are targeted, reusable components of an AI's knowledge base. The _content_ of these modules is written for an AI system, not a human. Therefore, clarity, precision, and unambiguous language are paramount. Adhering to these guidelines ensures all modules are high-quality, consistent, effective, and work harmoniously with the system.

The core philosophy: **a module is a configuration file for an AI's reasoning process.** Every decision in this guide supports that goal.

## 2. Module Structure

A module is a single Markdown file (`.md`) composed of two parts: YAML frontmatter for metadata and Markdown content for instructions.

### 2.1. YAML Frontmatter

The frontmatter is a YAML block at the top of the file, enclosed by `---`. It contains the module's metadata.

**Required Fields:**

- `name` (string): The human-readable name of the module. Use title case.
- `description` (string): A concise, one-sentence summary of the module's purpose.

**Optional Fields:**

- `layer` (number): **Used only for `Foundation` tier modules.** Defines the module's place in the cognitive hierarchy (0-4).
- `authors` (array of strings): Contributors to the module and their e-mail.

**Example Frontmatter:**

```yaml
---
name: 'First-Principles Thinking'
description: 'A process for deconstructing problems to their most fundamental, indivisible truths.'
layer: 1
authors:
  ['Jane Doe <jane.doe@example.com>', 'John Smith <john.smith@example.com>']
---
```

### 2.2. Markdown Content

The content of the module begins immediately after the closing `---` of the frontmatter. This is the instructional text that will be included in the final compiled persona.

The body of the module MUST follow a strict, three-section format using Markdown H2 headings (`##`). This structure is the API that the AI is programmed to understand.

1.  `## Primary Directive`
    - **Purpose:** A single, concise, non-negotiable command—the core goal of the module.
    - **Content:** Must be a single, imperative sentence.
2.  `## Process`
    - **Purpose:** A clear, step-by-step algorithm the AI must follow to comply with the Primary Directive.
    - **Content:** Must be an ordered list (`1.`, `2.`, `3.`). Each step should be a clear, actionable instruction.
3.  `## Constraints`
    - **Purpose:** Boundaries, anti-patterns, and explicit rules about what the AI MUST NOT do.
    - **Content:** Must be a bulleted list (`-`). Each item should be a clear negative constraint.

**Key Principle:** Write for a machine. The language should be direct, explicit, and structured. Use formatting elements like lists, headings, and code blocks to create a clear hierarchy of information.

## 3. Machine-Centric Language: Good vs. Bad Examples

### 3.1. Primary Directive Examples

| ✅ Good Example (Machine-Centric)                                                      | ❌ Bad Example (Human-Centric)                              |
| :------------------------------------------------------------------------------------- | :---------------------------------------------------------- |
| `You MUST validate all user-provided input against a strict schema before processing.` | `It's very important to think about validating user input.` |

**Why the Good Example Works:** Imperative command, specific, no room for misinterpretation.
**Why the Bad Example Fails:** Passive suggestion, lacks specificity, not actionable.

### 3.2. Process Examples

| ✅ Good Example (Machine-Centric) | ❌ Bad Example (Human-Centric) |
| :-------------------------------- | :----------------------------- |

| `1. Receive the input string.`
`2. Apply a regular expression ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$ to the input.`
`3. If the expression does not match, you MUST reject the input and trigger the error-reporting protocol.`
`4. If the expression matches, you WILL proceed to the next step in the workflow.` | `First, you should get the input from the user. Then, it's a good idea to check if it looks like a real email address. There are many ways to do this, but regular expressions are a common choice. If it's not a valid email, you should probably let the user know.` |

**Why the Good Example Works:** Deterministic algorithm, specific outcomes, composable.
**Why the Bad Example Fails:** Conversational, non-deterministic, ambiguous.

### 3.3. Constraints Examples

| ✅ Good Example (Machine-Centric) | ❌ Bad Example (Human-Centric) |
| :-------------------------------- | :----------------------------- |

| `- Do NOT attempt to sanitize or correct invalid input.`
`- Do NOT log the full input string upon validation failure; log only the validation result.`
`- This validation process MUST NOT exceed 50ms of execution time.` | `Try not to change the user's input, as that could be confusing. Also, be careful about logging sensitive information. You should also try to make sure this process is fast.` |

**Why the Good Example Works:** Explicit prohibitions, specific, quantifiable, testable.
**Why the Bad Example Fails:** Weak, suggestive, vague.

## 4. The Four-Tier Module System

Modules are organized into a four-tier hierarchy. The location of a module file determines its classification, which is critical for discovery and organization.

**`instructions-modules/`**

- **`foundation/`**: Core, abstract principles of reasoning, logic, and communication. Universal building blocks of intelligence.
  - **Example:** `foundation/logic/deductive-reasoning.md`
- **`principle/`**: High-level best practices, methodologies, and design principles related to a specific domain.
  - **Example:** `principle/quality/solid-principles.md`
- **`technology/`**: Concrete knowledge about specific tools, languages, and frameworks.
  - **Example:** `technology/framework/react/rules-of-hooks.md`
- **`execution/`**: Action-oriented playbooks and step-by-step guides for performing specific tasks.
  - **Example:** `execution/deployment/ci-cd-pipeline.md`

## 5. Module Creation Workflow

Follow this systematic process to create new, high-quality modules. This workflow is an application of the `generate-new-instruction-module` playbook.

### Step 1: Deconstruct the Concept

- Identify the Core Concept: What is the single, atomic idea this module will represent?
- Formulate the Primary Directive: What is the one command it gives the AI?
- Outline the Process: What are the logical steps to achieve this directive?
- Define the Constraints: How could this rule be misinterpreted? What are the explicit anti-patterns to forbid?

### Step 2: Draft the Module Content

- Use the Standard Structure: The content MUST use the `Primary Directive / Process / Constraints` format.
- Use Machine-Centric Language: The language must be imperative, unambiguous, and direct.
- Be Specific: Replace vague terms with quantifiable metrics or clear definitions.

### Step 3: Complete the Frontmatter

- Ensure the `name` and `description` are clear and concise.
- If it's a `Foundation` module, assign the correct `layer`.
- Add `authors` property with contributor names and emails.

### Step 4: Test and Validate

- Create a Test Persona: Build a minimal persona (`.persona.jsonc`) that includes only a few core modules and the single new module you are testing.
- Design Test Prompts: Craft specific prompts for an AI using this persona.
  - Success Case: A prompt designed to trigger the module's logic. Does the AI behave as expected?
  - Constraint Test: A prompt designed to test the module's boundaries. Does the AI correctly adhere to the constraints?
- Iterate: Refine the module's content based on the test results. Repeat until the AI's behavior is correct and reliable.

## 6. Example: Technology Module

```yaml
---
name: "API Rate Limiting"
description: "Instructions for enforcing API rate limits to prevent abuse."
---

## Primary Directive
Enforce a strict limit of 100 API requests per user per hour.

## Process
1. Track the number of requests made by each user within the current hour.
2. Before processing a request, check if the user's request count is less than 100.
3. If the count is below 100, process the request and increment the count.
4. If the count is 100 or greater, reject the request and return a rate limit error.

## Constraints
- Do NOT allow users to exceed 100 requests per hour under any circumstances.
- Do NOT reset the count before the hour has elapsed.
- Do NOT provide users with a way to bypass or reset their rate limit.
```

By following this guide, you will contribute high-quality, effective, and consistent modules to the ecosystem, making the entire platform more powerful and reliable for all users.
