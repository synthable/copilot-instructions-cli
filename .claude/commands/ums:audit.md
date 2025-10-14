# Command: /ums:audit

Run comprehensive quality audit on all modules and personas.

## Execution Workflow

```yaml
step_1_parse_scope:
  action: Determine audit scope
  patterns:
    full_audit: (no args) | all | --all
    modules_only: --modules-only | modules
    personas_only: --personas-only | personas
    with_metrics: --with-metrics (includes library metrics)
  default_if_empty: full_audit
  output: audit_scope

step_2_discover_files:
  action: Find all relevant files based on scope
  operations:
    if_modules_or_full:
      glob: instruct-modules-v2/modules/**/*.module.ts
      output: module_files
    if_personas_or_full:
      glob: instruct-modules-v2/personas/*.persona.ts
      output: persona_files
  output: file_inventory

step_3_parallel_validation:
  action: Launch validators in parallel
  gate: file_inventory must not be empty
  agents:
    module_validator:
      condition: if module_files exist
      agent: ums-v2-module-validator
      input: module_files
      output: module_results
    persona_validator:
      condition: if persona_files exist
      agent: ums-v2-persona-validator
      input: persona_files
      output: persona_results
  execution: parallel (single message, multiple Task calls)
  output: validation_results

step_4_analyze_relationships:
  action: Verify module and persona relationships
  checks:
    module_dependencies:
      - all requires references valid
      - all recommends references valid
      - no circular dependencies
    persona_composition:
      - all module references valid
      - no duplicate module IDs
  output: relationship_analysis

step_5_compute_metrics:
  action: Calculate library quality metrics
  condition: if --with-metrics flag set
  metrics:
    coverage_by_tier:
      - foundation: count/target (%)
      - principle: count/target (%)
      - technology: count/target (%)
      - execution: count/target (%)
    quality_indicators:
      - average_confidence: sum(confidence)/count
      - modules_with_quality_metadata: count/%
      - average_semantic_length: avg(chars)
  output: library_metrics

step_6_synthesize_report:
  action: Generate comprehensive audit report
  template: audit_report_template
  inputs:
    - module_results
    - persona_results
    - relationship_analysis
    - library_metrics (if available)
  output: audit_report

step_7_generate_recommendations:
  action: Provide prioritized action items
  prioritization:
    high: critical_errors (blocking)
    medium: warnings (quality)
    low: enhancements (nice-to-have)
  output: action_items
```

## Scope Selection Decision Tree

```yaml
scope_selection:
  no_arguments:
    condition: command has no args
    action: full_audit
    scope: [modules, personas, relationships, metrics]

  flag_all:
    condition: --all flag present
    action: full_audit
    scope: [modules, personas, relationships, metrics]

  flag_modules_only:
    condition: --modules-only flag present
    action: modules_audit
    scope: [modules, relationships.module_dependencies]

  flag_personas_only:
    condition: --personas-only flag present
    action: personas_audit
    scope: [personas, relationships.persona_composition]

  flag_with_metrics:
    condition: --with-metrics flag present
    action: full_audit_with_metrics
    scope: [modules, personas, relationships, detailed_metrics]

  invalid_flag:
    condition: unknown flag
    action: show_usage
    output: error_with_examples
```

## Agent Invocation Templates

### Parallel Module and Persona Validation

```typescript
// Launch both validators in parallel (single message)
[
  Task(
    subagent_type: "ums-v2-module-validator",
    description: "Validate all modules for audit",
    prompt: `Validate all modules in: instruct-modules-v2/modules/

For each module:
- Full spec compliance check
- Quality assessment
- Relationship validation

Summary output format:
{
  total: number,
  by_tier: { foundation: {pass, warn, fail}, ... },
  pass_count: number,
  warning_count: number,
  fail_count: number,
  issues: [{
    module_id: string,
    status: "PASS|WARNINGS|FAIL",
    problems: string[],
    quality_score: number
  }],
  relationship_errors: [{
    module_id: string,
    invalid_references: string[]
  }]
}

Include:
- List of modules with warnings
- List of modules with errors
- Specific issues and fixes`
  ),

  Task(
    subagent_type: "ums-v2-persona-validator",
    description: "Validate all personas for audit",
    prompt: `Validate all personas in: instruct-modules-v2/personas/

