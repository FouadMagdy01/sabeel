/**
 * Lint-Staged Configuration
 *
 * Runs linting and formatting on staged files before commit.
 * This ensures code quality without slowing down the entire codebase.
 */

module.exports = {
  // TypeScript and TypeScript React files
  '**/*.{ts,tsx}': [
    // 1. Fix ESLint errors (auto-fix where possible)
    'eslint --fix --max-warnings=0 --no-warn-ignored',
    // 2. Format with Prettier
    'prettier --write',
    // 3. Check TypeScript types (runs once for all files)
    () => 'tsc --noEmit --pretty',
  ],

  // JavaScript files (if any)
  '**/*.{js,jsx}': ['eslint --fix --max-warnings=0 --no-warn-ignored', 'prettier --write'],

  // JSON and Markdown files
  '**/*.{json,md}': ['prettier --write --ignore-unknown'],
};
