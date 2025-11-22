# TypeScript to Static Format: Alternative Approaches

**Status**: Analysis
**Date**: 2025-11-07
**Author**: Architecture Team

## Overview

This document explores alternative approaches to eliminating runtime TypeScript execution while preserving authoring-time type safety. Each approach is evaluated against our key criteria: security, performance, developer experience, and implementation complexity.

## Evaluation Criteria

| Criterion | Weight | Description |
|-----------|--------|-------------|
| **Security** | 🔴 Critical | Eliminates runtime code execution |
| **Performance** | 🟡 High | Loading speed, memory usage |
| **DX** | 🟡 High | Developer experience, ease of use |
| **Complexity** | 🟢 Medium | Implementation and maintenance effort |
| **Compatibility** | 🟢 Medium | Backwards compatibility, migration path |

## Alternative 1: JSON Compilation (Proposed)

**Strategy**: Compile `.module.ts` → `.module.json` at build time

### Architecture

```
Authoring:    .module.ts (TypeScript, type-safe)
               ↓ npm run build:modules
Build Output: .module.json (JSON, static data)
               ↓ JSON.parse()
Runtime:      Module object (validated)
```

### Pros

✅ **Security**: JSON cannot execute code
✅ **Performance**: Fast JSON parsing (~1-2ms per module)
✅ **Simplicity**: Standard format, no special parsers
✅ **Tooling**: Excellent JSON ecosystem
✅ **Validation**: Can validate against JSON Schema
✅ **Portability**: Works in any JavaScript runtime

### Cons

❌ **Build Step**: Requires compilation
❌ **Comments Lost**: JSON doesn't support comments
❌ **Type Info Lost**: No TypeScript type information preserved
❌ **Diff Noise**: JSON formatting differences in git diffs

### Implementation Complexity

**Low-Medium** (2-3 weeks)

- Reuse existing module loading logic
- Standard JSON serialization
- Well-understood tooling

### Evaluation Score

| Criterion | Score | Notes |
|-----------|-------|-------|
| Security | ⭐⭐⭐⭐⭐ | No code execution possible |
| Performance | ⭐⭐⭐⭐⭐ | Fastest option (~1-2ms) |
| DX | ⭐⭐⭐⭐ | Requires build step |
| Complexity | ⭐⭐⭐⭐⭐ | Simple, standard approach |
| Compatibility | ⭐⭐⭐⭐⭐ | Easy migration, fallback available |

**Total**: 24/25 ⭐

---

## Alternative 2: YAML Compilation

**Strategy**: Compile `.module.ts` → `.module.yaml` at build time

### Architecture

```
Authoring:    .module.ts (TypeScript, type-safe)
               ↓ npm run build:modules
Build Output: .module.yaml (YAML, human-readable)
               ↓ yaml.parse()
Runtime:      Module object (validated)
```

### Pros

✅ **Human-Readable**: More readable than JSON
✅ **Comments**: YAML supports comments
✅ **Multi-line**: Better for long text fields
✅ **Smaller**: More compact than JSON

### Cons

❌ **Parsing Speed**: Slower than JSON (~3-5ms vs 1-2ms)
❌ **Security Risks**: YAML parsers can have vulnerabilities
❌ **Complexity**: More complex parser
❌ **Dependency**: Requires `yaml` package
❌ **Edge Cases**: YAML has surprising edge cases (Norway problem, etc.)

### Example

```yaml
id: foundation/ethics/do-no-harm
version: 1.0.0
schemaVersion: '2.0'
cognitiveLevel: 0
capabilities:
  - ethics
  - safety
metadata:
  name: Do No Harm
  description: Prevent harmful outcomes
  semantic: |
    Ethics safety harm prevention guidelines ensuring AI actions
    cause no harm to users, systems, or society...
instruction:
  purpose: Ensure AI actions cause no harm
  constraints:
    - rule: MUST NOT suggest actions that could harm users
      notes:
        - Consider physical, psychological, financial harm
        - Evaluate both direct and indirect consequences
```

