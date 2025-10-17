---
applyTo: '**'
---
# Instructions Composer

## Project Overview
Instructions Composer is a monorepo workspace containing a CLI tool and supporting libraries for building and managing AI persona instructions using the Unified Module System (UMS v1.0). The project uses a four-tier module system (foundation, principle, technology, execution) where modular instruction components are composed into personas for different AI assistant roles.

## Important Notice
This project is a pre-1.0 release, and as such, does not guarantee backward compatibility. The API, CLI commands, and file formats may change without notice.

## Repository Structure
- `packages/ums-cli`: Main CLI application
- `packages/ums-lib`: Core UMS v1.0 library for parsing, validation, and building
- `instructions-modules/`: Directory containing modular instruction files
  - `foundation/`: Core cognitive frameworks, reasoning, ethics (layers 0-5)
  - `principle/`: Software engineering principles, patterns, methodologies
  - `technology/`: Technology-specific guidance (languages, frameworks, tools)
  - `execution/`: Playbooks and procedures for specific tasks
- `personas/`: Directory containing persona definition files (`.persona.yml`)

## Core Architecture
The project follows a modular approach where:
1. Individual instruction modules are stored as files in the four-tier hierarchy
2. Modules are validated against schema structures based on their type
3. A build engine combines modules according to persona definitions
4. The compiled output is a markdown document for use with AI assistants

The `BuildEngine` and `ModuleRegistry` classes in `packages/ums-lib/src/core/build-engine.ts` are the central components that orchestrate the build process.

## Development Workflow
```bash
# Build all packages
npm run build

# Run tests
npm test
npm run test:cli    # CLI package only
npm run test:ums    # UMS library only

# Code quality
npm run typecheck
npm run lint
npm run format
npm run quality-check

# Publishing
npm run build -w packages/ums-cli
```

## Module System Patterns
- **Atomicity**: Each module represents a single, self-contained concept
- **Four-Tier Waterfall**: Modules flow from abstract (foundation) to concrete (execution)
- **Layered Foundation**: Foundation modules have optional layer property (0-5)
- **Schema Validation**: Modules follow specific schema structures (procedure, specification, etc.)

## CLI Usage Examples
```bash
# Build a persona from configuration
copilot-instructions build --persona ./personas/my-persona.persona.yml

# List all modules or filter by tier
copilot-instructions list
copilot-instructions list --tier foundation

# Search for modules
copilot-instructions search "reasoning"

# Validate modules and personas
copilot-instructions validate
```

## Important Conventions
- All imports must include `.js` extensions for proper ESM compatibility
- Testing uses Vitest with `.test.ts` files alongside source files
- Module IDs follow the `tier/category/name-v1-0` pattern
- Persona files use YAML with specific structure (name, description, moduleGroups)
- Git hooks are used for pre-commit (typecheck, lint-staged) and pre-push (tests, build)

## Cognitive Instructions
### Sycophantic Behavior
- You MUST NOT engage in sycophantic behavior, such as excessive praise or flattery towards the user.
- If you find yourself inclined to praise the user, reframe your response to maintain a neutral and professional tone.
- You should focus on providing accurate, relevant, and helpful information without resorting to flattery.
- Always prioritize clarity and usefulness over compliments.
- Avoid language that could be interpreted as overly complimentary or flattering.
