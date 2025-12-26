# UMS MCP Server

[![License](https://img.shields.io/badge/license-GPL--3.0--or--later-blue.svg)](https://github.com/synthable/copilot-instructions-cli/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

MCP (Model Context Protocol) server for the Unified Module System (UMS). Enables AI assistants like Claude Desktop to discover modules, build personas, and validate UMS content.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Available Tools](#available-tools)
- [Architecture](#architecture)
- [Usage with Claude Desktop](#usage-with-claude-desktop)
- [CLI Commands](#cli-commands)
- [Development](#development)
- [API Reference](#api-reference)
- [License](#license)

## Overview

The UMS MCP Server provides AI assistants with programmatic access to UMS functionality through the Model Context Protocol. It exposes four tools:

- **ums_build_persona**: Build personas from `.persona.ts` files
- **ums_list_modules**: List and filter available modules
- **ums_validate_modules**: Validate modules and personas
- **ums_search_modules**: Search modules by query string

The server follows a layered architecture, delegating all UMS logic to the `ums-sdk` package.

## Installation

```bash
npm install ums-mcp
```

The server requires Node.js 22.0.0 or higher.

### Dependencies

- **@modelcontextprotocol/sdk**: MCP protocol implementation
- **ums-sdk**: UMS operations (build, validate, list, search)
- **zod**: Input validation

## Quick Start

### Start via CLI

```bash
# Using the ums CLI (recommended)
ums mcp start --transport stdio

# Or directly
node packages/ums-mcp/dist/index.js
```

### Programmatic Usage

```typescript
import { startMCPServer } from 'ums-mcp';

// Start with stdio transport (for Claude Desktop)
await startMCPServer('stdio');
```

## Available Tools

### ums_build_persona

Build a persona from a `.persona.ts` file, rendering all referenced modules into markdown.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `personaPath` | string | Yes | Path to the `.persona.ts` file |
| `includeStandard` | boolean | No | Include standard library modules (default: true) |
| `emitDeclarations` | boolean | No | Emit TypeScript declaration files (default: false) |

**Example:**
```json
{
  "personaPath": "./personas/developer.persona.ts",
  "includeStandard": true
}
```

### ums_list_modules

List all available UMS modules with optional filtering.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `capability` | string | No | Filter by capability (e.g., "reasoning", "coding") |
| `tag` | string | No | Filter by tag |
| `includeStandard` | boolean | No | Include standard library modules (default: true) |

**Example:**
```json
{
  "capability": "reasoning",
  "includeStandard": true
}
```

### ums_validate_modules

Validate all modules and personas in the workspace.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `includePersonas` | boolean | No | Also validate persona files (default: true) |
| `includeStandard` | boolean | No | Include standard library modules (default: true) |

**Example:**
```json
{
  "includePersonas": true,
  "includeStandard": true
}
```

### ums_search_modules

Search for modules by query string.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Search query to match against module names, descriptions, and IDs |
| `capability` | string | No | Filter results by capability |
| `limit` | number | No | Maximum results to return (default: 10, max: 100) |

**Example:**
```json
{
  "query": "error handling",
  "capability": "debugging",
  "limit": 5
}
```

## Architecture

The MCP server follows a layered architecture for maintainability and testability:

```
┌─────────────────────────────────────────────────────────────┐
│                    MCP Layer (server.ts)                     │
│  - McpServer setup                                          │
│  - Tool registration                                        │
│  - Request/response handling                                │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                   Tool Handlers (handlers/)                  │
│  - Input validation (Zod)                                   │
│  - Orchestration                                            │
│  - Response formatting                                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                Application Services (services/)              │
│  - PersonaService: Build personas                           │
│  - ModuleService: List and search modules                   │
│  - ValidationService: Validate modules and personas         │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                      ums-sdk                                 │
│  - buildPersona(), listModules(), validateAll()             │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
packages/ums-mcp/src/
├── index.ts              # Entry point
├── server.ts             # MCP server setup & tool registration
├── schemas/
│   └── index.ts          # Zod input schemas
├── formatters/
│   ├── index.ts          # Formatter exports
│   ├── build-result.ts   # Format BuildResult → markdown/structured
│   ├── module-list.ts    # Format ModuleInfo[] → markdown/structured
│   ├── validation-report.ts  # Format ValidationReport
│   └── search-result.ts  # Format search results
├── services/
│   ├── index.ts          # Service exports
│   ├── persona-service.ts    # Facade → ums-sdk buildPersona
│   ├── module-service.ts     # Facade → ums-sdk listModules + search
│   └── validation-service.ts # Facade → ums-sdk validateAll
├── handlers/
│   ├── index.ts          # Handler exports
│   ├── build-persona.ts  # Build persona handler
│   ├── list-modules.ts   # List modules handler
│   ├── validate-modules.ts   # Validate handler
│   └── search-modules.ts # Search handler
└── errors/
    └── index.ts          # MCPError classes
```

## Usage with Claude Desktop

### Configuration

Add the UMS MCP server to your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ums": {
      "command": "node",
      "args": ["/path/to/packages/ums-mcp/dist/index.js"],
      "cwd": "/path/to/your/ums-project"
    }
  }
}
```

### Validate Configuration

```bash
ums mcp validate-config
```

This checks if your Claude Desktop configuration correctly references the UMS MCP server.

### Test the Server

```bash
ums mcp test
```

Runs a quick test to verify the server starts correctly and responds to requests.

## CLI Commands

The `ums` CLI provides commands for working with the MCP server:

```bash
# Start the MCP server
ums mcp start --transport stdio

# List available tools
ums mcp list-tools
ums mcp list-tools --verbose  # Show parameter details

# Test the server
ums mcp test

# Validate Claude Desktop configuration
ums mcp validate-config
```

## Development

### Setup

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Type checking
npm run typecheck
```

### Running in Development

```bash
# Watch mode with tsx
npm run dev

# Or build and run
npm run build && npm start
```

### Adding a New Tool

1. **Add Zod schema** in `schemas/index.ts`
2. **Add formatter** in `formatters/` (if new output type)
3. **Add service method** in `services/` (if new SDK operation)
4. **Create handler** in `handlers/`
5. **Register tool** in `server.ts`

### Testing

```bash
# Run all tests
npm test

# Run specific test
npx vitest run src/index.test.ts

# Coverage report
npm run test:coverage
```

## API Reference

### Entry Point

```typescript
import { startMCPServer } from 'ums-mcp';

// Start with stdio transport
await startMCPServer('stdio');

// HTTP and SSE transports are reserved for future implementation
await startMCPServer('http');  // Not yet implemented
await startMCPServer('sse');   // Deprecated
```

### Services

| Service | Methods | Description |
|---------|---------|-------------|
| `PersonaService` | `build(path, options)` | Build a persona |
| `ModuleService` | `list(options)`, `search(query, options)` | List and search modules |
| `ValidationService` | `validateAll(options)` | Validate modules and personas |

### Error Types

| Error | Description |
|-------|-------------|
| `MCPError` | Base MCP error |
| `MCPToolError` | Tool execution failed |
| `MCPValidationError` | Input validation failed |
| `MCPNotFoundError` | Resource not found |

### Response Format

All tools return responses with both human-readable and structured content:

```typescript
{
  content: [{ type: 'text', text: '# Markdown formatted output...' }],
  structuredContent: {
    success: true,
    // Tool-specific structured data
  }
}
```

## Relationship to Other Packages

### Dependencies

- **ums-sdk**: All UMS operations (build, validate, list, search)
- **@modelcontextprotocol/sdk**: MCP protocol implementation
- **zod**: Input schema validation

### Consumers

- **Claude Desktop**: Via MCP protocol
- **ums-cli**: `ums mcp` commands for server management
- **Other MCP clients**: Any client implementing the MCP protocol

## License

GPL-3.0-or-later

Copyright (c) 2025 synthable

This package is part of the Instructions Composer monorepo.

## Resources

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [UMS SDK Documentation](../ums-sdk/README.md)
- [GitHub Repository](https://github.com/synthable/copilot-instructions-cli)
- [Issues](https://github.com/synthable/copilot-instructions-cli/issues)
