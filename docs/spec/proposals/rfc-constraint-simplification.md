# RFC: Simplify Constraint Structure (UMS v2.1)

**Status:** PROPOSAL - Seeking Feedback
**Author:** Jason Knight
**Date:** 2025-01-15
**Related:** Follows ProcessStep simplification (completed)

---

## Summary

Propose simplifying the `Constraint` interface from 5 fields to 2 fields, following the same pattern used for ProcessStep simplification.

**Current (v2.1):**
```typescript
interface Constraint {
  rule: string;
  severity?: 'error' | 'warning' | 'info';
  when?: string;
  examples?: { valid?: string[]; invalid?: string[] };
  rationale?: string;
}
```

**Proposed:**
```typescript
type Constraint = string | {
  rule: string;
  notes?: string[];
};
```

---

## Problem Statement

### 1. Fields Not Rendered

Current implementation only renders `rule`:
```typescript
// Current renderer (markdown-renderer.ts:168-174)
const constraints = instruction.constraints.map(constraint => {
  if (typeof constraint === 'string') {
    return `- ${constraint}`;
  }
  return `- ${constraint.rule}`;  // Only this! All other fields ignored
});
```

**Result:** `severity`, `when`, `examples`, and `rationale` are defined but never appear in output.

### 2. Natural Language Already Works

Authors already write constraints naturally without using structured fields:

```typescript
// What people actually write today:
constraints: [
  'URLs MUST use plural nouns (e.g., /users not /user)',
  'All endpoints MUST return proper HTTP status codes',
  'When handling sensitive data, always use HTTPS'
]
```

This is clear, concise, and works perfectly.

### 3. Authoring Ambiguity

When authors try to use structured fields, they face questions:
- Should I express severity with "MUST" or the `severity` field?
- Do examples go in `examples` or in the rule text?
- Use `when` field or just say "when" in the rule?

---

## Proposal Details

### Simplified Structure

```typescript
type Constraint = string | {
  rule: string;
  notes?: string[];  // For examples, rationale, clarifications
};
```

### Example Usage

**Simple constraints (90% of cases):**
```typescript
constraints: [
  'URLs MUST use plural nouns for collections',
  'All endpoints MUST return proper HTTP status codes',
  'Never expose sensitive data in URLs'
]
```

**Constraints with elaboration (10% of cases):**
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
  },
  'When handling authentication, always use HTTPS'
]
```

### Rendered Output

**Before (current - no elaboration shown):**
```markdown
## Constraints

- URLs MUST use plural nouns for collections
- All API responses MUST include proper HTTP status codes
```

**After (with notes):**
```markdown
## Constraints

- **URLs MUST use plural nouns for collections**
  - Good: /users, /users/123, /orders
  - Bad: /user, /getUser, /createOrder
  - Rationale: REST conventions require resource-based URLs

- **All API responses MUST include proper HTTP status codes**
  - 2xx for success (200 OK, 201 Created, 204 No Content)
  - 4xx for client errors (400 Bad Request, 404 Not Found)
  - 5xx for server errors (500 Internal Server Error)
  - See RFC 7231 for complete status code definitions

- When handling authentication, always use HTTPS
```

---

## Authoring Guidelines

### RFC 2119 Keywords for Severity

Use standard [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt) keywords to indicate requirement levels:

| Keyword | Meaning | Severity | Example |
|---------|---------|----------|---------|
| **MUST** / **REQUIRED** / **SHALL** | Absolute requirement | Error | `URLs MUST use HTTPS` |
| **MUST NOT** / **SHALL NOT** | Absolute prohibition | Error | `MUST NOT expose secrets in logs` |
| **SHOULD** / **RECOMMENDED** | Recommended but not required | Warning | `APIs SHOULD include rate limiting` |
| **SHOULD NOT** / **NOT RECOMMENDED** | Recommended against | Warning | `SHOULD NOT use query params for auth` |
| **MAY** / **OPTIONAL** | Truly optional | Info | `MAY include HATEOAS links` |

**Guidelines:**

1. **Use keywords consistently** - Always capitalize RFC 2119 keywords (MUST, SHOULD, MAY)
2. **One keyword per constraint** - Each constraint should have clear severity
3. **Be specific** - "URLs MUST use HTTPS" not "Use secure protocols"
4. **Avoid mixing** - Don't use multiple keywords in one constraint

**Examples:**

```typescript
// Good - Clear severity with RFC 2119 keywords
constraints: [
  'API endpoints MUST return proper HTTP status codes',
  'Error responses SHOULD include a message field',
  'Success responses MAY include metadata'
]

