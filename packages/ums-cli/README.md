# UMS CLI

A CLI tool for composing, managing, and building modular AI assistant instructions using the Unified Module System (UMS) v2.0 TypeScript format.

> **Status:** the CLI is in the middle of a UMS v1 → v2 migration. The commands documented below reflect the currently implemented, TypeScript-first behaviors.

**Package name**: `ums-cli`
**Binary commands**: `copilot-instructions`, `ums`

## Installation

```bash
npm install -g ums-cli
```

## Usage

**Note**: You can use either `copilot-instructions` or `ums` as the binary name. Both execute the same CLI entry point.

Most commands expect module discovery to be configured through a `modules.config.yml` file (see [Configuration](#configuration)).

### Build Instructions

```bash
# Build from persona file
copilot-instructions build --persona ./personas/my-persona.persona.ts
# or: ums build --persona ./personas/my-persona.persona.ts

# Build with custom output
copilot-instructions build --persona ./personas/my-persona.persona.ts --output ./dist/instructions.md
```

Requirements:

- The persona must be a TypeScript `.persona.ts` file that exports a UMS v2.0 `Persona` object.
- All referenced modules must be discoverable through `modules.config.yml` (there is no implicit `instructions-modules/` fallback).
- Standard input piping is **not** supported yet; pass `--persona` explicitly.

### List Modules

```bash
# List all modules
copilot-instructions list

# Filter by cognitive level
copilot-instructions list --level 0
copilot-instructions list --level 2,3

# Filter by capability
copilot-instructions list --capability testing
copilot-instructions list --capability testing,debugging

# Filter by domain
copilot-instructions list --domain typescript

# Filter by tags
copilot-instructions list --tag best-practices

# Combine multiple filters
copilot-instructions list --level 2 --capability testing --domain typescript
```

Lists modules resolved through `modules.config.yml` with optional filtering by cognitive level (0-6), capabilities, domain, or tags.

### Search Modules

```bash
# Search by keyword
copilot-instructions search "react"

# Search with filters
copilot-instructions search "error" --level 2
copilot-instructions search "testing" --capability debugging
copilot-instructions search "async" --domain typescript

# Combine multiple filters
copilot-instructions search "pattern" --level 2,3 --capability architecture
```

Performs a case-insensitive substring search across module metadata (name, description, semantic, tags) for all modules discovered via `modules.config.yml`. Supports filtering by cognitive level, capabilities, domain, and tags.

### Validate

```bash
# Validation entry point (prints TypeScript guidance)
copilot-instructions validate

# Verbose mode (adds extra tips)
copilot-instructions validate --verbose
```

At present the command emits instructions for running `tsc --noEmit`. Runtime validation for UMS v2.0 modules/personas is on the roadmap.

### Inspect Registry

```bash
# Inspect registry summary
copilot-instructions inspect

# Show only conflicts
copilot-instructions inspect --conflicts-only

# Inspect a single module ID
copilot-instructions inspect --module-id foundation/design/user-centric-thinking

# Emit JSON for tooling
copilot-instructions inspect --format json
```

Provides visibility into the module registry created from discovery, including conflict diagnostics and source annotations.

### MCP Development Helpers

The `mcp` command group wraps developer utilities for the MCP server bundled with this repository:

```bash
copilot-instructions mcp start --transport stdio
copilot-instructions mcp test --verbose
copilot-instructions mcp validate-config
copilot-instructions mcp list-tools
```

These commands are primarily used when iterating on the MCP server in `packages/ums-mcp`.

## Configuration

The CLI resolves modules exclusively through `modules.config.yml`. A minimal example:

```yaml
conflictStrategy: warn
localModulePaths:
    - path: ./instructions-modules-v2
        onConflict: replace
    - path: ./overrides
```

- Omit `conflictStrategy` to default to `error`.
- Each `localModulePaths` entry must point to a directory containing `.module.ts` files.
- Paths are resolved relative to the current working directory.
- Standard-library modules are not loaded automatically; include them explicitly if needed.

## Features

- ✅ **TypeScript-first builds**: Render UMS v2.0 personas by composing `.module.ts` files
- ✅ **Config-driven discovery**: Load modules via `modules.config.yml` with conflict strategies
- ✅ **Registry inspection**: Diagnose conflicts and sources with `inspect`
- ✅ **MCP tooling**: Run and probe the bundled MCP server from the CLI
- ⚠️ **Validation via TypeScript**: Use `tsc --noEmit`; dedicated runtime validation is still on the roadmap

### Limitations

- Standard input builds are not yet supported—always supply `--persona`.
- Module discovery currently ignores implicit standard libraries; configure every path explicitly.
- Runtime validation for UMS v2.0 modules/personas is pending future iterations.

## Project Structure

The CLI expects this directory structure:

```
your-project/
├── modules.config.yml             # Discovery configuration (required)
├── instruct-modules-v2/           # One or more module directories listed in config
│   ├── modules/                   # Organized by domain/category
│   │   ├── communication/
│   │   ├── testing/
│   │   ├── typescript/
│   │   └── ...
└── personas/                      # Persona TypeScript files
    └── my-persona.persona.ts
```

Modules are organized by domain and category rather than rigid tiers. Use the `cognitiveLevel` field (0-6) to indicate abstraction level.

## Dependencies

This CLI uses the `ums-lib` library for all UMS operations, ensuring consistency and reusability.

## License

GPL-3.0-or-later