### Implementation Complexity

**Medium** (3-4 weeks)

- Need YAML parser (already have dependency)
- Same compilation pipeline as JSON
- Handle YAML-specific edge cases

### Evaluation Score

| Criterion | Score | Notes |
|-----------|-------|-------|
| Security | ⭐⭐⭐⭐ | Parser vulnerabilities possible |
| Performance | ⭐⭐⭐⭐ | Slower than JSON |
| DX | ⭐⭐⭐⭐⭐ | More readable, comments preserved |
| Complexity | ⭐⭐⭐ | More complex parser |
| Compatibility | ⭐⭐⭐⭐⭐ | Easy migration, fallback available |

**Total**: 22/25 ⭐

---

## Alternative 3: TypeScript AST Extraction

**Strategy**: Parse TypeScript AST, extract module object, serialize to JSON

### Architecture

```
Authoring:    .module.ts (TypeScript, type-safe)
               ↓ TypeScript API
AST Parse:    Extract module export statically
               ↓ AST traversal
Build Output: .module.json (JSON, static data)
               ↓ JSON.parse()
Runtime:      Module object (validated)
```

### Pros

✅ **Type Safety**: Can validate types at compile time
✅ **Static Analysis**: Detect issues before runtime
✅ **No Execution**: Never executes module code
✅ **Comments**: Can extract JSDoc comments
✅ **Metadata**: Can extract type information

### Cons

❌ **Complexity**: Requires TypeScript compiler API
❌ **Fragile**: AST parsing can be brittle
❌ **Build Time**: Slower compilation
❌ **Maintenance**: TypeScript API changes

### Example Implementation

```typescript
import ts from 'typescript';

class ASTModuleCompiler {
  compile(sourceFile: string): Module {
    // 1. Parse TypeScript source
    const program = ts.createProgram([sourceFile], {});
    const sourceFile = program.getSourceFile(sourceFile);

    // 2. Find module export
    const exportNode = this.findModuleExport(sourceFile);

    // 3. Extract object literal
    const moduleObject = this.extractObjectLiteral(exportNode);

    // 4. Serialize to JSON
    return JSON.stringify(moduleObject, null, 2);
  }

  private findModuleExport(sourceFile: ts.SourceFile): ts.Node {
    // Traverse AST to find "export const moduleId: Module = {...}"
  }

  private extractObjectLiteral(node: ts.Node): unknown {
    // Recursively extract object literal values
    // Handle nested objects, arrays, primitives
  }
}
```

### Implementation Complexity

**High** (5-6 weeks)

- Complex TypeScript compiler API
- Recursive AST traversal
- Edge case handling (computed properties, spreads, etc.)

### Evaluation Score

| Criterion | Score | Notes |
|-----------|-------|-------|
| Security | ⭐⭐⭐⭐⭐ | No code execution |
| Performance | ⭐⭐⭐ | Slower build, fast runtime |
| DX | ⭐⭐⭐⭐ | Preserves type info |
| Complexity | ⭐⭐ | Very complex implementation |
| Compatibility | ⭐⭐⭐⭐ | Requires no runtime changes |

**Total**: 18/25 ⭐

---

## Alternative 4: Binary Serialization (MessagePack)

**Strategy**: Compile to binary format for maximum performance

### Architecture

```
Authoring:    .module.ts (TypeScript, type-safe)
               ↓ npm run build:modules
Build Output: .module.msgpack (Binary, compact)
               ↓ msgpack.decode()
Runtime:      Module object (validated)
```

### Pros

✅ **Performance**: Fastest parsing (~0.5ms)
✅ **Size**: Smallest file size
✅ **Efficient**: Low memory overhead

### Cons

❌ **Not Human-Readable**: Binary format
❌ **Debugging**: Hard to debug
❌ **Tooling**: Poor ecosystem
❌ **Git Diffs**: Binary diffs useless
❌ **Dependency**: Requires msgpack library

