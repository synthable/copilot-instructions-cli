# Command: /ums:validate-persona

Validate a UMS v2.0 persona file for specification compliance and quality.

## Your Task

Validate persona files by:

1. Identifying which persona(s) to validate
2. Launching the persona-validator agent
3. Presenting composition analysis
4. Suggesting improvements

## Usage

```
/ums:validate-persona path/to/persona.persona.ts
/ums:validate-persona systems-architect
/ums:validate-persona all
```

## Workflow

### Step 1: Identify Target

**Specific persona:** Use provided path
**By name:** Search in `instruct-modules-v2/personas/{name}.persona.ts`
**All personas:** Glob `instruct-modules-v2/personas/*.persona.ts`

### Step 2: Launch Validator

```typescript
Task(
  subagent_type: "persona-validator",
  description: "Validate UMS v2.0 persona",
  prompt: `Validate the persona file at: [path]

Provide detailed analysis:
- Spec compliance (required fields, structure)
- Module composition correctness
- Duplicate detection
- Identity quality assessment
- Tier distribution analysis
- Module relationship validation
- Quality score and recommendations`
)
```

### Step 3: Present Results

**Example Output:**

```markdown
✅ **Persona Validation: PASS**

**Persona**: Systems Architect
**Version**: 1.0.0
**Total Modules**: 12
**Status**: Spec-compliant, production-ready

**Module Composition:**

- Foundation: 3 modules (25%)
- Principle: 5 modules (42%)
- Technology: 2 modules (17%)
- Execution: 2 modules (17%)

**Quality Assessment:**

- Identity: 9/10 (Clear voice and capabilities)
- Module Selection: 9/10 (Excellent coverage)
- Semantic Richness: 8/10 (Good keywords)

**Validation Results:**

- [x] Required fields present
- [x] No duplicate module IDs
- [x] Module composition valid
- [x] Export convention followed

⚠️ **Recommendations:**

1. Consider adding more execution tier modules for practical guidance
2. Enhance semantic description with technical terms

Overall: Excellent persona, ready for production use.
```

## Agent Dependencies

- **Primary**: persona-validator (required)

Remember: Focus on composition quality and tier balance in addition to spec compliance.
