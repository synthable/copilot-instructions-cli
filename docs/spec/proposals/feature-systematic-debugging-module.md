# Proposal: Systematic Debugging Module for UMS

**Status**: Draft
**Author**: Generated from discussion on applied reasoning patterns
**Date**: 2025-10-14
**Last Reviewed**: 2025-10-14
**Target Version**: UMS v2.1
**Tracking Issue**: TBD

---

## Abstract

This proposal introduces a **Systematic Debugging** module to the UMS standard library that combines the ReAct reasoning pattern (Observe → Reason → Act → Observe) with debugging best practices and domain-specific constraints. Unlike a simple "debug systematically" instruction, this module provides structured guidance, validation criteria, and debugging patterns that significantly improve debugging efficiency and teach proper debugging methodology.

---

## Motivation

### Current Limitation

Developers frequently debug inefficiently by:

- Making multiple changes before observing results (shotgun debugging)
- Forming hypotheses without gathering evidence (assumption-based debugging)
- Repeating failed approaches (not documenting dead ends)
- Getting stuck in analysis paralysis or random trial-and-error

**Current approaches to addressing this:**

**Approach 1: Simple instruction**

```typescript
// In a persona:
"Debug systematically";
// or
"Use the ReAct pattern when debugging";
```

**Problem**: Too vague. Doesn't specify:

- What "systematic" means in debugging context
- How to apply ReAct to debugging specifically
- What constraints to follow
- When to observe vs. reason vs. act
- How to document the process

**Approach 2: Inline detailed guidance**

```typescript
// In a persona:
"When debugging: first observe the error state and gather evidence, then form
 a hypothesis based only on observations, test one hypothesis at a time by
 making minimal changes, observe the results, and iterate. Never make multiple
 changes without checking results. Always document failed hypotheses..."
```

**Problem**:

- Unmaintainable (repeated across personas)
- Hard to update (find all instances)
- Can't selectively include parts
- Doesn't compose with other modules
- Can't evolve independently

### Use Cases

1. **Bug Fixing**: Developer encounters a bug and needs to isolate root cause
2. **Performance Issues**: Identifying bottlenecks through systematic observation
3. **Integration Problems**: Debugging complex system interactions
4. **Production Incidents**: Methodical approach under pressure
5. **Teaching Debugging**: Training junior developers in proper methodology
6. **Code Review**: Evaluating if debugging approach was systematic

### Benefits

- **Efficiency**: Reduces time wasted on unproductive debugging approaches
- **Consistency**: Standardizes debugging methodology across personas
- **Teachable**: Provides clear structure that can be learned and improved
- **Maintainable**: Single source of truth for debugging best practices
- **Composable**: Works with other modules (error-handling, testing, logging)
- **Evolvable**: Can be updated as debugging techniques improve

---

## Current State (UMS v2.0)

### No Standard Debugging Module

Currently, UMS v2.0 has:

- No debugging-specific modules
- General problem-solving guidance scattered across modules
- Personas must include debugging guidance inline or omit it

**Example current approach:**

```typescript
// A backend developer persona today:
export default {
  name: "Backend Developer",
  modules: [
    "foundation/ethics/do-no-harm",
    "principle/testing/test-driven-development",
    "technology/typescript/error-handling",
    "principle/architecture/clean-architecture",
  ],
  // Debugging guidance must be added inline or is missing
} satisfies Persona;
```

**Result**: No standardized debugging methodology, inconsistent approaches across personas.

---

## Proposed Design

### Design Principles

1. **Applied Pattern**: Combines ReAct reasoning framework with debugging domain knowledge
2. **Actionable**: Provides specific steps, not abstract principles
3. **Constrained**: Enforces discipline through explicit constraints
4. **Evidence-Based**: Emphasizes observation over assumption
5. **Iterative**: Embraces the cyclical nature of debugging

### Module Specification

