# Copilot Instruction CLI

A modular CLI for building, layering, and managing instruction sets for GitHub Copilot.

## Installation

```bash
npm install -g copilot-instruction-cli
```

## Usage

### Create a new template
```bash
copilot-instructions template:create my-template --type base
```

### List available templates
```bash
copilot-instructions template:list
```

### Build instruction set with layers
```bash
copilot-instructions build my-instructions --base default --layers web-dev-layer security-layer
```

### Add a layer to existing instructions
```bash
copilot-instructions layer:add performance-layer my-instructions
```

## Template Structure

Templates are JSON files with the following structure:

```json
{
  "name": "template-name",
  "type": "base|layer|component",
  "version": "1.0.0",
  "strategy": "merge|append|prepend|replace",
  "instructions": [
    {
      "type": "section",
      "title": "Section Title",
      "instructions": ["instruction 1", "instruction 2"]
    }
  ]
}
```

## Directory Structure

```
~/.copilot-instructions/
├── templates/      # User-defined templates
├── output/         # Generated instruction sets
└── config.json     # CLI configuration
```
