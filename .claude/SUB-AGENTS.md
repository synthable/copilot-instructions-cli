# Claude Code Sub-Agents for UMS

**Critical Rules:**
1. Use the Task tool to invoke sub-agents - never perform their tasks directly
2. **Multiple sequential git/gh commands MUST use git-github-operator agent** (single commands OK via Bash)
3. Provide complete, self-contained prompts - agents cannot ask follow-ups
4. Check for existing claude-code-guide agents to resume before spawning new ones
5. Use proactively for security-auditor and architect-reviewer when applicable

---

## Built-in Sub-Agents

### 🔍 general-purpose

**Use when:**
- Searching for a keyword/file and NOT confident you'll find it in first few tries
- Complex multi-step research requiring multiple search rounds

**Don't use when:**
- Searching for specific class/file you know exists (use Glob/Read)
- Searching within 2-3 specific files (use Read)

**Example:**
```
User: "How does authentication work across the entire application?"
Assistant: I'll use the Task tool with subagent_type=general-purpose to research the
authentication flow comprehensively across multiple components.
```

---

### 📚 claude-code-guide

**Use when user asks:**
- "Can Claude Code..." or "Does Claude Code have..."
- How to use features (hooks, slash commands, MCP servers)
- Claude Agent SDK questions

**IMPORTANT:** Check if existing claude-code-guide agent can be resumed before spawning new one.

**Example:**
```
User: "How do I create a custom slash command?"
Assistant: I'll use Task tool to launch claude-code-guide agent to get accurate info
from official documentation.
```

---

### 🗂️ Explore

**Use when:**
- User asks WHERE or HOW something works (not specific file/class)
- Need to understand codebase structure: "how do API endpoints work?"
- Exploring unfamiliar code areas

**Don't use when:**
- Have specific file path (use Read)
- Planning implementation (use Plan or ExitPlanMode)

**Thoroughness levels:** `quick`, `medium` (default), `very thorough`

**Example:**
```
User: "Where are client errors handled?"
Assistant: I'll use Task tool with subagent_type=Explore to find client error handling.
Prompt: "Find where client errors are handled. Thoroughness: medium"
```

---

### 📋 Plan

**Use when:**
- Need to plan implementation approach for a feature
- User asks to plan/design how to implement something

**Don't use when:**
- Purely research/info gathering (use Explore)

---

### 🏛️ architect-reviewer

**Use when:**
- Pull requests with significant structural changes
- Adding new services to the system
- Need to validate design against SOLID principles

**Use proactively** for major architectural changes.

**Example:**
```
User: "Can you check if this new service is designed correctly?"
Assistant: I'll use Task tool to launch architect-reviewer to analyze service
boundaries and dependencies.
```

---

### 🐙 git-github-operator

**Use when:**
- **Multiple sequential git/gh commands** needed (e.g., branch + commit + push)
- **Creating/reviewing pull requests**
- **Complex git workflows** (merges, rebases, conflict resolution)
- **GitHub-specific tasks** (issues, workflows, gh CLI operations)

**Don't use when:**
- Single, simple git command (e.g., `git status`, `git log`, `git diff`)
- Single commit or push operation
- Direct Bash execution is faster and sufficient

**Example - Multiple commands:**
```
User: "Create a new branch called feature/user-auth and push it"
Assistant: I'll use Task tool to launch git-github-operator to create and push the branch.
Prompt: "Create branch feature/user-auth, switch to it, and push to origin"
```

**Example - PR creation:**
```
User: "Show me the diff and create a PR"
Assistant: I'll use Task tool to launch git-github-operator to analyze the diff and create a PR.
```

---

### 🔒 security-auditor

**Use when:**
- After implementing security-sensitive code (auth, DB, JWT)
- Before merging feature branches
- Checking for secrets or vulnerabilities

**Use proactively** after security-related changes.

**Example:**
```
User: "I've finished implementing JWT authentication"
Assistant: Let me use Task tool to launch security-auditor to perform a security audit.
```

---

## Decision Tree

```
START
│
├─ Multiple sequential git/gh commands OR creating PR?
│  └─ YES → MUST use git-github-operator
│  └─ NO (single command) → OK to use Bash directly
│
├─ Search for specific file/class I know exists?
│  └─ YES → Use Glob/Read directly
│  └─ NO → Use Explore or general-purpose
│
├─ User asks about Claude Code features?
│  └─ YES → Use claude-code-guide (check if can resume existing)
│
├─ Security-sensitive code or before merge?
│  └─ YES → Use security-auditor (proactive)
│
├─ Major structural changes?
│  └─ YES → Use architect-reviewer (proactive)
│
└─ Need to understand HOW something works?
   └─ Use Explore (with thoroughness level)
```

---

## Common Mistakes

❌ **Running multiple git commands directly** → ✅ **Use git-github-operator for sequential operations**

❌ Using Explore to read a specific file you know exists → ✅ Use Read directly

❌ Using general-purpose for simple searches → ✅ Use Glob/Grep

❌ Spawning new claude-code-guide without checking → ✅ Resume existing agent

❌ Vague agent prompts → ✅ Provide complete context with exact files/scope

❌ Forgetting thoroughness level for Explore → ✅ Always specify: quick/medium/very thorough

---

## Quick Reference

| Agent               | Use For                     | Proactive?          |
| ------------------- | --------------------------- | ------------------- |
| general-purpose     | Complex multi-step research | No                  |
| claude-code-guide   | Claude Code docs/features   | No                  |
| Explore             | "How/where does X work?"    | No                  |
| Plan                | Implementation planning     | No                  |
| architect-reviewer  | Architecture review         | Yes (major changes) |
| git-github-operator | Git/GitHub operations       | Yes                 |
| security-auditor    | Security audits             | Yes (security code) |
