# Parallel Agent Execution Guide

## Core Concept

Multiple agents run **simultaneously** when invoked in a single message with multiple `Task` tool calls.

## Syntax

```typescript
// Multiple Task invocations in single message
Task({ subagent_type: 'agent-1', description: '...', prompt: '...' })
Task({ subagent_type: 'agent-2', description: '...', prompt: '...' })
```

## Available Agent Types

### Code Quality Agents
- `pr-review-toolkit:code-reviewer` - Code review for style, bugs, security
- `pr-review-toolkit:code-simplifier` - Simplify code while preserving functionality
- `pr-review-toolkit:comment-analyzer` - Analyze code comments for accuracy
- `pr-review-toolkit:pr-test-analyzer` - Review test coverage quality
- `pr-review-toolkit:silent-failure-hunter` - Identify silent failures, inadequate error handling
- `pr-review-toolkit:type-design-analyzer` - Analyze type design quality

### Development Agents
- `feature-dev:code-architect` - Design feature architectures
- `feature-dev:code-explorer` - Analyze existing codebase features
- `feature-dev:code-reviewer` - Review code with confidence-based filtering
- `general-purpose` - Multi-step tasks, research, code search

### UMS v2.0 Agents
- `ums-v2-standard-library-curator` - Curate standard library modules
- `ums-v2-persona-validator` - Validate persona files
- `ums-v2-build-developer` - Develop build system
- `ums-v2-module-validator` - Validate module files
- `ums-v2-module-generator` - Generate UMS v2.0 modules

### Workflow Agents
- `git-workflow:git-flow-manager` - Git Flow operations
- `github-cli-handler` - GitHub CLI operations
- `workflow-optimizer` - Detect and optimize repetitive tasks
- `failure-pattern-detector` - Analyze repeated failure patterns
- `security-auditor` - Security and code quality audits
- `context-conflict-detector` - Detect conflicting requirements

### Documentation Agents
- `documentation-generator:technical-writer` - Technical content creation
- `documentation-generator:docusaurus-expert` - Docusaurus documentation

### Setup Agents
- `statusline-setup` - Configure Claude Code status line
- `output-style-setup` - Create output styles

## Common Parallel Patterns

### 1. Code Review + Testing
```typescript
// Review code quality while running tests
Task({
  subagent_type: 'pr-review-toolkit:code-reviewer',
  description: 'Review refactored modules',
  prompt: 'Review modules for style violations, bugs, and adherence to machine-first principles. Focus on: hooks-patterns.module.ts, accessibility.module.ts, react-patterns.module.ts'
})

Task({
  subagent_type: 'general-purpose',
  description: 'Run test suite',
  prompt: 'Run npm test across all packages and report results with coverage metrics'
})
```

### 2. Multiple Code Reviews
```typescript
// Review different aspects simultaneously
Task({
  subagent_type: 'pr-review-toolkit:code-simplifier',
  description: 'Simplify complex code',
  prompt: 'Analyze refactored modules for unnecessary complexity'
})

Task({
  subagent_type: 'pr-review-toolkit:type-design-analyzer',
  description: 'Analyze type design',
  prompt: 'Review TypeScript types in refactored modules for proper encapsulation'
})

Task({
  subagent_type: 'pr-review-toolkit:comment-analyzer',
  description: 'Verify comment accuracy',
  prompt: 'Check that comments in refactored modules accurately reflect the code'
})
```

### 3. Architecture Analysis + Validation
```typescript
// Understand existing code while validating new code
Task({
  subagent_type: 'feature-dev:code-explorer',
  description: 'Analyze module patterns',
  prompt: 'Explore existing module patterns to understand consistency'
})

Task({
  subagent_type: 'ums-v2-module-validator',
  description: 'Validate refactored modules',
  prompt: 'Validate all refactored modules against UMS v2.0 spec'
})
```

### 4. Documentation + Security
```typescript
// Generate docs while auditing security
Task({
  subagent_type: 'documentation-generator:technical-writer',
  description: 'Document refactoring',
  prompt: 'Create user guide for machine-first module architecture'
})

Task({
  subagent_type: 'security-auditor',
  description: 'Security audit',
  prompt: 'Audit refactored modules for security issues'
})
```

## Benefits

1. **Speed**: Agents execute simultaneously, not sequentially
2. **Independence**: Each agent operates on separate concerns
3. **Efficiency**: Complete multi-step workflows in single round-trip
4. **Validation**: Cross-verify results from different perspectives

