# Claude Code Agents for UMS

This directory contains specialized agents for working with the Unified Module System in Claude Code. Each agent is an expert in a specific domain of UMS development.

## What are Agents?

Agents are specialized AI assistants with deep expertise in specific domains. They can be invoked using Claude Code's Task tool to perform complex, multi-step operations autonomously.

## Agent Types

This project has access to two types of agents:

1. **Built-in Agents**: Provided by Claude Code for common development tasks
2. **Project-Specific Agents**: Custom agents for UMS development

## Built-in Agents

### 🔧 gh-cli-expert

**Purpose**: GitHub CLI operations and repository management expert

**Expertise**:
- GitHub CLI (`gh`) command execution
- Pull request management
- Issue tracking and management
- GitHub Actions workflow operations
- Repository operations
- GitHub API interactions

**When to use**:
- When user invokes `gh` commands
- Creating, viewing, or managing pull requests
- Working with GitHub issues
- Checking CI/CD workflow status
- Any GitHub repository operations
- Analyzing PR comments or reviews

**Key capabilities**:
- Execute `gh` commands with proper error handling
- Create and manage pull requests
- List and filter issues
- Check workflow run status
- Clone repositories
- Manage PR comments and reviews
- Query GitHub GraphQL API

**Examples**:

```bash
# User: "Create a PR for this feature"
# Agent launches gh-cli-expert to handle PR creation

# User: "Check the CI status"
# Agent launches gh-cli-expert to query workflows

# User: "gh pr list --state open"
# Agent launches gh-cli-expert to execute command
```

**Note**: This agent is automatically triggered when `gh` commands are detected in user requests.

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

**Built-in vs. Project-Specific Agents**:
- **Built-in agents** (like `gh-cli-expert`) are often triggered automatically when Claude detects relevant commands or contexts
- **Project-specific agents** (UMS agents) should be explicitly invoked for UMS-related tasks

## Agent Autonomy Levels

All agents operate at **high autonomy**, meaning they:
- Make decisions independently
- Use tools without asking permission
- Follow best practices automatically
- Provide complete solutions
- Include tests and documentation

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

## Available Agent Summary

**Built-in Agents** (1):
- `gh-cli-expert` - GitHub CLI and repository operations

**Project-Specific Agents** (0):

## Resources

- **UMS v2.1 Specification**: `docs/spec/unified_module_system_v2_spec.md`
- **Commands Documentation**: `.claude/COMMANDS.md`
