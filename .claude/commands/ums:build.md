# Command: /ums:build

Develop and maintain the UMS v2.0 build system using structured workflows and decision trees.

## Task Classification

```
Input: User request
↓
Decision Tree:
├─ Contains "implement" → Feature Implementation Workflow
├─ Contains "fix"/"bug" → Bug Fix Workflow
├─ Contains "optimize"/"performance" → Optimization Workflow
├─ Contains "test" → Testing Workflow
└─ Ambiguous → Ask: "Which workflow: implement|fix|optimize|test?"
```

## Workflow Selection Decision Tree

| User Request Contains | Workflow | Agent | Expected Output |
|----------------------|----------|-------|-----------------|
| "implement", "add", "create", "new feature" | Feature Implementation | build-developer | Code + Tests + Docs |
| "fix", "bug", "broken", "error" | Bug Fix | build-developer | Fix + Regression Tests |
| "optimize", "performance", "speed", "cache" | Optimization | build-developer | Optimizations + Benchmarks |
| "test", "validate", "verify" | Testing | build-developer | Test Results + Report |

## Workflow 1: Feature Implementation

### Invocation Template
```typescript
Task(
  subagent_type: "build-developer",
  description: "Implement [feature-name] in build system",
  prompt: `Implement build system feature:

FEATURE: [feature-name]

REQUIREMENTS:
- [requirement-1]
- [requirement-2]
- [requirement-3]

CONTEXT:
Current Implementation: [describe existing code]
Integration Points: [where this connects]

DELIVERABLES:
1. Implementation code
2. Unit tests (>80% coverage)
3. Integration tests
4. Updated documentation
5. Performance benchmarks (if applicable)

VALIDATION GATES:
- All tests pass
- TypeScript compiles without errors
- No linting errors
- Performance meets targets`
)
```

### Implementation Checklist

Execute in order, validate each gate before proceeding:

- [ ] **Requirements Analysis**
  - [ ] Parse user requirements
  - [ ] Identify affected components
  - [ ] Check for breaking changes
  - [ ] Define success criteria

- [ ] **Design Phase**
  - [ ] Review UMS v2.0 spec (Section 6: Build System)
  - [ ] Design API interface
  - [ ] Plan file structure changes
  - [ ] Identify test cases

- [ ] **Implementation Phase**
  - [ ] Write implementation code
  - [ ] Add TypeScript types
  - [ ] Handle error cases
  - [ ] Add logging/debugging

- [ ] **Testing Phase**
  - [ ] Write unit tests
  - [ ] Write integration tests
  - [ ] Run test suite: `npm run test:sdk`
  - [ ] Verify coverage: `npm run test:sdk:coverage`
  - [ ] Gate: Coverage ≥80% on new code

- [ ] **Documentation Phase**
  - [ ] Add JSDoc comments
  - [ ] Update README if needed
  - [ ] Add usage examples
  - [ ] Update CHANGELOG

- [ ] **Validation Phase**
  - [ ] Run typecheck: `npm run typecheck`
  - [ ] Run lint: `npm run lint:sdk`
  - [ ] Build project: `npm run build`
  - [ ] Manual smoke test

## Workflow 2: Bug Fix

### Invocation Template
```typescript
Task(
  subagent_type: "build-developer",
  description: "Fix bug: [bug-description]",
  prompt: `Fix build system bug:

BUG: [description]
SYMPTOMS: [observable behavior]
EXPECTED: [correct behavior]

REPRODUCTION STEPS:
1. [step-1]
2. [step-2]
3. [observed-result]

CONTEXT:
Affected Components: [list]
User Impact: [severity]
Regression Since: [version/commit if known]

DELIVERABLES:
1. Root cause analysis
2. Fix implementation
3. Regression tests
4. Verification report

VALIDATION GATES:
- Bug no longer reproducible
- Regression tests pass
- No new test failures
- Related functionality intact`
)
```

### Bug Fix Debugging Checklist

| Symptom | Likely Cause | Diagnostic | Fix |
|---------|--------------|------------|-----|
| Modules not loading | File path resolution | Check ModuleLoader logs | Fix path joining logic |
| Rendering incorrect | Template escaping | Inspect markdown output | Update renderer escaping |
| Build fails silently | Error swallowing | Check error handlers | Add proper error propagation |
| Cache not invalidating | Stale cache keys | Check cache key generation | Update cache key algorithm |
| Performance degradation | N+1 queries | Profile with benchmarks | Add caching/batch loading |
| Type errors | Missing type definitions | Run `npm run typecheck` | Add/fix TypeScript types |

### Bug Fix Workflow Steps

1. **Reproduce Bug**
   ```bash
   # Create minimal reproduction case
   # Document exact steps
   # Verify bug exists
   ```

2. **Diagnose Root Cause**
   - Add logging to suspected code path
   - Run with debug flags
   - Check error stack traces
   - Review recent commits

3. **Implement Fix**
   - Write failing test first (TDD)
   - Implement minimal fix
   - Verify test passes
   - Check no regressions

