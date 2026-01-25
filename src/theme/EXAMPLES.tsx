/**
 * Theme Usage Examples
 *
 * Copy-paste ready component examples showing how to use theme colors.
 * These are practical, real-world patterns you can use in your app.
 */

import { Pressable, Text, TextInput, View } from 'react-native';
import type { ThemeColors } from './types';

// Mock hook - replace with your actual theme hook
const useTheme = () => ({
  colors: {} as ThemeColors,
});

// ============================================================================
// BUTTONS
// ============================================================================

export function PrimaryButton({ onPress, children }: any) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={{
        backgroundColor: colors.brand.primary, // ← Button background
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
      }}
      onPress={onPress}
    >
      <Text style={{ color: colors.text.inverse, fontSize: 16, fontWeight: '600' }}>
        {children}
      </Text>
    </Pressable>
  );
}

export function SecondaryButton({ onPress, children }: any) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={{
        backgroundColor: colors.brand.secondary, // ← Secondary button
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
      }}
      onPress={onPress}
    >
      <Text style={{ color: colors.text.inverse, fontSize: 16, fontWeight: '600' }}>
        {children}
      </Text>
    </Pressable>
  );
}

export function OutlineButton({ onPress, children }: any) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={{
        backgroundColor: 'transparent',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border.default, // ← Border
        alignItems: 'center',
      }}
      onPress={onPress}
    >
      <Text style={{ color: colors.text.primary, fontSize: 16, fontWeight: '600' }}>
        {children}
      </Text>
    </Pressable>
  );
}

// ============================================================================
// INPUTS
// ============================================================================

export function StandardInput({ label, value, onChangeText, placeholder }: any) {
  const { colors } = useTheme();

  return (
    <View style={{ marginBottom: 16 }}>
      {/* Label */}
      <Text style={{ color: colors.text.secondary, fontSize: 14, marginBottom: 8 }}>{label}</Text>

      {/* Input */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted} // ← Placeholder
        style={{
          backgroundColor: colors.background.input, // ← Input background
          borderWidth: 1,
          borderColor: colors.border.default, // ← Border
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 16,
          fontSize: 16,
          color: colors.text.primary, // ← User's input text
        }}
      />
    </View>
  );
}

export function ErrorInput({ label, value, onChangeText, errorMessage }: any) {
  const { colors } = useTheme();

  return (
    <View style={{ marginBottom: 16 }}>
      {/* Label */}
      <Text style={{ color: colors.text.secondary, fontSize: 14, marginBottom: 8 }}>{label}</Text>

      {/* Input with error */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={{
          backgroundColor: colors.state.errorBg, // ← Error background
          borderWidth: 1,
          borderColor: colors.border.error, // ← Error border
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 16,
          fontSize: 16,
          color: colors.text.primary,
        }}
      />

      {/* Error message */}
      <Text style={{ color: colors.state.error, fontSize: 12, marginTop: 4 }}>{errorMessage}</Text>
    </View>
  );
}

// ============================================================================
// CARDS
// ============================================================================

export function StandardCard({ title, description, metadata }: any) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.background.surface, // ← Card background
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        // Optional border
        borderWidth: 1,
        borderColor: colors.border.subtle,
      }}
    >
      {/* Title */}
      <Text
        style={{ color: colors.text.primary, fontSize: 18, fontWeight: '600', marginBottom: 4 }}
      >
        {title}
      </Text>

      {/* Description */}
      <Text style={{ color: colors.text.secondary, fontSize: 14, marginBottom: 8 }}>
        {description}
      </Text>

      {/* Metadata */}
      <Text style={{ color: colors.text.tertiary, fontSize: 12 }}>{metadata}</Text>
    </View>
  );
}

// ============================================================================
// SCREENS
// ============================================================================

export function StandardScreen({ children }: any) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background.app, // ← Screen background
      }}
    >
      {children}
    </View>
  );
}

// ============================================================================
// ALERTS & MESSAGES
// ============================================================================

export function SuccessMessage({ message }: any) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.state.successBg, // ← Success background
        borderLeftWidth: 4,
        borderLeftColor: colors.state.success, // ← Success accent
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
      }}
    >
      <Text style={{ color: colors.state.success, fontSize: 14 }}>{message}</Text>
    </View>
  );
}

export function ErrorMessage({ message }: any) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.state.errorBg, // ← Error background
        borderLeftWidth: 4,
        borderLeftColor: colors.state.error, // ← Error accent
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
      }}
    >
      <Text style={{ color: colors.state.error, fontSize: 14 }}>{message}</Text>
    </View>
  );
}

