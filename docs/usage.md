# Usage

This section explains how to use the Copilot Instructions Builder CLI to manage and build your instruction sets.

## Table of Contents
- [Quick Build with Modules](#quick-build-with-modules)
- [List Available Modules](#list-available-modules)
- [CLI Commands](#cli-commands)
  - [Core Operations](#core-operations)
  - [Configuration-Driven Operations](#configuration-driven-operations)
- [Examples](#examples)
  - [Building a React Frontend Project](#building-a-react-frontend-project)
  - [Building a Node.js API](#building-a-nodejs-api)
  - [Custom Module Discovery](#custom-module-discovery)

## Quick Build with Modules

You can quickly build instruction files by specifying modules directly on the command line or by using a project configuration file.

```bash
# Build with specific modules
copilot-instructions build --base programming-fundamentals --domain frontend/react --task ui-components

# Build from configuration file
copilot-instructions build
```
Building from a configuration file is powerful for managing complex setups. See the **[Configuration Guide](./configuration.md)** for details on this file.

```bash
# Build specific profile from configuration
copilot-instructions build --profile production
```
Profiles are also defined in the **[Configuration Guide](./configuration.md)**.

## List Available Modules

Discover available modules that you can use in your project:

```bash
# List all modules
copilot-instructions list

# Filter by type and tags
copilot-instructions list --type domain --tags react,frontend
```

## CLI Commands

The CLI offers a range of commands for various operations.

### Core Operations

These commands work directly without necessarily needing a full configuration file, though some can be influenced by it.

```bash
# Initialize project configuration (creates copilot-instructions.config.js)
copilot-instructions init
# Learn more in the [Getting Started Guide](./getting-started.md#initialize-a-new-project) and [Configuration Guide](./configuration.md)

# List available modules
copilot-instructions list [--type base|domain|task] [--tags react,frontend]

# Build instructions from modules specified directly
copilot-instructions build --base programming-fundamentals --domain frontend/react --task ui-components

# Add module to an existing config file (if present)
copilot-instructions add frontend/vue
# This modifies your [copilot-instructions.config.js](./configuration.md)

# Validate configuration
copilot-instructions validate
# Checks the syntax and integrity of your [copilot-instructions.config.js](./configuration.md)

# Show module dependencies
copilot-instructions deps frontend/react

# Search modules
copilot-instructions search "api development"
```

### Configuration-Driven Operations

These commands primarily rely on a `copilot-instructions.config.js` file. See the **[Configuration Guide](./configuration.md)** for how to set this up.

```bash
# Build from configuration file (uses default profile or requires one if no default)
copilot-instructions build

# Build specific profile defined in the configuration
copilot-instructions build --profile production

# Use custom config file path
copilot-instructions build --config ./configs/backend.config.js

# Build all profiles defined in the configuration
copilot-instructions build --all-profiles
```

## Examples

Here are a few examples of how you might use the CLI.

### Building a React Frontend Project

```bash
# Quick command approach (modules specified directly)
copilot-instructions build \
  --base programming-fundamentals,code-quality \
  --domain frontend/react \
  --task ui-components,performance-optimization

# Configuration approach (modules defined in copilot-instructions.config.js)
copilot-instructions init
# Then, edit copilot-instructions.config.js (see [Configuration Guide](./configuration.md))
copilot-instructions build --profile frontend
```

### Building a Node.js API

```bash
# Example using direct module specification
copilot-instructions build \
  --base programming-fundamentals,documentation \
  --domain backend/nodejs \
  --task api-development,database-design
```

### Custom Module Discovery

```bash
# Search for modules related to "testing"
copilot-instructions search "testing"

# Search for modules related to "performance"
copilot-instructions search "performance"

# List task modules tagged with "api" and "backend"
copilot-instructions list --type task --tags api,backend
```