For each persona:
- Structure compliance
- Module reference validation
- Composition quality assessment

Summary output format:
{
  total: number,
  pass_count: number,
  warning_count: number,
  fail_count: number,
  issues: [{
    persona_name: string,
    status: "PASS|WARNINGS|FAIL",
    problems: string[],
    quality_score: number
  }],
  composition_analysis: [{
    persona_name: string,
    module_count: number,
    tier_distribution: { foundation: number, ... },
    missing_modules: string[],
    recommendations: string[]
  }]
}

Include:
- Personas with quality issues
- Module reference errors
- Composition recommendations`
  )
]
```

### Modules-Only Validation

```typescript
Task(
  subagent_type: "ums-v2-module-validator",
  description: "Audit modules only",
  prompt: `Validate all modules in: instruct-modules-v2/modules/

Comprehensive checks:
- Spec compliance (UMS v2.0)
- Required fields validation
- Export conventions
- Component structure
- Metadata quality
- Relationship integrity (requires/recommends)

Output:
{
  total: number,
  by_tier: {
    foundation: { total, pass, warn, fail },
    principle: { total, pass, warn, fail },
    technology: { total, pass, warn, fail },
    execution: { total, pass, warn, fail }
  },
  issues: [{
    module_id,
    tier,
    status,
    problems,
    fixes,
    quality_score
  }],
  relationship_errors: [{
    module_id,
    invalid_refs
  }]
}

Focus on actionable issues.`
)
```

### Personas-Only Validation

```typescript
Task(
  subagent_type: "ums-v2-persona-validator",
  description: "Audit personas only",
  prompt: `Validate all personas in: instruct-modules-v2/personas/

Comprehensive checks:
- Persona structure
- Module references valid
- No duplicates
- Group structure
- Composition balance
- Build compatibility

Output:
{
  total: number,
  personas: [{
    name,
    status,
    module_count,
    tier_distribution,
    quality_score,
    issues,
    recommendations
  }],
  global_issues: {
    missing_modules: string[],
    common_problems: string[]
  }
}

Assess composition quality.`
)
```

## Output Templates

### Full Audit Report Template

```markdown
# 📊 UMS v2.0 Quality Audit Report

**Date**: ${timestamp}
**Scope**: ${audit_scope}
**Duration**: ${duration_ms}ms

## Executive Summary

**Overall Health**: ${overall_status} (${compliance_percent}% compliance)

- **Modules**: ${module_total} total (✅ ${module_pass}, ⚠️ ${module_warn}, ❌ ${module_fail})
- **Personas**: ${persona_total} total (✅ ${persona_pass}, ⚠️ ${persona_warn}, ❌ ${persona_fail})
- **Average Quality**: ${avg_quality}/10
- **Spec Compliance**: ${spec_compliance_percent}%

---

## Module Audit Results

**Total**: ${module_total} modules across 4 tiers

### By Tier:

- **Foundation**: ${foundation_count} modules (✅ ${foundation_pass}, ⚠️ ${foundation_warn}, ❌ ${foundation_fail})
- **Principle**: ${principle_count} modules (✅ ${principle_pass}, ⚠️ ${principle_warn}, ❌ ${principle_fail})
- **Technology**: ${technology_count} modules (✅ ${technology_pass}, ⚠️ ${technology_warn}, ❌ ${technology_fail})
- **Execution**: ${execution_count} modules (✅ ${execution_pass}, ⚠️ ${execution_warn}, ❌ ${execution_fail})

### Issues Found:

${if module_fails.length > 0}
**Critical Errors** (${module_fails.length}):

${module_fails.map((m, i) => `
${i+1}. \`${m.module_id}\` (${m.tier})
   ${m.problems.map(p => `- ${p.issue}\n     **Fix**: ${p.fix}`).join('\n   ')}
`).join('\n')}
${endif}

${if module_warnings.length > 0}
**Warnings** (${module_warnings.length}):

${module_warnings.map((m, i) => `
${i+1}. \`${m.module_id}\` (${m.tier})
   ${m.problems.map(p => `- ${p.issue}\n     **Recommendation**: ${p.recommendation}`).join('\n   ')}
`).join('\n')}
${endif}

${if module_fails.length === 0 && module_warnings.length === 0}
**No issues found** ✅
${endif}

---

## Persona Audit Results

**Total**: ${persona_total} personas

