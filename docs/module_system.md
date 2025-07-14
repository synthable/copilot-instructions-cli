# Module System Design & Philosophy

## 1. Introduction

This document outlines the complete design and underlying philosophy of the AI Persona Builder's module system. It is the definitive guide for understanding how modules are structured, organized, and composed into a final, coherent instruction set for an AI.

The core vision is to move away from monolithic, hard-to-maintain prompts towards a **modular, reusable, and powerful ecosystem**. The system is designed to be simple, transparent, and to give the user, the "Persona Architect," maximum control over the AI's behavior.

### Table of Contents

- [Module System Design \& Philosophy](#module-system-design--philosophy)
  - [1. Introduction](#1-introduction)
    - [Table of Contents](#table-of-contents)
  - [2. The Atomic Unit: The Module](#2-the-atomic-unit-the-module)
  - [3. The Grand Architecture: The Four-Tier System](#3-the-grand-architecture-the-four-tier-system)
  - [4. A Deeper Dive: The `Foundation` Tier](#4-a-deeper-dive-the-foundation-tier)
    - [4.1. The `layer` Metadata](#41-the-layer-metadata)
  - [5. The Action Prompt: The `Execution` Tier](#5-the-action-prompt-the-execution-tier)
  - [6. Managing Complexity with Persona Templates](#6-managing-complexity-with-persona-templates)
  - [7. Handling Conflicts and Overrides](#7-handling-conflicts-and-overrides)
    - [7.1. Overwriting Instructions](#71-overwriting-instructions)
    - [7.2. Module Conflicts](#72-module-conflicts)

## 2. The Atomic Unit: The Module

The entire system is built upon a single, foundational principle: **every module file represents one single, atomic, and self-contained concept.**

A module should be:

- **Atomic:** It represents the smallest reasonable unit of instruction (e.g., a single reasoning technique, a specific coding standard).
- **Discoverable:** Its filename and metadata should tell a user exactly what it does.
- **Reusable:** It can be picked and chosen individually to be included in any number of different personas.

This principle means we use specific, descriptive filenames (e.g., `deductive-reasoning.md`) and strictly avoid generic "bucket" files (e.g., `basics.md`). The module file system is a **library of specific concepts**, and the persona file is the **composition tool** used to assemble them.

A complete, categorized list of all available modules can be found in the [`instructions-modules/README.md`](../instructions-modules/README.md:1) file.

## 3. The Grand Architecture: The Four-Tier System

The module system is organized into a four-tier hierarchy. This structure creates a "waterfall of abstraction," guiding the AI from the most universal rules of thought down to the most concrete actions. For maximum effectiveness, personas should always be assembled in the `Foundation -> Principle -> Technology -> Execution` order.

| Tier             | Analogy                    | Purpose & Description                                                                                                                                |
| :--------------- | :------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`Foundation`** | The Laws of Physics        | Contains the universal, abstract truths of logic, reason, ethics, and problem-solving. These are the "rules of how to think."                        |
| **`Principle`**  | The Engineering Blueprints | Contains the established, technology-agnostic best practices and methodologies of a profession (e.g., software engineering's SOLID principles, TDD). |
| **`Technology`** | The Tool Manual            | Contains specific, factual knowledge about a named tool, language, or platform (e.g., React, Python, AWS).                                           |
| **`Execution`**  | The Assembly Instructions  | Contains imperative, step-by-step playbooks for performing a specific, concrete action _right now_.                                                  |

## 4. A Deeper Dive: The `Foundation` Tier

The `Foundation` tier is unique because it defines the AI's core cognitive architecture. The subjects within this tier form a conceptual hierarchy. While the system does not currently have an automated linter, the `layer` metadata is included in modules as a forward-looking feature to support future validation tools.

### 4.1. The `layer` Metadata

The optional `layer` property in a `Foundation` module's frontmatter is designed to help users reason about the cognitive flow.

**The Formal Level System:**

| Layer | Name                       | Purpose                                               | Example Subjects                       |
| :---- | :------------------------- | :---------------------------------------------------- | :------------------------------------- |
| **0** | **Bedrock / Axioms**       | The absolute, non-negotiable rules of the game.       | `Ethics`, `Logic`                      |
| **1** | **Core Processes**         | The active "thinking" engines and primary algorithms. | `Reasoning`, `Problem-Solving`, `Bias` |
| **2** | **Evaluation & Synthesis** | Analyzing, refining, and preparing the output.        | `Judgment`, `Communication`            |
| **3** | **Action / Decision**      | Selecting a final course of action.                   | `Decision-Making`                      |
| **4** | **Meta-Cognition**         | "Thinking about thinking"; self-regulation.           | `Metacognition`, `Epistemology`        |

As a best practice, users should manually order their `Foundation` modules according to this hierarchy to build the most robust personas.

## 5. The Action Prompt: The `Execution` Tier

An `Execution` module is the **imperative, task-activating component** of the final compiled meta-prompt. While the first three tiers are declarative ("Be this way," "Know this fact"), the `Execution` tier is imperative ("Do this now").

- **Personas WITH `Execution` Modules:** These act as **automated agents** that begin a pre-defined workflow immediately. Multiple `Execution` modules can be chained to create complex, sequential workflows.
- **Personas WITHOUT `Execution` Modules:** This is a primary use case. These personas act as **on-demand experts**. They create an AI that is in a fully configured state but is awaiting its first instruction from the user's live prompt. This is ideal for interactive or conversational tasks.

## 6. Managing Complexity with Persona Templates

To prevent user overload and promote best practices, the system provides a "starter kit" approach through the `create-persona --template <name>` command.

- **Purpose:** This command scaffolds a new persona file from a pre-made template (e.g., `rational-developer.jsonc`).
- **Function:** These templates are well-ordered, commented examples that serve as both a safe starting point and a learning tool. They are the primary mechanism for guiding users on how to structure a high-quality persona.

## 7. Handling Conflicts and Overrides

In the current system, conflict resolution is a **manual process** that relies on the user's expertise and the fundamental behavior of Large Language Models.

#### 7.1. Overwriting Instructions

A user can "overwrite" a general rule from a lower tier by placing a more specific, contradictory instruction in a higher-tier module that appears later in the build order. LLMs naturally give more weight to instructions that are more **recent** (later in the prompt) and more **specific**.

#### 7.2. Module Conflicts

The system does not have automated conflict detection. The user is responsible for curating a coherent set of modules.

- **Implicit Resolution via Order:** If two conflicting modules are included, the module that appears **last** in the `modules` array will have the most influence on the AI's behavior. This "last-instruction-wins" principle is the system's only built-in conflict resolution mechanism.
