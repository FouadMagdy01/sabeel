// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const unusedImportsPlugin = require('eslint-plugin-unused-imports');
const reactNativePlugin = require('eslint-plugin-react-native');

const i18nextPlugin = require('eslint-plugin-i18next');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'dist/*',
      'node_modules/*',
      'android/*',
      'ios/*',
      '.expo/*',
      'build/*',
      'supabase/functions/**/*', // Supabase Edge Functions - separate TS project
      'src/theme/EXAMPLES.tsx', // Documentation file with intentional inline styles
      'src/utils/**/*', // Utility files - to be fixed in separate PR
      'src/services/**/*', // Service files - to be fixed in separate PR
      'src/i18n/config.ts', // i18n config
      'src/theme/config.ts', // Theme config
      'src/theme/unistyles.ts', // Unistyles config
      'index.ts', // Root index
      'src/common/components/Icon/**/*', // Icon components
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'unused-imports': unusedImportsPlugin,
      'react-native': reactNativePlugin,
      i18next: i18nextPlugin,
    },
    rules: {
      // ========================================
      // TypeScript: Prevent 'any' types
      // ========================================
      '@typescript-eslint/no-explicit-any': 'error', // Prevent explicit 'any'
      '@typescript-eslint/no-unsafe-assignment': 'error', // Prevent assigning 'any' to variables
      '@typescript-eslint/no-unsafe-member-access': 'error', // Prevent accessing members of 'any'
      '@typescript-eslint/no-unsafe-call': 'error', // Prevent calling functions with 'any'
      '@typescript-eslint/no-unsafe-return': 'error', // Prevent returning 'any' from functions

      // ========================================
      // Unused Imports and Variables
      // ========================================
      'no-unused-vars': 'off', // Turn off base rule (conflicts with TypeScript)
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // Ignore args starting with _
          varsIgnorePattern: '^_', // Ignore vars starting with _
          caughtErrorsIgnorePattern: '^_', // Ignore caught errors starting with _
          destructuredArrayIgnorePattern: '^_', // Ignore destructured arrays starting with _
        },
      ],
      'unused-imports/no-unused-imports': 'error', // Remove unused imports
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // ========================================
      // Code Quality
      // ========================================
      '@typescript-eslint/explicit-function-return-type': 'off', // Allow type inference
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Allow inferred return types
      '@typescript-eslint/prefer-nullish-coalescing': 'error', // Use ?? instead of ||
      '@typescript-eslint/prefer-optional-chain': 'error', // Use ?. for optional chaining
      '@typescript-eslint/no-floating-promises': 'error', // Await or handle promises
      '@typescript-eslint/await-thenable': 'error', // Only await promises
      '@typescript-eslint/no-misused-promises': 'error', // Prevent promise misuse

      // ========================================
      // Best Practices
      // ========================================
      'prefer-const': 'error', // Use const when variable is not reassigned
      'no-var': 'error', // Disallow var, use const/let
      'object-shorthand': ['error', 'always'], // Use object shorthand
      'prefer-arrow-callback': 'error', // Use arrow functions for callbacks
      'prefer-template': 'error', // Use template literals instead of string concatenation
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Warn on console.log (allow warn/error)

      // ========================================
      // React Native Specific
      // ========================================
      'react-native/no-inline-styles': 'error', // Prevent inline styles
      'react-native/no-color-literals': 'warn', // Warn on color literals (use theme)
      // 'react-native/no-raw-text': 'error', // usage of eslint-plugin-i18next is preferred
      'react-native/no-single-element-style-arrays': 'error', // Prevent single-element style arrays
      'react-native/no-unused-styles': 'error', // Remove unused styles
      'react-native/split-platform-components': 'warn', // Warn on platform-specific components

      // ========================================
      // i18n
      // ========================================
      'i18next/no-literal-string': [
        'error',
        {
          mode: 'jsx-text-only',
          'jsx-components': {
            exclude: ['Trans'],
          },
        },
      ],
    },
  },
]);
