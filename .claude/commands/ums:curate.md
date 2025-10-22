# Command: /ums:curate

Manage standard library modules: evaluate, organize, generate metrics, maintain quality.

## Execution Workflow

```yaml
workflow:
  phase_1_parse_arguments:
    action: "Parse command and extract operation type"
    operations: ["add", "remove", "evaluate", "metrics", "organize", "find-gaps", "document"]
    output: "operation_type + target_path/module_id/tier"

  phase_2_route_to_workflow:
    action: "Route to appropriate curation workflow"
    routing_table:
      add: "execute_add_workflow"
      remove: "execute_remove_workflow"
      evaluate: "execute_evaluate_workflow"
      metrics: "execute_metrics_workflow"
      organize: "execute_organize_workflow"
      find-gaps: "execute_gap_analysis_workflow"
      document: "execute_documentation_workflow"

  phase_3_execute:
    action: "Execute selected workflow with ums-v2-standard-library-curator agent"
    output: "operation_result + recommendations"

  phase_4_report:
    action: "Format results using appropriate template"
    output: "formatted_report"
```

## Decision Tree

```typescript
decision_tree: {
  add_module: {
    when: "User provides: /ums:curate add <path>",
    workflow: "add_module_workflow",
    agent: "ums-v2-standard-library-curator",
    validation: "module-validator pre-check required",
    output: "inclusion_decision + rationale + location"
  },

  remove_module: {
    when: "User provides: /ums:curate remove <module-id>",
    workflow: "remove_module_workflow",
    agent: "ums-v2-standard-library-curator",
    safety_check: "verify no personas reference module",
    output: "removal_confirmation + impact_report"
  },

  evaluate_module: {
    when: "User provides: /ums:curate evaluate <path>",
    workflow: "evaluate_module_workflow",
    agent: "ums-v2-standard-library-curator",
    output: "quality_assessment + recommendation (approve/reject/revise)"
  },

  generate_metrics: {
    when: "User provides: /ums:curate metrics [tier]",
    workflow: "metrics_generation_workflow",
    agent: "ums-v2-standard-library-curator",
    scope: "all_tiers or specified_tier",
    output: "comprehensive_metrics + gap_analysis + recommendations"
  },

  organize_tier: {
    when: "User provides: /ums:curate organize <tier>",
    workflow: "organization_workflow",
    agent: "ums-v2-standard-library-curator",
    scope: "specified_tier",
    output: "reorganization_plan + misplaced_modules + quality_issues"
  },

  find_gaps: {
    when: "User provides: /ums:curate find-gaps [tier]",
    workflow: "gap_analysis_workflow",
    agent: "ums-v2-standard-library-curator",
    analysis: "coverage_gaps + missing_capabilities + priority_suggestions",
    output: "gap_report + module_recommendations"
  },

  document_library: {
    when: "User provides: /ums:curate document [tier]",
    workflow: "documentation_workflow",
    agent: "ums-v2-standard-library-curator",
    output: "library_overview + tier_summaries + usage_guide"
  }
}
```

## Agent Invocation Templates

### Add Module Workflow

```typescript
Task(
  subagent_type: "ums-v2-standard-library-curator",
  description: "Evaluate and add module to standard library",
  prompt: `OPERATION: Add module to standard library

TARGET: {module_path}

WORKFLOW:
1. Load module using SDK ModuleLoader
2. Execute evaluation checklist
3. Generate inclusion decision
4. If approved: copy to standard library location
5. Update library catalog
6. Generate confirmation report

EVALUATION_CHECKLIST:
- quality_score: Score 0-10 using quality rubric
- applicability: Assess usefulness across use cases
- completeness: Check documentation and examples
- uniqueness: Verify fills gap or improves existing
- relationships: Validate dependencies and recommendations
- tier_appropriateness: Confirm correct tier placement
- cognitive_level: Verify if foundation module (0-4)

