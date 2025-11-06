# ADR 0005: Simplify ProcessStep Structure

**Status:** Accepted
**Date:** 2025-01-15
**Context:** Reducing complexity in the ProcessStep interface by removing underutilized structured fields in favor of natural language flexibility.

## Context

The UMS v2.0 specification defines a complex `ProcessStep` interface with five fields:

```typescript
interface ProcessStep {
  step: string;       // Main step description
  detail?: string;    // Additional context
  when?: string;      // Conditional execution
  do?: string;        // Explicit action
  validate?: {        // Validation criteria
    check: string;
    severity?: 'error' | 'warning';
  };
}
```

This structure was designed to provide machine-readable structure for complex procedural instructions. However, analysis of the design reveals several issues:

1. **Authoring Friction**: Module authors face ambiguity about which field to use:
   - Should conditionals go in `when` or be written naturally in `step`?
   - Is `do` for commands or descriptions?
   - Does `detail` expand on `step` or provide separate information?

2. **Natural Language Sufficiency**: LLMs excel at parsing natural language structures like:
   - *"Run migrations if database is empty"* (conditional)
   - *"Execute `npm test` and verify all pass"* (action + validation)
   - *"Deploy to staging, then run smoke tests"* (sequence)

3. **Validation Duplication**: The spec already includes a dedicated `criteria` array for verification:
   ```typescript
   instruction: {
     process?: ProcessStep[];
     criteria?: Criterion[];  // Already exists for validation!
   }
   ```
   Having validation in both `process[].validate` and `criteria[]` creates confusion about where validation belongs.

4. **Underutilization**: The structured fields are rarely needed. Most processes are straightforward sequences that don't require machine-parseable conditionals or validation.

## Decision

Simplify the `ProcessStep` type to:

```typescript
type ProcessStep = string | {
  step: string;
  notes?: string[];  // Optional sub-bullets for clarification
};
```

**Rendering Format:**
```markdown
## Process

1. Install dependencies

2. Run database migrations
   - Use `npm run migrate` for development
   - Production migrations require admin approval
   - Verify migration status with `npm run migrate:status`

3. Start the server
```

**Key Principles:**
- **Default to strings**: Most steps need no additional structure
- **Use notes for elaboration**: When a step needs clarification, provide sub-bullets
- **Write conditionals naturally**: "When X, do Y" is clearer than structured fields
- **Keep validation separate**: Use the `criteria` array for verification steps

## Decision Rationale

### 1. Natural Language is Sufficient

LLMs are excellent at extracting structure from well-written natural language. Explicit fields like `when`, `do`, and `validate` add implementation complexity without proportional benefit.

**Example - Natural Language (Better):**
```typescript
process: [
  "Run tests. If tests fail, fix issues before proceeding.",
  "Deploy to staging environment",
  "Run smoke tests and verify all endpoints return 200 OK"
]
```

**Example - Structured Fields (Unnecessary Complexity):**
```typescript
process: [
  {
    step: "Run tests",
    validate: { check: "All tests pass", severity: "error" },
    when: "Ready to deploy"
  },
  {
    step: "Deploy to staging",
    do: "Execute deployment script"
  },
  {
    step: "Run smoke tests",
    validate: { check: "Endpoints return 200", severity: "error" }
  }
]
```

### 2. Reduced Cognitive Load

Authors no longer need to decide:
- Which field should this text go in?
- Is this conditional enough to warrant `when`?
- Should validation be in `validate` or `criteria`?

Instead: Just write clear, concise steps.

### 3. Clear Separation of Concerns

- **Process steps** describe *what* to do
- **Criteria** define *how* to verify success

This is cleaner than having validation in both places.

### 4. Flexibility Through Notes

When steps need elaboration, the `notes` array provides structure without over-engineering:

```typescript
{
  step: "Configure production environment",
  notes: [
    "Copy .env.example to .env.production",
    "Set DATABASE_URL to production connection string",
    "Generate new SECRET_KEY (do not reuse development key)",
    "Verify SSL certificates are valid"
  ]
}
```

## Consequences

### Positive

- ✅ **Lower authoring friction**: Clear, simple model reduces decision paralysis
- ✅ **More consistent modules**: Fewer options = more consistent patterns
- ✅ **Natural expression**: Authors write steps as they naturally think about them
- ✅ **Cleaner separation**: Process vs. validation responsibilities are distinct
- ✅ **Easier to parse**: Simpler structure is easier for both humans and machines
- ✅ **Backwards compatible**: Existing simple steps (strings) continue to work

### Negative

- ⚠️ **Loss of explicit structure**: No dedicated fields for conditionals/validation
- ⚠️ **Parsing ambiguity**: Machines must parse natural language for structure
- ⚠️ **Migration required**: Existing modules using `when`/`do`/validate` need updates

### Migration Path

For existing modules using structured fields, auto-convert to natural language:

```typescript
// Before (v2.0)
{
  step: "Start the service",
  when: "Service is not running",
  do: "Execute systemctl start myapp",
  validate: { check: "Service status shows active", severity: "error" }
}

// After (v2.1 - simplified)
{
  step: "Start the service if not running",
  notes: [
    "Execute: `systemctl start myapp`",
    "Verify: Service status shows 'active'"
  ]
}
```

## Alternatives Considered

### Alternative 1: Keep Current Complex Structure

**Rejected because:**
- Creates unnecessary cognitive overhead for authors
- Most modules don't need structured conditionals
- Validation belongs in `criteria`, not embedded in process steps
- Optimizes for the 1% edge case at expense of the 99% common case

### Alternative 2: Remove All Structure (Just Strings)

**Rejected because:**
- Sometimes steps do need elaboration
- Notes array provides minimal structure for common elaboration needs
- Keeps flexibility without abandoning all structure

### Alternative 3: Add Optional Structured Extension (Hybrid)

Add `processAnnotations` for rare cases needing machine-executable steps:

```typescript
instruction: {
  process: string[];
  processAnnotations?: {
    [stepIndex: number]: {
      when?: string;
      do?: string;
      validate?: { ... };
    };
  };
}
```

**Rejected because:**
- Adds complexity for unproven use cases
- No evidence of actual need for machine-executable steps
- Can be added later if need emerges (YAGNI principle)
- Violates the "keep it simple" directive

## Notes

- This decision aligns with ADR 0004 (Machine-First Architecture) by eliminating unnecessary prose structure while maintaining clarity
- Module authors are encouraged to write clear, self-explanatory steps rather than relying on structure to convey meaning
- If future use cases emerge requiring machine-executable validation, we can revisit with concrete requirements

## References

- UMS v2.0 Specification: Section 3.1 (ProcessStep)
- Related: ADR 0004 (Machine-First Module Architecture)
- Discussion: Unimplemented Spec Properties Report (Section 5)
