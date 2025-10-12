import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    // setupFiles: ['./src/test/setup.ts'],

    environment: 'node',
    globals: true,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.test.ts',
        '**/*.config.ts',
        '**/src/index.ts', // CLI entry point
        '**/src/commands/mcp.ts', // MCP stub implementations
        '**/src/test/**', // Test utilities
      ],
    },
  },
  workspace: ['packages/*'],
});
