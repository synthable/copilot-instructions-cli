# RFC: Simplify Criterion Structure (UMS v2.1)

**Status:** PROPOSAL - Seeking Feedback
**Author:** Jason Knight
**Date:** 2025-01-15
**Related:** Follows ProcessStep (ADR 0005) and Constraint (ADR 0006) simplification

---

## Summary

Propose simplifying the `Criterion` interface from 3 fields to 2 fields, following the same pattern used for ProcessStep and Constraint simplification.

**Current (v2.1):**
```typescript
interface Criterion {
  item: string;
  category?: string;
  severity?: 'critical' | 'important' | 'nice-to-have';
}
```

**Proposed:**
```typescript
type Criterion = string | {
  item: string;
  category?: string;  // Optional grouping (renders as subheadings)
  notes?: string[];   // Optional elaboration
};
```

---

## Problem Statement

### 1. Severity Field Not Rendered

Current implementation only renders `item`:
```typescript
// Current renderer (markdown-renderer.ts:191-200)
const criteria = instruction.criteria.map(criterion => {
  if (typeof criterion === 'string') {
    return `- [ ] ${criterion}`;
  }
  return `- [ ] ${criterion.item}`;  // Only this! category and severity ignored
});
```

**Result:** The `severity` field is defined but never appears in output. The `category` field also isn't rendered, but unlike severity, **category would be useful if properly rendered** for organizing large criterion sets.

### 2. Natural Language Already Works

Authors already write criteria naturally without using structured fields:

```typescript
// What people actually write today:
criteria: [
  'All endpoints return proper HTTP status codes',
  'API documentation is complete and accurate',
  'Rate limiting is implemented and tested'
]
```

This is clear, concise, and works perfectly.

### 3. Severity Ambiguity

When authors try to use the `severity` field, they face questions:
- Should I express severity with "Critical:" or the `severity` field?
- Use RFC 2119 keywords (MUST) or severity enum ('critical')?
- How do severity levels map to actual verification priority?

The `category` field, however, serves a clear purpose: organizing criteria into logical groups.

---

## Proposal Details

### Simplified Structure

```typescript
type Criterion = string | {
  item: string;
  category?: string;  // For grouping (renders as subheadings)
  notes?: string[];   // For elaboration, test instructions, references
};
```

### Example Usage

**Simple criteria (90% of cases):**
```typescript
criteria: [
  'All endpoints return proper HTTP status codes',
  'API responses match documented schemas',
  'Error handling covers edge cases'
]
```

**Criteria with categories and elaboration:**
```typescript
criteria: [
  // Uncategorized (general criteria)
  'All tests pass before deployment',
  'Documentation is complete and up-to-date',

  // Security category
  {
    item: 'All endpoints use HTTPS',
    category: 'Security'
  },
  {
    item: 'Rate limiting prevents abuse',
    category: 'Security',
    notes: [
      'Test: Send 100 requests in 1 minute',
      'Expected: Receive 429 Too Many Requests after limit',
      'Verify: Rate limit headers present (X-RateLimit-*)'
    ]
  },

  // Performance category
  {
    item: 'Response times under 100ms',
    category: 'Performance'
  },
  {
    item: 'Database queries optimized',
    category: 'Performance',
    notes: [
      'Test: Run EXPLAIN on all queries',
      'Verify: All queries use indexes',
      'Verify: No N+1 query patterns'
    ]
  }
]
```

### Rendered Output

**Before (current - no categories, no notes):**
```markdown
## Criteria

- [ ] All tests pass before deployment
- [ ] All endpoints use HTTPS
- [ ] Rate limiting prevents abuse
- [ ] Response times under 100ms
```

**After (with categories and notes):**
```markdown
## Criteria

- [ ] All tests pass before deployment
- [ ] Documentation is complete and up-to-date

### Security

- [ ] All endpoints use HTTPS

- [ ] **Rate limiting prevents abuse**
  - Test: Send 100 requests in 1 minute
  - Expected: Receive 429 Too Many Requests after limit
  - Verify: Rate limit headers present (X-RateLimit-*)

### Performance

- [ ] Response times under 100ms

- [ ] **Database queries optimized**
  - Test: Run EXPLAIN on all queries
  - Verify: All queries use indexes
  - Verify: No N+1 query patterns
```

---

