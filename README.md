# 🕌 Sabeel - Islamic Companion App

**A comprehensive Islamic mobile application built with React Native and Expo, featuring prayer times, Quran reader, tasbih counter, and more.**

[![CI](https://github.com/FouadMagdy01/sabeel/actions/workflows/ci.yml/badge.svg)](https://github.com/FouadMagdy01/sabeel/actions/workflows/ci.yml)
[![Android Build](https://github.com/FouadMagdy01/sabeel/actions/workflows/android.yml/badge.svg)](https://github.com/FouadMagdy01/sabeel/actions/workflows/android.yml)
[![iOS Build](https://github.com/FouadMagdy01/sabeel/actions/workflows/ios.yml/badge.svg)](https://github.com/FouadMagdy01/sabeel/actions/workflows/ios.yml)
[![React Native](https://img.shields.io/badge/React%20Native-0.73-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~50.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

### 🕌 Core Islamic Features

- **Prayer Times** - Accurate prayer times based on location with notifications
- **Quran Reader** - Beautiful Arabic Quran with translations and audio
- **Tasbih Counter** - Digital counter for dhikr and tasbeeh
- **Qibla Compass** - Find the direction to Mecca from anywhere
- **Hijri Calendar** - Islamic calendar with important dates
- **Hadith Library** - Collection of authentic hadiths with search

### 🎨 Design & Customization

- **5 Islamic Themes** - Emerald, Desert, Sapphire, Moonlight, Royal
- **Light & Dark Modes** - Optimized for day and night use
- **Custom Themes** - Create personalized themes from any color
- **Beautiful Typography** - Optimized Arabic fonts and layouts
- **Responsive Design** - Works on all screen sizes

### 🌐 Localization

- **Multi-language Support** - Arabic, English, and more
- **RTL Support** - Proper right-to-left layout for Arabic
- **i18n Integration** - Complete internationalization

### 📱 Technical Features

- **Offline Support** - Core features work without internet
- **Audio Playback** - Quran recitation with playback controls
- **Location Services** - Automatic prayer time calculation
- **Push Notifications** - Prayer time reminders
- **Data Persistence** - Local storage with Supabase sync

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app (for testing on physical device)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sabeel
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Scan QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

---

## 📁 Project Structure

```
sabeel/
├── app/                      # Expo Router pages
│   ├── (auth)/              # Authentication screens
│   ├── (main)/              # Main app screens
│   │   └── (tabs)/          # Bottom tab navigation
│   │       ├── index.tsx    # Home screen
│   │       ├── prayers/     # Prayer times
│   │       ├── quran/       # Quran reader
│   │       ├── library/     # Hadith library
│   │       └── settings/    # App settings
│   ├── _layout.tsx          # Root layout
│   └── index.tsx            # Entry point
├── src/
│   ├── common/
│   │   └── components/      # Shared components
│   │       ├── Button/
│   │       └── Icon/
│   ├── integrations/        # External services
│   │   ├── supabase.ts     # Supabase client
│   │   └── database.types.ts
│   └── theme/              # Design system
│       ├── DESIGN_GUIDE.md # Complete design guide
│       ├── index.ts
│       ├── types.ts
│       └── ...
├── assets/                  # Images, fonts, icons
├── .vscode/                # VS Code settings
└── package.json
```

---

## 🎨 Design System

We've built a comprehensive design system with 60+ semantic color tokens and 5 beautiful Islamic themes.

### Quick Links

- **📄 [Design System Overview](./src/theme/DESIGN_GUIDE.md)** - Complete design guide
- **⚡ [Quick Start](./src/theme/QUICK_START.md)** - Get started in 2 minutes
- **📋 [Cheat Sheet](./src/theme/CHEAT_SHEET.md)** - Quick reference
- **📖 [Component Guide](./src/theme/COMPONENT_GUIDE.md)** - All components
- **💻 [Examples](./src/theme/EXAMPLES.tsx)** - Copy-paste components

### Using the Theme

```tsx
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { colors } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background.app }}>
      <Text style={{ color: colors.text.primary }}>Hello</Text>
    </View>
  );
}
```

### Available Themes

| Theme        | Description       | Best For              |
| ------------ | ----------------- | --------------------- |
| 🕌 Emerald   | Traditional teal  | Default, Professional |
| 🏜️ Desert    | Warm golden sands | Reading, Traditional  |
| 🔷 Sapphire  | Deep blue domes   | Modern, Scholarly     |
| 🌙 Moonlight | Cool silver       | Minimalist, Night     |
| 👑 Royal     | Purple & gold     | Premium, Elegant      |

---

## 🛠️ Tech Stack

### Frontend

- **[React Native](https://reactnative.dev/)** - Mobile framework
- **[Expo](https://expo.dev/)** - Development platform
- **[Expo Router](https://docs.expo.dev/router/introduction/)** - File-based routing
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[React Native Unistyles](https://reactnativeunistyles.vercel.app/)** - Styling

### Backend & Services

- **[Supabase](https://supabase.com/)** - Backend as a service
- **[React Native Track Player](https://react-native-track-player.js.org/)** - Audio playback

### Theming & Design

- **[Chroma.js](https://gka.github.io/chroma.js/)** - Color manipulation
- **Custom Design System** - 60+ semantic color tokens

### Development Tools

- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[lint-staged](https://github.com/okonet/lint-staged)** - Pre-commit linting
- **[Commitlint](https://commitlint.js.org/)** - Conventional commits
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting

---

## 🚀 CI/CD Pipeline

We use GitHub Actions for continuous integration and deployment.

### Workflows

#### 1. **CI (Continuous Integration)** - Runs on every PR and push

- ✅ TypeScript type checking
- ✅ ESLint code quality checks
- ✅ Prettier code formatting verification
- ✅ Unit tests with coverage
- ✅ Security audit
- ✅ Build verification

#### 2. **Android Build** - Builds Android APK

- Runs on push to `main` or manually
- Builds debug and release APKs
- Uploads artifacts for download
- Optional: EAS production build

#### 3. **iOS Build** - Builds iOS app

- Runs on push to `main` or manually
- Builds for simulator
- Optional: EAS production build

#### 4. **Release** - Creates releases

- Triggered by version tags (`v1.0.0`)
- Builds production APK/IPA
- Publishes to Expo
- Creates GitHub release with changelog

#### 5. **PR Checks** - Automated PR validation

- Validates PR title follows conventional commits
- Checks PR size and adds labels
- Detects breaking changes
- Auto-assigns reviewers
- Auto-labels based on changed files

### Running Workflows Locally

```bash
# Check what CI checks (no builds)
npm run validate

# Individual checks
npm run type-check
npm run lint
npm run format:check
npm test
```

### GitHub Secrets Required

For full CI/CD functionality, set these secrets in your GitHub repository:

```
EXPO_TOKEN          # Expo authentication token
CODECOV_TOKEN       # Code coverage reporting (optional)
ANDROID_KEYSTORE_BASE64         # Android signing keystore (for releases)
ANDROID_KEYSTORE_PASSWORD       # Keystore password
ANDROID_KEY_ALIAS               # Key alias
ANDROID_KEY_PASSWORD            # Key password
```

---

## 📝 Development Workflow

### Code Quality

We enforce strict code quality standards:

✅ **No `any` types** - Full TypeScript type safety
✅ **No unused imports** - Clean, maintainable code
✅ **No hardcoded strings** - i18n enforced for all user-facing text
✅ **No inline styles** - Theme system enforced
✅ **Conventional commits** - Standardized commit messages
✅ **Auto-formatting** - Code formatted on save
✅ **Pre-commit hooks** - Quality checks before commit

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add tasbih counter component
fix: resolve prayer time calculation bug
docs: update README with new features
style: format code with prettier
refactor: restructure theme system
test: add tests for Quran reader
chore: update dependencies
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

### Making Changes

1. **Create a branch**

   ```bash
   git checkout -b feat/new-feature
   ```

2. **Make your changes**
   - Code will auto-format on save
   - Unused imports removed automatically

3. **Commit with conventional commit**

   ```bash
   git commit -m "feat: add new feature"
   ```

   - Pre-commit hooks will run automatically
   - Checks for TypeScript errors, unused imports, `any` types
   - Validates commit message format

4. **Push and create PR**
   ```bash
   git push origin feat/new-feature
   ```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

---

## 📱 Building for Production

### iOS

```bash
# Build for iOS
npx expo build:ios

# Or use EAS Build
npx eas build --platform ios
```

### Android

```bash
# Build for Android
npx expo build:android

# Or use EAS Build
npx eas build --platform android
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### VS Code Settings

The project includes recommended VS Code settings for:

- Auto-fix on save
- Auto-remove unused imports
- Format on save
- TypeScript IntelliSense

---

## 📚 Documentation

### Quick Links

- **📖 [All Documentation](./docs/README.md)** - Complete documentation index
- **🚀 [Development Setup](./DEVELOPMENT_SETUP.md)** - Get started developing
- **🎨 [Design System](./src/theme/DESIGN_GUIDE.md)** - Complete design guide
- **⚙️ [CI/CD Guide](./.github/CI_CD_GUIDE.md)** - Pipeline documentation

### External Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Follow our code quality standards
4. Commit using conventional commits
5. Push to your branch
6. Open a Pull Request

### Code Style Guidelines

- Use TypeScript for all new files
- Follow the existing project structure
- Add comments for complex logic
- Use semantic color tokens from the theme
- Test on both iOS and Android
- Ensure accessibility compliance

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Islamic prayer time calculation algorithms
- Quran API providers
- React Native & Expo community
- All contributors and supporters

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/sabeel/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/sabeel/discussions)
- **Email:** support@sabeel.app

---

**Made with ❤️ for the Muslim Ummah**

_Developed to help Muslims practice their faith with ease and beauty._