// Bad - Ambiguous or missing keywords
constraints: [
  'Return proper status codes',           // No severity indicator
  'Always use HTTPS everywhere',          // "Always" is not RFC 2119
  'You must not expose secrets'           // lowercase "must"
]
```

### Notes Formatting Conventions

When using `notes` for examples, rationale, or clarifications, follow these conventions:

> **Important:** These guidelines apply to module content and rendered output. The RFC document itself may use emojis for visual clarity.

#### 1. Examples (Good/Bad)

Use `Good:` and `Bad:` prefixes (no emojis):

```typescript
notes: [
  'Good: /users, /api/v1/orders, /products/123',
  'Bad: /getUsers, /user, /createOrder'
]
```

**Why Good/Bad?**
- More natural and instructional
- Better accessibility (no emoji dependency)
- Clearer in all contexts (screen readers, plain text, diffs)

#### 2. Rationale

Use `Rationale:` prefix for explanations:

```typescript
notes: [
  'Rationale: REST conventions require resource-based URLs',
  'Rationale: Prevents breaking changes for existing clients'
]
```

#### 3. References

Include external references for standards/specifications:

```typescript
notes: [
  'See RFC 7231 for HTTP status code definitions',
  'Refer to OWASP API Security Top 10',
  'Based on REST API Design Guidelines v2.0'
]
```

#### 4. Multi-line Examples

For complex examples, use template literals (backticks) to keep content in a single entry:

```typescript
notes: [
  `Good format:
POST /api/v1/users
Content-Type: application/json
{ "name": "John", "email": "john@example.com" }`,
  `Bad format:
POST /api/createUser?name=John&email=john@example.com`
]
```

**Rationale:** Template literals allow multiline content without splitting into multiple array entries, improving readability.

#### 5. Conditional Clauses

When constraints apply conditionally, state the condition clearly:

```typescript
// Option 1: In rule text
'When designing public APIs, endpoints MUST include versioning'

// Option 2: In notes
{
  rule: 'Endpoints MUST include versioning',
  notes: [
    'Applies to: Public APIs only',
    'Does not apply to: Internal services, admin endpoints'
  ]
}
```

#### Complete Example

```typescript
constraints: [
  'URLs MUST use plural nouns for collections',
  {
    rule: 'All API responses MUST include proper HTTP status codes',
    notes: [
      '2xx for success: 200 OK, 201 Created, 204 No Content',
      '4xx for client errors: 400 Bad Request, 404 Not Found',
      '5xx for server errors: 500 Internal Server Error',
      'Rationale: Standard HTTP semantics improve interoperability',
      'See RFC 7231 section 6 for complete definitions'
    ]
  },
  {
    rule: 'Authentication tokens MUST expire within 1 hour',
    notes: [
      'Use refresh tokens for extended sessions',
      'Good: JWT with exp claim < 3600 seconds',
      'Bad: No expiration, expiration > 1 hour',
      'Rationale: Limits exposure window if token is compromised'
    ]
  }
]
```

---

## Rationale

### 1. Consistency with ProcessStep

We just simplified ProcessStep using this exact pattern:
- **Old:** `step`, `detail`, `when`, `do`, `validate` (5 fields)
- **New:** `step`, `notes` (2 fields)

Constraint follows the same logic:
- **Old:** `rule`, `severity`, `when`, `examples`, `rationale` (5 fields)
- **New:** `rule`, `notes` (2 fields)

**Question for reviewers:** Should we keep the same pattern for consistency?

### 2. RFC 2119 Keywords Handle Severity

Standard keywords already convey severity:
- **MUST** / **REQUIRED** / **SHALL** = error severity
- **SHOULD** / **RECOMMENDED** = warning severity
- **MAY** / **OPTIONAL** = info severity

**Example:**
```typescript
'URLs MUST use HTTPS'        // Error severity (critical)
'Endpoints SHOULD use caching' // Warning severity (recommended)
'MAY include HATEOAS links'   // Info severity (optional)
```

**Question for reviewers:** Is RFC 2119 clearer than `severity: 'error'`?

### 3. Notes Provide Flexibility

Instead of rigid `examples: { valid: [], invalid: [] }`, use flexible notes:

```typescript
notes: [
  'Good: /users, /api/v1/orders',
  'Bad: /getUsers, /user',
  'See REST API guidelines for details'
]
```

Authors can format examples using text labels for clarity and accessibility.

**Question for reviewers:** Is flexible formatting better than structured examples?

### 4. Reduced Cognitive Load

**Before:** Authors must decide:
1. What goes in `rule` vs `rationale`?
2. Use `severity` field or "MUST" in text?
3. Structure examples or write them inline?
4. Use `when` field or conditional language?

**After:** Authors just write clear rules with optional notes.

**Question for reviewers:** Does this reduce decision paralysis?

---

## Trade-offs Analysis

| Aspect | Current (5 fields) | Proposed (2 fields) | Winner |
|--------|-------------------|---------------------|---------|
| **Authoring ease** | Complex, many decisions | Simple, clear | ✅ Proposed |
| **Machine parsing** | Structured (but unused) | Natural language | ⚠️ Current |
| **Rendered output** | Only `rule` shown | `rule` + `notes` shown | ✅ Proposed |
| **Flexibility** | Rigid structure | Author chooses format | ✅ Proposed |
| **Standards compliance** | Custom severity enum | RFC 2119 keywords | ✅ Proposed |
| **Consistency** | Differs from ProcessStep | Matches ProcessStep | ✅ Proposed |
| **Migration cost** | None (no change) | Low (auto-convert) | ⚠️ Current |

**Question for reviewers:** Do the benefits outweigh the migration cost?

---

## Migration Strategy

### Automated Conversion

```typescript
// Old format
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

