# Command: /ums:create

Create UMS v2.0 modules or personas with structured workflows and agent orchestration.

## Workflow Selection

```typescript
// Entry point decision tree
if (user_specified_type === 'module') {
  execute: MODULE_CREATION_WORKFLOW
} else if (user_specified_type === 'persona') {
  execute: PERSONA_CREATION_WORKFLOW
} else {
  execute: INTERACTIVE_TYPE_SELECTION
}
```

## Interactive Type Selection

**When**: User provides `/ums:create` with no arguments

**Output Template**:
```markdown
Select creation type:

1. **Module** - Create reusable instruction/knowledge/data component
2. **Persona** - Create AI assistant role with module composition

Type: [module|persona]
```

**Next Action**: Route to appropriate workflow based on selection

---

## MODULE_CREATION_WORKFLOW

### Phase 1: Requirements Extraction

**Input Patterns**:
| Pattern | Action |
|---------|--------|
| `/ums:create module [detailed description]` | Extract tier/category/domain from description |
| `/ums:create module` | Launch interactive requirements gathering |
| `/ums:create [vague description]` | Clarify tier, domain, component type |

**Requirements Decision Tree**:

```typescript
requirements_extraction: {
  tier_determination: {
    keywords: {
      'ethics|values|reasoning|cognitive': 'foundation',
      'methodology|principles|patterns|best-practices': 'principle',
      'python|typescript|react|specific-tech': 'technology',
      'deployment|debugging|procedures|playbook': 'execution'
    },
    confidence_threshold: 0.7,
    on_uncertain: 'ASK_USER'
  },

  domain_determination: {
    technology_tier: 'EXTRACT_FROM_TECH_NAME',
    other_tiers: {
      if_language_specific: 'ASK_USER',
      default: 'language-agnostic'
    }
  },

  component_selection: {
    instruction: {
      when: 'process|steps|how-to|checklist|procedure',
      structure: 'purpose + process + constraints + principles'
    },
    knowledge: {
      when: 'concept|theory|pattern|understanding|explanation',
      structure: 'explanation + concepts + examples + patterns'
    },
    data: {
      when: 'reference|template|config|lookup|catalog',
      structure: 'format + value + description'
    },
    multi_component: {
      when: 'complex|both how-to and concepts',
      structure: 'components array with multiple types'
    }
  }
}
```

**Interactive Requirements Template**:

```markdown
**Module Requirements Gathering**

Detected from description:
- Tier: {detected_tier} {confidence_level}
- Domain: {detected_domain}
- Component: {suggested_component_type}

Confirm or provide:

1. **Tier** [foundation|principle|technology|execution]:
   - Foundation: Cognitive frameworks (specify level 0-4)
   - Principle: Software engineering principles
   - Technology: Language/framework specific
   - Execution: Procedures and playbooks

2. **Domain** [language-agnostic|python|typescript|react|etc]:
   Current: {detected_domain}

3. **Component Type** [instruction|knowledge|data|multiple]:
   - Instruction: AI performs actions (process steps)
   - Knowledge: AI understands concepts (theory)
   - Data: AI references information (lookup)
   - Multiple: Complex module with combined types

4. **Capabilities** (keywords): {suggested_capabilities}

Type 'proceed' to continue or provide corrections.
```

### Phase 2: Module Structure Calculation

**Module ID Generator**:
```typescript
module_id_pattern: {
  foundation: 'foundation/{category}/{name}',
  principle: 'principle/{category}/{name}',
  technology: 'technology/{tech}/{name}',
  execution: 'execution/{category}/{name}'
}

export_name_transform: {
  input: 'technology/python/async-programming',
  extract_final_segment: 'async-programming',
  kebab_to_camel: 'asyncProgramming',
  output: 'export const asyncProgramming: Module = {...}'
}

cognitive_level_assignment: {
  foundation_only: true,
  levels: {
    0: 'ethics|values|core-principles|guardrails',
    1: 'reasoning|logic|systems-thinking|pattern-recognition',
    2: 'analysis|critical-thinking|synthesis|evaluation',
    3: 'decision-making|planning|resource-allocation',
    4: 'meta-cognition|self-assessment|reflection'
  },
  on_foundation_tier: 'MANDATORY_FIELD',
  on_other_tiers: 'OMIT_FIELD'
}
```

