# Command: /ums:validate-persona

Validate UMS v2.0 persona files for specification compliance and composition quality.

## Execution Workflow

```yaml
step_1_parse_input:
  action: Determine target personas
  patterns:
    specific_file: path/to/persona.persona.ts
    by_name: persona-name (searches in personas/)
    all_personas: all | * | instruct-modules-v2/personas/
    directory: path/to/personas/
  default_if_empty: prompt user for target
  output: file_list

step_2_validate:
  action: Launch persona-validator agent
  agent: ums-v2-persona-validator
  input: file_list from step_1
  validation_checks:
    - spec_compliance
    - required_fields
    - module_composition
    - duplicate_detection
    - module_availability
    - group_structure
    - tier_balance
    - identity_quality
  output: validation_results

step_3_format_output:
  action: Format results for user
  templates:
    single_pass: use pass_template
    single_warnings: use warnings_template
    single_fail: use fail_template
    multiple: use summary_template
  output: formatted_report

step_4_offer_action:
  action: Suggest next steps
  options:
    if_failures: [fix_manually, rebuild_persona, validate_modules]
    if_warnings: [fix_warnings, accept_as_is, show_details]
    if_all_pass: [build_persona, validate_modules, continue]
  output: action_prompt
```

## Path Resolution Decision Tree

```yaml
path_resolution:
  input_is_specific_file:
    condition: ends_with(.persona.ts) AND file_exists
    action: validate_single_file
    output: [file_path]

  input_is_persona_name:
    condition: no_path_separator AND not_extension
    action: resolve_to_path('instruct-modules-v2/personas/{name}.persona.ts')
    validation: check_file_exists
    output: [file_path]

  input_is_all:
    condition: input in ['all', '*']
    action: glob('instruct-modules-v2/personas/*.persona.ts')
    output: [file_paths]

  input_is_directory:
    condition: is_directory OR ends_with('/')
    action: glob('{path}/**/*.persona.ts')
    output: [file_paths]

  input_is_empty:
    condition: no argument provided
    action: prompt_user_for_target
    output: wait_for_input

  input_not_found:
    condition: file/pattern not found
    action: suggest_alternatives
    output: error_with_suggestions
```

## Agent Invocation Templates

### Single Persona Validation

```typescript
Task(
  subagent_type: "ums-v2-persona-validator",
  description: "Validate UMS v2.0 persona",
  prompt: `Validate: ${persona_path}

Checks:
- schemaVersion: "2.0"
- required fields: [name, version, schemaVersion, modules]
- modules: array of strings or ModuleGroup[]
- module references: all IDs exist in registry
- duplicates: no repeated module IDs
- groups: valid structure if present
- metadata: description, semantic quality

Output format:
{
  status: "PASS|WARN|FAIL",
  persona_name: string,
  version: string,
  module_count: number,
  tier_distribution: {foundation, principle, technology, execution},
  identity_score: number,
  errors: [{field, issue, fix}],
  warnings: [{field, issue, recommendation}]
}`
)
```

### Batch Persona Validation

```typescript
Task(
  subagent_type: "ums-v2-persona-validator",
  description: "Validate multiple UMS v2.0 personas",
  prompt: `Validate all personas:
