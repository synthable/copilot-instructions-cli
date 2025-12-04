# Migration Guide: UMS v2.1 → v2.2

**Target Audience**: Module authors, tool developers
**Effort Level**: Low (non-breaking changes only)
**Estimated Time**: 5-15 minutes per module

---

## 1. Overview

UMS v2.2 is a **non-breaking enhancement release** that adds optional features for improved tooling, type safety, and forward compatibility with v3.0's RAG architecture.

### 1.1. What Changed

✅ **Added (Optional)**:

- Component-level `id` field
- Component-level `tags` field
- `.d.ts` type definition generation
- Primitive concept documentation (implementation optional)

❌ **Not Changed**:

- All v2.1 modules work without modification
- No breaking changes to module structure
- No breaking changes to build process
- No breaking changes to personas

### 1.2. Migration Strategy

**Recommended**: Gradual adoption

- Update `schemaVersion` to `"2.2"` immediately
- Add new features incrementally as needed
- No rush - v2.1 modules remain fully compatible

---

## 2. Step-by-Step Migration

### Step 1: Update Schema Version

**Required**: Yes
**Effort**: Trivial

Change `schemaVersion` from `"2.1"` to `"2.2"` in all modules:

```typescript
// Before (v2.1)
export const myModule: Module = {
  id: "my-module",
  version: "1.0.0",
  schemaVersion: "2.1", // ← Update this
  // ...
};

// After (v2.2)
export const myModule: Module = {
  id: "my-module",
  version: "1.0.0",
  schemaVersion: "2.2", // ← Changed
  // ...
};
```

### Step 2: Add Component IDs (Optional)

**Required**: No
**Effort**: Low
**Benefit**: Enables stable URI addressing (useful for future RAG features)

Add an `id` field to components that you want to reference by URI:

```typescript
// v2.1 (works in v2.2)
instruction: {
  purpose: 'Deploy application to production',
  process: [...]
}

// v2.2 (with ID)
instruction: {
  id: 'production-deployment',  // ← Added
  purpose: 'Deploy application to production',
  process: [...]
}
```

**Naming Convention**:

- Use `kebab-case`
- Be descriptive but concise
- Unique within the module
- Examples: `security-baseline`, `cicd-workflow`, `advanced-examples`

### Step 3: Add Component Tags (Optional)

**Required**: No
**Effort**: Low
**Benefit**: Fine-grained categorization for filtering and search

Add `tags` array to components for categorization:

```typescript
// v2.1 (works in v2.2)
instruction: {
  purpose: 'Deploy to production',
  process: [...]
}

// v2.2 (with tags)
instruction: {
  tags: ['production', 'critical', 'automated'],  // ← Added
  purpose: 'Deploy to production',
  process: [...]
}
```

**Tag Guidelines**:

- Use lowercase, kebab-case
- Be specific and meaningful
- Common tags: `production`, `development`, `critical`, `optional`, `advanced`, `beginner`

### Step 4: Generate Type Definitions (Optional)

**Required**: No (for consumers)
**Effort**: Minimal (automatic)
**Benefit**: Better IDE experience for users of your modules

If publishing modules to a registry or shared library, generate `.d.ts` files:

```bash
# Using ums-cli
ums build --emit-declarations ./modules/**/*.module.ts

# Or configure in tsconfig.json
{
  "compilerOptions": {
    "declaration": true,
    "emitDeclarationOnly": true
  }
}
```

**Generated Output**:

```typescript
// my-module.module.d.ts (generated)
import type { Module } from "ums-lib";

/**
 * My Module
 *
 * Brief description of what this module does
 */
export declare const myModule: Module;
```

---

## 3. Complete Migration Example

### Before (v2.1)

```typescript
// database-setup.module.ts
import { Module, ComponentType, CognitiveLevel } from "ums-lib";

export const databaseSetup: Module = {
  id: "database-setup",
  version: "1.0.0",
  schemaVersion: "2.1",
  capabilities: ["database", "devops"],
  cognitiveLevel: CognitiveLevel.PROCEDURES_AND_PLAYBOOKS,

  metadata: {
    name: "Database Setup",
    description: "Configure and deploy PostgreSQL database",
    semantic: "PostgreSQL setup, database configuration, deployment automation",
  },

  instruction: {
    purpose: "Set up PostgreSQL database for production",
    process: [
      "Install PostgreSQL",
      "Configure connection pool",
      "Run migrations",
    ],
    constraints: [
      "MUST use SSL in production",
      "MUST enable connection pooling",
    ],
  },
};
```

