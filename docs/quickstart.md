# Quick Start Guide

Get up and running with Copilot Instructions Builder in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/copilot-instructions-builder.git
cd copilot-instructions-builder

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (optional)
npm link
```

## Your First Persona

### 1. Initialize Module Directory

```bash
# Create default module structure
copilot-instructions init
```

### 2. Create Your First Module

Create `instructions-modules/principle/code-quality/clean-code.md`:

```markdown
---
name: 'Clean Code Principles'
description: 'Fundamental principles for writing clean, maintainable code'
tags: ['quality', 'best-practices']
---

# Clean Code Principles

- Write code that clearly expresses intent
- Use meaningful variable and function names
- Keep functions small and focused
- Follow the DRY principle
```

### 3. Index Your Modules

```bash
copilot-instructions index
```

### 4. Create a Persona

Create `personas/quality-focused-developer.persona.json`:

```json
{
  "name": "Quality-Focused Developer",
  "description": "A developer who prioritizes code quality",
  "output": ".github/copilot-instructions.md",
  "modules": ["foundation/reasoning/*", "principle/code-quality/*"]
}
```

### 5. Build Your Instructions

```bash
copilot-instructions build personas/quality-focused-developer.persona.json
```

Congratulations! You've created your first Copilot instructions file at `.github/copilot-instructions.md`.

## Next Steps

- Read the [Module System](./module-system.md) documentation
- Explore the [Usage Guide](./usage.md) for advanced features
- Check out [example modules](../examples/) for inspiration