```typescript
export const systematicDebugging: Module = {
  id: "execution/debugging/systematic-debugging",
  version: "1.0.0",
  schemaVersion: "2.0",
  capabilities: [
    "debugging",
    "problem-solving",
    "root-cause-analysis",
    "iteration",
  ],
  cognitiveLevel: 3, // Action / Decision
  domain: "language-agnostic",

  metadata: {
    name: "Systematic Debugging",
    description:
      "Debug systematically using observe-reason-act cycles to isolate root causes efficiently",
    semantic:
      "Debugging, troubleshooting, bug isolation, root cause analysis, systematic investigation, observe-reason-act, ReAct pattern, hypothesis testing, scientific method for debugging, error isolation, problem-solving methodology",
    tags: ["debugging", "troubleshooting", "methodology", "problem-solving"],

    solves: [
      {
        problem: "How do I debug efficiently without wasting time?",
        keywords: ["debugging", "efficiency", "systematic", "methodology"],
      },
      {
        problem: "I keep making random changes hoping something works",
        keywords: ["shotgun debugging", "random changes", "trial and error"],
      },
      {
        problem: "How do I isolate the root cause of a bug?",
        keywords: ["root cause", "isolation", "bug tracking"],
      },
    ],

    relationships: {
      recommends: [
        "technology/typescript/error-handling",
        "principle/testing/test-driven-development",
        "foundation/analysis/root-cause-analysis",
      ],
    },

    quality: {
      maturity: "stable",
      confidence: 0.95,
    },
  },

  components: [
    {
      type: ComponentType.Instruction,
      metadata: {
        id: "react-debugging-cycle",
        purpose: "Core debugging methodology",
        context: ["bug-fixing", "troubleshooting", "error-investigation"],
      },
      instruction: {
        purpose:
          "Debug systematically using observe-reason-act cycles to isolate root causes efficiently",

        process: [
          {
            step: "OBSERVE: Examine error state",
            detail:
              "Gather concrete evidence about the failure. Read error messages completely, check logs, inspect variable values, note the execution path.",
            validate: {
              check:
                "Evidence collected from actual system behavior, not assumptions",
              severity: "error",
            },
          },
          {
            step: "REASON: Form hypothesis",
            detail:
              "Based ONLY on observations, what could cause this behavior? Generate 2-3 hypotheses ranked by likelihood.",
            validate: {
              check:
                "Hypotheses are falsifiable and based on observed evidence",
              severity: "error",
            },
            when: "After gathering sufficient observations",
          },
          {
            step: "ACT: Test hypothesis",
            detail:
              "Design minimal experiment to test hypothesis: add logging, write failing test, make isolated change, or use debugger.",
            validate: {
              check:
                "Change is minimal, reversible, and tests only one hypothesis",
              severity: "error",
            },
          },
          {
            step: "OBSERVE: Check results",
            detail:
              "Execute the experiment and observe what actually happens. Did behavior change as predicted? What new information emerged?",
            when: "After each action",
            validate: {
              check: "Results documented before making additional changes",
              severity: "error",
            },
          },
          {
            step: "ITERATE or CONCLUDE",
            detail:
              "If bug persists: return to OBSERVE with new information. If bug resolved: verify fix and document root cause.",
            when: "After observing results",
          },
        ],

        constraints: [
          {
            rule: "NEVER make multiple changes without observing results",
            severity: "error",
            rationale:
              "Multiple simultaneous changes make it impossible to know which change had what effect",
            examples: {
              valid: ["Add logging, run test, observe output"],
              invalid: [
                "Change algorithm AND update config AND modify data structure, then test",
              ],
            },
          },
          {
            rule: "ALWAYS gather evidence before forming hypothesis",
            severity: "error",
            rationale: "Assumptions lead to wasted effort on wrong hypotheses",
            examples: {
              valid: ["Read stack trace, check logs, then hypothesize"],
              invalid: ["Assume it's a race condition, start adding locks"],
            },
          },
          {
            rule: "Document failed hypotheses to avoid repeating them",
            severity: "warning",
            rationale: "Prevents wasting time re-testing disproven theories",
          },
          {
            rule: "Make changes reversible (use version control, feature flags)",
            severity: "error",
            rationale: "Must be able to undo experiments cleanly",
          },
          {
            rule: "When stuck for 15+ minutes, ask for help or take a break",
            severity: "warning",
            rationale:
              "Diminishing returns after sustained unproductive effort",
          },
        ],

        principles: [
          "Minimize state changes between observations",
          "Test one hypothesis at a time",
          "Build understanding incrementally",
          "Trust evidence over intuition",
          "Document the debugging journey",
          "Simplify the reproduction case",
        ],

        criteria: [
          {
            item: "Did I observe before acting?",
            severity: "critical",
          },
          {
            item: "Was my hypothesis based on evidence?",
            severity: "critical",
          },
          {
            item: "Did I test only one thing at a time?",
            severity: "critical",
          },
          {
            item: "Did I document what I learned?",
            severity: "important",
          },
          {
            item: "Can I reproduce the bug consistently?",
            severity: "important",
          },
          {
            item: "Did I verify the fix actually works?",
            severity: "critical",
          },
        ],
      },
    },

    {
      type: ComponentType.Knowledge,
      metadata: {
        id: "debugging-patterns",
        purpose: "Common debugging strategies and when to use them",
      },
      knowledge: {
        explanation: `Systematic debugging applies the ReAct reasoning pattern (Observe → Reason → Act → Observe) to bug isolation. This methodology treats debugging as scientific hypothesis testing: gather evidence, form testable hypotheses, run experiments, and iterate based on results. The key insight is that debugging is not random trial-and-error but a structured investigation process.`,

        concepts: [
          {
            name: "Hypothesis-Driven Debugging",
            description:
              "Treat each potential cause as a falsifiable hypothesis that can be tested through observation",
            rationale:
              "Scientific method prevents wasted effort on unproductive approaches",
            examples: [
              'Hypothesis: "API call is timing out due to slow database query"',
              "Test: Add timing logs around database call",
              "Observation: Database call completes in 50ms, but network latency is 5s",
              "Conclusion: Hypothesis false, problem is network not database",
            ],
          },
          {
            name: "Minimal Reproducible Example",
            description:
              "Reduce the problem to the smallest code that demonstrates the bug",
            rationale: "Simpler cases are easier to understand and test",
            examples: [
              "Start with full application",
              "Remove features one at a time until bug disappears",
              "Last removed feature contains the bug",
            ],
          },
          {
            name: "Binary Search Debugging",
            description:
              "When bug is somewhere in a long execution path, test the middle, then recursively narrow",
            rationale: "O(log n) vs O(n) search time",
            examples: [
              "1000-line function has bug",
              "Add assertion at line 500",
              "If assertion passes, bug is after line 500",
              "If assertion fails, bug is before line 500",
              "Repeat until isolated",
            ],
          },
          {
            name: "Rubber Duck Debugging",
            description:
              "Explain the problem step-by-step to an inanimate object (or person)",
            rationale:
              "Verbalization forces systematic thinking and often reveals overlooked details",
            examples: [
              '"This function should return X, but it returns Y"',
              '"First it does A, then B, then... wait, B depends on C which I never set"',
            ],
          },
        ],

        examples: [
          {
            title: "Systematic Debugging of API Timeout",
            rationale: "Demonstrates full observe-reason-act cycle",
            language: "typescript",
            snippet: `
