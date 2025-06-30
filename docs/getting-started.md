# Getting Started

This guide will walk you through installing the Copilot Instructions Builder CLI and starting your first project.

## Installation

To use the CLI, you need to have Node.js (version 18.0.0 or higher) installed. You can install the CLI globally using npm:

```bash
npm install -g copilot-instructions
```
This will make the `copilot-instructions` command available in your terminal.

## Initialize a New Project

Once installed, you can initialize a new project. Navigate to your desired project directory and run:

```bash
copilot-instructions init
```
This command creates a default configuration file (usually `copilot-instructions.config.js`) in your current directory. This file is where you'll define your instruction profiles, modules, and variables.

After initialization, you'll want to understand and customize this configuration. Learn more about it in the **[Configuration Guide](./configuration.md)**.
