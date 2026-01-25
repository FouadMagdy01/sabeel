# EAS Build Guide

Complete guide for understanding and using Expo Application Services (EAS) Build.

## 🤔 Local Build vs EAS Build - When to Use What?

### Local Build (`expo prebuild` + Xcode/Android Studio)

**What it is:**

- Generates native iOS/Android folders locally
- Builds on your machine or CI/CD runner
- Uses Xcode (macOS) or Gradle (Android)

**When to use:**

- ✅ Development builds
- ✅ Testing on simulators/emulators
- ✅ You have macOS for iOS builds
- ✅ CI/CD with free GitHub Actions runners
- ✅ Full control over build environment

**Limitations:**

- ❌ Requires macOS for iOS builds (expensive CI runners)
- ❌ Need to manage certificates/provisioning profiles manually
- ❌ No build cloud storage
- ❌ Longer CI/CD times
- ❌ Can't build iOS on Windows/Linux

---

### EAS Build (Cloud Build Service)

**What it is:**

- Expo's cloud build service
- Builds on Expo's servers
- Manages certificates automatically
- Works from any OS (Windows/Linux/macOS)

**When to use:**

- ✅ **Production releases** (App Store, Google Play)
- ✅ Building iOS on Windows/Linux
- ✅ Don't want to manage certificates
- ✅ Need internal distribution (TestFlight, Ad Hoc)
- ✅ Want faster CI/CD (no iOS runner costs)
- ✅ Team collaboration (shared builds)
- ✅ Automatic code signing

**Costs:**

- Free tier: Limited builds per month
- Paid plans: Unlimited builds
- Check: https://expo.dev/pricing

---

## 📱 Common Use Cases

### Use Case 1: Releasing to App Store/Google Play

**Scenario:** You want to submit your app to Apple App Store or Google Play Store

**Why EAS Build?**

- Handles code signing automatically
- Manages provisioning profiles
- Creates production builds
- Integrates with app stores

**Steps:**

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Configure your project
eas build:configure

# 4. Build for production
eas build --platform ios --profile production
eas build --platform android --profile production

# 5. Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

### Use Case 2: Internal Testing (TestFlight/Internal Distribution)

**Scenario:** You want to share builds with QA team or beta testers

**Why EAS Build?**

- Easy distribution to testers
- TestFlight integration for iOS
- Ad Hoc distribution
- No need to collect device UDIDs manually

**Steps:**

```bash
# 1. Create preview/staging build
eas build --platform ios --profile preview
eas build --platform android --profile preview

# 2. EAS provides a download link
# Share the link with your team

# 3. For iOS TestFlight:
eas submit --platform ios --profile preview
# Testers can install via TestFlight app
```

---

### Use Case 3: Building iOS on Windows/Linux

**Scenario:** You're developing on Windows or Linux but need iOS builds

**Why EAS Build?**

- Only way to build iOS without macOS
- Cloud macOS machines
- Works from any OS

**Steps:**

```bash
# On Windows or Linux
eas build --platform ios --profile development

# EAS builds on macOS in the cloud
# Downloads .ipa file when done
```

---

### Use Case 4: Automated CI/CD Production Releases

**Scenario:** Automatically build and release when you push a tag

**Why EAS Build?**

- No expensive macOS runners on CI/CD
- Automatic certificate management
- Faster build times
- Simpler workflow

**Steps:**

1. **Configure EAS Build profile** (`eas.json`):

```json
{
  "build": {
    "production": {
      "releaseChannel": "production",
      "distribution": "store",
      "ios": {
        "bundler": "metro"
      },
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

2. **Update GitHub workflow** (`.github/workflows/release.yml`):

```yaml
- name: Build with EAS
  run: |
    npm install -g eas-cli
    eas build --platform all --profile production --non-interactive --no-wait
  env:
    EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

3. **Push a release tag:**

```bash
git tag v1.0.0
git push --tags
```

---

## 🚀 Complete Setup Guide

### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 2: Login to Expo

```bash
# Create account at expo.dev if you don't have one
eas login
```

### Step 3: Configure Your Project

```bash
# This creates eas.json
eas build:configure
```

This creates `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "releaseChannel": "production"
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Step 4: Configure App Credentials

#### For iOS:

```bash
# EAS will guide you through:
# - Apple Developer Program enrollment
# - App Store Connect API key
# - Or let EAS manage everything

