# UMS v2.0 Toolkit Plugin

Comprehensive development toolkit for the Unified Module System v2.0.

## Overview

This plugin provides a complete suite of tools for developing, validating, and maintaining UMS v2.0 modules, personas, and the build system. It organizes 5 specialized agents and multiple workflows into a cohesive, easy-to-use interface.

## Quick Start

```bash
# Create a new module
/ums:create

# Validate a module
/ums:validate-module path/to/module.module.ts

# Validate a persona
/ums:validate-persona path/to/persona.persona.ts

# Run full audit
/ums:audit

# Manage standard library
/ums:curate add path/to/module.module.ts

# Work on build system
/ums:build implement [feature]
```

## Commands

### `/ums:create`
Create a new UMS v2.0 module with interactive guidance.

**Usage:**
```bash
/ums:create
/ums:create error handling for TypeScript
/ums:create foundation module for critical thinking
```

**Features:**
- Interactive requirements gathering
- Tier and component selection
- Automatic export naming
- Optional validation and library addition

---

### `/ums:validate-module`
Validate module files for spec compliance.

**Usage:**
```bash
/ums:validate-module path/to/module.module.ts
/ums:validate-module all
/ums:validate-module foundation
```

**Checks:**
- Required fields present
- Export naming convention
- Component structure
- Metadata quality
- Spec compliance

---

### `/ums:validate-persona`
Validate persona files for spec compliance and quality.

**Usage:**
```bash
/ums:validate-persona path/to/persona.persona.ts
/ums:validate-persona systems-architect
/ums:validate-persona all
```

**Checks:**
- Required fields present
- Module composition correctness
- No duplicate module IDs
- Tier distribution balance
- Identity quality

---

### `/ums:audit`
Run comprehensive quality audit.

**Usage:**
```bash
/ums:audit
/ums:audit --modules-only
/ums:audit --personas-only
```

**Provides:**
- Complete validation of all files
- Quality metrics
- Relationship integrity checks
- Prioritized recommendations
- Actionable next steps

---

### `/ums:curate`
Manage the standard library.

**Usage:**
```bash
/ums:curate add path/to/module.module.ts
/ums:curate remove module-id
/ums:curate metrics
/ums:curate organize foundation
```

**Features:**
- Evaluate modules for inclusion
- Generate library metrics
- Organize tier structure
- Maintain quality standards

---

### `/ums:build`
Develop the build system.

**Usage:**
```bash
/ums:build implement module caching
/ums:build fix rendering bug
/ums:build optimize performance
```

**Capabilities:**
- Implement new features
- Fix bugs
- Optimize performance
- Add rendering rules

## Agents

The plugin includes 5 specialized agents:

### 1. module-validator
Validates module files for spec compliance.
- File: `agents/module-validator.md`
- Subagent type: `module-validator`

### 2. persona-validator
Validates persona files for spec compliance and quality.
- File: `agents/persona-validator.md`
- Subagent type: `persona-validator`

### 3. module-generator
Generates new module files interactively.
- File: `agents/module-generator.md`
- Subagent type: `module-generator`

### 4. build-developer
Develops and maintains the build system.
- File: `agents/build-developer.md`
- Subagent type: `build-developer`

### 5. library-curator
Curates the standard library.
- File: `agents/library-curator.md`
- Subagent type: `library-curator`

## Workflows

The plugin includes reusable workflows:

### Complete Module Development
End-to-end: create → validate → curate
- File: `procedures/complete-module-workflow.md`
- Use: Creating production-ready modules

### Quality Audit
Comprehensive validation of all files
- File: `procedures/quality-audit-workflow.md`
- Use: Regular quality checks

### Library Addition
Validate and add existing modules
- File: `procedures/library-addition-workflow.md`
- Use: Adding pre-existing modules to library

## Common Workflows

### Create and Validate Module
```bash
# Step 1: Create
/ums:create async programming for Python

# Step 2: Validate
/ums:validate-module instruct-modules-v2/modules/technology/python/async-programming.module.ts

# Step 3: Add to library (if quality is good)
/ums:curate add instruct-modules-v2/modules/technology/python/async-programming.module.ts
```

### Regular Quality Check
```bash
# Full audit
/ums:audit

# Review results and fix issues
/ums:validate-module path/to/problematic-module.module.ts
/ums:validate-persona path/to/problematic-persona.persona.ts
```

### Library Management
```bash
# Generate metrics
/ums:curate metrics

# Organize tier
/ums:curate organize foundation

# Add new module
/ums:curate add path/to/module.module.ts
```

## Configuration

Plugin configuration (in `plugin.yml`):

```yaml
config:
  default_modules_path: instruct-modules-v2/modules
  default_personas_path: instruct-modules-v2/personas
  default_output_path: dist
  standard_library_path: instruct-modules-v2/modules
```

## Tips

1. **Start with `/ums:create`** for new modules - it guides you through the process
2. **Always validate** after creating or modifying modules
3. **Run `/ums:audit`** regularly to maintain quality
4. **Use `/ums:curate metrics`** to track library growth
5. **Commands support tab completion** - type `/ums:` and see options

## Examples

### Example 1: New Module Development
```
User: "I need a module for error handling in TypeScript"