# 6. The Persona Definition File (`persona.yml`)

**Previous**: [5. Writing Module Content: Machine-Centric Language](./05-machine-centric-language.md)

---

The **Persona Definition File** is the master blueprint for assembling an AI persona. It is the sole mechanism for composition in the Unified Module System (UMS), acting as a "recipe" that selects and sequences individual `.module.yml` files into a single, coherent set of instructions. A valid persona file MUST include top-level `name`, `description`, and `semantic` fields with the same requirements as module metadata (see Spec 2.2).

While modules define _what_ an AI can know or do, the persona file defines _who_ the AI is by composing those capabilities.

> ## Key Takeaways for Persona Authors
>
> - **The `persona.yml` is for composition only.** It contains no raw instructions itself, only references to modules.
> - **Order is everything.** The sequence of modules in the file dictates the final sequence of instructions given to the AI.
> - **Group modules for clarity.** Use `moduleGroups` to organize your persona's capabilities into logical sections.

---

## The Role of the Persona File

The persona file serves one critical purpose: to define the list and order of modules that will be compiled into the final prompt. This clean separation of concerns is a core principle of the UMS:

- **`.module.yml` files:** The "library" of reusable, atomic concepts.
- **`persona.yml` file:** The "application" that consumes the library to build a specific agent.

This architecture ensures that the final build is predictable, debuggable, and easy to maintain. Persona definitions are YAML-only in v1.0 and MUST use the `.persona.yml` extension.

### Required Persona Metadata

Top-level persona metadata fields (required):

- `name` (String): Human-readable Title Case name.
- `description` (String): Single-sentence summary of purpose.
- `semantic` (String): Dense, keyword-rich paragraph optimized for search.

## Top-Level Structure

A persona definition file is a simple YAML object with required metadata keys and a composition key: `moduleGroups`.

```yaml
# Required persona metadata
name: 'TypeScript Code Author'
description: 'A pragmatic engineer persona that writes strict, maintainable TypeScript.'
semantic: 'typescript strict mode eslint tdd clean architecture code review refactoring readability maintainability node vitest'

# A list of logical groupings for modules.
moduleGroups:
  # Each item in the array is a group.
  - groupName: string
    modules: [string]
  - groupName: string
    modules: [string]
```

### Key Descriptions

| Key            | Required? | Type             | Description                                                                                 |
| :------------- | :-------- | :--------------- | :------------------------------------------------------------------------------------------ |
| `moduleGroups` | Yes       | Array of Objects | An array of module groups, which are processed in order to build the final instruction set. |

---

## The `moduleGroups` Block

The `moduleGroups` array is the heart of the persona file. It allows you to organize your selected modules into logical sections, making the persona's architecture clear and self-documenting.

Each object in the `moduleGroups` array contains two keys:

| Key         | Required? | Type             | Description                                                                                                                             |
| :---------- | :-------- | :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| `groupName` | Yes       | String           | A human-readable name for the group (e.g., "Core Reasoning," "Code Generation Strategy"). This is used for documentation and debugging. |
| `modules`   | Yes       | Array of Strings | A list of module `id`s to be included in this group. The modules are compiled in the exact order they appear in this list.              |

### The Importance of Sequence

The build tool processes the persona file sequentially:

1. It iterates through the `moduleGroups` array in order.
2. Within each group, it iterates through the `modules` array in order.
3. It retrieves the content of each module and concatenates it to the final output.

This means the final instruction set is a direct reflection of the order you define in the `persona.yml`. For optimal results, you should always follow the **"waterfall of abstraction"** defined in the UMS philosophy:

1.  **Foundation** modules first.
2.  **Principle** modules next.
3.  **Technology** modules after that.
4.  **Execution** modules last.

## Example `persona.yml`

This example defines a persona for a TypeScript developer. It first establishes foundational reasoning, then sets principles for code quality, specifies the technology, and finally provides an execution playbook.

```yaml
name: 'TypeScript Code Author'
description: 'A pragmatic engineer persona that writes strict, maintainable TypeScript.'
semantic: 'typescript strict mode eslint tdd clean architecture code review refactoring readability maintainability node vitest'

moduleGroups:
  - groupName: '1. Foundational Reasoning'
    modules:
      - '@std/foundation/reasoning/systems-thinking'
      - '@std/foundation/problem-solving/root-cause-analysis'

  - groupName: '2. Engineering Principles'
    modules:
      - '@std/principle/architecture/separation-of-concerns'
      - '@std/principle/testing/test-driven-development'

  - groupName: '3. Technology Stack'
    modules:
      - '@std/technology/language/typescript/strict-type-checking'
      - '@std/technology/framework/react/component-best-practices'

  - groupName: '4. Execution Playbook'
    modules:
      - '@std/execution/playbook/implement-react-component-from-spec'
```

This structure ensures the AI is first primed with general problem-solving skills, then given architectural best practices, then loaded with specific knowledge about TypeScript and React, and finally given a concrete set of steps to perform a task.

---

**Next**: [7. Module Composition: Synergistic Pairs & Bundled Modules](./07-module-composition.md)