## Authoring Guidelines

### Expressing Priority/Severity

Use natural language prefixes or RFC 2119 keywords to indicate priority:

```typescript
criteria: [
  // Option 1: RFC 2119 keywords
  'MUST verify all endpoints return proper status codes',
  'SHOULD check for comprehensive error handling',
  'MAY include performance benchmarks',

  // Option 2: Natural language prefixes
  'Critical: All endpoints return proper status codes',
  'Important: Error handling covers edge cases',
  'Nice-to-have: Response times under 100ms',

  // Option 3: Implicit from context (most common)
  'All endpoints return proper status codes',
  'Error handling covers edge cases',
  'Response times under 100ms'
]
```

### Notes Formatting Conventions

When using `notes` for test instructions, expected results, or references:

#### 1. Test Instructions

Use `Test:` prefix for what to do:

```typescript
notes: [
  'Test: Send 100 requests in 1 minute',
  'Test: Verify rate limit headers present',
  'Test: Check error response format'
]
```

#### 2. Expected Results

Use `Expected:` prefix for what should happen:

```typescript
notes: [
  'Expected: Receive 429 Too Many Requests',
  'Expected: Headers include X-RateLimit-Remaining',
  'Expected: Error message explains limit exceeded'
]
```

#### 3. Verification Steps

Use `Verify:` prefix for how to check:

```typescript
notes: [
  'Verify: Check response status code',
  'Verify: Inspect rate limit headers',
  'Verify: Test with multiple API keys'
]
```

#### 4. References

Include external references for standards/specifications:

```typescript
notes: [
  'See RFC 7231 for HTTP status code definitions',
  'Refer to OWASP API Security Top 10',
  'Based on REST API Design Guidelines v2.0'
]
```

#### 5. Multi-line Test Scenarios

Use template literals for complex test scenarios:

```typescript
notes: [
  `Test scenario:
1. Send 100 requests within 1 minute
2. Verify 429 response after rate limit
3. Wait 1 minute for limit reset
4. Verify requests succeed again`,
  'Expected: Rate limit enforced consistently'
]
```

#### Complete Example

```typescript
criteria: [
  'All API endpoints return proper HTTP status codes',
  {
    item: 'Rate limiting prevents abuse',
    notes: [
      'Test: Send 100 requests in 1 minute using same API key',
      'Expected: Receive 429 Too Many Requests after limit reached',
      'Verify: Rate limit headers present (X-RateLimit-Limit, X-RateLimit-Remaining)',
      'Verify: Error response includes retry-after information',
      'See RFC 6585 section 4 for 429 status code specification'
    ]
  },
  {
    item: 'Authentication tokens expire appropriately',
    notes: [
      'Test: Generate token and wait for expiration',
      'Expected: Token rejected after expiration time',
      'Verify: Expiration time matches configuration',
      'Verify: Refresh token flow works correctly'
    ]
  }
]
```

---

## Rationale

**Summary of Changes:**
- ❌ **Remove:** `severity` field (use RFC 2119 keywords in natural language)
- ✅ **Keep:** `category` field (implement rendering as subheadings)
- ✅ **Add:** `notes` field (flexible elaboration)

### 1. Consistency with ProcessStep and Constraint

We simplified both using a similar pattern:
- **ProcessStep:** `step` + `notes` (2 fields, was 5)
- **Constraint:** `rule` + `notes` (2 fields, was 5)
- **Criterion:** `item` + `category` + `notes` (3 fields, was 3, but now with proper rendering)

**Question for reviewers:** Should Criterion follow the same pattern for consistency?

### 2. Natural Language Handles Severity

Severity can be expressed naturally:
- **Critical:** "All endpoints MUST return proper status codes"
- **Important:** "Error handling SHOULD cover edge cases"
- **Nice-to-have:** "Response times MAY be benchmarked"

Or even simpler:
- "Verify all endpoints return proper status codes" (implicit critical)
- "Check for error handling" (implicit important)
- "Benchmark response times" (implicit nice-to-have)

**Question for reviewers:** Is natural language clearer than `severity: 'critical'`?

### 3. Category Field Is Useful

Unlike `severity`, the `category` field serves a clear organizational purpose. When rendered as subheadings, it makes large criterion sets much more scannable:

