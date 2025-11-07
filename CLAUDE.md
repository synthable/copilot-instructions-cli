# CLAUDE.md

## Sub-Agents

@.claude/SUB-AGENTS.md

## Purpose

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo workspace containing a CLI tool and supporting libraries for building and managing AI persona instructions from modular files using UMS (Unified Module System) v2.0. The project uses a four-tier module system (foundation, principle, technology, execution) where modules are composed into personas for different AI assistant roles. UMS v2.0 is TypeScript-first, providing full type safety and better IDE support.

## Development Commands

### Workspace Commands

```bash
# Build all packages in the workspace
npm run build

# Run all tests across packages
npm test

# Run tests for specific packages
npm run test:cli    # CLI package only
npm run test:ums    # UMS library only
npm run test:sdk    # SDK package only
npm run test:mcp    # MCP package only

# Run tests with coverage
npm run test:coverage
npm run test:cli:coverage    # CLI package coverage only
npm run test:ums:coverage    # UMS library coverage only
npm run test:sdk:coverage    # SDK package coverage only
npm run test:mcp:coverage    # MCP package coverage only

# Type checking across all packages
npm run typecheck

# Linting across all packages
npm run lint
npm run lint:fix

# Package-specific linting
npm run lint:cli
npm run lint:cli:fix
npm run lint:ums
npm run lint:ums:fix
npm run lint:sdk
npm run lint:sdk:fix
npm run lint:mcp
npm run lint:mcp:fix

# Code formatting across all packages
npm run format
npm run format:check

# Package-specific formatting
npm run format:cli
npm run format:cli:check
npm run format:ums
npm run format:ums:check
npm run format:sdk
npm run format:sdk:check
npm run format:mcp
npm run format:mcp:check

# Full quality check across all packages
npm run quality-check
```

### Individual Package Development

```bash
# Build specific packages
npm run build -w packages/ums-cli
npm run build -w packages/ums-lib
npm run build -w packages/ums-sdk
npm run build -w packages/ums-mcp

# Run tests for specific packages with coverage
npm run test:coverage -w packages/ums-cli
npm run test:coverage -w packages/ums-lib
npm run test:coverage -w packages/ums-sdk
npm run test:coverage -w packages/ums-mcp

# Run a specific test file
npx vitest run packages/ums-cli/src/commands/build.test.ts

# TypeScript build from root
npm run build:tsc
npm run build:tsc:clean
npm run build:tsc:force
```

### Git Hooks

```bash
# Pre-commit: runs typecheck and lint-staged
npm run pre-commit

# Pre-push: runs typecheck, tests, lint, and build
npm run pre-push
```

## Development Workflow

- You MUST commit only your work. Do NOT include changes from other team members or unrelated modifications.
- You MUST commit your changes in logical groups after completing a task.
- You MUST write your commits following the Convention Commits spec.
- You MUST run lint and fix any errors or failing tests related to your changes before committing.
- You MUST build the project and ensure no build errors, warnings, or type errors.
- You MUST ensure your code is well-documented and follows the project's coding standards.
- You MUST write unit tests for new features or bug fixes.
- Use feature branches and open PRs to `develop` after local verification.

- **Version Control**: Commit changes frequently, after completing every task. Use feature branches for new development. Open PRs for review targeting `develop` only after thorough testing.
- **Commit Messages**: Use clear and descriptive commit messages. Be concise with the subject line. Include issue references where applicable.
- **Pull Requests**: Ensure PRs pass all checks (lint, tests, build) before merging. Request reviews from team members.

## Development Practices

- **Code Style**: Follow the established code style guidelines (e.g., indentation, naming conventions) for consistency.
- **Code Reviews**: Conduct code reviews for all PRs. Provide constructive feedback and ensure adherence to coding standards.
- **Documentation**: Update documentation alongside code changes. Ensure all public APIs are well-documented.
- **Testing**: Write unit tests for new features and bug fixes. Ensure existing tests pass before merging.
- **Version Control**: Commit changes frequently with meaningful messages. Use branches for features and bug fixes.

## Project Architecture

### Monorepo Structure

- **Root Package**: Workspace configuration and shared dev dependencies
- **packages/ums-lib**: Reusable UMS v2.0 library for parsing, validation, and building (pure domain logic)
- **packages/ums-sdk**: Node.js SDK for UMS v2.0 providing file system operations and TypeScript module loading
- **packages/ums-cli**: Main CLI application using the SDK
- **packages/ums-mcp**: MCP server for AI assistant integration

### UMS Library Package (`packages/ums-lib`)

- **Core Library**: Platform-agnostic UMS v2.0 library providing pure domain logic
- **Responsibilities**: Module/persona parsing, validation, rendering, registry management
- **No I/O**: All file operations delegated to SDK layer
- **Dependencies**: None (pure library)

### UMS SDK Package (`packages/ums-sdk`)

