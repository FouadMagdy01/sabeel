# 🎨 Theme Cheat Sheet

## The 5 Most Common Patterns

### 1️⃣ Button

```tsx
backgroundColor: colors.brand.primary;
color: colors.text.inverse;
```

### 2️⃣ Input

```tsx
backgroundColor: colors.background.input;
borderColor: colors.border.default;
color: colors.text.primary;
placeholderTextColor: colors.text.muted;
```

### 3️⃣ Card

```tsx
backgroundColor: colors.background.surface;
titleColor: colors.text.primary;
descriptionColor: colors.text.secondary;
```

### 4️⃣ Screen

```tsx
backgroundColor: colors.background.app;
```

### 5️⃣ Text Hierarchy

```tsx
// 1. Most important
colors.text.primary;

// 2. Important
colors.text.secondary;

// 3. Less important
colors.text.tertiary;

// 4. Least important
colors.text.muted;
```

---

## Golden Rules

1. **Text on colored background?** → Use `colors.text.inverse`
2. **Screen background?** → Use `colors.background.app`
3. **Card background?** → Use `colors.background.surface`
4. **Input background?** → Use `colors.background.input`
5. **Placeholder text?** → Use `colors.text.muted`
6. **Focused input?** → Use `colors.border.focus`
7. **Error state?** → Use `colors.state.error` and `colors.state.errorBg`
8. **Icon on button?** → Use `colors.icon.inverse`

---

## Component Patterns

| What are you building? | Use this                              |
| ---------------------- | ------------------------------------- |
| Primary button         | `brand.primary` + `text.inverse`      |
| Secondary button       | `brand.secondary` + `text.inverse`    |
| Input field            | `background.input` + `text.primary`   |
| Card                   | `background.surface` + `text.primary` |
| Screen                 | `background.app`                      |
| Success message        | `state.successBg` + `state.success`   |
| Error message          | `state.errorBg` + `state.error`       |
| Prayer time (active)   | `brand.primary` + `text.inverse`      |
| Quran reader           | `background.section` + `text.primary` |

---

## Quick Examples

### Standard Button

```tsx
<Pressable
  style={{
    backgroundColor: colors.brand.primary,
    padding: 16,
  }}
>
  <Text style={{ color: colors.text.inverse }}>Click Me</Text>
</Pressable>
```

### Text Input

```tsx
<TextInput
  style={{
    backgroundColor: colors.background.input,
    borderColor: colors.border.default,
    color: colors.text.primary,
  }}
  placeholderTextColor={colors.text.muted}
/>
```

### Card

```tsx
<View
  style={{
    backgroundColor: colors.background.surface,
    padding: 16,
  }}
>
  <Text style={{ color: colors.text.primary }}>Title</Text>
  <Text style={{ color: colors.text.secondary }}>Description</Text>
</View>
```

### Screen

```tsx
<View
  style={{
    flex: 1,
    backgroundColor: colors.background.app,
  }}
>
  {/* Your content */}
</View>
```

### Error Input

```tsx
<TextInput
  style={{
    backgroundColor: colors.state.errorBg,
    borderColor: colors.border.error,
  }}
/>
<Text style={{ color: colors.state.error }}>
  This field is required
</Text>
```

---

## Islamic Components

### Prayer Card (Active)

```tsx
<View
  style={{
    backgroundColor: colors.brand.primary,
  }}
>
  <Text style={{ color: colors.text.inverse }}>Dhuhr</Text>
  <Text style={{ color: colors.text.inverse }}>12:30 PM</Text>
</View>
```

### Prayer Card (Upcoming)

```tsx
<View
  style={{
    backgroundColor: colors.background.surface,
    borderLeftColor: colors.text.muted,
    borderLeftWidth: 4,
  }}
>
  <Text style={{ color: colors.text.primary }}>Asr</Text>
  <Text style={{ color: colors.text.muted }}>3:45 PM</Text>
</View>
```

### Quran Verse

```tsx
<View
  style={{
    backgroundColor: colors.background.section,
    padding: 20,
  }}
>
  <Text
    style={{
      color: colors.text.primary,
      fontSize: 24,
      textAlign: 'right',
    }}
  >
    بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
  </Text>
</View>
```

---

**📚 For more details:**

- [QUICK_START.md](./QUICK_START.md) - Detailed patterns
- [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) - All components
- [README.md](./README.md) - Full documentation
