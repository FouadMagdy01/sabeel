/**
 * Themed wrappers for components that need non-style theme props
 * (color, placeholderTextColor, android_ripple, etc.)
 */
import React, { forwardRef } from 'react';
import { ActivityIndicator, Pressable, TextInput, View, type PressableProps } from 'react-native';
import { useUnistyles, withUnistyles } from 'react-native-unistyles';

type ThemeArg = ReturnType<typeof useUnistyles>['theme'];

type UniPressableProps = PressableProps & {
  uniProps?: (theme: ThemeArg) => Partial<PressableProps>;
};

/**
 * UniPressable — Pressable with themed android_ripple.
 * Custom component (not withUnistyles) because Pressable's function-style
 * `style` prop is incompatible with withUnistyles.
 *
 * Default: android_ripple.color = theme.colors.overlay.pressed
 *
 * @example
 * <UniPressable onPress={handlePress}>...</UniPressable>
 * <UniPressable uniProps={(theme) => ({ android_ripple: { color: theme.colors.overlay.ripple } })}>
 */
export const UniPressable = forwardRef<View, UniPressableProps>(
  ({ uniProps, android_ripple, ...rest }, ref) => {
    const { theme } = useUnistyles();

    const resolvedUniProps = uniProps?.(theme);

    // Priority: inline props > uniProps > default
    const finalRipple = android_ripple ??
      resolvedUniProps?.android_ripple ?? { color: theme.colors.overlay.pressed };

    // Extract non-ripple uniProps (if any) and merge
    const { android_ripple: _ripple, ...otherUniProps } = resolvedUniProps ?? {};

    return <Pressable ref={ref} android_ripple={finalRipple} {...otherUniProps} {...rest} />;
  }
);
UniPressable.displayName = 'UniPressable';

/**
 * UniActivityIndicator — ActivityIndicator with themed color
 * Default: color = theme.colors.brand.primary
 *
 * @example
 * <UniActivityIndicator />
 * <UniActivityIndicator uniProps={(theme) => ({ color: theme.colors.text.muted })} />
 */
export const UniActivityIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.colors.brand.primary,
}));

/**
 * UniTextInput — TextInput with themed placeholderTextColor
 * Default: placeholderTextColor = theme.colors.text.muted
 *
 * @example
 * <UniTextInput placeholder="Search..." />
 * <UniTextInput uniProps={(theme) => ({ placeholderTextColor: theme.colors.text.tertiary })} />
 */
export const UniTextInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.colors.text.muted,
}));
