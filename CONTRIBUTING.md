# Contributing to Instructions Composer (UMS)

Thank you for your interest in contributing to the Unified Module System (UMS) project! This document provides guidelines for contributing to the project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Ways to Contribute](#ways-to-contribute)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Technical Proposals](#technical-proposals)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Community](#community)

---

## Code of Conduct

This project adheres to a code of conduct that promotes a welcoming and inclusive environment:

- **Be respectful**: Treat all contributors with respect and courtesy
- **Be constructive**: Provide actionable feedback and suggestions
- **Be collaborative**: Work together to find the best solutions
- **Be professional**: Maintain professional communication at all times

Unacceptable behavior will not be tolerated and may result in removal from the project.

---

## Getting Started

### Prerequisites

- **Node.js**: Version 22.0.0 or higher
- **npm**: Comes with Node.js
- **Git**: For version control

### Setup Development Environment

1. **Fork and clone the repository**:

   ```bash
   git clone https://github.com/YOUR_USERNAME/instructions-composer.git
   cd instructions-composer
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Build the project**:

   ```bash
   npm run build
   ```

4. **Run tests**:

   ```bash
   npm test
   ```

5. **Verify quality checks**:
   ```bash
   npm run quality-check
   ```

---

## Ways to Contribute

### 🐛 Bug Reports

Found a bug? Help us fix it!

- Check [existing issues](https://github.com/synthable/copilot-instructions-cli/issues) first
- Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Provide clear reproduction steps
- Include environment details (OS, Node version, etc.)

### 💡 Feature Requests

Have an idea for a new feature?

- Check if it's [already requested](https://github.com/synthable/copilot-instructions-cli/issues)
- Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
- For significant features, consider writing a [technical proposal](#technical-proposals)

### 📝 Documentation

Documentation improvements are always welcome:

- Fix typos or unclear explanations
- Add examples or tutorials
- Improve API documentation
- Translate documentation (if applicable)

### 🔧 Code Contributions

Ready to write code?

- Fix bugs
- Implement approved features
- Improve performance
- Refactor code for clarity

### 📦 Module Contributions

Create new UMS modules:

- Foundation modules (cognitive frameworks)
- Principle modules (software engineering practices)
- Technology modules (language/framework specific)
- Execution modules (procedures and playbooks)

See [Module Authoring Guide](docs/unified-module-system/12-module-authoring-guide.md) for details.

---

## Development Workflow

### Branch Strategy

- **`main`**: Stable, production-ready code
- **`develop`**: Integration branch for next release (if used)
- **`feature/*`**: New features or enhancements
- **`fix/*`**: Bug fixes
- **`proposal/*`**: Technical proposals
- **`docs/*`**: Documentation updates

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

**Examples**:

```bash
feat(ums-sdk): add selective module inclusion support
fix(cli): resolve module resolution race condition
docs(proposal): add proposal process documentation
test(ums-lib): add validation tests for persona composition
```

### Pre-commit Checks

We use `husky` and `lint-staged` for automated quality checks:

**Pre-commit**:

- Type checking (`npm run typecheck`)
- Linting with auto-fix (`eslint --fix`)
- Code formatting (`prettier --write`)

**Pre-push**:

- Type checking
- All tests
- Linting
- Full build

These run automatically when you commit and push. You can also run them manually:

```bash
npm run pre-commit   # Run pre-commit checks
npm run pre-push     # Run pre-push checks
```

---

## Pull Request Process

### Before Submitting

1. **Create an issue first** (for non-trivial changes)
2. **Fork the repository** and create your branch
3. **Make your changes** following our coding standards
4. **Write/update tests** for your changes
5. **Run quality checks**: `npm run quality-check`
6. **Update documentation** as needed
7. **Write clear commit messages**

### Submitting the PR

1. **Push your branch** to your fork
2. **Open a Pull Request** against `main` (or `develop` if used)
3. **Fill out the PR template** completely
4. **Link related issues** (e.g., "Closes #123")
5. **Wait for CI checks** to pass
6. **Respond to feedback** promptly

### PR Guidelines

**Title Format**:

```
<type>(<scope>): <brief description>
```

Example: `feat(ums-sdk): add selective module inclusion`

**Description Should Include**:

- What changed and why
- Related issue numbers
- Breaking changes (if any)
- Testing performed
- Screenshots (if UI-related)

### Review Process

- PRs require **at least 1 maintainer approval**
- All CI checks must pass
- Breaking changes require **2+ approvals**
- Reviews typically completed within **3-5 business days**

### After Approval

- **Squash and merge** is preferred (maintainers will handle this)
- Your contribution will be included in the next release
- You'll be credited in the changelog

---

## Technical Proposals

Significant changes require a formal technical proposal.

### When Is a Proposal Required?

**Required**:

- New features affecting UMS specification
- Breaking changes to APIs or specifications
- Architectural changes impacting multiple packages
- New specification versions (e.g., UMS v2.1, v3.0)

**Recommended**:

- Significant new APIs or public interfaces
- Major refactorings changing internal architecture
- New standard library module categories

### Proposal Process

1. **Read the guidelines**: [Proposal Process](docs/proposal-process.md)
2. **Quick start**: [5-Minute Guide](docs/proposal-quick-start.md)
3. **Use the template**: [Proposal Template](docs/spec/proposals/TEMPLATE.md)
4. **Submit as PR** with `[PROPOSAL]` prefix
5. **Create tracking issue** using the [proposal template](.github/ISSUE_TEMPLATE/proposal.md)
6. **Participate in review** (minimum 7 days)

**Proposal Quick Start**:

```bash
# 1. Copy template
cp docs/spec/proposals/TEMPLATE.md docs/spec/proposals/feature-my-idea.md

# 2. Fill it out (focus on Problem → Solution → Examples)

# 3. Create branch and PR
git checkout -b proposal/my-idea
git add docs/spec/proposals/feature-my-idea.md
git commit -m "proposal: add proposal for my idea"
git push origin proposal/my-idea

# 4. Open PR with [PROPOSAL] prefix
```

See [Proposal Quick Start](docs/proposal-quick-start.md) for more details.

---

## Coding Standards

### TypeScript Guidelines

- **Use TypeScript strict mode**: No `any` types without justification
- **Write type-safe code**: Leverage TypeScript's type system
- **Export types**: Make types available for consumers
- **Document public APIs**: Use JSDoc comments

### Code Style

We use **ESLint** and **Prettier** for consistent code style:

```bash
npm run lint        # Check for linting issues
npm run lint:fix    # Auto-fix linting issues
npm run format      # Format code with Prettier
npm run format:check # Check formatting without changes
```

**Key Conventions**:

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Line length**: 100 characters (soft limit)
- **Naming**:
  - `camelCase` for variables and functions
  - `PascalCase` for classes and types
  - `UPPER_SNAKE_CASE` for constants
  - `kebab-case` for file names

### File Organization

```
packages/
├── package-name/
│   ├── src/
│   │   ├── index.ts          # Public API
│   │   ├── types/            # Type definitions
│   │   ├── core/             # Core functionality
│   │   ├── utils/            # Utilities
│   │   └── *.test.ts         # Tests alongside source
│   ├── dist/                 # Build output
│   ├── package.json
│   └── tsconfig.json
```

### Import Organization

1. External dependencies (Node.js built-ins, npm packages)
2. Internal workspace packages
3. Relative imports (same package)

```typescript
// External
import { readFile } from 'node:fs/promises';
import { glob } from 'glob';

// Internal workspace
import { validateModule } from 'ums-lib';

// Relative
import { ConfigManager } from './loaders/config-loader.js';
import type { BuildOptions } from './types/index.js';
```

---

## Testing Guidelines

### Test Coverage Requirements

- **Minimum coverage**: 80% across branches, functions, lines, statements
- **Critical paths**: 100% coverage required
- **New features**: Must include tests

### Test Structure

We use **Vitest** for testing:

```typescript
import { describe, it, expect } from 'vitest';

describe('ModuleValidator', () => {
  describe('validateModule', () => {
    it('should validate a valid module', () => {
      const module = {
        /* ... */
      };
      const result = validateModule(module);
      expect(result.valid).toBe(true);
    });

    it('should reject module without id', () => {
      const module = {
        /* ... */
      };
      const result = validateModule(module);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ path: 'id' })
      );
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific package
npm run test:cli      # CLI package
npm run test:ums      # UMS library
npm run test:sdk      # SDK package
npm run test:mcp      # MCP package

