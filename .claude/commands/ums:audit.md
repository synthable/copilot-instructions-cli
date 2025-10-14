# Command: /ums:audit

Run comprehensive quality audit on all modules and personas.

## Your Task

Execute a complete quality assessment by:

1. Validating all module files
2. Validating all persona files
3. Checking module relationships
4. Generating quality metrics
5. Providing actionable recommendations

## Usage

```
/ums:audit
/ums:audit --modules-only
/ums:audit --personas-only
/ums:audit --with-metrics
```

## Workflow

### Step 1: Discover Files

Use Glob to find all relevant files:

```typescript
// Find all modules
Glob(pattern: "instruct-modules-v2/modules/**/*.module.ts")

// Find all personas
Glob(pattern: "instruct-modules-v2/personas/*.persona.ts")
```

### Step 2: Launch Validators in Parallel

Launch both validators simultaneously:

```typescript
// Launch in parallel using single message with multiple Task calls
[
  Task(
    subagent_type: "module-validator",
    description: "Validate all modules",
    prompt: "Validate all module files in instruct-modules-v2/modules/ and provide summary report"
  ),
  Task(
    subagent_type: "persona-validator",
    description: "Validate all personas",
    prompt: "Validate all persona files in instruct-modules-v2/personas/ and provide summary report"
  )
]
```

### Step 3: Synthesize Comprehensive Report

Combine results into unified report:

````markdown
# 📊 UMS v2.0 Quality Audit Report

**Date**: [timestamp]
**Scope**: Complete library audit

## Executive Summary

**Overall Health**: ✅ Excellent (92% compliance)

- Modules: 12 total (✅ 10 pass, ⚠️ 2 warnings, ❌ 0 fail)
- Personas: 5 total (✅ 5 pass, ⚠️ 1 warning, ❌ 0 fail)
- Average Quality: 8.7/10
- Spec Compliance: 100%

---

## Module Audit Results

**Total**: 12 modules across 4 tiers

### By Tier:

- Foundation: 3 modules (✅ 3 pass)
- Principle: 3 modules (✅ 2 pass, ⚠️ 1 warning)
- Technology: 3 modules (✅ 3 pass)
- Execution: 3 modules (✅ 2 pass, ⚠️ 1 warning)

### Issues Found:

**Warnings (2):**

1. `principle/testing/unit-testing`
   - Missing quality metadata
   - **Fix**: Add quality: { maturity: "stable", confidence: 0.9 }

2. `execution/monitoring/application-monitoring`
   - Sparse semantic metadata (42 chars)
   - **Fix**: Enhance with more keywords

**Critical Errors**: 0 ✅

---

## Persona Audit Results

**Total**: 5 personas

### Status:

- ✅ All personas spec-compliant
- ⚠️ 1 persona with quality recommendations

### Quality Scores:

1. Systems Architect: 9/10 ✅
2. Security Analyst: 9/10 ✅
3. Data Scientist: 8/10 ✅
4. DevOps Engineer: 9/10 ✅
5. Frontend Developer: 8/10 ⚠️

### Issues Found:

**Warnings (1):**

1. Frontend Developer persona
   - Light on execution tier modules (2/12, only 17%)
   - **Recommendation**: Add execution/debugging/browser-debugging

---

## Relationship Integrity

**Module Dependencies**:

- All `requires` references valid: ✅
- All `recommends` references valid: ✅
- No circular dependencies: ✅

**Persona Composition**:

- All module references valid: ✅
- No duplicate module IDs: ✅

---

## Library Metrics

**Coverage by Tier:**

- Foundation: 3/50 target (6%)
- Principle: 3/60 target (5%)
- Technology: 3/100 target (3%)
- Execution: 3/50 target (6%)

**Quality Indicators:**

- Average confidence: 0.91/1.0
- Modules with quality metadata: 10/12 (83%)
- Average semantic length: 78 chars (target: 100+)

---

## Recommendations

### High Priority:

1. ❌ None - No critical issues

### Medium Priority:

2. ⚠️ Add quality metadata to 2 modules
3. ⚠️ Enhance semantic fields (2 modules)
4. ⚠️ Balance execution tier modules in Frontend Developer persona

### Low Priority:

5. 📈 Expand standard library (current: 12, target: 200)
6. 📊 Improve semantic density across all modules

---

## Action Items

Run these commands to address issues:

```bash
# Fix module quality metadata
/ums:validate-module principle/testing/unit-testing
/ums:validate-module execution/monitoring/application-monitoring

# Review persona composition
/ums:validate-persona frontend-developer
```
````

---

## Conclusion

✅ **Library Status**: Production-Ready

The UMS v2.0 library is in excellent health with:

- 100% spec compliance
- Zero critical errors
- High average quality (8.7/10)
- All relationships valid

Minor improvements recommended but not blocking.

```

## Options

**`--modules-only`**: Only validate modules, skip personas
**`--personas-only`**: Only validate personas, skip modules
**`--with-metrics`**: Include detailed metrics and statistics
**`--fix-warnings`**: Automatically fix warnings where possible

## Agent Dependencies

- **Primary**: module-validator, persona-validator
- **Optional**: library-curator (for metrics generation)

Remember: Provide a clear, actionable report with prioritized recommendations.
```
