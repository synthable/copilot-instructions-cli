# Proposal Quick Start Guide

**New to proposals?** This guide will get you started in 5 minutes.

---

## TL;DR

```bash
# 1. Copy the template
cp docs/spec/proposals/TEMPLATE.md docs/spec/proposals/feature-my-idea.md

# 2. Fill it out (focus on Problem → Solution → Examples)

# 3. Create branch and PR
git checkout -b proposal/my-idea
git add docs/spec/proposals/feature-my-idea.md
git commit -m "proposal: add proposal for my idea"
git push origin proposal/my-idea

# 4. Open PR with [PROPOSAL] prefix

# 5. Wait for feedback (7 days minimum)
```

---

## 3-Minute Version

### Step 1: Is a Proposal Needed?

**YES** - Write a proposal if:
- 🔧 New feature affecting UMS spec
- ⚠️ Breaking changes
- 🏗️ Architecture changes
- 📐 New spec versions

**NO** - Skip proposal for:
- 🐛 Bug fixes
- 📝 Documentation updates
- ✅ Test improvements
- 🔍 Minor refactoring

### Step 2: Copy Template

```bash
cp docs/spec/proposals/TEMPLATE.md docs/spec/proposals/[category]-[name].md
```

**Categories**: `feature-`, `breaking-`, `arch-`, `spec-`, `deprecation-`

### Step 3: Focus on These Sections

Most important sections (in order):

1. **Abstract** - One paragraph summary
2. **Motivation** - What problem are you solving?
3. **Proposed Design** - Your solution with examples
4. **Alternatives Considered** - What else did you think about?
5. **Drawbacks and Risks** - What could go wrong?

You can fill in the rest later.

### Step 4: Submit PR

1. Create feature branch: `proposal/[name]`
2. Commit your proposal
3. Open PR with title: `[PROPOSAL] Your Title`
4. Add labels: `proposal`, `needs-review`
5. Tag relevant people

### Step 5: Iterate

- Review period: **7 days** (14 for breaking changes)
- Respond to feedback
- Update proposal
- Get 2 maintainer approvals

---

## What Makes a Good Proposal?

### ✅ DO

- **Start with Why**: Explain the problem clearly
- **Show Examples**: Use code to demonstrate
- **Be Specific**: Concrete over abstract
- **Consider Alternatives**: Show you've thought it through
- **Admit Tradeoffs**: Every design has downsides

### ❌ DON'T

- **Assume Context**: Explain like readers don't know the background
- **Skip Examples**: Code examples are crucial
- **Hide Drawbacks**: Be honest about limitations
- **Bikeshed**: Focus on substance over style
- **Be Vague**: "Make it better" isn't specific enough

---

## Example Structure (Minimal)

```markdown
# Proposal: [Your Idea]

## Abstract
[2-3 sentences explaining what you want to do]

## Problem
Right now, users can't [X] because [Y].
This causes [Z] pain points.

## Solution
I propose adding [feature] that works like this:

```typescript
// Clear code example
```

This solves the problem by [explanation].

## Why Not Just [Alternative]?
[Explain why alternatives don't work]

## Risks
- Risk 1: [mitigation]
- Risk 2: [mitigation]
```

That's it! You can expand from there.

---

## Common Questions

**Q: How long should a proposal be?**
A: Long enough to be clear. Selective Module Inclusion is ~800 lines. Simple proposals can be 200 lines.

**Q: What if I'm not sure about the design?**
A: That's fine! Mark sections with `[DISCUSSION NEEDED]` and ask questions.

**Q: Do I need working code?**
A: No. Proposals come before implementation.

**Q: What if my proposal is rejected?**
A: You'll get clear feedback on why. You can revise and resubmit.

**Q: How long does review take?**
A: Minimum 7 days. Complex proposals may take 2-3 weeks.

**Q: Can I get early feedback?**
A: Yes! Open a GitHub Discussion or share a draft in team channels.

---

## Proposal Checklist

Before submitting:

- [ ] Problem clearly explained
- [ ] Solution detailed with code examples
- [ ] At least 2 alternatives considered
- [ ] Risks identified
- [ ] Migration path described (if breaking)
- [ ] Used standard template
- [ ] Filename follows naming convention
- [ ] Created feature branch
- [ ] Opened PR with `[PROPOSAL]` prefix

---

## Need Help?

- 📖 Full guide: [docs/proposal-process.md](./proposal-process.md)
- 📋 Template: [docs/spec/proposals/TEMPLATE.md](./spec/proposals/TEMPLATE.md)
- 💬 Ask in GitHub Discussions
- 📧 Email maintainers

---

## Real Examples

- [Selective Module Inclusion](./spec/proposals/selective-module-inclusion.md) - Comprehensive example with full review

---

**Remember**: Proposals are conversations, not proclamations. The goal is to find the best solution together, not to defend your first idea to the death.

Good luck! 🚀
