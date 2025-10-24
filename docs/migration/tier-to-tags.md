# Migration Guide: From 4-Tier to Cognitive Level Classification

This guide helps you migrate existing modules from the old 4-tier system (foundation/principle/technology/execution) to the new cognitive level classification system in UMS v2.0.

## Overview

The cognitive level system provides:
- **Type safety**: TypeScript enum with compile-time validation
- **Semantic clarity**: 7-level hierarchy from axioms (0) to meta-cognition (6)
- **Multi-dimensional filtering**: Separate filters for level, capability, domain, and tags
- **Better discoverability**: Rich metadata for powerful search
- **Future-proof**: Easy to extend with new capabilities and domains

## What Changed

### 1. Module ID Format

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

### 2. Classification Method

**Old Method (Tier Prefix):**
- Classification was implicit in the ID structure
- The first segment determined the tier (foundation/principle/technology/execution)
- No explicit abstraction level field

**New Method (Cognitive Level Enum):**
```typescript
import { Module, CognitiveLevel } from 'ums-lib';

export const deductiveReasoning: Module = {
  id: 'logic/deductive-reasoning',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['reasoning', 'logic'],
  cognitiveLevel: CognitiveLevel.REASONING_FRAMEWORKS, // Required!
  metadata: {
    name: 'Deductive Reasoning',
    description: '...',
    semantic: '...',
    tags: ['reasoning', 'logic', 'critical-thinking'] // Optional
  }
};
```

## Cognitive Level Hierarchy (0-6)

The `cognitiveLevel` field is **required** and uses a TypeScript enum:

| Level | Enum Value | Description | Examples |
|-------|-----------|-------------|----------|
| **0** | `AXIOMS_AND_ETHICS` | Universal truths, ethical bedrock | "Do No Harm", "Respect Privacy" |
| **1** | `REASONING_FRAMEWORKS` | How to think and analyze | "Systems Thinking", "Critical Analysis" |
| **2** | `UNIVERSAL_PATTERNS` | Cross-domain patterns | "SOLID", "Separation of Concerns" |
| **3** | `DOMAIN_SPECIFIC_GUIDANCE` | Field-specific best practices | "REST API Design", "DB Normalization" |
| **4** | `PROCEDURES_AND_PLAYBOOKS` | Step-by-step instructions | "Git Workflow", "Code Review Process" |
| **5** | `SPECIFICATIONS_AND_STANDARDS` | Precise requirements | "OpenAPI Schema", "Security Checklist" |
| **6** | `META_COGNITION` | Self-reflection, improvement | "Retrospective", "Continuous Improvement" |

## Classification Dimensions

UMS v2.0 supports multiple independent classification dimensions:

### Cognitive Level (Required)
- **Field**: `cognitiveLevel: CognitiveLevel`
- **Purpose**: Abstraction level in cognitive hierarchy
- **Usage**: `cognitiveLevel: CognitiveLevel.UNIVERSAL_PATTERNS`

### Capabilities (Required)
- **Field**: `capabilities: string[]`
- **Purpose**: What the module helps accomplish
- **Examples**: `['reasoning', 'logic']`, `['testing', 'quality']`, `['error-handling']`

### Domain (Optional)
- **Field**: `domain?: string | string[]`
- **Purpose**: Technology/field where module applies
- **Examples**: `'typescript'`, `'language-agnostic'`, `['backend', 'api']`

### Tags (Optional)
- **Field**: `metadata.tags?: string[]`
- **Purpose**: Additional keywords for search and discovery
- **Examples**: `['logic', 'critical-thinking']`, `['async', 'performance']`

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

### Step 3: Add Required Cognitive Level Field

⚠️ **REQUIRED** - All UMS v2.0 modules must specify a cognitive level:

```typescript
import { Module, CognitiveLevel } from 'ums-lib';

export const myModule: Module = {
  id: 'reasoning/deductive-logic',
  cognitiveLevel: CognitiveLevel.REASONING_FRAMEWORKS, // Required! 0-6 range
  // ...
}
```

**Cognitive Level Values** (use enum for type safety):
- `CognitiveLevel.AXIOMS_AND_ETHICS` (0) - Universal truths, ethical bedrock
- `CognitiveLevel.REASONING_FRAMEWORKS` (1) - How to think and analyze
- `CognitiveLevel.UNIVERSAL_PATTERNS` (2) - Cross-domain patterns
- `CognitiveLevel.DOMAIN_SPECIFIC_GUIDANCE` (3) - Field-specific best practices
- `CognitiveLevel.PROCEDURES_AND_PLAYBOOKS` (4) - Step-by-step instructions
- `CognitiveLevel.SPECIFICATIONS_AND_STANDARDS` (5) - Precise requirements
- `CognitiveLevel.META_COGNITION` (6) - Self-reflection, improvement

**Or use numeric values** (0-6):
```typescript
cognitiveLevel: 2, // Acceptable, but enum is preferred for type safety
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