OUTPUT: Use add_module_report_template

DECISION_THRESHOLD: quality_score >= 7, no critical gaps`
)
```

### Remove Module Workflow

```typescript
Task(
  subagent_type: "ums-v2-standard-library-curator",
  description: "Remove module from standard library",
  prompt: `OPERATION: Remove module from standard library

TARGET: {module_id}

WORKFLOW:
1. Locate module in standard library
2. Execute impact analysis
3. Check persona references
4. Generate removal plan
5. If safe: remove from library
6. Update library catalog
7. Generate impact report

SAFETY_CHECKS:
- persona_references: Search all .persona.ts files for module_id
- dependent_modules: Check if other modules recommend this one
- usage_frequency: Check historical usage data if available

ABORT_CONDITIONS:
- Module referenced in any persona (must remove references first)
- Module is dependency of other modules

OUTPUT: Use remove_module_report_template`
)
```

### Evaluate Module Workflow

```typescript
Task(
  subagent_type: "ums-v2-standard-library-curator",
  description: "Evaluate module for library quality",
  prompt: `OPERATION: Evaluate module quality

TARGET: {module_path}

WORKFLOW:
1. Load and validate module structure
2. Apply quality rubric
3. Assess each evaluation criterion
4. Generate recommendation
5. Provide improvement suggestions if needed

QUALITY_RUBRIC:
  structure: 0-10
    - Required fields present (id, version, schemaVersion, metadata)
    - Export naming convention followed
    - Component structure valid

  content: 0-10
    - Clear and actionable instructions/knowledge
    - Appropriate examples
    - Well-defined constraints/criteria

  metadata: 0-10
    - Semantic field keyword-rich
    - Description clear and concise
    - Capabilities accurate and complete

  documentation: 0-10
    - Purpose clearly stated
    - Usage examples provided
    - Edge cases documented

  relationships: 0-10
    - Dependencies accurate
    - Recommendations relevant
    - No circular dependencies

RECOMMENDATION_LOGIC:
  score >= 8: APPROVE - Ready for standard library
  score 6-7: REVISE - Good but needs improvements
  score < 6: REJECT - Significant issues, rework needed

OUTPUT: Use evaluation_report_template`
)
```

### Metrics Generation Workflow

```typescript
Task(
  subagent_type: "ums-v2-standard-library-curator",
  description: "Generate comprehensive library metrics",
  prompt: `OPERATION: Generate library metrics

SCOPE: {tier_filter | "all"}

WORKFLOW:
1. Discover all modules in scope using SDK
2. Load each module and extract metadata
3. Calculate metrics using metrics_template
4. Identify gaps and patterns
5. Generate recommendations
6. Format using metrics_report_template

METRICS_TO_CALCULATE:
  distribution:
    - total_modules: Count by tier
    - cognitive_levels: Distribution for foundation (0-4)
    - tier_breakdown: Modules per tier
    - category_breakdown: Modules per category within tier

  quality:
    - avg_completeness: Average of metadata completeness
    - modules_with_relationships: Count with dependencies/recommendations
    - version_distribution: Modules by version

  coverage:
    - categories_per_tier: List categories in each tier
    - thin_categories: Categories with < 3 modules
    - missing_capabilities: Gaps in capability coverage

  usage:
    - persona_references: How many personas use each module
    - most_referenced: Top 10 most-used modules
    - unused_modules: Modules in no personas

RECOMMENDATIONS:
- Identify thin categories (< 3 modules)
- Suggest missing capabilities
- Highlight quality issues
- Prioritize gap filling

OUTPUT: Use metrics_report_template`
)
```

### Organize Tier Workflow

```typescript
Task(
  subagent_type: "ums-v2-standard-library-curator",
  description: "Organize and assess tier structure",
  prompt: `OPERATION: Organize library tier

TARGET: {tier_name}