${file_list.map(f => \`  - \${f}\`).join('\\n')}

For each persona:
- Run full spec compliance check
- Verify module composition
- Check tier balance
- Assess identity quality

Summary output:
{
  total: number,
  pass: number,
  warnings: number,
  fail: number,
  issues: [{persona_name, status, problems}]
}`
)
```

## Output Templates

### PASS Template

```markdown
✅ **Persona Validation: PASS**

**Persona**: ${name}
**Version**: ${version}
**File**: ${file_path}
**Total Modules**: ${module_count}
**Status**: Spec-compliant, production-ready

**Module Composition**:

${tier_distribution.map(tier =>
  `- ${tier.name}: ${tier.count} modules (${tier.percent}%)`
).join('\n')}

**Quality Assessment**:

- Identity: ${identity_score}/10 (${identity_assessment})
- Module Selection: ${module_selection_score}/10 (${selection_assessment})
- Semantic Richness: ${semantic_score}/10 (${semantic_assessment})
- Tier Balance: ${balance_score}/10 (${balance_assessment})

**Validation Results**:

- [x] Required fields present
- [x] No duplicate module IDs
- [x] All modules available in registry
- [x] Module composition valid
- [x] Export convention followed

This persona is ready for building.
```

### WARN Template

```markdown
⚠️ **Persona Validation: WARN**

**Persona**: ${name}
**Status**: Spec-compliant with recommendations

**Warnings** (${warning_count}):
${warnings.map((w, i) => `${i+1}. ${w.field}: ${w.issue}\n   Recommendation: ${w.recommendation}`).join('\n')}

**Module Composition**:

- Foundation: ${foundation_count} modules (${foundation_percent}%)
- Principle: ${principle_count} modules (${principle_percent}%)
- Technology: ${technology_count} modules (${technology_percent}%)
- Execution: ${execution_count} modules (${execution_percent}%)

Persona is buildable but improvements recommended.

**Next actions**:
1. Fix warnings for better quality
2. Accept as-is if warnings acceptable
3. Show detailed composition analysis
4. Build persona and test
```

### FAIL Template

```markdown
❌ **Persona Validation: FAIL**

**Persona**: ${name}
**Errors**: ${error_count} critical issues

**Critical Errors**:
${errors.map((e, i) => `${i+1}. ${e.field}: ${e.issue}\n   Fix: ${e.fix}`).join('\n')}

Persona cannot be built until errors are fixed.

**Next actions**:
A) Show how to fix manually
B) Validate referenced modules
C) Regenerate persona structure
D) Show missing modules
```

### SUMMARY Template (Multiple Personas)

```markdown
📊 **Persona Validation Summary**

**Total**: ${total}
- ✅ ${pass_count} PASS (${pass_percent}%)
- ⚠️ ${warning_count} WARN (${warning_percent}%)
- ❌ ${fail_count} FAIL (${fail_percent}%)

**Personas with Issues**:

${issues.filter(i => i.status === 'WARN').map(i =>
  `⚠️ ${i.persona_name}: ${i.problems.join(', ')}`
).join('\n')}

${issues.filter(i => i.status === 'FAIL').map(i =>
  `❌ ${i.persona_name}: ${i.problems.join(', ')}`
).join('\n')}

**Tier Balance Summary**:

${tier_summary.map(tier =>
  `${tier.name}: ${tier.avg_count} avg modules (${tier.distribution})`
).join('\n')}

**Recommended Actions**:
1. Fix ${fail_count} failing persona(s) immediately
2. Address warnings to improve quality
3. Validate all referenced modules
4. Run /ums:audit for comprehensive assessment
```

## Composition Validation Checklist

```yaml
composition_checks:
  module_references:
    - [ ] All module IDs exist in registry
    - [ ] Module IDs follow kebab-case convention
    - [ ] No duplicate module IDs
    - [ ] Module paths resolve correctly

  tier_distribution:
    - [ ] Foundation tier present (recommended)
    - [ ] Principle tier present (recommended)
    - [ ] Technology tier appropriate for role
    - [ ] Execution tier adequate for tasks
    - [ ] Balance appropriate for persona purpose

  group_structure:
    - [ ] Groups have valid names
    - [ ] Group IDs are arrays of strings
    - [ ] No empty groups
    - [ ] Groups organized logically

  identity_quality:
    - [ ] Name is clear and descriptive
    - [ ] Description explains role
    - [ ] Semantic field is keyword-rich
    - [ ] Capabilities align with modules
    - [ ] Version follows semver

  metadata_completeness:
    - [ ] Name present
    - [ ] Version present (semver)
    - [ ] schemaVersion is "2.0"
    - [ ] Description present (required)
    - [ ] Semantic present (required)
```

## Error Handling Templates

### Persona Not Found

```markdown
❌ **Persona file not found**: ${path}

Did you mean:
${suggestions.map(s => `- ${s}`).join('\n')}

