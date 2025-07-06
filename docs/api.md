⚠️ **Warning: This API documentation is outdated and should not be used until this warning is removed.** ⚠️

# API Documentation

## Core Modules

### Parser (`src/core/parser.ts`)

#### `parseModuleMetadata(filePath: string, modulesPath: string): Promise<IndexedModule>`

Parses a module file and extracts metadata.

**Parameters:**

- `filePath`: Absolute path to the module file
- `modulesPath`: Root directory of modules

**Returns:** `IndexedModule` object with parsed metadata

**Throws:**

- `ParseError` if frontmatter is invalid
- `ValidationError` if required fields are missing

**Example:**

```typescript
const module = await parseModuleMetadata(
  '/path/to/module.md',
  './instructions-modules'
);
```

### Compiler (`src/core/compiler.ts`)

#### `compileInstructions(modules: Module[], options?: CompileOptions): string`

Compiles modules into final instruction content.

**Parameters:**

- `modules`: Array of modules to compile
- `options`: Optional compilation settings

**Returns:** Compiled instruction content as string

### Resolver (`src/core/resolver.ts`)

#### `resolveModules(moduleIds: string[], index: ModuleIndex): Module[]`

Resolves module IDs to full module objects, handling dependencies.

**Parameters:**

- `moduleIds`: Array of module IDs (supporting globs)
- `index`: Module index for lookups

**Returns:** Ordered array of resolved modules

## Utility Functions

### File System (`src/utils/file-system.ts`)

#### `findMarkdownFiles(directory: string): Promise<string[]>`

Recursively finds all markdown files in a directory.

#### `ensureDirectoryExists(path: string): Promise<void>`

Creates directory if it doesn't exist.

### Template Processing (`src/utils/templates.ts`)

#### `processTemplate(template: string, variables: Record<string, any>): string`

Processes template strings with variable substitution.

**Supported syntax:**

- `{{variable}}` - Simple substitution
- `{{variable || 'default'}}` - With default value
- `{{func(arg1, arg2)}}` - Function calls

## Custom Errors

### `ModuleError`

Base class for all module-related errors.

### `ParseError`

Thrown when module parsing fails.

### `ValidationError`

Thrown when module validation fails.

### `ConflictError`

Thrown when unresolvable module conflicts occur.

### `CircularDependencyError`

Thrown when circular dependencies are detected.

## Extending the API

To add custom functionality:

1. Create new module in appropriate directory
2. Export public functions
3. Add TypeScript declarations
4. Update this documentation

Example custom validator:

```typescript
// src/validators/custom.ts
export function validateCustomRule(module: Module): ValidationResult {
  // Your validation logic
  return { valid: true };
}
```