// OBSERVE: API call times out after 30s
// Error: "Request timeout after 30000ms"

// REASON: Possible causes ranked by likelihood:
// 1. Database query is slow
// 2. External API call is slow
// 3. Network latency
// 4. CPU-intensive computation

// ACT: Test hypothesis 1 (database query)
console.time('database-query');
const result = await db.query('SELECT * FROM users');
console.timeEnd('database-query');
// -> "database-query: 45ms"

// OBSERVE: Database is fast (45ms), hypothesis 1 false

// REASON: Next most likely is external API call
// ACT: Add timing for external API
console.time('external-api');
const data = await fetch('https://external-service.com/data');
console.timeEnd('external-api');
// -> "external-api: 28500ms"

// OBSERVE: External API takes 28.5s! Root cause found.

// ACT: Implement timeout and retry logic
const data = await fetch(url, { timeout: 5000 });
// Bug fixed, verified with tests
            `,
          },
          {
            title: "Binary Search for Bug in Long Function",
            rationale:
              "Shows how to efficiently isolate problem in large codebase",
            language: "typescript",
            snippet: `
// 500 line function, output is wrong somewhere

// ACT: Add checkpoint at line 250
const checkpoint1 = validateData(intermediateResult);
console.log('Checkpoint 1:', checkpoint1);

// OBSERVE: Checkpoint 1 is INVALID
// Bug is in first 250 lines

// ACT: Add checkpoint at line 125
const checkpoint2 = validateData(earlyResult);
console.log('Checkpoint 2:', checkpoint2);

// OBSERVE: Checkpoint 2 is VALID
// Bug is between lines 125-250

