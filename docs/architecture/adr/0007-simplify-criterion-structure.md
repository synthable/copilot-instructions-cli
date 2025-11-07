# ADR 0007: Simplify Criterion Structure

**Status:** Accepted
**Date:** 2025-01-15
**Deciders:** Jason Knight
**Related:** ADR 0005 (ProcessStep), ADR 0006 (Constraint), RFC: Criterion Simplification

---

## Context

The `Criterion` interface in UMS v2.1 currently has 3 fields:

```typescript
interface Criterion {
  item: string;
  category?: string;
  severity?: 'critical' | 'important' | 'nice-to-have';
}
```

However, **only the `item` field is rendered** in markdown output. The `severity` field is ignored, and the `category` field isn't rendered either (though it could be useful if properly rendered).

### Problems Identified

1. **Severity Field Not Rendered**: The `severity` field is defined but never appears in the compiled output
2. **Natural Language Works**: Authors already express severity naturally using RFC 2119 keywords (MUST/SHOULD/MAY)
3. **Category Not Rendered**: The `category` field isn't rendered, but unlike severity, it would be genuinely useful for organizing large criterion sets
4. **No Elaboration Support**: No way to add test instructions, expected results, or verification steps

### Example of Current Issues

The current renderer only uses `item`:
```typescript
// markdown-renderer.ts:191-200
const criteria = instruction.criteria.map(criterion => {
  if (typeof criterion === 'string') {
    return `- [ ] ${criterion}`;
  }
  return `- [ ] ${criterion.item}`;  // Only this! category and severity ignored
});
```

---

## Decision

**Simplify `Criterion` by removing `severity` and adding `notes`, while keeping and properly rendering `category`:**

```typescript
type Criterion = string | {
  item: string;
  category?: string;  // KEEP - will render as subheadings
  notes?: string[];   // ADD - for test details and elaboration
  // severity removed - use RFC 2119 keywords instead
};
```

### Key Changes

1. **Remove field**: `severity` (overlaps with RFC 2119 keywords)
2. **Keep field**: `category` (useful for grouping, will implement rendering)
3. **Add field**: `notes` (flexible elaboration for test instructions)
4. **Support both forms**: Simple strings (90% case) and objects with details (10% case)

---

## Usage Patterns

### Simple Criteria (90% of cases)

```typescript
criteria: [
  'All endpoints return proper HTTP status codes',
  'Error handling covers edge cases',
  'Documentation is complete'
]
```

### Criteria with Categories

```typescript
criteria: [
  // Uncategorized
  'All tests pass before deployment',

  // Security category
  {
    item: 'All endpoints use HTTPS',
    category: 'Security'
  },
  {
    item: 'Authentication required for protected resources',
    category: 'Security'
  },

  // Performance category
  {
    item: 'Response times under 100ms',
    category: 'Performance'
  }
]
```

### Criteria with Test Details

```typescript
criteria: [
  {
    item: 'Rate limiting prevents abuse',
    category: 'Security',
    notes: [
      'Test: Send 100 requests in 1 minute using same API key',
      'Expected: Receive 429 Too Many Requests after limit',
      'Verify: Rate limit headers present (X-RateLimit-Limit, X-RateLimit-Remaining)',
      'See RFC 6585 section 4 for 429 status code specification'
    ]
  }
]
```

---

## Rendered Output

### Without Categories

```markdown
## Criteria

- [ ] All tests pass before deployment
- [ ] Documentation is complete
```

### With Categories

```markdown
## Criteria

- [ ] All tests pass before deployment
- [ ] Documentation is complete

### Security

- [ ] All endpoints use HTTPS

- [ ] **Rate limiting prevents abuse**
  - Test: Send 100 requests in 1 minute using same API key
  - Expected: Receive 429 Too Many Requests after limit
  - Verify: Rate limit headers present (X-RateLimit-*)
  - See RFC 6585 section 4 for 429 status code

### Performance

- [ ] Response times under 100ms
- [ ] Database queries optimized
```

---

## Authoring Guidelines