**Validation Checklist**:
- [ ] Module ID follows `{tier}/{category}/{name}` pattern
- [ ] All segments use kebab-case
- [ ] Export name is camelCase transformation of final segment
- [ ] Foundation modules include cognitiveLevel (0-4)
- [ ] Non-foundation modules omit cognitiveLevel

### Phase 3: Agent Invocation

**Template: module-generator Agent Call**:

```typescript
Task(
  subagent_type: "ums-v2-module-generator",
  description: "Generate {tier} tier module: {module_id}",
  prompt: `Create UMS v2.0 module with following specifications:

STRUCTURE:
- Module ID: {calculated_module_id}
- Export Name: {calculated_export_name}
- Tier: {tier}
- Domain: {domain}
{if foundation: '- Cognitive Level: {level}'}

REQUIREMENTS:
- Purpose: {user_stated_purpose}
- Components: {component_types}
- Capabilities: {capabilities_array}

CONTENT FOCUS:
{specific_content_requirements_from_user}

DELIVERABLES:
1. Create file at: instruct-modules-v2/modules/{tier}/{category}/{name}.module.ts
2. Use template for: {component_type}
3. Include rich metadata (semantic, tags, quality)
4. Add relationships if dependencies exist

VALIDATION:
- Export convention must match: export const {export_name}: Module
- schemaVersion must be "2.0"
- All required fields present
{if foundation: '- cognitiveLevel must be 0-4'}
`
)
```

**Expected Agent Output**:
- File written to correct path
- Spec-compliant TypeScript module
- Rich metadata populated
- Component structure valid

### Phase 4: Post-Creation Options

**Decision Tree**:
```typescript
post_creation_options: {
  validate: {
    action: 'Launch module-validator agent',
    template: 'VALIDATION_AGENT_CALL',
    when: 'User wants spec compliance check'
  },
  add_to_library: {
    action: 'Launch library-curator agent',
    template: 'CURATION_AGENT_CALL',
    when: 'User wants standard library inclusion'
  },
  create_persona: {
    action: 'Redirect to PERSONA_CREATION_WORKFLOW',
    template: 'PERSONA_WORKFLOW_INIT',
    when: 'User wants to use module immediately'
  },
  done: {
    action: 'Display summary and exit',
    template: 'COMPLETION_SUMMARY',
    when: 'User finished'
  }
}
```

**Options Template**:
```markdown
✅ Module created: {module_id}
📁 Path: {file_path}

**Next Steps**:

1. `/validate` - Check spec compliance
2. `/library` - Evaluate for standard library
3. `/persona` - Create persona using this module
4. `/done` - Complete

Selection: [validate|library|persona|done]
```

**Template: Validation Agent Call**:
```typescript
Task(
  subagent_type: "ums-v2-module-validator",
  description: "Validate {module_id}",
  prompt: `Validate module at: {file_path}

Provide:
- PASS/WARN/FAIL status
- Quality score (0-10)
- List of issues with severity
- Actionable recommendations

Format output using VALIDATION_RESULT_TEMPLATE.`
)
```

**Template: Curation Agent Call**:
```typescript
Task(
  subagent_type: "ums-v2-standard-library-curator",
  description: "Evaluate {module_id} for library inclusion",
  prompt: `Assess module at: {file_path}

Evaluate:
- Quality score
- Standard library fit
- Coverage gaps filled
- Organization placement
- Recommendation (add/defer/reject)

Format output using CURATION_RESULT_TEMPLATE.`
)
```

