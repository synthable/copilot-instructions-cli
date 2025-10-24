# The Module Definition File

The atomic unit of the Unified Module System (UMS) is the **module definition file**. In accordance with the data-centric philosophy of the UMS, all modules are defined in a YAML file with the `.module.yml` extension.

This file is the canonical source of truth for a module's identity, metadata, and instructional content. It transforms instructions from simple prose into a structured, machine-readable, and self-validating format.

---

## Top-Level Structure

A valid `.module.yml` file is a YAML object containing a standard set of top-level keys that define a module's identity, contract, and content.

```yaml
# The unique, machine-readable identifier for the module.
id: string

# The semantic version of the module (ignored in v1.0, but required for future compatibility).
version: string

# The version of the UMS specification this module conforms to.
schemaVersion: "1.0"

# The structural type of the module (e.g., 'specification', 'procedure').
shape: string

# Human-readable and AI-discoverable metadata.
meta:
  # ... see Meta Block section ...

# The instructional content of the module, composed of typed directive blocks.
body:
  # ... see Body Block and Directives documentation ...
```

### Key Descriptions

| Key             | Description                                                                                                                                            |
| :-------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`            | The Module Identifier. This is the module's permanent, machine-readable address in the ecosystem. See [Module Identifiers](./03-module-identifier.md). |
| `version`       | The semantic version (SemVer 2.0.0) of the module. **This field is reserved and ignored in v1.0** but is required for forward compatibility.           |
| `schemaVersion` | The version of the UMS specification the module conforms to. For v1.0, this **MUST** be `"1.0"`.                                                       |
| `shape`         | A string defining the module's structural type (e.g., `specification`, `procedure`). This declares the module's intent.                                |
| `meta`          | A block containing human-readable and AI-discoverable metadata, such as its name and description.                                                      |
| `body`          | The instructional core of the module, composed of typed directive blocks (e.g., `goal`, `process`).                                                    |

---

## The `meta` Block

The `meta` block contains all human-readable and AI-discoverable metadata for the module. This block is the primary source of information for discovery tools (`list`, `search`) and for vectorization in AI-driven search.

### Required `meta` Fields

| Key           | Description                                                                                                                         |
| :------------ | :---------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | The human-readable, Title Case name of the module (e.g., "Test-Driven Development"). Optimized for **human clarity**.               |
| `description` | A concise, single-sentence summary of the module's purpose. Optimized for **human scannability**.                                   |
| `semantic`    | A dense, keyword-rich paragraph describing the module's concepts, purpose, and related ideas. Optimized for **AI semantic search**. |

### Optional `meta` Fields

| Key          | Description                                                                                             |
| :----------- | :------------------------------------------------------------------------------------------------------ |
| `tags`       | A list of lowercase keywords for filtering and search boosting (e.g., `testing`, `security`, `python`). |
| `license`    | The SPDX license identifier for the module's content (e.g., `"MIT"`, `"Apache-2.0"`).                   |
| `authors`    | A list of authors/maintainers in the format `'FullName <email@example.com>'`.                           |
| `homepage`   | A URL pointing to the module's source repository or documentation.                                      |
| `deprecated` | A flag (`true`/`false`) to indicate if the module is deprecated. Defaults to `false`.                   |
| `replacedBy` | The `id` of a successor module, to be used only when `deprecated` is `true`.                            |

---

## Module Shape and Structural Contracts

To ensure every module is structurally valid and its purpose is explicit, each module declares its `shape` and its corresponding directives contract. This contract transforms the `body` from an arbitrary collection of content into a verifiable structure.

- The `shape` is a single, standard, lowercase string that classifies the module's primary structural intent.
- A directive is used in the `body` to satisfy a module's `shape` contract.

The set of keys present in the `body` (the directives) are defined by the module's `shape`.

### Standard Shapes (v1.1)

The following are the official `shape` values for v1.1. While custom shapes are possible, tooling is optimized for these standard forms.

| Shape                          | Description                                    | Required Directives                                    | Optional Directives                                            |
| :----------------------------- | :--------------------------------------------- | :----------------------------------------------------- | :------------------------------------------------------------- |
| **`specification`**            | Defines a set of rules or standards.           | `purpose`, `constraints`                               | `recommended`, `discouraged`, `examples`                       |
| **`procedure`**                | Defines a step-by-step process.                | `purpose`, `process`                                   | `recommended`, `discouraged`, `examples`                       |
| **`pattern`**                  | Explains a high-level, abstract concept.       | `purpose`, `principles`, `advantages`, `disadvantages` | `constraints`, `recommended`, `discouraged`, `examples`        |
| **`checklist`**                | Provides criteria for verification.            | `purpose`, `criteria`                                  | `examples`                                                     |
| **`data`**                     | Provides a raw block of information.           | `purpose`, `data`                                      | `examples`                                                     |
| **`procedural-specification`** | A hybrid that defines a process and its rules. | `purpose`, `process`, `constraints`                    | `recommended`, `discouraged`, `examples`                       |
| **`playbook`**                 | An end-to-end workflow with verification.      | `purpose`, `process`, `constraints`, `criteria`        | `principles`, `recommended`, `discouraged`, `examples`, `data` |

#### Shape Directives

Each `shape` has a defined set of required and optional directives. The following table lists all possible directive keys and their purposes.

| Directive Key   | Purpose                                                      |
| :-------------- | :----------------------------------------------------------- |
| `purpose`       | Defines the module's primary objective or core concept.      |
| `process`       | Defines a sequential, step-by-step algorithm.                |
| `constraints`   | Defines non-negotiable rules, prohibitions, or conditions.   |
| `principles`    | Explains high-level, abstract concepts and their trade-offs. |
| `advantages`    | The benefits or positive trade-offs of a concept.            |
| `disadvantages` | The costs, risks, or negative trade-offs.                    |
| `recommended`   | Best practices and strong suggestions (SHOULD).              |
| `discouraged`   | Common mistakes and explicit prohibitions.                   |
| `criteria`      | Provides items for verification or assessment.               |
| `data`          | Provides a raw, structured block of information.             |
| `examples`      | Provides one or more illustrative examples.                  |
