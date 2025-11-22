# TypeScript to JSON Compilation Architecture

- **Status**: Proposal
- **Date**: 2025-11-07
- **Author**: Architecture Team

## Executive Summary

This document proposes migrating from runtime TypeScript execution to build-time compilation of modules and personas to JSON format. This change eliminates the need for dynamic TypeScript loading at runtime while preserving authoring-time type safety.

## Current Architecture

### Module Loading Flow

```
.module.ts files
    ↓
pathToFileURL() + dynamic import()
    ↓
Extract named export (moduleIdToExportName)
    ↓
parseModule() validates structure
    ↓
validateModule() checks UMS v2.0 compliance
    ↓
Module object ready for use
```

**Key Characteristics:**

- Uses Node.js native `import()` (not tsx - no external dependency)
- Dynamic loading at runtime
- Export name calculated from module ID (kebab-case → camelCase)
- Two-step validation (parsing + validation)
- File location: `packages/ums-sdk/src/loaders/module-loader.ts:51`

### Current Dependencies

**Runtime:**

- Native Node.js ESM (`import()`)
- `pathToFileURL()` from `node:url`
- `ums-lib` for parsing/validation

**No External Loaders:**

- Not using tsx
- Not using ts-node
- Pure ESM dynamic imports

## Proposed Architecture

### Compilation Strategy: Hybrid Build-Time Approach

```
Source (.module.ts) → Build Step → Output (.module.json) → Runtime Loading
```

#### Phase 1: Authoring (Current)

```typescript
// instruct-modules-v2/modules/foundation/ethics/do-no-harm.module.ts
import type { Module } from "ums-lib";

export const doNoHarm: Module = {
  id: "foundation/ethics/do-no-harm",
  version: "1.0.0",
  schemaVersion: "2.0",
  cognitiveLevel: 0,
  capabilities: ["ethics", "safety"],
  metadata: {
    name: "Do No Harm",
    description: "Prevent harmful outcomes",
    semantic: "Ethics safety harm prevention...",
  },
  instruction: {
    purpose: "Ensure AI actions cause no harm",
    // ... rest of content
  },
};
```

**Benefits Retained:**

- Full TypeScript type safety
- IDE autocomplete and validation
- Compile-time type checking
- Import statements for shared types

#### Phase 2: Build-Time Compilation

```bash
# New build command
npm run build:modules
# or integrate into existing build
npm run build
```

**Compilation Process:**

```typescript
// New tool: packages/ums-sdk/src/compilation/module-compiler.ts

class ModuleCompiler {
  async compile(sourcePath: string, outputPath: string): Promise<void> {
    // 1. Use existing dynamic import to load TypeScript
    const module = await this.loadTypescriptModule(sourcePath);

    // 2. Extract module object (existing logic)
    const moduleObject = this.extractModule(module);

    // 3. Validate (existing logic)
    const parsed = parseModule(moduleObject);
    const validation = validateModule(parsed);

    if (!validation.valid) {
      throw new CompilationError(`Invalid module: ${validation.errors}`);
    }

    // 4. Serialize to JSON
    const json = JSON.stringify(parsed, null, 2);

    // 5. Write to output
    await writeFile(outputPath, json);
  }
}
```

**Output Structure:**

```
instruct-modules-v2/
  modules/                    # Source .ts files
    foundation/
      ethics/
        do-no-harm.module.ts
  compiled/                   # Generated .json files (gitignored)
    foundation/
      ethics/
        do-no-harm.module.json
```

#### Phase 3: Runtime Loading (New)

```typescript
// Modified: packages/ums-sdk/src/loaders/module-loader.ts

export class ModuleLoader {
  async loadModule(filePath: string, moduleId: string): Promise<Module> {
    // Determine if we're loading from compiled JSON or TypeScript source
    const jsonPath = this.toCompiledPath(filePath); // .ts → .json

    if (await this.exists(jsonPath)) {
      // Production path: Load pre-compiled JSON
      return await this.loadFromJson(jsonPath);
    } else {
      // Development path: Fall back to TypeScript
      return await this.loadFromTypescript(filePath, moduleId);
    }
  }

  private async loadFromJson(filePath: string): Promise<Module> {
    const content = await readFile(filePath, "utf-8");
    const moduleObject = JSON.parse(content);

    // Validation still happens (verify JSON structure)
    const parsed = parseModule(moduleObject);
    const validation = validateModule(parsed);

    if (!validation.valid) {
      throw new ModuleLoadError(
        `Invalid module JSON: ${validation.errors}`,
        filePath
      );
    }

    return parsed;
  }

  private async loadFromTypescript(
    filePath: string,
    moduleId: string
  ): Promise<Module> {
    // Existing implementation (fallback for development)
    // ... current code ...
  }
}
```

