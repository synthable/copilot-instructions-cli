# Tool Calling Instructions

When developing the copilot-instructions CLI, follow these guidelines for tool calling patterns:

## Command Line Interface Patterns

### Using Commander.js

This project uses Commander.js for CLI implementation. When adding or modifying commands:

1. **Command Structure**:
   ```typescript
   program
     .command('command-name')
     .description('Clear description of what the command does')
     .option('-o, --option <value>', 'Option description')
     .addHelpText('after', 'Examples...')
     .action(async (options) => {
       await handleCommand(options);
     });
   ```

2. **Options vs Arguments**:
   - Use **options** (flags) for optional parameters: `--output <file>`
   - Use **arguments** for required positional parameters: `<query>`
   - Always provide defaults for optional parameters

3. **Help Text**:
   - Include concrete examples in `addHelpText('after', ...)`
   - Show both simple and complex usage patterns
   - Use realistic file paths and values

### Handler Functions

1. **Pattern**:
   ```typescript
   export async function handleCommandName(options: {
     param?: string;
     verbose?: boolean;
   }): Promise<void> {
     // Implementation
   }
   ```

2. **Error Handling**:
   - Catch errors and provide helpful messages
   - Use `process.exit(1)` for fatal errors
   - Log stack traces only in verbose mode

3. **Verbosity**:
   - Respect the `--verbose` flag
   - Show progress indicators for long-running operations
   - Provide minimal output by default

## Module and Persona Loading

### Using the UMS Library

When working with the core library (`ums-lib`):

1. **Module Loading**:
   ```typescript
   const loader = new ModuleLoader(config);
   const modules = await loader.loadModules();
   ```

2. **Persona Building**:
   ```typescript
   const engine = new BuildEngine(loader);
   const result = await engine.buildPersona(personaConfig);
   ```

3. **Error Context**:
   - Always include file paths in error messages
   - Show line numbers for YAML parsing errors
   - Suggest fixes when possible

## File System Operations

### Best Practices

1. **Path Handling**:
   - Use `path.join()` and `path.resolve()` for cross-platform paths
   - Normalize paths before comparisons
   - Handle relative and absolute paths correctly

2. **Async File Operations**:
   - Use `fs/promises` for all file operations
   - Handle ENOENT (file not found) gracefully
   - Check file existence before operations when appropriate

3. **File Reading**:
   - Stream large files when possible
   - Parse YAML with proper error handling
   - Validate file extensions before processing

## Testing Patterns

### Unit Tests with Vitest

1. **Test Structure**:
   ```typescript
   describe('CommandName', () => {
     it('should handle basic case', async () => {
       // Arrange
       const input = ...;
       
       // Act
       const result = await handleCommand(input);
       
       // Assert
       expect(result).toBe(expected);
     });
   });
   ```

2. **Mocking**:
   - Mock file system operations for predictable tests
   - Use `vi.mock()` for module mocking
   - Clean up mocks in `afterEach()`

3. **Test Coverage**:
   - Cover happy path and error cases
   - Test edge cases (empty inputs, invalid paths, etc.)
   - Verify error messages are helpful