- **Node.js SDK**: Provides file system operations and TypeScript module loading for UMS v2.0
- **Components**:
  - `loaders/` - ModuleLoader, PersonaLoader, ConfigManager
  - `discovery/` - ModuleDiscovery, StandardLibrary
  - `orchestration/` - BuildOrchestrator
  - `api/` - High-level convenience functions (buildPersona, validateAll, listModules)
- **Dependencies**: ums-lib, yaml, glob, tsx (for TypeScript execution)

### CLI Package (`packages/ums-cli`)

- **Entry Point**: `src/index.ts` - Commander.js setup with CLI commands (build, list, search, validate)
- **Commands**: `src/commands/` - Individual command handlers using SDK
  - `build.ts` - Build personas from .persona.ts files
  - `list.ts` - List available modules with optional tier filtering
  - `search.ts` - Search modules by query with tier filtering
  - `validate.ts` - Validate modules and persona files
  - `mcp.ts` - MCP server commands
- **Utils**: `src/utils/` - CLI-specific utilities (error handling, progress indicators, formatting)
- **Constants**: `src/constants.ts` - CLI configuration constants
- **Dependencies**: ums-sdk (uses SDK for all operations)

### Module System (UMS v2.1)

The `instruct-modules-v2/` directory contains modules organized by a cognitive hierarchy (levels 0-6):

- **Level 0**: Axioms and Ethics - Universal truths, ethical bedrock, non-negotiable principles
- **Level 1**: Reasoning Frameworks - How to think, analyze, and form judgments
- **Level 2**: Universal Patterns - Cross-domain patterns and principles that apply broadly
- **Level 3**: Domain-Specific Guidance - Field-specific but technology-agnostic best practices
- **Level 4**: Procedures and Playbooks - Step-by-step instructions and actionable guides
- **Level 5**: Specifications and Standards - Precise requirements, validation criteria, compliance rules
- **Level 6**: Meta-Cognition - Self-reflection, process improvement, learning from experience

**Note**: The project uses `instruct-modules-v2/` as the primary module directory (configured in `modules.config.yml`).

#### UMS v2.1 Module Structure

Modules are TypeScript files (`.module.ts`) with the following structure:

```typescript
import type { Module } from 'ums-lib';
import { CognitiveLevel, ComponentType } from 'ums-lib';

export const moduleName: Module = {
  id: 'module-id',
  version: '1.0.0',
  schemaVersion: '2.1',
  capabilities: ['capability1', 'capability2'],
  cognitiveLevel: CognitiveLevel.UNIVERSAL_PATTERNS, // 0-6
  domain: 'language-agnostic', // Optional: where it applies
  metadata: {
    name: 'Human-Readable Name',
    description: 'Brief description',
    semantic: 'Dense, keyword-rich description for AI search',
    tags: ['pattern', 'best-practice'], // Optional: additional keywords
  },
  // Component-based content structure
  instruction?: {
    type: ComponentType.Instruction,
    instruction: {
      purpose: 'What to accomplish',
      process?: ['step1', { step: 'step2', notes: ['detail'] }],
      constraints?: ['MUST follow rule', { rule: 'SHOULD do this', notes: ['example'] }],
      principles?: ['High-level guideline'],
      criteria?: ['Success metric', { item: 'MUST verify', category: 'Quality', notes: ['test step'] }]
    }
  },
  knowledge?: {
    type: ComponentType.Knowledge,
    knowledge: {
      explanation: 'Conceptual overview',
      concepts?: [{ name: 'Concept', description: 'Explanation', rationale: 'Why' }],
      examples?: [{ title: 'Example', rationale: 'What it shows', snippet: 'code', language: 'typescript' }],
      patterns?: [{ name: 'Pattern', useCase: 'When to use', description: 'How it works' }]
    }
  },
  data?: {
    type: ComponentType.Data,
    data: {
      format: 'json',
      value: { /* data */ },
      description: 'What this represents'
    }
  }
};
```

**Key Features:**

- TypeScript-first with full type safety
- Named exports using camelCase transformation of module ID
- Component-based architecture (Instruction, Knowledge, Data)
- Cognitive hierarchy classification (0-6 levels)
- Capabilities array for functional classification
- Domain field for technology/field specificity
- Simplified directive structures (ProcessStep, Constraint, Criterion with optional notes)

**Breaking Changes from v2.0:**

- Removed `ModuleRelationships` (replaced by external graph tool)
- Removed `QualityMetadata` component
- Removed `ProblemSolution` component
- Simplified `ProcessStep` (removed `detail`, `validate`, `when`, `do`)
- Simplified `Constraint` (removed `severity`, `when`, `examples`, `rationale`)
- Simplified `Criterion` (removed `severity`, added `category` and `notes`)

### Persona Configuration

Personas are defined in `.persona.ts` files (UMS v2.1 format):

