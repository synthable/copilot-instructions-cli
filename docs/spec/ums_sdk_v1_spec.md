# Specification: The UMS SDK v1.0

## 1. Overview & Purpose

### 1.1. What is the UMS SDK?

The **UMS SDK** (Software Development Kit) is an application-layer package that bridges the gap between the pure domain logic of `ums-lib` and platform-specific implementations. It provides:

- **File system operations** for loading TypeScript modules and personas
- **Module discovery** across configured directories
- **High-level orchestration** for common workflows (build, validate, list)
- **Configuration management** for project-specific settings
- **Convenience APIs** that combine multiple ums-lib operations

### 1.2. Relationship to ums-lib

```
┌────────────────────────────────────────────────┐
│              ums-lib (Domain)                  │
│  • Pure data types                             │
│  • Validation logic                            │
│  • Rendering logic                             │
│  • Registry logic                              │
│  • NO I/O, NO platform-specific code           │
└────────────────────────────────────────────────┘
                    ↑
                    │ uses (for data operations)
                    │
┌────────────────────────────────────────────────┐
│            ums-sdk (Application)               │
│  • File system I/O                             │
│  • TypeScript module loading                   │
│  • Configuration parsing                       │
│  • Workflow orchestration                      │
│  • Platform-specific (Node.js)                 │
└────────────────────────────────────────────────┘
                    ↑
                    │ uses (for workflows)
                    │
┌────────────────────────────────────────────────┐
│          Tools (CLI, Extensions, etc.)         │
│  • Command-line interface                      │
│  • VS Code extension                           │
│  • Build tools                                 │
│  • CI/CD integrations                          │
└────────────────────────────────────────────────┘
```

### 1.3. Target Platforms

**Primary Target**: Node.js 22.0.0+

**Future Targets**:

- Deno (via separate `ums-deno-sdk`)
- Bun (via separate `ums-bun-sdk`)

Each platform MAY have its own SDK implementation following this specification.

### 1.4. Design Principles

1. **Separation of Concerns**: SDK handles I/O; ums-lib handles logic
2. **High-Level API**: Provide simple, one-function workflows
3. **Low-Level Access**: Expose building blocks for custom flows
4. **Type Safety**: Leverage TypeScript for compile-time safety
5. **Error Transparency**: Detailed error messages with context
6. **Clean API Surface**: Re-export types from ums-lib; functions accessed directly from ums-lib or via SDK high-level API

---

## 2. Architecture & Responsibilities

### 2.1. What the SDK MUST Handle

The SDK is responsible for all **I/O operations** and **platform-specific concerns**:

- ✅ Loading `.module.ts` files from file system
- ✅ Loading `.persona.ts` files from file system
- ✅ Parsing `modules.config.yml` configuration files
- ✅ Discovering modules via file system traversal
- ✅ TypeScript module execution (via `tsx` or similar)
- ✅ Validating export names match module IDs
- ✅ Managing standard library location and loading
- ✅ Orchestrating multi-step workflows
- ✅ Providing high-level convenience functions

### 2.2. What the SDK MUST NOT Handle

The SDK delegates **pure data operations** to ums-lib:

- ❌ Module object structure validation (use `ums-lib`)
- ❌ Persona object structure validation (use `ums-lib`)
- ❌ Markdown rendering (use `ums-lib`)
- ❌ Build report generation (use `ums-lib`)
- ❌ Module registry logic (use `ums-lib`)
- ❌ Module resolution logic (use `ums-lib`)

**Note on API Surface**: The SDK re-exports **types** from ums-lib for convenience, but does NOT re-export functions. Users should import domain functions from ums-lib directly, or use the SDK's high-level API which orchestrates ums-lib functions internally.

### 2.3. Layer Boundaries

