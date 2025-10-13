# Command: /ums:validate-module

Validate a UMS v2.0 module file for specification compliance.

## Your Task

Validate one or more module files against the UMS v2.0 specification by:
1. Identifying which module(s) to validate
2. Launching the module-validator agent
3. Presenting results clearly
4. Suggesting fixes for any issues

## Usage Patterns

### Pattern 1: Validate Specific Module
```
/ums:validate-module path/to/module.module.ts
```

### Pattern 2: Validate All Modules
```
/ums:validate-module all
/ums:validate-module *
/ums:validate-module instruct-modules-v2/modules/
```

### Pattern 3: Validate by Tier
```
/ums:validate-module foundation
/ums:validate-module principle tier
/ums:validate-module technology/typescript
```

## Workflow

### Step 1: Identify Target

Determine what needs validation:

**If user provides path:**
- Use the provided path directly

**If user says "all" or "*":**
- Use Glob to find all `.module.ts` files
- Default path: `instruct-modules-v2/modules/**/*.module.ts`

**If user specifies tier/category:**
- Build path: `instruct-modules-v2/modules/{tier}/**/*.module.ts`

**If no argument provided:**
- Ask user what to validate

### Step 2: Launch Validator

Use Task tool to launch the module-validator agent:

```typescript
// For single module
Task(
  subagent_type: "module-validator",
  description: "Validate UMS v2.0 module",
  prompt: `Validate the UMS v2.0 module file at: [path]

Provide a detailed validation report including:
- Spec compliance status (PASS/WARNINGS/FAIL)
- Required field checks
- Export naming convention verification
- Component structure validation
- Metadata quality assessment
- Specific errors and warnings
- Actionable recommendations`
)

// For multiple modules
Task(
  subagent_type: "module-validator",
  description: "Validate multiple UMS v2.0 modules",
  prompt: `Validate all UMS v2.0 module files in: [path]

For each module, check:
- Spec compliance
- Required fields
- Export conventions
- Component structure
- Metadata quality

Provide a summary report with:
- Total modules validated
- Pass/Warning/Fail counts
- List of modules with issues
- Recommended fixes`
)
```

### Step 3: Present Results

Format results clearly based on validation outcome:

**Single Module - PASS:**
```markdown
✅ **Module Validation: PASS**

**Module**: foundation/ethics/do-no-harm
**File**: instruct-modules-v2/modules/foundation/ethics/do-no-harm.module.ts
**Version**: 1.0.0
**Schema**: 2.0

**Validation Results:**
- [x] File structure valid
- [x] Required fields present
- [x] Export convention followed
- [x] Component structure valid
- [x] Metadata complete

**Quality Score**: 9/10

This module is fully spec-compliant and ready to use.
```

**Single Module - WARNINGS:**
```markdown
⚠️ **Module Validation: PASS WITH WARNINGS**

**Module**: principle/testing/unit-testing
**Status**: Spec-compliant with recommendations

**Warnings (2):**
1. Missing recommended field: `cognitiveLevel` (foundation modules should specify)
2. Semantic metadata could be more keyword-rich (current: 45 chars, recommended: 100+)

**Recommendations:**
1. Add `cognitiveLevel: 1` to place in cognitive hierarchy
2. Enhance semantic field with more keywords:
   ```typescript
   semantic: "Unit testing, isolated testing, test suites, mocking, stubbing, TDD, red-green-refactor, automated testing, regression prevention"
   ```

Would you like me to help fix these issues?
```

**Single Module - FAIL:**
```markdown
❌ **Module Validation: FAIL**

**Module**: Invalid Module
**Errors**: 3 critical issues found

**Critical Errors:**
1. ❌ Missing required field: `schemaVersion`
   - Location: Root level
   - Fix: Add `schemaVersion: "2.0"`

2. ❌ Invalid module ID format: `ErrorHandling`
   - Location: `id` field
   - Current: `"ErrorHandling"`
   - Expected: `"error-handling"` (kebab-case)
   - Fix: Change to lowercase kebab-case

3. ❌ Export name doesn't match convention
   - Current export: `export const ErrorModule`
   - Expected export: `export const errorHandling`
   - Fix: Use camelCase transformation of final segment

**Action Required:**
This module cannot be used until these errors are fixed.

Would you like me to:
A) Show you how to fix these manually
B) Regenerate the module with correct structure
```

**Multiple Modules - Summary:**
```markdown
📊 **Module Validation Summary**

**Total Modules**: 12
- ✅ 9 PASS (75%)
- ⚠️ 2 WARNINGS (17%)
- ❌ 1 FAIL (8%)

**Modules with Issues:**

**Warnings:**
1. `principle/testing/unit-testing`
   - Missing cognitiveLevel
   - Sparse semantic metadata

2. `technology/python/async-programming`
   - No quality metadata

**Failures:**
1. `foundation/reasoning/critical-thinking`
   - Missing schemaVersion
   - Invalid export name

**Recommended Actions:**
1. Fix the 1 failing module immediately
2. Address warnings to improve quality
3. Run `/ums:audit` for comprehensive assessment

Would you like details on any specific module?
```

## Examples

### Example 1: Validate Single Module

```
User: /ums:validate-module instruct-modules-v2/modules/foundation/ethics/do-no-harm.module.ts

You: Validating do-no-harm module...

[Launch module-validator agent]

You: ✅ Validation complete!

**Module**: foundation/ethics/do-no-harm
**Status**: PASS - Fully spec-compliant
**Quality**: 10/10

All checks passed. This module is production-ready.
```

### Example 2: Validate All Foundation Modules

```
User: /ums:validate-module foundation

You: Validating all foundation tier modules...

[Discover modules with Glob]

Found 9 foundation modules. Running validation...

[Launch module-validator for batch]

You: 📊 Foundation Tier Validation Complete

**Total**: 9 modules
- ✅ 8 PASS
- ⚠️ 1 WARNING

**Warning**:
- `foundation/analysis/root-cause-analysis`: Missing quality metadata

Overall: Foundation tier is in excellent shape!

Would you like to see the detailed report or fix the warning?
```

### Example 3: No Path Provided

```
User: /ums:validate-module

You: I'll help you validate module(s). What would you like to validate?

Options:
1. **Specific module**: Provide the file path
2. **All modules**: Type "all" or "*"
3. **By tier**: Specify tier (foundation, principle, technology, execution)
4. **By category**: Specify path like "technology/typescript"

Example: `/ums:validate-module all`
```

## Error Handling

**Module file not found:**
```markdown
❌ Module file not found: [path]

Did you mean one of these?
- instruct-modules-v2/modules/foundation/ethics/do-no-harm.module.ts
- instruct-modules-v2/modules/principle/testing/test-driven-development.module.ts

Or use `/ums:validate-module all` to validate all modules.
```

**Invalid file format:**
```markdown
❌ File is not a UMS v2.0 module file

Expected: `.module.ts` file
Received: [filename]

Module files must:
1. End with `.module.ts`
2. Export a named const matching camelCase convention
3. Conform to UMS v2.0 Module interface
```

## Tips

1. **Use Glob for Discovery**: When path is ambiguous, use Glob to find matching files
2. **Provide Context**: Always show the file path being validated
3. **Suggest Fixes**: For errors, provide concrete fix suggestions
4. **Offer Actions**: After showing results, ask if user wants help fixing issues
5. **Batch Efficiently**: For multiple modules, summarize instead of detailed reports for each

## Agent Dependencies

- **Primary**: module-validator (required)
- **Optional**: module-generator (if user wants to regenerate)

Remember: Your goal is to make validation results clear and actionable. Always provide specific guidance on how to resolve issues.
