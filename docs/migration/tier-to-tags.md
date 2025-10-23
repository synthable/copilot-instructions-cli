# Migration Guide: From Tier-Based to Tag-Based Classification

This guide helps you migrate existing modules from the old 4-tier system (foundation/principle/technology/execution) to the new flexible tag-based classification system in UMS v2.0.

## Overview

The tag-based system provides:
- **More flexibility**: No rigid hierarchy constraints
- **Better discoverability**: Multiple tags for different aspects
- **Clearer semantics**: Tags directly describe what the module does
- **Future-proof**: Easy to add new classification dimensions

## What Changed

### Module ID Format

**Old Format (Tier-Based):**
```typescript
id: 'foundation/logic/deductive-reasoning'
id: 'principle/quality/testing'
id: 'technology/typescript/error-handling'
id: 'execution/release/cut-minor-release'
```

**New Format (Flexible):**
```typescript
id: 'logic/deductive-reasoning'
id: 'quality/testing'
id: 'typescript/error-handling'
id: 'release/cut-minor-release'
```

### Classification Method

**Old Method (Tier Prefix):**
Classification was implicit in the ID structure. The first segment determined the tier.

**New Method (Tags):**
Classification is explicit through tags in metadata:
```typescript
metadata: {
  name: 'Deductive Reasoning',
  description: '...',
  semantic: '...',
  tags: ['foundational', 'reasoning', 'logic', 'critical-thinking']
}
```

## Tag Categories

### Level Tags (Replaces Tier Concept)

Use these to indicate complexity and abstraction level:

- `foundational`: Core concepts, universal principles (was: foundation tier)
- `intermediate`: Applied knowledge, common patterns (was: principle tier)
- `advanced`: Specialized techniques, complex systems (was: technology tier)
- `specialized`: Specific procedures, detailed playbooks (was: execution tier)

### Capability Tags

Describe what the module helps with:
- `reasoning`, `communication`, `error-handling`
- `testing`, `debugging`, `documentation`
- `security`, `performance`, `scalability`

### Domain Tags

Technology or field-specific tags:
- `typescript`, `javascript`, `python`, `rust`
- `web-development`, `backend`, `frontend`
- `database`, `devops`, `ai`

### Pattern Tags

Design patterns and approaches:
- `solid`, `ddd`, `tdd`, `bdd`
- `functional`, `oop`, `reactive`
- `async`, `event-driven`, `microservices`

## Migration Steps

### Step 1: Update Module ID

Remove the tier prefix from your module ID:

```typescript
// Before
export const myModule: Module = {
  id: 'foundation/reasoning/deductive-logic',
  // ...
}

// After
export const myModule: Module = {
  id: 'reasoning/deductive-logic',
  // ...
}
```

### Step 2: Add Appropriate Tags

Add tags that describe your module's characteristics:

```typescript
// Before
export const myModule: Module = {
  id: 'foundation/reasoning/deductive-logic',
  metadata: {
    name: 'Deductive Logic',
    description: 'Apply deductive reasoning to solve problems',
    semantic: 'Logical deduction from premises to conclusions'
  }
}

// After
export const myModule: Module = {
  id: 'reasoning/deductive-logic',
  metadata: {
    name: 'Deductive Logic',
    description: 'Apply deductive reasoning to solve problems',
    semantic: 'Logical deduction from premises to conclusions',
    tags: [
      'foundational',      // Level (was foundation tier)
      'reasoning',         // Capability
      'logic',            // Domain
      'critical-thinking' // Pattern
    ]
  }
}
```

### Step 3: Update Cognitive Level (Optional)

If your module had a layer property in the old system, convert it to cognitiveLevel:

```typescript
export const myModule: Module = {
  id: 'reasoning/deductive-logic',
  cognitiveLevel: 2, // 0-4, where 0 is most fundamental
  // ...
}
```

### Step 4: Update File Location (Optional)

Consider reorganizing your file structure to match the new ID format:

```bash
# Before
./modules/foundation/reasoning/deductive-logic.module.ts

# After (suggested)
./modules/reasoning/deductive-logic.module.ts
```

### Step 5: Update Persona References

Update persona files to use new module IDs:

```typescript
// Before
export default {
  name: 'My Persona',
  modules: [
    'foundation/reasoning/deductive-logic',
    'principle/quality/testing'
  ]
} satisfies Persona;

// After
export default {
  name: 'My Persona',
  modules: [
    'reasoning/deductive-logic',
    'quality/testing'
  ]
} satisfies Persona;
```

## Example Migrations

### Example 1: Foundation Module

**Before:**
```typescript
export const ethicalAI: Module = {
  id: 'foundation/ethics/do-no-harm',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['ethics', 'safety'],
  metadata: {
    name: 'Do No Harm',
    description: 'Ethical principle to avoid harmful actions',
    semantic: 'AI assistant must prioritize safety and avoid harmful outputs'
  },
  instruction: {
    purpose: 'Ensure AI behavior aligns with ethical principles',
    principles: [
      'Never generate harmful content',
      'Consider consequences of responses',
      'Prioritize user and societal safety'
    ]
  }
};
```