Available personas:
${available.map(p => `- ${p.name} (${p.module_count} modules)`).join('\n')}

Or use: /ums:validate-persona all
```

### Module Not Found in Registry

```markdown
❌ **Module reference error in persona**: ${persona_name}

Missing modules (${missing_count}):
${missing_modules.map(m => `- ${m.id} (referenced but not found)`).join('\n')}

Possible fixes:
1. Validate module exists: /ums:validate-module ${missing_modules[0].id}
2. Remove from persona if not needed
3. Check module ID spelling
4. Ensure module is in correct tier

Would you like to:
A) Validate all referenced modules
B) Show available modules in tier
C) Fix persona module list
```

### Duplicate Modules Detected

```markdown
⚠️ **Duplicate modules in persona**: ${persona_name}

Duplicates found (${duplicate_count}):
${duplicates.map(d => `- ${d.id} appears ${d.count} times`).join('\n')}

Fix: Remove duplicate references from modules array.

${group_info ? `Note: Duplicates may be across groups:\n${group_info}` : ''}

Would you like me to remove duplicates automatically?
```

### Invalid File Format

```markdown
❌ **Not a UMS v2.0 persona file**

Expected: .persona.ts file
Received: ${filename}

Requirements:
- File extension: .persona.ts
- Default or named export
- Persona interface compliance
- schemaVersion: "2.0"

Example structure:
\`\`\`typescript
import type { Persona } from 'ums-lib';

export default {
  name: 'Persona Name',
  version: '1.0.0',
  schemaVersion: '2.0',
  description: 'Brief description',
  modules: ['module-1', 'module-2']
} satisfies Persona;
\`\`\`
```

## Composition Analysis Templates

### Tier Balance Analysis

```yaml
tier_balance_assessment:
  balanced:
    condition: all_tiers_present AND no_tier > 60%
    feedback: Excellent tier balance with diverse module composition
    score: 9-10

  foundation_heavy:
    condition: foundation > 40%
    feedback: Strong cognitive foundation, consider adding practical execution modules
    score: 7-8

  technology_heavy:
    condition: technology > 50%
    feedback: Technology-focused, ensure sufficient principles and execution
    score: 6-8

  execution_light:
    condition: execution < 10%
    feedback: Consider adding execution tier modules for practical guidance
    score: 6-7

  missing_foundation:
    condition: foundation == 0
    feedback: Warning - No foundation tier. Consider adding core cognitive frameworks
    score: 5-6

  imbalanced:
    condition: any_tier > 70%
    feedback: Heavily weighted to one tier, diversify for better AI reasoning
    score: 4-5
```

### Identity Quality Assessment

```yaml
identity_quality_scoring:
  excellent:
    score: 9-10
    criteria:
      - name: Clear, specific role name
      - description: Comprehensive role explanation
      - semantic: Rich keyword density
      - capabilities: Well-defined, aligned with modules
      - modules: Appropriate selection for role

  good:
    score: 7-8
    criteria:
      - name: Clear role name
      - description: Basic role explanation
      - semantic: Good keywords
      - capabilities: Defined
      - modules: Reasonable selection

  acceptable:
    score: 5-6
    criteria:
      - name: Generic role name
      - description: Minimal explanation
      - semantic: Few keywords
      - capabilities: Basic list
      - modules: Functional selection

  needs_improvement:
    score: 3-4
    criteria:
      - name: Vague or missing
      - description: Missing or unclear
      - semantic: Minimal or missing
      - capabilities: Unclear
      - modules: Questionable selection

  poor:
    score: 1-2
    criteria:
      - name: Missing
      - description: Missing
      - semantic: Missing
      - capabilities: Missing
      - modules: Random or missing
```

## Usage Examples

