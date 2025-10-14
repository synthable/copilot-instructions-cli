# Proposal Submission and Review Process

**Version**: 1.0.1
**Last Updated**: 2025-10-13
**Status**: Active

---

## Overview

This document defines the standardized process for submitting, reviewing, and approving technical proposals for the Unified Module System (UMS) project. All significant changes to architecture, specifications, or features should follow this process to ensure thorough review and community alignment.

---

## When to Write a Proposal

Proposals are required for:

### Required
- **New features** that affect the UMS specification (v2.0+)
- **Breaking changes** to existing APIs or specifications
- **Architectural changes** that impact multiple packages
- **New specification versions** (e.g., UMS v2.1, v2.2, v3.0)
- **Deprecation of major features** or components

### Recommended
- **Significant new APIs** or public interfaces
- **Major refactorings** that change internal architecture
- **New standard library modules** or module categories
- **Changes to build processes** or tooling workflows

### Not Required
- Bug fixes that don't change behavior
- Documentation improvements
- Internal refactorings without API changes
- Minor performance optimizations
- Test additions or improvements

---

## Proposal Lifecycle

```
┌─────────────┐
│   Draft     │ ← Author creates proposal
└─────┬───────┘
      │
      ▼
┌─────────────┐
│   Review    │ ← Community reviews and provides feedback
└─────┬───────┘
      │
      ├──────────────┐
      ▼              ▼
┌─────────────┐ ┌──────────────┐
│  Approved   │ │  Rejected    │
└─────┬───────┘ └──────────────┘
      │              │
      ▼              ▼
┌─────────────┐ ┌──────────────┐
│Implementing │ │   Archived   │
└─────┬───────┘ └──────────────┘
      │
      ▼
┌─────────────┐
│ Completed   │
└─────────────┘
```

### Status Definitions

- **Draft**: Initial proposal under development by author(s)
- **Review**: Proposal submitted for community and maintainer review
- **Approved for Implementation**: Proposal accepted, implementation may begin
- **Rejected**: Proposal was formally reviewed and declined by maintainers, with documented rationale explaining the decision
- **Implementing**: Work in progress following approved proposal
- **Completed**: Implementation finished and merged
- **Archived**: Proposal was withdrawn by author, superseded by another proposal, or became obsolete before a final decision was reached

---

## Proposal Structure

All proposals must follow the standard template located at:
**`docs/spec/proposals/TEMPLATE.md`**

### Required Sections

1. **Header Metadata**
   - Status
   - Author(s)
   - Date
   - Last Reviewed
   - Target Version
   - Tracking Issue

2. **Abstract**
   - One-paragraph summary of the proposal
   - Clear statement of what is being proposed

3. **Motivation**
   - Problem statement
   - Current limitations
   - Use cases
   - Expected benefits

4. **Current State**
   - How things work today
   - Why current approach is insufficient

5. **Proposed Design**
   - Detailed technical design
   - API changes or additions
   - Examples demonstrating usage
   - Edge cases and error handling

6. **Implementation Details**
   - Build system changes
   - Validation rules
   - Migration considerations

7. **Alternatives Considered**
   - Other approaches evaluated
   - Why they were rejected
   - Trade-offs analysis

8. **Drawbacks and Risks**
   - Known issues or limitations
   - Mitigation strategies
   - Open questions

9. **Migration Path**
   - How to adopt the change
   - Backward compatibility strategy
   - Deprecation timeline (if applicable)

10. **Success Metrics**
    - How success will be measured
    - Adoption targets
    - Performance benchmarks

### Optional Sections

- **Design Decisions**: Resolved questions with rationale
- **Implementation Roadmap**: Phased rollout plan
- **Technical Review Summary**: Outcome of formal review
- **References**: Links to related specs, issues, or discussions
- **Appendices**: Supporting materials, type definitions, etc.

---

## Submission Process

### Step 1: Draft Creation

1. **Copy the template**:
   ```bash
   cp docs/spec/proposals/TEMPLATE.md docs/spec/proposals/your-proposal-name.md
   ```