**After:**
```typescript
export const ethicalAI: Module = {
  id: 'ethics/do-no-harm',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['ethics', 'safety'],
  cognitiveLevel: 0, // Most fundamental
  metadata: {
    name: 'Do No Harm',
    description: 'Ethical principle to avoid harmful actions',
    semantic: 'AI assistant must prioritize safety and avoid harmful outputs',
    tags: ['foundational', 'ethics', 'safety', 'principles']
  },
  instruction: {
    purpose: 'Ensure AI behavior aligns with ethical principles',
    principles: [
      'Never generate harmful content',
      'Consider consequences of responses',
      'Prioritize user and societal safety'
    ]
  }
};
```

### Example 2: Technology Module

**Before:**
```typescript
export const reactHooks: Module = {
  id: 'technology/react/hooks-patterns',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['react', 'frontend'],
  metadata: {
    name: 'React Hooks Patterns',
    description: 'Best practices for using React hooks',
    semantic: 'Common patterns for useState, useEffect, and custom hooks'
  },
  // ...
};
```

**After:**
```typescript
export const reactHooks: Module = {
  id: 'react/hooks-patterns',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['react', 'frontend'],
  cognitiveLevel: 2, // Intermediate complexity
  metadata: {
    name: 'React Hooks Patterns',
    description: 'Best practices for using React hooks',
    semantic: 'Common patterns for useState, useEffect, and custom hooks',
    tags: [
      'intermediate',
      'react',
      'frontend',
      'javascript',
      'typescript',
      'functional'
    ]
  },
  // ...
};
```

### Example 3: Execution Module

**Before:**
```typescript
export const deployProduction: Module = {
  id: 'execution/deployment/production-checklist',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['deployment', 'devops'],
  metadata: {
    name: 'Production Deployment Checklist',
    description: 'Step-by-step production deployment procedure',
    semantic: 'Comprehensive checklist for safe production deployments'
  },
  // ...
};
```

**After:**
```typescript
export const deployProduction: Module = {
  id: 'deployment/production-checklist',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['deployment', 'devops'],
  cognitiveLevel: 3, // Specialized knowledge
  metadata: {
    name: 'Production Deployment Checklist',
    description: 'Step-by-step production deployment procedure',
    semantic: 'Comprehensive checklist for safe production deployments',
    tags: [
      'specialized',
      'deployment',
      'devops',
      'production',
      'checklist',
      'ci-cd'
    ]
  },
  // ...
};
```

## CLI Changes

### List Command

**Before:**
```bash
copilot-instructions list --tier foundation
copilot-instructions list --tier technology
```

**After:**
```bash
copilot-instructions list --tag foundational
copilot-instructions list --tag typescript
copilot-instructions list --tag reasoning
```

### Search Command

**Before:**
```bash
copilot-instructions search "testing" --tier principle
```

**After:**
```bash
copilot-instructions search "testing" --tag intermediate
copilot-instructions search "testing" --tag quality
```

## Best Practices

### Choose Appropriate Tags

1. **Always include a level tag**: `foundational`, `intermediate`, `advanced`, or `specialized`
2. **Add capability tags**: What does this module help with?
3. **Include domain tags**: What technology or field does it relate to?
4. **Use pattern tags**: What approaches or methodologies does it embody?

### Keep Tags Consistent

Use lowercase kebab-case for all tags:
- ✅ `error-handling`, `critical-thinking`, `web-development`
- ❌ `Error-Handling`, `Critical_Thinking`, `Web Development`

### Don't Over-Tag

Aim for 3-6 meaningful tags. Too many tags reduce discoverability:
- ✅ `['foundational', 'reasoning', 'logic', 'critical-thinking']`
- ❌ `['foundational', 'reasoning', 'logic', 'critical-thinking', 'analysis', 'deductive', 'inductive', 'problem-solving', 'thinking', 'cognitive']`

### Use Semantic Tags

Choose tags that describe what users would search for:
- ✅ `testing`, `error-handling`, `typescript`
- ❌ `module-a`, `util`, `helper`

## Validation

After migration, validate your modules:

```bash
copilot-instructions validate ./modules
```

The validator will check:
- Module ID format (no tier prefix required)
- Tag format (lowercase)
- Schema compliance

## Gradual Migration

You don't need to migrate everything at once:

1. **New modules**: Use the new tag-based format immediately
2. **Updated modules**: Migrate when you make significant changes
3. **Legacy modules**: Can continue to work with old IDs if needed

The system is designed to be backward compatible, but new features may require the tag-based format.

## Need Help?

- Check the [README](../../README.md) for examples
- Review module fixtures in the test directories
- Open an issue on GitHub for questions

## Summary

The tag-based classification system provides:
- ✅ More flexibility in organizing modules
- ✅ Better search and discovery capabilities  
- ✅ Clearer semantic meaning
- ✅ Future-proof extensibility
- ✅ No rigid hierarchy constraints

Start using tags in your new modules today, and migrate existing modules gradually as you maintain them.
