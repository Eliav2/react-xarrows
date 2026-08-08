import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['lib/**', 'dist/**', 'build/**', 'node_modules/**', 'examples/**', 'coverage/**', '.worktrees/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // The codebase leans on inference; requiring explicit boundary types would
      // mean annotating every exported component before any of it can be linted.
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // There is a deliberate cluster of `as any` around passProps/SVG element
      // typing, tracked in the source as a todo. Surface it without blocking CI.
      '@typescript-eslint/no-explicit-any': 'warn',

      // The `@ts-ignore` comments are intentional workarounds for SMIL element
      // typings that lib.dom.d.ts does not model.
      '@typescript-eslint/ban-ts-comment': 'warn',

      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-empty-function': 'warn',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '__test__/**'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
);
