#!/usr/bin/env node
/**
 * MCP Server Entry Point
 *
 * This is the standalone entry point for the MCP server that can be invoked
 * directly by Claude Desktop or other MCP clients.
 *
 * Usage:
 *   node dist/index.js stdio    # For Claude Desktop (stdio transport)
 *   node dist/index.js http     # For HTTP transport
 *   node dist/index.js sse      # For SSE transport
 */

import { startMCPServer } from './server.js';

const transport = (process.argv[2] ?? 'stdio') as 'stdio' | 'http' | 'sse';

console.error(`Starting MCP server with ${transport} transport...`);

startMCPServer(transport).catch((error: unknown) => {
  console.error('Fatal error starting MCP server:', error);
  process.exit(1);
});