## Benefits

### Security

✅ **No Runtime Code Execution**

- JSON is data, not code
- Eliminates arbitrary code execution risks
- Safer for production deployments
- No dynamic imports in production

### Performance

✅ **Faster Loading**

- JSON parsing is faster than module evaluation
- No TypeScript compilation overhead
- No export name resolution overhead
- Reduced memory footprint

**Benchmarks (estimated):**

```
Current (TypeScript):     ~10-15ms per module
Proposed (JSON):          ~1-2ms per module
Improvement:              5-10x faster
```

For a persona with 50 modules:

- Current: ~500-750ms
- Proposed: ~50-100ms
- **Improvement: ~80% faster build times**

### Reliability

✅ **Pre-Validated Modules**

- Validation happens at build time
- Runtime errors reduced
- Faster failure feedback for developers
- CI/CD can catch issues before deployment

### Simplicity

✅ **Simpler Runtime**

- No dynamic import() calls
- No export name calculation
- Pure data loading (JSON.parse)
- Easier to debug

## Trade-offs

### Cons

❌ **Build Step Required**

- Adds compilation step to workflow
- Must rebuild after module changes
- Potential for source/compiled drift

**Mitigation:**

- Watch mode for development (`npm run build:modules -- --watch`)
- Git hooks to auto-compile on commit
- CI/CD validates compilation

❌ **Larger Repository Size**

- Both .ts and .json files in repo (if committed)
- Roughly 2x storage

**Mitigation:**

- Add `compiled/` to `.gitignore`
- Generate JSON during `npm run build`
- Publish only JSON to npm (exclude .ts files)

❌ **Development Friction**

- Developers must remember to rebuild
- Compiled files can be stale

**Mitigation:**

- Pre-commit hooks auto-compile
- Development mode falls back to TypeScript
- Watch mode for active development

### Edge Cases

⚠️ **Dynamic Module Content**

If modules use computed values:

```typescript
// This would fail to compile correctly
export const myModule: Module = {
  id: "example",
  version: "1.0.0",
  metadata: {
    name: "Example",
    description: `Generated on ${new Date().toISOString()}`, // ❌ Dynamic!
  },
  // ...
};
```

**Solution:** UMS v2.0 spec already prohibits dynamic content. Validation enforces static data.

## Implementation Plan

### Phase 1: Foundation (Week 1)

**Create Compiler Infrastructure**

- [ ] Create `packages/ums-sdk/src/compilation/` directory
- [ ] Implement `ModuleCompiler` class
- [ ] Implement `PersonaCompiler` class
- [ ] Add compilation tests
- [ ] Add `build:modules` npm script

**Files to Create:**

```
packages/ums-sdk/src/compilation/
  module-compiler.ts
  module-compiler.test.ts
  persona-compiler.ts
  persona-compiler.test.ts
  index.ts
```

### Phase 2: Loader Updates (Week 1)

**Modify Module Loader**

- [ ] Update `ModuleLoader` to support JSON loading
- [ ] Add `loadFromJson()` method
- [ ] Implement fallback logic (JSON → TypeScript)
- [ ] Update tests
- [ ] Add benchmarks

**Modified Files:**

```
packages/ums-sdk/src/loaders/
  module-loader.ts          (modify)
  module-loader.test.ts     (update)
  persona-loader.ts         (modify)
  persona-loader.test.ts    (update)
```

### Phase 3: Build Integration (Week 2)

**Integrate into Build Pipeline**

- [ ] Add compilation to `npm run build`
- [ ] Add watch mode for development
- [ ] Update `.gitignore` to exclude `compiled/`
- [ ] Add pre-commit hook for compilation
- [ ] Update CI/CD to compile modules