---

## PERSONA_CREATION_WORKFLOW

### Phase 1: Persona Requirements

**Input Patterns**:
| Pattern | Action |
|---------|--------|
| `/ums:create persona [name]` | Extract name, gather role/modules |
| `/ums:create persona [role description]` | Generate name from role |
| `/ums:create persona` | Interactive persona builder |

**Requirements Template**:
```markdown
**Persona Configuration**

1. **Name**: {persona_name}
   Format: PascalCase or Title Case

2. **Role**: {brief_role_description}
   What will this AI assistant do?

3. **Module Selection Method**:
   - `/search` - Search and select from library
   - `/browse` - Browse by tier
   - `/specify` - Provide module IDs directly

Current method: [search|browse|specify]
```

### Phase 2: Module Composition

**Module Selection Decision Tree**:

```typescript
module_selection_methods: {
  search: {
    prompt: 'Enter search query (e.g., "testing", "python async")',
    action: 'Execute search, display results with selection interface',
    output: 'Selected module IDs array'
  },

  browse: {
    workflow: [
      'Display tier list',
      'User selects tier(s)',
      'Display categories in tier',
      'User selects modules',
      'Add to composition'
    ],
    output: 'Selected module IDs array'
  },

  specify: {
    prompt: 'Enter module IDs (comma-separated or grouped)',
    validation: 'Check all module IDs exist in registry',
    error_handling: 'Report missing modules, suggest corrections',
    output: 'Validated module IDs array'
  }
}
```

**Grouping Decision**:
```typescript
grouping_strategy: {
  auto_group_by_tier: {
    when: 'modules span multiple tiers',
    groups: [
      {name: 'Foundation', ids: [...foundation_modules]},
      {name: 'Principles', ids: [...principle_modules]},
      {name: 'Technology', ids: [...technology_modules]},
      {name: 'Execution', ids: [...execution_modules]}
    ]
  },

  custom_groups: {
    when: 'user specifies logical groupings',
    example: [
      {name: 'Core Skills', ids: [...]},
      {name: 'Python Expertise', ids: [...]},
      {name: 'Deployment', ids: [...]}
    ]
  },

  flat_array: {
    when: 'small persona (<10 modules) or user preference',
    format: ['module-1', 'module-2', 'module-3']
  }
}
```

### Phase 3: Persona File Generation

**Persona Structure Template**:

```typescript
// Generated file structure
import type { Persona } from 'ums-lib';

export default {
  name: '{PersonaName}',
  version: '1.0.0',
  schemaVersion: '2.0',
  description: '{single_sentence_description}',
  semantic: '{keyword_rich_search_description}',

  // Option 1: Flat array
  modules: [
    'module-id-1',
    'module-id-2',
    'module-id-3'
  ],

  // Option 2: Grouped
  modules: [
    {
      group: 'Foundation',
      ids: ['foundation/module-1', 'foundation/module-2']
    },
    {
      group: 'Technology',
      ids: ['technology/module-1']
    }
  ]
} satisfies Persona;
```

**File Path Calculation**:
```typescript
persona_file_path: {
  pattern: './personas/{kebab-case-name}.persona.ts',
  example: './personas/backend-developer.persona.ts',
  validation: 'Ensure personas/ directory exists'
}
```

### Phase 4: Validation & Build Test

**Automatic Validation**:
```typescript
Task(
  subagent_type: "ums-v2-persona-validator",
  description: "Validate {persona_name}",
  prompt: `Validate persona at: {persona_file_path}

Checks:
- All module IDs exist in registry
- No duplicate modules
- Group structure valid (if grouped)
- Required metadata present
- Build compatibility test

Format output using PERSONA_VALIDATION_TEMPLATE.`
)
```

