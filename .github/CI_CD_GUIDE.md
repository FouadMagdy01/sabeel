# CI/CD Guide

Complete guide for the CI/CD pipelines configured for the Sabeel project.

## 📋 Overview

We use **GitHub Actions** for all CI/CD workflows. The pipelines are designed to:

- ✅ Ensure code quality on every commit
- ✅ Build apps automatically
- ✅ Run comprehensive tests
- ✅ Deploy releases automatically

---

## 🔄 Workflows

### 1. CI (Continuous Integration)

**File:** `.github/workflows/ci.yml`

**Triggers:**

- Push to `main` or `develop`
- All pull requests

**Jobs:**

#### Code Quality

- TypeScript type checking (`tsc --noEmit`)
- ESLint linting
- Prettier formatting check
- Commit message validation (on PRs)

#### Testing

- Runs all tests with coverage
- Uploads coverage to Codecov

#### Security

- npm audit for vulnerabilities
- Snyk security scan (optional)

#### Build Check

- Validates Expo configuration
- Test web export

**Status:** Required for merging PRs

---

### 2. Android Build

**File:** `.github/workflows/android.yml`

**Triggers:**

- Push to `main`
- Changes to Android code
- Manual workflow dispatch

**What it does:**

1. Sets up Android SDK and Java
2. Runs type check and linting
3. Builds debug APK
4. Uploads APK as artifact (downloadable for 30 days)
5. Comments APK size on PR
6. Optional: Triggers EAS production build on main

**Artifacts:**

- `app-debug.apk` - Debug build for testing

---

### 3. iOS Build

**File:** `.github/workflows/ios.yml`

**Triggers:**

- Push to `main`
- Changes to iOS code
- Manual workflow dispatch

**What it does:**

1. Sets up Xcode and CocoaPods
2. Runs type check and linting
3. Builds for iOS simulator
4. Uploads build logs
5. Optional: Triggers EAS production build on main

**Artifacts:**

- iOS build logs

**Note:** iOS builds run on macOS runners (slower and more expensive)

---

### 4. Release

**File:** `.github/workflows/release.yml`

**Triggers:**

- Version tags (`v1.0.0`, `v1.0.1`, etc.)
- Manual dispatch with version input

**What it does:**

1. Creates GitHub release with auto-generated changelog
2. Builds production Android APK
3. Signs APK (if keystore available)
4. Uploads APK to GitHub release
5. Builds production iOS/Android with EAS
6. Publishes update to Expo

**Creating a release:**

```bash
# Update version in package.json
npm version patch  # or minor, major

# Push tag
git push --tags

# GitHub Actions automatically creates release
```

---

### 5. PR Checks

**File:** `.github/workflows/pr-check.yml`

**Triggers:**

- Pull request opened/updated

**What it does:**

#### PR Title Validation

Ensures PR title follows conventional commits:

```
✅ feat: add new feature
✅ fix: resolve bug
❌ Added new feature
❌ updates
```

#### PR Size Labeling

Automatically labels PRs by size:

- 🔬 `size/XS` - < 10 changes
- 🐜 `size/S` - < 100 changes
- 🐕 `size/M` - < 500 changes
- 🐘 `size/L` - < 1000 changes
- 🦑 `size/XL` - 1000+ changes

Warns if PR is too large (>1000 changes).

#### Breaking Change Detection

Scans commits for:

- `BREAKING CHANGE:` in commit message
- `!` in commit type (e.g., `feat!:`)

If found:

- Adds `breaking-change` label
- Comments with checklist

#### Auto-assign Reviewers

Automatically assigns reviewers when PR is opened.

#### Auto-labeling

Labels PR based on changed files:

- `documentation` - Markdown files
- `theme` - Theme files
- `components` - Component files
- `android` - Android code
- `ios` - iOS code
- `tests` - Test files
- etc.

---

## 🔐 Required Secrets

Configure these in **GitHub Settings → Secrets and Variables → Actions → New repository secret**

### EXPO_TOKEN

**What is it?**

- Authentication token for Expo services
- Required for EAS builds, publishing, and Expo services
- Optional for basic local builds (prebuild)

**Do you need it?**

- ✅ **YES** - If using EAS Build for production apps
- ✅ **YES** - If publishing OTA updates
- ⚠️ **OPTIONAL** - For basic CI/CD with local builds (our iOS/Android workflows)