```markdown
## Criteria

### Security
- [ ] All endpoints use HTTPS
- [ ] Authentication required
- [ ] Rate limiting implemented

### Performance
- [ ] Response times under 100ms
- [ ] Database queries optimized
```

**Alternatives like comments don't render:**
```typescript
// Security (this comment won't appear in rendered output)
'All endpoints use HTTPS',
```

**Text prefixes are repetitive:**
```typescript
'Security: All endpoints use HTTPS',
'Security: Authentication required',  // "Security:" repeated each time
```

**Decision:** Keep `category` field and implement proper rendering with subheadings.

### 4. Notes Provide Flexibility for Testing

Instead of rigid structure, `notes` allows:
- Test instructions ("Test: Send 100 requests")
- Expected results ("Expected: Receive 429 status")
- Verification steps ("Verify: Check headers")
- References ("See RFC 6585")
- Multi-line scenarios using template literals

**Question for reviewers:** Does this cover all verification needs?

### 5. Reduced Cognitive Load

**Before:** Authors must decide:
1. What goes in `item` vs as a separate note?
2. Use `severity` field or express it in text?
3. Use `category` field or natural grouping?

**After:** Authors write clear verification criteria with optional test details.

**Question for reviewers:** Does this reduce decision paralysis?

---

## Trade-offs Analysis

| Aspect | Current (3 fields) | Proposed (3 fields) | Winner |
|--------|-------------------|---------------------|---------|
| **Authoring ease** | Severity ambiguity | Natural language | ✅ Proposed |
| **Machine parsing** | Structured severity | Natural language | ⚠️ Current |
| **Rendered output** | Only `item` shown | `item` + `category` + `notes` shown | ✅ Proposed |
| **Flexibility** | Rigid severity enum | Author chooses format | ✅ Proposed |
| **Grouping** | Category (not rendered) | Category (rendered as subheadings) | ✅ Proposed |
| **Consistency** | Differs from Pattern | Follows pattern (removes severity) | ✅ Proposed |
| **Migration cost** | None (no change) | Low (auto-convert severity) | ⚠️ Current |

**Question for reviewers:** Do the benefits outweigh the migration cost?

---

## Migration Strategy

### Automated Conversion

```typescript
// Old format
{
  item: 'All endpoints return proper status codes',
  category: 'API Quality',
  severity: 'critical'
}

// Auto-converted (keep category, convert severity to natural language)
{
  item: 'All endpoints MUST return proper status codes',
  category: 'API Quality'
}

// Or convert to simple string if no category
'All endpoints MUST return proper status codes'
```

### Migration Script

```bash
# Tool to auto-migrate criteria
ums-migrate criteria --from=v2.1-old --to=v2.1-simplified ./modules/
```

**Question for reviewers:** Is auto-migration sufficient, or do we need manual review?

---

## Alternatives Considered

### Alternative 1: Keep Current Structure

**Pros:**
- No breaking change
- Explicit severity and category fields

**Cons:**
- Fields not rendered (wasted effort)
- Authoring complexity remains
- Inconsistent with ProcessStep and Constraint

### Alternative 2: Render All Fields As-Is

Implement rendering for `category` and `severity` without changing structure.

**Pros:**
- No breaking change
- Authors who use fields get value

**Cons:**
- Doesn't address authoring friction
- Maintains complexity
- Encourages inconsistent patterns

### Alternative 3: Keep both severity and category

```typescript
type Criterion = string | {
  item: string;
  category?: string;
  severity?: 'critical' | 'important' | 'nice-to-have';
  notes?: string[];
};
```

**Pros:**
- Explicit severity for tooling
- Category for grouping
- Most complete structure

**Cons:**
- Severity works fine in natural language
- More complex authoring decisions
- Partially inconsistent with ProcessStep/Constraint pattern

**Decision:** Remove `severity` (use natural language), keep `category` (useful for grouping)

**Question for reviewers:** Should we consider any of these alternatives?

---

## Open Questions

We need your feedback on:

1. **Pattern Consistency:** Should Criterion follow the same pattern as ProcessStep and Constraint?
   - [ ] Yes, consistency is important
   - [ ] No, criteria need more structure
   - [ ] Unsure / needs discussion

2. **Severity Expression:** Is natural language clearer than `severity: 'critical'`?
   - [ ] Yes, natural language is clearer
   - [ ] No, prefer explicit severity field
   - [ ] Both approaches have merit

