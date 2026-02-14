<!--
  Sync Impact Report
  ==================
  Version change: 0.0.0 → 1.0.0 (MAJOR: initial constitution ratification)
  Modified principles: N/A (initial creation)
  Added sections:
    - Core Principles (5 principles)
    - Technology Constraints
    - Development Workflow
    - Governance
  Removed sections: None
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ compatible (Constitution Check section present)
    - .specify/templates/spec-template.md ✅ compatible (no constitution-specific references)
    - .specify/templates/tasks-template.md ✅ compatible (no constitution-specific references)
  Follow-up TODOs: None
-->

# Sabeel Constitution

## Core Principles

### I. Theme-Driven Styling

All UI styling MUST use the `react-native-unistyles` theme system via
`StyleSheet.create((theme) => ({...}))`. Hardcoded colors, inline styles,
and direct style objects are prohibited.

- Components MUST consume semantic color tokens from the theme
  (e.g., `theme.colors.text.primary`, `theme.colors.background.app`).
- Responsive sizing MUST use metric utilities (`rf()`, `hs()`, `vs()`,
  `spacing`, `spacingV`, `fontSize`) from `src/theme/metrics.ts`.
- Light/dark mode detection MUST use `theme.colors.mode`, never a
  `.name` property.

**Rationale**: Consistent theming across 5 Islamic themes and light/dark
modes requires a single source of truth. Inline styles bypass the theme
system and break visual consistency.

### II. Internationalization First

All user-facing text MUST be defined in i18n locale files
(`src/i18n/locales/ar.json`, `src/i18n/locales/en.json`). Hardcoded
strings in components are prohibited and enforced by ESLint.

- New features MUST include translations for both Arabic and English.
- RTL layout support MUST be preserved in all new components.
- String keys MUST follow a `<feature>.<context>.<label>` naming
  convention.

**Rationale**: Sabeel serves a multilingual Muslim audience. Arabic RTL
and English LTR MUST work without layout regression.

### III. Component Architecture

Components MUST follow the established folder convention with
separated concerns.

- Each component folder MUST contain: `Component.tsx`,
  `Component.styles.ts`, `Component.types.ts`, `index.ts`.
- Feature-specific components go in `src/features/<feature>/components/`.
- Shared reusable components go in `src/common/components/`.
- Components MUST NOT contain business logic; extract to hooks or
  services.

**Rationale**: Consistent structure enables discoverability, code
review efficiency, and independent styling/typing.

### IV. Code Quality Enforcement

All code MUST pass the automated quality pipeline before merge.

- TypeScript: no `any` types allowed.
- ESLint: no unused imports, no hardcoded strings, no inline styles.
- Prettier: all code MUST be formatted per project config.
- Conventional Commits: all commit messages MUST follow the
  `<type>: <description>` format enforced by commitlint.
- Pre-commit hooks (Husky + lint-staged) MUST NOT be bypassed
  with `--no-verify`.

**Rationale**: Automated enforcement prevents quality regression and
reduces review burden. The `npm run validate` command gates all PRs.

### V. Simplicity and YAGNI

Features MUST be implemented with the minimum complexity required.

- No premature abstractions: three similar lines of code are
  preferred over a premature utility.
- No speculative features: implement only what is currently needed.
- No unnecessary dependencies: prefer Expo/RN built-in APIs before
  adding third-party packages.
- Complexity MUST be justified in PR descriptions when added.

**Rationale**: A lean codebase is easier to maintain, debug, and
onboard contributors to. Over-engineering slows iteration.

## Technology Constraints

The following technology decisions are binding for all feature work:

- **Runtime**: React Native with Expo SDK 54+.
- **Routing**: expo-router (file-based routing in `app/` directory).
- **Styling**: `react-native-unistyles` exclusively.
- **Fonts**: Cairo family (loaded via Expo).
- **Icons**: `expo-vector-icons` via the `src/common/components/Icon/`
  wrapper with variant support.
- **Backend**: Supabase (auth, database, storage).
- **Audio**: `react-native-track-player` for Quran recitation.
- **Animations**: `react-native-reanimated`.
- **State**: Local state and React context preferred; introduce a
  state management library only when justified per Principle V.

Deviations from the stack MUST be discussed and approved before
implementation.

## Development Workflow

- **Branching**: Feature branches named `<type>/<description>`
  (e.g., `feat/tasbih-counter`).
- **Commits**: Conventional Commits enforced by commitlint.
  Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
- **Pre-commit**: Husky runs `lint-staged` (type-check, ESLint,
  Prettier) on every commit.
- **Validation**: `npm run validate` (type-check + lint + format check)
  MUST pass before opening a PR.
- **CI Pipeline**: GitHub Actions runs type-check, lint, format,
  tests, security audit, and build verification on every PR.
- **Testing**: Tests are optional per feature. When included, they
  MUST use Jest and follow the existing test configuration.
- **PR Reviews**: PRs MUST include a clear description of changes,
  screenshots for UI changes, and testing steps.

## Governance

This constitution is the authoritative reference for project standards.
All PRs and code reviews MUST verify compliance with these principles.

- **Amendments**: Any change to this constitution MUST be documented
  with a version bump, rationale, and migration plan if breaking.
- **Versioning**: Constitution follows semantic versioning:
  - MAJOR: Principle removal or redefinition.
  - MINOR: New principle or material expansion.
  - PATCH: Clarifications, wording, or typo fixes.
- **Compliance**: Automated tooling (ESLint, commitlint, Husky)
  enforces Principles II and IV. Manual review enforces Principles
  I, III, and V.
- **Disputes**: When a principle conflicts with a practical need,
  the deviation MUST be documented in the PR with justification and
  reviewed by a project maintainer.

**Version**: 1.0.0 | **Ratified**: 2026-02-14 | **Last Amended**: 2026-02-14