```typescript
// ❌ WRONG: SDK doing validation logic
class ModuleLoader {
  load(path: string): Module {
    const module = this.readAndParse(path);
    // SDK should NOT implement validation logic
    if (!module.id || !module.schemaVersion) {
      throw new Error("Invalid");
    }
    return module;
  }
}

// ✅ CORRECT: SDK delegates to ums-lib
class ModuleLoader {
  load(path: string): Module {
    const module = this.readAndParse(path);
    // Use ums-lib for validation
    const validation = validateModule(module);
    if (!validation.valid) {
      throw new Error(`Invalid: ${validation.errors}`);
    }
    return module;
  }
}
```

---

## 3. Core Components

### 3.1. ModuleLoader

**Purpose**: Load TypeScript module files from the file system.

**Interface**:

```typescript
interface ModuleLoader {
  /**
   * Load a single .module.ts file
   * @param filePath - Absolute path to module file
   * @param moduleId - Expected module ID (for validation)
   * @returns Validated Module object
   * @throws LoaderError if file cannot be loaded or is invalid
   */
  loadModule(filePath: string, moduleId: string): Promise<Module>;

  /**
   * Load raw file content (for digests, error reporting)
   * @param filePath - Absolute path to file
   * @returns Raw file content as string
   */
  loadRawContent(filePath: string): Promise<string>;
}
```

**Requirements**:

1. MUST support `.module.ts` files
2. MUST validate export name matches module ID (camelCase conversion)
3. MUST use ums-lib's `parseModuleObject()` for parsing
4. MUST use ums-lib's `validateModule()` for validation
5. MUST throw descriptive errors with file path and line numbers when possible
6. MUST verify loaded module's `id` field matches expected `moduleId`

**Error Handling**:

- `ModuleLoadError`: Generic loading failure
- `ModuleNotFoundError`: File does not exist
- `InvalidExportError`: Export name doesn't match module ID
- `ModuleValidationError`: Module fails ums-lib validation

### 3.2. PersonaLoader

**Purpose**: Load TypeScript persona files from the file system.

**Interface**:

```typescript
interface PersonaLoader {
  /**
   * Load a single .persona.ts file
   * @param filePath - Absolute path to persona file
   * @returns Validated Persona object
   * @throws LoaderError if file cannot be loaded or is invalid
   */
  loadPersona(filePath: string): Promise<Persona>;
}
```

**Requirements**:

1. MUST support `.persona.ts` files
2. MUST accept default export OR first Persona-like named export
3. MUST use ums-lib's `parsePersonaObject()` for parsing
4. MUST use ums-lib's `validatePersona()` for validation
5. MUST throw descriptive errors with file path context

### 3.3. ConfigManager

**Purpose**: Load and parse `modules.config.yml` configuration files.

**Interface**:

```typescript
interface ConfigManager {
  /**
   * Load configuration from file
   * @param configPath - Path to modules.config.yml (default: './modules.config.yml')
   * @returns Parsed and validated configuration
   * @throws ConfigError if config is invalid
   */
  load(configPath?: string): Promise<ModuleConfig>;

  /**
   * Validate configuration structure
   * @param config - Configuration object to validate
   * @returns Validation result
   */
  validate(config: unknown): ConfigValidationResult;
}

interface ModuleConfig {
  /** Optional global conflict resolution strategy (default: 'error') */
  conflictStrategy?: "error" | "warn" | "replace";

  /** Local module search paths */
  localModulePaths: LocalModulePath[];
}

interface LocalModulePath {
  path: string;
}
```

**Requirements**:

1. MUST parse YAML format
2. MUST validate required fields (`localModulePaths`)
3. MUST validate optional `conflictStrategy` field (if present)
4. MUST return empty config if file doesn't exist (not an error)
5. MUST validate that configured paths exist

**Conflict Resolution Priority**:

The conflict resolution strategy is determined by the following priority order:

1. `BuildOptions.conflictStrategy` (if provided at runtime)
2. `ModuleConfig.conflictStrategy` (if specified in config file)
3. Default: `'error'`

This allows setting a project-wide default in the config file while allowing per-build overrides via `BuildOptions`.

