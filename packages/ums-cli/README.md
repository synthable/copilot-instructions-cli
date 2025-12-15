# UMS CLI

A CLI tool for composing, managing, and building modular AI assistant instructions using the Unified Module System (UMS) v2.0 TypeScript format.

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
# Build from persona file (outputs to stdout)
copilot-instructions build --persona ./personas/my-persona.persona.ts

# Build with custom output file
copilot-instructions build --persona ./personas/my-persona.persona.ts --output ./dist/instructions.md

# Build with verbose output
copilot-instructions build --persona ./personas/my-persona.persona.ts --output ./dist/instructions.md --verbose

# Build with TypeScript declaration files
copilot-instructions build --persona ./personas/my-persona.persona.ts --output ./dist/instructions.md --emit-declarations
```

**Options:**

- `--persona, -p <file>` — Path to the persona configuration file (`.persona.ts`). **Required.**
- `--output, -o <file>` — Specify the output file for the build. If omitted, outputs to stdout.
- `--verbose, -v` — Enable verbose output with detailed progress.
- `--emit-declarations, -e` — Emit TypeScript declaration files (`.d.ts`) for modules.

**Output files (when `--output` is specified):**

- `<output>.md` — The compiled persona instructions in Markdown format.
- `<output>.build.json` — A JSON build report with metadata about the build.
- `declarations/` — TypeScript declaration files (when `--emit-declarations` is used).

**Requirements:**

- The persona must be a TypeScript `.persona.ts` file that exports a UMS v2.0 `Persona` object.
- All referenced modules must be discoverable through `modules.config.yml`.

### List Modules

```bash
# List all modules
copilot-instructions list

# Filter by cognitive level (numeric or enum name)
copilot-instructions list --level 0
copilot-instructions list --level 2,3
copilot-instructions list --level UNIVERSAL_PATTERNS

# Filter by capability
copilot-instructions list --capability testing
copilot-instructions list --capability testing,debugging

# Filter by domain
copilot-instructions list --domain typescript

# Filter by tags
copilot-instructions list --tag best-practices
copilot-instructions list --tag tdd

# Combine multiple filters
copilot-instructions list --level 2 --capability testing --domain typescript
```

**Options:**

- `--level, -l <levels>` — Filter by cognitive level (numeric 0-6 or enum name, comma-separated).
- `--capability, -c <capabilities>` — Filter by capabilities (comma-separated).
- `--domain, -d <domains>` — Filter by domains (comma-separated).
- `--tag, -t <tags>` — Filter by tags (comma-separated).
- `--verbose, -v` — Enable verbose output.

Lists modules resolved through `modules.config.yml` with optional filtering. Results are sorted by module name.

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
copilot-instructions search "testing" --capability quality-assurance --tag tdd
```

**Options:**

- `<query>` — Search query (required argument).
- `--level, -l <levels>` — Filter by cognitive level (numeric or enum name, comma-separated).
- `--capability, -c <capabilities>` — Filter by capabilities (comma-separated).
- `--domain, -d <domains>` — Filter by domains (comma-separated).
- `--tag, -t <tags>` — Filter by tags (comma-separated).
- `--verbose, -v` — Enable verbose output.

Performs a case-insensitive substring search across module metadata (name, description, and tags) for all modules discovered via `modules.config.yml`.

### Validate

```bash
# Validate all modules and personas
copilot-instructions validate

# Validate a specific path
copilot-instructions validate ./instructions-modules
copilot-instructions validate ./personas/my-persona.persona.ts

# Verbose mode (shows detailed validation steps and warnings)
copilot-instructions validate --verbose
```

**Options:**

- `[path]` — Path to validate (file or directory). Defaults to current directory (`.`).
- `--verbose, -v` — Enable verbose output with detailed validation steps.

Performs runtime validation of UMS v2.0 modules and personas, checking:

- Module structure and required fields
- Persona composition and module references
- UMS v2.0 specification compliance

Displays a summary of valid/invalid modules and personas, with detailed error messages for any failures.

### Inspect Registry

```bash
# Inspect registry overview
copilot-instructions inspect

# Show only modules with conflicts
copilot-instructions inspect --conflicts-only

# Show registry sources summary
copilot-instructions inspect --sources

# Inspect a specific module
copilot-instructions inspect --module-id foundation/design/user-centric-thinking

# Output as JSON for tooling
copilot-instructions inspect --format json

# Verbose mode with additional details
copilot-instructions inspect --verbose
```

**Options:**

- `--module-id, -m <id>` — Inspect a specific module for conflicts.
- `--conflicts-only, -c` — Show only modules with conflicts.
- `--sources, -s` — Show registry sources summary.
- `--format, -f <format>` — Output format: `table` (default) or `json`.
- `--verbose, -v` — Enable verbose output with detailed information.

Provides visibility into the module registry created from discovery, including:

- Registry overview (total modules, entries, conflicts, sources)
- Conflict diagnostics with source annotations
- Resolution strategy results

### MCP Development Helpers

> **Note:** MCP commands are currently stubs and not yet implemented. They are placeholders for future MCP server integration.

```bash
copilot-instructions mcp start --transport stdio
copilot-instructions mcp start --transport http --debug
copilot-instructions mcp test --verbose
copilot-instructions mcp validate-config
copilot-instructions mcp list-tools
```

**Available subcommands:**

- `mcp start` — Start the MCP server (options: `--transport <stdio|http|sse>`, `--debug`, `--verbose`).
- `mcp test` — Test MCP server with sample requests.
- `mcp validate-config` — Validate Claude Desktop MCP configuration.
- `mcp list-tools` — List available MCP tools.

## Configuration

The CLI resolves modules exclusively through `modules.config.yml`. A minimal example:

```yaml
conflictStrategy: warn
localModulePaths:
  - path: ./instruct-modules-v2
    onConflict: replace
  - path: ./overrides
```

- `conflictStrategy` — How to handle module conflicts globally (`error` or `warn`). Defaults to `error`.
- `localModulePaths` — Array of module directories to discover.
  - `path` — Directory containing `.module.ts` files.
  - `onConflict` — Override strategy for this path (`replace`, `skip`, etc.).

Paths are resolved relative to the current working directory.

## Features

- ✅ **TypeScript-first builds**: Render UMS v2.0 personas by composing `.module.ts` files
- ✅ **Config-driven discovery**: Load modules via `modules.config.yml` with conflict strategies
- ✅ **Runtime validation**: Validate modules and personas against UMS v2.0 specification
- ✅ **Registry inspection**: Diagnose conflicts and sources with `inspect`
- ✅ **Flexible filtering**: Filter modules by cognitive level, capability, domain, or tags
- ⚠️ **MCP tooling**: MCP server commands are stubs (not yet implemented)

### Limitations

- Standard input (stdin) builds are not supported—always supply `--persona`.
- Module discovery requires explicit configuration via `modules.config.yml`.

## Project Structure

The CLI expects this directory structure:

```
your-project/
├── modules.config.yml             # Discovery configuration (required)
├── instruct-modules-v2/           # Module directories listed in config
│   ├── modules/                   # Organized by domain/category
│   │   ├── communication/
│   │   ├── testing/
│   │   ├── typescript/
│   │   └── ...
└── personas/                      # Persona TypeScript files
    └── my-persona.persona.ts
```

Modules are organized by domain and category. Use the `cognitiveLevel` field to indicate abstraction level.

## Dependencies

This CLI uses the `ums-sdk` library for module discovery, building, and validation.

## License

GPL-3.0-or-later