### Implementation Complexity

**Medium** (3-4 weeks)

- Need MessagePack encoder/decoder
- Same pipeline as JSON
- Harder debugging

### Evaluation Score

| Criterion | Score | Notes |
|-----------|-------|-------|
| Security | ⭐⭐⭐⭐⭐ | No code execution |
| Performance | ⭐⭐⭐⭐⭐ | Fastest option |
| DX | ⭐⭐ | Poor readability, hard debugging |
| Complexity | ⭐⭐⭐ | Additional dependency |
| Compatibility | ⭐⭐⭐⭐ | Easy migration |

**Total**: 18/25 ⭐

---

## Alternative 5: Pre-bundled JavaScript Modules

**Strategy**: Compile TypeScript to JavaScript, bundle with esbuild/rollup

### Architecture

```
Authoring:    .module.ts (TypeScript, type-safe)
               ↓ esbuild/tsc
Build Output: .module.js (JavaScript, ES modules)
               ↓ import()
Runtime:      Module object (validated)
```

### Pros

✅ **Native**: Use standard JavaScript modules
✅ **Fast**: V8 optimized module loading
✅ **Familiar**: Standard build tooling
✅ **Tree Shaking**: Can optimize bundle size

### Cons

❌ **Still Executable**: JavaScript can execute code
❌ **Security**: Same risks as current approach
❌ **Not Static**: Not pure data
❌ **Side Effects**: Can have side effects during import

### Implementation Complexity

**Low** (1-2 weeks)

- Use existing build tools
- Minimal changes to current loader

### Evaluation Score

| Criterion | Score | Notes |
|-----------|-------|-------|
| Security | ⭐⭐ | Still executes code |
| Performance | ⭐⭐⭐⭐ | Fast, but not as fast as JSON |
| DX | ⭐⭐⭐⭐⭐ | Familiar, standard approach |
| Complexity | ⭐⭐⭐⭐⭐ | Very simple |
| Compatibility | ⭐⭐⭐⭐⭐ | Minimal changes |

**Total**: 20/25 ⭐

**Not Recommended**: Doesn't solve the core security issue

---

## Alternative 6: Hybrid Approach (JSON + TypeScript)

**Strategy**: JSON for production, TypeScript for development

### Architecture

```
Development:  .module.ts → dynamic import() → Module
Production:   .module.json → JSON.parse() → Module

Environment variable determines which path to use
```

### Pros

✅ **Best of Both**: Fast in production, flexible in dev
✅ **No Build in Dev**: Rapid iteration
✅ **Security**: Production uses JSON only
✅ **DX**: Development experience unchanged

### Cons

❌ **Two Paths**: Must maintain both code paths
❌ **Testing**: Must test both paths
❌ **Drift**: Potential for behavior differences

### Implementation

```typescript
export class ModuleLoader {
  private readonly useCompiled: boolean;

  constructor() {
    // Production: use compiled JSON
    // Development: use TypeScript source
    this.useCompiled = process.env.NODE_ENV === 'production';
  }

  async loadModule(filePath: string, moduleId: string): Promise<Module> {
    if (this.useCompiled) {
      const jsonPath = filePath.replace('.module.ts', '.module.json');
      return await this.loadFromJson(jsonPath);
    } else {
      return await this.loadFromTypescript(filePath, moduleId);
    }
  }
}
```

### Implementation Complexity

**Medium** (3 weeks)

- Two code paths to maintain
- Environment-based routing
- Testing both paths

### Evaluation Score

| Criterion | Score | Notes |
|-----------|-------|-------|
| Security | ⭐⭐⭐⭐⭐ | Production is secure |
| Performance | ⭐⭐⭐⭐⭐ | Production is fast |
| DX | ⭐⭐⭐⭐⭐ | Best development experience |
| Complexity | ⭐⭐⭐ | Two paths to maintain |
| Compatibility | ⭐⭐⭐⭐⭐ | Gradual migration |

