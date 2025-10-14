# Proposal: [Proposal Title]

**Status**: Draft
**Author**: [Your Name] <email@example.com>
**Date**: YYYY-MM-DD
**Last Reviewed**: YYYY-MM-DD
**Target Version**: [e.g., UMS v2.1, v3.0]
**Tracking Issue**: [Link to GitHub issue or TBD]

---

## Abstract

[Provide a clear, concise summary (2-3 sentences) of what this proposal aims to accomplish. This should be understandable by someone skimming the proposal list.]

---

## Technical Review Summary

[This section is added by the lead maintainer after review is complete, for major proposals]

**Overall Assessment**: [e.g., Highly Recommended, Recommended with Changes, Not Recommended]

[Summary of the review outcome, capturing:]

- The final consensus reached
- Key trade-offs considered during review
- The ultimate rationale for approval or rejection
- Critical success factors for implementation

[Delete this section if not applicable for minor proposals]

---

## Motivation

### Current Limitation

[Describe the current state and what's insufficient about it. Be specific about what users or developers can't do today.]

**Example Problem:**

```typescript
// Show concrete code examples demonstrating the limitation
```

### Use Cases

[List 3-5 specific use cases that motivate this proposal]

1. **Use Case 1**: [Description]
2. **Use Case 2**: [Description]
3. **Use Case 3**: [Description]

### Benefits

- **Benefit 1**: [How this helps users/developers]
- **Benefit 2**: [Quantifiable improvements if possible]
- **Benefit 3**: [Long-term advantages]

---

## Current State (UMS v2.0)

### Existing Behavior

[Describe how things work today. Include relevant code snippets, type definitions, or workflow diagrams.]

```typescript
// Example of current approach
```

**Result**: [What happens with current approach]

---

## Proposed Design

### Design Principles

[List core principles guiding this design]

1. **Principle 1**: [e.g., Backward Compatible]
2. **Principle 2**: [e.g., Opt-In]
3. **Principle 3**: [e.g., Type-Safe]

### Technical Design

[Detailed technical specification of the proposed solution]

#### API Changes

```typescript
// Show new or modified type definitions
interface NewInterface {
  // ...
}
```

#### Syntax Examples

[Provide multiple examples showing different usage patterns]

**Example 1: Basic Usage**

```typescript
// Show how a typical user would use this
```

**Result**: [What happens]

**Example 2: Advanced Usage**

```typescript
// Show more complex scenarios
```

**Result**: [What happens]

**Example 3: Edge Cases**

```typescript
// Show how edge cases are handled
```

**Result**: [What happens]

### Error Handling

[Describe how errors are detected, reported, and handled]

```typescript
// Error handling examples
```

---

## Implementation Details

### Build System Changes

[Describe required changes to build tooling, orchestration, etc.]

1. **Component 1**: [Changes needed]
2. **Component 2**: [Changes needed]

### Validation Rules

**Pre-Build Validation:**

1. **Rule 1**: [Description]
2. **Rule 2**: [Description]

**Post-Build Validation:**

1. **Rule 1**: [Description]
2. **Rule 2**: [Description]

### Type System Updates

[Show any new types or modifications to existing types]

```typescript
// Updated type definitions
```

---

## Examples

### Example 1: [Scenario Name]

```typescript
// Complete, runnable example
```

**Explanation**: [Walk through what this example demonstrates]

### Example 2: [Scenario Name]

```typescript
// Another complete example
```

**Explanation**: [Walk through what this example demonstrates]

---

## Alternatives Considered

### Alternative 1: [Approach Name]

**Approach**: [Description]

**Example:**

```typescript
// Show how this alternative would work
```

**Pros:**

- [Advantage 1]
- [Advantage 2]

**Cons:**

- [Disadvantage 1]
- [Disadvantage 2]

**Verdict**: [Why this was rejected]

### Alternative 2: [Approach Name]

[Repeat structure for each alternative]

---

## Drawbacks and Risks

### [Risk Category 1]

**Risk**: [Description of the risk]

**Mitigation**:

- [Strategy 1]
- [Strategy 2]

### [Risk Category 2]

**Risk**: [Description of the risk]

**Example**: [Concrete example of the risk]

**Mitigation**:

- [Strategy 1]
- [Strategy 2]

---

## Migration Path

### Backward Compatibility

[Describe how existing code continues to work]

### Adoption Strategy

[Step-by-step guide for users to adopt this change]

**Phase 1**: [What users should do first]
**Phase 2**: [Next steps]
**Phase 3**: [Final adoption]

### Deprecation Timeline (if applicable)

- **Version X.Y**: Feature deprecated, warnings issued
- **Version X.Z**: Feature removed

---

## Success Metrics

[Define how success will be measured]

1. **Metric 1**: [e.g., Adoption rate > X%]
2. **Metric 2**: [e.g., Performance improvement of Y%]
3. **Metric 3**: [e.g., Reduction in Z]
4. **Community Feedback**: [Target satisfaction score]

---

## Open Questions

[List any unresolved questions for discussion]

1. **Question 1**: [Description]
   - Option A: [Description]
   - Option B: [Description]

2. **Question 2**: [Description]

---

## References

- [UMS v2.0 Specification](../unified_module_system_v2_spec.md)
- [Related Proposal/Issue]
- [External Resource]

---

## Appendix: [Additional Information]

[Include supporting materials like:]

### Full Type Definitions

```typescript
// Complete type definitions
```

### Implementation Pseudocode

```
// High-level implementation logic
```

### Performance Benchmarks

[Data supporting performance claims]

---

## Changelog

[Track major revisions to this proposal]

- **YYYY-MM-DD**: Initial draft
- **YYYY-MM-DD**: [Description of changes]