4. **Validate Fix**
   ```bash
   npm run test:sdk          # All tests pass
   npm run typecheck         # No type errors
   npm run lint:sdk          # No lint errors
   npm run build             # Build succeeds
   ```

## Workflow 3: Optimization

### Invocation Template
```typescript
Task(
  subagent_type: "build-developer",
  description: "Optimize [component] performance",
  prompt: `Optimize build system component:

COMPONENT: [module-loader|renderer|registry|orchestrator]
CURRENT PERFORMANCE: [metrics]
TARGET PERFORMANCE: [goal]
BOTTLENECK: [identified issue]

PROFILING DATA:
[paste profiling output if available]

CONSTRAINTS:
- Maintain API compatibility
- Preserve correctness
- No breaking changes

DELIVERABLES:
1. Optimization implementation
2. Before/after benchmarks
3. Performance test suite
4. Documentation of trade-offs

VALIDATION GATES:
- Target performance met
- All tests pass
- No functionality regression
- Benchmarks demonstrate improvement`
)
```

### Optimization Decision Tree

```
Performance Issue Type:
├─ Slow module loading
│  ├─ No caching → Implement module cache
│  ├─ Blocking I/O → Add async loading
│  └─ Large files → Add streaming parser
│
├─ Slow rendering
│  ├─ String concatenation → Use StringBuilder pattern
│  ├─ Repeated computations → Memoize results
│  └─ Unnecessary processing → Add lazy evaluation
│
├─ High memory usage
│  ├─ Caching everything → Add LRU cache
│  ├─ Large data structures → Use streaming
│  └─ Memory leaks → Add cleanup logic
│
└─ Slow validation
   ├─ Sequential validation → Parallelize checks
   ├─ Repeated file reads → Cache file contents
   └─ Complex regex → Optimize patterns
```

### Optimization Checklist

- [ ] **Baseline Measurement**
  - [ ] Create benchmark script
  - [ ] Measure current performance
  - [ ] Document metrics (time, memory, CPU)
  - [ ] Identify bottleneck via profiling

- [ ] **Optimization Implementation**
  - [ ] Implement optimization
  - [ ] Preserve API compatibility
  - [ ] Add performance tests
  - [ ] Document trade-offs

- [ ] **Validation**
  - [ ] Re-run benchmarks
  - [ ] Compare before/after
  - [ ] Verify target met
  - [ ] Check for regressions

- [ ] **Documentation**
  - [ ] Document optimization technique
  - [ ] Add performance notes to README
  - [ ] Update configuration guide if needed

## Workflow 4: Testing

### Invocation Template
```typescript
Task(
  subagent_type: "build-developer",
  description: "Test [component] functionality",
  prompt: `Test build system component:

COMPONENT: [component-name]
TEST SCOPE: [unit|integration|end-to-end]
TEST SCENARIOS:
- [scenario-1]
- [scenario-2]
- [scenario-3]

EDGE CASES:
- [edge-case-1]
- [edge-case-2]

DELIVERABLES:
1. Test execution report
2. Coverage report
3. Bug report (if issues found)
4. Recommendations

VALIDATION GATES:
- All specified scenarios tested
- Edge cases covered
- Coverage meets threshold
- Issues documented`
)
```

### Testing Checklist

- [ ] **Test Plan**
  - [ ] Identify test scenarios
  - [ ] List edge cases
  - [ ] Define success criteria
  - [ ] Choose test type (unit/integration/e2e)

- [ ] **Execution**
  ```bash
  # Run tests
  npm run test:sdk

  # Run with coverage
  npm run test:sdk:coverage

  # Run specific test file
  npx vitest run packages/ums-sdk/src/[component].test.ts
  ```

- [ ] **Analysis**
  - [ ] Review test results
  - [ ] Check coverage report
  - [ ] Identify gaps
  - [ ] Document issues

- [ ] **Reporting**
  - [ ] Generate test report
  - [ ] Document findings
  - [ ] File bugs if needed
  - [ ] Recommend improvements

## Common Build System Components

| Component | File Path | Responsibility |
|-----------|-----------|----------------|
| ModuleLoader | `packages/ums-sdk/src/loaders/module-loader.ts` | Load .module.ts files |
| PersonaLoader | `packages/ums-sdk/src/loaders/persona-loader.ts` | Load .persona.ts files |
| BuildOrchestrator | `packages/ums-sdk/src/orchestration/build-orchestrator.ts` | Coordinate build process |
| MarkdownRenderer | `packages/ums-lib/src/rendering/markdown-renderer.ts` | Render to markdown |
| ModuleRegistry | `packages/ums-lib/src/core/module-registry.ts` | Manage module collection |

## Debugging Quick Reference

### Build Fails

```typescript
Symptom: Build command fails
↓
Check:
1. TypeScript compilation: npm run typecheck
2. Test failures: npm run test:sdk
3. Lint errors: npm run lint:sdk
4. File paths correct
↓
Diagnose:
- Review error messages
- Check recent changes
- Verify file structure
↓
Fix:
- Address root cause
- Re-run build
- Verify success
```

