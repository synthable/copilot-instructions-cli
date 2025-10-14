import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import vitest from '@vitest/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

// Shared base configuration for all packages
export const baseConfig = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    ignores: ['node_modules', '**/dist/', '**/coverage/', '**/scripts/', '**/*.config.js', '**/*.config.ts'],
  },

  // 2. Base configuration for ALL TypeScript files in the monorepo
  {
    files: ['packages/**/*.ts'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'error', // Critical for async code
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/return-await': 'error',

      // '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',

      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',

      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      // '@typescript-eslint/strict-boolean-expressions': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'error',

      'no-undef': 'off', // 'no-undef' is handled by TypeScriptp
      'prefer-const': 'error',
      'no-console': 'off',
      'complexity': ['warn', { max: 20 }],
      'max-depth': ['warn', { max: 5 }],
      'max-lines-per-function': ['warn', { max: 71, skipBlankLines: true, skipComments: true }],

      '@typescript-eslint/restrict-template-expressions': 'off',

      'no-restricted-syntax': ['error', {
        selector: "TSTypeReference[typeName.type='TSQualifiedName'][typeName.left.type='TSImportType']",
        message: 'Inline type imports are not allowed. Import types at the top of the file.'
      }],
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: '2022',
        sourceType: 'module',
        projectService: true
      },
      globals: {
        ...globals.node,
      },
    },
  },

  // 3. Specific overrides for SOURCE files in the stricter `ums-lib` package
  {
    files: ['packages/ums-lib/src/**/*.ts'],
    ignores: ['packages/ums-lib/src/**/*.test.ts'],
    rules: {
      // Stricter rules for the library
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      // 'complexity': ['error', { max: 15 }],
    },
  },

  // 4. Specific overrides for SOURCE files in the stricter `ums-cli` package
  {
    files: ['packages/ums-cli/src/**/*.ts'],
    ignores: ['packages/ums-cli/src/**/*.test.ts'],
    rules: {
      // CLI-specific rules (more lenient than library)
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'max-lines-per-function': ['warn', { max: 100, skipBlankLines: true, skipComments: true }],
      'no-console': 'off', // CLI needs console output
    },
  },

  // 5. Configuration specifically for ALL TEST files across all packages
  {
    files: ['packages/*/src/**/*.test.ts'],
    ...vitest.configs.recommended,
    rules: {
      ...vitest.configs.recommended.rules,
      // Relax rules for tests
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/explicit-function-return-type': 'warn',

      '@typescript-eslint/no-explicit-any': 'off',
      'max-lines-per-function': 'off',
      'no-console': 'off',
      'max-lines': 'off',
      'complexity': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',

    },
  },

  prettierConfig
);

// Export both the base config and default for compatibility
export default baseConfig;