```typescript
import type { Persona } from 'ums-lib';

export default {
  id: 'persona-id',
  name: 'Persona Name',
  version: '1.0.0',
  schemaVersion: '2.1',
  description: 'Brief description',
  semantic: 'Dense, keyword-rich description',
  identity: 'Persona voice, traits, and capabilities',
  tags: ['keyword1', 'keyword2'],
  domains: ['backend', 'api'],
  modules: [
    'module-id-1',
    'module-id-2',
    {
      group: 'Group Name',
      ids: ['module-3', 'module-4'],
    },
  ],
} satisfies Persona;
```

**Key Features:**

- TypeScript format with type checking
- Supports both flat module arrays and grouped modules
- Default or named exports supported
- Full IDE autocomplete and validation
- Optional `identity` field for persona prologue
- Optional `tags` and `domains` for classification

## Testing

- **Framework**: Vitest with v8 coverage
- **Test Files**: `*.test.ts` files alongside source files in each package
- **Coverage Requirements**: Individual packages may have specific coverage targets
- **Test Commands**: Use `npm test` for all packages, package-specific commands for targeted testing

## CLI Usage Examples

### Production Usage

```bash
# Build a persona from configuration (UMS v2.0)
ums build --persona ./personas/my-persona.persona.ts

# Build with custom output
ums build --persona ./personas/my-persona.persona.ts --output ./dist/my-persona.md

# List all modules
ums list

# List modules by tier
ums list --tier foundation

# Search for modules
ums search "logic"

# Search with tier filtering
ums search "reasoning" --tier foundation

# Validate all modules and personas
ums validate

# Validate specific path
ums validate ./instructions-modules

# MCP server commands
ums mcp start --transport stdio
ums mcp test
ums mcp validate-config
ums mcp list-tools
```

### Development Usage

```bash
# Use the built CLI directly (after npm run build)
node packages/ums-cli/dist/index.js build --persona ./personas/my-persona.persona.ts
node packages/ums-cli/dist/index.js list
node packages/ums-cli/dist/index.js search "reasoning"
node packages/ums-cli/dist/index.js validate
node packages/ums-cli/dist/index.js mcp start --transport stdio
```

## Development Notes

- **Monorepo**: Uses npm workspaces for package management
- **ES Modules**: All packages use ES modules (type: "module")
- **TypeScript**: Compilation includes `.js` extensions for imports
- **TypeScript Module Loading**: SDK uses `tsx` for on-the-fly TypeScript execution
- **Git Hooks**: Configured with husky for pre-commit and pre-push checks
- **CLI Binary**: Published as `ums` (alias `copilot-instructions`) with binary at `packages/ums-cli/dist/index.js`
- **Node.js**: Requires version 22.0.0 or higher
- **Lint-staged**: Pre-commit formatting and linting across all packages
- **Architecture**: Three-tier architecture (ums-lib → ums-sdk → CLI)
- **Dependencies**:
  - CLI depends on ums-sdk for all operations
  - ums-sdk depends on ums-lib for domain logic
  - ums-lib has no dependencies (pure library)

## Module System Details

### Four-Tier Waterfall Architecture

The system enforces strict layering during compilation:

1. **Foundation** (layers 0-5, validated in code but currently only 0-4 used): Universal cognitive frameworks and logic
2. **Principle**: Technology-agnostic methodologies and patterns
3. **Technology**: Specific tools, languages, and frameworks
4. **Execution**: Step-by-step procedures and playbooks

This creates a logical hierarchy moving from abstract concepts to concrete actions, ensuring consistent AI reasoning patterns.

## Important Instructions

### Behavioral Guidelines

- **Avoid Sycophantic Behavior**: Do not engage in excessive praise or flattery toward users. Maintain a neutral and professional tone, focusing on accuracy and usefulness over compliments. Prioritize clarity and helpfulness without resorting to flattery or overly complimentary language.
- **UMS v2.1 Migration**: The project has migrated to UMS v2.1 (TypeScript-first). All new modules and personas should use TypeScript format (.module.ts and .persona.ts).
- **Breaking Changes**: UMS v2.1 introduces breaking changes from v2.0. File formats, module structure, and APIs have changed significantly.

### Module Configuration

- **Primary Module Directory**: `instruct-modules-v2/` (configured in `modules.config.yml`)
- **Module File Format**: `.module.ts` (TypeScript, UMS v2.1)
- **Persona File Format**: `.persona.ts` (TypeScript, UMS v2.1)
- **Conflict Resolution**: Configurable (error, warn, replace strategies)
- **Module ID Pattern**: Kebab-case format (e.g., `error-handling`, `foundation/ethics/do-no-harm`)
- **Export Convention**: Named exports using camelCase transformation of module ID
- **Coverage Requirements**: Tests maintain 80% coverage across branches, functions, lines, and statements

## Resources

- **UMS v2.1 Specification**: `docs/spec/unified_module_system_v2_spec.md`
- **Commands Documentation**: `.claude/COMMANDS.md`