export function WarningMessage({ message }: any) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.state.warningBg,
        borderLeftWidth: 4,
        borderLeftColor: colors.state.warning,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
      }}
    >
      <Text style={{ color: colors.state.warning, fontSize: 14 }}>{message}</Text>
    </View>
  );
}

// ============================================================================
// ISLAMIC COMPONENTS
// ============================================================================

export function ActivePrayerCard({ name, time }: any) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.islamic.prayerActive, // ← Active prayer
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <Text style={{ color: colors.text.inverse, fontSize: 20, fontWeight: '600' }}>{name}</Text>
      <Text style={{ color: colors.text.inverse, fontSize: 16, marginTop: 4 }}>{time}</Text>
      <Text style={{ color: colors.text.inverse, fontSize: 12, marginTop: 4, opacity: 0.8 }}>
        Current Prayer
      </Text>
    </View>
  );
}

export function UpcomingPrayerCard({ name, time }: any) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.background.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: colors.islamic.prayerUpcoming, // ← Upcoming accent
      }}
    >
      <Text style={{ color: colors.text.primary, fontSize: 18, fontWeight: '600' }}>{name}</Text>
      <Text style={{ color: colors.islamic.prayerUpcoming, fontSize: 16, marginTop: 4 }}>
        {time}
      </Text>
      <Text style={{ color: colors.text.tertiary, fontSize: 12, marginTop: 4 }}>Next Prayer</Text>
    </View>
  );
}

export function PassedPrayerCard({ name, time }: any) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.background.section,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <Text style={{ color: colors.text.muted, fontSize: 18, fontWeight: '600' }}>{name}</Text>
      <Text style={{ color: colors.islamic.prayerPassed, fontSize: 16, marginTop: 4 }}>{time}</Text>
    </View>
  );
}

export function QuranVerseCard({ arabicText, verseNumber, isHighlighted }: any) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.islamic.quranBackground, // ← Quran background
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
        // Highlight background if selected
        ...(isHighlighted && {
          backgroundColor: colors.islamic.verseHighlight,
        }),
      }}
    >
      {/* Arabic text */}
      <Text
        style={{
          color: colors.islamic.quranText, // ← Quran text
          fontSize: 24,
          textAlign: 'right',
          lineHeight: 40,
        }}
      >
        {arabicText}
      </Text>

      {/* Verse number badge */}
      <View
        style={{
          backgroundColor: colors.islamic.verseNumber, // ← Verse number
          alignSelf: 'flex-end',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
          marginTop: 12,
        }}
      >
        <Text style={{ color: colors.text.inverse, fontSize: 12 }}>{verseNumber}</Text>
      </View>
    </View>
  );
}

export function TasbihCounter({ count, targetCount }: any) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.islamic.tasbihBackground, // ← Tasbih background
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
      }}
    >
      {/* Count */}
      <Text
        style={{
          color: colors.islamic.tasbihText, // ← Counter text
          fontSize: 64,
          fontWeight: 'bold',
        }}
      >
        {count}
      </Text>

      {/* Target */}
      <Text style={{ color: colors.text.secondary, fontSize: 16, marginTop: 8 }}>
        of {targetCount}
      </Text>
    </View>
  );
}

// ============================================================================
// LISTS
// ============================================================================

export function ListItem({ title, subtitle, icon, onPress }: any) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={{
        backgroundColor: colors.background.surface,
        paddingVertical: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.component.divider, // ← Divider
      }}
      onPress={onPress}
    >
      {/* Icon */}
      {icon && (
        <View style={{ marginRight: 12 }}>
          <Text style={{ color: colors.icon.secondary, fontSize: 24 }}>{icon}</Text>
        </View>
      )}

      {/* Content */}
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text.primary, fontSize: 16, fontWeight: '500' }}>{title}</Text>
        {subtitle && (
          <Text style={{ color: colors.text.secondary, fontSize: 14, marginTop: 2 }}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Chevron */}
      <Text style={{ color: colors.icon.tertiary, fontSize: 18 }}>›</Text>
    </Pressable>
  );
}

// ============================================================================
// BADGES
// ============================================================================

export function NotificationBadge({ count }: any) {
  const { colors } = useTheme();

  if (count === 0) return null;

  return (
    <View
      style={{
        backgroundColor: colors.component.badgeBackground, // ← Badge background
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        paddingHorizontal: 6,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: colors.component.badgeText, // ← Badge text
          fontSize: 12,
          fontWeight: 'bold',
        }}
      >
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
}

export function CategoryChip({ label, onPress }: any) {
  const { colors } = useTheme();

  return (
    <Pressable
      style={{
        backgroundColor: colors.component.chipBackground, // ← Chip background
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        marginRight: 8,
      }}
      onPress={onPress}
    >
      <Text style={{ color: colors.component.chipText, fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}
