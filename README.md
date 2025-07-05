# Copilot Instructions Builder CLI

A modular, extensible CLI for building GitHub Copilot instruction files from reusable components. This tool enables developers to create, manage, and share AI assistant instructions using a four-tier, versionable module system.

---

## 🚀 Overview

The Copilot Instructions Builder CLI transforms monolithic prompt files into a **modular, version-controlled, and shareable ecosystem**. It acts as a **Persona Builder**, letting you compose specialized AI personas by combining focused instruction modules across four knowledge tiers:

1. **Foundation**: Universal reasoning principles
2. **Principle**: Software engineering best practices
3. **Technology**: Tool- and language-specific knowledge
4. **Execution**: Step-by-step playbooks for concrete tasks

---

## ✨ Key Features

- **Modular instruction system**: Compose instructions from reusable modules
- **Four-tier architecture**: Logical layering from abstract principles to actionable steps
- **Versionable and shareable**: Track modules/personas in version control
- **Customizable personas**: Tailor AI assistants for any workflow or technology
- **CLI-driven and config-driven**: Flexible usage for all workflows

---

## 🏗️ Architecture

The CLI uses a layered architecture for clarity and scalability:

- **Foundation**: Universal truths (e.g., logic, reasoning)
- **Principle**: Engineering best practices (e.g., TDD, SOLID)
- **Technology**: Framework/language specifics (e.g., React, Python)
- **Execution**: Concrete playbooks (e.g., create API endpoint)

Modules are compiled in this order, ensuring logical, layered output.

For a detailed architectural plan, see [`docs/architecture-plan.md`](docs/architecture-plan.md) and [`docs/architecture.md`](docs/architecture.md).

---

## 🧩 Module System

- **Module**: Atomic unit of instruction (Markdown file with YAML frontmatter)
- **Tier**: Module scope and compilation priority (`foundation`, `principle`, `technology`, `execution`)
- **Subject**: Module topic, organized by directory path
- **Persona File**: JSON file defining a persona build (output file + required modules)
- **Module Index**: Pre-compiled JSON cache for fast lookup/search

See [`docs/module-system.md`](docs/module-system.md) for data structures and examples.

---

## 🛠️ Usage

### Workflows

- **Project-local**: Modules live in your project (default, recommended)
- **Centralized/global**: Share a master modules directory across projects

### CLI Commands

```bash
# Initialize project config
copilot-instructions init

# List modules
copilot-instructions list [--foundation] [--principle] [--technology] [--execution] [--tags react,frontend]

# Build instructions from modules
copilot-instructions build --foundation programming-fundamentals --principle frontend/react --execution ui-components

# Build from persona file
copilot-instructions build ./personas/my-persona.json

# Search modules
copilot-instructions search "api development"
```

See [`docs/usage.md`](docs/usage.md) for full CLI details and best practices.

---

## 📁 Directory Structure

```
copilot-instructions-builder/
├── src/
│   ├── core/           # Core engine, CLI, algorithms
│   ├── modules/        # Module discovery, loading, registry
│   ├── commands/       # CLI commands
│   ├── utils/          # Utilities, logging, errors
│   └── algorithms/     # Graph/topological algorithms
├── modules/            # Built-in instruction modules
├── templates/          # Output templates
├── config/             # Config schema and defaults
├── tests/              # Unit/integration tests
└── docs/               # Documentation
```

---

## 🧪 Testing & Quality

- **Unit tests**: Core algorithms, module system, CLI commands
- **Integration tests**: End-to-end workflows, real-world scenarios
- **Performance tests**: Large module sets, build times
- **Error handling tests**: Graceful failure, recovery

See [`docs/tasks.md`](docs/tasks.md) for implementation roadmap and testing priorities.

---

## 📚 References

- [Overview](./overview.md)
- [Architecture](./architecture.md)
- [Module System](./module-system.md)
- [Usage Guide](./usage.md)
- [4-Tier Model](./4-tier-model.md)
- [Task Implementation Roadmap](./tasks.md)

---

## 📝 Contributing

Contributions are welcome! Please see the documentation in [`docs/`](docs/) for architecture, module guidelines, and implementation tasks.

---

## License

This project is licensed under the MIT License.

---

_Last updated: July 2025_
