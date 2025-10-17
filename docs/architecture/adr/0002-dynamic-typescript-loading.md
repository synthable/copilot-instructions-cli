# ADR 0002: Dynamic TypeScript Loading with tsx

**Status:** Accepted
**Date:** 2025-10-12
**Context:** UMS v2.0 TypeScript-First Architecture

## Context

UMS v2.0 adopts a TypeScript-first approach for modules (`.module.ts`) and personas (`.persona.ts`). The CLI must execute these TypeScript files on-the-fly without requiring users to pre-compile them. This decision affects developer experience, installation complexity, and runtime performance.

## Decision

Use `tsx` (v4.20.6+) for on-the-fly TypeScript execution via dynamic imports.

### Implementation Approach
- Import `.module.ts` and `.persona.ts` files using `tsx` at runtime
- Validate module IDs match between file path and exported names
- Support both default exports and named exports for personas
- Maintain TypeScript-native development without build steps

## Decision Rationale

### 1. Zero Compilation Step
Developers can write `.module.ts` files and immediately use them in builds without running `tsc` first. This matches the UMS v1.0 YAML experience where files were used directly.

### 2. Type Safety at Authoring Time
TypeScript provides IDE support (IntelliSense, type checking, refactoring) while authoring modules, even though execution is dynamic.

### 3. tsx vs ts-node vs esbuild-register
- **tsx**: Modern, fast, uses esbuild internally, ESM-first
- **ts-node**: Older, slower, CJS-focused, requires more configuration
- **esbuild-register**: Fast but requires explicit registration and may have import resolution issues

tsx was chosen for its balance of speed, simplicity, and ESM support.

## Consequences

### Positive
- ✅ No build step required for module development
- ✅ TypeScript IDE benefits during authoring
- ✅ Consistent with v1.0 YAML "use immediately" experience
- ✅ Supports latest TypeScript features via esbuild

### Negative
- ⚠️ Runtime performance cost (transpilation on first load)
- ⚠️ Adds `tsx` as a production dependency
- ⚠️ Potential version conflicts if users have different tsx versions globally

### Neutral
- TypeScript compilation errors only surface at runtime (not at CLI startup)
- Module ID validation must happen after dynamic import

## Alternatives Considered

### Alternative 1: Require Pre-Compilation
**Rejected** because:
- Adds friction to module development workflow
- Requires users to run `tsc` before every build
- Diverges from v1.0 YAML simplicity

### Alternative 2: Bundle tsx with CLI (webpack/esbuild)
**Rejected** because:
- Increases CLI bundle size significantly
- Complicates builds and debugging
- May conflict with user's project setup

### Alternative 3: Use ts-node
**Rejected** because:
- Slower than tsx
- CJS-focused, poor ESM support
- More configuration required

## Notes

This ADR was finalized during Phase 5.1 of the UMS v2.0 migration. The `typescript-loader.ts` implementation includes:
- `loadTypeScriptModule()` for `.module.ts` files
- `loadTypeScriptPersona()` for `.persona.ts` files
- Version detection utilities (`detectUMSVersion`, `isTypeScriptUMSFile`)
- Module ID validation between file path and export name

## References

- Implementation: `packages/ums-cli/src/utils/typescript-loader.ts`
- Related: ADR 0001 (Standard Library Loading), ADR 0003 (Example Snippet Naming)
- tsx documentation: https://github.com/privatenumber/tsx