### 3.4. ModuleDiscovery

**Purpose**: Discover module files in configured directories.

**Interface**:

```typescript
interface ModuleDiscovery {
  /**
   * Discover all .module.ts files in configured paths
   * @param config - Configuration specifying paths
   * @returns Array of loaded modules
   * @throws DiscoveryError if discovery fails
   */
  discover(config: ModuleConfig): Promise<Module[]>;

  /**
   * Discover modules in specific directories
   * @param paths - Array of directory paths
   * @returns Array of loaded modules
   */
  discoverInPaths(paths: string[]): Promise<Module[]>;
}
```

**Requirements**:

1. MUST recursively search directories for `.module.ts` files
2. MUST extract module ID from file path **relative to the configured base path**
3. MUST use `ModuleLoader` to load each discovered file
4. MUST skip files that fail to load (with warning, not error)
5. SHOULD provide progress reporting for large directories

**Module ID Extraction Algorithm**:

For each configured path in `modules.config.yml`, discovery MUST:

1. Resolve the configured path to an absolute path (the "base path")
2. Find all `.module.ts` files recursively within that base path
3. For each file, calculate the module ID as: `relative_path_from_base.replace('.module.ts', '')`
4. Pass the module ID to `ModuleLoader` for validation against the file's internal `id` field

### 3.5. StandardLibrary

**Purpose**: Manage standard library modules.

**Interface**:

```typescript
interface StandardLibrary {
  /**
   * Discover all standard library modules
   * @returns Array of standard modules
   */
  discoverStandard(): Promise<Module[]>;

  /**
   * Get standard library location
   * @returns Path to standard library directory
   */
  getStandardLibraryPath(): string;

  /**
   * Check if a module ID is from standard library
   * @param moduleId - Module ID to check
   * @returns true if module is in standard library
   */
  isStandardModule(moduleId: string): boolean;
}
```

**Requirements**:

1. MUST define standard library location (implementation-defined)
2. MUST load standard modules before local modules
3. MUST tag standard modules with `source: 'standard'` in registry
4. SHOULD allow standard library path override via environment variable

---

## 4. High-Level API

The SDK MUST provide high-level convenience functions for common workflows.

### 4.1. buildPersona()

**Purpose**: Complete build workflow - load, validate, resolve, and render a persona.

**Signature**:

```typescript
function buildPersona(
  personaPath: string,
  options?: BuildOptions
): Promise<BuildResult>;

interface BuildOptions {
  /** Path to modules.config.yml (default: './modules.config.yml') */
  configPath?: string;

  /** Conflict resolution strategy (default: 'error') */
  conflictStrategy?: "error" | "warn" | "replace";

  /** Include module attribution in output (default: false) */
  attribution?: boolean;

  /** Include standard library modules (default: true) */
  includeStandard?: boolean;
}

interface BuildResult {
  /** Rendered Markdown content */
  markdown: string;

  /** Loaded persona object */
  persona: Persona;

  /** Resolved modules in composition order */
  modules: Module[];

  /** Build report with metadata */
  buildReport: BuildReport;

  /** Warnings generated during build */
  warnings: string[];
}
```

**Workflow**:

1. Load persona from file
2. Validate persona structure
3. Load configuration
4. Discover modules (standard + local)
5. Build module registry
6. Resolve persona modules
7. Render to Markdown
8. Generate build report

**Error Handling**:

- MUST throw if persona file doesn't exist
- MUST throw if persona is invalid
- MUST throw if any required module is missing
- MUST throw if module validation fails
- SHOULD collect warnings for deprecated modules

### 4.2. validateAll()

**Purpose**: Validate all discovered modules and personas.

**Signature**:

```typescript
function validateAll(options?: ValidateOptions): Promise<ValidationReport>;

interface ValidateOptions {
  /** Path to modules.config.yml (default: './modules.config.yml') */
  configPath?: string;

  /** Include standard library modules (default: true) */
  includeStandard?: boolean;

  /** Validate personas in addition to modules (default: true) */
  includePersonas?: boolean;
}

interface ValidationReport {
  /** Total modules checked */
  totalModules: number;

  /** Modules that passed validation */
  validModules: number;

  /** Validation errors by module ID */
  errors: Map<string, ValidationError[]>;

  /** Validation warnings by module ID */
  warnings: Map<string, ValidationWarning[]>;

  /** Total personas checked */
  totalPersonas?: number;

  /** Personas that passed validation */
  validPersonas?: number;
}
```

### 4.3. listModules()

**Purpose**: List all available modules with metadata.

**Signature**:

```typescript
function listModules(options?: ListOptions): Promise<ModuleInfo[]>;

interface ListOptions {
  /** Path to modules.config.yml (default: './modules.config.yml') */
  configPath?: string;

  /** Include standard library modules (default: true) */
  includeStandard?: boolean;

  /** Filter by capability */
  capability?: string;

  /** Filter by tag */
  tag?: string;
}

interface ModuleInfo {
  /** Module ID */
  id: string;

  /** Human-readable name */
  name: string;

  /** Brief description */
  description: string;

  /** Module version */
  version: string;

  /** Capabilities provided */
  capabilities: string[];

  /** Source type */
  source: "standard" | "local";

  /** File path (if local) */
  filePath?: string;
}
```

---

## 5. File System Conventions

### 5.1. Module Files

**Extension**: `.module.ts`

**Location**: Configured via `modules.config.yml` or standard library path

**Export Convention**:

```typescript
// error-handling.module.ts
// Module ID: "error-handling"
export const errorHandling: Module = {
  id: "error-handling",
  // ...
};
```

**Module ID Extraction**:

Module IDs are extracted from the file path **relative to the configured base path**:

- Flat structure: `error-handling.module.ts` → `error-handling`
- Nested structure: `foundation/ethics/do-no-harm.module.ts` → `foundation/ethics/do-no-harm`

**Example**:

```yaml
# modules.config.yml
localModulePaths:
  - path: "./modules"
```

```
File location:   ./modules/foundation/ethics/do-no-harm.module.ts
Configured base: ./modules
Relative path:   foundation/ethics/do-no-harm.module.ts
Module ID:       foundation/ethics/do-no-harm
Export name:     foundationEthicsDoNoHarm
```

The export name is calculated using ums-lib's `moduleIdToExportName()` utility, which converts the module ID to camelCase format.

### 5.2. Persona Files

**Extension**: `.persona.ts`

**Export Convention**:

```typescript
// my-persona.persona.ts
export default {
  name: "My Persona",
  schemaVersion: "2.0",
  // ...
} satisfies Persona;

// OR named export
export const myPersona: Persona = {
  // ...
};
```

### 5.3. Configuration File

**Filename**: `modules.config.yml`

**Location**: Project root (default) or specified via options

**Format**:

```yaml
# Optional: Global conflict resolution strategy (default: 'error')
conflictStrategy: warn # 'error' | 'warn' | 'replace'

localModulePaths:
  - path: "./company-modules"
  - path: "./project-modules"
```

**Conflict Resolution**:

- The config file MAY specify a global `conflictStrategy` that applies to all module paths
- This can be overridden at runtime via `BuildOptions.conflictStrategy`
- If not specified in config or options, defaults to `'error'`

---

## 6. Error Handling

### 6.1. Error Types

The SDK MUST define specific error types:

