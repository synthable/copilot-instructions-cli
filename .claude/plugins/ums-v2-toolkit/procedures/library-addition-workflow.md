# Procedure: Library Addition Workflow

Validate an existing module and add it to the standard library.

## Overview

Process for adding pre-existing modules:
1. Validate module for spec compliance
2. Assess quality and suitability
3. Evaluate for library inclusion
4. Update library catalog

## When to Use

- Adding custom modules to standard library
- Promoting local modules to standard status
- Contributing community modules
- Migrating modules from v1.0

## Workflow Steps

### Step 1: Validation

Verify module is spec-compliant:

```typescript
Task(
  subagent_type: "module-validator",
  prompt: `Validate module at [path].

Ensure:
- All required fields present
- Export convention followed
- Components properly structured
- Metadata complete
- Quality acceptable for library

Provide PASS/FAIL status.`
)
```

**Gate**: Module must PASS validation to continue.

### Step 2: Library Evaluation

Evaluate for standard library:

```typescript
Task(
  subagent_type: "library-curator",
  prompt: `Evaluate module at [path] for standard library inclusion.

Criteria:
- Quality standards met?
- Widely applicable?
- Fills a gap?
- Well-documented?
- Dependencies manageable?

Recommend: ACCEPT/CONDITIONAL/REJECT`
)
```

**Decision**:
- ACCEPT → Add to library
- CONDITIONAL → Address issues
- REJECT → Keep as local module

### Step 3: Library Addition

If accepted, add to library:

```markdown
✅ Module added to standard library

Actions taken:
- Module file moved/copied to standard location
- Library catalog updated
- Relationships documented
- Module now discoverable

Available as: [module-id]
```

## Example

```markdown
User: "Add my error-handling module to the standard library"

[Step 1: Validate]
You: Validating error-handling module...

Result: ✅ PASS
- Spec compliant
- Quality: 8/10
- Ready for evaluation

[Step 2: Evaluate]
You: Evaluating for library inclusion...

Result: ✅ ACCEPTED
- Fills gap in error handling patterns
- High quality documentation
- Clear relationships

[Step 3: Add]
You: Adding to standard library...

✅ Complete!
- Module: principle/patterns/error-handling
- Status: Now in standard library
- Available for all personas
```

## Success Criteria

- Module validated and accepted
- Library catalog updated
- Module accessible to all users
- Documentation reflects addition

## Agent Dependencies

- module-validator (required)
- library-curator (required)
