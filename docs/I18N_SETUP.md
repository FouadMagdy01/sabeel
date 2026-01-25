# i18n Setup - Internationalization

## ✅ What Was Configured

### 1. **ESLint Rule - No Hardcoded Strings**

Added `react-native/no-raw-text` rule to enforce i18n usage:

```javascript
// eslint.config.js
'react-native/no-raw-text': [
  'error',
  {
    skip: ['Button'], // Components to skip if needed
  },
],
```

### 2. **Translation Files Created**

**English** (`src/i18n/locales/en.json`):

```json
{
  "tabs": {
    "home": "Home",
    "quran": "Quran",
    "prayers": "Prayers",
    "library": "Library",
    "settings": "Settings"
  },
  "screens": {
    "home": {
      "title": "Home",
      "testButton": "Test"
    },
    "quran": {
      "test": "Test",
      "pause": "Pause",
      "playerReady": "Player is ready!",
      "settingUp": "Setting up player..."
    }
  }
}
```

**Arabic** (`src/i18n/locales/ar.json`):

```json
{
  "tabs": {
    "home": "الرئيسية",
    "quran": "القرآن",
    "prayers": "الصلوات",
    "library": "المكتبة",
    "settings": "الإعدادات"
  },
  "screens": {
    "home": {
      "title": "الرئيسية",
      "testButton": "اختبار"
    },
    "quran": {
      "test": "تشغيل",
      "pause": "إيقاف",
      "playerReady": "المشغل جاهز!",
      "settingUp": "جاري إعداد المشغل..."
    }
  }
}
```

## 📝 Usage

### In Components

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <>
      <Text>{t('tabs.home')}</Text>
      <Button title={t('screens.home.testButton')} />
    </>
  );
}
```

### Adding New Translations

1. Add key to both `en.json` and `ar.json`
2. Use the key in your component with `t()`

## ✅ Benefits

- **No hardcoded strings** - All text is translatable
- **Automatic enforcement** - ESLint catches hardcoded strings
- **Multi-language ready** - Easy to add more languages
- **Type-safe** - Can generate types for translation keys

## 🚫 What's Prevented

```tsx
// ❌ This will ERROR
<Text>Hello World</Text>;

// ✅ This is correct
const { t } = useTranslation();
<Text>{t('common.hello')}</Text>;
```

## 📁 File Structure

```
src/
├── i18n/
│   ├── config.ts           # i18n configuration
│   └── locales/
│       ├── en.json        # English translations
│       └── ar.json        # Arabic translations
```
