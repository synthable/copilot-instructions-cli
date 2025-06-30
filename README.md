# Copilot Instruction CLI

A modular CLI for building, layering, and managing instruction sets for GitHub Copilot from reusable templates and components.

## Features

- 🎯 **Modular Architecture**: Build instruction sets from reusable components
- 📚 **Template System**: Create and manage base templates and layers
- 🔧 **Flexible Composition**: Multiple merge strategies (append, prepend, merge, replace)
- 📁 **Multi-format Output**: Generate both JSON and Markdown instruction files
- 🚀 **Simple CLI**: Intuitive commands for all operations

## Installation

```bash
npm install -g copilot-instruction-cli
```

Or run locally:

```bash
git clone <your-repo-url>
cd copilot-instruction-cli
npm link
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

### Template Types

- **base**: Foundation templates that provide core instructions
- **layer**: Additional instruction sets that can be composed on top of base templates
- **component**: Reusable instruction fragments

### Merge Strategies

- **append**: Add layer instructions after base instructions
- **prepend**: Add layer instructions before base instructions
- **merge**: Deep merge layer into base (default)
- **replace**: Replace base instructions with layer instructions

## Directory Structure

```
~/.copilot-instructions/
├── templates/      # User-defined templates
├── output/         # Generated instruction sets
└── config.json     # CLI configuration
```

## Architecture

The CLI follows a modular architecture with these core components:

1. **CLI Core** (`src/core/cli.js`): Main entry point and command registration
2. **Template Manager** (`src/core/template-manager.js`): Handles template CRUD operations
3. **Layer Composer** (`src/core/layer-composer.js`): Implements composition strategies
4. **Command Handler** (`src/core/command.js`): Simple command parsing and execution
5. **Config Store** (`src/core/config-store.js`): Manages output generation and storage

## Examples

### Creating a custom web development instruction set

1. Create a base template:
```bash
copilot-instructions template:create web-base --type base
```

2. Edit the template at `~/.copilot-instructions/templates/web-base.json`

3. Build with additional layers:
```bash
copilot-instructions build my-web-app --base web-base --layers web-dev-layer security-layer
```

4. Find your generated instructions at:
   - JSON: `~/.copilot-instructions/output/my-web-app.json`
   - Markdown: `~/.copilot-instructions/output/my-web-app.md`

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run CLI locally
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Author

Created by Claude Opus 4