WORKFLOW:
1. Discover all modules in tier
2. Validate category structure
3. Check module placement appropriateness
4. Assess quality consistency
5. Identify organizational issues
6. Generate reorganization plan

VALIDATION_CHECKS:
  category_structure:
    - Categories follow naming convention
    - Categories logically grouped
    - No orphaned modules

  module_placement:
    - Module content matches tier purpose
    - Module in correct category
    - Cognitive level appropriate (foundation)

  quality_consistency:
    - All modules meet minimum quality threshold
    - Documentation standards consistent
    - Naming conventions followed

  relationships:
    - Cross-tier dependencies logical
    - No circular dependencies
    - Recommendations valid

ISSUES_TO_IDENTIFY:
- Misplaced modules (wrong tier/category)
- Low-quality modules (score < 6)
- Naming inconsistencies
- Missing category READMEs
- Duplicate functionality

OUTPUT: Use organization_report_template`
)
```

### Gap Analysis Workflow

```typescript
Task(
  subagent_type: "ums-v2-standard-library-curator",
  description: "Identify coverage gaps in library",
  prompt: `OPERATION: Gap analysis

SCOPE: {tier_filter | "all"}

WORKFLOW:
1. Load all modules in scope
2. Extract capabilities and categories
3. Identify patterns and gaps
4. Compare to ideal library structure
5. Prioritize gap filling
6. Generate recommendations

GAP_ANALYSIS_DIMENSIONS:
  capability_gaps:
    - List capabilities in existing modules
    - Identify common capability combinations
    - Find missing capability coverage

  category_gaps:
    - List categories per tier
    - Identify thin categories (< 3 modules)
    - Find missing categories vs. expected taxonomy

  cognitive_gaps (foundation only):
    - Distribution across levels 0-4
    - Identify underrepresented levels

  technology_gaps (technology tier):
    - List covered technologies
    - Compare to popular technology rankings
    - Identify missing major technologies

PRIORITIZATION_CRITERIA:
  priority_high:
    - Major technology/methodology not covered
    - Capability requested in multiple personas
    - Cognitive level underrepresented

  priority_medium:
    - Minor technology/methodology missing
    - Category exists but thin (< 3 modules)

  priority_low:
    - Nice-to-have additions
    - Specialized use cases

OUTPUT: Use gap_analysis_report_template`
)
```

### Documentation Workflow

```typescript
Task(
  subagent_type: "ums-v2-standard-library-curator",
  description: "Generate library documentation",
  prompt: `OPERATION: Generate library documentation

SCOPE: {tier_filter | "all"}

WORKFLOW:
1. Load all modules in scope
2. Generate library overview
3. Create tier summaries
4. Document module relationships
5. Create usage guide
6. Format as markdown

DOCUMENTATION_STRUCTURE:
  library_overview:
    - Total modules by tier
    - Quality metrics summary
    - Recent additions
    - Maintenance status

  tier_summaries (per tier):
    - Purpose of tier
    - Categories and module counts
    - Key modules (most referenced)
    - Quality assessment

  category_guides (per category):
    - Category purpose
    - List of modules with descriptions
    - Usage examples
    - Related categories

  module_index:
    - Alphabetical listing
    - Module ID → description mapping
    - Capabilities index
    - Tier/category index

FORMATTING:
- Use markdown headers for structure
- Include tables for metrics
- Link between sections
- Add visual indicators (✅❌⚠️)

OUTPUT: Use documentation_template`
)
```

## Report Templates

### Add Module Report Template

