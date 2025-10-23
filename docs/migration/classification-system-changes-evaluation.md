# Classification System Changes - Component Evaluation

## Overview

This document evaluates the changes needed across all UMS components to support the new classification system with:
- **`cognitiveLevel`** (0-6, required) - Replaces the 4-tier system
- **`capabilities`** (required) - What the module helps accomplish
- **`domain`** (optional) - Where the module applies (technology/field)
- **`metadata.tags`** (optional) - Additional patterns and keywords

## Summary of Changes by Component

| Component | Files Affected | Complexity | Priority |
|-----------|---------------|------------|----------|
| **ums-lib** (Types) | 1 file | Low | P0 - Critical |
| **ums-lib** (Validation) | 2-3 files | Medium | P0 - Critical |
| **ums-lib** (Constants) | 1 file | Low | P1 - High |
| **ums-sdk** | 0-1 files | Low | P2 - Medium |
| **ums-cli** | 3-5 files | Medium | P1 - High |
| **Documentation** | 5-8 files | Medium | P2 - Medium |
| **Tests** | 10-20 files | High | P1 - High |
| **Migration Docs** | 2 files | Medium | P2 - Medium |

---

## 1. ums-lib Package Changes

### 1.1 Type Definitions (`packages/ums-lib/src/types/index.ts`)

**Status**: ⚠️ **NEEDS UPDATE**

**Current State**:
```typescript
export interface Module {
  // ...
  cognitiveLevel?: number;  // ❌ Optional, 0-4 range
  // ...
}
```

**Required Changes**:
```typescript
export interface Module {
  // ...
  cognitiveLevel: number;  // ✅ Required, 0-6 range
  // ...
}
```

**Impact**:
- **Breaking change** - all modules must now have `cognitiveLevel`
- **Type validation** - TypeScript will enforce this at compile time
- **Documentation comments** - update JSDoc to reflect 0-6 range and semantics

**Specific Updates**:
```typescript
export interface Module {
  /** The unique identifier for the module */
  id: string;
  /** The semantic version of the module content */
  version: string;
  /** The UMS specification version. Must be "2.0" */
  schemaVersion: string;
  /** Functional capabilities this module provides (what it helps accomplish) */
  capabilities: string[];
  /** Cognitive abstraction level (0-6):
   *  0=Axioms & Ethics, 1=Reasoning Frameworks, 2=Universal Patterns,
   *  3=Domain-Specific Guidance, 4=Procedures & Playbooks,
   *  5=Specifications & Standards, 6=Meta-Cognition */
  cognitiveLevel: number;  // ✅ Now required, 0-6
  /** Human-readable and AI-discoverable metadata */
  metadata: ModuleMetadata;
  /** Technology or field this module applies to (where it's used) */
  domain?: string | string[];
  // ... rest of fields
}
```

**Lines to Change**: ~24-25

**Files**:
- `packages/ums-lib/src/types/index.ts`

---

### 1.2 Constants (`packages/ums-lib/src/constants.ts`)

**Status**: ⚠️ **NEEDS UPDATE**

**Current State**:
```typescript
export const TAG_CATEGORIES = {
  capabilities: [...],
  domains: [...],
  patterns: [...],
  levels: ['foundational', 'intermediate', 'advanced', 'specialized'],
} as const;
```

**Decision**:
- **REMOVE** `TAG_CATEGORIES` constant entirely
- No longer needed since we have separate first-class fields

**Impact**:
- Remove ~35 lines of code
- Simplify the codebase
- Remove implied validation constraints on tag values

**Files**:
- `packages/ums-lib/src/constants.ts` (lines 24-60)

---

### 1.3 Validation (`packages/ums-lib/src/core/validation/`)

**Status**: ⚠️ **NEEDS UPDATE**

**Current Validation Logic**:
- `cognitiveLevel` is optional
- Range check for 0-4
- No validation that it's present

**Required Changes**:

1. **Make `cognitiveLevel` required**:
```typescript
// In module validator
if (module.cognitiveLevel === undefined) {
  errors.push({
    path: 'cognitiveLevel',
    message: 'cognitiveLevel is required',
    section: '2.1'
  });
}
```

2. **Update range validation**:
```typescript
// Old: 0-4 range
if (cognitiveLevel < 0 || cognitiveLevel > 4) {
  // error
}

// New: 0-6 range
if (cognitiveLevel < 0 || cognitiveLevel > 6) {
  errors.push({
    path: 'cognitiveLevel',
    message: 'cognitiveLevel must be between 0 and 6',
    section: '2.1'
  });
}
```

3. **Type validation** (ensure it's an integer):
```typescript
if (!Number.isInteger(module.cognitiveLevel)) {
  errors.push({
    path: 'cognitiveLevel',
    message: 'cognitiveLevel must be an integer',
    section: '2.1'
  });
}
```

**Files**:
- `packages/ums-lib/src/core/validation/module-validator.ts`
- `packages/ums-lib/src/core/validation/module-validator.test.ts` (update test cases)

**Test Cases to Add/Update**:
- ✅ Module with `cognitiveLevel: 0` (valid)
- ✅ Module with `cognitiveLevel: 6` (valid)
- ❌ Module without `cognitiveLevel` (invalid)
- ❌ Module with `cognitiveLevel: 7` (invalid)
- ❌ Module with `cognitiveLevel: -1` (invalid)
- ❌ Module with `cognitiveLevel: 2.5` (invalid - not integer)
- ❌ Module with `cognitiveLevel: "2"` (invalid - not number)

---

## 2. ums-sdk Package Changes

### 2.1 API Functions

**Status**: ✅ **LIKELY NO CHANGES**

The SDK mostly delegates to ums-lib, so changes to types will flow through automatically. However, check:

**Files to Review**:
- `packages/ums-sdk/src/api/high-level-api.ts` - Check if any filtering logic uses `cognitiveLevel`

**Potential Impact**:
- If SDK has helper functions that filter by cognitive level, update range checks

---

## 3. ums-cli Package Changes

### 3.1 List Command (`packages/ums-cli/src/commands/list.ts`)

**Status**: ⚠️ **NEEDS UPDATE**

**Current State**:
- No cognitive level filtering
- Uses tier-based filtering (removed)

**Required Changes**:

1. **Add `--level` option**:
```typescript
program
  .command('list')
  .option('-l, --level <level>', 'Filter by cognitive level (0-6)')
  .option('-c, --capability <capabilities>', 'Filter by capabilities (comma-separated)')
  .option('-d, --domain <domains>', 'Filter by domains (comma-separated)')
  .option('-t, --tag <tags>', 'Filter by tags (comma-separated)')
  .action(async (options) => {
    // Filter logic
  });
```

2. **Update table columns** (optional enhancement):
```typescript
const table = new Table({
  head: ['ID', 'Name', 'Level', 'Capabilities', 'Domain', 'Tags'],
  colWidths: [28, 22, 8, 20, 15, 20],
});
```

3. **Add filtering logic**:
```typescript
let filtered = modules;

if (options.level !== undefined) {
  const level = parseInt(options.level);
  if (isNaN(level) || level < 0 || level > 6) {
    console.error('Error: Level must be between 0 and 6');
    process.exit(1);
  }
  filtered = filtered.filter(m => m.cognitiveLevel === level);
}

if (options.capability) {
  const capabilities = options.capability.split(',').map(s => s.trim());
  filtered = filtered.filter(m =>
    capabilities.some(c => m.capabilities.includes(c))
  );
}

if (options.domain) {
  const domains = options.domain.split(',').map(s => s.trim());
  filtered = filtered.filter(m => {
    if (!m.domain) return false;
    const moduleDomains = Array.isArray(m.domain) ? m.domain : [m.domain];
    return domains.some(d => moduleDomains.includes(d));
  });
}

if (options.tag) {
  const tags = options.tag.split(',').map(s => s.trim());
  filtered = filtered.filter(m =>
    tags.some(t => m.metadata.tags?.includes(t))
  );
}
```

**Files**:
- `packages/ums-cli/src/commands/list.ts`
- `packages/ums-cli/src/commands/list.test.ts`

---

### 3.2 Search Command (`packages/ums-cli/src/commands/search.ts`)

**Status**: ⚠️ **NEEDS UPDATE**

**Similar changes to list command**:
- Add `--level`, `--capability`, `--domain`, `--tag` options
- Update filtering logic
- Update table display

**Files**:
- `packages/ums-cli/src/commands/search.ts`
- `packages/ums-cli/src/commands/search.test.ts`

---

### 3.3 Validate Command (`packages/ums-cli/src/commands/validate.ts`)

**Status**: ⚠️ **NEEDS UPDATE**

**Required Changes**:
- Update error messages to reflect new `cognitiveLevel` requirements
- Add specific validation feedback for 0-6 range

**Example Output**:
```
❌ Module: example-module
  Error: cognitiveLevel is required
  Error: cognitiveLevel must be between 0 and 6 (found: 7)
```

**Files**:
- `packages/ums-cli/src/commands/validate.ts`

---

### 3.4 CLI Index (`packages/ums-cli/src/index.ts`)

**Status**: ⚠️ **NEEDS UPDATE**

**Required Changes**:
- Update help text to reflect new classification fields
- Update version references (already done in previous work)

---

## 4. Documentation Changes

### 4.1 Migration Documentation

**Status**: ⚠️ **NEEDS UPDATE**

**Files**:
- `docs/migration/tier-to-tags.md` - Update to reflect `cognitiveLevel` system
- `docs/migration/tag-system-implementation-summary.md` - Update with new classification approach

**Required Updates**:

1. **Rename/Refactor**: `tier-to-tags.md` → `tier-to-cognitive-levels.md`

2. **Document the mapping**:
```markdown
## Old Tier System → New Cognitive Level

| Old Tier | New Cognitive Level | Rationale |
|----------|---------------------|-----------|
| foundation (0-4) | 0-2 | Axioms, reasoning, universal patterns |
| principle | 2-3 | Universal and domain-specific patterns |
| technology | 3-5 | Domain guidance, procedures, specs |
| execution | 4-5 | Procedures and specifications |

Note: This is a rough guide. Each module should be individually evaluated.
```

3. **Add classification decision tree**:
```markdown
## How to Classify Your Module

Ask yourself:

1. **Is this an ethical principle or universal truth?** → Level 0
2. **Does this teach how to think or reason?** → Level 1
3. **Is this a universal pattern (works everywhere)?** → Level 2
4. **Is this domain-specific but technology-agnostic?** → Level 3
5. **Is this a step-by-step procedure?** → Level 4
6. **Is this a precise specification or checklist?** → Level 5
7. **Does this involve self-reflection or meta-cognition?** → Level 6
```

---

### 4.2 Architecture Documentation

**Status**: ⚠️ **NEEDS REVIEW**

**Files to Review**:
- `docs/architecture/ums-lib/01-overview.md`
- `docs/architecture/ums-lib/02-component-model.md`
- `docs/architecture/ums-lib/04-api-specification.md`

**Check for**:
- References to optional `cognitiveLevel`
- References to 0-4 range
- Any tier-system language

---

### 4.3 Other Specs

**Status**: ⚠️ **NEEDS REVIEW**

**Files**:
- `docs/spec/ums_authoring_sdk_v1_spec.md`
- `docs/spec/ums_sdk_v1_spec.md`
- `docs/spec/module-definition-tools-spec.md`

**Check for**:
- Consistency with new classification system
- Update examples to use `cognitiveLevel: 0-6`
- Update type definitions if embedded

---

## 5. Test Updates

### 5.1 Unit Tests

**Affected Test Files**:
- `packages/ums-lib/src/core/validation/module-validator.test.ts`
- `packages/ums-lib/src/types/index.test.ts` (if exists)
- `packages/ums-cli/src/commands/list.test.ts`
- `packages/ums-cli/src/commands/search.test.ts`
- `packages/ums-cli/src/commands/validate.test.ts`
- `packages/ums-sdk/src/loaders/*.test.ts`

**Required Changes**:

1. **Update all test fixtures** to include `cognitiveLevel`
2. **Add new validation tests** for 0-6 range
3. **Remove old tier-based tests**
4. **Update expected error messages**

**Example Test Update**:
```typescript
// Old test
it('should validate module with optional cognitiveLevel', () => {
  const module = {
    id: 'test',
    version: '1.0.0',
    schemaVersion: '2.0',
    capabilities: ['testing'],
    // cognitiveLevel omitted - should pass
  };
  const result = validateModule(module);
  expect(result.valid).toBe(true);
});

// New test
it('should reject module without cognitiveLevel', () => {
  const module = {
    id: 'test',
    version: '1.0.0',
    schemaVersion: '2.0',
    capabilities: ['testing'],
    // cognitiveLevel omitted - should fail
  };
  const result = validateModule(module);
  expect(result.valid).toBe(false);
  expect(result.errors).toContainEqual(
    expect.objectContaining({
      path: 'cognitiveLevel',
      message: 'cognitiveLevel is required'
    })
  );
});

it('should accept cognitive levels 0-6', () => {
  for (let level = 0; level <= 6; level++) {
    const module = {
      id: 'test',
      version: '1.0.0',
      schemaVersion: '2.0',
      capabilities: ['testing'],
      cognitiveLevel: level,
      metadata: { name: 'Test', description: 'Test', semantic: 'Test' }
    };
    const result = validateModule(module);
    expect(result.valid).toBe(true);
  }
});

it('should reject cognitive level 7', () => {
  const module = {
    id: 'test',
    version: '1.0.0',
    schemaVersion: '2.0',
    capabilities: ['testing'],
    cognitiveLevel: 7,
    metadata: { name: 'Test', description: 'Test', semantic: 'Test' }
  };
  const result = validateModule(module);
  expect(result.valid).toBe(false);
  expect(result.errors).toContainEqual(
    expect.objectContaining({
      path: 'cognitiveLevel',
      message: expect.stringContaining('0 and 6')
    })
  );
});
```

---

### 5.2 Integration Tests

**Files to Check**:
- Any E2E tests that build personas
- Any tests that validate complete workflows

**Required Changes**:
- Update all test modules to include `cognitiveLevel`
- Update expected build outputs

---

## 6. Example Modules

### 6.1 Standard Library Modules

**Status**: ⚠️ **NEEDS UPDATE**

**All standard library modules must be updated to include `cognitiveLevel`**.

**Approach**:
1. Audit all modules in `instructions-modules/` or wherever standard library lives
2. Classify each module using the 0-6 hierarchy
3. Add `cognitiveLevel` field
4. Update `capabilities` and `tags` to follow new distinctions

**Example Classification**:
```typescript
// Before
export const doNoHarm: Module = {
  id: 'foundation/ethics/do-no-harm',
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['ethics'],
  metadata: {
    name: 'Do No Harm',
    description: 'Prioritize safety and avoid causing harm',
    semantic: 'Ethics, harm prevention, safety...'
  }
};

// After
export const doNoHarm: Module = {
  id: 'ethics/do-no-harm',  // Could simplify ID
  version: '1.0.0',
  schemaVersion: '2.0',
  capabilities: ['ethical-decision-making'],
  cognitiveLevel: 0,  // ✅ Axiom & Ethics
  domain: 'universal',
  metadata: {
    name: 'Do No Harm',
    description: 'Prioritize safety and avoid causing harm',
    semantic: 'Ethics, harm prevention, safety, ethical principles...',
    tags: ['ethics', 'safety', 'principles']
  }
};
```

---

## 7. Breaking Changes & Migration Path

### 7.1 Breaking Changes

1. **`cognitiveLevel` now required** - All modules must specify a level
2. **Range changed from 0-4 to 0-6** - Need to re-classify existing modules
3. **`TAG_CATEGORIES` constant removed** - Any code referencing it will break

### 7.2 Migration Path

**Phase 1: Update Types & Validation**
- Update `ums-lib` types
- Update validation logic
- Update constants
- **Status**: Breaking change to library

**Phase 2: Update Implementation**
- Update CLI commands
- Update SDK (if needed)
- **Status**: Breaking change to CLI

**Phase 3: Update Content**
- Update all standard library modules
- Update all test fixtures
- Update documentation
- **Status**: Content migration

**Phase 4: Verify**
- Run full test suite
- Build and validate all personas
- Generate migration report

### 7.3 Automated Migration Tool (Optional)

Consider creating a migration script:

```typescript
// scripts/migrate-to-cognitive-levels.ts

/**
 * Automatically adds cognitiveLevel to modules based on heuristics:
 * - If ID starts with "foundation/" → suggest level 0-1
 * - If ID starts with "principle/" → suggest level 2-3
 * - If ID starts with "technology/" → suggest level 3-5
 * - If ID starts with "execution/" → suggest level 4-5
 *
 * Generates a review file for manual verification
 */
```

---

## 8. Implementation Checklist

### Priority 0 (Critical - Must Do First)
- [ ] Update `Module` interface in `packages/ums-lib/src/types/index.ts`
- [ ] Update validation logic in `packages/ums-lib/src/core/validation/module-validator.ts`
- [ ] Add validation tests for cognitive level 0-6 range
- [ ] Update all test fixtures to include `cognitiveLevel`

### Priority 1 (High - Core Functionality)
- [ ] Remove `TAG_CATEGORIES` constant from `packages/ums-lib/src/constants.ts`
- [ ] Update CLI `list` command with new filtering options
- [ ] Update CLI `search` command with new filtering options
- [ ] Update all CLI tests
- [ ] Update migration documentation

### Priority 2 (Medium - User Experience)
- [ ] Update all architecture documentation
- [ ] Update all spec documentation
- [ ] Review and update ADRs if needed
- [ ] Update example modules in spec
- [ ] Create classification decision tree documentation

### Priority 3 (Low - Nice to Have)
- [ ] Create automated migration tool
- [ ] Add cognitive level statistics to `list` command
- [ ] Add cognitive level visualization
- [ ] Create comprehensive examples for each level 0-6

---

## 9. Estimated Effort

| Component | Estimated Effort | Risk Level |
|-----------|-----------------|------------|
| Type Updates | 2 hours | Low |
| Validation Logic | 4 hours | Medium |
| CLI Updates | 8 hours | Medium |
| Test Updates | 12 hours | Medium |
| Documentation | 8 hours | Low |
| Standard Library Migration | 16 hours | High |
| **Total** | **~50 hours** | **Medium** |

**Risk Factors**:
- Standard library migration requires careful manual classification
- Breaking changes require coordination if multiple people are developing modules
- Test suite may reveal edge cases requiring additional work

---

## 10. Validation Strategy

After implementing changes:

1. **Type Safety**: Run `npm run typecheck` across all packages
2. **Unit Tests**: Run `npm test` - all tests must pass
3. **Validation**: Run `copilot-instructions validate --all`
4. **Build**: Build sample personas and verify output
5. **Integration**: Test full workflow end-to-end

---

## Conclusion

The migration from the 4-tier system to the 0-6 cognitive level hierarchy is a **significant but well-scoped change**. The main challenges are:

1. **Making `cognitiveLevel` required** - breaking change
2. **Updating validation** - straightforward but critical
3. **Migrating standard library** - time-consuming but necessary
4. **Testing thoroughly** - essential for confidence

The benefits are clear:
- ✅ More granular classification
- ✅ Clear semantics for all module types
- ✅ Better discoverability
- ✅ Simplified system (no more TAG_CATEGORIES)
- ✅ Universal applicability

**Recommendation**: Proceed with implementation in phases, starting with P0 items.