3. **Category Rendering:** Should `category` field render as subheadings?
   - [x] Yes, render as `### Category Name`
   - [ ] No, render differently: _________________
   - [ ] Don't render at all

4. **Migration Timing:** When should this change happen?
   - [ ] Now (part of v2.1)
   - [ ] Later (v2.2 or v3.0)
   - [ ] Never (keep current structure)

5. **Use Cases:** Are there scenarios where explicit `severity` field is critical?
   - [ ] No, natural language (MUST/SHOULD/MAY) covers everything
   - [ ] Yes: _________________ (please describe)

6. **Rendering Preferences:** How should criteria with notes be rendered?
   - [ ] Proposed format (bold item + bulleted notes)
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
Create issue with title: `[RFC] Criterion Simplification Feedback`

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
export const apiTesting: Module = {
  id: 'api-testing',
  version: '1.0.0',
  schemaVersion: '2.1',
  capabilities: ['testing', 'api-quality'],
  cognitiveLevel: CognitiveLevel.PROCEDURES_AND_PLAYBOOKS,
  metadata: {
    name: 'API Testing Criteria',
    description: 'Essential verification criteria for API testing',
    semantic: 'API testing, verification, quality assurance, REST endpoints'
  },
  instruction: {
    type: ComponentType.Instruction,
    instruction: {
      purpose: 'Verify API implementation quality',
      criteria: [
        'All endpoints return proper HTTP status codes',
        'Response schemas match API documentation',
        'Error handling covers common edge cases',
        'Rate limiting is implemented and effective'
      ]
    }
  }
};
```

### Complex Module (10% case - needs test details)

```typescript
export const apiSecurityTesting: Module = {
  id: 'api-security-testing',
  version: '1.0.0',
  schemaVersion: '2.1',
  capabilities: ['security', 'testing', 'api-quality'],
  cognitiveLevel: CognitiveLevel.SPECIFICATIONS_AND_STANDARDS,
  metadata: {
    name: 'API Security Testing Criteria',
    description: 'Security verification criteria for public APIs',
    semantic: 'API security, authentication, authorization, OWASP, penetration testing'
  },
  instruction: {
    type: ComponentType.Instruction,
    instruction: {
      purpose: 'Verify API security implementation',
      criteria: [
        {
          item: 'All endpoints require valid authentication',
          notes: [
            'Test: Access endpoints without authentication token',
            'Expected: Receive 401 Unauthorized response',
            'Test: Use expired authentication token',
            'Expected: Receive 401 Unauthorized with token_expired error',
            'Verify: Response includes WWW-Authenticate header'
          ]
        },
        {
          item: 'Rate limiting prevents abuse',
          notes: [
            'Test: Send 100 requests in 1 minute using same API key',
            'Expected: Receive 429 Too Many Requests after limit',
            'Verify: Rate limit headers present (X-RateLimit-*)',
            'Test: Verify rate limit resets after time window',
            'See RFC 6585 section 4 for 429 status code'
          ]
        },
        {
          item: 'SQL injection attacks are prevented',
          notes: [
            `Test: Send malicious SQL in query parameters:
GET /users?id=1' OR '1'='1
GET /search?q="; DROP TABLE users; --`,
            'Expected: Input properly sanitized or rejected',
            'Expected: No database errors exposed to client',
            'Verify: Use parameterized queries or ORM',
            'See OWASP Top 10 - A03:2021 Injection'
          ]
        },
        'HTTPS is enforced for all endpoints',
        'Sensitive data is not logged or exposed'
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
4. ✅ Consistent with ProcessStep/Constraint pattern
5. ✅ Migration is straightforward
6. ✅ Community consensus achieved

---

## Next Steps

**If Accepted:**
1. Create ADR documenting decision
2. Update UMS v2.1 spec (Criterion section)
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
- ADR 0006: Constraint Simplification (same pattern)
- RFC 2119: Key words for use in RFCs to Indicate Requirement Levels
- UMS v2.1 Specification: Section 3.3
- Implementation: `packages/ums-lib/src/core/rendering/markdown-renderer.ts:190-200`

---

**Status:** AWAITING FEEDBACK
**Last Updated:** 2025-01-15
**Feedback By:** 2025-01-29
