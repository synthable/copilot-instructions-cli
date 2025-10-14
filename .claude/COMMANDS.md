# Claude Code Commands for UMS v2.0

This directory contains custom slash commands for working with the Unified Module System v2.0 in Claude Code. Commands provide convenient workflows for common UMS operations.

## What are Commands?

Commands are shortcuts that expand into detailed prompts for specific tasks. Type `/ums:command-name` to trigger a command, which will guide you through the operation or launch specialized agents.

## Available Commands

### 🔍 /ums:audit

**Purpose**: Audit modules and personas for spec compliance and quality

**Usage**:
```
/ums:audit
/ums:audit modules
/ums:audit personas
/ums:audit all
```

**What it does**:
- Validates all modules against UMS v2.0 spec
- Checks personas for composition issues
- Assesses overall library quality
- Generates comprehensive audit report
- Identifies issues requiring attention

**Output includes**:
- Total modules/personas audited
- Pass/Warning/Fail counts
- Quality scores
- List of issues with severity
- Prioritized recommendations

**When to use**:
- Before releases
- After major changes
- Monthly quality checks
- Onboarding reviews
- Pre-merge validation

---

### 🏗️ /ums:build

**Purpose**: Build personas and develop the build system

**Usage**:
```
/ums:build implement [feature]
/ums:build fix [bug-description]
/ums:build optimize [aspect]
/ums:build test [component]
```

**What it does**:
- Implements new build system features
- Fixes build pipeline bugs
- Optimizes build performance
- Tests build components
- Maintains build infrastructure

**Common tasks**:

**Implement feature**:
```
/ums:build implement module caching
```

**Fix bug**:
```
/ums:build fix Data component rendering adds extra backticks
```

**Optimize**:
```
/ums:build optimize module loading performance
```

**Test**:
```
/ums:build test markdown renderer with complex personas
```

**When to use**:
- Adding build system features
- Debugging build issues
- Improving build performance
- Testing build components

---

### ✨ /ums:create

**Purpose**: Create new modules or personas interactively

**Usage**:
```
/ums:create module
/ums:create persona
/ums:create module [description]
/ums:create persona [name]
```

**What it does**:
- Guides you through module/persona creation
- Asks strategic questions
- Generates spec-compliant files
- Validates output automatically
- Provides usage examples

**Interactive flow**:

**For modules**:
1. What is the module's purpose?
2. Which tier does it belong to?
3. What domain does it apply to?
4. What components are needed?
5. What capabilities does it provide?

**For personas**:
1. What is the persona's name?
2. What role will it fulfill?
3. Which modules should be included?
4. How should modules be grouped?
5. What metadata is relevant?

**Example**:
```
User: /ums:create module for Python async best practices

Agent: I'll guide you through creating a Python async programming module.

1. Purpose: Teach best practices for Python async/await
2. Tier: Technology (Python-specific) ✓
3. Domain: python
4. Components recommended:
   - Instruction: Best practices and patterns
   - Knowledge: Async concepts
   - Examples: Common patterns
5. Capabilities: async-programming, concurrency, best-practices

Creating module at: instruct-modules-v2/modules/technology/python/async-programming.module.ts

✅ Module created and validated!
```

**When to use**:
- Starting new modules or personas
- Need guidance on structure
- Want interactive creation
- Prefer step-by-step process

---

### 📚 /ums:curate

**Purpose**: Organize and maintain the module library

**Usage**:
```
/ums:curate organize
/ums:curate assess quality
/ums:curate find gaps
/ums:curate document
```

**What it does**:
- Organizes modules by tier and category
- Assesses library quality
- Identifies coverage gaps
- Documents library structure
- Plans library evolution

**Common tasks**:

**Organize**:
- Review tier organization
- Suggest category improvements
- Identify misplaced modules

**Assess quality**:
- Score module quality
- Identify low-quality modules
- Recommend improvements

**Find gaps**:
- Analyze coverage by tier
- Identify missing capabilities
- Suggest new modules

