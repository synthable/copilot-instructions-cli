# UMS SDK Tests

This directory contains tests for the UMS SDK package.

## Directory Structure

```
tests/
├── integration/           # Integration tests
│   └── *.test.ts         # End-to-end workflow tests
├── fixtures/             # Test fixtures
│   ├── modules/          # Example module files
│   ├── personas/         # Example persona files
│   └── configs/          # Example config files
└── README.md            # This file
```

## Test Organization

### Unit Tests

Unit tests are colocated with their source files in the `src/` directory:

```
src/
├── loaders/
│   ├── module-loader.ts
│   ├── module-loader.test.ts       # Unit tests for ModuleLoader
│   ├── persona-loader.ts
│   └── persona-loader.test.ts      # Unit tests for PersonaLoader
```

### Integration Tests

Integration tests verify that multiple SDK components work together correctly.
They are located in `tests/integration/`:

- `build-workflow.test.ts` - End-to-end persona build tests
- `module-loading.test.ts` - Module discovery and loading
- `error-scenarios.test.ts` - Error handling with real files
- `multi-module.test.ts` - Complex multi-module projects

### Test Fixtures

Test fixtures provide sample files for testing:

- **modules/**: Example `.module.ts` files (valid and invalid)
- **personas/**: Example `.persona.ts` files
- **configs/**: Example `modules.config.yml` files

## Running Tests

```bash
# Run all SDK tests
npm run test -w packages/ums-sdk

# Run tests with coverage
npm run test:coverage -w packages/ums-sdk

# Run specific test file
npx vitest run packages/ums-sdk/src/loaders/module-loader.test.ts
```

## Writing Tests

### Unit Tests

Unit tests should:

- Be colocated with source files
- Test individual components in isolation
- Use test fixtures when needed
- Mock external dependencies

### Integration Tests

Integration tests should:

- Be placed in `tests/integration/`
- Test multiple components working together
- Use real file system operations
- Verify end-to-end workflows

### Test Fixtures

When creating fixtures:

- Place in appropriate subdirectory (modules/personas/configs)
- Include both valid and invalid examples
- Document the purpose of each fixture
- Keep fixtures minimal and focused
