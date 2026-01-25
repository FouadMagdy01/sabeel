/**
 * Prettier Configuration
 *
 * Code formatting rules for consistent code style across the project.
 */

module.exports = {
  // Use single quotes instead of double quotes
  singleQuote: true,

  // Add trailing commas in ES5 contexts (objects, arrays, etc.)
  trailingComma: 'es5',

  // Use 2 spaces for indentation
  tabWidth: 2,

  // Always add semicolons
  semi: true,

  // Print width (line length before wrapping)
  printWidth: 100,

  // Use spaces instead of tabs
  useTabs: false,

  // Add spaces between brackets in object literals
  bracketSpacing: true,

  // Put closing bracket on new line for JSX
  bracketSameLine: false,

  // Use 'lf' for line endings (Unix-style)
  endOfLine: 'lf',

  // Format quoted properties in objects consistently
  quoteProps: 'as-needed',

  // JSX: Use single quotes
  jsxSingleQuote: false,

  // Arrow functions: Always include parentheses around arguments
  arrowParens: 'always',
};
