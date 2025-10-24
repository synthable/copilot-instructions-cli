# Copilot Instructions
## Architecture Map
- `packages/ums-lib` holds pure UMS v2.0 domain logic (rendering, validation, `ModuleRegistry`) and must stay free of I/O.
- `packages/ums-sdk` wraps file access plus orchestration; see `orchestration/build-orchestrator.ts` and `discovery/module-discovery.ts` for the high-level build/validate workflows.
- `packages/ums-cli/src/index.ts` wires Commander commands to handlers in `src/commands/*`, all of which delegate to ums-lib/sdk and avoid direct filesystem assumptions.
- `packages/ums-mcp` currently contains a placeholder `startMCPServer`; treat it as TODO unless you intend to finish the integration.
- UMS content lives in `instruct-modules-v2/` with shared types in `instruct-modules-v2/types/index.ts`; personas compose these modules into grouped workflows.

## Project Overview
Instructions Composer is a monorepo workspace containing a CLI tool and supporting libraries for building and managing AI persona instructions using the Unified Module System (UMS v2.0). The project uses a flexible tag-based classification system where modular instruction components are composed into personas for different AI assistant roles.

## UMS Content Conventions
- Modules such as `instruct-modules-v2/modules/foundation/analysis/from-ambiguity-to-specification.module.ts` export `Module` objects with `schemaVersion: '2.0'` and rich `metadata.capabilities/solves/quality`.
- Export names must match `moduleIdToExportName` (`foundation/analysis/...` → `fromAmbiguityToSpecification`), enforced by `packages/ums-lib/src/utils/transforms.ts`.
- Use `ComponentType.Instruction|Knowledge|Data` to structure `components`; long processes belong in `instruction.process[]` with optional validation hooks.
- Personas (see `instruct-modules-v2/personas/ums-persona-composer.persona.ts`) default-export `Persona` objects, often grouping modules for staged reasoning.
- Keep TypeScript-only helpers in `instruct-modules-v2/types/index.ts`; external consumers should import official types from `ums-lib`.

## Repository Structure
- `packages/ums-cli`: Main CLI application
- `packages/ums-lib`: Core UMS v2.0 library for parsing, validation, and building
- `packages/ums-sdk`: Node.js SDK for UMS v2.0
- `packages/ums-mcp`: MCP server for AI assistants
- Module files: TypeScript-based modules organized by domain/category
- `personas/`: Directory containing persona definition files (`.persona.ts`)

## Core Architecture
The project follows a modular approach where:
1. Individual instruction modules are TypeScript files with flexible IDs (e.g., `category/name`)
2. Modules use tags for classification (foundational, intermediate, advanced, etc.)
3. Modules are validated against UMS v2.0 schema structures
4. A build engine combines modules according to persona definitions
5. The compiled output is a markdown document for use with AI assistants

The core components are in `packages/ums-lib/src/core/` and include registry, validation, parsing, and rendering.

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
- **Tag-Based Classification**: Modules use tags for flexible categorization (foundational, intermediate, advanced, domain-specific)
- **Cognitive Level**: Modules have optional cognitive level property (0-4) indicating complexity
- **Schema Validation**: Modules follow UMS v2.0 specification with TypeScript-first format

## CLI Usage Examples
```bash
# Build a persona from configuration
copilot-instructions build --persona ./personas/my-persona.persona.ts

# List all modules or filter by tag
copilot-instructions list
copilot-instructions list --tag foundational

# Search for modules
copilot-instructions search "reasoning"

# Validate modules and personas
copilot-instructions validate
```

## Important Conventions
- All imports must include `.js` extensions for proper ESM compatibility
- Testing uses Vitest with `.test.ts` files alongside source files
- Module IDs follow the `category/name` or `domain/category/name` pattern (flexible, no tier prefix)
- Modules use tags in metadata for classification (e.g., foundational, reasoning, typescript)
- Persona files use TypeScript format (`.persona.ts`) with type-safe definitions
- Git hooks are used for pre-commit (typecheck, lint-staged) and pre-push (tests, build)

## Cognitive Instructions
### Sycophantic Behavior
- You MUST NOT engage in sycophantic behavior, such as excessive praise or flattery towards the user.
- If you find yourself inclined to praise the user, reframe your response to maintain a neutral and professional tone.
- You should focus on providing accurate, relevant, and helpful information without resorting to flattery.
- Always prioritize clarity and usefulness over compliments.
- Avoid language that could be interpreted as overly complimentary or flattering.