```markdown
{decision_indicator} **Library Curation: Add Module**

**Module**: {module_id}
**Decision**: {APPROVED|REJECTED|NEEDS_REVISION}

**Quality Assessment:**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Structure | {score}/10 | {notes} |
| Content | {score}/10 | {notes} |
| Metadata | {score}/10 | {notes} |
| Documentation | {score}/10 | {notes} |
| Relationships | {score}/10 | {notes} |
| **Overall** | **{total}/10** | {threshold_met} |

**Evaluation Details:**

- **Applicability**: {High|Medium|Low} - {rationale}
- **Uniqueness**: {Fills gap|Improves existing|Duplicates} - {explanation}
- **Completeness**: {Complete|Minor gaps|Major gaps} - {details}
- **Tier Placement**: {Correct|Should be {alternative}} - {reason}

{if APPROVED}
**Action Taken**: Module added to standard library
**Location**: {file_path}
**Catalog**: Updated with new entry

**Next Steps:**
- Module available in standard library
- Can be referenced in personas
- Will appear in module discovery

{if REJECTED}
**Issues Identified:**
{list of critical issues}

**Required Changes:**
{list of required fixes}

{if NEEDS_REVISION}
**Recommended Improvements:**
{list of suggested improvements}

**Current Status**: {score} meets threshold, but improvements recommended
```

### Remove Module Report Template

```markdown
{decision_indicator} **Library Curation: Remove Module**

**Module**: {module_id}
**Decision**: {REMOVED|BLOCKED}

**Impact Analysis:**

| Factor | Status | Details |
|--------|--------|---------|
| Persona References | {count} | {list of personas} |
| Dependent Modules | {count} | {list of modules} |
| Historical Usage | {frequency} | {usage data if available} |

{if REMOVED}
**Action Taken**: Module removed from standard library
**Previous Location**: {file_path}
**Catalog**: Entry removed

**Cleanup Completed:**
- ✅ Module file removed
- ✅ Catalog entry removed
- ✅ No orphaned dependencies

{if BLOCKED}
**Cannot Remove**: {reason}

**Blocking References:**
{list of references that must be removed first}

**Recommended Actions:**
1. Remove module from listed personas
2. Update dependent modules
3. Re-run removal command
```

### Evaluation Report Template

```markdown
{decision_indicator} **Module Evaluation**

**Module**: {module_id}
**Overall Score**: {total}/10
**Recommendation**: {APPROVE|REVISE|REJECT}

**Quality Breakdown:**

```
Structure      ████████░░ {score}/10
Content        ███████░░░ {score}/10
Metadata       █████████░ {score}/10
Documentation  ██████░░░░ {score}/10
Relationships  ████████░░ {score}/10
```

**Detailed Assessment:**

### Structure ({score}/10)
{findings}
{issues if any}

### Content ({score}/10)
{findings}
{issues if any}

### Metadata ({score}/10)
{findings}
{issues if any}

### Documentation ({score}/10)
{findings}
{issues if any}

### Relationships ({score}/10)
{findings}
{issues if any}

**Recommendation Rationale:**
{explanation based on total score and decision threshold}

{if APPROVE}
**Ready for library inclusion**: This module meets quality standards.

{if REVISE}
**Improvements Needed:**
{prioritized list of improvements}

**After Revisions**: Re-evaluate using `/ums:curate evaluate`

{if REJECT}
**Critical Issues:**
{list of issues requiring significant rework}

**Suggested Approach**: {rebuild|major revision|different approach}
```

### Metrics Report Template