### Migration Script

```bash
# Tool to auto-migrate constraints
ums-migrate constraints --from=v2.1-old --to=v2.1-simplified ./modules/
```

**Question for reviewers:** Is auto-migration sufficient, or do we need manual review?

---

## Alternatives Considered

### Alternative 1: Keep Current Structure

**Pros:**
- No breaking change
- Machine-parseable fields preserved

**Cons:**
- Fields not rendered (wasted effort)
- Authoring complexity remains
- Inconsistent with ProcessStep

### Alternative 2: Render All Fields As-Is

Implement rendering for all existing fields without changing structure.

**Pros:**
- No breaking change
- Authors who use fields get value

**Cons:**
- Doesn't address authoring friction
- Maintains complexity
- Encourages inconsistent patterns

### Alternative 3: Keep examples field only

```typescript
type Constraint = string | {
  rule: string;
  examples?: { valid?: string[]; invalid?: string[] };
};
```

**Pros:**
- Structured examples for machine parsing
- Simpler than full structure

**Cons:**
- Still complex
- Examples work fine in notes
- Inconsistent with ProcessStep

**Question for reviewers:** Should we consider any of these alternatives?

---

## Open Questions

We need your feedback on:

1. **Pattern Consistency:** Should Constraint follow the same pattern as ProcessStep?
   - [ ] Yes, consistency is important
   - [ ] No, constraints need more structure
   - [ ] Unsure / needs discussion

2. **RFC 2119 Keywords:** Are MUST/SHOULD/MAY clearer than `severity: 'error'`?
   - [ ] Yes, RFC 2119 is standard
   - [ ] No, prefer explicit severity field
   - [ ] Both approaches have merit

3. **Example Format:** Is flexible notes better than structured `examples: { valid, invalid }`?
   - [ ] Yes, flexibility is better
   - [ ] No, structure helps consistency
   - [ ] Provide both options

4. **Migration Timing:** When should this change happen?
   - [ ] Now (part of v2.1)
   - [ ] Later (v2.2 or v3.0)
   - [ ] Never (keep current structure)

5. **Use Cases:** Are there scenarios where structured fields are critical?
   - [ ] No, natural language covers everything
   - [ ] Yes: _________________ (please describe)

6. **Rendering Preferences:** How should constraints with notes be rendered?
   - [ ] Proposed format (bold rule + bulleted notes)
   - [ ] Alternative format: _________________ (please describe)

---

## Request for Feedback

Please provide input on:

### Required Feedback
- [ ] Overall approach (simplify vs keep current)
- [ ] Specific field concerns (which fields are essential?)
- [ ] Migration concerns (breaking change acceptable?)

### Optional Feedback
- [ ] Alternative designs
- [ ] Example modules that would be affected
- [ ] Rendering format preferences
- [ ] Tooling requirements