// Repeat: Add checkpoint at line 187...
// Result: Bug isolated to lines 175-180
            `,
          },
        ],

        patterns: [
          {
            name: "Log-Driven Debugging",
            useCase:
              "When debugger is not available or problem is intermittent",
            description:
              "Add strategic logging to observe system state at key points",
            advantages: [
              "Works in production",
              "Captures intermittent issues",
              "Provides historical record",
            ],
            disadvantages: [
              "Requires redeployment",
              "Can impact performance",
              "May miss exact failure point",
            ],
          },
          {
            name: "Debugger-Driven Investigation",
            useCase: "When you need to inspect live state and execution flow",
            description:
              "Set breakpoints and step through code examining variables",
            advantages: [
              "Immediate feedback",
              "Can inspect any variable",
              "Can modify values to test",
            ],
            disadvantages: [
              "Only works in development",
              "Can be slow for large datasets",
              "May miss timing-related bugs",
            ],
          },
          {
            name: "Test-Driven Debugging",
            useCase: "When bug is reproducible",
            description:
              "Write failing test that demonstrates bug, then fix until test passes",
            advantages: [
              "Proves bug is fixed",
              "Prevents regression",
              "Forces minimal reproduction",
            ],
            disadvantages: [
              "Requires test infrastructure",
              "May be hard for complex bugs",
            ],
          },
        ],
      },
    },

    {
      type: ComponentType.Data,
      metadata: {
        id: "debugging-checklist",
      },
      data: {
        format: "json",
        description: "Quick reference checklist for systematic debugging",
        value: {
          before_starting: [
            "Can you reproduce the bug consistently?",
            "What is the expected behavior?",
            "What is the actual behavior?",
            "What changed recently that might have caused this?",
          ],
          observe_phase: [
            "Read the complete error message",
            "Check logs for related errors",
            "Identify the failing test or operation",
            "Note the execution path to failure",
            "Inspect variable values at failure point",
          ],
          reason_phase: [
            "List 2-3 possible causes based on evidence",
            "Rank hypotheses by likelihood",
            "Identify what would falsify each hypothesis",
            "Choose most testable hypothesis first",
          ],
          act_phase: [
            "Design minimal experiment (logging, test, change)",
            "Ensure change is reversible",
            "Test only one hypothesis",
            "Avoid changing multiple things",
          ],
          after_observing: [
            "Document what you learned",
            "Update hypothesis ranking",
            "Decide: iterate or conclude?",
          ],
          when_stuck: [
            "Take a 5-minute break",
            "Explain problem to someone (rubber duck)",
            "Simplify the reproduction case",
            "Ask for a second pair of eyes",
            "Check if someone else solved this (search issues)",
          ],
          after_fixing: [
            "Verify fix with tests",
            "Document root cause",
            "Add regression test",
            "Review if similar bugs exist elsewhere",
          ],
        },
      },
    },
  ],
};
```

---

## Examples

### Example 1: Using the Module in a Backend Developer Persona

```typescript
export default {
  name: "Backend Developer",
  modules: [
    "foundation/ethics/do-no-harm",
    "principle/testing/test-driven-development",
    "execution/debugging/systematic-debugging", // ← Adds structured debugging
    "technology/typescript/error-handling",
    "principle/architecture/clean-architecture",
  ],
} satisfies Persona;
```

### Example 2: Selective Inclusion for Quick Reference

```typescript
// Senior developer needs just the process, not the full knowledge
export default {
  name: "Senior Backend Engineer",
  modules: [
    "foundation/ethics/do-no-harm",
    {
      id: "execution/debugging/systematic-debugging",
      include: { components: ["instruction"] }, // Just the steps and constraints
    },
  ],
} satisfies Persona;
```

### Example 3: Full Module for Junior Developer

```typescript
// Junior developer needs everything: process, theory, examples
export default {
  name: "Junior Developer",
  modules: [
    "execution/debugging/systematic-debugging", // All components
    "principle/testing/test-driven-development",
    "technology/typescript/typescript-fundamentals",
  ],
} satisfies Persona;
```

### Example 4: Debugging-Focused Persona

```typescript
export default {
  name: "Debugging Specialist",
  modules: [
    "execution/debugging/systematic-debugging",
    "foundation/analysis/root-cause-analysis",
    "technology/observability/logging-best-practices",
    "technology/testing/debugging-with-tests",
  ],
} satisfies Persona;
```

---

## Implementation Details

### Module Location

```
instruct-modules-v2/
└── modules/
    └── execution/
        └── debugging/
            └── systematic-debugging.module.ts
```

### Tier Justification

**Execution tier** (not Principle or Foundation) because:

- Focused on concrete debugging workflow
- Provides specific procedures and steps
- Applied practice, not abstract theory
- Belongs with other playbooks (deployment, monitoring)

### Component Design

**Three components support selective inclusion:**

