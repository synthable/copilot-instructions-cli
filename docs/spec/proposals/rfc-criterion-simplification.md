# RFC: Simplify Criterion Structure (UMS v2.1)

**Status:** ACCEPTED
**Author:** Jason Knight
**Date:** 2025-01-15
**Accepted:** 2025-01-15
**Related:** Follows ProcessStep (ADR 0005) and Constraint (ADR 0006) simplification
**Implementation:** ADR 0007, commit b774ef9

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

## Rendering Specification

This section provides a precise specification for rendering criteria with categories and notes.

### Rendering Algorithm

```typescript
function renderCriteria(criteria: Criterion[]): string {
  // 1. Group criteria
  const uncategorized: Criterion[] = [];
  const categorized = new Map<string, Criterion[]>();

  for (const criterion of criteria) {
    if (typeof criterion === 'string' || !criterion.category) {
      uncategorized.push(criterion);
    } else {
      if (!categorized.has(criterion.category)) {
        categorized.set(criterion.category, []);
      }
      categorized.get(criterion.category).push(criterion);
    }
  }

  const sections: string[] = [];

  // 2. Render uncategorized first
  if (uncategorized.length > 0) {
    sections.push(uncategorized.map(renderItem).join('\n\n'));
  }

  // 3. Render categorized groups
  for (const [category, items] of categorized.entries()) {
    sections.push(`### ${category}\n`);
    sections.push(items.map(renderItem).join('\n\n'));
  }

  return sections.join('\n\n');
}

function renderItem(criterion: Criterion): string {
  if (typeof criterion === 'string') {
    return `- [ ] ${criterion}`;
  }

  if (criterion.notes && criterion.notes.length > 0) {
    let text = `- [ ] **${criterion.item}**`;
    text += '\n' + criterion.notes.map(note => `  - ${note}`).join('\n');
    return text;
  }

  return `- [ ] ${criterion.item}`;
}
```

### Heading Levels

**Category headings:**
- **Level:** `###` (heading level 3)
- **Rationale:** Criteria section uses `##` (level 2), so categories are one level below
- **Format:** `### ${category}\n` (heading + newline)

**Example:**
```markdown
## Criteria    ← Level 2 (section heading)

### Security   ← Level 3 (category)
### Performance ← Level 3 (category)
```

### Indentation Rules

**Checkbox items:**
- No indentation (aligned to left margin)
- Format: `- [ ] ${text}`

**Notes under criteria:**
- **Indentation:** 2 spaces
- **Format:** `  - ${note}` (2 spaces + dash + space + note text)
- **Rationale:** Standard Markdown nested list indentation

**Example:**
```markdown
- [ ] **Rate limiting prevents abuse**
  - Test: Send 100 requests       ← 2-space indent
  - Expected: Receive 429          ← 2-space indent
```

### Blank Line Handling

**Between uncategorized items:**
- One blank line between items (rendered as `\n\n`)
- **Rationale:** Improves readability when notes are present

**Between categories:**
- One blank line before each category heading
- One blank line after category heading (provided by the `\n` after heading)

**Between items in same category:**
- One blank line between items

**Example:**
```markdown
- [ ] Uncategorized item 1

- [ ] Uncategorized item 2

### Security

- [ ] Security item 1

- [ ] Security item 2

### Performance

- [ ] Performance item 1
```

### Markdown Escaping

**Item text:**
- Escape Markdown special characters in `criterion.item`
- Special characters: `*`, `_`, `[`, `]`, `(`, `)`, `#`, `\`
- **However:** Current implementation does NOT escape (assumes authors write Markdown-safe text)
- **Future consideration:** Add escaping function if needed

**Category names:**
- No escaping applied (assumes valid heading text)
- Invalid characters in category names are author's responsibility

**Note text:**
- No escaping applied to notes
- Authors may use Markdown formatting within notes (e.g., `\`code\``, `**bold**`)

