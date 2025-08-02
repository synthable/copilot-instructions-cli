# 🖼️ Advanced Authoring: Patterns & Examples

This document showcases advanced authoring techniques, focusing on the core architectural patterns that enable sophisticated AI behaviors. It also provides a library of concrete examples to inspire and guide your own module and persona development.

## 🧠 Advanced Pattern: Synergistic Pairs

This section provides a deep dive into one of the most powerful architectural patterns in the AI Persona Builder ecosystem: the **Synergistic Pair**. Mastering this concept allows a persona architect to move beyond simple instruction sets and build agents with complex, multi-step cognitive behaviors.

### What is a Synergistic Pair?

A Synergistic Pair is a design pattern, not a specific schema. It is created when a persona architect **intentionally sequences two or more modules with complementary roles** in a `persona.jsonc` file. This deliberate composition produces a combined effect that is greater than the sum of its parts.

It is defined by three key characteristics:

1.  **Intentional Sequencing:** The order of modules in the `modules` array is critical and is chosen to create a specific cognitive flow.
2.  **Complementary Roles:** The modules serve distinct but related functions, such as `Action → Verification` or `Concept → Implementation`.
3.  **Emergent Behavior:** The AI, by processing the modules in sequence, exhibits a more sophisticated behavior (e.g., self-correction) that is not explicitly defined in any single module.

#### Formal vs. Informal Pairs

- **Informal Pairs (Most Common):** Created simply by ordering modules in `persona.jsonc`. The synergy is inferred by the AI from the sequential context.
- **Formal Pairs (Advanced):** Created when a module explicitly declares its relationship to another using an `implement` key in its frontmatter. This provides a stronger, verifiable link between modules.

### Key Synergistic Pairs by Schema

Here are the most effective and common pairings.

#### `procedure` + `checklist`

- **Relationship:** Action → Verification
- **Description:** This is the cornerstone of a self-correcting agent. The `procedure` provides the steps to perform an action, and the `checklist` immediately provides the criteria to verify the quality and completeness of that action.
- **Use Case:** A persona that writes code and then audits its own output for security flaws.
- **Resulting Behavior:** The AI first follows the procedure to create an artifact, then uses the checklist to review its own work before presenting the final output.

#### `procedure` + `specification`

- **Relationship:** Implementation of a Standard
- **Description:** This is the classic "how" and "what" pairing. The `procedure` provides the workflow, and the `specification` provides the formal, non-negotiable standard that the output must adhere to.
- **Use Case:** A persona that generates a Git commit message that must follow the Conventional Commits standard.
- **Resulting Behavior:** The AI uses the procedure to structure its thinking but ensures the final string output conforms precisely to the rules defined in the specification.

#### `pattern` + `specification`

- **Relationship:** Abstract Concept → Concrete Rules
- **Description:** This pair connects the "why" with the "what." The AI is first taught the high-level philosophy and trade-offs of an architectural pattern, then given the specific, hard rules for one of its components.
- **Use Case:** A persona that understands SOLID principles and can then apply the specific rules of the Interface Segregation Principle.
- **Resulting Behavior:** The AI can reason about high-level architecture while correctly implementing the low-level, specific rules of a constituent part.

#### `checklist` + `data`

- **Relationship:** Verification Process → Reference Data
- **Description:** This pairing equips an auditor with both its process and its source of truth. The `checklist` defines *what* to check, while the `data` module provides the "golden copy" or standard configuration to check against.
- **Use Case:** A persona that audits a project's `tsconfig.json` file for compliance with team standards.
- **Resulting Behavior:** The AI uses the checklist as its workflow and the `data` module as the authoritative reference to perform the audit.

### Summary Table of Relationships

| Pair | Primary Role | Secondary Role | Emergent Behavior |
| :--- | :--- | :--- | :--- |
| `procedure` + `checklist` | Action | Verification | Self-Correction, Quality Assurance |
| `procedure` + `specification` | Action | Standard | Standards Enforcement, Conformance |
| `pattern` + `specification` | Concept | Standard | Principled Implementation |
| `checklist` + `data` | Verification | Reference | Data-Driven Auditing |

---

## 2. Example Library

This section provides pointers to well-structured examples within the project repository that demonstrate best practices.

### Module Examples

- **Foundation Module:** See `examples/modules/foundation/reasoning/analytical-thinking.md`
- **Principle Module:** See `examples/modules/principle/architecture/clean-architecture.md`
- **Technology Module:** See `examples/modules/technology/framework/nextjs/app-router.md`
- **Execution Module:** See `examples/modules/execution/implement/add-authentication.md`

### Persona Examples

- **Full-Stack Developer:** See `examples/personas/fullstack-developer.persona.jsonc`
- **Security-Focused Developer:** See `examples/personas/security-focused.persona.jsonc`
- **DevOps Engineer:** See `examples/personas/devops-engineer.persona.jsonc`

---

## 3. Persona Templates

These templates provide starting points for your `persona.jsonc` files.

### Minimal Persona Template

This template is a bare-bones starting point for a custom persona.

```jsonc
{
  "name": "My Persona",
  "description": "A brief description of this persona's purpose.",
  "output": ".github/copilot/instructions.md",
  "modules": [
    // Start by including foundational reasoning modules
    "foundation/universal/reasoning/*"
  ]
}
```

### Advanced Persona Template

This template demonstrates a more complex structure, utilizing wildcards and specific module ordering to build a sophisticated agent. Note the explicit ordering from `Foundation` to `Execution`.

```jsonc
{
  "name": "Advanced React TDD Specialist",
  "description": "An expert AI assistant for building React components with a strict TDD workflow.",
  "output": ".github/copilot/instructions.md",
  // Attributions are useful for debugging the final prompt.
  "attributions": true,
  "modules": [
    // Foundational reasoning and software principles
    "foundation/universal/reasoning/first-principles-thinking.md",
    "foundation/software/reasoning/systematic-debugging.md",

    // Core software engineering principles
    "principle/testing/test-driven-development.md",
    "principle/quality/clean-code.md",

    // Technology stack, from general to specific
    "technology/language/typescript.md",
    "technology/framework/react.md",
    "technology/tool/jest.md",

    // Actionable playbooks for the agent to execute
    "execution/playbook/generate-react-component-with-tests.md"
  ]
}
```
