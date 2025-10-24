# 8. Using Local Modules (`modules.config.yml`)

**Previous**: [7. Module Composition: Synergistic Pairs & Bundled Modules](./07-module-composition.md)

---

While the Standard Library provides a robust foundation, the true power of the Unified Module System (UMS) is realized when you create your own custom modules tailored to your project's specific needs. The `modules.config.yml` file is the key to unlocking this capability.

This file acts as a **local module registry** for your project, allowing you to define new modules, override standard ones, and manage how they interact with the base library.

> ## Key Takeaways
>
> - **`modules.config.yml` is your project's module manifest.** It tells the build tool where to find your custom modules.
> - **You can create new modules** by defining a unique `id` and pointing it to a local `.module.yml` file.
> - **You can override any standard module** by using its exact `@std` id and pointing it to your local implementation.
> - **The `onConflict` strategy** gives you fine-grained control over what happens when your local module `id` collides with a standard one.

---

## The `modules.config.yml` File

When you run the build command, the tool looks for a `modules.config.yml` file in your project's root directory. If found, it loads the modules listed there into the **Local Scope**, giving them precedence over the Standard Library.

### Basic Structure

The file contains a single top-level key, `modules`, which is a list of module definitions.

```yaml
# modules.config.yml
modules:
  # Each item in the list defines one local module.
  - id: string
    path: string
    onConflict: 'replace' | 'merge' # Optional
```

### Module Definition Keys

| Key          | Required? | Description                                                                             |
| :----------- | :-------- | :-------------------------------------------------------------------------------------- |
| `id`         | Yes       | The unique module identifier that will be used in `persona.yml` files.                  |
| `path`       | Yes       | The relative path from the project root to the corresponding `.module.yml` file.        |
| `onConflict` | No        | Strategy to use if the `id` also exists in the Standard Library. Defaults to `replace`. |

---

## Use Case 1: Creating a New Local Module

This is the most straightforward use case: adding a new, project-specific capability.

**Goal:** Create a module that specifies your company's internal API style guide.

**Step 1: Create the module file.**
Create a file named `api-style-guide.module.yml` inside a `modules/` directory.

```yaml
# modules/api-style-guide.module.yml
id: '@my-company/principle/api/style-guide'
version: 1.0.0
schemaVersion: '1.0'
shape: specification
# ... rest of the module content
```

**Step 2: Register it in `modules.config.yml`.**
Add an entry to your `modules.config.yml` to make the build tool aware of your new module.

```yaml
# modules.config.yml
modules:
  - id: '@my-company/principle/api/style-guide'
    path: './modules/api-style-guide.module.yml'
```

**Step 3: Use it in your persona.**
You can now reference this module by its `id` in any `persona.yml` file within the project.

```yaml
# personas/api-developer.persona.yml
moduleGroups:
  - groupName: 'API Design Principles'
    modules:
      - '@my-company/principle/api/style-guide'
```

---

## Use Case 2: Overriding a Standard Module

This is how you adapt the Standard Library to your specific needs.

**Goal:** Replace the standard TDD module with a version that includes a principle about "Red-Green-Refactor-Commit".

**Step 1: Create your custom version.**
Create a file, e.g., `custom-tdd.module.yml`, that contains your modified TDD principles.

**Step 2: Register it using the standard `id`.**
In `modules.config.yml`, use the _exact `id` of the standard module_ you wish to replace and point it to your local file.

```yaml
# modules.config.yml
modules:
  # This entry hijacks the standard ID and points it to our local file.
  - id: '@std/principle/testing/test-driven-development'
    path: './modules/custom-tdd.module.yml'
    # onConflict: 'replace' is the default, so it's implied here.
```

Now, any persona that asks for `@std/principle/testing/test-driven-development` will receive your custom version instead of the built-in one. This works because of the **local-first resolution strategy** (see [09-module-resolution.md](./09-module-resolution.md)).

---

## Advanced: The `onConflict` Strategy

The `onConflict` key controls the behavior when a module `id` in your config file is identical to one in the Standard Library.

### `onConflict: 'replace'` (Default)

This strategy causes your local module to completely replace the standard one. The content of the standard module is ignored entirely. This is the most common and predictable strategy.

### `onConflict: 'merge'`

This powerful strategy allows you to **extend** a standard module instead of replacing it. The build tool will merge the `body` directives from both the standard module and your local module.

- **How it works:** For any directive whose content is an array (e.g., `constraints`, `principles`, `process`), the arrays from the standard and local modules are concatenated, with the local module's items coming last.
- **Use Case:** When you want to accept all of a standard module's rules but need to add a few of your own.

**Example:** You want to use all the standard PEP 8 rules but add a new, company-specific rule.

**Standard Module (`@std/technology/language/python/pep8-style-guide`):**

```yaml
body:
  constraints:
    - 'Lines MUST NOT exceed 79 characters.'
    - 'Use 4 spaces for indentation.'
```

**Your Local Module (`modules/custom-pep8.module.yml`):**

```yaml
body:
  constraints:
    - 'All new functions MUST include a docstring.'
```

**Your Config:**

```yaml
# modules.config.yml
modules:
  - id: '@std/technology/language/python/pep8-style-guide'
    path: './modules/custom-pep8.module.yml'
    onConflict: 'merge'
```

**Resulting Compiled Constraints:**

```
- Lines MUST NOT exceed 79 characters.
- Use 4 spaces for indentation.
- All new functions MUST include a docstring.
```

---

**Next**: [9. Module Resolution and Scopes](./09-module-resolution.md)
