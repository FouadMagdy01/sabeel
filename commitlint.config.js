/**
 * Commitlint Configuration
 *
 * Enforces conventional commit messages for consistent git history.
 *
 * Format: <type>(<scope>): <subject>
 *
 * Types:
 * - feat: A new feature
 * - fix: A bug fix
 * - docs: Documentation only changes
 * - style: Changes that do not affect the meaning of the code
 * - refactor: A code change that neither fixes a bug nor adds a feature
 * - perf: A code change that improves performance
 * - test: Adding missing tests or correcting existing tests
 * - build: Changes that affect the build system or external dependencies
 * - ci: Changes to our CI configuration files and scripts
 * - chore: Other changes that don't modify src or test files
 * - revert: Reverts a previous commit
 *
 * Examples:
 * - feat: add tasbih counter component
 * - fix: resolve prayer time calculation bug
 * - docs: update README with new features
 * - feat(quran): add verse bookmarking feature
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type must be one of the specified types
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation
        'style', // Formatting, missing semicolons, etc
        'refactor', // Code refactoring
        'perf', // Performance improvements
        'test', // Adding tests
        'build', // Build system changes
        'ci', // CI configuration
        'chore', // Maintenance
        'revert', // Revert previous commit
      ],
    ],
    // Subject must not be empty
    'subject-empty': [2, 'never'],
    // Subject must not end with period
    'subject-full-stop': [2, 'never', '.'],
    // Subject must be lowercase
    'subject-case': [2, 'always', 'lower-case'],
    // Type must be lowercase
    'type-case': [2, 'always', 'lower-case'],
    // Header (type + subject) max length
    'header-max-length': [2, 'always', 100],
  },
};
