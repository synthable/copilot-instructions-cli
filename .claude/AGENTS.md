# Claude Code Agents for UMS v2.0

This directory contains specialized agents for working with the Unified Module System v2.0 in Claude Code. Each agent is an expert in a specific domain of UMS development.

## What are Agents?

Agents are specialized AI assistants with deep expertise in specific domains. They can be invoked using Claude Code's Task tool to perform complex, multi-step operations autonomously.

## Available Agents

### 🏗️ build-developer

**Purpose**: Develops and maintains the UMS v2.0 build system

**Expertise**:
- UMS v2.0 build specification (Section 6)
- Module resolution and registry management
- TypeScript dynamic loading with tsx
- Markdown rendering from components
- Build report generation
- SHA-256 hashing for reproducibility

**When to use**:
- Implementing build system features
- Fixing build pipeline bugs
- Optimizing build performance
- Adding new rendering capabilities
- Working on module registry

**Key capabilities**:
- Module registry implementation
- TypeScript module loading with tsx
- Persona resolution and validation
- Component-specific markdown rendering
- Build report generation with SHA-256 digests

---

### 📚 library-curator

**Purpose**: Curates and organizes the standard library of UMS modules

**Expertise**:
- Module organization and taxonomy
- Standard library architecture
- Quality assessment and maintenance
- Module relationships and dependencies
- Library documentation

**When to use**:
- Organizing standard library modules
- Assessing module quality
- Managing module categories
- Documenting library structure
- Planning library evolution

**Key capabilities**:
- Tier organization (foundation, principle, technology, execution)
- Module quality scoring
- Dependency mapping
- Gap analysis
- Library documentation generation

---

### 🎨 module-generator

**Purpose**: Generates UMS v2.0 compliant module files

**Expertise**:
- UMS v2.0 specification mastery
- Component-based architecture design
- Module metadata optimization
- TypeScript module authoring
- Instructional design patterns
- Knowledge representation
- Cognitive hierarchy design

**When to use**:
- Creating new modules from descriptions
- Generating module templates
- Converting existing content to UMS format
- Designing module structures
- Optimizing module metadata

**Key capabilities**:
- Requirements gathering
- Module ID generation
- Export name calculation
- Component selection guidance
- Metadata optimization
- Template-based generation
- Cognitive level assignment (foundation modules)

**Generation workflow**:
1. Gather requirements from user
2. Determine tier and cognitive level
3. Generate module ID following pattern
4. Calculate export name from ID
5. Select template based on component needs
6. Fill in metadata with optimized values
7. Create component(s) with rich content
8. Add relationships if dependencies exist
9. Write file to appropriate directory
10. Validate using module-validator

---

### ✅ module-validator

**Purpose**: Validates module compliance with UMS v2.0 specification

**Expertise**:
- UMS v2.0 specification enforcement
- Module structure validation
- Export convention verification
- Component validation
- Metadata quality assessment
- Error diagnosis and reporting

**When to use**:
- Validating newly created modules
- Checking spec compliance
- Quality assurance before release
- Debugging module issues
- Auditing existing modules

**Key capabilities**:
- Required field validation
- Export naming convention checks
- Component structure validation
- Cognitive level verification (foundation)
- Metadata completeness assessment
- Quality scoring
- Actionable error reporting

**Validation checks**:
- File structure and naming
- Required fields present
- Export convention followed
- Component structure valid
- Metadata complete and optimized
- Relationships properly defined
- Schema version correct

---

### 👤 persona-validator

**Purpose**: Validates persona structure and composition

**Expertise**:
- Persona specification compliance
- Module composition validation
- Dependency resolution
- Quality assessment
- Performance analysis

**When to use**:
- Validating persona files
- Checking module composition
- Verifying module availability
- Assessing persona quality
- Debugging build issues

**Key capabilities**:
- Persona structure validation
- Module reference verification
- Duplicate detection
- Group structure validation
- Module availability checks
- Composition analysis
- Build simulation

**Validation checks**:
- Required persona fields
- Module IDs exist in registry
- No duplicate modules
- Group structure validity
- Metadata completeness
- Build compatibility

