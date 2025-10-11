# Instructions Composer - Agent Guidelines

## Build & Test Commands

- **Build all**: `npm run build`
- **Build CLI**: `npm run build -w packages/copilot-instructions-cli`
- **Build UMS lib**: `npm run build -w packages/ums-lib`
- **Test all**: `npm test`
- **Test CLI**: `npm run test:cli`
- **Test UMS lib**: `npm run test:ums`
- **Run single test**: `npx vitest run <test-file>.test.ts`
- **Test coverage**: `npm run test:coverage`

## Code Quality

- **Lint all**: `npm run lint`
- **Lint fix**: `npm run lint:fix`
- **Format**: `npm run format`
- **Typecheck**: `npm run typecheck`
- **Quality check**: `npm run quality-check`

## Code Style Guidelines

- **Imports**: Use `.js` extensions for ESM compatibility, consistent type imports
- **Formatting**: Prettier with single quotes, 2-space tabs, 80 char width
- **Types**: Strict TypeScript, explicit return types (error in lib, warn in CLI)
- **Naming**: camelCase for variables/functions, PascalCase for types/classes
- **Error handling**: Use Result types, avoid `any`, prefer optional chaining
- **Async**: Always await promises, no floating promises
- **Testing**: Vitest with describe/it/expect, test files alongside source

## Module System

- **Structure**: Four tiers (foundation/principle/technology/execution)
- **IDs**: `tier/category/name-v1-0` pattern
- **Validation**: Schema-based with YAML modules, TypeScript personas

## Git Workflow

- **Pre-commit**: Typecheck + lint-staged
- **Pre-push**: Typecheck + tests + lint + build
- **Commits**: Follow conventional format with meaningful messages

## Important Conventions

- All packages use ESM with NodeNext modules
- CLI allows console output, library does not
- Maximum complexity: 20 (15 for lib), max depth: 5
- No inline type imports - import types at top of file