### Module Not Found

```typescript
Symptom: Module not found during build
↓
Check:
1. Module file exists at expected path
2. Module ID matches file path pattern
3. Export convention followed (camelCase)
4. Module in configured modulePaths
↓
Diagnose:
- Run: npm run test:sdk -- module-loader
- Check ModuleDiscovery logs
- Verify modules.config.yml
↓
Fix:
- Correct file path or module ID
- Update configuration
- Re-run build
```

### Rendering Issues

```typescript
Symptom: Output markdown incorrect
↓
Check:
1. Component structure valid
2. Template escaping correct
3. Special characters handled
4. Markdown syntax valid
↓
Diagnose:
- Inspect renderComponent() output
- Check for extra backticks/quotes
- Verify newline handling
↓
Fix:
- Update renderer logic
- Add escaping where needed
- Test with edge cases
```

## Agent Dependencies

- **Primary**: build-developer (required for all workflows)
- **Supporting**: module-validator (for testing build output)

## Validation Gates

All changes must pass:

```bash
# Type checking
npm run typecheck

# Linting
npm run lint:sdk

# Testing
npm run test:sdk

# Coverage (new code ≥80%)
npm run test:sdk:coverage

# Build
npm run build
```

## Example Invocations

### Example 1: Implement Module Caching

```typescript
Task(
  subagent_type: "build-developer",
  description: "Implement module caching system",
  prompt: `Implement build system feature:

FEATURE: Module Caching

REQUIREMENTS:
- In-memory cache for loaded modules
- Cache invalidation on file changes
- Cache statistics tracking
- Configurable cache size limit

CONTEXT:
Current Implementation: ModuleLoader loads from filesystem on every request
Integration Points: ModuleLoader.loadModule() method

DELIVERABLES:
1. Cache implementation with LRU eviction
2. File watcher for invalidation
3. Unit tests (>80% coverage)
4. Performance benchmarks
5. Configuration documentation

VALIDATION GATES:
- All tests pass
- 10x performance improvement on cached loads
- No memory leaks
- Configurable via modules.config.yml`
)
```

### Example 2: Fix Data Component Rendering

```typescript
Task(
  subagent_type: "build-developer",
  description: "Fix Data component extra backticks bug",
  prompt: `Fix build system bug:

BUG: Data component rendering adds extra backticks
SYMPTOMS: Output markdown has triple backticks where single expected
EXPECTED: Clean code block syntax without extra backticks

REPRODUCTION STEPS:
1. Create module with data component containing code
2. Build persona including that module
3. Observe extra backticks in output markdown

CONTEXT:
Affected Components: MarkdownRenderer.renderData()
User Impact: High - breaks markdown rendering in outputs
Regression Since: Unknown

DELIVERABLES:
1. Root cause analysis (template literal escaping)
2. Fix in renderData() function
3. Regression tests for Data component rendering
4. Tests for nested code blocks
5. Tests for special characters

VALIDATION GATES:
- Bug no longer reproducible with test cases
- All existing tests still pass
- Edge cases covered (nested blocks, special chars)
- Manual verification with sample personas`
)
```

### Example 3: Optimize Module Loading

```typescript
Task(
  subagent_type: "build-developer",
  description: "Optimize module loading performance",
  prompt: `Optimize build system component:

COMPONENT: ModuleLoader
CURRENT PERFORMANCE: 2000ms for 50 modules (40ms/module)
TARGET PERFORMANCE: <500ms for 50 modules (<10ms/module)
BOTTLENECK: Sequential filesystem reads

PROFILING DATA:
- 70% time in fs.readFile
- 20% time in TypeScript compilation
- 10% time in validation

CONSTRAINTS:
- Maintain ModuleLoader API
- Preserve error handling
- No breaking changes to consumers

DELIVERABLES:
1. Parallel loading implementation
2. Module cache integration
3. Before/after benchmarks
4. Performance test suite
5. Trade-offs documentation

VALIDATION GATES:
- <500ms load time for 50 modules
- All tests pass
- No race conditions
- Cache hit rate >90% on repeated builds`
)
```

## Post-Execution Checklist

After agent completes work:

- [ ] Review generated code for quality
- [ ] Verify tests pass locally
- [ ] Check coverage meets threshold
- [ ] Run full quality check: `npm run quality-check`
- [ ] Review documentation updates
- [ ] Test manually with sample personas
- [ ] Commit changes with conventional commit message
- [ ] Update CHANGELOG if needed

## Success Criteria

A build system task is complete when:

1. ✅ All validation gates pass
2. ✅ Tests pass with adequate coverage
3. ✅ No type errors or lint issues
4. ✅ Documentation updated
5. ✅ Manual testing confirms expected behavior
6. ✅ Performance meets targets (if optimization)
7. ✅ No regressions in existing functionality

## Related Commands

- `/ums:validate-module` - Validate build outputs
- `/ums:audit` - Comprehensive system audit
- `/ums:create` - Create new modules/personas to test with