**Example with Markdown in notes:**
```typescript
{
  item: 'API endpoints follow REST conventions',
  notes: [
    'Good: `/users`, `/users/123`, `/orders`',
    'Bad: `/getUser`, `/createOrder`',
    'Use `snake_case` for query parameters'  // backticks work
  ]
}
```

**Rendered:**
```markdown
- [ ] **API endpoints follow REST conventions**
  - Good: `/users`, `/users/123`, `/orders`
  - Bad: `/getUser`, `/createOrder`
  - Use `snake_case` for query parameters
```

### Edge Cases

#### 1. Empty Category Name

```typescript
{ item: 'Test item', category: '' }
```

**Behavior:** Treated as uncategorized (empty string is falsy)

**Rendered:**
```markdown
- [ ] Test item
```

#### 2. Empty Notes Array

```typescript
{ item: 'Test item', notes: [] }
```

**Behavior:** Rendered as regular item (no bold, no notes)

**Rendered:**
```markdown
- [ ] Test item
```

#### 3. Whitespace-Only Category

```typescript
{ item: 'Test item', category: '   ' }
```

**Behavior:** Rendered with whitespace category heading (spec does not trim)

**Rendered:**
```markdown
###

- [ ] Test item
```

**Recommendation:** Validation should reject whitespace-only categories

#### 4. Duplicate Categories

```typescript
[
  { item: 'Item 1', category: 'Security' },
  { item: 'Item 2', category: 'Performance' },
  { item: 'Item 3', category: 'Security' }  // Duplicate
]
```

**Behavior:** Items grouped under same category heading

**Rendered:**
```markdown
### Security

- [ ] Item 1

- [ ] Item 3

### Performance

- [ ] Item 2
```

**Note:** Order preserved from first occurrence of each category

#### 5. Mixed String and Object Criteria

```typescript
[
  'Simple criterion',
  { item: 'Object criterion', category: 'Security' },
  'Another simple criterion'
]
```

**Behavior:** Strings treated as uncategorized

**Rendered:**
```markdown
- [ ] Simple criterion

- [ ] Another simple criterion

### Security

- [ ] Object criterion
```

#### 6. Special Characters in Item Text

```typescript
{ item: 'Test `code` with **bold** and [link](url)' }
```

**Behavior:** No escaping (Markdown rendered as-is)

**Rendered:**
```markdown
- [ ] Test `code` with **bold** and [link](url)
```

**Note:** If item has notes, the item is bolded, which may interact with embedded Markdown

#### 7. Multi-line Notes

```typescript
{
  item: 'Complex test scenario',
  notes: [
    `Test scenario:
1. Step one
2. Step two
3. Step three`
  ]
}
```

**Behavior:** Newlines in notes preserved as-is

**Rendered:**
```markdown
- [ ] **Complex test scenario**
  - Test scenario:
1. Step one
2. Step two
3. Step three
```

**Note:** Multi-line notes may break indentation (list items not properly nested)

**Recommendation:** Use separate note strings instead of multi-line strings

#### 8. Empty Criteria Array

```typescript
criteria: []
```

**Behavior:** Criteria section not rendered at all

**Rendered:**
```markdown
[No Criteria section]
```

#### 9. Null or Undefined in Notes

```typescript
{ item: 'Test', notes: [null, undefined, 'Valid note'] }
```

**Behavior:** Implementation-dependent (TypeScript prevents this)

**Expected:** TypeScript type system rejects `null` and `undefined` in `string[]`

#### 10. Very Long Category Names

```typescript
{
  item: 'Test',
  category: 'This Is An Extremely Long Category Name That Goes On And On And On'
}
```

**Behavior:** Rendered as-is (no truncation)

**Rendered:**
```markdown
### This Is An Extremely Long Category Name That Goes On And On And On

- [ ] Test
```

**Recommendation:** Validation should warn about category names > 50 characters

### Rendering Order Guarantees

1. **Uncategorized criteria always appear first**
2. **Categorized criteria appear in order of first occurrence**
3. **Within each category, criteria maintain original array order**
4. **Items within same category are NOT reordered**

