# Instructions Composer

[Build Status](#) &nbsp;&nbsp; [NPM Version](#) &nbsp;&nbsp; [License: GPL-3.0-or-later](./LICENSE)

> A CLI tool for building modular AI instructions. Treat your prompts like code.

---

The Instructions Composer helps you move away from monolithic, hard-to-maintain prompts and towards a structured, collaborative, and version-controlled workflow.

## Features

- **🧱 Modular by Design**: Break down large, complex prompts into small, reusable `Modules` that are easy to manage.
- **🧩 Composable**: Build powerful and targeted `Personas` by combining modules in a specific, layered order.
- **♻️ Reusable & Consistent**: Share modules across different personas to ensure consistency and save time.
- **✅ Version-Controlled**: Because instructions are defined in simple YAML files, you can use Git to track changes, review contributions, and manage history.
- **🔍 Discoverable**: Easily `list` and `search` your library of modules to find the building blocks you need.

## Getting Started

Get up and running with a single command to build the example persona.

```bash
# 1. Clone the repository
git clone https://github.com/synthable/copilot-instructions-cli.git
cd copilot-instructions-cli

# 2. Install dependencies
npm install

# 3. Build the example persona!
npm start build personas/cli-build-test-v1-0.persona.yml -o example-build.md
```

Now, check `example-build.md` to see the final, compiled instruction set.

## Core Concepts in Action: A 5-Minute Example

Here’s how you create your own persona from scratch.

#### Step 1: Create a Module

A module is a small, atomic piece of instruction. Create a file named `my-principle.module.yml`:

```yaml
# ./modules/my-principle.module.yml
id: principle.my-rule.be-concise
schemaVersion: '1.0'
description: 'Instructs the AI to be concise.'
meta:
  name: 'Be Concise'
  semantic: 'The AI should provide clear and concise answers.'
body:
  principles:
    - 'Be concise and to the point.'
```

#### Step 2: Create a Persona

A persona combines one or more modules. Create `my-persona.persona.yml`:

```yaml
# ./personas/my-persona.persona.yml
name: 'Concise Assistant'
description: 'A persona that is always concise.'
moduleGroups:
  - groupName: 'Core Principles'
    modules:
      - 'principle.my-rule.be-concise' # <-- Reference the module by its ID
```

#### Step 3: Build It!

Run the `build` command to compile your new persona:

```bash
npm start build ./personas/my-persona.persona.yml -o concise-assistant.md
```

That's it! You now have a custom-built instruction set in `concise-assistant.md`.

## CLI Command Reference

| Command    | Description                                                     | Example Usage                                |
| :--------- | :-------------------------------------------------------------- | :------------------------------------------- |
| `build`    | Compiles a `.persona.yml` into a single instruction document.   | `npm start build ./personas/my-persona.yml`  |
| `list`     | Lists all discoverable modules.                                 | `npm start list --tier technology`       |
| `search`   | Searches for modules by keyword.                                | `npm start search "error handling"`          |
| `validate` | Validates the syntax and integrity of module and persona files. | `npm start validate ./instructions-modules/` |
| `inspect`  | Inspects module conflicts and registry state.                   | `npm start inspect --conflicts-only` |

## Documentation

For a deep dive into the Unified Module System, advanced features, and configuration, please read our **[Comprehensive Guide](./docs/comprehensive_guide.md)**.

## Contributing

Contributions are welcome! We encourage you to open issues and submit pull requests. Please follow the existing code style and ensure all tests pass.

- Run tests: `npm run test`
- Check linting: `npm run lint`

## License

This project is licensed under the **[GPL-3.0-or-later](./LICENSE)**.