**Document**:
- Generate library overview
- Create category summaries
- Update documentation

**When to use**:
- Library maintenance
- Planning new modules
- Quality improvement initiatives
- Documentation updates

---

### ✅ /ums:validate-module

**Purpose**: Validate module files for spec compliance

**Usage**:
```
/ums:validate-module path/to/module.module.ts
/ums:validate-module all
/ums:validate-module foundation
/ums:validate-module technology/typescript
```

**What it does**:
- Validates module against UMS v2.0 spec
- Checks required fields
- Verifies export conventions
- Assesses component structure
- Evaluates metadata quality
- Provides actionable feedback

**Validation checks**:
- ✓ File structure valid
- ✓ Required fields present
- ✓ Export convention followed
- ✓ Component structure valid
- ✓ Metadata complete
- ✓ Cognitive level appropriate (foundation)
- ✓ Relationships valid

**Output formats**:

**PASS**:
```markdown
✅ **Module Validation: PASS**

Module: foundation/ethics/do-no-harm
Quality Score: 10/10

This module is fully spec-compliant and ready to use.
```

**WARNINGS**:
```markdown
⚠️ **Module Validation: PASS WITH WARNINGS**

Warnings (2):
1. Missing recommended field: cognitiveLevel
2. Semantic metadata could be more keyword-rich

Would you like me to help fix these issues?
```

**FAIL**:
```markdown
❌ **Module Validation: FAIL**

Critical Errors (3):
1. Missing required field: schemaVersion
2. Invalid module ID format
3. Export name doesn't match convention

This module cannot be used until these errors are fixed.

Would you like me to:
A) Show you how to fix these manually
B) Regenerate the module with correct structure
```

**When to use**:
- After creating/modifying modules
- Before committing changes
- During code reviews
- Debugging module issues
- Quality assurance

---

### 👤 /ums:validate-persona

**Purpose**: Validate persona files for structure and composition

**Usage**:
```
/ums:validate-persona path/to/persona.persona.ts
/ums:validate-persona all
/ums:validate-persona ./personas/
```

**What it does**:
- Validates persona structure
- Checks module references
- Verifies module availability
- Detects duplicates
- Validates group structure
- Assesses composition quality

**Validation checks**:
- ✓ Required persona fields
- ✓ Module IDs exist in registry
- ✓ No duplicate modules
- ✓ Group structure valid
- ✓ Metadata complete
- ✓ Build compatibility

**Output formats**:

**PASS**:
```markdown
✅ **Persona Validation: PASS**

Persona: Backend Developer
Version: 1.0.0
Modules: 24
Groups: 4

All modules found and validated.
No duplicates detected.
Ready to build.
```

**WARNINGS**:
```markdown
⚠️ **Persona Validation: PASS WITH WARNINGS**

Warnings:
- Module 'principle/testing/tdd' not found in standard library
  (Available in local path)
- Consider adding description field

Persona is buildable but has recommendations.
```

**FAIL**:
```markdown
❌ **Persona Validation: FAIL**

Errors (2):
1. Module not found: 'technology/rust/ownership'
2. Duplicate module: 'foundation/ethics/do-no-harm' appears 2 times

Cannot build until these issues are resolved.
```

**When to use**:
- After creating/modifying personas
- Before building
- Debugging build failures
- Verifying module composition

---

## Command Patterns

### Working with Paths

Commands accept various path formats:

```bash
# Specific file
/ums:validate-module path/to/module.module.ts

# All files (wildcards)
/ums:validate-module all
/ums:validate-module *

# By tier
/ums:validate-module foundation
/ums:validate-module principle

# By category
/ums:validate-module technology/typescript
/ums:validate-module execution/deployment
```

### Interactive vs. Direct

**Interactive** (no arguments):
```
/ums:create

Agent: What would you like to create?
1. Module
2. Persona
```

**Direct** (with arguments):
```
/ums:create module for error handling best practices

Agent: Creating error handling module...
```