```markdown
📊 **Library Metrics Report**

**Scope**: {tier_name | "All Tiers"}
**Generated**: {timestamp}

## Distribution

| Tier | Total Modules | Categories | Avg Modules/Category |
|------|---------------|------------|----------------------|
| Foundation | {count} | {count} | {avg} |
| Principle | {count} | {count} | {avg} |
| Technology | {count} | {count} | {avg} |
| Execution | {count} | {count} | {avg} |
| **Total** | **{total}** | **{total}** | **{avg}** |

### Cognitive Level Distribution (Foundation)

```
Level 0 (Perception)    ████░░░░░░ {count} modules ({percent}%)
Level 1 (Understanding) ███████░░░ {count} modules ({percent}%)
Level 2 (Analysis)      █████░░░░░ {count} modules ({percent}%)
Level 3 (Synthesis)     ████████░░ {count} modules ({percent}%)
Level 4 (Evaluation)    ██████░░░░ {count} modules ({percent}%)
```

## Quality Indicators

- **Average Completeness**: {score}/10
- **Modules with Relationships**: {count}/{total} ({percent}%)
- **Version Distribution**:
  - v1.0.0: {count} modules
  - v1.1.0+: {count} modules
  - v2.0.0+: {count} modules

## Coverage Analysis

### Categories per Tier

**Foundation**: {category_list}
**Principle**: {category_list}
**Technology**: {category_list}
**Execution**: {category_list}

### Thin Categories (< 3 modules)

| Category | Module Count | Status |
|----------|--------------|--------|
{list of thin categories}

### Missing Capabilities

{list of capability gaps identified}

## Usage Statistics

### Most Referenced Modules

| Module | Persona References | Categories |
|--------|-------------------|------------|
{top 10 modules}

### Unused Modules

{list of modules not referenced in any persona}

## Recommendations

### High Priority
{prioritized recommendations for gap filling}

### Medium Priority
{secondary recommendations}

### Maintenance Tasks
{ongoing maintenance suggestions}

---

**Next Steps**: Use `/ums:curate find-gaps` for detailed gap analysis
```

### Organization Report Template

```markdown
🗂️ **Library Organization Report**

**Tier**: {tier_name}
**Total Modules**: {count}
**Categories**: {count}

## Category Structure

{for each category}
### {category_name}

- **Modules**: {count}
- **Quality Range**: {min}-{max}/10
- **Status**: {✅ Well organized | ⚠️ Needs attention | ❌ Issues found}

{if issues}
**Issues**:
{list of issues}
{endif}

{endfor}

## Module Placement Analysis

### Correctly Placed
✅ {count} modules in appropriate tier/category

### Misplaced Modules

| Module | Current Location | Should Be | Reason |
|--------|-----------------|-----------|--------|
{list of misplaced modules}

## Quality Consistency

- **High Quality (8-10)**: {count} modules
- **Medium Quality (6-7)**: {count} modules
- **Low Quality (< 6)**: {count} modules

{if low quality modules}
### Low Quality Modules Requiring Attention

| Module | Score | Primary Issue |
|--------|-------|---------------|
{list of low quality modules}
{endif}

## Relationship Validation

- **Valid Dependencies**: {count}
- **Invalid References**: {count}
- **Circular Dependencies**: {count}

{if issues}
### Relationship Issues

{list of relationship problems}
{endif}

## Reorganization Plan

{if changes needed}
### Recommended Changes

1. **Move Modules**:
   {list of moves with source → destination}

2. **Quality Improvements**:
   {list of modules needing quality work}

3. **Naming Fixes**:
   {list of naming inconsistencies to fix}

4. **Documentation**:
   {list of missing or outdated docs}

### Implementation Steps

1. {step}
2. {step}
3. {step}

{else}
✅ **No reorganization needed**: Tier structure is well organized.
{endif}

---

**Next Steps**: Use `/ums:validate-module --tier {tier}` to check compliance
```

### Gap Analysis Report Template

```markdown
🔍 **Library Gap Analysis**

**Scope**: {tier_name | "All Tiers"}
**Analysis Date**: {timestamp}

## Executive Summary

- **Total Gaps Identified**: {count}
- **High Priority**: {count}
- **Medium Priority**: {count}
- **Low Priority**: {count}

## Capability Gaps

### Missing Capabilities

| Capability | Priority | Rationale | Suggested Module |
|------------|----------|-----------|------------------|
{list of capability gaps}

### Capability Combinations

**Commonly Combined** (found together in modules):
{list of capability patterns}

**Missing Combinations** (logical but absent):
{list of missing capability combinations}

## Category Gaps

### Thin Categories (< 3 modules)

| Tier | Category | Current Count | Recommended Count | Gap |
|------|----------|---------------|-------------------|-----|
{list of thin categories}

### Missing Categories

| Tier | Category | Rationale | Example Modules |
|------|----------|-----------|-----------------|
{list of missing categories}

## Cognitive Gaps (Foundation Tier)

```
Target Distribution vs. Current

