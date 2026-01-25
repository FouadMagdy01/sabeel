# Theme Quick Start - Simple Patterns

## 🎯 Most Common Use Cases

### Creating a Button

```tsx
import { useTheme } from '@/hooks/useTheme';

function MyButton() {
  const { colors } = useTheme();

  return (
    <Pressable
      style={{
        backgroundColor: colors.brand.primary, // ← Button background
        padding: 16,
        borderRadius: 8,
      }}
    >
      <Text
        style={{
          color: colors.text.inverse, // ← Text on colored button
        }}
      >
        Button Text
      </Text>
    </Pressable>
  );
}
```

**Simple Rule:**

- Button background = `colors.brand.primary` (or `.secondary`)
- Text on button = `colors.text.inverse`

---

### Creating an Input Field

```tsx
function MyInput() {
  const { colors } = useTheme();

  return (
    <View>
      {/* Label above input */}
      <Text style={{ color: colors.text.secondary }}>Email Address</Text>

      <TextInput
        style={{
          backgroundColor: colors.background.input, // ← Input background
          borderColor: colors.border.default, // ← Border
          color: colors.text.primary, // ← What user types
        }}
        placeholderTextColor={colors.text.muted} // ← Placeholder
        placeholder="Enter your email"
      />
    </View>
  );
}
```

**Simple Rule:**

- Input background = `colors.background.input`
- Input text = `colors.text.primary`
- Placeholder = `colors.text.muted`
- Label = `colors.text.secondary`
- Border = `colors.border.default`

---

### Creating a Card

```tsx
function MyCard() {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.background.surface, // ← Card background
        borderRadius: 12,
        padding: 16,
      }}
    >
      {/* Card title */}
      <Text style={{ color: colors.text.primary }}>Title</Text>

      {/* Card description */}
      <Text style={{ color: colors.text.secondary }}>Description</Text>

      {/* Card metadata (time, date, etc) */}
      <Text style={{ color: colors.text.tertiary }}>2 hours ago</Text>
    </View>
  );
}
```

**Simple Rule:**

- Card background = `colors.background.surface`
- Title = `colors.text.primary`
- Description = `colors.text.secondary`
- Metadata = `colors.text.tertiary`

---

### Creating a Screen

```tsx
function MyScreen() {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background.app, // ← Screen background
      }}
    >
      {/* Your content */}
    </View>
  );
}
```

**Simple Rule:**

- Screen background = Always `colors.background.app`

---

## 📋 Quick Reference Table

| Component            | Background            | Text           | Icon             | Border           |
| -------------------- | --------------------- | -------------- | ---------------- | ---------------- |
| **Primary Button**   | `brand.primary`       | `text.inverse` | `icon.inverse`   | -                |
| **Secondary Button** | `brand.secondary`     | `text.inverse` | `icon.inverse`   | -                |
| **Outline Button**   | `transparent`         | `text.primary` | `icon.primary`   | `border.default` |
| **Input Field**      | `background.input`    | `text.primary` | `icon.secondary` | `border.default` |
| **Input (focused)**  | `background.input`    | `text.primary` | `icon.primary`   | `border.focus`   |
| **Input (error)**    | `state.errorBg`       | `text.primary` | `icon.primary`   | `border.error`   |
| **Card**             | `background.surface`  | `text.primary` | `icon.secondary` | `border.subtle`  |
| **Screen**           | `background.app`      | `text.primary` | -                | -                |
| **Modal**            | `background.elevated` | `text.primary` | `icon.primary`   | -                |

---

## 🎨 Text Color Hierarchy

Use this order for text importance:

1. **Most Important** (headings, main content)

   ```tsx
   color: colors.text.primary;
   ```

2. **Important** (subheadings, labels)

   ```tsx
   color: colors.text.secondary;
   ```

3. **Less Important** (metadata, timestamps)

   ```tsx
   color: colors.text.tertiary;
   ```

4. **Least Important** (placeholders, disabled)
   ```tsx
   color: colors.text.muted;
   ```

---

## 🔘 Icon Colors - When to Use What

```tsx
// On white/light backgrounds
color: colors.icon.primary; // Main icons (tab bar, important actions)
color: colors.icon.secondary; // Supporting icons (settings, utilities)

// On colored backgrounds (buttons, colored cards)
color: colors.icon.inverse;

// Disabled/inactive state
color: colors.icon.muted;
```

---

## 🔔 Alert Messages

```tsx
// Success (green)
backgroundColor: colors.state.successBg;
color: colors.state.success;

// Warning (orange/yellow)
backgroundColor: colors.state.warningBg;
color: colors.state.warning;

// Error (red)
backgroundColor: colors.state.errorBg;
color: colors.state.error;

// Info (blue/teal)
backgroundColor: colors.state.infoBg;
color: colors.state.info;
```

---

## 🕌 Islamic Components

### Prayer Time Card

```tsx
// Active prayer (happening now)
backgroundColor: colors.islamic.prayerActive;
textColor: colors.text.inverse;

// Upcoming prayer (next one)
backgroundColor: colors.background.surface;
accentColor: colors.islamic.prayerUpcoming; // Use for text or border

// Passed prayer (already done)
backgroundColor: colors.background.section;
textColor: colors.text.muted;
```

### Quran Reader

```tsx
backgroundColor: colors.islamic.quranBackground;
textColor: colors.islamic.quranText;
verseHighlight: colors.islamic.verseHighlight;
verseNumber: colors.islamic.verseNumber;
```

---

## 💡 Pro Tips

1. **Always use `text.inverse` for text on colored backgrounds**

   ```tsx
   // ✅ Good
   <View style={{ backgroundColor: colors.brand.primary }}>
     <Text style={{ color: colors.text.inverse }}>Text</Text>
   </View>
   ```

2. **Use the component-specific colors when available**

   ```tsx
   // ✅ Better - use component color
   switchTrackOn: colors.component.switchTrackOn;

   // ❌ Avoid - using generic brand color
   switchTrackOn: colors.brand.primary;
   ```

3. **Follow the text hierarchy**
   - Primary text = `text.primary`
   - Supporting text = `text.secondary`
   - Meta info = `text.tertiary`
   - Placeholders = `text.muted`

4. **Screen backgrounds always use `background.app`**

   ```tsx
   <View style={{ flex: 1, backgroundColor: colors.background.app }}>
   ```

5. **Cards use `background.surface`**
   ```tsx
   <View style={{ backgroundColor: colors.background.surface }}>
   ```

---

## 🎯 When in Doubt

**Ask yourself:**

1. **Is it a button?**
   - Background: `brand.primary` or `brand.secondary`
   - Text: `text.inverse`

2. **Is it an input?**
   - Background: `background.input`
   - Text: `text.primary`
   - Placeholder: `text.muted`

3. **Is it a card?**
   - Background: `background.surface`
   - Text: `text.primary` (title), `text.secondary` (description)

4. **Is it a screen?**
   - Background: `background.app`

5. **Is it text on a colored background?**
   - Color: `text.inverse`

6. **Is it an icon on a colored background?**
   - Color: `icon.inverse`

---

## 📚 Need More Help?

- See [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) for detailed component patterns
- See [README.md](./README.md) for complete documentation
- Hover over any color in VS Code to see usage documentation
