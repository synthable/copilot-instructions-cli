# Command: /ums:curate

Evaluate and manage standard library modules.

## Your Task

Manage the standard library by:

1. Evaluating modules for inclusion
2. Organizing library structure
3. Generating library metrics
4. Maintaining quality standards

## Usage

```
/ums:curate add path/to/module.module.ts
/ums:curate remove module-id
/ums:curate evaluate path/to/module.module.ts
/ums:curate metrics
/ums:curate organize foundation
```

## Workflows

### Add Module to Library

```typescript
Task(
  subagent_type: "library-curator",
  description: "Evaluate module for standard library",
  prompt: `Evaluate the module at [path] for standard library inclusion.

Assess:
1. Quality (meets standards?)
2. Applicability (widely useful?)
3. Completeness (well-documented?)
4. Uniqueness (fills a gap?)
5. Relationships (dependencies clear?)

Provide inclusion recommendation with rationale.`
)
```

### Generate Metrics

```typescript
Task(
  subagent_type: "library-curator",
  description: "Generate library metrics",
  prompt: `Generate comprehensive metrics for the standard library:

Report:
- Total modules by tier
- Cognitive level distribution (foundation)
- Quality indicators (avg confidence, maturity)
- Coverage gaps
- Module relationships
- Usage in personas

Provide recommendations for library growth.`
)
```

### Organize Library

```typescript
Task(
  subagent_type: "library-curator",
  description: "Organize library tier",
  prompt: `Review and organize the [tier] tier of the standard library.

Tasks:
1. Verify category structure
2. Check module placement
3. Ensure consistent quality
4. Identify gaps
5. Suggest improvements

Provide reorganization recommendations.`
)
```

## Example Outputs

```markdown
✅ **Library Curation: Add Module**

**Module**: technology/python/async-programming
**Evaluation**: APPROVED for standard library

**Assessment:**

- Quality: 9/10 (excellent documentation, clear examples)
- Applicability: High (Python widely used)
- Uniqueness: Fills gap in async patterns
- Completeness: Comprehensive coverage
- Relationships: No conflicts, recommends 2 existing modules

**Action**: Module added to standard library
**Location**: instruct-modules-v2/modules/technology/python/async-programming.module.ts
**Catalog**: Updated with new entry

**Next Steps:**

- Module is now available in standard library
- Can be referenced in personas
- Will appear in module discovery
```

## Agent Dependencies

- **Primary**: library-curator (required)
- **Supporting**: module-validator (for quality checks)

Remember: Maintain high standards for library inclusion - quality over quantity.
