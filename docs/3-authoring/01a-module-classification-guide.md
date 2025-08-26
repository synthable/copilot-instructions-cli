# Module Classification Guide

To ensure consistency and logical structure across the module library, all modules MUST be classified using the following **Top-Down Classification Test**. This hierarchical decision-making model ensures that modules are placed in the most appropriate tier.

## The Top-Down Classification Test

To classify a module, ask the following questions in order. The first question that yields a "Yes" determines the module's tier.

**1. The Universality Test (Foundation Tier)**

- **Question:** "Is the core concept of this module completely independent of any specific domain (like software, law, or marketing)? Could it be used by a philosopher, a general, or a scientist with its meaning intact?"
- **If Yes:** It is a **Foundation** module. This tier is for the bedrock of reasoning itself.
- **Examples:** `logic`, `reasoning`, `metacognition`, `problem-solving`.

**2. The Best Practice Test (Principle Tier)**

- **Question:** "Does this module describe a guiding rule, a best practice, or a quality attribute that is widely accepted within a specific domain (like software engineering), but is _not_ tied to a single, specific technology or tool?"
- **If Yes:** It is a **Principle** module. This tier is for applying foundational concepts to create expert-level rules of thumb in a field.
- **Examples:** `separation-of-concerns`, `test-driven-development`, `user-centered-design`.

**3. The Tool-Specific Test (Technology Tier)**

- **Question:** "Is this module's primary subject a specific, named technology, such as a programming language, framework, library, or platform?"
- **If Yes:** It is a **Technology** module. This tier is for implementation-specific knowledge.
- **Examples:** `react-hooks`, `python-decorators`, `git-rebase`, `docker-compose`.

**4. The Playbook Test (Execution Tier)**

- **Question:** "Does this module provide a concrete, step-by-step procedure (a 'playbook') for accomplishing a specific, repeatable task?"
- **If Yes:** It is an **Execution** module. This tier is for actionable, how-to guides.
- **Examples:** `debug-a-memory-leak`, `refactor-a-large-function`, `publish-an-npm-package`.
