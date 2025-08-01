# ❓ FAQ: AI Persona Builder

This document answers frequently asked questions about the design, philosophy, and best practices for the AI Persona Builder CLI.

---

### **📜 Table of Contents**

- [FAQ: AI Persona Builder](#faq-ai-persona-builder)
  - [**Table of Contents**](#table-of-contents)
  - [1. What is the purpose of the `Foundation` tier?](#1-what-is-the-purpose-of-the-foundation-tier)
  - [2. Should subjects in the `Foundation` tier depend on each other?](#2-should-subjects-in-the-foundation-tier-depend-on-each-other)
  - [3. How can we ease the learning curve for new users if ordering is so flexible?](#3-how-can-we-ease-the-learning-curve-for-new-users-if-ordering-is-so-flexible)
  - [4. Does the `layer` metadata concept apply to every tier?](#4-does-the-layer-metadata-concept-apply-to-every-tier)
  - [5. Should a `Technology` module for a language (e.g., TypeScript) come before a framework (e.g., React)?](#5-should-a-technology-module-for-a-language-eg-typescript-come-before-a-framework-eg-react)
  - [6. What is the role of an `Execution` module? Is it like a prompt?](#6-what-is-the-role-of-an-execution-module-is-it-like-a-prompt)
  - [7. Is there a use case for having more than one `Execution` module in a persona?](#7-is-there-a-use-case-for-having-more-than-one-execution-module-in-a-persona)
  - [8. Is it valid to build a persona without any `Execution` modules?](#8-is-it-valid-to-build-a-persona-without-any-execution-modules)
  - [9. Are there any edge cases where a module should be placed outside its tier in the persona file?](#9-are-there-any-edge-cases-where-a-module-should-be-placed-outside-its-tier-in-the-persona-file)
  - [10. Do all subjects in the `Foundation` tier support different module layers?](#10-do-all-subjects-in-the-foundation-tier-support-different-module-layers)
    - [The Formal Level System](#the-formal-level-system)
    - [How Subjects Map to Levels](#how-subjects-map-to-levels)
    - [The Exception Proves the Rule](#the-exception-proves-the-rule)
  - [CLI Commands & Usage](#cli-commands--usage)
    - [**`build`**](#build)
    - [**`list`**](#list)
    - [**`search`**](#search)
    - [**`validate`**](#validate)
    - [**`create-module`**](#create-module)
    - [**`create-persona`**](#create-persona)

---

### 1. What is the purpose of the `Foundation` tier? 🏛️

The `Foundation` tier contains the absolute, universal truths of logic, reason, and systematic thinking. It is completely abstract and applies to any problem-solving domain. Its purpose is to define the core cognitive architecture of a rational agent.

- **Litmus Test:** "Is this a fundamental rule of how to think?"
- **Examples:** `reasoning/first-principles-thinking`, `logic/avoiding-logical-fallacies`, `ethics/be-truthful`, `bias/mitigating-confirmation-bias`.

### 2. Should subjects in the `Foundation` tier depend on each other? 🔗

**Yes, conceptually they do, but this dependency is managed through ordering, not a technical system.**

Conceptually, foundational subjects form a hierarchy. For example, `Ethics` and `Logic` are the bedrock (Level 0) upon which `Reasoning` (Level 1) is built. `Decision-Making` (Level 3) is the final action that relies on all prior layers.

This dependency is implemented by the **order of modules in the `persona.jsonc` file**. The `build` command concatenates modules in the exact sequence specified, creating a logical cognitive flow for the AI to follow. A technical dependency system (e.g., a `depends_on` field) is intentionally avoided to maintain simplicity and flexibility.

### 3. How can we ease the learning curve for new users if ordering is so flexible? 🧑‍🏫

We can guide users toward best practices without removing power-user flexibility through a multi-layered approach:

1.  **Documentation:** Provide guides that explain the "cognitive hierarchy" and best practices for ordering modules.
2.  **Starter Kits:** Include well-structured example personas (e.g., `rational-developer.json`) that demonstrate proper ordering with explanatory comments.
3.  **Scaffolding (`init` command):** A CLI command that creates a new persona file from a pre-made, well-ordered template.
4.  **Linting (`--lint` flag):** An optional flag for the `build` command that uses `layer` metadata in `Foundation` modules to warn the user about potential ordering issues without failing the build. This is the ideal solution as it educates without restricting.

### 4. Does the `layer` metadata concept apply to every tier? LAYER

**No. The `layer` concept is most valuable and meaningful for the `Foundation` tier and should generally not be applied to others.**

- **`Foundation`:** High applicability. The `layer` metadata prevents logical errors in the persona's cognitive flow (e.g., ensuring `Ethics` (Level 0) comes before `Decision-Making` (Level 3)).
- **`Principle`:** Low applicability. These are a "toolbox" of best practices, not a strict hierarchy. Ordering is based on generality, not prerequisites.
- **`Technology` & `Execution`:** Not applicable. These modules are independent peers. Forcing a `layer` on them would be arbitrary and restrictive. Their order is based on user preference or context.

### 5. Should a `Technology` module for a language (e.g., TypeScript) come before a framework (e.g., React)? 🥞

**Yes, this is a best practice.**

While an LLM already understands that React uses TypeScript, the modules are not for teaching; they are for **activating context and rules**. The purpose of the final compiled prompt is to configure the AI's operational state for a specific task.

Ordering `Technology` modules from **most general to most specific** creates a more logical and readable persona file for the human architect. It establishes a "stack" of contexts for the AI to operate within.

- **Recommended Order:**
  1.  `technology/language/typescript/...` (General language context)
  2.  `technology/frontend/react/...` (Specific framework context)
  3.  `technology/tool/jest/...` (Specific testing context)

### 6. What is the role of an `Execution` module? Is it like a prompt? 🎯

**Yes, an `Execution` module is the imperative, task-activating component of the final compiled meta-prompt.**

- **Tiers 1-3 (`Foundation`, `Principle`, `Technology`):** These form the **Declarative Context Block**. They act as a detailed system prompt, establishing the AI's "mindset," rules, and prioritized knowledge. They tell the AI _what to be_.
- **Tier 4 (`Execution`):** This forms the **Imperative Instruction Block**. It acts as a pre-loaded user prompt, providing a specific, step-by-step task for the AI to perform immediately. It tells the AI _what to do_.

### 7. Is there a use case for having more than one `Execution` module in a persona? ⛓️

**Yes, this is a powerful technique for creating more versatile agents.**

1.  **Chained Workflows:** Concatenate multiple playbooks to create a seamless, multi-step task. For example, `create-api-endpoint` followed by `write-integration-tests-for-endpoint`. The AI completes the first task and immediately uses that context for the second.
2.  **"Toolbox" Personas:** Include several independent playbooks in the persona. The user can then "invoke" a specific playbook by name in their live prompt to the AI (e.g., "Using the `debug-iam-policy` playbook, analyze this for me.").

### 8. Is it valid to build a persona without any `Execution` modules? ✅

**Yes, this is a primary and powerful use case.** This creates an **"On-Demand Expert"** or **"Primed Consultant."**

When you omit the `Execution` tier, you create a meta-prompt that consists only of the declarative context. The result is an AI that is in a fully configured, "primed" state, but is awaiting its first instruction. The user's live prompt then becomes the first imperative task that the AI processes within that highly-configured state. This is ideal for interactive, conversational, or unpredictable tasks.

### 9. Are there any edge cases where a module should be placed outside its tier in the persona file? 🧩

**The 99% rule is to always maintain the strict `Foundation -> Principle -> Technology -> Execution` order.**

However, deliberately breaking this order is an expert-layer prompt engineering technique used to change a module's function from a "rule" to "data."

- **Example: Meta-Analysis.** To have a persona critique another module, you would place the `Execution` playbook _before_ the module to be critiqued.
  1.  `execution/playbook/critique-a-module-for-clarity` (The instruction)
  2.  `technology/language/python/pep8-style` (The data to be acted upon)

In this case, the `Execution` module's instruction ("Analyze the following text...") re-contextualizes the subsequent `Technology` module from a rule to be followed into raw text to be analyzed.

### 10. Do all subjects in the `Foundation` tier support different module layers? 🏛️

**No. The `layer` metadata is a property of a module's _function_, and modules within the same subject almost always share the same layer because they perform the same _type_ of cognitive work.**

The `layer` system is not for arbitrary sorting. Its sole purpose is to enable the optional linting feature (`--lint`) to validate the logical consistency of a persona's cognitive flow. It enforces a "pyramid of thought," ensuring that foundational concepts are loaded before the concepts that depend on them.

#### The Formal Level System

Think of the layers as defined, discrete categories of cognitive function. Each `Foundation` subject has a natural "home" at one of these layers.

| Layer | Name                       | Purpose & Description                                                                                  | Example Subjects                                   |
| :---- | :------------------------- | :----------------------------------------------------------------------------------------------------- | :------------------------------------------------- |
| **0** | **Bedrock / Axioms**       | The absolute, non-negotiable rules and constraints that govern all subsequent thought.                 | **`Ethics`**, **`Logic`**                          |
| **1** | **Core Processes**         | The active, primary "thinking" engines used to process information and formulate initial thoughts.     | **`Reasoning`**, **`Problem-Solving`**, **`Bias`** |
| **2** | **Evaluation & Synthesis** | The process of analyzing, refining, and preparing the output of the core processes.                    | **`Judgment`**, **`Communication`**                |
| **3** | **Action / Decision**      | The final step of selecting a concrete course of action based on the evaluated conclusions.            | **`Decision-Making`**                              |
| **4** | **Meta-Cognition**         | "Thinking about thinking." Processes that observe, evaluate, and regulate the entire cognitive system. | **`Metacognition`**, **`Epistemology`**            |

#### How Subjects Map to Levels

Based on this system, all modules within a given subject will almost always have the same layer.

- All modules in `foundation/reasoning/` (e.g., `first-principles-thinking.md`) are performing a **Core Process** and should be `layer: 1`.
- All modules in `foundation/ethics/` (e.g., `be-truthful.md`) are establishing **Bedrock Axioms** and should be `layer: 0`.

It would be a conceptual error for a module like `deductive-reasoning.md` to have `layer: 3`, as the act of reasoning is a core process used to _inform_ a decision, not the decision itself.

#### The Exception Proves the Rule

The `layer` is technically defined in each module's frontmatter. This allows for rare but important exceptions where a module's specific function differs from its subject's general category.

For example, most `Communication` modules are about presenting a final thought (`layer: 2`). However, a module like `communication/ask-clarifying-questions.md` is about gathering input _before_ reasoning begins. A strong argument could be made for assigning it `layer: 1` to reflect its role in supporting the **Core Processes**.

This flexibility makes the linting system both powerful and precise, as it checks the module's specific declared layer, not a presumed layer for its parent directory.

---

### CLI Commands & Usage

This section provides a comprehensive overview of all available commands in the AI Persona Builder CLI, their options, and practical examples.

#### **`build`**

Builds a persona instruction file from a `.persona.json` configuration.

- **Usage:** `copilot-instructions build <personaFile>`
- **Arguments:**
  - `<personaFile>` (required): Path to the persona configuration file (e.g., `personas/my-persona.persona.jsonc`).
- **Example:**
  ```bash
  copilot-instructions build ./personas/developer-persona.persona.jsonc
  ```
- **Tip:** The output file path is defined by the `output` property within your persona JSON file.

---

#### **`list`**

Lists all available instruction modules.

- **Usage:** `copilot-instructions list [options]`
- **Options:**
  - `-t, --tier <name>`: Filter the list by a specific tier. Choices: `foundation`, `principle`, `technology`, `execution`.
- **Examples:**

  ```bash
  # List all modules
  copilot-instructions list

  # List only foundation modules
  copilot-instructions list --tier foundation
  ```

- **Tip:** Use this command to discover available modules before adding them to your persona file. The output table includes the layer, tier/subject, name, and description for easy reference.

---

#### **`search`**

Searches for modules by name or description.

- **Usage:** `copilot-instructions search <query> [options]`
- **Arguments:**
  - `<query>` (required): The text to search for.
- **Options:**
  - `-t, --tier <name>`: Restrict the search to a specific tier.
- **Examples:**

  ```bash
  # Search for modules related to "logic"
  copilot-instructions search "logic"

  # Search for "reasoning" only in the foundation tier
  copilot-instructions search "reasoning" --tier foundation
  ```

---

#### **`validate`**

Validates all modules and persona files for correctness, including frontmatter and persona schema.

- **Usage:** `copilot-instructions validate [path]`
- **Arguments:**
  - `[path]` (optional): Path to a specific file or directory to validate. If omitted, it validates all relevant files in the project.
- **Examples:**

  ```bash
  # Validate all modules and personas in the project
  copilot-instructions validate

  # Validate a specific module
  copilot-instructions validate ./instructions-modules/foundation/logic/deductive-reasoning.md

  # Validate a specific persona
  copilot-instructions validate ./personas/my-persona.persona.jsonc
  ```

- **Tip:** Run `validate` before a `build` to catch errors early. This command checks for required frontmatter fields, correct data types, and valid persona configuration.

---

#### **`create-module`**

Creates a new instruction module file from a template.

- **Usage:** `copilot-instructions create-module <tier> <subject> <name> [description]`
- **Arguments:**
  - `<tier>` (required): The tier for the new module (`foundation`, `principle`, `technology`, `execution`).
  - `<subject>` (required): The subject path within the tier (e.g., `logic/reasoning`).
  - `<name>` (required): The name for the new module (e.g., "My New Module").
  - `[description]` (optional): A short description for the module.
- **Options:**
  - `-l, --layer <number>`: The layer for foundation modules (0-5).
- **Example:**
  ```bash
  copilot-instructions create-module foundation "logic" "Inductive Reasoning" "A module for reasoning from specific observations to broad generalizations." --layer 1
  ```

---

#### **`create-persona`**

Creates a new persona configuration file.

- **Usage:** `copilot-instructions create-persona <name> [description] [options]`
- **Arguments:**
  - `<name>` (required): The name for the new persona.
  - `[description]` (optional): A short description for the persona.
- **Options:**
  - `--no-attributions`: Do not include attributions in the persona file.
  - `-p, --persona-output <path>`: The path where the persona file will be saved.
  - `-b, --build-output <file>`: The file name for the generated persona markdown.
  - `-t, --template <name>`: The name of a template file from `./templates/persona` to use as a base.
- **Examples:**

  ```bash
  # Create a simple persona
  copilot-instructions create-persona "My Awesome Persona"

  # Create a persona from a template
  copilot-instructions create-persona "Code Reviewer" --template code-critic

  # Create a persona with custom output paths
  copilot-instructions create-persona "Data Analyst" --persona-output ./personas/data-analyst.persona.jsonc --build-output ./dist/data-analyst.md
  ```

- **Tip:** Using a `--template` is a great way to start a new persona with a pre-defined set of modules. You can create your own templates in the `templates/persona` directory.