**Validation Result Template**:
```markdown
{if status === 'PASS':
  '✅ **Persona Validation: PASS**

  - Name: {persona_name}
  - Modules: {module_count}
  - Groups: {group_count || 'flat array'}
  - All modules found: ✓
  - No duplicates: ✓
  - Ready to build: ✓'
}

{if status === 'WARN':
  '⚠️ **Persona Validation: WARN**

  Warnings:
  {warnings.map(w => `- ${w.message}`)}

  Persona is buildable but has recommendations.
  Proceed? [yes|fix]'
}

{if status === 'FAIL':
  '❌ **Persona Validation: FAIL**

  Errors:
  {errors.map(e => `- ${e.message}`)}

  Actions:
  1. Fix errors manually
  2. Re-run validation
  3. Rebuild persona

  Select action: [fix|rebuild]'
}
```

---

## Output Formatting Templates

### MODULE_CREATION_SUMMARY

```markdown
✅ **Module Created Successfully**

**Module**: {module_id}
**Export**: `export const {export_name}: Module`
**Path**: `{file_path}`
**Tier**: {tier}
**Domain**: {domain}
{if foundation: '**Cognitive Level**: {level}'}

**Components**:
{components.map(c => `- ${c.type}: ${c.purpose || c.description}`)}

**Capabilities**: {capabilities.join(', ')}

**Metadata Quality**:
- Name: {metadata.name}
- Description: {metadata.description}
- Semantic: {metadata.semantic.length} keywords
- Tags: {metadata.tags.join(', ')}

**Next Steps**: [validate|library|persona|done]
```

### PERSONA_CREATION_SUMMARY

```markdown
✅ **Persona Created Successfully**

**Persona**: {persona.name}
**Version**: {persona.version}
**Path**: `{file_path}`

**Composition**:
- Total Modules: {total_module_count}
{if grouped:
  groups.map(g => `- ${g.name}: ${g.ids.length} modules`)
else:
  '- Flat array: ' + modules.length + ' modules'
}

**Module Breakdown by Tier**:
- Foundation: {foundation_count}
- Principle: {principle_count}
- Technology: {technology_count}
- Execution: {execution_count}

**Validation**: {validation_status}

**Build Test**:
```bash
copilot-instructions build --persona {file_path}
```

**Next Steps**: [build|validate|edit|done]
```

### VALIDATION_RESULT_TEMPLATE

```markdown
{status_emoji} **Validation: {status}**

**Quality Score**: {score}/10

{if status === 'PASS':
  '**All Checks Passed**:
  - Required fields: ✓
  - Export convention: ✓
  - Component structure: ✓
  - Metadata complete: ✓
  {if foundation: '- Cognitive level: ✓'}

  Module is spec-compliant and ready to use.'
}

{if status === 'WARN':
  '**Warnings** ({warning_count}):
  {warnings.map((w, i) => `${i+1}. [${w.severity}] ${w.message}
     Location: ${w.location}
     Fix: ${w.recommendation}`)}

  Module is usable but improvements recommended.'
}

{if status === 'FAIL':
  '**Errors** ({error_count}):
  {errors.map((e, i) => `${i+1}. [${e.severity}] ${e.message}
     Location: ${e.location}
     Required: ${e.requirement}
     Fix: ${e.recommendation}`)}

  Module cannot be used until errors are fixed.

  Actions:
  A. Show manual fix instructions
  B. Regenerate module with corrections

  Select: [A|B]'
}
```

### CURATION_RESULT_TEMPLATE

```markdown
**Library Curation Assessment**

**Module**: {module_id}
**Quality Score**: {quality_score}/10

**Assessment**:
- Uniqueness: {uniqueness_score}/10
- Usefulness: {usefulness_score}/10
- Quality: {quality_score}/10
- Coverage Gap: {fills_gap ? 'Yes - fills gap in ' + gap_area : 'No'}

**Recommendation**: {recommendation}

{if recommendation === 'ADD':
  '✅ **Add to Standard Library**

  Placement: instruct-modules-v2/modules/{tier}/{category}/
  Reason: {reasoning}

  Proceed with addition? [yes|no]'
}

{if recommendation === 'DEFER':
  '⏸️ **Defer Addition**

  Reason: {reasoning}
  Improvements needed:
  {improvements.map(i => `- ${i}`)}

  Revisit after improvements.'
}

{if recommendation === 'REJECT':
  '❌ **Not Recommended for Library**

  Reason: {reasoning}

  Module can still be used locally in personas.'
}
```