### Expressing Severity

Use RFC 2119 keywords in the criterion text:

```typescript
criteria: [
  'All endpoints MUST use HTTPS',              // Critical (error)
  'Response times SHOULD be under 100ms',      // Important (warning)
  'Error messages MAY include help links'      // Nice-to-have (info)
]
```

Or natural language prefixes:
```typescript
criteria: [
  'Critical: All endpoints use HTTPS',
  'Important: Response times under 100ms',
  'Nice-to-have: Error messages include help links'
]
```

### Notes Formatting Conventions

**Test Instructions** - Use `Test:` prefix:
```typescript
notes: [
  'Test: Send 100 requests in 1 minute',
  'Test: Verify rate limit headers present'
]
```

**Expected Results** - Use `Expected:` prefix:
```typescript
notes: [
  'Expected: Receive 429 Too Many Requests',
  'Expected: Headers include X-RateLimit-Remaining'
]
```

**Verification Steps** - Use `Verify:` prefix:
```typescript
notes: [
  'Verify: Check response status code',
  'Verify: Inspect rate limit headers'
]
```

**References** - Include standards/specs:
```typescript
notes: [
  'See RFC 7231 for HTTP status code definitions',
  'Refer to OWASP API Security Top 10'
]
```

**Multi-line Scenarios** - Use template literals:
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

---

## Decision Rationale

### 1. Severity: Natural Language is Sufficient

RFC 2119 keywords convey severity clearly:
- **MUST** = Critical (absolute requirement)
- **SHOULD** = Important (recommended)
- **MAY** = Nice-to-have (optional)

This is clearer and more natural than `severity: 'critical'`.

### 2. Category: Useful for Organization

Unlike severity, `category` serves a genuine organizational purpose. For modules with 10+ criteria, categories make verification much more manageable:

```markdown
### Security (5 checks)
### Performance (4 checks)
### API Design (6 checks)
```

**Alternatives are inferior:**
- Comments don't render
- Text prefixes are repetitive ("Security: " on every line)
- Separate arrays don't fit the schema

### 3. Notes: Flexible Test Documentation

The `notes` array provides flexibility for:
- Test instructions
- Expected outcomes
- Verification steps
- References to standards
- Multi-line test scenarios

Without rigid structure or authoring friction.

### 4. Consistency with Simplification Pattern

Following the same approach as ProcessStep and Constraint:
- Remove fields that aren't rendered
- Use natural language for severity
- Add `notes` for elaboration
- Keep fields that serve unique purposes (category)

### 5. YAGNI for Test Structure

We considered structured test fields:
```typescript
test?: {
  steps?: string[];
  expected?: string[];
  verify?: string[];
}
```

But rejected because:
- Natural language conventions work fine
- Adds complexity for 10% use case
- Can add later if needed
- Inconsistent with simplification philosophy

---

## Consequences

### Positive

✅ **Simpler authoring** - Fewer fields, clearer patterns
✅ **Consistent pattern** - Follows ProcessStep/Constraint approach
✅ **Category organization** - Large criterion sets are more scannable
✅ **Full rendering** - Category and notes actually displayed
✅ **Flexible test docs** - Notes support any test documentation style
✅ **Standards-based** - RFC 2119 keywords are widely understood

### Negative

⚠️ **Breaking change** - Existing modules with `severity` need migration
⚠️ **Less machine-parseable** - Natural language vs structured severity
⚠️ **Migration effort** - Need to convert existing criteria (low effort with automation)

### Migration Path

Auto-convert existing criteria:

```typescript
// Old
{
  item: 'All endpoints return proper status codes',
  category: 'API Quality',
  severity: 'critical'
}

// Auto-converted
{
  item: 'All endpoints MUST return proper status codes',
  category: 'API Quality'
}

// Or simpler if no category
'All endpoints MUST return proper status codes'
```

---

## Alternatives Considered

### Alternative 1: Keep Current Structure

**Rejected because:**
- `severity` field not rendered (wasted effort)
- Overlaps with RFC 2119 keywords
- No support for test elaboration
- Inconsistent with ProcessStep/Constraint pattern