---

## Using Agents

### Basic Usage

Agents are invoked using the Task tool in Claude Code:

```typescript
Task(
  subagent_type: "agent-name",
  description: "Brief description of task",
  prompt: `Detailed instructions for the agent...`
)
```

### Example: Generate a Module

```typescript
Task(
  subagent_type: "module-generator",
  description: "Generate async programming module",
  prompt: `Create a UMS v2.0 module for Python async/await best practices.

Tier: technology
Category: python
Module ID: technology/python/async-programming

Include:
- Instruction component with best practices
- Knowledge component explaining async concepts
- Examples of common patterns

Focus on event loop, coroutines, and common pitfalls.`
)
```

### Example: Validate Modules

```typescript
Task(
  subagent_type: "module-validator",
  description: "Validate foundation modules",
  prompt: `Validate all foundation tier modules in:
instruct-modules-v2/modules/foundation/

Provide a comprehensive report with:
- Total modules validated
- Pass/Warning/Fail counts
- List of modules with issues
- Specific recommendations for fixes`
)
```

### Example: Build System Work

```typescript
Task(
  subagent_type: "build-developer",
  description: "Implement module caching",
  prompt: `Implement a caching system for the module loader.

Requirements:
- In-memory cache for loaded modules
- Cache invalidation on file changes
- Cache statistics tracking

Provide implementation with tests and documentation.`
)
```

## Agent Autonomy Levels

All agents operate at **high autonomy**, meaning they:
- Make decisions independently
- Use tools without asking permission
- Follow best practices automatically
- Provide complete solutions
- Include tests and documentation

## Agent Workflows

### Module Creation Workflow

1. User provides module requirements
2. **module-generator** creates the module file
3. **module-validator** validates the output
4. User reviews and approves

### Quality Assurance Workflow

1. **module-validator** checks individual modules
2. **persona-validator** checks personas
3. **library-curator** assesses overall library quality
4. Team addresses issues identified

### Build System Development

1. **build-developer** implements features
2. **module-validator** tests build outputs
3. **persona-validator** validates build results
4. Integration tests verify end-to-end

## Best Practices

### When to Use Agents

✅ **Use agents for**:
- Complex, multi-step operations
- Spec-compliant code generation
- Comprehensive validation
- System-wide analysis
- Automated workflows

❌ **Don't use agents for**:
- Simple file edits
- Quick questions
- One-line changes
- Exploratory tasks

### Working with Agent Output

1. **Review carefully**: Agents are powerful but not infallible
2. **Validate results**: Use validation agents to check generated code
3. **Test thoroughly**: Run tests on agent-generated code
4. **Document changes**: Update docs when agents modify architecture
5. **Iterate**: Refine agent prompts based on output quality

## Agent Dependencies

Agents often work together:

- **module-generator** → **module-validator**: Generate then validate
- **build-developer** → **module-validator**: Build then validate output
- **persona-validator** → **module-validator**: Validate persona then modules
- **library-curator** → **module-validator**: Organize then validate quality

## Extending Agents

To add a new agent:

1. Create `.claude/agents/agent-name.md`
2. Define agent metadata (name, description, tools, autonomy)
3. Document expertise and capabilities
4. Provide usage guidelines and examples
5. Update this AGENTS.md file

## Troubleshooting

### Agent doesn't understand requirements

- Provide more context in the prompt
- Reference specific sections of the spec
- Include examples of desired output

### Agent output needs refinement

- Be more specific in requirements
- Provide examples of edge cases
- Request validation after generation

### Agent seems stuck

- Check if required files exist
- Verify spec is accessible
- Simplify the task into smaller steps

## Resources

- **UMS v2.0 Specification**: `docs/spec/unified_module_system_v2_spec.md`
- **Commands Documentation**: `.claude/COMMANDS.md`
- **Module Authoring Guide**: `docs/unified-module-system/12-module-authoring-guide.md`

---

**Need help?** Use `/ums:create` command to interactively generate modules, or `/ums:validate-module` to validate existing modules.
