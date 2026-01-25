# Development Setup Guide

Complete guide for setting up your development environment for the Sabeel project.

## 🎯 Overview

This project enforces strict code quality standards through:

- ✅ TypeScript with no `any` types
- ✅ Automatic removal of unused imports/variables
- ✅ No hardcoded strings (enforces i18n usage)
- ✅ No inline styles (enforces theme system)
- ✅ Conventional commit messages
- ✅ Auto-formatting on save
- ✅ Pre-commit quality checks

---

## 📋 Prerequisites

### Required Software

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **VS Code** (recommended) with these extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features

### Recommended VS Code Extensions

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
```

---

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd sabeel
npm install
```

### 2. VS Code Setup

The project includes `.vscode/settings.json` with optimal settings:

- ✅ Auto-fix ESLint errors on save
- ✅ Remove unused imports on save
- ✅ Format with Prettier on save
- ✅ Organize imports automatically

**Just open the project in VS Code and you're ready to go!**

---

## 🔧 Configuration Files

### ESLint (`eslint.config.js`)

Enforces code quality rules:

```javascript
// Prevents 'any' types
'@typescript-eslint/no-explicit-any': 'error'

// Removes unused imports
'unused-imports/no-unused-imports': 'error'

// Prevents hardcoded strings (enforce i18n)
'react-native/no-raw-text': 'error'

// Prevents inline styles
'react-native/no-inline-styles': 'error'

// Enforces best practices
'prefer-const': 'error'
'no-var': 'error'
```

**Test it:**

```bash
npm run lint         # Check for errors
npm run lint:fix     # Fix auto-fixable errors
```

### Prettier (`.prettierrc.js`)

Code formatting rules:

- Single quotes
- 2 space indentation
- Semicolons required
- 100 character line width

**Test it:**

```bash
npm run format       # Format all files
npm run format:check # Check formatting
```

### Commitlint (`commitlint.config.js`)

Enforces conventional commit format:

```
<type>(<scope>): <subject>

feat: add prayer time notifications
fix: resolve Quran audio playback bug
docs: update README
```

**Valid types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Adding tests
- `build` - Build system changes
- `ci` - CI configuration
- `chore` - Maintenance tasks
- `revert` - Revert previous commit

### Lint-Staged (`.lintstagedrc.js`)

Runs checks only on staged files before commit:

1. Fix ESLint errors
2. Check TypeScript types
3. Format with Prettier

---

## 📝 Development Workflow

### Making Changes

1. **Create a branch**

   ```bash
   git checkout -b feat/my-new-feature
   ```

2. **Make your changes**
   - Code will auto-format on save
   - Unused imports removed automatically
   - ESLint errors auto-fixed on save

3. **Check your code** (optional, runs automatically on commit)

   ```bash
   npm run validate  # Runs type-check, lint, and format check
   ```

4. **Commit with conventional commit**

   ```bash
   git add .
   git commit -m "feat: add my new feature"
   ```

   **What happens on commit:**
   - ✅ Lint-staged runs ESLint on changed files
   - ✅ TypeScript type checking
   - ✅ Prettier formatting
   - ✅ Commitlint validates message format
   - ❌ Commit fails if any check fails

5. **Push and create PR**
   ```bash
   git push origin feat/my-new-feature
   ```

---

## 🚫 Common Errors and Solutions

### Error: "Unexpected any" or "@typescript-eslint/no-explicit-any"

❌ **Bad:**

```typescript
function processData(data: any) {
  // Error!
  return data.value;
}
```

✅ **Good:**

```typescript
interface Data {
  value: string;
}

function processData(data: Data) {
  return data.value;
}

// Or use generics
function processData<T>(data: T) {
  return data;
}
```

### Error: "Unused imports"

❌ **Bad:**

```typescript
import { useState, useEffect } from 'react';  // useEffect unused

function MyComponent() {
  const [count, setCount] = useState(0);
  return <Text>{count}</Text>;
}
```

✅ **Good:**

```typescript
import { useState } from 'react';  // Only import what you use

function MyComponent() {
  const [count, setCount] = useState(0);
  return <Text>{count}</Text>;
}
```

**Note:** This is auto-fixed on save in VS Code!

### Error: "Invalid commit message"

❌ **Bad:**

```bash
git commit -m "added new feature"  # No type
git commit -m "feat: Added New Feature"  # Not lowercase
```

✅ **Good:**

```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve prayer time bug"
git commit -m "docs: update README"
```

### Error: "Raw text is not allowed"

This enforces i18n usage to ensure all user-facing text is translatable.

❌ **Bad:**

```tsx
<Text>Hello World</Text>  // Error: hardcoded string
<Button title="Submit" />  // Error: hardcoded string
```

