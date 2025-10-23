# GEMINI.md

@OPENCODE.md

## Gemini Added Memories

- Use Agent Feedback Protocol v1.2 (via OpenCode CLI) as a peer to brainstorm with, validate ideas, and get feedback from.

## Project Overview

Instructions Composer is a monorepo that delivers a Unified Module System (UMS) v2.0 toolchain for building modular AI assistant instructions. The workspace contains a TypeScript-first CLI, SDK, MCP server, and shared library that treat instruction design as composable source code. Personas are authored as `.persona.ts` files that assemble reusable `.module.ts` building blocks discovered through configuration.

Key orchestration lives in [`packages/ums-lib/src/core/build-engine.ts`](packages/ums-lib/src/core/build-engine.ts) and [`packages/ums-lib/src/core/module-registry.ts`](packages/ums-lib/src/core/module-registry.ts).

## Repository Structure

- [`packages/ums-lib`](packages/ums-lib): Pure domain logic for parsing, validating, and rendering UMS v2.0 modules.
- [`packages/ums-sdk`](packages/ums-sdk): Node.js SDK that loads modules from disk and coordinates builds.
- [`packages/ums-cli`](packages/ums-cli): CLI binaries `copilot-instructions` and `ums` for developers.
- [`packages/ums-mcp`](packages/ums-mcp): Model Context Protocol server exposing module discovery to AI assistants.
- [`modules.config.yml`](modules.config.yml): Declares discovery paths for TypeScript modules.
- [`personas/`](personas): Persona definitions in TypeScript (`*.persona.ts`).

## Build & Test Commands

```bash
npm install
npm run build
npm run build -w packages/ums-cli
npm run build -w packages/ums-lib
npm run build -w packages/ums-sdk
npm run build -w packages/ums-mcp
npm test
npm run test:cli
npm run test:ums
npm run test:sdk
npm run test:mcp
npm run lint
npm run format
npm run typecheck
npm run quality-check
```

## CLI Quick Reference

```bash
# Build a persona into a markdown output
npx copilot-instructions build --persona ./personas/my-persona.persona.ts --output ./dist/instructions.md

# Module discovery utilities
npx copilot-instructions list --tier foundation
npx copilot-instructions search "error handling" --tier technology
npx copilot-instructions inspect --conflicts-only

# Validation guidance
npx copilot-instructions validate --verbose

# MCP server helpers
npx copilot-instructions mcp start --transport stdio
npx copilot-instructions mcp list-tools
```

Modules must be resolvable via [`modules.config.yml`](modules.config.yml); legacy YAML module discovery is no longer implicit.

## Development Conventions

- **Language & Modules:** ESM TypeScript with `.js` import extensions; strict typing and explicit returns (especially in [`packages/ums-lib`](packages/ums-lib)).
- **Formatting & Linting:** Prettier (single quotes, 2-space indentation, ≤80 columns) and ESLint via `npm run format` / `npm run lint`.
- **Testing:** Vitest with colocated `*.test.ts` files; coverage via `npm run test:coverage`.
- **Async & Errors:** Await all promises, avoid floating tasks, prefer result objects over throwing in library code.
- **Git Hooks:** Husky runs `npm run typecheck && npx lint-staged` on commit and `npm run typecheck && npm test && npm run lint && npm run build` on push.
- **Module IDs:** Follow the `tier/category/name-v2-0` pattern; personas orchestrate modules in waterfall order (foundation → principle → technology → execution).

## Status Notes

- UMS v2.0 TypeScript modules and personas are the default; YAML formats are legacy.
- Runtime validation for v2.0 modules is evolving; current guidance delegates structural checks to `tsc --noEmit`.
- The CLI binaries remain pre-1.0 and may ship breaking changes without notice.

---