1. **Instruction Component** (`react-debugging-cycle`):
   - Core debugging process
   - Constraints and validation
   - Principles and criteria
   - Use alone for quick reference

2. **Knowledge Component** (`debugging-patterns`):
   - Detailed explanations
   - Common patterns (binary search, rubber duck, etc.)
   - Examples and use cases
   - Use for learning/teaching

3. **Data Component** (`debugging-checklist`):
   - Quick reference checklist
   - Structured JSON for easy parsing
   - Can be used by tools/scripts
   - Useful as standalone reference

### Validation Rules

When this module is used in a persona:

- No validation errors (always valid)
- May warn if used without `error-handling` or `testing` modules (recommended pairs)

### Integration with Existing Modules

**Recommends (works well with):**

- `technology/*/error-handling` - Complements debugging with proper error patterns
- `principle/testing/test-driven-development` - TDD naturally includes debugging
- `foundation/analysis/root-cause-analysis` - Deeper analysis techniques
- `technology/observability/logging` - Provides observability infrastructure

**Conflicts with**: None (debugging is universally applicable)

---

## Alternatives Considered

### Alternative 1: Generic "ReAct Pattern" Module

**Approach**: Create `foundation/reasoning/react.module.ts` that just describes the ReAct pattern

```typescript
{
  id: 'foundation/reasoning/react',
  instruction: { purpose: 'Use observe-reason-act cycles' }
}
```

**Pros:**

- More general, could apply to many domains
- Single module for the reasoning pattern

**Cons:**

- Too abstract to be actionable
- Doesn't include debugging-specific knowledge
- No constraints or validation specific to debugging
- Doesn't teach HOW to apply ReAct to debugging
- AI already knows what ReAct is in general

**Verdict**: Rejected. Too generic, doesn't add value over saying "use ReAct"

### Alternative 2: Inline Debugging Guidance

**Approach**: Include debugging guidance directly in each persona that needs it

```typescript
export default {
  name: "Backend Developer",
  identity: `You are a backend developer who debugs systematically:
    1. Observe error state first
    2. Form hypothesis from evidence
    3. Test one change at a time
    4. Observe results before continuing...`,
};
```

**Pros:**

- No need for new module
- Customizable per persona

**Cons:**

- Duplicated across many personas
- Hard to maintain (update 50 personas when debugging practices improve)
- Can't be selectively included
- Doesn't compose with other modules
- No reusability

**Verdict**: Rejected. Not scalable or maintainable

### Alternative 3: Multiple Small Debugging Modules

**Approach**: Create separate modules for each debugging technique

```typescript
"execution/debugging/binary-search-debugging";
"execution/debugging/log-driven-debugging";
"execution/debugging/hypothesis-testing";
// ... 10 separate modules
```

**Pros:**

- Maximum granularity
- Can pick exactly what you need

**Cons:**

- Module proliferation (10+ modules for one workflow)
- Harder to discover the right modules
- Fragments the debugging methodology
- Loses coherence of the ReAct cycle

**Verdict**: Rejected. Over-engineering, fragments a coherent methodology

### Alternative 4: "Debugging Fundamentals" in Principle Tier

**Approach**: Make this a principle-tier module about debugging methodology

```typescript
{
  id: 'principle/debugging/debugging-fundamentals',
  // ...
}
```

**Pros:**

- Could be seen as a general principle

**Cons:**

- Principle tier is for abstract patterns, not concrete playbooks
- This is procedural "how to debug" not conceptual "what makes good debugging"
- Execution tier is correct for step-by-step workflows

**Verdict**: Rejected. Execution tier is the right fit

---

## Drawbacks and Risks

### Complexity

**Risk**: Module is long (~200 lines) and might be overwhelming

**Mitigation**:

- Clear component separation (instruction/knowledge/data)
- Selective inclusion allows using just what's needed
- Quick reference checklist provides TL;DR
- Examples show practical application

### Not Universally Applicable

**Risk**: Some debugging scenarios don't fit the ReAct cycle (e.g., debugging race conditions, hardware issues)

**Mitigation**:

- Module is for software debugging, not hardware
- ReAct cycle is flexible enough for most software bugs
- Additional specialized debugging modules can be created later
- Module can be omitted from personas where not applicable

### May Slow Down Expert Developers

**Risk**: Experts may find the structured approach too rigid

**Mitigation**:

- Selective inclusion: experts can use just the `instruction` component
- Constraints are guidance, not hard rules (though AI should follow them)
- Experts know when to break rules; module teaches juniors good habits

### Maintenance Burden