2. **Fill in required sections**:
   - Use clear, concise language
   - Include code examples
   - Provide type definitions when applicable
   - Reference existing specifications

3. **Self-review checklist**:
   - [ ] Problem clearly stated
   - [ ] Proposed solution is detailed
   - [ ] Examples demonstrate key scenarios
   - [ ] Alternatives considered and documented
   - [ ] Risks identified with mitigations
   - [ ] Migration path defined
   - [ ] All required sections completed

### Step 2: Initial Discussion (Optional)

Before formal submission, consider:

- Opening a **GitHub Discussion** for early feedback
- Sharing in team channels for quick sanity check
- Getting input from affected stakeholders

This helps refine the proposal before formal review.

### Step 3: Formal Submission

1. **Create a feature branch**:
   ```bash
   git checkout -b proposal/your-proposal-name
   ```

2. **Commit the proposal**:
   ```bash
   git add docs/spec/proposals/your-proposal-name.md
   git commit -m "proposal: add proposal for [brief description]"
   ```

3. **Open a Pull Request**:
   - Title: `[PROPOSAL] Your Proposal Name`
   - Description: Link to proposal file and provide context
   - Label: `proposal`, `needs-review`
   - Assign relevant reviewers

4. **Create tracking issue**:
   - Title: `[Proposal] Your Proposal Name`
   - Link to proposal file in PR
   - Add to project board under "Proposals"

### Step 4: Review Period

**Minimum Review Period**: 7 days for standard proposals, 14 days for breaking changes

During review:
- Respond to feedback and questions
- Update proposal based on discussion
- Mark major revisions in commit messages
- Participate in design discussions

---

## Review Process

### Review Criteria

Reviewers evaluate proposals on:

1. **Technical Soundness**
   - Is the design architecturally coherent?
   - Does it align with UMS principles?
   - Are edge cases addressed?

2. **Problem-Solution Fit**
   - Does this solve the stated problem?
   - Is this the right solution?
   - Are there simpler alternatives?

3. **Completeness**
   - Are all required sections filled?
   - Is implementation detail sufficient?
   - Are examples clear and comprehensive?

4. **Impact Assessment**
   - Breaking changes justified?
   - Migration path clear?
   - Risk mitigation adequate?

5. **Maintainability**
   - Will this be sustainable long-term?
   - Does it add appropriate complexity?
   - Is testing strategy defined?

### Review Roles

**Author(s)**:
- Responds to feedback
- Updates proposal
- Clarifies design decisions

**Community Reviewers**:
- Provide feedback and suggestions
- Ask clarifying questions
- Test assumptions

**Maintainers**:
- Ensure completeness
- Assess architectural fit
- Make final approval decision

**Domain Experts** (when applicable):
- Review technical accuracy
- Validate approach
- Suggest improvements

### Feedback Guidelines

**For Reviewers**:
- Be constructive and specific
- Ask questions to understand intent
- Suggest alternatives with rationale
- Focus on technical merit

**For Authors**:
- Address all feedback, even if disagreeing
- Explain design decisions clearly
- Update proposal based on consensus
- Document resolved discussions

---

## Decision Process

### Approval Requirements

A proposal is **approved** when:

1. ✅ Minimum review period has elapsed
2. ✅ All major concerns addressed
3. ✅ At least 2 maintainer approvals
4. ✅ No unresolved blocking objections
5. ✅ Technical review summary completed (for major proposals)

**Technical Review Summary**: For major proposals (breaking changes, new spec versions, architectural changes), the lead maintainer should author a Technical Review Summary that captures:
- The final consensus reached
- Key trade-offs considered during review
- The ultimate rationale for approval or rejection
- Critical success factors for implementation

This summary is typically added to the proposal as a new section after review is complete.

### Rejection Criteria

A proposal may be **rejected** if:

- ❌ Problem is not significant enough
- ❌ Solution doesn't fit UMS architecture
- ❌ Better alternatives exist
- ❌ Implementation costs outweigh benefits
- ❌ Unresolvable conflicts with other designs
- ❌ Breaking changes unjustified

**Note**: Rejection includes documented rationale and may suggest alternative approaches.

### Approval Levels

**Standard Approval** (2 maintainers):
- New features within existing architecture
- Non-breaking API additions
- Documentation or tooling improvements

**Enhanced Approval** (3+ maintainers + community discussion):
- Breaking changes to specifications
- New specification versions
- Major architectural changes
- Deprecation of core features

---

## Post-Approval Process

### Step 1: Update Proposal Status

```markdown
**Status**: Approved for Implementation
**Approved By**: @maintainer1, @maintainer2
**Approval Date**: 2025-10-13
```

### Step 2: Create Implementation Plan

Add to proposal:
- **Implementation Roadmap** section with phases
- **Success Criteria** for each phase
- **Timeline** estimates
- **Resource Requirements**

### Step 3: Track Implementation

1. **Create tracking issue** (if not already created)
2. **Break into subtasks** on project board
3. **Assign implementers**
4. **Link PRs to proposal** in commits

### Step 4: Implementation Reviews

- Implementation PRs reference proposal
- Reviewers verify alignment with approved design
- Deviations require proposal amendment or new proposal

### Step 5: Completion

Once implementation is merged:
1. Update proposal status to **Completed**
2. Add **Implementation Notes** section documenting any deviations
3. Link to relevant PRs and commits
4. Update related documentation

---

## Proposal Templates

### Main Template

**Location**: `docs/spec/proposals/TEMPLATE.md`

Use this template for all standard proposals.

### Quick Template (Simple Proposals)

For simple, non-controversial proposals:

```markdown
# Proposal: [Brief Title]

**Status**: Draft
**Author**: Your Name
**Date**: YYYY-MM-DD

## Problem

[One paragraph describing the problem]

## Proposed Solution

[Detailed solution with examples]

## Alternatives Considered

[Other approaches and why they were rejected]

## Implementation

[High-level implementation plan]
```

---

## Example Proposals

### Exemplary Proposals

- [Selective Module Inclusion](./spec/proposals/selective-module-inclusion.md) - Comprehensive example with full review cycle

### Proposal Index

All active and historical proposals are tracked in:
**`docs/spec/proposals/README.md`**

This index includes:
- Proposal status
- Brief description
- Links to tracking issues
- Implementation status

---

## Best Practices

### For Authors

1. **Start with "Why"**: Clearly articulate the problem before jumping to solutions
2. **Show, Don't Tell**: Use code examples and concrete scenarios
3. **Be Thorough**: Address edge cases, errors, and migration
4. **Consider Impact**: Think about all affected users and systems
5. **Iterate Quickly**: Respond to feedback promptly
6. **Document Decisions**: Capture the "why" behind design choices

### For Reviewers

1. **Review Promptly**: Try to provide feedback within 3 days
2. **Be Specific**: Point to exact sections and suggest improvements
3. **Ask Questions**: Seek to understand before critiquing
4. **Suggest Alternatives**: Don't just identify problems, propose solutions
5. **Focus on Value**: Balance perfectionism with practical value
6. **Approve Explicitly**: Use GitHub's approval feature when satisfied

### For Maintainers

1. **Set Clear Expectations**: Communicate review timeline and requirements
2. **Facilitate Discussion**: Help resolve disagreements constructively
3. **Make Decisions**: Don't let proposals languish indefinitely
4. **Document Rationale**: Explain approval or rejection clearly
5. **Track Progress**: Ensure approved proposals are implemented
6. **Close the Loop**: Update proposal status as work progresses

---

## Governance

### Proposal Review Committee

For major proposals (breaking changes, new spec versions), a **Proposal Review Committee** may be convened:

- **Composition**: 3-5 maintainers + 1-2 community representatives
- **Responsibilities**: Deep technical review, recommendation to maintainers
- **Timeline**: 7-day review period for committee assessment

