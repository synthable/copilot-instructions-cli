/**
 * MCP Error Classes
 *
 * Structured error handling for MCP tool responses.
 */

/**
 * Base MCP error class
 */
export class MCPError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'MCPError';
  }
}

/**
 * Error thrown when a tool execution fails
 */
export class MCPToolError extends MCPError {
  constructor(message: string, code: string = 'TOOL_ERROR') {
    super(message, code);
    this.name = 'MCPToolError';
  }
}

/**
 * Error thrown when input validation fails
 */
export class MCPValidationError extends MCPError {
  constructor(
    message: string,
    public readonly issues: { path: string; message: string }[] = []
  ) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'MCPValidationError';
  }
}

/**
 * Error thrown when a resource is not found
 */
export class MCPNotFoundError extends MCPError {
  constructor(resource: string, identifier: string) {
    super(`${resource} not found: ${identifier}`, 'NOT_FOUND');
    this.name = 'MCPNotFoundError';
  }
}

/**
 * Format an error for MCP response
 */
export function formatErrorResponse(error: unknown): {
  isError: true;
  content: { type: 'text'; text: string }[];
} {
  let message: string;
  let code: string = 'UNKNOWN_ERROR';

  if (error instanceof MCPError) {
    message = error.message;
    code = error.code;
  } else if (error instanceof Error) {
    message = error.message;
    code = error.name;
  } else {
    message = String(error);
  }

  return {
    isError: true,
    content: [{ type: 'text', text: `Error [${code}]: ${message}` }],
  };
}