### Status:

${persona_results.map(p => `
- **${p.name}**: ${p.quality_score}/10 ${p.status === 'PASS' ? '✅' : p.status === 'WARNINGS' ? '⚠️' : '❌'}
  - Modules: ${p.module_count}
  - Tier Distribution: F:${p.tier_dist.foundation} P:${p.tier_dist.principle} T:${p.tier_dist.technology} E:${p.tier_dist.execution}
`).join('')}

### Issues Found:

${if persona_fails.length > 0}
**Critical Errors** (${persona_fails.length}):

${persona_fails.map((p, i) => `
${i+1}. **${p.name}**
   ${p.problems.map(pr => `- ${pr}`).join('\n   ')}
`).join('\n')}
${endif}

${if persona_warnings.length > 0}
**Warnings** (${persona_warnings.length}):

${persona_warnings.map((p, i) => `
${i+1}. **${p.name}**
   ${p.problems.map(pr => `- ${pr}`).join('\n   ')}
   **Recommendations**:
   ${p.recommendations.map(r => `- ${r}`).join('\n   ')}
`).join('\n')}
${endif}

${if persona_fails.length === 0 && persona_warnings.length === 0}
**No issues found** ✅
${endif}

---

## Relationship Integrity

**Module Dependencies**:

- All \`requires\` references valid: ${module_requires_valid ? '✅' : '❌'}
- All \`recommends\` references valid: ${module_recommends_valid ? '✅' : '❌'}
- No circular dependencies: ${no_circular_deps ? '✅' : '❌'}

${if relationship_errors.module_deps.length > 0}
**Issues**:
${relationship_errors.module_deps.map(e => `
- \`${e.module_id}\`: Invalid reference to \`${e.invalid_ref}\`
`).join('')}
${endif}

**Persona Composition**:

- All module references valid: ${persona_refs_valid ? '✅' : '❌'}
- No duplicate module IDs: ${no_duplicate_modules ? '✅' : '❌'}

${if relationship_errors.persona_comp.length > 0}
**Issues**:
${relationship_errors.persona_comp.map(e => `
- **${e.persona_name}**: ${e.problem}
`).join('')}
${endif}

---

${if metrics_included}
## Library Metrics

**Coverage by Tier**:

| Tier | Current | Target | Coverage |
|------|---------|--------|----------|
| Foundation | ${metrics.foundation.current} | ${metrics.foundation.target} | ${metrics.foundation.percent}% |
| Principle | ${metrics.principle.current} | ${metrics.principle.target} | ${metrics.principle.percent}% |
| Technology | ${metrics.technology.current} | ${metrics.technology.target} | ${metrics.technology.percent}% |
| Execution | ${metrics.execution.current} | ${metrics.execution.target} | ${metrics.execution.percent}% |

**Quality Indicators**:

- **Average Confidence**: ${metrics.avg_confidence}/1.0
- **Modules with Quality Metadata**: ${metrics.quality_metadata_count}/${module_total} (${metrics.quality_metadata_percent}%)
- **Average Semantic Length**: ${metrics.avg_semantic_length} chars (target: 100+)
- **Modules with Examples**: ${metrics.modules_with_examples}/${module_total} (${metrics.examples_percent}%)

---

${endif}

## Recommendations

### High Priority (Critical):

${high_priority_items.length > 0 ? high_priority_items.map((item, i) => `
${i+1}. ❌ ${item.issue}
   - **Impact**: ${item.impact}
   - **Action**: ${item.action}
   - **Command**: \`${item.command}\`
`).join('\n') : 'None - No critical issues ✅'}

### Medium Priority (Quality):

${medium_priority_items.length > 0 ? medium_priority_items.map((item, i) => `
${i+1}. ⚠️ ${item.issue}
   - **Impact**: ${item.impact}
   - **Action**: ${item.action}
   - **Command**: \`${item.command}\`
`).join('\n') : 'None - Quality standards met ✅'}

### Low Priority (Enhancement):

${low_priority_items.length > 0 ? low_priority_items.map((item, i) => `
${i+1}. 📈 ${item.suggestion}
   - **Benefit**: ${item.benefit}
   - **Action**: ${item.action}
`).join('\n') : 'None'}

---

## Action Items

${if high_priority_items.length > 0 || medium_priority_items.length > 0}
**Immediate Actions**:

```bash
${action_commands.map(cmd => cmd).join('\n')}
```

**Next Steps**:

1. ${next_steps.map(step => step).join('\n')}
${else}
**No immediate action required** ✅

Library is in excellent health. Consider:
- Expanding coverage (current: ${module_total}, target: ${target_module_count})
- Enhancing metadata quality
- Adding more examples
${endif}

---

## Conclusion

${conclusion_status_emoji} **Library Status**: ${library_status}

${conclusion_summary}

Key Metrics:
- **Spec Compliance**: ${spec_compliance_percent}%
- **Critical Errors**: ${critical_error_count}
- **Average Quality**: ${avg_quality}/10
- **Relationship Integrity**: ${relationship_integrity_status}

${conclusion_recommendation}
```

### Modules-Only Report Template

```markdown
# 📚 Module Audit Report

**Modules Validated**: ${module_total}
**Status**: ${overall_status}

## Summary

- ✅ ${pass_count} modules pass
- ⚠️ ${warning_count} modules have warnings
- ❌ ${fail_count} modules have errors

## By Tier

${tier_summary}

## Issues

${issues_list}

## Action Items

```bash
${action_commands}
```
```

### Personas-Only Report Template

```markdown
# 👥 Persona Audit Report

**Personas Validated**: ${persona_total}
**Status**: ${overall_status}

## Summary

- ✅ ${pass_count} personas pass
- ⚠️ ${warning_count} personas have warnings
- ❌ ${fail_count} personas have errors

## Personas

${persona_details}

## Composition Analysis

${composition_analysis}

## Action Items

```bash
${action_commands}
```
```

## Error Handling Templates

### No Files Found

```markdown
⚠️ **No files found for audit**

