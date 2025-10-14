# UMS Library: Error Handling Strategy

**Author:** Gemini
**Date:** 2025-10-10

## 1. Introduction

The `ums-lib` employs a robust and structured error handling strategy centered around a custom error hierarchy. This allows consuming applications to catch errors programmatically and respond to different failure modes with precision.

All errors thrown by the library are instances of the base `UMSError` class.

## 2. The UMSError Hierarchy

The library defines a hierarchy of error classes to represent different types of failures:

*   **`UMSError`**: The base class for all custom errors in the library. It includes a `code` and an optional `context` property.

    *   **`UMSValidationError`**: Thrown when a module or persona fails to validate against the UMS v2.0 specification. It includes an optional `path` to the invalid field and a `section` reference to the UMS specification.

    *   **`ModuleLoadError`**: Thrown when there is an issue parsing a module. It includes the `filePath` of the module that failed to load.

    *   **`PersonaLoadError`**: Thrown when there is an issue parsing a persona. It includes the `filePath` of the persona that failed to load.

    *   **`BuildError`**: A generic error for failures during the build process.

    *   **`ConflictError`**: Thrown by the `ModuleRegistry` when a module ID conflict is detected and the resolution strategy is set to `'error'`. It includes the `moduleId` and the number of conflicting modules.

## 3. Error Handling in Practice

Consuming applications can use type guards to differentiate between error types and handle them accordingly.

### Type Guards

The library exports the following type guards:

*   **`isUMSError(error: unknown): boolean`**: Returns `true` if the error is an instance of `UMSError` or one of its subclasses.
*   **`isValidationError(error: unknown): boolean`**: Returns `true` if the error is an instance of `UMSValidationError`.

### Example: Catching a Validation Error

```typescript
import { parseModule, isValidationError } from 'ums-lib';

const invalidModuleContent = `
id: invalid
shape: specification
`;

try {
  parseModule(invalidModuleContent);
} catch (error) {
  if (isValidationError(error)) {
    console.error(`Validation failed for field: ${error.path}`);
    console.error(`Reason: ${error.message}`);
  } else {
    console.error(`An unexpected error occurred: ${error.message}`);
  }
}
```