✅ **Good:**

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <>
      <Text>{t('common.hello')}</Text>
      <Button title={t('buttons.submit')} />
    </>
  );
}
```

### Error: "Inline styles are not allowed"

❌ **Bad:**

```tsx
<View style={{ padding: 16, backgroundColor: '#fff' }}>
  <Text style={{ color: '#000' }}>Hello</Text>
</View>
```

✅ **Good:**

```tsx
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: 16,
    backgroundColor: theme.colors.background.surface,
  },
  text: {
    color: theme.colors.text.primary,
  },
}));

<View style={styles.container}>
  <Text style={styles.text}>Hello</Text>
</View>;
```

### Error: Variables with underscore prefix

If you have intentionally unused variables, prefix with `_`:

```typescript
// This is allowed
function example(_unusedParam: string, usedParam: number) {
  return usedParam * 2;
}

// Destructuring with unused vars
const { value, _unusedField } = someObject;
```

---

## 🛠️ Available Scripts

```bash
# Development
npm start                # Start Expo dev server
npm run android          # Run on Android
npm run ios              # Run on iOS

# Code Quality
npm run lint             # Check for lint errors
npm run lint:fix         # Fix lint errors
npm run format           # Format all files
npm run format:check     # Check if files are formatted
npm run type-check       # Run TypeScript type checking
npm run validate         # Run all checks (type-check + lint + format)

# Testing
npm test                 # Run tests
npm test -- --watch      # Run tests in watch mode
npm test -- --coverage   # Run tests with coverage
```

---

## 🔍 Pre-Commit Hooks

Located in `.husky/` directory:

### `pre-commit`

Runs **lint-staged** on staged files:

- ESLint auto-fix
- TypeScript type checking
- Prettier formatting

### `commit-msg`

Validates commit message format with **commitlint**.

**To skip hooks** (not recommended):

```bash
git commit --no-verify -m "feat: emergency fix"
```

---

## 📚 Best Practices

### 1. Use TypeScript Properly

```typescript
// ✅ Good - Explicit types
interface User {
  id: string;
  name: string;
}

function getUser(id: string): User {
  // ...
}

// ❌ Bad - Using 'any'
function getUser(id: any): any {
  // Error!
  // ...
}
```

### 2. Import Only What You Need

```typescript
// ✅ Good
import { useState } from 'react';
import { View, Text } from 'react-native';

// ❌ Bad - Unused imports
import { useState, useEffect, useCallback } from 'react'; // Unused!
import * as React from 'react'; // Avoid namespace imports
```

### 3. Use Semantic Color Tokens

```typescript
// ✅ Good
<View style={{ backgroundColor: colors.background.surface }}>
  <Text style={{ color: colors.text.primary }}>Hello</Text>
</View>

// ❌ Bad - Hard-coded colors
<View style={{ backgroundColor: '#FFFFFF' }}>
  <Text style={{ color: '#000000' }}>Hello</Text>
</View>
```

### 4. Follow Commit Conventions

```bash
# ✅ Good commits
git commit -m "feat: add prayer notifications"
git commit -m "fix: resolve audio playback issue"
git commit -m "docs: update component guide"
git commit -m "refactor: simplify theme generator"

# ❌ Bad commits
git commit -m "updates"
git commit -m "fix"
git commit -m "Added new feature"  # Not lowercase
```

---

## 🐛 Troubleshooting

### Hooks not running

```bash
# Reinstall husky
npm run prepare
```

### ESLint not working in VS Code

1. Reload VS Code window: `Cmd+Shift+P` → "Reload Window"
2. Check ESLint output: `Cmd+Shift+P` → "ESLint: Show Output Channel"
3. Make sure ESLint extension is installed and enabled

### Prettier not formatting on save

1. Check VS Code settings are being loaded from `.vscode/settings.json`
2. Set Prettier as default formatter:
   - `Cmd+Shift+P` → "Format Document With..."
   - Select "Configure Default Formatter..."
   - Choose "Prettier"

### TypeScript errors in commit

```bash
# Fix TypeScript errors
npm run type-check

# Or see errors in VS Code
# Open "Problems" panel (Cmd+Shift+M)
```

---

## 📖 Learn More

- **Theme System:** [src/theme/DESIGN_GUIDE.md](./src/theme/DESIGN_GUIDE.md)
- **Conventional Commits:** [conventionalcommits.org](https://www.conventionalcommits.org/)
- **TypeScript:** [typescriptlang.org](https://www.typescriptlang.org/)
- **ESLint:** [eslint.org](https://eslint.org/)
- **Prettier:** [prettier.io](https://prettier.io/)

---

## ✅ Checklist for New Developers

- [ ] Install Node.js 18+
- [ ] Install VS Code with ESLint and Prettier extensions
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Open project in VS Code
- [ ] Make a test commit to verify hooks work
- [ ] Read [DESIGN_GUIDE.md](./src/theme/DESIGN_GUIDE.md)
- [ ] Read main [README.md](./README.md)

---

**Questions?** Open an issue or ask in team chat!
