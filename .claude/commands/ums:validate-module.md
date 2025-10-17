# Command: /ums:validate-module

Validate UMS v2.0 module files for specification compliance.

## Execution Workflow

```yaml
step_1_parse_input:
  action: Determine target modules
  patterns:
    specific_file: path/to/module.module.ts
    all_modules: all | * | instruct-modules-v2/modules/
    by_tier: foundation | principle | technology | execution
    by_category: technology/typescript | execution/debugging
  default_if_empty: prompt user for target
  output: file_list

step_2_validate:
  action: Launch module-validator agent
  agent: ums-v2-module-validator
  input: file_list from step_1
  validation_checks:
    - spec_compliance_check
    - required_fields_check
    - export_convention_check
    - component_structure_check
    - metadata_quality_check
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
    if_failures: [fix_manually, regenerate_module, show_details]
    if_warnings: [fix_warnings, accept_as_is, show_details]
    if_all_pass: [continue, audit_all]
  output: action_prompt
```

## Path Resolution Decision Tree

```yaml
path_resolution:
  input_is_specific_file:
    condition: ends_with(.module.ts) AND file_exists
    action: validate_single_file
    output: [file_path]

  input_is_all:
    condition: input in ['all', '*', 'instruct-modules-v2/modules/']
    action: glob('instruct-modules-v2/modules/**/*.module.ts')
    output: [file_paths]

  input_is_tier:
    condition: input in [foundation, principle, technology, execution]
    action: glob('instruct-modules-v2/modules/{tier}/**/*.module.ts')
    output: [file_paths]

  input_is_category:
    condition: matches pattern '{tier}/{category}'
    action: glob('instruct-modules-v2/modules/{tier}/{category}/**/*.module.ts')
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

### Single Module Validation

```typescript
Task(
  subagent_type: "ums-v2-module-validator",
  description: "Validate UMS v2.0 module",
  prompt: `Validate: ${module_path}

Checks:
- schemaVersion: "2.0"
- required fields: [id, version, schemaVersion, capabilities, metadata]
- export convention: camelCase(lastSegment(id))
- component structure
- metadata completeness

Output format:
{
  status: "PASS|WARNINGS|FAIL",
  module_id: string,
  quality_score: number,
  errors: [{field, issue, fix}],
  warnings: [{field, issue, recommendation}]
}`
)
```

### Batch Module Validation

```typescript
Task(
  subagent_type: "ums-v2-module-validator",
  description: "Validate multiple UMS v2.0 modules",
  prompt: `Validate all modules in: ${path}

For each module:
- Run full spec compliance check
- Assess quality
- Check relationships

Summary output:
{
  total: number,
  pass: number,
  warnings: number,
  fail: number,
  issues: [{module_id, status, problems}]
}`
)
```

## Output Templates

### PASS Template

```markdown
✅ **Module Validation: PASS**

**Module**: ${module_id}
**File**: ${file_path}
**Version**: ${version}
**Quality Score**: ${quality_score}/10

All validation checks passed. Module is spec-compliant and production-ready.
```

### WARNINGS Template

```markdown
⚠️ **Module Validation: PASS WITH WARNINGS**

**Module**: ${module_id}
**Status**: Spec-compliant with recommendations

**Warnings** (${warning_count}):
${warnings.map((w, i) => `${i+1}. ${w.field}: ${w.issue}\n   Recommendation: ${w.recommendation}`).join('\n')}

Module is usable but improvements recommended.

**Next actions**:
1. Fix warnings for better quality
2. Accept as-is if warnings acceptable
3. Show detailed validation report
```

### FAIL Template

```markdown
❌ **Module Validation: FAIL**

**Module**: ${module_id}
**Errors**: ${error_count} critical issues

**Critical Errors**:
${errors.map((e, i) => `${i+1}. ${e.field}: ${e.issue}\n   Fix: ${e.fix}`).join('\n')}

Module cannot be used until errors are fixed.

**Next actions**:
A) Show how to fix manually
B) Regenerate module with correct structure
C) Delete invalid module
```

### SUMMARY Template (Multiple Modules)

```markdown
📊 **Module Validation Summary**

**Total**: ${total}
- ✅ ${pass_count} PASS (${pass_percent}%)
- ⚠️ ${warning_count} WARNINGS (${warning_percent}%)
- ❌ ${fail_count} FAIL (${fail_percent}%)

**Modules with Issues**:

${issues.filter(i => i.status === 'WARNINGS').map(i =>
  `⚠️ ${i.module_id}: ${i.problems.join(', ')}`
).join('\n')}

${issues.filter(i => i.status === 'FAIL').map(i =>
  `❌ ${i.module_id}: ${i.problems.join(', ')}`
).join('\n')}

**Recommended Actions**:
1. Fix ${fail_count} failing module(s) immediately
2. Address warnings to improve quality
3. Run /ums:audit for comprehensive assessment
```

## Error Handling Templates

### Module Not Found

```markdown
❌ **Module file not found**: ${path}

Did you mean:
${suggestions.map(s => `- ${s}`).join('\n')}

Or use: /ums:validate-module all
```

### Invalid File Format

```markdown
❌ **Not a UMS v2.0 module file**

Expected: .module.ts file
Received: ${filename}

Requirements:
- File extension: .module.ts
- Named export: camelCase convention
- UMS v2.0 Module interface
```

## Usage Examples

```yaml
examples:
  single_module:
    command: /ums:validate-module instruct-modules-v2/modules/foundation/ethics/do-no-harm.module.ts
    flow:
      - parse: specific file path
      - validate: single module
      - format: pass_template
      - result: validation report

  all_modules:
    command: /ums:validate-module all
    flow:
      - parse: all pattern
      - glob: find all .module.ts files
      - validate: batch validation
      - format: summary_template
      - result: summary report

  by_tier:
    command: /ums:validate-module foundation
    flow:
      - parse: tier pattern
      - glob: foundation/**/*.module.ts
      - validate: batch validation
      - format: summary_template
      - result: foundation tier report

  by_category:
    command: /ums:validate-module technology/typescript
    flow:
      - parse: category pattern
      - glob: technology/typescript/**/*.module.ts
      - validate: batch validation
      - format: summary_template
      - result: typescript modules report

  no_argument:
    command: /ums:validate-module
    flow:
      - parse: empty
      - prompt: show options
      - wait: user input
      - execute: based on user choice
```

## Implementation Checklist

```yaml
checklist:
  - [ ] Parse command argument
  - [ ] Resolve to file path(s)
  - [ ] Handle file not found error
  - [ ] Launch module-validator agent with appropriate prompt
  - [ ] Receive validation results
  - [ ] Select appropriate output template
  - [ ] Format results with template
  - [ ] Offer next action options
  - [ ] Execute follow-up if requested
```

## Agent Dependencies

- **Primary**: ums-v2-module-validator (required)
- **Optional**: ums-v2-module-generator (for regeneration)