### How to Provide Feedback

**Option 1: GitHub Issue**
Create issue with title: `[RFC] Constraint Simplification Feedback`

**Option 2: Pull Request Comment**
Comment on the PR implementing this change

**Option 3: Direct Discussion**
Reply to this RFC document with inline comments

---

## Timeline

| Phase | Timeline | Status |
|-------|----------|--------|
| RFC Published | 2025-01-15 | ✅ Complete |
| Feedback Period | 2 weeks | ⏳ In Progress |
| Decision | 2025-01-29 | ⏸️ Pending |
| Implementation | 2025-02-01 | ⏸️ Pending |
| Migration Tools | 2025-02-05 | ⏸️ Pending |
| Documentation | 2025-02-08 | ⏸️ Pending |

**Feedback deadline: January 29, 2025**

---

## Example Modules

### Simple Module (90% case)

```typescript
export const apiConstraints: Module = {
  id: 'api-constraints',
  version: '1.0.0',
  schemaVersion: '2.1',
  capabilities: ['api-design'],
  cognitiveLevel: CognitiveLevel.DOMAIN_SPECIFIC_GUIDANCE,
  metadata: {
    name: 'API Design Constraints',
    description: 'Essential constraints for RESTful API design',
    semantic: 'REST API constraints, HTTP methods, status codes, URL design'
  },
  instruction: {
    type: ComponentType.Instruction,
    instruction: {
      purpose: 'Design consistent, predictable APIs',
      constraints: [
        'URLs MUST use plural nouns for collections',
        'All endpoints MUST return proper HTTP status codes',
        'API versions MUST be included in the URL path',
        'Never expose internal IDs or implementation details'
      ]
    }
  }
};
```

### Complex Module (10% case - needs elaboration)

```typescript
export const securityConstraints: Module = {
  id: 'security-constraints',
  version: '1.0.0',
  schemaVersion: '2.1',
  capabilities: ['security', 'api-design'],
  cognitiveLevel: CognitiveLevel.SPECIFICATIONS_AND_STANDARDS,
  metadata: {
    name: 'API Security Constraints',
    description: 'Security requirements for public APIs',
    semantic: 'API security, HTTPS, authentication, authorization, OWASP'
  },
  instruction: {
    type: ComponentType.Instruction,
    instruction: {
      purpose: 'Enforce security best practices',
      constraints: [
        {
          rule: 'All production endpoints MUST use HTTPS',
          notes: [
            'TLS 1.2 minimum (TLS 1.3 recommended)',
            'Valid SSL certificates required',
            'Good: https://api.example.com/v1/users',
            'Bad: http://api.example.com/v1/users',
            'See OWASP Transport Layer Protection'
          ]
        },
        {
          rule: 'Authentication tokens MUST expire within 1 hour',
          notes: [
            'Use refresh tokens for extended sessions',
            'Implement sliding window expiration',
            'Store refresh tokens securely (httpOnly cookies)',
            'Rationale: Limits exposure window if token compromised'
          ]
        },
        'Never log authentication tokens or sensitive data',
        'Rate limiting MUST be implemented on all public endpoints'
      ]
    }
  }
};
```

---

## Success Criteria

This proposal is successful if:

1. ✅ Reduces authoring friction (fewer decisions)
2. ✅ Maintains expressiveness (can convey all information)
3. ✅ Improves rendered output (notes are visible)
4. ✅ Consistent with ProcessStep pattern
5. ✅ Migration is straightforward
6. ✅ Community consensus achieved

---

## Next Steps

**If Accepted:**
1. Create ADR documenting decision
2. Update UMS v2.1 spec (Constraint section)
3. Update TypeScript types
4. Implement renderer changes
5. Create migration tooling
6. Update documentation
7. Update example modules

**If Rejected:**
1. Document why in this RFC
2. Consider alternative approaches
3. Implement rendering for current fields (Alternative 2)

---

## References

- ADR 0005: ProcessStep Simplification (same pattern)
- ADR 0004: Machine-First Module Architecture
- RFC 2119: Key words for use in RFCs to Indicate Requirement Levels
- UMS v2.1 Specification: Section 3.2
- Implementation: `packages/ums-lib/src/core/rendering/markdown-renderer.ts:165-175`

---

**Status:** AWAITING FEEDBACK
**Last Updated:** 2025-01-15
**Feedback By:** 2025-01-29