**Example:**
```typescript
[
  'Uncategorized 1',
  { item: 'Perf 1', category: 'Performance' },
  { item: 'Sec 1', category: 'Security' },
  'Uncategorized 2',
  { item: 'Perf 2', category: 'Performance' },
  { item: 'Sec 2', category: 'Security' }
]
```

**Rendered order:**
```markdown
- [ ] Uncategorized 1

- [ ] Uncategorized 2

### Performance

- [ ] Perf 1

- [ ] Perf 2

### Security

- [ ] Sec 1

- [ ] Sec 2
```

### Validation Rules

**Recommended validation (not enforced by renderer):**

1. **Category names:**
   - Should not be empty or whitespace-only
   - Should be < 50 characters
   - Should use Title Case
   - Should not contain special characters: `#`, `*`, `[`, `]`

2. **Item text:**
   - Should not be empty
   - Should not start/end with whitespace
   - Should be < 200 characters (long items hard to scan)

3. **Notes:**
   - Should not contain empty strings
   - Each note should be < 150 characters (readability)
   - Should not use multi-line strings (breaks indentation)

4. **Array size:**
   - Total criteria should be < 50 (large sets hard to verify)
   - Criteria per category should be < 20

### Complete Rendering Example

**Input:**
```typescript
criteria: [
  'All tests pass',
  'Documentation complete',
  {
    item: 'HTTPS enforced',
    category: 'Security'
  },
  {
    item: 'Rate limiting active',
    category: 'Security',
    notes: [
      'Test: Send 100 req/min',
      'Expected: 429 after limit'
    ]
  },
  {
    item: 'Response time < 100ms',
    category: 'Performance',
    notes: ['Measure with load testing tool']
  }
]
```

**Rendered output:**
```markdown
## Criteria

- [ ] All tests pass

- [ ] Documentation complete

### Security

- [ ] HTTPS enforced

- [ ] **Rate limiting active**
  - Test: Send 100 req/min
  - Expected: 429 after limit

### Performance

- [ ] **Response time < 100ms**
  - Measure with load testing tool
```

**Character count breakdown:**
- Uncategorized section: 2 items, no notes
- Security section: 2 items, 1 with notes (2 notes)
- Performance section: 1 item with notes (1 note)
- Blank lines: Between all items and sections
- Heading level: `###` for categories
- Indentation: 2 spaces for notes

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
| Feedback Period | 2025-01-15 | ✅ Complete (Approved) |
| Decision | 2025-01-15 | ✅ Accepted |
| Implementation | 2025-01-15 | ✅ Complete (commit b774ef9) |
| Migration Tools | TBD | ⏸️ Pending |
| Documentation | 2025-01-15 | ✅ Complete (ADR 0007) |

**RFC Accepted and Implemented: January 15, 2025**

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

## Implementation Status

**✅ Completed:**
1. ✅ Created ADR 0007 documenting decision
2. ✅ Updated UMS v2.1 spec (Criterion section with migration example)
3. ✅ Updated TypeScript types (removed severity, kept category, added notes)
4. ✅ Implemented renderer changes (category grouping, notes rendering)
5. ✅ Added comprehensive tests for criteria rendering
6. ✅ Updated documentation (ADR 0007, spec updates)

**⏸️ Pending:**
7. ⏸️ Create migration tooling for auto-converting v2.0 → v2.1
8. ⏸️ Update example modules to use new format

**Implementation:** commit b774ef9

---

## References

- ADR 0005: ProcessStep Simplification (same pattern)
- ADR 0006: Constraint Simplification (same pattern)
- RFC 2119: Key words for use in RFCs to Indicate Requirement Levels
- UMS v2.1 Specification: Section 3.3
- Implementation: `packages/ums-lib/src/core/rendering/markdown-renderer.ts:190-200`

---

**Status:** ACCEPTED AND IMPLEMENTED
**Last Updated:** 2025-01-15
**Implementation:** ADR 0007, commit b774ef9