Level 0:  ████████░░ {current} / {target} ({gap})
Level 1:  ██████████ {current} / {target} ({gap})
Level 2:  ███████░░░ {current} / {target} ({gap})
Level 3:  █████░░░░░ {current} / {target} ({gap})
Level 4:  ████░░░░░░ {current} / {target} ({gap})
```

**Underrepresented Levels**: {list}

## Technology Gaps (Technology Tier)

### Covered Technologies
{list of technologies with module count}

### Missing Major Technologies

| Technology | Popularity Rank | Justification | Suggested Modules |
|------------|----------------|---------------|-------------------|
{list of missing technologies}

## Prioritized Recommendations

### High Priority (Immediate Gaps)

{for each high priority gap}
**{number}. {gap_title}**
- **Type**: {capability|category|cognitive|technology}
- **Impact**: {description of impact}
- **Suggested Modules**: {list}
- **Estimated Effort**: {low|medium|high}
{endfor}

### Medium Priority (Enhancement Opportunities)

{list medium priority gaps}

### Low Priority (Nice-to-Have)

{list low priority gaps}

## Implementation Roadmap

### Phase 1 (High Priority)
{list of gaps to address first}

### Phase 2 (Medium Priority)
{list of gaps to address second}

### Phase 3 (Low Priority)
{list of gaps to address last}

---

**Next Steps**:
- Use `/ums:create module` to address gaps
- Use `/ums:curate metrics` to track progress
```

### Documentation Template

```markdown
# UMS Library Documentation

**Last Updated**: {timestamp}
**Library Version**: {version}

## Overview

The UMS Standard Library contains {total} modules organized across four tiers:

- **Foundation** ({count}): Universal cognitive frameworks
- **Principle** ({count}): Technology-agnostic methodologies
- **Technology** ({count}): Specific tools and frameworks
- **Execution** ({count}): Step-by-step procedures

### Quality Metrics

- Average Module Quality: {score}/10
- Modules with Relationships: {percent}%
- Total Capabilities: {count}

### Recent Additions

{list of recent modules with dates}

## Tier Summaries

{for each tier}
### {tier_name} Tier

**Purpose**: {tier_purpose}

**Categories** ({count}):
{list of categories with module counts}

**Key Modules** (most referenced):
{list of top modules in tier}

**Quality Assessment**: {assessment}

{endfor}

## Module Index

### By Tier

{for each tier}
#### {tier_name}

{for each category}
**{category_name}**

{for each module}
- `{module_id}` - {description}
  - Capabilities: {capabilities}
  - Version: {version}
{endfor}

{endfor}

{endfor}

### By Capability

{for each capability}
**{capability_name}**

Modules providing this capability:
{list of modules}

{endfor}

### Alphabetical

{alphabetical list of all modules}

## Usage Guide

### Finding Modules

```bash
# List modules by tier
copilot-instructions list --tier foundation

# Search by keyword
copilot-instructions search "async"

# View module details
cat instruct-modules-v2/modules/{tier}/{category}/{module-id}.module.ts
```

### Including in Personas

```typescript
export default {
  name: 'My Persona',
  modules: [
    'foundation/ethics/do-no-harm',
    'technology/typescript/async-patterns'
  ]
} satisfies Persona;
```

### Building Personas

```bash
copilot-instructions build --persona ./my-persona.persona.ts
```

## Maintenance Status

- Last Quality Audit: {date}
- Known Issues: {count}
- Planned Additions: {count}

---

**Contribute**: Use `/ums:create module` to add new modules
**Report Issues**: Use `/ums:validate-module` to check quality
```