**Modified Files:**

```
package.json              (add scripts)
.gitignore                (add compiled/)
.husky/pre-commit         (add compilation)
```

### Phase 4: CLI Updates (Week 2)

**Update CLI Commands**

- [ ] Add `compile` command to CLI
- [ ] Update `build` command to use compiled modules
- [ ] Add `--force-compile` flag
- [ ] Update `validate` to check source → compiled consistency
- [ ] Add compilation status to `list` command

**Modified Files:**

```
packages/ums-cli/src/commands/
  compile.ts               (new)
  build.ts                 (update)
  validate.ts              (update)
  list.ts                  (update)
```

### Phase 5: Testing & Documentation (Week 3)

**Comprehensive Testing**

- [ ] Unit tests for compiler
- [ ] Integration tests for build pipeline
- [ ] Performance benchmarks
- [ ] Migration guide for existing users
- [ ] Update all documentation

**New Documentation:**

```
docs/
  architecture/
    typescript-to-json-compilation.md  (this file)
  guides/
    module-compilation-guide.md        (new)
  migration/
    v2.0-to-v2.1-compilation.md        (new)
```

### Phase 6: Rollout (Week 4)

**Gradual Migration**

1. **Alpha Release (internal)**
   - Compile standard library modules
   - Test with all existing personas
   - Gather performance metrics

2. **Beta Release (select users)**
   - Enable compilation by default
   - Keep TypeScript fallback
   - Monitor for issues

3. **Stable Release (v2.1.0)**
   - Compilation required for production
   - TypeScript fallback for development only
   - Update published package to include only JSON

## File Structure Changes

### Before (Current)

```
instruct-modules-v2/
  modules/
    foundation/
      ethics/
        do-no-harm.module.ts
        *.module.ts
    principle/
    technology/
    execution/
  personas/
    backend-developer.persona.ts
    *.persona.ts
```

### After (Proposed)

```
instruct-modules-v2/
  modules/                           # Source files (for authoring)
    foundation/
      ethics/
        do-no-harm.module.ts
        *.module.ts
  compiled/                          # Generated files (gitignored)
    modules/
      foundation/
        ethics/
          do-no-harm.module.json
          *.module.json
    personas/
      backend-developer.persona.json
      *.persona.json
  personas/
    backend-developer.persona.ts
```

**`.gitignore` addition:**

```gitignore
# Compiled module outputs (generated at build time)
instruct-modules-v2/compiled/
```

## Migration Guide for Users

### For Module Authors

**No Changes Required!**

Continue authoring in TypeScript:

```typescript
import type { Module } from "ums-lib";

export const myModule: Module = {
  // ... your module definition
};
```

**New Workflow:**

```bash
# 1. Edit your module
vim instruct-modules-v2/modules/my-module.module.ts

# 2. Compile (automatic on commit via pre-commit hook)
npm run build:modules

# 3. Test
npm test

# 4. Commit
git add instruct-modules-v2/modules/my-module.module.ts
git commit -m "feat: add my-module"
# (pre-commit hook auto-compiles)
```

### For Library Users

**No Changes Required!**

The SDK handles compilation automatically:

```typescript
import { buildPersona } from "ums-sdk";

// Works exactly as before
const result = await buildPersona("./my-persona.persona.ts");
```

**New CLI Commands:**

```bash
# Compile all modules
copilot-instructions compile

# Compile with watch mode (for development)
copilot-instructions compile --watch

# Force recompilation
copilot-instructions compile --force

# Check compilation status
copilot-instructions compile --status
```

## Backwards Compatibility

### Development Mode

TypeScript loading remains available as fallback:

```typescript
// If compiled JSON doesn't exist, loader falls back to TypeScript
const loader = new ModuleLoader({
  preferCompiled: true, // Try JSON first
  fallbackToSource: true, // Fall back to .ts if no .json
});
```

### Production Mode

Require compiled modules:

```typescript
const loader = new ModuleLoader({
  preferCompiled: true,
  fallbackToSource: false, // Fail if no .json (production)
});
```

## Performance Metrics

### Expected Improvements