**Risk**: Debugging best practices evolve, module needs updates

**Mitigation**:

- Single source of truth is easier to maintain than scattered inline guidance
- Version tracking enables controlled updates
- Community can contribute improvements via PRs

---

## Migration Path

### Adoption Strategy

**Phase 1: Add to Standard Library**

- Implement module in `instruct-modules-v2/modules/execution/debugging/`
- Add comprehensive tests
- Document in module authoring guide

**Phase 2: Update Example Personas**

- Add to relevant example personas (backend-dev, full-stack, etc.)
- Show both full and selective inclusion examples

**Phase 3: Community Adoption**

- Announce new module
- Gather feedback from real usage
- Iterate based on practical experience

### Backward Compatibility

- **No breaking changes**: New module, doesn't affect existing personas
- **Opt-in**: Personas must explicitly include this module
- **Gradual adoption**: Can be added to personas incrementally

---

## Success Metrics

1. **Adoption**:
   - 20%+ of new personas include this module within 3 months
   - 50%+ of debugging-related personas include it within 6 months

2. **Effectiveness**:
   - User feedback indicates improved debugging efficiency
   - Fewer "I'm stuck" reports in debugging scenarios
   - Positive sentiment in reviews

3. **Reusability**:
   - Module used across multiple persona types (backend, frontend, full-stack)
   - Selective inclusion used (not just all-or-nothing)

4. **Quality**:
   - No major bugs or issues reported
   - Community contributions (improvements, examples)
   - High satisfaction rating (>80%)

---

## Open Questions

1. **Should we create debugging modules for specific technologies?**
   - E.g., `technology/typescript/debugging-typescript`, `technology/react/debugging-react`
   - Or keep this generic and let technology modules add domain-specific tips?
   - **Leaning toward**: Keep this generic, create specialized modules if demand emerges

2. **Should the Data component be more structured?**
   - Could provide machine-readable debugging workflow
   - Could integrate with tooling (IDE plugins, CI/CD)
   - **Leaning toward**: Start simple (JSON checklist), expand if tooling integration emerges

3. **How do we handle debugging in production vs. development?**
   - Different constraints (can't use debugger in production)
   - Should this be one module or two?
   - **Leaning toward**: One module, with context-aware guidance in the knowledge component

4. **Should we include performance debugging specifically?**
   - Performance debugging has different patterns (profiling, benchmarking)
   - **Leaning toward**: This module covers functional bugs; create separate `performance-debugging` module later if needed

---

## References

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) - Yao et al., 2022
- [UMS v2.0 Specification](../unified_module_system_v2_spec.md)
- [Module Authoring Guide](../../unified-module-system/12-module-authoring-guide.md)
- [Execution Tier Modules](../../unified-module-system/05-execution-tier.md)

---

## Appendix: Why Not Just "Debug Systematically"?

This section addresses the core question: **Why can't this just be a simple instruction?**

### Comparison

| Simple Instruction            | This Module                                                    |
| ----------------------------- | -------------------------------------------------------------- |
| "Debug systematically"        | ✅ Defines what "systematic" means (5-step ReAct cycle)        |
| "Use ReAct pattern"           | ✅ Shows HOW to apply ReAct to debugging specifically          |
| "Don't make multiple changes" | ✅ Enforces constraint with severity levels and rationale      |
| "Gather evidence first"       | ✅ Provides validation criteria for evidence quality           |
|                               | ✅ Teaches debugging patterns (binary search, rubber duck)     |
|                               | ✅ Includes examples showing the full cycle                    |
|                               | ✅ Provides checklist for quick reference                      |
|                               | ✅ Can be selectively included (instruction vs. full learning) |
|                               | ✅ Composes with other modules (testing, error-handling)       |
|                               | ✅ Single source of truth (maintainable)                       |

### The Value Proposition

**Simple instruction says WHAT to do.**
**This module teaches HOW to do it, WHY it matters, and WHEN to apply specific techniques.**

Without this module, every persona that needs systematic debugging must either:

1. Include verbose inline guidance (unmaintainable)
2. Hope the AI figures it out (inconsistent)
3. Omit debugging guidance (incomplete)

With this module:

- ✅ Consistent debugging methodology across all personas
- ✅ Teachable structure for junior developers
- ✅ Quick reference for senior developers
- ✅ Evolvable as debugging practices improve
- ✅ Composable with other modules

---

## Changelog

- **2025-10-14**: Initial draft based on discussion of applied reasoning patterns