### After (v2.2 with all features)

```typescript
// database-setup.module.ts
import { Module, ComponentType, CognitiveLevel } from "ums-lib";

export const databaseSetup: Module = {
  id: "database-setup",
  version: "1.1.0", // Minor bump for feature additions
  schemaVersion: "2.2", // ← Updated
  capabilities: ["database", "devops"],
  cognitiveLevel: CognitiveLevel.PROCEDURES_AND_PLAYBOOKS,

  metadata: {
    name: "Database Setup",
    description: "Configure and deploy PostgreSQL database",
    semantic: "PostgreSQL setup, database configuration, deployment automation",
  },

  instruction: {
    id: "production-setup", // ← Added component ID
    tags: ["production", "critical"], // ← Added tags
    purpose: "Set up PostgreSQL database for production",
    process: [
      "Install PostgreSQL",
      "Configure connection pool",
      "Run migrations",
    ],
    constraints: [
      "MUST use SSL in production",
      "MUST enable connection pooling",
    ],
  },
};
```

---

## 4. Testing Your Migration

### 4.1. Validation

Verify your modules are valid v2.2:

```bash
# Validate all modules
ums validate ./modules/**/*.module.ts

# Build a test persona
ums build --persona ./personas/test.persona.ts
```

### 4.2. Type Checking

Ensure TypeScript compilation succeeds:

```bash
# Check types
npm run typecheck

# Or with tsc directly
tsc --noEmit
```

### 4.3. IDE Verification

Open your module in your IDE and verify:

- ✅ No TypeScript errors
- ✅ Autocomplete works for component fields
- ✅ Type checking works for data values (if using `satisfies`)

---

## 5. Common Issues and Solutions

### Issue 1: "Property 'tags' does not exist"

**Cause**: Using old `ums-lib` type definitions

**Solution**: Update `ums-lib` to v2.2+:

```bash
npm install ums-lib@^2.2.0
```

### Issue 2: "Component ID validation error"

**Cause**: Invalid ID format (uppercase, spaces, special chars)

**Solution**: Use `kebab-case` only:

```typescript
// ✅ Good
id: "my-component";
id: "security-baseline";

// ❌ Bad
id: "My Component";
id: "security_baseline";
id: "Component123!";
```

---

## 6. Rollback Instructions

If you need to roll back to v2.1:

1. Change `schemaVersion` back to `"2.1"`
2. Remove `id` fields from components
3. Remove `tags` fields from components
4. Rebuild modules

```bash
# Validation should pass again
ums validate ./modules/**/*.module.ts
```

---

## 7. Next Steps

After migrating to v2.2:

1. **Monitor**: Watch for v3.0 announcements
2. **Prepare**: Start adding component IDs to important modules
3. **Experiment**: Try using tags for categorization
4. **Share**: Publish modules with `.d.ts` for better DX

---

## 8. FAQ

**Q: Do I have to add IDs to all components?**
A: No, IDs are optional. Add them when you need stable URI addressing.

**Q: Will my v2.1 personas still work?**
A: Yes, personas are fully backward compatible.

**Q: Can I mix v2.1 and v2.2 modules in a persona?**
A: Yes, the build tools handle mixed versions.

**Q: When should I use component tags vs module tags?**
A: Use module tags (metadata.tags) for broad categorization. Use component tags for fine-grained filtering within modules.

---

## 9. Resources

- [UMS v2.2 Specification](./unified_module_system_v2.2_spec.md)
- [UMS v2.2 Taxonomies](./ums_v2.2_taxonomies.md)
- [Migration Script](./scripts/migrate-to-v2.2.ts) (automated tool)

---

**Document Version**: 1.0.0
**Last Updated**: 2025-01-24
**Status**: Final
