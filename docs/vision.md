#### **1. Vision & Core Concept**

The project is a command-line interface (CLI) tool designed to revolutionize how developers create and manage instructions for AI assistants. It moves away from monolithic, hard-to-maintain prompt files towards a modular ecosystem.

The core purpose of this tool is to act as a **Persona Builder**. By combining modules from four distinct tiers of knowledge, a user can construct a highly specialized AI persona tailored for any development scenario, from high-level architectural planning to detailed, technology-specific bug fixing.

#### **2. Core Architectural Concepts**

- **Module:** The atomic unit of instruction. A single markdown file containing a focused piece of guidance and YAML frontmatter for metadata (`tier`, `subject`, `name`, `description`). Each module (eg. `technology/frontend/react/rules-of-hooks.md`) is a self-contained unit that can be reused across different personas.
- **Tier:** The module's high-level scope, determined by the top-level directory.
- **Subject:** The module's specific topic, represented by a directory path within a tier. This path can have a maximum depth of two directories to balance organization with simplicity. (eg. `technology/frontend/react`).
- **Persona File:** A self-contained JSONC file (`*.persona.jsonc`) that specifies the configuration and modules to create it.
- **Module Path:** The location of the root modules directory (default: `./instructions-modules`).

#### **3. The Four-Tier System: A Layered Architecture**

The architecture is built on a four-tier system. Each tier represents a different level of abstraction and rate of change, ensuring a logical and efficient compilation process from the most abstract principles to the most concrete actions.

i. **`Foundation`** - **Analogy:** The Laws of Physics. - **Purpose:** Contains the absolute, universal truths of logic, reason, and systematic thinking. It is completely abstract and applies to any problem-solving domain, inside or outside of software. - **Litmus Test:** "Is this a fundamental rule of how to think?" - **Examples:** `reasoning/first-principles-thinking`, `logic/deductive-reasoning`, `ethics/be-truthful`.

ii. **`Principle`** - **Analogy:** The Engineering Blueprints. - **Purpose:** Contains the established principles, practices, methodologies, and architectural patterns of the software engineering profession. These are the "best practices" of the craft, but they are still technology-agnostic. - **Litmus Test:** "Is this a widely accepted practice or pattern for building quality software, regardless of the specific language or framework?" - **Examples:** `methodology/test-driven-development`, `architecture/microservices`, `quality/solid-principles`, `process/agile-scrum`.

iii. **`Technology`** - **Analogy:** The Tool Manual. - **Purpose:** Contains the specific, factual knowledge about a particular tool, language, framework, or platform. This is the "how-to" guide for a specific named technology. - **Litmus Test:** "Is this knowledge tied to a specific brand or product name (React, Python, AWS, Docker)?" - **Examples:** `language/python/pep8-style`, `framework/react/rules-of-hooks`, `platform/aws/iam-best-practices`, `tool/docker/compose-best-practices`.

iv. **`Execution`** - **Analogy:** The Assembly Instructions. - **Purpose:** Contains the literal, step-by-step, imperative playbooks for performing a specific, concrete action _right now_. It combines principles and technology knowledge into a sequence. - **Litmus Test:** "Does this describe a sequence of actions to be performed for the current, immediate task?" - **Examples:** `playbook/create-api-endpoint`, `playbook/refactor-component`, `playbook/debug-issue`, `playbook/write-unit-tests`.

#### **4. Assembly:**

The content of all resolved modules is concatenated into a single file, strictly following the order of inclusion from the Persona file.