## Implementation Checklist

```yaml
pre_execution:
  - [ ] Parse command arguments
  - [ ] Validate arguments (paths exist, tier valid, etc.)
  - [ ] Determine operation type
  - [ ] Select appropriate workflow

during_execution:
  add_workflow:
    - [ ] Validate module structure (module-validator)
    - [ ] Load module using SDK ModuleLoader
    - [ ] Execute evaluation checklist
    - [ ] Calculate quality scores
    - [ ] Generate inclusion decision
    - [ ] If approved: copy to standard library
    - [ ] Update library catalog
    - [ ] Format using add_module_report_template

  remove_workflow:
    - [ ] Locate module in library
    - [ ] Search persona files for references
    - [ ] Check dependent modules
    - [ ] Generate impact analysis
    - [ ] If safe: remove from library
    - [ ] Update catalog
    - [ ] Format using remove_module_report_template

  evaluate_workflow:
    - [ ] Load and validate module
    - [ ] Apply quality rubric to each criterion
    - [ ] Calculate total score
    - [ ] Generate recommendation (approve/revise/reject)
    - [ ] List improvements if needed
    - [ ] Format using evaluation_report_template

  metrics_workflow:
    - [ ] Discover modules in scope
    - [ ] Load all modules
    - [ ] Calculate distribution metrics
    - [ ] Calculate quality metrics
    - [ ] Identify coverage gaps
    - [ ] Generate recommendations
    - [ ] Format using metrics_report_template

  organize_workflow:
    - [ ] Discover all modules in tier
    - [ ] Validate category structure
    - [ ] Check module placement
    - [ ] Assess quality consistency
    - [ ] Identify issues
    - [ ] Generate reorganization plan
    - [ ] Format using organization_report_template

  gap_analysis_workflow:
    - [ ] Load all modules in scope
    - [ ] Extract capabilities and categories
    - [ ] Identify missing capabilities
    - [ ] Identify thin categories
    - [ ] Identify cognitive gaps (foundation)
    - [ ] Identify technology gaps (technology)
    - [ ] Prioritize gaps
    - [ ] Generate recommendations
    - [ ] Format using gap_analysis_report_template

  documentation_workflow:
    - [ ] Load all modules in scope
    - [ ] Generate library overview
    - [ ] Create tier summaries
    - [ ] Document module relationships
    - [ ] Create module index (tier, capability, alphabetical)
    - [ ] Create usage guide
    - [ ] Format using documentation_template

post_execution:
  - [ ] Validate output format
  - [ ] Include visual indicators (✅❌⚠️)
  - [ ] Provide next steps
  - [ ] Suggest related commands if applicable
```

## Quality Rubric Reference