eas credentials
```

#### For Android:

```bash
# Generate upload keystore
eas credentials

# Or provide your own keystore
# Add to eas.json:
{
  "build": {
    "production": {
      "android": {
        "credentialsSource": "local"
      }
    }
  }
}
```

### Step 5: Create Your First Build

```bash
# Development build (for testing)
eas build --platform ios --profile development
eas build --platform android --profile development

# Production build (for app stores)
eas build --platform ios --profile production
eas build --platform android --profile production

# Build both platforms
eas build --platform all --profile production
```

### Step 6: Monitor Build Progress

```bash
# View build status
eas build:list

# View specific build
eas build:view <build-id>

# Or check on: https://expo.dev/accounts/[username]/projects/[project]/builds
```

### Step 7: Download and Test

```bash
# iOS: Download .ipa
# Android: Download .apk or .aab

# Install on device or upload to stores
```

---

## 🔑 Setting Up EXPO_TOKEN for CI/CD

### Step 1: Generate Token

```bash
# Visit: https://expo.dev/accounts/[username]/settings/access-tokens
# Click "Create Token"
# Name it: "GitHub Actions" or "CI/CD"
# Copy the token
```

### Step 2: Add to GitHub Secrets

1. Go to GitHub repository
2. Settings → Secrets and Variables → Actions
3. New repository secret
4. Name: `EXPO_TOKEN`
5. Value: Paste your token
6. Save

### Step 3: Use in Workflows

Your workflows already have this configured! Check:

- `.github/workflows/ios.yml`
- `.github/workflows/android.yml`

The EAS build jobs will use this token automatically.

---

## 💰 Cost Comparison

### Local Builds (Current Setup)

**GitHub Actions costs:**

- ✅ Free: Linux runners (Android)
- 💰 Expensive: macOS runners (iOS) - ~$0.08/minute
- 45-minute iOS build = ~$3.60 per build

**Total monthly (if building often):**

- Could be $50-200+ depending on frequency

### EAS Build

**Expo pricing:**

- 🆓 Free: Limited builds/month
- 💳 Production: $29/month (unlimited builds)
- 💼 Enterprise: Custom pricing

**Benefits:**

- Fixed monthly cost
- Unlimited builds
- No runner minutes consumed
- Build from any OS

---

## 🎯 Recommended Approach

### For Your Project (Sabeel):

**Development (Day-to-day):**

- Use local builds (`expo prebuild`)
- Fast iteration
- Free

**CI/CD (Pull Requests):**

- Use local builds on GitHub Actions
- Verify builds work
- Current setup is good

**Production Releases:**

- Use EAS Build
- When ready to release to stores
- Better for production

**Migration Path:**

```bash
# Phase 1: Keep current local builds for development
# (Current setup)

# Phase 2: Add EAS for production releases
# Update release.yml to use EAS Build

# Phase 3: Optional - Move all builds to EAS
# If you want to save CI/CD costs
```

---

## 📝 EAS Build Configuration Example

Create/Update `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "releaseChannel": "production",
      "distribution": "store",
      "ios": {
        "bundler": "metro",
        "simulator": false
      },
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-email@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD123456"
      },
      "android": {
        "serviceAccountKeyPath": "./path/to/api-key.json",
        "track": "internal"
      }
    }
  }
}
```

---

## 🔄 Integrating EAS with Your Current CI/CD

Update `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    name: Build and Release with EAS
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build with EAS
        run: |
          eas build --platform all --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

      - name: Submit to App Stores
        run: |
          eas submit --platform ios --latest --non-interactive
          eas submit --platform android --latest --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

---

## 📚 Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [EAS Pricing](https://expo.dev/pricing)
- [Managing Credentials](https://docs.expo.dev/app-signing/app-credentials/)

---

## 🎓 Quick Decision Guide

**Use Local Builds when:**

- ✅ Developing and testing
- ✅ You have macOS available
- ✅ Running CI/CD checks
- ✅ Want full control

**Use EAS Build when:**

- ✅ Releasing to App Store/Google Play
- ✅ Building iOS on Windows/Linux
- ✅ Want automatic certificate management
- ✅ Need TestFlight distribution
- ✅ Building many times per month (save money)
- ✅ Team collaboration

**Your Current Setup is Perfect For:**

- Day-to-day development
- PR validation
- Local testing

**Add EAS Build When:**

- Ready to release to stores
- Want easier distribution
- Building iOS frequently (cost savings)