**Total**: 23/25 ⭐

**Recommended**: This is actually the approach proposed in the main design!

---

## Alternative 7: No Compilation (Status Quo with Restrictions)

**Strategy**: Keep TypeScript, add strict validation to prevent code execution

### Architecture

```
Authoring:    .module.ts (TypeScript, restricted)
               ↓ Static analysis
Validation:   Ensure no function calls, no computed values
               ↓ import()
Runtime:      Module object (validated)
```

### Pros

✅ **No Build**: No compilation step
✅ **Simple**: Minimal changes
✅ **DX**: Development experience unchanged

### Cons

❌ **Security**: Still executes code
❌ **Validation**: Hard to guarantee no side effects
❌ **Performance**: Slower than JSON
❌ **Risk**: One malicious module compromises system

### Implementation

```typescript
// Static analysis to ensure module is "safe"
function validateModuleFile(filePath: string): void {
  const source = readFileSync(filePath, 'utf-8');

  // Check for function calls
  if (/\(\)/.test(source)) {
    throw new Error('Module contains function calls');
  }

  // Check for computed properties
  if (/\[.*\]:/.test(source)) {
    throw new Error('Module contains computed properties');
  }

  // etc...
}
```

### Implementation Complexity

**High** (4-5 weeks)

- Complex static analysis
- Many edge cases
- Never 100% safe

### Evaluation Score

| Criterion | Score | Notes |
|-----------|-------|-------|
| Security | ⭐⭐ | Can't guarantee safety |
| Performance | ⭐⭐⭐ | Same as current |
| DX | ⭐⭐⭐⭐⭐ | No changes |
| Complexity | ⭐⭐ | Complex validation |
| Compatibility | ⭐⭐⭐⭐⭐ | No breaking changes |

**Total**: 16/25 ⭐

**Not Recommended**: Doesn't solve the core security issue

---

## Alternative 8: JSON5 Compilation

**Strategy**: Compile to JSON5 (JSON with comments and trailing commas)

### Architecture

```
Authoring:    .module.ts (TypeScript, type-safe)
               ↓ npm run build:modules
Build Output: .module.json5 (JSON5, human-readable)
               ↓ json5.parse()
Runtime:      Module object (validated)
```

### Pros

✅ **Comments**: Supports comments
✅ **Readable**: More human-friendly than JSON
✅ **Trailing Commas**: Easier to edit
✅ **Superset**: Valid JSON is valid JSON5

### Cons

❌ **Parsing**: Slower than JSON
❌ **Dependency**: Requires json5 package
❌ **Adoption**: Less widely adopted than JSON or YAML
❌ **Tooling**: Fewer tools support JSON5

### Example

```json5
{
  id: 'foundation/ethics/do-no-harm',
  version: '1.0.0',
  schemaVersion: '2.0',
  cognitiveLevel: 0,
  capabilities: ['ethics', 'safety'],
  metadata: {
    name: 'Do No Harm',
    description: 'Prevent harmful outcomes',
    // Dense semantic description for AI search
    semantic: 'Ethics safety harm prevention guidelines...',
  },
  instruction: {
    purpose: 'Ensure AI actions cause no harm',
    constraints: [
      'MUST NOT suggest actions that could harm users',
      // Additional constraints...
    ],
  },
}
```

### Implementation Complexity

**Low-Medium** (2-3 weeks)

- Similar to JSON approach
- Need json5 parser
- Straightforward migration

### Evaluation Score

| Criterion | Score | Notes |
|-----------|-------|-------|
| Security | ⭐⭐⭐⭐⭐ | No code execution |
| Performance | ⭐⭐⭐⭐ | Slightly slower than JSON |
| DX | ⭐⭐⭐⭐⭐ | Comments preserved, readable |
| Complexity | ⭐⭐⭐⭐ | Additional dependency |
| Compatibility | ⭐⭐⭐⭐⭐ | Easy migration |

**Total**: 23/25 ⭐

