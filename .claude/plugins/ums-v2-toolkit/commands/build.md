# Command: /ums:build

Develop and maintain the UMS v2.0 build system.

## Your Task

Work on the build system by:
1. Implementing new features
2. Fixing bugs
3. Optimizing performance
4. Adding rendering capabilities

## Usage

```
/ums:build implement [feature]
/ums:build fix [bug-description]
/ums:build optimize [aspect]
/ums:build test [component]
```

## Common Tasks

### Implement Feature

```typescript
Task(
  subagent_type: "build-developer",
  description: "Implement build system feature",
  prompt: `Implement the following feature in the UMS v2.0 build system:

Feature: [description]

Requirements:
- [requirement 1]
- [requirement 2]

Context:
[any relevant context about current implementation]

Provide implementation with:
1. Code changes
2. Tests
3. Documentation updates`
)
```

### Fix Bug

```typescript
Task(
  subagent_type: "build-developer",
  description: "Fix build system bug",
  prompt: `Fix the following bug in the build system:

Bug: [description]
Symptoms: [what's happening]
Expected: [what should happen]

Steps to reproduce:
1. [step 1]
2. [step 2]

Provide fix with tests to prevent regression.`
)
```

### Optimize Performance

```typescript
Task(
  subagent_type: "build-developer",
  description: "Optimize build system",
  prompt: `Optimize the following aspect of the build system:

Aspect: [module loading | rendering | registry | etc.]
Current Performance: [metrics if available]
Target: [performance goal]

Provide optimizations with benchmarks.`
)
```

## Examples

### Example 1: Implement Caching

```
User: /ums:build implement module caching

You: I'll implement module caching to improve build performance.

[Launch build-developer agent with context]

You: ✅ Feature implemented!

**Module Caching System**

Changes:
- Added in-memory cache for loaded modules
- Cache invalidation on file changes
- Cache statistics tracking

Performance Improvement:
- Initial build: ~2000ms
- Cached build: ~200ms (10x faster)

Tests:
- 5 new unit tests added
- All tests passing

Documentation:
- Updated build system docs
- Added caching configuration guide
```

### Example 2: Fix Rendering Bug

```
User: /ums:build fix Data component rendering adds extra backticks

You: I'll fix the Data component rendering issue.

[Launch build-developer agent]

You: ✅ Bug fixed!

**Issue**: Extra backticks in Data component markdown
**Root Cause**: Template literal escaping in renderer
**Fix**: Updated renderData() function with proper escaping

Tests Added:
- Data component rendering test
- Edge case: nested code blocks
- Edge case: special characters

Verified: All existing tests still pass.
```

## Agent Dependencies

- **Primary**: build-developer (required)
- **Supporting**: module-validator (for testing build output)

Remember: Always include tests and documentation with build system changes.
