# ADR 0006: Simplify Constraint Structure

**Status:** Accepted
**Date:** 2025-01-15
**Deciders:** Jason Knight
**Related:** ADR 0005 (ProcessStep Simplification), RFC: Constraint Simplification

---

## Context

The `Constraint` interface in UMS v2.1 currently has 5 fields:

```typescript
interface Constraint {
  rule: string;
  severity?: 'error' | 'warning' | 'info';
  when?: string;
  examples?: { valid?: string[]; invalid?: string[] };
  rationale?: string;
}
```

However, **only the `rule` field is rendered** in markdown output. The other four fields (`severity`, `when`, `examples`, `rationale`) are defined but never appear in the compiled output.

### Problems Identified

1. **Fields Not Rendered**: `severity`, `when`, `examples`, and `rationale` are ignored by the renderer
2. **Natural Language Works**: Authors already write clear constraints without using structured fields
3. **Authoring Ambiguity**: Multiple ways to express the same information creates decision paralysis
4. **Inconsistency**: Differs from the simplified ProcessStep pattern (ADR 0005)

### Example of Current Issues

Authors face questions like:
- Should I use `severity: 'error'` or write "MUST" in the rule text?
- Do examples go in the `examples` field or inline in the rule?
- Should I use the `when` field or conditional language in the rule?

This leads to inconsistent authoring patterns and unused fields.

---

## Decision

**Simplify `Constraint` from 5 fields to 2 fields**, following the same pattern as ProcessStep:

```typescript
type Constraint = string | {
  rule: string;
  notes?: string[];
};
```

### Key Changes

1. **Remove fields**: `severity`, `when`, `examples`, `rationale`
2. **Add field**: `notes?: string[]` for elaboration, examples, and rationale
3. **Support both forms**: Simple strings (90% case) and objects with notes (10% case)
4. **Use RFC 2119 keywords**: MUST/SHOULD/MAY for severity in rule text
5. **Flexible notes**: Good/Bad examples, rationale, references, all in notes array

---

## Usage Patterns

### Simple Constraints (90% of cases)

```typescript
constraints: [
  'URLs MUST use plural nouns for collections',
  'All endpoints MUST return proper HTTP status codes',
  'Never expose sensitive data in URLs'
]
```

### Constraints with Elaboration (10% of cases)

```typescript
constraints: [
  {
    rule: 'URLs MUST use plural nouns for collections',
    notes: [
      'Good: /users, /users/123, /orders',
      'Bad: /user, /getUser, /createOrder',
      'Rationale: REST conventions require resource-based URLs'
    ]
  },
  {
    rule: 'All API responses MUST include proper HTTP status codes',
    notes: [
      '2xx for success (200 OK, 201 Created, 204 No Content)',
      '4xx for client errors (400 Bad Request, 404 Not Found)',
      '5xx for server errors (500 Internal Server Error)',
      'See RFC 7231 for complete status code definitions'
    ]
  }
]
```

---

## Authoring Guidelines

### RFC 2119 Keywords for Severity

Use standard [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt) keywords to indicate requirement levels:

| Keyword | Severity | Example |
|---------|----------|---------|
| **MUST** / **REQUIRED** / **SHALL** | Error | `URLs MUST use HTTPS` |
| **MUST NOT** / **SHALL NOT** | Error | `MUST NOT expose secrets in logs` |
| **SHOULD** / **RECOMMENDED** | Warning | `APIs SHOULD include rate limiting` |
| **SHOULD NOT** / **NOT RECOMMENDED** | Warning | `SHOULD NOT use query params for auth` |
| **MAY** / **OPTIONAL** | Info | `MAY include HATEOAS links` |

### Notes Formatting Conventions

**Examples** - Use `Good:` and `Bad:` prefixes (no emojis):
```typescript
notes: [
  'Good: /users, /api/v1/orders',
  'Bad: /getUsers, /user'
]
```

**Rationale** - Use `Rationale:` prefix:
```typescript
notes: ['Rationale: REST conventions require resource-based URLs']
```

**Multi-line examples** - Use template literals:
```typescript
notes: [
  `Good format:
POST /api/v1/users
Content-Type: application/json
{ "name": "John" }`
]
```

---

## Decision Rationale

### 1. Natural Language is Sufficient

LLMs excel at extracting structure from well-written natural language. Explicit fields like `severity`, `when`, and `examples` add complexity without proportional benefit.

**Example - Natural Language (Better):**
```typescript
constraints: [
  'URLs MUST use plural nouns (e.g., /users not /user)',
  'When handling sensitive data, always use HTTPS'
]
```

**Example - Structured Fields (Unnecessary Complexity):**
```typescript
constraints: [
  {
    rule: 'Use plural nouns',
    severity: 'error',
    examples: { valid: ['/users'], invalid: ['/user'] },
    when: 'Designing URLs'
  }
]
```

