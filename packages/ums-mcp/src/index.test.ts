/**
 * UMS MCP Server Entry Point Tests
 *
 * Note: The entry point (index.ts) is a CLI runner that starts the server immediately.
 * Library exports are available from server.ts.
 */

import { describe, it, expect } from 'vitest';
import { startMCPServer } from './server.js';

describe('UMS MCP Server', () => {
  it('exports startMCPServer function from server module', () => {
    expect(typeof startMCPServer).toBe('function');
  });
});