```typescript
// NOTE: Required fields must match Module interface definition
// Source of truth: packages/ums-lib/src/types/index.ts (Module interface)
// Keep this list synchronized with the TypeScript interface
const UMS_V2_REQUIRED_MODULE_FIELDS = ['id', 'version', 'schemaVersion', 'metadata', 'capabilities'];

quality_rubric: {
  structure: {
    max_score: 10,
    criteria: {
      required_fields: {
        weight: 0.3,
        checks: UMS_V2_REQUIRED_MODULE_FIELDS
      },
      export_convention: {
        weight: 0.3,
        checks: ['named export', 'camelCase from kebab-case']
      },
      component_structure: {
        weight: 0.4,
        checks: ['valid component type', 'all fields present', 'correct schema']
      }
    }
  },

  content: {
    max_score: 10,
    criteria: {
      clarity: {
        weight: 0.3,
        checks: ['instructions clear', 'knowledge explained', 'data structured']
      },
      actionability: {
        weight: 0.4,
        checks: ['specific steps', 'concrete examples', 'measurable criteria']
      },
      completeness: {
        weight: 0.3,
        checks: ['all sections filled', 'examples provided', 'edge cases covered']
      }
    }
  },

  metadata: {
    max_score: 10,
    criteria: {
      description: {
        weight: 0.3,
        checks: ['concise', 'accurate', 'complete']
      },
      semantic: {
        weight: 0.4,
        checks: ['keyword-rich', 'searchable', 'AI-optimized']
      },
      capabilities: {
        weight: 0.3,
        checks: ['accurate', 'comprehensive', 'relevant']
      }
    }
  },

  documentation: {
    max_score: 10,
    criteria: {
      purpose: {
        weight: 0.3,
        checks: ['clearly stated', 'explains why', 'defines scope']
      },
      examples: {
        weight: 0.4,
        checks: ['concrete examples', 'common use cases', 'edge cases']
      },
      usage: {
        weight: 0.3,
        checks: ['how to use', 'when to use', 'when not to use']
      }
    }
  },

  relationships: {
    max_score: 10,
    criteria: {
      dependencies: {
        weight: 0.4,
        checks: ['dependencies valid', 'all exist', 'appropriate']
      },
      recommendations: {
        weight: 0.4,
        checks: ['recommendations valid', 'all exist', 'relevant']
      },
      conflicts: {
        weight: 0.2,
        checks: ['no circular deps', 'no conflicts', 'logical hierarchy']
      }
    }
  }
}
```

## Common Issues and Solutions

```typescript
debugging_checklist: [
  {
    symptom: "Module not found in library after add",
    likely_cause: "File copied to wrong location",
    diagnostic: "Check file path matches tier/category structure",
    fix: "Move file to correct location, update catalog"
  },
  {
    symptom: "Removal blocked with no apparent references",
    likely_cause: "Module referenced in local persona files",
    diagnostic: "grep -r 'module-id' ./personas/",
    fix: "Remove from personas or update references"
  },
  {
    symptom: "Evaluation score unexpectedly low",
    likely_cause: "Missing required fields or poor metadata",
    diagnostic: "Run /ums:validate-module to see specific issues",
    fix: "Address validation errors, improve metadata"
  },
  {
    symptom: "Metrics report shows zero modules",
    likely_cause: "Incorrect module directory path",
    diagnostic: "Check modules.config.yml for moduleDirectories",
    fix: "Update config or move modules to correct directory"
  },
  {
    symptom: "Gap analysis shows known modules as missing",
    likely_cause: "Modules not in standard library location",
    diagnostic: "Verify modules are in configured moduleDirectories",
    fix: "Use /ums:curate add to properly add to library"
  }
]
```

## Agent Dependencies

- **Primary**: ums-v2-standard-library-curator (required for all operations)
- **Supporting**: ums-v2-module-validator (for quality checks, pre-add validation)
- **SDK Components**: ModuleDiscovery, ModuleLoader, StandardLibrary

## Success Criteria

```yaml
operation_success:
  add:
    - Module validated and copied to correct location
    - Library catalog updated
    - Module discoverable via SDK

  remove:
    - Module removed from library
    - Catalog updated
    - No broken references

  evaluate:
    - Quality scores calculated for all criteria
    - Clear recommendation provided
    - Actionable feedback given

  metrics:
    - All distribution metrics calculated
    - Quality indicators assessed
    - Gaps identified
    - Recommendations prioritized

  organize:
    - All modules in tier checked
    - Misplaced modules identified
    - Reorganization plan provided

  find-gaps:
    - All gap types analyzed
    - Gaps prioritized
    - Specific recommendations provided

  document:
    - Complete library overview generated
    - All tiers documented
    - Module index created
    - Usage guide included
```

## Notes

- Maintain high standards for library inclusion - quality over quantity
- Always validate modules before adding to library
- Check persona references before removing modules
- Use metrics regularly to track library health
- Gap analysis informs strategic module development
- Documentation should be regenerated after significant library changes