**Strong Alternative**: Good balance of readability and performance

---

## Comparison Matrix

| Approach | Security | Performance | DX | Complexity | Compatibility | **Total** |
|----------|----------|-------------|----|-----------|--------------|-----------|
| **1. JSON** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **24/25** ✅ |
| **2. YAML** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **22/25** |
| **3. AST Extraction** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | **18/25** |
| **4. MessagePack** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | **18/25** |
| **5. JavaScript** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **20/25** |
| **6. Hybrid** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **23/25** ✅ |
| **7. Status Quo** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | **16/25** |
| **8. JSON5** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **23/25** ✅ |

## Recommendations

### 🥇 Recommended: JSON Compilation (Alternative 1)

**Why:**
- Highest overall score (24/25)
- Best security profile
- Excellent performance
- Standard, well-understood format
- Simple implementation
- Great compatibility

**Ideal for:** Production deployments, maximum security

### 🥈 Alternative: JSON5 Compilation (Alternative 8)

**Why:**
- Very high score (23/25)
- Comments preserved (better DX)
- More human-readable
- Nearly as fast as JSON

**Ideal for:** Teams that value readability, want to preserve comments

### 🥉 Consider: Hybrid Approach (Alternative 6)

**Why:**
- Very high score (23/25)
- Best developer experience
- No build step in development
- Full security in production

**Ideal for:** Large teams, gradual migration, optimal DX

**Note:** This is effectively what the main proposal already suggests!

## Decision Framework

### Choose JSON if:
- ✅ Maximum security is required
- ✅ Best performance is critical
- ✅ Standard tooling is preferred
- ✅ Comments in output aren't needed

### Choose JSON5 if:
- ✅ Preserving comments is important
- ✅ Human readability of output matters
- ✅ Developers will edit compiled files
- ✅ Performance difference is acceptable

### Choose Hybrid if:
- ✅ Development speed is critical
- ✅ Two code paths are acceptable
- ✅ Environment-based routing is feasible
- ✅ Gradual migration is needed

### Avoid:
- ❌ **Status Quo** - doesn't solve security issue
- ❌ **JavaScript** - doesn't solve security issue
- ❌ **MessagePack** - poor DX outweighs performance gains
- ❌ **AST Extraction** - complexity outweighs benefits

## Implementation Recommendation

**Start with JSON (Alternative 1) using Hybrid fallback (Alternative 6)**

```typescript
// Combines best of both approaches
export class ModuleLoader {
  async loadModule(filePath: string, moduleId: string): Promise<Module> {
    const jsonPath = this.getCompiledPath(filePath);

    // Try compiled JSON first
    if (await this.exists(jsonPath)) {
      return await this.loadFromJson(jsonPath);
    }

    // Fall back to TypeScript in development
    if (process.env.NODE_ENV !== 'production') {
      return await this.loadFromTypescript(filePath, moduleId);
    }

    // Production: require compiled modules
    throw new ModuleNotFoundError(
      `Compiled module not found: ${jsonPath}. ` +
      `Run 'npm run build:modules' to compile.`
    );
  }
}
```

**Benefits:**
- ✅ JSON for production (security + performance)
- ✅ TypeScript fallback for development (DX)
- ✅ Gradual migration path
- ✅ Best of both worlds

## Future Considerations

### Incremental Adoption

**Phase 1**: Optional compilation
- Compiled JSON used if available
- TypeScript fallback always works
- No breaking changes

**Phase 2**: Required in production
- CI/CD enforces compilation
- Development still allows TypeScript
- Production requires JSON

**Phase 3**: Deprecate TypeScript loading
- Remove fallback
- JSON-only at runtime
- TypeScript for authoring only

### Extensibility

The compilation infrastructure could support:
- Multiple output formats (JSON + JSON5 + YAML)
- Custom serializers
- Validation hooks
- Source maps for debugging

---

**Next Step**: Create proof of concept implementing JSON compilation with TypeScript fallback.