```typescript
class SDKError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "SDKError";
  }
}

class ModuleLoadError extends SDKError {
  constructor(
    message: string,
    public filePath: string
  ) {
    super(message, "MODULE_LOAD_ERROR");
  }
}

class ModuleNotFoundError extends SDKError {
  constructor(public filePath: string) {
    super(`Module file not found: ${filePath}`, "MODULE_NOT_FOUND");
    this.filePath = filePath;
  }
}

class InvalidExportError extends SDKError {
  constructor(
    public filePath: string,
    public expectedExport: string,
    public availableExports: string[]
  ) {
    super(
      `Invalid export in ${filePath}: expected '${expectedExport}', found: ${availableExports.join(", ")}`,
      "INVALID_EXPORT"
    );
  }
}

class ConfigError extends SDKError {
  constructor(
    message: string,
    public configPath: string
  ) {
    super(message, "CONFIG_ERROR");
  }
}

class DiscoveryError extends SDKError {
  constructor(
    message: string,
    public searchPaths: string[]
  ) {
    super(message, "DISCOVERY_ERROR");
  }
}
```

### 6.2. Error Context

All SDK errors SHOULD include:

- File path (if applicable)
- Line number (if available from TypeScript errors)
- Expected vs actual values
- Suggestions for fixing

**Example**:

```typescript
throw new InvalidExportError(
  "/path/to/error-handling.module.ts",
  "errorHandling",
  ["ErrorHandling", "default"]
);

// Error message:
// Invalid export in /path/to/error-handling.module.ts:
// expected 'errorHandling', found: ErrorHandling, default
//
// Did you mean: export const errorHandling = ErrorHandling;
```

---

## 7. Extension Points

### 7.1. Custom Loaders

Implementations MAY provide custom loaders by implementing the loader interfaces:

```typescript
class CustomModuleLoader implements ModuleLoader {
  async loadModule(filePath: string, moduleId: string): Promise<Module> {
    // Custom loading logic (e.g., from database, S3, etc.)
    const content = await this.customLoad(filePath);
    const module = parseModuleObject(content);
    const validation = validateModule(module);
    if (!validation.valid) {
      throw new Error("Invalid module");
    }
    return module;
  }

  async loadRawContent(filePath: string): Promise<string> {
    return this.customLoad(filePath);
  }

  private async customLoad(path: string): Promise<any> {
    // Implementation-specific
  }
}
```

### 7.2. Plugin System (Future)

Future versions MAY define a plugin system:

```typescript
interface SDKPlugin {
  name: string;
  version: string;
  onBeforeBuild?(context: BuildContext): void;
  onAfterBuild?(context: BuildContext, result: BuildResult): void;
  onModuleLoad?(module: Module): void;
}
```

---

## 8. Version Compatibility

### 8.1. SDK Version vs ums-lib Version

**Versioning Scheme**: Independent semantic versioning

- SDK v1.x.x is compatible with ums-lib v2.x.x
- Breaking changes in SDK increment major version
- Breaking changes in ums-lib MAY require SDK update

### 8.2. Backward Compatibility

**SDK MUST**:

- Support ums-lib v2.0.0 and later v2.x versions
- Gracefully handle deprecated ums-lib features
- Provide upgrade guides for breaking changes

**SDK SHOULD**:

- Emit warnings for deprecated features
- Provide migration tools

---

## 9. Performance Requirements

### 9.1. Module Loading

- MUST load modules lazily when possible
- SHOULD cache parsed modules to avoid re-parsing
- SHOULD parallelize file discovery when safe

### 9.2. Build Performance

Target performance (on modern hardware):

- Small projects (<10 modules): <1 second
- Medium projects (10-50 modules): <3 seconds
- Large projects (50-200 modules): <10 seconds

### 9.3. Memory Usage

- SHOULD stream large files when possible
- SHOULD clean up module exports after loading
- MUST NOT keep entire codebase in memory

---

## 10. Security Considerations

### 10.1. Code Execution

**Risk**: Loading `.module.ts` files executes arbitrary TypeScript code.

**Mitigations**:

1. MUST document security implications
2. SHOULD provide option to disable dynamic loading
3. SHOULD validate file paths are within expected directories
4. MUST NOT execute untrusted code without user consent

### 10.2. Path Traversal

**Risk**: Malicious config could reference files outside project.

**Mitigations**:

1. MUST validate all paths are within project root
2. MUST reject `..` in configured paths
3. SHOULD normalize paths before use

---

## 11. Testing Requirements

### 11.1. Unit Tests

**Location**: Colocated with source files

**Naming Convention**: `{filename}.test.ts`

**Example Structure**:

```
src/
├── loaders/
│   ├── module-loader.ts
│   ├── module-loader.test.ts       # Unit tests colocated
│   ├── persona-loader.ts
│   └── persona-loader.test.ts      # Unit tests colocated
├── discovery/
│   ├── module-discovery.ts
│   └── module-discovery.test.ts    # Unit tests colocated
```

SDK implementations MUST include colocated unit tests for:

- All loader implementations
- Config parsing logic
- Discovery algorithms
- Error handling

### 11.2. Integration Tests

**Location**: `tests/integration/` at project root

**Purpose**: Test SDK with real file system, multiple components

**Example Structure**:

```
tests/
├── integration/
│   ├── build-workflow.test.ts      # End-to-end build tests
│   ├── module-loading.test.ts      # Real file loading
│   ├── error-scenarios.test.ts     # Error handling with files
│   └── multi-module.test.ts        # Complex projects
```

SDK implementations SHOULD include integration tests for:

- Complete build workflows
- Multi-module projects
- Error scenarios with real files
- Configuration loading

### 11.3. Test Fixtures

**Location**: `tests/fixtures/` at project root

**Purpose**: Provide sample modules, personas, configs for testing

**Example Structure**:

```
tests/
├── fixtures/
│   ├── modules/
│   │   ├── valid-module.module.ts
│   │   ├── invalid-export.module.ts
│   │   └── missing-id.module.ts
│   ├── personas/
│   │   ├── valid-persona.persona.ts
│   │   └── invalid-persona.persona.ts
│   └── configs/
│       ├── valid.modules.config.yml
│       └── invalid.modules.config.yml
```

### 11.4. Performance Tests

SDK implementations SHOULD benchmark:

- Module loading speed
- Discovery performance
- Memory usage

---

## 12. Documentation Requirements

SDK implementations MUST provide:

1. **API Documentation**: Generated from TypeScript types
2. **User Guide**: How to use high-level API
3. **Examples**: Common workflows with code samples
4. **Migration Guide**: Upgrading from previous versions
5. **Troubleshooting**: Common errors and solutions

---

## Appendix A: Reference Implementation Structure

```
packages/ums-sdk/
├── src/
│   ├── loaders/
│   │   ├── module-loader.ts
│   │   ├── module-loader.test.ts          # Unit tests colocated
│   │   ├── persona-loader.ts
│   │   ├── persona-loader.test.ts         # Unit tests colocated
│   │   ├── config-loader.ts
│   │   └── config-loader.test.ts          # Unit tests colocated
│   ├── discovery/
│   │   ├── module-discovery.ts
│   │   ├── module-discovery.test.ts       # Unit tests colocated
│   │   ├── standard-library.ts
│   │   └── standard-library.test.ts       # Unit tests colocated
│   ├── orchestration/
│   │   ├── build-orchestrator.ts
│   │   └── build-orchestrator.test.ts     # Unit tests colocated
│   ├── api/
│   │   ├── index.ts
│   │   └── index.test.ts                  # Unit tests colocated
│   ├── errors/
│   │   ├── index.ts
│   │   └── index.test.ts                  # Unit tests colocated
│   ├── types/
│   │   └── index.ts
│   └── index.ts
├── tests/
│   ├── integration/                       # Integration tests
│   │   ├── build-workflow.test.ts
│   │   ├── module-loading.test.ts
│   │   └── error-scenarios.test.ts
│   └── fixtures/                          # Test fixtures
│       ├── modules/
│       ├── personas/
│       └── configs/
├── package.json
├── tsconfig.json
└── README.md
```

---

**Specification Version**: 1.0.0
**Status**: Draft
**Last Updated**: 2025-01-13
