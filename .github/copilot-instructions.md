# Copilot Instructions for copilot-instructions-cli

## Project Overview

This is a TypeScript monorepo for building a CLI tool that helps developers create and manage modular AI assistant instructions. The project uses:

- **Language**: TypeScript with strict type checking
- **Build System**: TypeScript compiler (tsc)
- **Package Manager**: npm with workspaces
- **Testing**: Vitest
- **Code Quality**: ESLint with strict TypeScript rules, Prettier for formatting
- **Commit Hooks**: Husky for pre-commit and pre-push validation

## Repository Structure

```text
copilot-instructions-cli/
├── packages/
│   ├── copilot-instructions-cli/  # Main CLI package
│   │   ├── src/
│   │   │   ├── commands/         # CLI command implementations
│   │   │   ├── utils/            # Utility functions
│   │   │   └── index.ts          # CLI entry point (Commander.js)
│   │   └── package.json
│   └── ums-lib/                  # Core library for module system
│       ├── src/
│       │   ├── core/             # Core engine (module loader, persona loader, build engine)
│       │   ├── types/            # TypeScript type definitions
│       │   └── utils/            # Utility functions
│       └── package.json
├── docs/                         # User documentation
├── tests/                        # Integration tests
└── .github/
    ├── instructions/             # Path-specific Copilot instructions
    └── copilot-instructions.md   # This file
```

## Development Guidelines

### Code Style and Standards

1. **TypeScript**:
   - Use strict type checking (`strictTypeChecked` and `stylisticTypeChecked`)
   - Prefer explicit function return types (`explicit-function-return-type: warn`)
   - Use `const` and arrow functions where appropriate
   - Prefer optional chaining and nullish coalescing
   - Mark unused parameters with underscore prefix (e.g., `_unused`)
   - Use consistent type imports: `import type { ... } from '...'`

2. **Code Formatting**:
   - 2 spaces for indentation (no tabs)
   - Single quotes for strings
   - Semicolons required
   - Line width: 80 characters
   - Arrow function parentheses: avoid when single parameter
   - Trailing commas: ES5 style

3. **Async/Await**:
   - Always handle promises properly (no floating promises)
   - Use `await` with thenables
   - Return await in try/catch blocks

### Testing Requirements

- Write tests for all new commands and core functionality
- Use Vitest for unit tests
- Test files should be co-located with source files (e.g., `build.test.ts` next to `build.ts`)
- Run tests before committing: `npm test`
- Maintain or improve code coverage

### Build and Development Workflow

1. **Installation**: `npm install` (from root)
2. **Build**: `npm run build` (builds all workspace packages)
3. **Test**: `npm run test` (runs all tests with type checking)
4. **Lint**: `npm run lint` (ESLint for all packages)
5. **Format**: `npm run format` (Prettier for all packages)
6. **Type Check**: `npm run typecheck`

### Git Workflow

- Follow commit message conventions in `.github/instructions/commit.instructions.md`
- Use conventional commit format: `<type>[optional scope]: <subject>`
- Pre-commit hooks run type checking and lint-staged
- Pre-push hooks run full test suite, linting, and build

## Working with the Codebase

### Adding New Commands

When adding a new CLI command:

1. Create a new file in `packages/copilot-instructions-cli/src/commands/`
2. Export a handler function (e.g., `handleCommandName`)
3. Add command tests in a co-located `.test.ts` file
4. Register the command in `packages/copilot-instructions-cli/src/index.ts` using Commander.js
5. Add help text and examples
6. Update documentation if necessary

### Working with the UMS Library

The `ums-lib` package contains the core logic:

- **ModuleLoader**: Loads and validates instruction modules
- **PersonaLoader**: Loads and validates persona configurations
- **BuildEngine**: Compiles modules into final instruction files

When modifying core functionality:

1. Ensure backward compatibility or document breaking changes
2. Update type definitions in `src/types/`
3. Add comprehensive tests
4. Update both CLI and library tests as needed

### Dependencies

- Avoid adding new dependencies unless necessary
- When adding dependencies:
  - Prefer well-maintained, popular packages
  - Check for security vulnerabilities
  - Add to the appropriate workspace package
  - Document why the dependency is needed

### Documentation

- Keep README.md up to date with major changes
- Update CLI help text when modifying commands
- Maintain user documentation in `docs/` folder
- Use JSDoc comments for public APIs

## Common Patterns

### Error Handling

- Use custom error classes from `utils/errors.ts`
- Provide clear, actionable error messages
- Include context in error messages (file paths, module names, etc.)
- Log errors appropriately based on verbosity flag

### CLI Output

- Use the progress utilities for user feedback
- Respect the `--verbose` flag for detailed output
- Use colors and formatting consistently
- Show helpful examples in error messages

### File Operations

- Use Node.js `fs` module with async/await
- Handle file not found errors gracefully
- Validate file paths before operations
- Use path.join() for cross-platform compatibility

## Security Considerations

- Never commit secrets or API keys
- Validate all user input (file paths, module names, etc.)
- Be cautious with file system operations
- Follow principle of least privilege

## Performance

- Use streaming for large files when possible
- Cache module metadata to avoid repeated parsing
- Lazy-load dependencies where appropriate
- Profile performance-critical paths

## Accessibility and Best Practices

- Provide clear, descriptive error messages
- Include examples in help text
- Support standard input/output for piping
- Make CLI commands composable
- Follow Unix philosophy: do one thing well