### Batch Operations

Commands support batch operations:

```bash
# Validate all modules
/ums:validate-module all

# Audit entire library
/ums:audit all

# Validate all personas
/ums:validate-persona all
```

---

## Common Workflows

### Creating a New Module

```bash
1. /ums:create module [description]
2. [Agent generates module]
3. /ums:validate-module [generated-file]
4. [Fix any issues if needed]
5. [Commit to repository]
```

### Pre-Commit Quality Check

```bash
1. /ums:validate-module all
2. /ums:validate-persona all
3. [Fix any failures]
4. [Commit changes]
```

### Library Maintenance

```bash
1. /ums:audit all
2. /ums:curate assess quality
3. /ums:curate find gaps
4. [Plan improvements]
5. /ums:curate document
```

### Build System Development

```bash
1. /ums:build implement [feature]
2. /ums:build test [component]
3. /ums:validate-module [test output]
4. [Commit changes]
```

---

## Command Chaining

Commands can be used sequentially for complex workflows:

```bash
# Create, validate, and audit
/ums:create module
[...module created...]
/ums:validate-module [new-module]
/ums:audit modules

# Build feature and test
/ums:build implement caching
/ums:build test module-loader
/ums:validate-module [test output]
```

---

## Tips and Best Practices

### Effective Command Usage

✅ **Do**:
- Use specific paths when possible
- Validate after creation
- Audit regularly
- Fix issues promptly
- Document changes

❌ **Don't**:
- Skip validation
- Ignore warnings
- Commit failing modules
- Override without reason

### Getting Help

Each command provides guidance when used without arguments:

```bash
/ums:validate-module
# Shows usage examples and options

/ums:create
# Guides through interactive creation

/ums:audit
# Explains audit options
```

### Error Handling

Commands provide clear error messages:

```markdown
❌ File not found: [path]

Did you mean one of these?
- [suggestion 1]
- [suggestion 2]

Or use `/ums:validate-module all` to validate all modules.
```

---

## Extending Commands

To add a new command:

1. Create `.claude/commands/ums:command-name.md`
2. Define command purpose and usage
3. Document workflow steps
4. Provide examples
5. Specify agent dependencies
6. Update this COMMANDS.md file

### Command Template

```markdown
# Command: /ums:command-name

[Brief description of what the command does]

## Your Task

[Detailed task description]

## Usage

[Usage patterns and examples]

## Workflow

[Step-by-step workflow]

## Examples

[Concrete usage examples]

## Agent Dependencies

[Which agents this command uses]
```

---

## Agent Integration

Commands typically delegate to specialized agents:

| Command | Primary Agent | Supporting Agents |
|---------|--------------|-------------------|
| `/ums:audit` | module-validator | persona-validator, library-curator |
| `/ums:build` | build-developer | module-validator |
| `/ums:create` | module-generator | module-validator |
| `/ums:curate` | library-curator | module-validator |
| `/ums:validate-module` | module-validator | - |
| `/ums:validate-persona` | persona-validator | module-validator |

---

## Troubleshooting

### Command not found

```bash
Error: Command '/ums:my-command' not found

Available commands:
- /ums:audit
- /ums:build
- /ums:create
- /ums:curate
- /ums:validate-module
- /ums:validate-persona
```

**Solution**: Check spelling and use tab completion

### Command hangs

- Check if files exist
- Verify paths are correct
- Simplify the operation
- Try with a single file first

### Unexpected output

- Review the prompt
- Check agent configuration
- Verify spec is up to date
- Report issues if reproducible

---

## Resources

- **Agents Documentation**: `.claude/AGENTS.md`
- **UMS v2.0 Specification**: `docs/spec/unified_module_system_v2_spec.md`
- **Module Authoring Guide**: `docs/unified-module-system/12-module-authoring-guide.md`
- **Contributing Guide**: `CONTRIBUTING.md`

---

**Quick Start**: Try `/ums:create module` to create your first module, or `/ums:audit` to check the current library quality!
