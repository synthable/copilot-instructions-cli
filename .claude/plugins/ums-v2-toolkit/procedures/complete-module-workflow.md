# Procedure: Complete Module Development Workflow

End-to-end workflow for creating, validating, and adding a module to the standard library.

## Overview

This procedure automates the full lifecycle of module development:
1. **Create** - Generate spec-compliant module
2. **Validate** - Verify spec compliance
3. **Curate** - Evaluate for standard library
4. **Document** - Update library catalog

## When to Use

- Developing new modules for production use
- Contributing to the standard library
- Ensuring consistent module quality
- Training new module authors

## Workflow Steps

### Step 1: Module Creation

Launch the module-generator agent with requirements:

```typescript
Task(
  subagent_type: "module-generator",
  description: "Create new UMS v2.0 module",
  prompt: `Create a new UMS v2.0 module with these requirements:

Purpose: [module purpose]
Tier: [foundation|principle|technology|execution]
Category: [specific category]
Domain: [domain applicability]
Components: [instruction|knowledge|data|multiple]

[Additional context and requirements]

Guide the user through interactive module creation.`
)
```

**Wait for completion.** Module file will be created.

### Step 2: Validation

Immediately validate the created module:

```typescript
Task(
  subagent_type: "module-validator",
  description: "Validate newly created module",
  prompt: `Validate the UMS v2.0 module at: [path-from-step-1]

Provide detailed validation:
- Spec compliance check
- Component structure validation
- Metadata quality assessment
- Export naming verification
- Specific errors/warnings
- Quality score

Mark as PASS/WARNINGS/FAIL.`
)
```

**Decision Point:**
- If **PASS**: Continue to Step 3
- If **WARNINGS**: Ask user if they want to fix warnings or continue
- If **FAIL**: Stop and report errors. Offer to regenerate or fix manually.

### Step 3: Library Curation

Evaluate module for standard library inclusion:

```typescript
Task(
  subagent_type: "library-curator",
  description: "Evaluate for standard library",
  prompt: `Evaluate the module at [path] for standard library inclusion.

Assessment criteria:
1. Quality - meets high standards?
2. Applicability - widely useful?
3. Completeness - well-documented?
4. Uniqueness - fills a gap?
5. Relationships - dependencies clear?

Provide recommendation: ACCEPT/CONDITIONAL/REJECT with rationale.`
)
```

**Decision Point:**
- If **ACCEPT**: Module is added to standard library
- If **CONDITIONAL**: Address conditions then retry
- If **REJECT**: Module remains local, not in standard library

### Step 4: Documentation Update

If module was accepted, update library documentation:

```markdown
✅ **Module added to standard library**

Next steps:
1. Module catalog updated
2. Relationships documented
3. Available for persona composition
4. Discoverable via search
```

## Complete Workflow Example

```markdown
User: "Create a module for API rate limiting best practices"

[Step 1: Create]
You: I'll create an API rate limiting module.

Configuration:
- Tier: Principle
- Category: api-design
- Module ID: principle/api-design/rate-limiting
- Components: Instruction + Knowledge + Data

[Launch module-generator]

You: ✅ Module created at: instruct-modules-v2/modules/principle/api-design/rate-limiting.module.ts

[Step 2: Validate]
You: Validating module for spec compliance...

[Launch module-validator]

You: ✅ Validation: PASS
- Status: Fully spec-compliant
- Quality: 9/10
- All required fields present
- Excellent documentation

[Step 3: Curate]
You: Evaluating for standard library inclusion...

[Launch library-curator]

You: ✅ Library Evaluation: ACCEPTED

Assessment:
- Quality: Excellent (comprehensive patterns)
- Applicability: High (rate limiting is universal)
- Uniqueness: Fills gap in API design modules
- Completeness: Examples, constraints, best practices

[Step 4: Complete]
You: ✅ **Workflow Complete!**

Summary:
- Module: principle/api-design/rate-limiting
- Created: ✅
- Validated: ✅ PASS (9/10)
- Added to Library: ✅ ACCEPTED

The module is now:
✓ Available in standard library
✓ Discoverable via search
✓ Ready for persona composition
✓ Documented in catalog

Next Steps:
- Use in personas: Reference as "principle/api-design/rate-limiting"
- View usage: /ums:curate metrics
- Create related modules: Consider "execution/deployment/rate-limit-config"
```

## Error Handling

### Creation Fails
```markdown
❌ Module creation encountered an error.

Options:
A) Review requirements and retry
B) Use different approach/template
C) Create module manually

What would you like to do?
```

### Validation Fails
```markdown
❌ Module validation failed with [N] errors.

Errors:
1. [error description]
2. [error description]

Options:
A) Fix errors manually
B) Regenerate module with corrections
C) Skip validation (not recommended)

Recommendation: [specific guidance]
```

### Library Rejection
```markdown
❌ Module not accepted to standard library.

Reason: [rejection rationale]

The module is still valid and can be:
- Used locally in your project
- Referenced in your personas
- Improved and resubmitted

Would you like guidance on improvements?
```

## Success Criteria

This workflow is complete when:
- ✅ Module file exists and is valid
- ✅ Validation passes (or warnings addressed)
- ✅ Library decision made (accepted or noted as local)
- ✅ Documentation updated (if accepted)
- ✅ User informed of next steps

## Tips

1. **Gather Requirements First**: Ask clarifying questions before starting
2. **Set Expectations**: Tell user the workflow will have 3-4 steps
3. **Show Progress**: Update user after each step completes
4. **Handle Failures Gracefully**: Offer clear recovery options
5. **Suggest Next Steps**: After completion, suggest creating personas or related modules

## Time Estimate

- Simple module: 5-10 minutes
- Complex module: 15-30 minutes
- Includes user interaction time

## Agent Dependencies

1. module-generator (required - step 1)
2. module-validator (required - step 2)
3. library-curator (required - step 3)