**Will builds fail without it?**

- ❌ NO - Local builds (`expo prebuild`) will work fine
- ⚠️ YES - EAS builds will fail
- ⚠️ YES - Expo publishing will fail
- ℹ️ You may see a warning in logs, but it won't stop the build

**How to get it:**

```bash
# Step 1: Login to Expo (create account if needed)
npx expo login

# Step 2: Generate access token
# Visit: https://expo.dev/accounts/[username]/settings/access-tokens
# OR get from state file:
cat ~/.expo/state.json
```

**How to configure it:**

1. Go to your GitHub repository
2. Settings → Secrets and Variables → Actions
3. Click "New repository secret"
4. Name: `EXPO_TOKEN`
5. Value: Paste your token
6. Click "Add secret"

### Optional - Code Coverage

```text
CODECOV_TOKEN
```

Get from: [codecov.io](https://codecov.io)

### Optional - Android Release Signing

```text
ANDROID_KEYSTORE_BASE64
ANDROID_KEYSTORE_PASSWORD
ANDROID_KEY_ALIAS
ANDROID_KEY_PASSWORD
```

Create keystore:

```bash
keytool -genkey -v -keystore release.keystore -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000

# Convert to base64
base64 release.keystore | pbcopy
```

---

## 🚀 Manually Triggering Workflows

### Via GitHub UI

1. Go to Actions tab
2. Select workflow
3. Click "Run workflow"
4. Fill in inputs (if any)
5. Click "Run workflow"

### Via GitHub CLI

```bash
# Trigger Android build
gh workflow run android.yml

# Trigger iOS build
gh workflow run ios.yml

# Create release
gh workflow run release.yml -f version=1.0.0
```

---

## 📊 Workflow Status

### Check Status

```bash
# Via GitHub CLI
gh run list --workflow=ci.yml

# View specific run
gh run view <run-id>

# Watch live
gh run watch
```

### Status Badges

Add to README:

```markdown
[![CI](https://github.com/user/repo/actions/workflows/ci.yml/badge.svg)](https://github.com/user/repo/actions/workflows/ci.yml)
```

---

## 🐛 Troubleshooting

### CI Failing - Type Errors

```bash
# Run locally
npm run type-check

# Common fix
npm install
```

### CI Failing - Lint Errors

```bash
# Run locally
npm run lint

# Auto-fix
npm run lint:fix
```

### CI Failing - Format Errors

```bash
# Check formatting
npm run format:check

# Auto-format
npm run format
```

### Android Build Failing

```bash
# Clean and rebuild locally
cd android
./gradlew clean
./gradlew assembleDebug
```

### iOS Build Failing

```bash
# Clean and rebuild locally
cd ios
rm -rf Pods Podfile.lock
pod install
```

### EAS Build Failing

```bash
# Check EAS status
npx eas build:list

# View build logs
npx eas build:view <build-id>
```

---

## 🔧 Customization

### Modify Workflows

1. Edit `.github/workflows/*.yml`
2. Test changes on a branch
3. PR to merge changes

### Add New Workflow

1. Create `.github/workflows/my-workflow.yml`
2. Define triggers and jobs
3. Test and deploy

### Example: Add Slack Notifications

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Build completed!'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

---

## 📚 Best Practices

### 1. Keep Workflows Fast

- Use caching for dependencies
- Run jobs in parallel
- Use `concurrency` to cancel outdated runs

### 2. Secure Your Secrets

- Never commit secrets
- Use GitHub Secrets for sensitive data
- Rotate secrets regularly

### 3. Monitor Costs

- iOS builds are expensive (use sparingly)
- Use `workflow_dispatch` for manual builds
- Set timeout limits on jobs

### 4. Keep Logs Clean

- Use descriptive job/step names
- Add helpful comments
- Group related steps

---

## 📖 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Expo GitHub Actions](https://docs.expo.dev/build/building-on-ci/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🎯 Quick Commands

```bash
# Local validation (what CI checks)
npm run validate

# Run all checks individually
npm run type-check
npm run lint
npm run format:check
npm test

# Fix issues
npm run lint:fix
npm run format

# Build locally
npm run build:android
npm run build:ios

# Manual workflow trigger
gh workflow run android.yml
gh workflow run ios.yml
```

---

**Need help?** Check the workflow logs in the Actions tab or open an issue.