Searched:
- Modules: instruct-modules-v2/modules/**/*.module.ts
- Personas: instruct-modules-v2/personas/*.persona.ts

Possible reasons:
1. Empty library (no modules/personas created yet)
2. Wrong directory structure
3. Incorrect file extensions

Try:
- Create modules: /ums:create module
- Create personas: /ums:create persona
- Validate paths in modules.config.yml
```

### Validation Failed

```markdown
❌ **Audit validation failed**

Error: ${error_message}

Troubleshooting:
1. Check file permissions
2. Verify UMS v2.0 format
3. Run individual validations:
   - /ums:validate-module all
   - /ums:validate-persona all
4. Check for TypeScript errors

Need help? Share the error details.
```

## Usage Examples

```yaml
examples:
  full_audit:
    command: /ums:audit
    flow:
      - scope: full (modules + personas + relationships)
      - discover: all .module.ts and .persona.ts files
      - validate: parallel execution (both agents)
      - analyze: relationships and dependencies
      - synthesize: comprehensive report
      - recommend: prioritized action items
    output: full_audit_report

  full_audit_explicit:
    command: /ums:audit all
    flow: same as full_audit

  modules_only:
    command: /ums:audit --modules-only
    flow:
      - scope: modules only
      - discover: all .module.ts files
      - validate: module-validator agent
      - analyze: module dependencies only
      - synthesize: modules report
      - recommend: module-specific actions
    output: modules_audit_report

  personas_only:
    command: /ums:audit --personas-only
    flow:
      - scope: personas only
      - discover: all .persona.ts files
      - validate: persona-validator agent
      - analyze: persona composition only
      - synthesize: personas report
      - recommend: persona-specific actions
    output: personas_audit_report

  with_metrics:
    command: /ums:audit --with-metrics
    flow:
      - scope: full audit + detailed metrics
      - discover: all files
      - validate: parallel execution
      - analyze: relationships
      - compute: library metrics (coverage, quality indicators)
      - synthesize: comprehensive report with metrics
      - recommend: data-driven action items
    output: audit_report_with_metrics

  combined_flags:
    command: /ums:audit --modules-only --with-metrics
    flow:
      - scope: modules + metrics
      - discover: all .module.ts files
      - validate: module-validator agent
      - analyze: module dependencies
      - compute: module-specific metrics
      - synthesize: modules report with metrics
      - recommend: module improvements
    output: modules_audit_with_metrics
```

## Metrics Computation Templates

### Coverage Metrics

```typescript
coverage_metrics: {
  by_tier: {
    foundation: {
      current: count(modules where tier === 'foundation'),
      target: 50,
      percent: Math.round((current / target) * 100)
    },
    principle: {
      current: count(modules where tier === 'principle'),
      target: 60,
      percent: Math.round((current / target) * 100)
    },
    technology: {
      current: count(modules where tier === 'technology'),
      target: 100,
      percent: Math.round((current / target) * 100)
    },
    execution: {
      current: count(modules where tier === 'execution'),
      target: 50,
      percent: Math.round((current / target) * 100)
    }
  }
}
```

### Quality Metrics

```typescript
quality_metrics: {
  avg_confidence: sum(modules.map(m => m.quality?.confidence ?? 0.8)) / modules.length,

  quality_metadata_count: count(modules where m.quality exists),
  quality_metadata_percent: Math.round((quality_metadata_count / modules.length) * 100),

  avg_semantic_length: sum(modules.map(m => m.metadata.semantic.length)) / modules.length,

  modules_with_examples: count(modules where hasExamples(m)),
  examples_percent: Math.round((modules_with_examples / modules.length) * 100),

  avg_quality_score: sum(module_results.map(r => r.quality_score)) / module_results.length
}
```

### Relationship Metrics

```typescript
relationship_metrics: {
  total_dependencies: count(all requires/recommends references),
  valid_dependencies: count(valid references),
  invalid_dependencies: count(invalid references),
  circular_dependencies: count(circular refs),

  modules_with_deps: count(modules where requires.length > 0 || recommends.length > 0),
  avg_dependencies_per_module: total_dependencies / modules_with_deps,

  orphaned_modules: count(modules with no incoming or outgoing deps)
}
```

## Recommendation Prioritization

```yaml
prioritization_logic:
  high_priority:
    conditions:
      - critical_errors: module/persona cannot be used
      - blocking_issues: prevents builds
      - security_concerns: ethical/safety violations
      - broken_references: invalid dependencies
    examples:
      - Missing required fields
      - Invalid module references in personas
      - Circular dependencies
      - Broken export conventions

  medium_priority:
    conditions:
      - quality_warnings: usable but suboptimal
      - missing_metadata: incomplete documentation
      - style_violations: convention breaches
      - composition_issues: unbalanced personas
    examples:
      - Missing quality metadata
      - Sparse semantic fields
      - Unbalanced tier distribution
      - Missing examples

  low_priority:
    conditions:
      - enhancements: nice-to-have improvements
      - coverage_gaps: missing modules
      - optimization: performance improvements
      - documentation: additional docs
    examples:
      - Expand standard library
      - Add more examples
      - Improve semantic density
      - Add advanced features
```

## Implementation Checklist

```yaml
checklist:
  - [ ] Parse command flags (--modules-only, --personas-only, --with-metrics)
  - [ ] Determine audit scope
  - [ ] Discover module files (if scope includes modules)
  - [ ] Discover persona files (if scope includes personas)
  - [ ] Handle empty file lists
  - [ ] Launch module-validator agent (parallel if both scopes)
  - [ ] Launch persona-validator agent (parallel if both scopes)
  - [ ] Collect validation results from both agents
  - [ ] Analyze module dependencies (if scope includes modules)
  - [ ] Analyze persona composition (if scope includes personas)
  - [ ] Compute library metrics (if --with-metrics flag)
  - [ ] Synthesize comprehensive report
  - [ ] Prioritize recommendations (high/medium/low)
  - [ ] Generate action commands
  - [ ] Format output with appropriate template
  - [ ] Suggest next steps
```

## Agent Dependencies

- **Primary**: ums-v2-module-validator, ums-v2-persona-validator (parallel execution)
- **Optional**: ums-v2-library-curator (for metrics computation)

## Performance Considerations

```yaml
performance:
  parallel_validation:
    description: Run module and persona validation simultaneously
    implementation: Single message with multiple Task calls
    benefit: 2x faster than sequential

  batch_processing:
    description: Validate all files in single agent call
    implementation: Pass all file paths to agent
    benefit: Reduced overhead vs per-file validation

  metrics_on_demand:
    description: Compute metrics only when --with-metrics flag present
    implementation: Conditional execution
    benefit: Faster default audit

  relationship_caching:
    description: Build module registry once, reuse for all checks
    implementation: Single registry construction
    benefit: O(n) instead of O(n²) for reference validation
```
