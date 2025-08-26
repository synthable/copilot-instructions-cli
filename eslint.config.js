import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import vitest from '@vitest/eslint-plugin';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        project: './tsconfig.json',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'prettier/prettier': 'error',

      // '@typescript-eslint/no-floating-promises': 'error', // Critical for async code
      // '@typescript-eslint/await-thenable': 'error',
      // '@typescript-eslint/no-misused-promises': 'error',
      // '@typescript-eslint/require-await': 'warn',
      // '@typescript-eslint/return-await': 'error',

      // '@typescript-eslint/prefer-readonly': 'warn',
      // '@typescript-eslint/prefer-as-const': 'error',
      // '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      // '@typescript-eslint/prefer-optional-chain': 'warn',

      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      // '@typescript-eslint/no-unused-expressions': 'warn',
      // '@typescript-eslint/no-non-null-assertion': 'warn',
      // '@typescript-eslint/consistent-type-imports': 'warn',
      // '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      // '@typescript-eslint/strict-boolean-expressions': 'warn',
      // '@typescript-eslint/no-unsafe-argument': 'warn',

      'no-undef': 'off', // 'no-undef' is handled by TypeScript
      'prefer-const': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      'no-console': 'off', // Allow console for CLI applications
      'complexity': ['warn', { max: 20 }],
      'max-depth': ['warn', { max: 5 }],
      'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['**/*.{test,spec}.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'max-lines-per-function': 'off',
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
        // Workaround for a persistent ESLint 'no-undef' error for the NodeJS type.
        // This is needed even with "types": ["node"] in tsconfig.json and aligned Node versions.
        NodeJS: 'readonly',
      }
    }
  }, {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      '**/*.d.ts',
      '*.config.js',
      '*.config.ts',
    ],
  },
];