---

## Error Handling

### Common Error Scenarios

```typescript
error_handling: {
  module_id_conflict: {
    symptom: 'Module ID already exists',
    diagnostic: 'Check instruct-modules-v2/modules/{tier}/{category}/{name}.module.ts',
    fix: 'Suggest alternative name or offer to update existing',
    template: 'MODULE_CONFLICT_RESOLUTION'
  },

  invalid_tier: {
    symptom: 'Tier not recognized',
    diagnostic: 'Check tier value against [foundation, principle, technology, execution]',
    fix: 'Present tier selection menu',
    template: 'TIER_SELECTION_MENU'
  },

  missing_cognitive_level: {
    symptom: 'Foundation module without cognitiveLevel',
    diagnostic: 'tier === "foundation" && !cognitiveLevel',
    fix: 'Prompt for cognitive level (0-4)',
    template: 'COGNITIVE_LEVEL_SELECTION'
  },

  agent_generation_failure: {
    symptom: 'module-generator returns error',
    diagnostic: 'Check agent output for specific error',
    fix: 'Report error, offer retry with corrections or manual creation',
    template: 'AGENT_FAILURE_RECOVERY'
  },

  validation_failure: {
    symptom: 'module-validator returns FAIL',
    diagnostic: 'Parse validation errors',
    fix: 'Offer auto-fix or manual fix instructions',
    template: 'VALIDATION_FAILURE_RECOVERY'
  }
}
```

### Error Templates

**MODULE_CONFLICT_RESOLUTION**:
```markdown
⚠️ **Module ID Conflict**

Module already exists: {module_id}
Path: {existing_file_path}

Options:
1. **Rename**: Use different module ID (suggest: {alternative_names})
2. **Update**: Modify existing module
3. **View**: Show existing module content
4. **Cancel**: Abort creation

Select: [1|2|3|4]
```

**AGENT_FAILURE_RECOVERY**:
```markdown
❌ **Module Generation Failed**

Error: {error_message}

Diagnostic:
- Agent: module-generator
- Stage: {failed_stage}
- Reason: {failure_reason}

Recovery Options:
1. **Retry**: Attempt generation with corrections
2. **Manual**: Provide step-by-step manual creation guide
3. **Debug**: Show detailed agent output

Select: [retry|manual|debug]
```

---

## Implementation Checklist

### Command Handler
- [ ] Parse user input for type (module|persona) and description
- [ ] Route to MODULE_CREATION_WORKFLOW or PERSONA_CREATION_WORKFLOW
- [ ] Implement INTERACTIVE_TYPE_SELECTION for ambiguous input
- [ ] Handle error scenarios with recovery templates

### Module Creation Workflow
- [ ] Requirements extraction with decision tree
- [ ] Tier/domain/component detection from description
- [ ] Interactive requirements template for clarification
- [ ] Module ID and export name calculation
- [ ] Cognitive level assignment for foundation tier
- [ ] module-generator agent invocation with template
- [ ] Post-creation options menu
- [ ] Validation agent integration
- [ ] Curation agent integration

### Persona Creation Workflow
- [ ] Persona name and role extraction
- [ ] Module selection methods (search|browse|specify)
- [ ] Grouping strategy decision
- [ ] Persona file generation
- [ ] persona-validator agent invocation
- [ ] Build test execution