## Best Practices

### Do
- ✅ Use parallel agents for **independent** tasks
- ✅ Ensure each agent has complete context in its prompt
- ✅ Handle partial failures gracefully (one agent error doesn't block others)
- ✅ Combine complementary agents (review + test, explore + validate)

### Don't
- ❌ Use parallel agents for **dependent** tasks (A must complete before B)
- ❌ Launch excessive agents (2-4 optimal, diminishing returns beyond)
- ❌ Assume agents communicate (they run independently)
- ❌ Use parallel agents when sequential logic required

## Error Handling

**Partial failures are independent**:
```typescript
// Agent 1 fails with error
// Agent 2 succeeds and returns results
// Handle each result separately
```

**Example** (from real execution):
```
Result 1: Error - Agent type 'code-reviewer' not found
Result 2: Success - Test suite completed, 349 tests passed
```

## When NOT to Use Parallel Agents

**Use sequential execution when**:
- Agent B needs output from Agent A
- Tasks have strict ordering requirements
- Shared state modification required
- Results must be synthesized before next step

**Example** (sequential required):
```typescript
// WRONG: These should be sequential
Task({ subagent_type: 'ums-v2-module-generator', prompt: 'Generate module X' })
Task({ subagent_type: 'ums-v2-module-validator', prompt: 'Validate module X' })
// Validator runs before generator completes!

// RIGHT: Wait for generator, then validate
Task({ subagent_type: 'ums-v2-module-generator', prompt: 'Generate module X' })
// Wait for result, then invoke validator in next message
```

## Performance Considerations

**Optimal agent count**: 2-4 agents per parallel invocation
- 2 agents: Common case (review + test)
- 3-4 agents: Complex workflows (multiple review aspects)
- 5+ agents: Diminishing returns, harder to manage results

**Execution time**: Determined by slowest agent
- Fast agent: Code review (~30s)
- Medium agent: Test suite (~60s)
- Slow agent: Full codebase exploration (~120s)
- Total time = max(agent times), not sum

## Real-World Examples

### PR Preparation
```typescript
// Before creating PR, validate all aspects
Task({
  subagent_type: 'pr-review-toolkit:code-reviewer',
  description: 'Review for style violations',
  prompt: 'Review all changed files for code quality issues'
})

Task({
  subagent_type: 'pr-review-toolkit:pr-test-analyzer',
  description: 'Analyze test coverage',
  prompt: 'Check if PR has adequate test coverage'
})

Task({
  subagent_type: 'pr-review-toolkit:silent-failure-hunter',
  description: 'Check error handling',
  prompt: 'Identify any silent failures or inadequate error handling in PR'
})
```

### Module Refactoring Validation
```typescript
// Validate refactored modules from multiple angles
Task({
  subagent_type: 'ums-v2-module-validator',
  description: 'Validate UMS compliance',
  prompt: 'Validate refactored modules against UMS v2.0 specification'
})

Task({
  subagent_type: 'pr-review-toolkit:type-design-analyzer',
  description: 'Analyze TypeScript types',
  prompt: 'Review type design in refactored modules for proper encapsulation'
})

Task({
  subagent_type: 'general-purpose',
  description: 'Run tests',
  prompt: 'Execute test suite and verify refactored modules integrate correctly'
})
```

### Feature Development
```typescript
// Understand existing patterns while designing new feature
Task({
  subagent_type: 'feature-dev:code-explorer',
  description: 'Explore existing patterns',
  prompt: 'Analyze how similar features are implemented in the codebase'
})

Task({
  subagent_type: 'feature-dev:code-architect',
  description: 'Design feature architecture',
  prompt: 'Design architecture for new feature based on project patterns'
})
```

## Integration with Machine-First Architecture

**Validate refactored modules**:
```typescript
Task({
  subagent_type: 'ums-v2-module-validator',
  description: 'Validate structure',
  prompt: 'Check refactored modules follow machine-first principles: Functional > Structural > Reference > Narrative'
})

Task({
  subagent_type: 'pr-review-toolkit:code-reviewer',
  description: 'Review implementation',
  prompt: 'Verify Data components provide functional tools, not reference catalogs'
})
```

## Summary

**Key Takeaway**: Launch independent agents in parallel for faster, more comprehensive validation.

**Pattern**: Single message → Multiple Task calls → Simultaneous execution → Independent results
