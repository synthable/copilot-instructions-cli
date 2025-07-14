# Persona Templates: Your Starter Kits

## Introduction

To help you get started quickly, the `copilot-instructions` CLI includes a set of pre-built persona templates. These templates are expertly crafted, well-ordered collections of modules designed to solve common, real-world problems. They serve as both powerful, ready-to-use tools and as educational examples of how to structure a high-quality persona.

You can use these templates with the `create-persona` command.

### How to Use a Template

To create a new persona file from a template, use the `-t` or `--template` flag with the `create-persona` command.

```bash
# Example: Create a new persona file named 'my-developer.json' using the 'rational-developer' template
copilot-instructions create-persona my-developer --template rational-developer
```

This will create a `my-developer.persona.jsonc` file in your current directory, pre-populated with the modules and structure from the chosen template. You can then customize it by adding your specific `Technology` modules or making other adjustments.

---

## Available Templates

```bash
# Example: Create a new persona file named 'my-developer.json' using the 'rational-developer' template
copilot-instructions create-persona my-developer --template rational-developer
```

This will create a `my-developer.persona.jsonc` file in your current directory, pre-populated with the modules and structure from the chosen template. You can then customize it by adding your specific `Technology` modules or making other adjustments.

---

## Available Templates

Here is a catalog of the official starter templates.

### 1. `rational-developer`

- **Name:** Rational Developer
- **Philosophy:** The all-rounder. This is the perfect "default" or "starter" template for any day-to-day software engineering task.
- **Core Competency:** It builds a well-rounded AI assistant grounded in first principles, logic, and industry-standard best practices like clean code and TDD. It is designed to be a safe, powerful, and reliable starting point.
- **Ideal For:**
  - General-purpose code generation.
  - Debugging common issues.
  - Refactoring code to improve quality.
  - Serving as a base for more specialized developer personas.

### 2. `react-tdd-specialist`

- **Name:** React TDD Specialist
- **Philosophy:** The specialist. This template demonstrates how to create a highly focused persona for a specific technology stack and methodology.
- **Core Competency:** It creates an expert in building, testing, and refactoring React components using a strict Test-Driven Development (TDD) workflow. It is pre-loaded with knowledge of React's core principles, component best practices, and testing patterns.
- **Ideal For:**
  - Front-end developers working in a React/TypeScript environment.
  - Teams that want to enforce a test-first development culture.
  - Generating React components complete with corresponding unit tests.

### 3. `code-critic`

- **Name:** Code Critic
- **Philosophy:** The analyst. This persona is not designed to write new code, but to _analyze_ existing code with an expert, critical eye.
- **Core Competency:** It acts as an automated code reviewer, focusing on quality, maintainability, security, and adherence to best practices. Its primary output is a structured report providing clear, constructive, and actionable feedback.
- **Ideal For:**
  - Automating parts of the pull request review process.
  - Auditing a codebase for potential security vulnerabilities or "code smells."
  - Providing objective, third-party feedback on a piece of code.

### 4. `creative-architect`

- **Name:** Creative Architect
- **Philosophy:** The visionary. This template is for high-level, abstract thinking and system design. It intentionally de-emphasizes granular implementation details to encourage "big picture" thinking.
- **Core Competency:** It excels at brainstorming new solutions, comparing architectural patterns (e.g., Microservices vs. Layered), and discussing the trade-offs of different technology choices. It is a strategic partner, not an implementer.
- **Ideal For:**
  - Initial system design and architectural planning sessions.
  - Exploring solutions to complex, non-obvious problems.
  - Generating Architecture Decision Records (ADRs).

### 5. `docu-maintainer`

- **Name:** Docu-Maintainer
- **Philosophy:** The synchronizer. This persona is designed to solve the common problem of documentation becoming out-of-sync with the source code.
- **Core Competency:** It analyzes source code files (including their structure and JSDoc comments) and automatically generates or updates corresponding documentation files. It enforces the principle that the code is the single source of truth.
- **Ideal For:**
  - Maintaining accurate project documentation in a `/docs` directory.
  - Automating the creation of API documentation from source code.
  - Onboarding new developers by providing them with up-to-date explanations of the codebase.