### Output Formatting
- [ ] MODULE_CREATION_SUMMARY template
- [ ] PERSONA_CREATION_SUMMARY template
- [ ] VALIDATION_RESULT_TEMPLATE formatting
- [ ] CURATION_RESULT_TEMPLATE formatting
- [ ] Error templates for all scenarios

### Agent Integration
- [ ] module-generator task invocation
- [ ] module-validator task invocation
- [ ] persona-validator task invocation
- [ ] library-curator task invocation
- [ ] Agent output parsing and formatting

### Validation
- [ ] All module IDs follow pattern validation
- [ ] Export name convention enforcement
- [ ] Foundation tier requires cognitiveLevel
- [ ] All persona module IDs exist in registry
- [ ] No duplicate modules in persona
- [ ] File paths calculated correctly

---

## Agent Dependencies

| Agent | When Used | Purpose |
|-------|-----------|---------|
| module-generator | Module creation (required) | Generate spec-compliant .module.ts file |
| module-validator | Post-creation validation (optional) | Check spec compliance, quality score |
| persona-validator | Persona creation (automatic) | Validate persona structure, module refs |
| library-curator | Library addition (optional) | Assess quality, recommend inclusion |

---

## Usage Examples

### Example 1: Quick Module Creation

```
User: /ums:create module for async programming in Python

[Requirements extraction]
Detected:
- Tier: technology (confidence: 0.95)
- Domain: python
- Component: instruction + knowledge

[Module structure calculation]
- Module ID: technology/python/async-programming
- Export Name: asyncProgramming
- Cognitive Level: N/A (not foundation)

[Agent invocation]
Launching module-generator...

[Agent output]
✅ Module Created Successfully
Module: technology/python/async-programming
Path: instruct-modules-v2/modules/technology/python/async-programming.module.ts

Next Steps: [validate|library|persona|done]

User: validate

[Validation agent]
✅ Validation: PASS
Quality Score: 9/10
All spec requirements met.
```

### Example 2: Interactive Module Creation

```
User: /ums:create testing module

[Clarification needed]
Testing module - need more details:

1. **Specific Focus**:
   - Test-Driven Development (TDD)
   - Unit testing
   - Integration testing
   - Test automation

2. **Tier**:
   - Principle (general methodology)
   - Technology (specific framework)
   - Execution (specific procedures)

3. **Domain**: language-agnostic or specific tech?

User: TDD, principle tier, language-agnostic

[Requirements confirmed]
- Tier: principle
- Category: testing
- Module ID: principle/testing/test-driven-development
- Export Name: testDrivenDevelopment
- Components: instruction + knowledge

Launching module-generator...

[Creation and validation flow continues]
```

### Example 3: Persona Creation

```
User: /ums:create persona Backend Developer

[Persona workflow]
Persona Configuration:
- Name: Backend Developer
- Role: Build robust server-side applications

Module Selection Method: [search|browse|specify]

User: search

Search query: backend api database

[Search results displayed]
Found 15 modules:
1. principle/api/rest-design
2. principle/api/error-handling
3. technology/nodejs/express-patterns
...

Select modules (comma-separated numbers): 1,2,3,5,8,12

[Grouping decision]
Auto-group by tier? [yes|no]

User: yes

[File generation]
✅ Persona Created Successfully

Persona: Backend Developer
Path: ./personas/backend-developer.persona.ts
Modules: 6 (grouped by tier)

Validation: PASS
Ready to build!
```

---

## Optimization Notes

**Token Efficiency**:
- Decision trees replace narrative prose (60% fewer tokens)
- Templates provide structured output (consistent, parseable)
- Error handling is lookup-based (symptom → fix)
- Agent invocations use structured prompts

**Execution Speed**:
- Requirements extraction uses keyword matching
- Module ID calculation is deterministic
- Validation is agent-delegated (parallel processing)
- Output formatting is template-based (instant)

**Maintainability**:
- All workflows in structured format
- Templates are version-controlled
- Decision trees are modifiable
- Agent interfaces are stable