### Appeals Process

If a proposal is rejected, authors may:

1. **Request Clarification**: Ask maintainers to elaborate on concerns
2. **Revise and Resubmit**: Address issues and submit updated proposal
3. **Appeal Decision**: Present case to Proposal Review Committee (for major proposals)

### Amendment Process

Approved proposals may be amended:

1. **Minor Changes**: Update proposal file, note in "Amendments" section
2. **Major Changes**: Require new review cycle with "Amendment" label
3. **Version Tracking**: Track proposal version in header metadata

---

## Continuous Improvement

This proposal process is itself subject to improvement:

- **Feedback Welcome**: Suggest improvements via GitHub issues
- **Regular Review**: Process reviewed quarterly
- **Template Updates**: Templates evolve based on community needs

To propose changes to this process:
- Open issue: `[Meta] Proposal Process Improvement: [topic]`
- Label: `meta`, `process`
- Follow simplified proposal format

---

## Appendix A: Proposal Naming Convention

Proposal filenames should follow this pattern:

```
[category]-[brief-description].md
```

**Categories**:
- `feature-` - New feature proposals
- `breaking-` - Breaking changes
- `arch-` - Architectural changes
- `spec-` - Specification updates
- `deprecation-` - Feature deprecations

**Choosing the Right Category**:

When a proposal fits multiple categories, choose the one representing the **most significant impact**:

1. **Breaking changes take precedence**: If a new feature introduces breaking changes, use `breaking-`
2. **Architectural changes are next**: Major architectural changes, even if non-breaking, should use `arch-`
3. **Spec versions are explicit**: New spec versions always use `spec-`
4. **Features are default**: If no other category applies, use `feature-`

**Examples**:
- `feature-selective-module-inclusion.md` - New feature, non-breaking
- `breaking-ums-v3-api-redesign.md` - Breaking change (even if it adds features)
- `arch-distributed-module-registry.md` - Architectural change
- `spec-ums-v2.1-additions.md` - Specification update
- `deprecation-yaml-module-format.md` - Feature deprecation
- `breaking-remove-v1-support.md` - Breaking change, not `deprecation-` (because it's the removal)

---

## Appendix B: Quick Reference

### Proposal Checklist

- [ ] Used standard template
- [ ] All required sections complete
- [ ] Problem clearly stated
- [ ] Solution detailed with examples
- [ ] Alternatives considered
- [ ] Risks and mitigations documented
- [ ] Migration path defined
- [ ] Success metrics identified
- [ ] Self-reviewed for clarity
- [ ] Created feature branch
- [ ] Opened PR with `[PROPOSAL]` prefix
- [ ] Created tracking issue
- [ ] Notified relevant stakeholders

### Review Checklist

- [ ] Read proposal thoroughly
- [ ] Understood problem and motivation
- [ ] Evaluated proposed solution
- [ ] Considered alternatives
- [ ] Assessed risks and mitigations
- [ ] Checked implementation feasibility
- [ ] Verified migration path
- [ ] Provided specific, constructive feedback
- [ ] Approved or requested changes

### Approval Checklist

- [ ] Minimum review period elapsed
- [ ] All feedback addressed
- [ ] 2+ maintainer approvals
- [ ] No blocking objections
- [ ] Technical review completed (if required)
- [ ] Status updated to "Approved"
- [ ] Implementation roadmap added
- [ ] Tracking issue updated

---

## Contact

For questions about the proposal process:

- **GitHub Issues**: Use `[Meta]` prefix for process questions
- **Discussions**: Post in "Proposals" category
- **Email**: [maintainer contact if applicable]

---

**Document Version**: 1.0.1
**Changelog**:
- 2025-10-13 (v1.0.1): Refinements based on technical review
  - Clarified distinction between "Rejected" and "Archived" status definitions
  - Added guidance on Technical Review Summary authorship and purpose
  - Enhanced naming convention with category precedence rules
- 2025-10-13 (v1.0.0): Initial version based on selective-module-inclusion proposal review