### 2. RFC 2119 Keywords Handle Severity

Standard keywords convey severity without a dedicated field:
- **MUST** = error severity (critical requirement)
- **SHOULD** = warning severity (recommended)
- **MAY** = info severity (optional)

This is clearer and more widely understood than custom enums.

### 3. Notes Provide Flexibility

Instead of rigid structured fields, `notes` allows authors to:
- Format examples however they want (Good/Bad, inline, code blocks)
- Include rationale, references, or clarifications
- Use template literals for multi-line content
- Mix different types of elaboration

### 4. Consistency with ProcessStep Pattern

Following ADR 0005, we established a pattern:
- **Old ProcessStep**: 5 fields (`step`, `detail`, `when`, `do`, `validate`)
- **New ProcessStep**: 2 fields (`step`, `notes`)

Constraint now follows the same pattern:
- **Old Constraint**: 5 fields (`rule`, `severity`, `when`, `examples`, `rationale`)
- **New Constraint**: 2 fields (`rule`, `notes`)

### 5. Reduced Cognitive Load

**Before:** Authors must decide:
1. What goes in `rule` vs `rationale`?
2. Use `severity` field or "MUST" in text?
3. Structure examples or write them inline?
4. Use `when` field or conditional language?

**After:** Authors write clear rules with optional notes for elaboration.

---

## Consequences

### Positive

✅ **Simpler authoring** - Fewer decisions, clearer patterns
✅ **Consistent pattern** - Matches ProcessStep simplification
✅ **Full rendering** - Notes are actually displayed in output
✅ **Flexible formatting** - Authors choose how to present information
✅ **Standards-based** - RFC 2119 keywords are widely understood
✅ **Better accessibility** - Text-only Good/Bad (no emoji dependency)

### Negative

⚠️ **Breaking change** - Existing modules with structured fields need migration
⚠️ **Less machine-parseable** - Natural language vs structured data
⚠️ **Migration effort** - Need to convert existing constraints (low effort with automation)

### Migration Path

Auto-convert existing structured constraints:

```typescript
// Old
{
  rule: 'Use HTTPS',
  severity: 'error',
  when: 'In production',
  rationale: 'Security requirement',
  examples: {
    valid: ['https://api.example.com'],
    invalid: ['http://api.example.com']
  }
}

// Auto-converted
{
  rule: 'MUST use HTTPS in production environments',
  notes: [
    'Security requirement for all production traffic',
    'Good: https://api.example.com',
    'Bad: http://api.example.com'
  ]
}
```

---

## Alternatives Considered

### Alternative 1: Keep Current Structure

**Rejected because:**
- Fields not rendered (wasted authoring effort)
- Authoring complexity remains
- Inconsistent with ProcessStep pattern

### Alternative 2: Render All Fields As-Is

**Rejected because:**
- Doesn't address authoring friction
- Maintains unnecessary complexity
- Encourages inconsistent patterns

### Alternative 3: Keep examples field only

```typescript
type Constraint = string | {
  rule: string;
  examples?: { valid?: string[]; invalid?: string[] };
};
```

**Rejected because:**
- Still more complex than needed
- Examples work fine in notes
- Inconsistent with ProcessStep pattern

---

## Implementation Notes

### Renderer Changes

Update `renderInstructionComponent()` to handle constraint notes:

```typescript
// Old (only renders rule)
const constraints = instruction.constraints.map(constraint => {
  if (typeof constraint === 'string') {
    return `- ${constraint}`;
  }
  return `- ${constraint.rule}`;
});

// New (renders rule + notes)
const constraints = instruction.constraints.map(constraint => {
  if (typeof constraint === 'string') {
    return `- ${constraint}`;
  }
  let text = `- **${constraint.rule}**`;
  if (constraint.notes && constraint.notes.length > 0) {
    const notesList = constraint.notes.map(note => `  - ${note}`).join('\n');
    text += `\n${notesList}`;
  }
  return text;
});
```

### Type Changes

Update `packages/ums-lib/src/types/index.ts`:

```typescript
/**
 * A constraint in an instruction.
 * Can be a simple string or an object with optional notes for elaboration.
 */
export type Constraint = string | {
  /** The constraint rule. Use RFC 2119 keywords (MUST, SHOULD, MAY) for severity. */
  rule: string;
  /** Optional notes for examples, rationale, or clarification. */
  notes?: string[];
};
```

---

## Related

- **ADR 0005**: ProcessStep Simplification (same pattern)
- **ADR 0004**: Machine-First Module Architecture
- **RFC 2119**: Key words for use in RFCs to Indicate Requirement Levels
- **UMS v2.1 Spec**: Section 3.2 (Constraint component)
- **RFC Proposal**: `docs/spec/proposals/rfc-constraint-simplification.md`

---

**Status:** Accepted
**Date:** 2025-01-15
**Version:** 1.0