# Run with coverage
npm run test:coverage
npm run test:cli:coverage
npm run test:ums:coverage
npm run test:sdk:coverage
npm run test:mcp:coverage

# Watch mode (during development)
npm test -- --watch
```

### Test Best Practices

- **Write clear test names**: Describe what is being tested
- **Test one thing**: Each test should verify one behavior
- **Use descriptive assertions**: Make failures self-explanatory
- **Mock external dependencies**: Keep tests fast and isolated
- **Test edge cases**: Empty inputs, null values, boundary conditions

---

## Documentation

### Code Documentation

- **Public APIs**: Must have JSDoc comments
- **Complex logic**: Explain the "why," not just the "what"
- **Type definitions**: Document parameters and return types

````typescript
/**
 * Build a persona from a TypeScript definition file.
 *
 * @param personaPath - Absolute path to the .persona.ts file
 * @param options - Build configuration options
 * @returns Build result with rendered markdown and metadata
 * @throws {PersonaNotFoundError} If persona file doesn't exist
 * @throws {ValidationError} If persona is invalid
 *
 * @example
 * ```typescript
 * const result = await buildPersona('./personas/backend-dev.persona.ts', {
 *   outputPath: './dist/backend-dev.md'
 * });
 * console.log(result.markdown);
 * ```
 */
export async function buildPersona(
  personaPath: string,
  options?: BuildOptions
): Promise<BuildResult> {
  // Implementation
}
````

### Markdown Documentation

- Use **clear headings** (h1 for title, h2 for sections)
- Include **code examples** where appropriate
- Add **links** to related documentation
- Keep **line length** reasonable (~120 chars)

### Documentation Updates

When making changes:

1. **Update relevant docs** in the same PR
2. **Add examples** for new features
3. **Update CHANGELOG.md** for user-facing changes
4. **Update type definitions** if APIs change

---

## Community

### Getting Help

- **Documentation**: Check [docs/](docs/) first
- **GitHub Discussions**: Ask questions and share ideas
- **GitHub Issues**: Report bugs or request features
- **Pull Requests**: Review process and feedback

### Asking Good Questions

1. **Check existing resources** first
2. **Provide context**: What are you trying to accomplish?
3. **Share details**: Code snippets, error messages, environment
4. **Be specific**: Vague questions get vague answers

### Providing Good Feedback

1. **Be constructive**: Focus on improvement
2. **Be specific**: Point to exact issues
3. **Suggest solutions**: Don't just identify problems
4. **Be respectful**: Remember there's a person behind the code

---

## Release Process

Releases are managed by maintainers:

1. **Version bumping**: Following [Semantic Versioning](https://semver.org/)
2. **Changelog generation**: Automated from commit messages
3. **Publishing**: To npm registry
4. **GitHub releases**: With release notes

You don't need to worry about this for contributions, but it's good to understand the process.

---

## Package-Specific Guidelines

### ums-lib (Core Library)

- **Pure functions**: No I/O, no side effects
- **Platform-agnostic**: Works in Node.js and browsers
- **Zero dependencies**: Keep the library lightweight
- **Full type safety**: Strict TypeScript

### ums-sdk (Node.js SDK)

- **Node.js APIs**: File system, process, etc.
- **Depends on ums-lib**: For core logic
- **Loader implementations**: Module loading, persona loading
- **Orchestration**: Build workflows

### copilot-instructions-cli (CLI)

- **User-facing**: Focus on UX and error messages
- **Depends on ums-sdk**: For all operations
- **Command handlers**: Clear, focused implementations
- **Progress feedback**: Spinners, colors, formatting

### ums-mcp (MCP Server)

- **MCP Protocol**: Follow Model Context Protocol spec
- **AI-friendly**: Structured responses for LLMs
- **Tool definitions**: Clear schemas and descriptions

---

## Questions?

If you have questions not covered here:

- **Open a Discussion**: For open-ended questions
- **Open an Issue**: For specific problems or suggestions
- **Check Documentation**: [docs/README.md](docs/README.md)

---

## License

By contributing, you agree that your contributions will be licensed under the project's [GPL-3.0-or-later](LICENSE) license.

---

## Acknowledgments

Thank you for contributing to the Unified Module System! Every contribution, no matter how small, helps make this project better for everyone.

**Happy coding!** 🚀