### Alternative 2: Remove Both severity and category

**Rejected because:**
- Category is genuinely useful for organization
- Large criterion sets benefit from grouping
- Alternatives (comments, prefixes) are inferior

### Alternative 3: Keep Both severity and category

**Rejected because:**
- Severity works fine in natural language
- Adds authoring friction
- Partially inconsistent with simplification pattern
- MUST/SHOULD/MAY keywords are clearer

---

## Implementation Notes

### Renderer Changes

Update `renderInstructionComponent()` to:
1. Group criteria by category
2. Render uncategorized first
3. Render categorized with `### Category` subheadings
4. Bold criteria that have notes
5. Render notes as bulleted sub-items

```typescript
function renderCriteria(criteria: Criterion[]): string {
  // Group by category
  const uncategorized: Criterion[] = [];
  const categorized = new Map<string, Criterion[]>();

  for (const criterion of criteria) {
    if (typeof criterion === 'string' || !criterion.category) {
      uncategorized.push(criterion);
    } else {
      if (!categorized.has(criterion.category)) {
        categorized.set(criterion.category, []);
      }
      categorized.get(criterion.category)!.push(criterion);
    }
  }

  const sections: string[] = [];

  // Render uncategorized
  if (uncategorized.length > 0) {
    sections.push(uncategorized.map(renderItem).join('\n\n'));
  }

  // Render categorized groups
  for (const [category, items] of categorized) {
    sections.push(`### ${category}\n`);
    sections.push(items.map(renderItem).join('\n\n'));
  }

  return sections.join('\n\n');
}

function renderItem(criterion: Criterion): string {
  if (typeof criterion === 'string') {
    return `- [ ] ${criterion}`;
  }

  let text = `- [ ] `;
  if (criterion.notes && criterion.notes.length > 0) {
    text += `**${criterion.item}**`;
    const notesList = criterion.notes.map(n => `  - ${n}`).join('\n');
    text += `\n${notesList}`;
  } else {
    text += criterion.item;
  }

  return text;
}
```

### Type Changes

Update `packages/ums-lib/src/types/index.ts`:

```typescript
/**
 * A criterion for verification and success checking.
 * Can be a simple string or an object with optional category and notes.
 *
 * Use RFC 2119 keywords (MUST, SHOULD, MAY) to indicate priority:
 * - MUST / REQUIRED / SHALL = Critical (absolute requirement)
 * - SHOULD / RECOMMENDED = Important (recommended)
 * - MAY / OPTIONAL = Nice-to-have (truly optional)
 *
 * @example
 * ```typescript
 * // Simple criteria
 * criteria: [
 *   'All endpoints MUST use HTTPS',
 *   'Response times SHOULD be under 100ms'
 * ]
 *
 * // With categories and test details
 * criteria: [
 *   {
 *     item: 'Rate limiting prevents abuse',
 *     category: 'Security',
 *     notes: [
 *       'Test: Send 100 requests in 1 minute',
 *       'Expected: Receive 429 Too Many Requests',
 *       'Verify: Rate limit headers present'
 *     ]
 *   }
 * ]
 * ```
 */
export type Criterion =
  | string
  | {
      /** The verification criterion. Use RFC 2119 keywords (MUST, SHOULD, MAY) for priority. */
      item: string;
      /** Optional category for grouping (renders as subheading). */
      category?: string;
      /** Optional notes for test instructions, expected results, or references. */
      notes?: string[];
    };
```

---

## Related

- **ADR 0005**: ProcessStep Simplification (same pattern)
- **ADR 0006**: Constraint Simplification (same pattern)
- **RFC 2119**: Key words for use in RFCs to Indicate Requirement Levels
- **UMS v2.1 Spec**: Section 3.3 (Criterion component)
- **RFC Proposal**: `docs/spec/proposals/rfc-criterion-simplification.md`

---

**Status:** Accepted
**Date:** 2025-01-15
**Version:** 1.0
