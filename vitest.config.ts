import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
});