| Operation                | Current (TypeScript) | Proposed (JSON) | Improvement   |
| ------------------------ | -------------------- | --------------- | ------------- |
| Load single module       | ~10ms                | ~1ms            | 10x faster    |
| Load 50-module persona   | ~500ms               | ~50ms           | 10x faster    |
| Cold start (100 modules) | ~1000ms              | ~100ms          | 10x faster    |
| Memory footprint         | ~50MB                | ~20MB           | 60% reduction |

### Benchmark Plan

```typescript
// New file: packages/ums-sdk/src/compilation/benchmarks.ts

import { bench } from "vitest";

bench("load module from TypeScript", async () => {
  await loader.loadFromTypescript("path/to/module.ts");
});

bench("load module from JSON", async () => {
  await loader.loadFromJson("path/to/module.json");
});
```

## Security Considerations

### Threat Model

**Current (TypeScript):**

- ✅ Module can execute arbitrary code during import
- ✅ Malicious module could perform side effects
- ✅ Dynamic imports can load unexpected code

**Proposed (JSON):**

- ❌ JSON cannot execute code
- ❌ No side effects possible
- ❌ Static data only

### Attack Vectors Eliminated

1. **Code Injection**: JSON cannot contain executable code
2. **Side Effects**: No `console.log()`, `fs.writeFile()`, etc.
3. **Import Hijacking**: No dynamic imports to hijack
4. **Prototype Pollution**: Validate JSON structure before parsing

### Remaining Risks

1. **JSON Parsing Vulnerabilities**: Mitigated by using native `JSON.parse()`
2. **Large Payloads**: Validate file size before parsing
3. **Malformed Data**: Existing validation layer catches this

## Open Questions

### Q1: Should compiled JSON be committed to git?

**Option A: Commit compiled JSON**

- ✅ Faster cloning (no build step)
- ✅ Deployments don't need build
- ❌ Larger repository
- ❌ Merge conflicts

**Option B: Gitignore compiled JSON**

- ✅ Smaller repository
- ✅ No merge conflicts
- ❌ Requires build step after clone
- ❌ CI/CD must compile

**Recommendation:** Option B (gitignore), align with standard practice (compiled artifacts not committed).

### Q2: How to handle watch mode in development?

**Option A: Automatic watch on `npm run dev`**

```bash
npm run dev
# Starts watch mode automatically
```

**Option B: Separate watch command**

```bash
npm run build:modules -- --watch
```

**Recommendation:** Option A for convenience, Option B available for explicit control.

### Q3: What about module hot-reloading?

In development, support hot-reloading:

```typescript
// Watch for file changes
watch("modules/**/*.module.ts", async (event, filename) => {
  await compileModule(filename);
  await reloadModule(filename);
});
```

This enables rapid iteration without restarting the dev server.

## Success Metrics

### Must Achieve

- [ ] 5x faster module loading (50ms → 10ms for typical persona)
- [ ] Zero runtime TypeScript execution in production
- [ ] 100% test coverage for compiler
- [ ] No breaking changes for module authors
- [ ] Successful compilation of all 100+ standard library modules

### Should Achieve

- [ ] 80% reduction in memory footprint
- [ ] Sub-second cold start for CLI
- [ ] Watch mode working seamlessly
- [ ] Migration guide covers all edge cases

### Nice to Have

- [ ] Incremental compilation (only changed modules)
- [ ] Parallel compilation for speed
- [ ] Compilation caching
- [ ] Source maps for debugging

## Next Steps

1. **Review this proposal** with the team
2. **Prototype** the compiler (2-3 days)
3. **Benchmark** current vs. proposed (1 day)
4. **Implement** Phase 1-2 (1 week)
5. **Test** with standard library (2 days)
6. **Iterate** based on findings
7. **Document** and release

## References

- [UMS v2.0 Specification](../spec/unified_module_system_v2_spec.md)
- [Module Authoring Guide](../unified-module-system/12-module-authoring-guide.md)
- [Current Module Loader](../../packages/ums-sdk/src/loaders/module-loader.ts)
- [Current Persona Loader](../../packages/ums-sdk/src/loaders/persona-loader.ts)

---

**Feedback Welcome**: Please add comments, questions, or concerns below or in the PR discussion.
