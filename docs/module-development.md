# Module Development Guide

## Creating Effective Modules

### Module Philosophy

Each module should be:

- **Focused**: Address one specific topic or concept
- **Complete**: Provide sufficient guidance without external dependencies
- **Reusable**: Written generically enough for various contexts
- **Versioned**: Include metadata for tracking changes

### Anatomy of a Module

````markdown
---
name: 'Module Name' # Required: Display name
description: 'Brief description' # Required: One-line summary
version: '1.0.0' # Optional: Semantic version
author: 'Your Name' # Optional: Module author
---

# Module Title

## Overview

Brief introduction to the module's purpose.

## Core Concepts

- Key principle 1
- Key principle 2

## Guidelines

Detailed instructions or rules.

## Examples

```code
// Concrete examples
```

## References

- [Link to documentation]
- [Related resources]
````

### Best Practices by Tier

#### Foundation Modules

- Focus on universal truths
- Avoid technology-specific references
- Use abstract examples
- Keep content timeless

**Good Example:**

```markdown
---
name: 'First Principles Thinking'
description: 'Break down complex problems to fundamental truths'
---

# First Principles Thinking

When solving problems:

1. Question every assumption
2. Break down to fundamental truths
3. Rebuild from the ground up
```

#### Principle Modules

- Reference established practices
- Cite authoritative sources
- Provide methodology context
- Include trade-offs

**Good Example:**

```markdown
---
name: 'SOLID Principles'
description: 'Object-oriented design principles for maintainable code'
---

# SOLID Principles

## Single Responsibility Principle

A class should have only one reason to change.

**Benefits:**

- Improved maintainability
- Easier testing
- Clearer intent

**Trade-offs:**

- May increase number of classes
- Can add initial complexity
```

#### Technology Modules

- Be version-specific when needed
- Include official documentation links
- Provide practical examples
- Note compatibility concerns

**Good Example:**

````markdown
---
name: 'React Hooks Rules'
description: 'Essential rules for using React Hooks correctly'
---

# React Hooks Rules

## Rules of Hooks (React 16.8+)

1. **Only call hooks at the top level**

```javascript
// ✅ Good
function Component() {
  const [state, setState] = useState();
}

// ❌ Bad
function Component() {
  if (condition) {
    const [state, setState] = useState();
  }
}
```
````

#### Execution Modules

- Provide step-by-step instructions
- Include prerequisites
- Add decision points
- Consider error handling

**Good Example:**

````markdown
---
name: 'Create REST API Endpoint'
description: 'Step-by-step guide to create a REST API endpoint'
---

# Create REST API Endpoint

## Prerequisites

- Express.js server running
- Database connection established

## Steps

1. **Define the route**

```javascript
router.post('/api/users', createUser);
```

2. **Implement validation**

```javascript
const { body, validationResult } = require('express-validator');

const validateUser = [body('email').isEmail(), body('name').notEmpty()];
```

3. **Handle the request**
   [detailed implementation...]
````

### Module Testing

Before publishing a module:

1. **Validate frontmatter**

```bash
copilot-instructions validate module.md
```

2. **Test in isolation**

```bash
copilot-instructions build --module principle/testing/tdd
```

3. **Check dependencies**

```bash
copilot-instructions deps principle/testing/tdd
```

4. **Test in context**
   Create a test persona using your module

### Common Pitfalls

1. **Over-coupling**: Don't create unnecessary dependencies
2. **Under-documenting**: Provide context and rationale
3. **Mixing tiers**: Keep tier-appropriate content
4. **Absolute statements**: Use "consider" instead of "always"
5. **Missing examples**: Abstract concepts need concrete examples

### Module Maintenance

- Review modules quarterly
- Update version when making changes
- Deprecate rather than delete
- Provide migration guides for breaking changes
