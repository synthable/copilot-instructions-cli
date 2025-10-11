@.claude/AGENTS.md
@.claude/COMMANDS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo workspace containing a CLI tool and supporting libraries for building and managing AI persona instructions from modular files using UMS (Unified Module System) v1.0. The project uses a four-tier module system (foundation, principle, technology, execution) where modules are composed into personas for different AI assistant roles.

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

# Run tests with coverage
npm run test:coverage
npm run test:cli:coverage    # CLI package coverage only
npm run test:ums:coverage    # UMS library coverage only

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

# Code formatting across all packages
npm run format
npm run format:check

# Package-specific formatting
npm run format:cli
npm run format:cli:check
npm run format:ums
npm run format:ums:check

# Full quality check across all packages
npm run quality-check
```

### Individual Package Development

```bash
# Build specific packages
npm run build -w packages/copilot-instructions-cli
npm run build -w packages/ums-lib

# Run tests for specific packages with coverage
npm run test:coverage -w packages/copilot-instructions-cli
npm run test:coverage -w packages/ums-lib

# Run a specific test file
npx vitest run packages/copilot-instructions-cli/src/commands/build.test.ts

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
- You MUST commit your changes in logical chunks after completing a task.
- You MUST run lints and tests and ensure all pass before committing.
- You MUST ensure your code is well-documented and follows the project's coding standards.
- You MUST write unit tests for new features or bug fixes.

- **Version Control**: Commit changes frequently with meaningful messages. Use feature branches for new development. Open PRs for review into `main` only after thorough testing.
- **Commit Messages**: Use clear and descriptive commit messages. Include issue references where applicable. Follow Convention Commits spec.
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
- **packages/copilot-instructions-cli**: Main CLI application
- **packages/ums-lib**: Reusable UMS v1.0 library for parsing, validation, and building

### CLI Package (`packages/copilot-instructions-cli`)

- **Entry Point**: `src/index.ts` - Commander.js setup with CLI commands (build, list, search, validate)
- **Commands**: `src/commands/` - Individual command handlers
  - `build.ts` - Build personas from .persona.yml files
  - `list.ts` - List available modules with optional tier filtering
  - `search.ts` - Search modules by query with tier filtering
  - `validate.ts` - Validate modules and persona files
- **Utils**: `src/utils/` - CLI-specific utilities (error handling, progress indicators, formatting)
- **Constants**: `src/constants.ts` - CLI configuration constants

### UMS Library Package (`packages/ums-lib`)

- **Core Library**: Reusable UMS v1.0 operations for module parsing, validation, and persona building
- **Dependencies**: glob (file discovery), yaml (parsing)

### Module System (UMS v1.0)

The `instructions-modules/` directory contains a four-tier hierarchy:

- **foundation/**: Core cognitive frameworks, logic, ethics, problem-solving (layers 0-5)
- **principle/**: Software engineering principles, patterns, methodologies
- **technology/**: Technology-specific guidance (languages, frameworks, tools)
- **execution/**: Playbooks and procedures for specific tasks

**Note**: The project uses `instructions-modules/` as the primary module directory (configured in `modules.config.yml`).

Each module is a Markdown file with YAML frontmatter containing:

- `name`: Human-readable module name
- `description`: Brief description
- `schema`: One of 'procedure', 'specification', 'pattern', 'checklist', 'data', 'rule'
- `layer`: Optional layer number (0-5, foundation tier only)

### Schema Validation

The UMS library validates modules against specific schema structures:

- **procedure**: Primary Directive → Process → Constraints
- **specification**: Core Concept → Key Rules → Best Practices → Anti-Patterns
- **pattern**: Summary → Core Principles → Advantages/Use Cases → Disadvantages/Trade-offs
- **checklist**: Objective → Items
- **data**: Description (plus code block)
- **rule**: Single atomic mandate or constraint

### Persona Configuration

Personas are defined in `.persona.yml` files (UMS v1.0 format) with:

- `name`: Required string
- `description`: Optional string
- `moduleGroups`: Required array of module groups, each containing:
  - `groupName`: Optional group name for organization
  - `modules`: Required array of module IDs

## Testing

- **Framework**: Vitest with v8 coverage
- **Test Files**: `*.test.ts` files alongside source files in each package
- **Coverage Requirements**: Individual packages may have specific coverage targets
- **Test Commands**: Use `npm test` for all packages, package-specific commands for targeted testing

## CLI Usage Examples

### Production Usage

```bash
# Build a persona from configuration (UMS v1.0)
copilot-instructions build --persona ./personas/my-persona.persona.yml

# Build with custom output
copilot-instructions build --persona ./personas/my-persona.persona.yml --output ./dist/my-persona.md

# List all modules
copilot-instructions list

# List modules by tier
copilot-instructions list --tier foundation

# Search for modules
copilot-instructions search "logic"

# Search with tier filtering
copilot-instructions search "reasoning" --tier foundation

# Validate all modules and personas
copilot-instructions validate

# Validate specific path
copilot-instructions validate ./instructions-modules
```

### Development Usage

```bash
# Use the built CLI directly (after npm run build)
node packages/copilot-instructions-cli/dist/index.js build --persona ./personas/my-persona.persona.yml
node packages/copilot-instructions-cli/dist/index.js list
node packages/copilot-instructions-cli/dist/index.js search "reasoning"
node packages/copilot-instructions-cli/dist/index.js validate
```

## Development Notes

- **Monorepo**: Uses npm workspaces for package management
- **ES Modules**: All packages use ES modules (type: "module")
- **TypeScript**: Compilation includes `.js` extensions for imports
- **Git Hooks**: Configured with husky for pre-commit and pre-push checks
- **CLI Binary**: Published as `copilot-instructions` with binary at `packages/copilot-instructions-cli/dist/index.js`
- **Node.js**: Requires version 22.0.0 or higher
- **Lint-staged**: Pre-commit formatting and linting across all packages
- **Dependencies**: CLI depends on UMS library for core functionality

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
- **Pre-1.0 Project Notice**: This project is in pre-1.0 development and does not guarantee backward compatibility. APIs, CLI commands, and file formats may change without notice.

### Module Configuration

- **Primary Module Directory**: `instructions-modules/` (configured in `modules.config.yml`)
- **Conflict Resolution**: Warnings are displayed on module conflicts
- **Module ID Pattern**: `tier/category/name-v1-0` format
- **Coverage Requirements**: Tests maintain 80% coverage across branches, functions, lines, and statements

<!-- Consolidated contributor requirements (replaces duplicated block) -->

## Contributor Requirements

- Commit only your work; do not include unrelated changes.
- Commit in logical, self-contained chunks.
- Run lints and tests and fix issues before committing.
- Ensure code is documented and follows project coding standards.
- Add unit tests for new features or bug fixes.
- Use feature branches and open PRs to `main` after local verification.