```yaml
examples:
  single_persona_by_path:
    command: /ums:validate-persona instruct-modules-v2/personas/systems-architect.persona.ts
    flow:
      - parse: specific file path
      - validate: single persona
      - format: pass_template with composition analysis
      - result: detailed validation report

  single_persona_by_name:
    command: /ums:validate-persona systems-architect
    flow:
      - parse: persona name
      - resolve: instruct-modules-v2/personas/systems-architect.persona.ts
      - validate: single persona
      - format: pass_template
      - result: validation report

  all_personas:
    command: /ums:validate-persona all
    flow:
      - parse: all pattern
      - glob: find all .persona.ts files
      - validate: batch validation
      - format: summary_template with tier analysis
      - result: comprehensive summary

  personas_directory:
    command: /ums:validate-persona ./my-personas/
    flow:
      - parse: directory path
      - glob: find all .persona.ts in directory
      - validate: batch validation
      - format: summary_template
      - result: directory validation report

  no_argument:
    command: /ums:validate-persona
    flow:
      - parse: empty
      - prompt: show options (list available personas)
      - wait: user input
      - execute: based on user choice

  with_module_validation:
    command: /ums:validate-persona systems-architect --validate-modules
    flow:
      - validate: persona structure
      - extract: module IDs from persona
      - validate: each referenced module
      - format: combined report
      - result: persona + module validation
```

## Implementation Checklist

```yaml
checklist:
  input_handling:
    - [ ] Parse command argument
    - [ ] Resolve persona name to file path if needed
    - [ ] Resolve to file path(s) via decision tree
    - [ ] Handle file not found error with suggestions
    - [ ] Handle directory input with glob

  validation:
    - [ ] Launch persona-validator agent with appropriate prompt
    - [ ] Validate persona structure
    - [ ] Check module references against registry
    - [ ] Detect duplicate modules
    - [ ] Validate group structure if present
    - [ ] Assess tier distribution
    - [ ] Score identity quality
    - [ ] Receive validation results

  output_formatting:
    - [ ] Select appropriate output template
    - [ ] Format tier distribution
    - [ ] Calculate quality scores
    - [ ] Format error/warning messages
    - [ ] Generate composition analysis
    - [ ] Include actionable recommendations

  error_handling:
    - [ ] Handle missing persona files
    - [ ] Handle missing module references
    - [ ] Handle duplicate modules
    - [ ] Handle invalid file format
    - [ ] Provide clear error messages with fixes

  follow_up:
    - [ ] Offer next action options
    - [ ] Execute follow-up if requested
    - [ ] Suggest related commands
    - [ ] Provide build command if passed
```

## Validation Workflow Templates

### Full Persona Validation Workflow

```yaml
full_validation:
  phase_1_structure:
    steps:
      - Load persona file
      - Parse TypeScript export
      - Verify required fields
      - Check schemaVersion
    gates:
      - File must exist
      - Export must be valid
      - Structure must match Persona interface
    output: persona_object

  phase_2_composition:
    steps:
      - Extract module IDs
      - Load module registry
      - Verify each module exists
      - Detect duplicates
      - Validate group structure
    gates:
      - All modules must exist
      - No critical duplicates
      - Groups must be valid if present
    output: composition_analysis

  phase_3_quality:
    steps:
      - Assess tier distribution
      - Score identity quality
      - Evaluate semantic richness
      - Analyze module selection
    gates:
      - Tier balance reasonable
      - Identity clear
    output: quality_scores

  phase_4_reporting:
    steps:
      - Compile validation results
      - Generate recommendations
      - Format output report
      - Provide next actions
    output: validation_report
```

### Quick Validation Workflow

```yaml
quick_validation:
  checks:
    - [ ] Required fields present
    - [ ] Schema version correct
    - [ ] Modules array valid
    - [ ] No duplicate modules
  output: pass_fail_status
  use_case: Pre-commit hook, CI/CD pipeline
```

### Deep Validation Workflow

```yaml
deep_validation:
  checks:
    - [ ] Full structure validation
    - [ ] All module references validated
    - [ ] Tier balance assessed
    - [ ] Identity quality scored
    - [ ] Module relationships checked
    - [ ] Build simulation performed
  output: comprehensive_report
  use_case: Pre-release, quality audit
```

## Agent Dependencies

- **Primary**: ums-v2-persona-validator (required)
- **Optional**: ums-v2-module-validator (for module validation)
- **Optional**: ums-v2-build-developer (for build simulation)
