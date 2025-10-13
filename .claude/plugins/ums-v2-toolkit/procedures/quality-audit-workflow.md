# Procedure: Comprehensive Quality Audit Workflow

Systematic validation of all modules and personas with detailed reporting.

## Overview

Execute comprehensive quality audit:
1. Discover all module and persona files
2. Validate in parallel
3. Check relationships and dependencies
4. Generate metrics
5. Provide prioritized recommendations

## Workflow Steps

### Step 1: Discovery

Use Glob to find all files:
```typescript
// Modules
Glob(pattern: "instruct-modules-v2/modules/**/*.module.ts")

// Personas
Glob(pattern: "instruct-modules-v2/personas/*.persona.ts")
```

### Step 2: Parallel Validation

Launch both validators simultaneously:

```typescript
// Single message with multiple Task calls for parallelism
[
  Task(
    subagent_type: "module-validator",
    prompt: "Validate all modules in instruct-modules-v2/modules/ and provide summary"
  ),
  Task(
    subagent_type: "persona-validator",
    prompt: "Validate all personas in instruct-modules-v2/personas/ and provide summary"
  )
]
```

### Step 3: Synthesize Report

Combine results into comprehensive report:

```markdown
# UMS v2.0 Quality Audit

**Modules**: [count] total
- ✅ [count] PASS ([%])
- ⚠️ [count] WARNINGS ([%])
- ❌ [count] FAIL ([%])

**Personas**: [count] total
- ✅ [count] PASS ([%])
- ⚠️ [count] WARNINGS ([%])
- ❌ [count] FAIL ([%])

**Overall Health**: [Excellent|Good|Needs Improvement]

## Priority Actions

### Critical (Fix Immediately):
1. [Critical issue]

### Medium (Address Soon):
1. [Medium issue]

### Low (Nice to Have):
1. [Low priority improvement]

## Detailed Results
[Detailed breakdown by tier/persona]
```

## Success Criteria

- All files discovered and validated
- Results aggregated and prioritized
- Actionable recommendations provided
- User understands next steps

## Agent Dependencies

- module-validator (required)
- persona-validator (required)
- library-curator (optional - for metrics)
